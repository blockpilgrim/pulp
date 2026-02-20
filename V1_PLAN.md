# Pulp V1 — Production-Ready Implementation Plan

> **Directive for AI agent workflows.** This document is the single source of truth for what V1 is, what it isn't, and how to build it.

---

## Guiding Principles

1. **Human writes first.** The entire product exists to protect and elevate the writer's own thinking.
2. **Zero server state.** No user data — not sessions, not text, not API keys — ever touches our infrastructure beyond the transient moment of an API proxy call.
3. **BYOK (Bring Your Own Key).** No accounts, no signup, no paywall. Paste your Anthropic API key and start writing.
4. **Radical simplicity.** If a feature doesn't directly improve the Write → Pulp → Fill → Press → Edit flow, it doesn't ship in V1.

---

## Current State

The app is **functionally complete** for its core flow. What exists today:

- Full Write → Pulp → Fill → (repeat) → Press → Edit cycle
- Streaming draft generation with real-time display
- Session persistence via localStorage
- Session list on landing page (create, resume, delete)
- Staggered animations for fragment/provocation reveal
- State recovery if the browser closes mid-API-call
- Clean monochrome + burnt orange design system

**What's missing for V1:**
- BYOK — currently relies on a server-side `.env` key
- Export — no way to get the draft out of the app
- Design polish — functional but not yet refined enough for a public launch
- Mobile experience — untested / unrefined
- Landing page — no explanation of what the app does or why
- Error states for missing/invalid API keys
- Hardcoded round count (2) — user should choose when to press

---

## V1 Scope

### In Scope

| Area | What ships |
|---|---|
| **BYOK** | API key input, localStorage storage, client-sends-key-per-request pattern |
| **Core flow** | Optional starting direction, Write → Pulp → Fill → Press → Edit, user control over when to press |
| **Export** | Download draft as `.txt` file, copy-to-clipboard |
| **Design** | Visual polish pass on every screen, typography tightening, mobile responsive |
| **Landing** | Minimal explanation of the product + "Start writing" CTA |
| **Privacy** | API key never persisted on server; all data client-side only |
| **Error handling** | Clear, helpful messages for API failures, invalid keys, rate limits |
| **Deployment** | Static-capable Next.js on Vercel (or equivalent) |

### Out of Scope (V2+)

- User accounts / authentication
- Server-side persistence / database
- Collaborative editing or sharing
- Post-draft AI refinement (inline editing, selection-based rewriting)
- Multiple AI provider support (OpenAI, etc.)
- Custom system prompts or tone settings
- Analytics or telemetry
- Payment / monetization

---

## Implementation Plan

### Phase 1: BYOK Architecture

**Goal:** Remove server-side API key dependency. Users provide their own Anthropic key, which is stored locally and sent with each request.

#### 1.1 API Key Input UI

- Build an `ApiKeyGate` component that appears when no key is stored in localStorage
- Minimal UI: a single input field with brief instructional copy on where to get a key (link to Anthropic console)
- "Save key" action stores to localStorage under a dedicated key (e.g. `pulp_api_key`)
- Key is validated with a lightweight API call before being accepted (e.g. a minimal `messages` call, or just attempt the first Pulp and handle failure gracefully)
- Once saved, the gate disappears and the user proceeds to the normal app
- A small "API key" or settings affordance somewhere unobtrusive (e.g. landing page footer) lets users change/remove their key

#### 1.2 Client → Server Key Passing

- Modify both API routes (`/api/explode`, `/api/draft`) to accept the API key from the request body (or an `Authorization` / custom header)
- Remove reliance on `ANTHROPIC_API_KEY` environment variable for production
- API routes instantiate the Anthropic client per-request using the user-provided key — never store, log, or cache it
- Return clear error responses for missing key (401), invalid key (403), and rate-limited key (429)

#### 1.3 Privacy Guarantees

- API routes are pure proxies — request in, response out, nothing persisted
- No logging of request bodies in production (strip `text` and key from any error logs)
- Add a visible privacy statement on the landing page: "Your writing and API key never leave your browser, except to talk directly to Anthropic's API through our proxy."

---

### Phase 2: Core Flow Polish

**Goal:** Tighten the writing experience. Every interaction should feel intentional and smooth.

#### 2.1 Optional Starting Direction

The default "Start writing" flow drops the user onto a blank page — pure freewriting. This is correct and should remain the primary path. But some writers benefit from giving themselves a seed before they begin: a topic, a question, a thing they're trying to figure out.

