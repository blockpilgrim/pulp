# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What is Pulp

Pulp is a writing tool that inverts traditional AI-writing workflows. Users write first, then AI helps through three actions:
- **Provoke** — AI inserts provocative questions inline to nudge deeper thinking
- **Polish** — AI cleans up the writer's own words (preserves authorship)
- **Press** — AI composes new prose from the writer's raw thinking (shared authorship)

Fully client-side Next.js app. All writing stored in browser localStorage. Users bring their own Anthropic API key (BYOK).

## Commands

```bash
npm run dev      # Dev server on localhost:3000
npm run build    # Production build
npm start        # Production server
npm run lint     # ESLint
```

No test suite currently exists.

## Tech Stack

Next.js 16 (App Router, Turbopack), TypeScript (strict), React 19, Tailwind CSS v4, TipTap (rich text editor), Vercel AI SDK with Claude Sonnet 4.6, next-themes.

## Architecture

### State Machine

Sessions follow a cyclical flow: `writing → probing → writing` (provoke loop) or `writing → polishing/drafting → polish/draft → writing` (transform loop). Users can always revert to raw text.

### API Routes

- **POST `/api/pulp`** — Provoke endpoint. Takes text + roundNumber, returns JSON `{ fragments, provocations }`. Claude splits text into fragments and inserts provocations inline. Temp 0.7.
- **POST `/api/draft?mode=polish|draft`** — Polish/Press endpoint. Streams text output. Polish temp 0.3, Press temp 0.6.

Both routes accept API key via `x-api-key` header, falling back to `process.env.ANTHROPIC_API_KEY`.

### Key Files

- `app/write/[id]/page.tsx` — Write page orchestrator (state management, API calls, mode switching)
- `components/canvas.tsx` — TipTap editor + toolbar
- `components/draft-view.tsx` — Streaming + editable output display
- `lib/store.ts` — `useSessions`/`useSession` hooks (localStorage persistence with 500ms debounce)
- `lib/prompts.ts` — All AI system/user prompts
- `lib/provocation-extension.ts` — Custom TipTap node extension for inline provocations
- `lib/types.ts` — `Session`, `SessionState`, `DraftMode`, `PulpResponse` types
- `lib/api-key.ts` — API key localStorage helpers
- `lib/api-errors.ts` — Centralized error response mapping
- `app/globals.css` — Design tokens, theme palettes, all component styles

### Component Hierarchy

```
RootLayout (fonts, Providers)
  → ThemeProvider (next-themes)
    → ApiKeyGate (blocks until key set)
      → Home (session list) | WritePage
          → Canvas (TipTap editor) | DraftView (streaming/editable output)
```

### Data & Storage

No database. Sessions stored as JSON array in localStorage (`pulp_sessions`). API key in localStorage (`pulp_api_key`). Migration logic handles legacy `jubel_sessions` format.

### Font System (Three Voices)

- **iA Writer Quattro** — Writing surface + polish output (writer's voice)
- **iA Writer Mono** — UI chrome, buttons, provocations (system voice)
- **Source Serif 4** — Press output only (signals shared authorship)

Fonts loaded via `next/font/local` (Quattro, Mono) and Google Fonts (Serif). WOFF2 files in `/fonts/`.

### TipTap Integration

Custom `ProvocationExtension` renders provocations as React node views (`ProvocationNode`). `extractUserText()` walks doc nodes to get plain text. `buildDocWithProvocations()` interleaves fragments + provocations by `afterFragmentId`. Provocations are ephemeral — not persisted to localStorage.

### Path Alias

`@/*` maps to project root (configured in tsconfig.json).

# Custom Instructions

## 1. Think Before Coding

**Don't assume. Don't hide confusion. Surface tradeoffs.**

Before implementing:
- State your assumptions explicitly. If uncertain, ask.
- If multiple interpretations exist, present them - don't pick silently.
- If a simpler approach exists, say so. Push back when warranted.
- If something is unclear, stop. Name what's confusing. Ask.

## 2. Simplicity First

**Minimum code that solves the problem. Nothing speculative.**

- No features beyond what was asked.
- No abstractions for single-use code.
- No "flexibility" or "configurability" that wasn't requested.
- No error handling for impossible scenarios.
- If you write 200 lines and it could be 50, rewrite it.

Ask yourself: "Would a senior engineer say this is overcomplicated?" If yes, simplify.

## 3. Surgical Changes

**Touch only what you must. Clean up only your own mess.**

When editing existing code:
- Don't "improve" adjacent code, comments, or formatting.
- Don't refactor things that aren't broken.
- Match existing style, even if you'd do it differently.
- If you notice unrelated dead code, mention it - don't delete it.

When your changes create orphans:
- Remove imports/variables/functions that YOUR changes made unused.
- Don't remove pre-existing dead code unless asked.

The test: Every changed line should trace directly to the user's request.

## 4. Goal-Driven Execution

**Define success criteria. Loop until verified.**

Transform tasks into verifiable goals:
- "Add validation" → "Write tests for invalid inputs, then make them pass"
- "Fix the bug" → "Write a test that reproduces it, then make it pass"
- "Refactor X" → "Ensure tests pass before and after"

For multi-step tasks, state a brief plan:
```
1. [Step] → verify: [check]
2. [Step] → verify: [check]
3. [Step] → verify: [check]
```

Strong success criteria let you loop independently. Weak criteria ("make it work") require constant clarification.

---

**These guidelines are working if:** fewer unnecessary changes in diffs, fewer rewrites due to overcomplication, and clarifying questions come before implementation rather than after mistakes.
