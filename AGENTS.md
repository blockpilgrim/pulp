# AGENTS.md

This file provides guidance to Codex (Codex.ai/code) when working with code in this repository.

## Session Startup Protocol

At the beginning of each session:
1. Read `docs/CONCEPT.md` — product vision and design philosophy
2. Read `CONVENTIONS.md` — coding patterns and standards
3. Check memory for in-progress work; if resuming a task, read linked memory files for prior session context
4. Signal readiness: "⏱️ So much time and so little to do. Wait. Strike that. Reverse it."

## Commands

```bash
npm run dev          # Start dev server (Next.js + Turbopack)
npm run build        # Production build
npm run lint         # ESLint (eslint-config-next + TypeScript rules)
npm test             # Run tests (Vitest)
npm run test:watch   # Run tests in watch mode
npm run test:coverage # Run tests with V8 coverage
npm start            # Serve production build
```

Tests use **Vitest** with `@/*` path aliases resolved via `resolve.tsconfigPaths`. Test files live next to source as `*.test.ts`. Coverage targets `lib/` and `app/api/`.

## What This Is

Pulp is a writing tool where humans write first and AI assists after. Writers braindump raw text, then:
- **Provoke** — AI inserts terse provocations inline (`failure?`, `who specifically?`)
- **Refine** — AI cleans up the writer's words without replacing them
- **Press** — AI transforms the writer's raw material into more realized prose
  - **Soft Press** — stays close to the writer's words (~80/20 writer/AI)
  - **Deep Press** — full creative partnership, AI composes new prose from the writer's ideas

Local-first: all writing sessions live in browser localStorage. No database.

## Architecture

**Next.js 16 App Router** with React 19, TypeScript strict mode, Tailwind CSS v4.

**Almost entirely client-side.** Every file except `app/layout.tsx` has `"use client"`. The layout is the only Server Component.

**State flows top-down from the write page.** `app/write/[id]/page.tsx` is the orchestrator — it owns all session state and passes callbacks to `Canvas` (TipTap editor) and `DraftView` (Refine/Press output). State management is `useState`/`useCallback` only, no external store library.

**Session state machine** (`lib/types.ts`): `writing → provoking → writing` (provoke loop) or `writing → refining/pressing → refine/press → writing` (transform loop).

**Two API routes:**
- `/api/pulp` — POST, returns JSON (provocation fragments). Non-streaming.
- `/api/draft` — POST, streams prose (Refine/Press). Uses raw `Response(stream)`, not `NextResponse`.

Both accept API key via `x-api-key` header, fall back to `process.env.ANTHROPIC_API_KEY`. Demo mode checks Redis rate limits. All errors go through `errorResponse()` from `lib/api-errors.ts`.

**Custom TipTap extension** (`lib/provocation-extension.ts`): Provocations render as ephemeral React node views inside the editor. `buildDocWithProvocations()` interleaves fragments with provocation blocks; `extractUserText()` strips them out.

**Share via URL** (`lib/share.ts`): LZ-string compresses the full text into the URL fragment. No server round-trip.

**Auth** (Clerk): Currently disabled in `middleware.ts`. `ClerkProvider` is in `layout.tsx` but Clerk env vars are optional for now.

## Key Conventions

Full conventions are in `CONVENTIONS.md`. The critical ones:

- **`type` only, never `interface`**
- **Inline props typing** — type props in the destructured parameter, not as a separate `Props` type
- **`@/*` path alias** for all imports (no relative `../`). Order: framework → `@/lib/*` → `@/components/*`
- **kebab-case files**, PascalCase named exports, `export default` only on pages
- **Domain types in `lib/types.ts`** — single source of truth for shared types
- **SSR guard** — any browser API access must check `typeof window === "undefined"` first
- **No barrel files** — import directly from the module path
- **Store hooks** (`lib/store.ts`): `useSessions()` for list+CRUD, `useSession(id)` for single session. Always check `loaded` before rendering.

## Styling

**Tailwind v4 — no config file.** Everything in `app/globals.css` via `@theme`/`@theme inline` directives.

**Three-font authorship rule (load-bearing, not cosmetic):**
- `font-sans` (iA Writer Quattro) — writer's voice: canvas, Refine output, Soft Press output
- `font-mono` (iA Writer Mono) — system/UI: buttons, labels, provocations, all chrome
- `font-serif` (Source Serif 4) — Deep Press output only, signals shared authorship

**Use existing CSS component classes** (`.btn-primary`, `.btn-ghost`, `.icon-btn`, `.link-subtle`, etc.) from `globals.css`. Don't reinvent them with Tailwind utilities.

**Dark mode:** `next-themes` with `attribute="data-theme"`. CSS selector is `[data-theme="dark"]`, not `.dark`.

## Env Vars

See `.env.example`. For basic development only `ANTHROPIC_API_KEY` is needed (or users provide their own via BYOK). Upstash Redis vars are needed for demo mode rate limiting. Clerk vars are optional while auth is disabled.

## Principles

1. **Think before coding.** State assumptions. Surface tradeoffs. Ask when unclear.
2. **Simplicity first.** Minimum code that solves the problem. No speculative abstractions.
3. **Surgical changes.** Touch only what you must. Match existing style. Don't "improve" adjacent code.
