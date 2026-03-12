# BUILD-STRATEGY.md
## Pulp: BYOK → Subscription Transition

**Scope**: Add authentication, subscription billing, and hosted API proxying. Remove BYOK.
**Context**: Solo developer. Existing Next.js 16 App Router app. Upstash Redis already in use.

---

## What We're Optimizing For

- **Solo dev velocity** — every choice favors managed services over DIY
- **Privacy-first writing** — localStorage sessions stay local; only the billing/usage layer touches a server
- **Fast time-to-revenue** — avoid building what Stripe and Clerk already built
- **Predictable user costs** — flat-rate tiers over usage-based billing
- **Minimum blast radius** — the core writing experience changes as little as possible

**What we're sacrificing:**
- Cross-device session sync (writing stays device-local)
- Granular cost visibility for users (action count, not token count)
- Data ownership flexibility (Clerk owns auth state)
- Cost variance absorption is on us (a long Press costs more than a short one, but both count as 1 action)

---

## Tech Stack

### Auth — Clerk

**Why Clerk, not Auth.js or Supabase Auth:**
Clerk has native App Router support (`await auth()` in Server Components, Server Actions, Route Handlers, and middleware). The pre-built sign-in/sign-up UI alone saves 40+ hours. At 10,000 MAUs free, we won't pay until we have real revenue. The Clerk → Stripe metadata pattern for linking users to customers is well-documented and widely used.

**When to reconsider:** If EU data residency becomes a requirement, or if we grow to a scale where per-MAU pricing matters.

### Billing — Stripe (Checkout + Customer Portal)

**Why Stripe Checkout, not Elements or a custom payment form:**
Checkout handles 3DS, SCA, tax, promo codes, and localization out of the box. No custom payment UI to maintain. Stripe Customer Portal handles cancellation, plan switching, and payment method updates — we never build our own plan management UI.

**Why flat-rate tiers, not metered billing:**
True usage-based billing (Stripe Meters) means we pay Anthropic upfront and collect from users later. It creates cash flow risk, complex reconciliation, and disputes over usage. Flat-rate with a pre-allocated action budget is simpler, more predictable for users, and we collect before we pay.

### Database — Supabase (PostgreSQL via Drizzle ORM)

**Why Supabase over Neon:**
Both are serverless Postgres. Supabase's free tier is generous and the platform bundles Storage and Realtime that may be useful later (cross-device sync, real-time co-editing). Neon had notable reliability incidents in 2025. The bundled auth becomes less valuable since we're using Clerk, but the platform as a whole is worth it. Neon remains a reasonable alternative if you prioritize database-only simplicity.

We use Drizzle ORM because it's TypeScript-first, lightweight, and works cleanly in the Edge Runtime. Prisma's connection pooling has historically created friction with Vercel's serverless environment.

**Why not PlanetScale:** No free tier since 2024.
**Why not Turso:** SQLite at the edge is great for global reads, wrong fit for relational subscription data.

### Rate Limiting — Upstash Redis (already in use)

Already in place for demo rate limiting. We extend it for per-user, per-tier limits using `@upstash/ratelimit` with a sliding window algorithm. Redis is the right tool: it's the fastest gate on the API call path, and atomic operations prevent race conditions.

### AI Proxy — Vercel AI SDK (unchanged)

The existing `streamText` / `generateText` pattern stays. The change is that we use `onFinish` to capture token usage and persist it to the database after each API call. The API routes no longer accept `x-api-key` headers — they read a session from Clerk middleware instead.

---

## Architecture Overview

```
Browser
├── Clerk (auth state, session cookie)
├── localStorage (writing sessions — unchanged, unchanged forever)
└── API Calls
    └── fetch /api/pulp | /api/draft
        ├── Clerk middleware validates session → userId
        ├── Redis: per-user rate limit check (fast gate)
        ├── DB: check subscription status + monthly action count
        ├── Anthropic API call
        └── DB: increment action count (onFinish callback)

External Services
├── Clerk                (auth, user management)
├── Stripe               (billing, subscription lifecycle)
├── Upstash Redis        (rate limiting, fast cache)
├── Neon PostgreSQL      (users, subscriptions, usage)
└── Anthropic            (AI, server-side only)
```