**The concept:** An optional, user-authored starting direction that primes the writing session. This is NOT an AI-generated prompt. The writer is talking to themselves — "here's what I want to think about."

**Landing page UX:**
- "Start writing" remains the primary CTA and works exactly as today (blank page, immediate)
- Below or beside it, a secondary affordance: a text input or expandable field where the user can optionally type a starting direction before launching the session
- Placeholder copy should invite loose, personal framing — e.g. `"What's on your mind?"` or `"I want to figure out..."` — not formal topic-setting
- If they type something and hit enter / click start, the session is created with that direction attached. If they leave it empty, it's a blank session as before.

**Writing page behavior:**
- If a starting direction exists, display it above the braindump textarea in a subtle, muted treatment — visible as a gentle reminder of intent, not as a heading or constraint
- The braindump placeholder could adapt: instead of the generic "Write freely..." it could reference the direction, e.g. "Start writing about this..." — or it may be better to keep the placeholder generic and let the direction speak for itself. Test both.
- The direction is the writer's own words — never edited or enhanced by the app

**Data model:**
- Add an optional `direction` field to the `Session` type (string, default empty)
- Store it at session creation time

**AI integration:**
- Include the direction as context in both Pulp and Press prompts when present
- For Pulp: helps the AI understand what the writer is trying to explore, so provocations can be more pointed
- For Press: gives the AI a sense of the writer's intended scope/angle, which improves draft coherence
- When absent, prompts behave exactly as they do today — no change to the no-direction flow

**What this is NOT:**
- Not an AI prompt generator ("give me something to write about")
- Not a title — the direction is informal, possibly a question, possibly a fragment of intent
- Not required — the blank-page freewriting path must remain first-class and frictionless

#### 2.2 User-Controlled Round Progression

- Remove hardcoded `maxRounds: 2` as the sole determinant of when "Press" appears
- After every Pulp/Fill cycle, present **both** options: "Pulp again" and "Press" — let the writer decide when their thinking is rich enough
- Keep a round counter visible for orientation (e.g. "round 2") but don't enforce a cap
- Consider a soft nudge after 3+ rounds (e.g., the "Press" button becomes slightly more prominent) but never force it

#### 2.3 Braindump Improvements

- Persist braindump text to localStorage on every keystroke (already partially done, tighten debounce)
- Add a word/character count — small, unobtrusive, in the muted style, so the writer has a sense of volume without pressure
- Ensure placeholder text disappears cleanly and doesn't flash on reload

#### 2.4 Draft Experience

- After streaming completes, add a clear visual transition from "streaming" to "editable" mode — the writer should know they can now edit
- Add a "Copy to clipboard" button alongside the draft
- Add a "Download as .txt" button (see Phase 3)
- If the user edits the draft, auto-save changes to localStorage (already works, verify)

#### 2.5 Session Management

- Add a confirmation dialog before deleting a session (currently instant-deletes)
- Session titles: auto-generate from first meaningful sentence, but allow the user to rename by clicking the title on the session list
- Show session state more clearly on the landing page (e.g., "3 rounds deep" or "draft ready")

#### 2.6 "Start Over" Safety

- If a user navigates back from a deep session state (mid-fill, mid-draft), they should be able to resume exactly where they left off — verify this works reliably
- No "start over" action that nukes a session — if they want a fresh start, they create a new session

---

### Phase 3: Export

**Goal:** Simple, zero-friction ways to get the draft out.

#### 3.1 Plain Text Download

- "Download" button in the draft view triggers a browser download of the draft content as a `.txt` file
- Filename: sanitized session title + date, e.g. `the-thing-about-failure-2025-02-20.txt`
- No formatting, no metadata — just the raw text

#### 3.2 Copy to Clipboard

- "Copy" button next to the draft
- Brief visual confirmation (button text changes to "Copied" for 2 seconds, then reverts)
- Copies plain text only

#### 3.3 Export Placement

- Both actions live in a small action bar above or below the draft textarea
- Unobtrusive — the draft text remains the visual focus

---

### Phase 4: Design Refinement

**Goal:** Elevate the visual design from "functional prototype" to "this feels like a product someone cared about." The design should feel calm, literary, and confident — like a beautiful notebook, not a SaaS dashboard.

#### 4.1 Typography

