# IMPLEMENTATION-PLAN.md

Sequenced implementation tasks for the BYOK → Auth + Subscription transition.
Derived from `BUILD-STRATEGY.md`. Each task is sized for a single `/implement` session.

See `BUILD-STRATEGY.md` for rationale behind each decision.

---

## Phase 1 — Auth Foundation

Get authentication working end-to-end before touching billing. Each step is independently deployable.

- [ ] 1.1 — Install and configure Clerk (middleware, env vars, provider wrapping)
- [ ] 1.2 — Protect write routes: require sign-in to access `/write/[id]` and API routes
- [ ] 1.3 — Clerk → Neon user sync via webhook (`user.created`, `user.deleted`)
- [ ] 1.4 — Remove BYOK: strip `x-api-key` header support and `ApiKeyGate` from all routes and UI

---

## Phase 2 — Billing Layer

Build the billing infrastructure before enforcing limits. Each step assumes Phase 1 is complete.

- [ ] 2.1 — Create Stripe products and prices (Free, Writer $12/mo, Studio $29/mo + annual variants)
- [ ] 2.2 — Pricing page + Stripe Checkout flow (pricing page → Checkout → success redirect)
- [ ] 2.3 — Stripe Customer Portal integration (plan switching, cancellation, payment method updates)
- [ ] 2.4 — Stripe webhook handler: subscription lifecycle events → DB + Clerk `publicMetadata`
- [ ] 2.5 — Usage tracking: action counter in `monthly_usage` table + Redis cache layer

---

## Phase 3 — Gate and UI

Enforce limits and surface them to users. Assumes Phase 2 is complete and webhooks are verified.

- [ ] 3.1 — Usage gate in `/api/pulp` and `/api/draft`: check subscription status + action count
- [ ] 3.2 — Free tier enforcement: 50K token budget, appropriate 402/429 responses
- [ ] 3.3 — Usage display: show actions/tokens remaining in the app UI
- [ ] 3.4 — Upgrade prompts: surface when limit is hit, link to pricing page

---

## Notes

- **Testing priority** (from BUILD-STRATEGY.md): Stripe webhook handler (2.4), Clerk webhook handler (1.3), usage gate (3.1). Use `stripe trigger` CLI for webhook testing.
- **Deployment**: Each phase is independently deployable. Phase 1 can ship without billing; Phase 2 can ship without enforcement.
- **BYOK migration**: Give existing users advance notice before 1.4 ships. See BUILD-STRATEGY.md § Key Decision #3.