### Request flow for a subscribed user (happy path)

1. Request arrives at `/api/pulp` or `/api/draft`
2. Clerk middleware injects `userId` (or rejects with 401)
3. Upstash Redis sliding window check: within per-minute rate limit?
4. DB query: is subscription `active`? Is `monthly_action_count < tier_limit`?
5. Anthropic API call proxied server-side
6. `onFinish`: DB increment `monthly_action_count` by 1
7. Response streams to client

Steps 3 and 4 are the only new latency. Step 3 (Redis) is ~10ms. Step 4 (DB) is ~20-40ms but can be cached in Redis if needed.

### Webhook flows

**Clerk → DB sync:**
`user.created` → insert into `users`
`user.deleted` → mark user inactive

**Stripe → DB sync:**
`checkout.session.completed` → create/update `subscriptions`, store `stripe_customer_id` on user
`customer.subscription.updated` → update `subscriptions` status and period
`customer.subscription.deleted` → set subscription status to `canceled`
`invoice.payment_failed` → set status to `past_due`, trigger grace period

Webhooks are the source of truth. The success redirect URL does nothing for fulfillment.

---

## Data Architecture

```sql
-- Synced from Clerk (via webhook)
users (
  id              TEXT PRIMARY KEY,   -- Clerk user ID (clk_xxx)
  email           TEXT NOT NULL,
  stripe_customer_id TEXT UNIQUE,
  created_at      TIMESTAMP DEFAULT now()
)

-- Synced from Stripe (via webhook)
subscriptions (
  id              TEXT PRIMARY KEY,   -- Stripe subscription ID (sub_xxx)
  user_id         TEXT REFERENCES users(id),
  status          TEXT NOT NULL,      -- active | past_due | canceled | trialing
  price_id        TEXT NOT NULL,      -- maps to TIER_LIMITS constant
  current_period_start TIMESTAMP NOT NULL,
  current_period_end   TIMESTAMP NOT NULL,
  updated_at      TIMESTAMP DEFAULT now()
)

-- Monthly action budget tracking
monthly_usage (
  user_id         TEXT REFERENCES users(id),
  period          TEXT NOT NULL,      -- '2025-03' (YYYY-MM)
  action_count    INTEGER DEFAULT 0,
  PRIMARY KEY (user_id, period)
)
```

**Key relationship**: A `userId` (Clerk) maps to a `stripe_customer_id` (stored on `users`) which maps to a `subscription`. This chain is established at checkout and maintained by webhooks.

**Monthly reset**: `monthly_usage` uses a `(user_id, period)` composite key. When the period changes, a new row is inserted on first use. No cron job needed.

**Tier limits**: Not stored in the database. They're a constant in code keyed by `price_id`. Tier limits can be updated without a DB migration.

**What doesn't live in the DB**: Subscription status, current plan, and period end live in Clerk `publicMetadata` and are read from JWT session claims — zero DB queries for subscription gating. See Key Decision #5.

---

## Key Decisions

### 1. Writing sessions stay in localStorage

**Context:** The app's privacy positioning is "your writing stays in your browser." Sessions are complex TipTap editor state. Migrating to server-side storage adds sync, conflict resolution, and API surface.

**Decision:** Keep sessions in localStorage. Only the auth/usage/subscription layer touches the server.

**Rationale:** The writing experience is unchanged. BYOK removal doesn't require session migration — it only affects who holds the Anthropic API key (us, not the user). Cross-device sync is a separate, future feature if users ask for it.