- Audit the current font stack. The app uses Source Serif 4 (loaded via Google Fonts) but the CSS falls back to Georgia. Ensure Source Serif is actually being applied everywhere it should be — braindump, fragments, responses, draft.
- Tighten font size and line-height relationships. Currently sizes range from 0.875rem to 1.125rem across contexts — ensure this hierarchy feels intentional, not arbitrary.
- Ensure the mono font (Geist Mono) is only used for UI chrome (buttons, labels, status indicators) and provocations — never for user content.

#### 4.2 Spacing & Layout

- Audit vertical rhythm across all states. The jump between phases (braindump → explosion → draft) should feel like a smooth progression, not jarring reloads.
- Ensure the max-width container (currently `max-w-2xl` = 42rem) provides a comfortable reading line length on all screen sizes. Consider bumping to `max-w-xl` (36rem) for a tighter, more book-like column.
- Review padding/margin consistency — currently a mix of `pt-12`, `pb-16`, `mb-8`, etc. Establish a spacing scale and apply it consistently.

#### 4.3 Interaction States

- Buttons: add subtle hover/active states. Current hover is just opacity reduction — consider a slightly more tactile feel.
- Textareas: the dashed-border response areas work, but ensure focus states are clear and consistent.
- Transitions between app states (braindump → loading → explosion) should feel seamless. Audit for any flashes of empty content or layout jumps.

#### 4.4 Loading States

- The current loading animation (3 pulsing dots) is fine. Ensure the loading message is contextually accurate ("pulping..." vs "pressing...").
- Consider a very subtle progress indication for longer operations — not a progress bar, but perhaps the dots animate at a different pace or the message subtly evolves.

#### 4.5 Mobile

- Test and refine the full flow on mobile viewports (375px, 390px, 428px).
- Ensure textareas are comfortable to type in on mobile (adequate size, no accidental dismissal).
- Button tap targets should be at least 44px.
- The provocation response areas need to be easy to tap into and type on a phone keyboard.

#### 4.6 Dark Mode

- Not required for V1 launch, but structure CSS variables (already in place) so dark mode is trivial to add later.
- If time permits, implement it — the monochrome palette makes this straightforward.

#### 4.7 Favicon & Metadata

- Replace the default Next.js favicon with something intentional (even a simple typographic "P" or a minimal mark).
- Ensure OpenGraph metadata is set for when links are shared: title, description, and optionally a simple OG image.

---

### Phase 5: Landing Page

**Goal:** A first-time visitor should understand what Pulp does in 10 seconds, feel intrigued, and be able to start writing in under 30 seconds.

#### 5.1 Structure

The landing page is NOT a marketing site. It's a brief, confident introduction followed by the action.

- **Headline/tagline**: Something that communicates the inversion. Current: "You write raw. AI does the rest." — evaluate if this is clear enough for someone with zero context.
- **One-liner explanation**: 1-2 sentences max. What happens when you use this. E.g.: "Write your raw thoughts. AI breaks them apart, asks the right questions, and presses your thinking into a polished draft."
- **"Start writing" CTA**: Prominent, immediate.
- **How it works (optional)**: A very brief (3-step) visual or textual explanation of the Write → Pulp → Press flow. Only if it doesn't add clutter. Could be a single line: `write raw → pulp your thinking → press into prose`
- **Previous sessions**: Below the fold for returning users. Current implementation is fine — refine styling.

#### 5.2 Tone

- Confident, not salesy. No "revolutionary" or "game-changing."
- Brief. The landing page should feel as minimal as the writing interface itself.
- The product's quality speaks through use, not through landing page copy.

---

### Phase 6: Error Handling & Edge Cases

**Goal:** The app should never leave the user stranded or confused.

#### 6.1 API Key Errors

- **No key stored**: Show the API key gate (Phase 1.1)
- **Invalid key**: Clear message on the key input: "This key doesn't seem to work. Check that it's a valid Anthropic API key."
- **Key works initially but fails later** (revoked, billing issue): Show error inline in the writing flow with option to update the key
- **Rate limited**: "Anthropic's rate limit hit. Wait a moment and try again." — don't let the user think the app is broken

#### 6.2 AI Response Errors

- **Malformed JSON from explode**: Already handled — ensure the error message is user-friendly, not a raw JSON parse error
- **Streaming interruption during draft**: Save whatever was streamed so far, let the user keep it, show option to retry
- **Timeout**: "This is taking longer than expected. You can wait or try again."

#### 6.3 Browser / Client Errors