**Trade-off:** No cross-device sync. A user can't start a session on desktop and continue on mobile. This is an acceptable loss for v1.

### 2. Track AI "actions" not tokens

**Context:** Anthropic charges per token. Token counts vary wildly (a 100-word Polish uses far fewer tokens than a 3000-word Press). We could meter by token for precision, but token counts are opaque to users.

**Decision:** Count API calls (1 action per Provoke, Polish, or Press invocation). Store token counts in the `monthly_usage` row for internal cost modeling only.

**Rationale:** "20 free uses per month" is a sentence a user understands. "50,000 input tokens per month" is not. Flat action counts also make the user-facing UI simple: a counter in the header or settings panel.

**Trade-off:** We absorb variance in cost per action. A pro user who exclusively runs long Press calls on 5,000-word texts costs us more than one who mostly uses Provoke on short passages. Set tier limits conservatively and monitor the P95 cost per action.

### 3. Remove BYOK entirely — no hybrid mode

**Context:** We could keep BYOK as an option while also offering hosted subscriptions. This feels "safer" because it preserves the existing user experience.

**Decision:** Remove BYOK completely. One authentication model.

**Rationale:** A hybrid mode doubles the code surface in every API route. The UX becomes confusing (which mode am I in? why is my limit different?). Existing BYOK users need a clear migration path, not a parallel system. Give advance notice, offer a Pro tier at a price that's competitive with Anthropic's direct pricing.

**Trade-off:** Existing BYOK users — especially power users — may churn if they were running heavy workloads. The mitigation is pricing the Pro tier low enough that switching is a no-brainer vs managing their own API key.

### 4. Webhooks are the billing source of truth

**Context:** Stripe's checkout `success_url` is unreliable for fulfillment (tab closed, network issues). The real event is the webhook.

**Decision:** Provision access in `checkout.session.completed` webhook only. The success page shows a confirmation UI, but access is already granted by the time the user lands there.

**Rationale:** This is the Stripe-recommended pattern. Webhooks are retried, have a signature for verification, and are idempotent when you check for duplicate event IDs.

**Trade-off:** A tiny gap (seconds) can exist between Stripe processing the checkout and your webhook handler updating the DB. Handle with a loading/confirmation state on the success page that polls or waits before redirecting to the app.

### 5. Store subscription status in Clerk metadata, not a DB query

**Context:** Every AI API call needs to verify the user is subscribed and within their action limit. A DB query on every call adds 20-40ms and creates a database dependency in the hot path.

**Decision:** When a Stripe webhook updates subscription state, write it to Clerk `publicMetadata` (status, priceId, periodEnd). Configure Clerk to include `publicMetadata` in session claims. API routes read `auth().sessionClaims.publicMetadata.subscription` — zero database queries.

**Rationale:** Clerk sessions are JWTs. Once the session is established, subscription status is already in the token. The only DB hit per request is the usage counter increment — which we can't avoid. This is simpler than a Redis cache and eliminates the cache invalidation problem: Stripe webhook → Clerk metadata update → next request has updated session claim.

**Trade-off:** Session claims refresh on a short interval (configurable in Clerk, default ~60s). A user who just canceled their subscription gets a brief window of continued access while their session refreshes. This is acceptable — it's the same behavior as any JWT-based system.

**What goes where:**

| Data | Storage |
|---|---|
| Subscription status (active/canceled) | Clerk `publicMetadata` → JWT session claim |
| Current plan tier | Clerk `publicMetadata` → JWT session claim |
| `stripeCustomerId` | Clerk `privateMetadata` |
| Token usage this month | Database only (changes every request) |
| `subscriptionPeriodEnd` | Clerk `publicMetadata` → JWT session claim |

---

## Subscription Tier Design

| Tier | Price | Token Budget | Rough API cost to us |
|---|---|---|---|
| **Free** | $0 | 50K tokens/month (~10 Press sessions) | ~$0.75 |
| **Writer** | $12/month | 500K tokens/month | ~$7.50 → 37% gross margin |
| **Studio** | $29/month | 2M tokens/month | ~$30 (thin, bundle features to justify) |

**Token budget, not action count:** Actions were the original framing, but tokens are more financially precise. 50K tokens ≈ 10 full Press sessions. Users never see "tokens" — surface it as "~10 writing sessions remaining this month."

**Free tier philosophy:** No credit card required. Free tier must be substantial enough to experience the product genuinely — a 10-session free tier is real value. The goal is subscription, not a drip of feature access.

**Key pricing principle:** The free tier costs us ~$0.75/user/month in API calls. At 1,000 free users, that's $750/month. If 5% convert to Writer ($12), that's 50 × $12 = $600 — not yet covering free tier costs. Free tier is a marketing spend; monitor free-to-paid conversion carefully.

**Annual pricing:** Offer annual at ~$99/year ($8.25/month effective). Annual subscribers have dramatically lower churn and improve cash flow. Many solo-dev SaaS tools see 40-60% of subscribers choose annual.

---

## Testing Philosophy

No dedicated test suite exists today. The transition introduces several high-stakes paths that must be verified:

**Must have:**
- Stripe webhook handler tests (use Stripe CLI's `stripe trigger` to fire real events locally)
- Clerk webhook handler tests (user creation syncs to DB correctly)
- Usage gate tests (user at limit gets 429, user under limit gets through)

**Use Stripe's test mode extensively** — test every subscription lifecycle event (create, update, cancel, payment failure, dunning) before going live. The stripe CLI's event trigger system makes this straightforward.

**Skip:**
- Unit tests for pure functions in the billing layer
- Mocked database tests — if you're testing a DB write, test against a real dev DB
- E2E tests for the core writing experience (it didn't change)

**What to monitor in production instead of testing:** Token usage per action (to catch runaway prompts), action counts per user per day (to catch abuse), webhook delivery success rate (Stripe Dashboard shows failures).

---

## Performance Considerations

**API call latency budget:**
- Current (BYOK): ~0ms overhead (key passed through)
- After transition: ~50–80ms overhead per call (Redis: ~10ms + DB: ~20-40ms + Clerk session verify: ~0ms, done at middleware)
- Anthropic API calls are 1-10 seconds. An 80ms overhead is imperceptible.

**Database scaling:**
- `monthly_usage` table gets 1 write per API call. At 10,000 MAUs each making 10 calls/month: 100,000 writes/month. Neon handles this trivially.
- Index `monthly_usage` on `(user_id, period)` — already the primary key.

**Redis cache strategy:**
- `sub:{userId}` — subscription status + tier (TTL 1h, invalidated on cancel)
- Extend existing demo rate limiting to per-user limits with `ratelimit.limit(userId)` instead of `ratelimit.limit(ip)`

**Cold starts:**
- Neon's HTTP driver works in the Edge Runtime and has no connection pool overhead. Use it for the `/api/pulp` and `/api/draft` routes.
- Avoid Node.js-only DB connections in these routes.

---

## Implementation Sequence

Phase 1 — Auth foundation (no billing yet)
1. Clerk installation + middleware
2. Protect write routes (require sign-in)
3. Clerk + Neon user sync via webhook
4. Remove BYOK code paths from API routes

Phase 2 — Billing layer
5. Stripe products + prices configuration
6. Checkout flow (pricing page → Stripe Checkout → success)
7. Customer Portal integration
8. Stripe webhook handler (subscription lifecycle → DB)
9. Usage tracking (action counter in DB + Redis cache)

Phase 3 — Gate and UI
10. Usage gate in `/api/pulp` and `/api/draft`
11. Free tier enforcement
12. Usage display in the app (actions remaining)
13. Upgrade prompts when limit is hit

This sequence means auth works before billing, and billing works before usage enforcement. Each phase is independently deployable and testable.