- **localStorage full**: Detect and warn. Suggest exporting and deleting old sessions.
- **localStorage unavailable** (private browsing in some browsers): Detect on load. Show a clear message: "Pulp needs local storage to save your work. It looks like it's unavailable — try a regular browsing window."
- **Accidental navigation**: Add a `beforeunload` warning if the user is mid-write and tries to close the tab or navigate away

---

### Phase 7: Technical Cleanup

**Goal:** Clean up the codebase so it's maintainable and ready for public deployment.

#### 7.1 Naming Alignment

- Internal code still uses old terminology: `explode`, `explosion`, `ExplodeResponse`, etc. Align with the Pulp vocabulary: `pulp`, `pulped`, `PulpResponse`, etc.
- File names: `explosion-view.tsx` → `pulp-view.tsx`, route path `/api/explode` → `/api/pulp`
- State values: `"exploding"` → `"pulping"`, `"explosion"` → `"pulped"`
- This is a systematic find-and-replace — do it in one pass to avoid partial renames

#### 7.2 Code Quality

- Remove `BUILD_SPEC.md` (outdated) — `CONCEPT.md` and this plan are the canonical docs
- Remove default Next.js public assets (SVGs, etc.) that aren't used
- Clean up the default README — replace with a brief, accurate description
- Ensure TypeScript strict mode catches any loose types
- Run a lint pass, fix any warnings

#### 7.3 Environment & Config

- Remove `.env.local` dependency for production (API key comes from client)
- Keep `.env.local` support for development convenience (if key is present in env, use it as fallback — useful for testing without the BYOK flow)
- Update `.env.example` to reflect the new architecture
- Review `next.config.ts` for any needed production settings (headers, etc.)

#### 7.4 Performance

- Verify no unnecessary re-renders during typing (the `useSession` hook re-reads localStorage on every update — ensure this doesn't cause input lag)
- Lazy-load components that aren't needed on first paint (e.g., `DraftView` doesn't need to load until press)
- Ensure the streaming implementation doesn't accumulate memory on long drafts

---

### Phase 8: Deployment

**Goal:** Ship it.

#### 8.1 Platform

- Deploy on Vercel (natural fit for Next.js)
- No database, no Redis, no external services — just the Next.js app
- The only external dependency at runtime is Anthropic's API (called via user's own key)

#### 8.2 Domain

- Choose and configure a domain (e.g. `pulp.app`, `getpulp.xyz`, `pulpwriter.com` — whatever's available)

#### 8.3 Pre-Launch Checklist

- [ ] BYOK flow works end-to-end (key input → save → write → pulp → press → export)
- [ ] No server-side secrets required for production deployment
- [ ] All API routes are pure proxies (no data persistence, no logging of user content)
- [ ] Export (download + copy) works correctly
- [ ] Mobile flow tested on iOS Safari and Android Chrome
- [ ] Error states tested (bad key, network failure, rate limit, localStorage full)
- [ ] Landing page communicates the product clearly
- [ ] Favicon and OG metadata set
- [ ] Lighthouse score acceptable (performance, accessibility)
- [ ] `console.error` calls in API routes don't leak sensitive data in production
- [ ] localStorage key naming is final (currently `jubel_sessions` — should be `pulp_sessions` with migration)

---

## Implementation Order

This is the recommended sequence for AI agent workflows:

```
Phase 7.1  (Naming alignment — do first so all subsequent work uses correct terms)
    ↓
Phase 1    (BYOK — unlocks the entire app for real users)
    ↓
Phase 2    (Core flow polish — tighten the experience)
    ↓
Phase 3    (Export — users can get their work out)
    ↓
Phase 6    (Error handling — catch all failure modes)
    ↓
Phase 4    (Design refinement — visual polish pass)
    ↓
Phase 5    (Landing page — first impression)
    ↓
Phase 7    (Remaining technical cleanup)
    ↓
Phase 8    (Deploy)
```

Each phase can be executed as a single agent workflow. Phases are sequential — later phases build on earlier ones. Within each phase, sub-tasks can often be parallelized.

---

## What V1 Is Not

V1 is a **sharp, minimal tool** — not a platform. It should feel like a beautiful, opinionated writing instrument that does one thing extremely well. No settings panels with 20 options. No user profiles. No sharing features. No AI model picker.

A writer should be able to go from zero to a polished draft in 15 minutes, then export it and move on with their life. That's V1.
