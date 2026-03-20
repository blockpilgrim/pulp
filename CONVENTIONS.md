# CONVENTIONS.md

*Bootstrapped from existing codebase on 2026-03-12. Maintained by each /implement session.*

---

## File Structure & Naming

**Directory layout:**
```
app/                      # Next.js App Router pages and API routes
  api/
    pulp/route.ts         # POST — provoke endpoint
    draft/route.ts        # POST — refine/press streaming endpoint
    demo-status/route.ts  # GET — demo rate limit status
  write/[id]/page.tsx     # Dynamic write session page
  share/page.tsx          # Share view page
  layout.tsx              # Root layout (fonts, ClerkProvider, Providers wrapper)
  page.tsx                # Home page
  globals.css             # All CSS: tokens, components, animations
middleware.ts             # Clerk middleware — runs on all routes, protects auth-required paths
components/               # Shared React components
lib/                      # Non-component logic: hooks, types, utilities
  *.test.ts               # Colocated test files (e.g. utils.test.ts next to utils.ts)
fonts/                    # WOFF2 font files (self-hosted iA Writer fonts)
docs/                     # Design docs, product docs, specs
```

**File naming:** kebab-case for all files — components (`draft-view.tsx`, `api-key-gate.tsx`), lib files (`api-errors.ts`, `rate-limit.ts`), and API route segments (`demo-status/route.ts`).

**No barrel files.** There are no `index.ts` files. Import directly from the module path.

**Component export names:** PascalCase named exports matching the component role (`export function DraftView`, `export function ApiKeyGate`). Page components use `export default function` with PascalCase. All other exports are named.

---

## TypeScript

**Strict mode is on** (`"strict": true` in `tsconfig.json`). No overrides anywhere.

**`type` only — no `interface`.** Every type definition in the codebase uses `type`, including object shapes. No `interface` keyword appears anywhere.

**Domain types live in `lib/types.ts`.** This is the single source of truth for types shared across files (`Session`, `SessionState`, `DraftMode`, `PulpResponse`). Do not duplicate these elsewhere.

**Local/inline props typing.** Props are typed as inline object literals directly in the destructured parameter, not as a separate named `Props` type. Example from `components/canvas.tsx`:
```ts
export function Canvas({ initialContent, onProvoke, ... }: {
  initialContent: string;
  onProvoke: (text: string) => void;
  provocationCount?: number;
}) { ... }
```

**`import type` for type-only imports.** Used consistently: `import type { Session } from "@/lib/types"`.

**Error narrowing:** Errors are caught as `unknown` and narrowed with `err instanceof Error ? err.message : "Something went wrong"`. Never cast caught errors directly.

**SSR safety guard.** Any function that touches browser APIs must guard with `if (typeof window === "undefined") return`. This appears in `lib/store.ts` and `lib/api-key.ts`.

**Path alias.** `@/*` maps to the project root (`tsconfig.json` paths). Use this for all imports that aren't in the same file's directory.

---

## Components

**All components are functional.** No class components.

**`"use client"` is on every component file and every page file.** The only Server Component in the project is `app/layout.tsx`. Everything else in `app/` and `components/` has `"use client"` at line 1.

**State management:** `useState` and `useCallback` throughout. No `useReducer`, no external store library. The write page (`app/write/[id]/page.tsx`) is the orchestrator — it owns all session-related state and passes callbacks down to `Canvas` and `DraftView`.

**Custom hooks live in `lib/`, not a `hooks/` folder.** `useSessions()` and `useSession()` are in `lib/store.ts`.

**Component file structure (consistent order):**
1. `"use client"` directive
2. Imports — external packages first, then `@/lib/*`, then `@/components/*`
3. Module-level helpers, constants, or sub-components
4. Named component export function with inline props type
5. No default export (except pages)

**Debouncing content saves:** Content changes debounce 500ms before persisting to localStorage. Use a `useRef<ReturnType<typeof setTimeout> | undefined>` for the timer handle, clear it in `useEffect` cleanup. Pattern from `app/write/[id]/page.tsx`:
```ts
const saveTimeoutRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
clearTimeout(saveTimeoutRef.current);
saveTimeoutRef.current = setTimeout(() => { update({ content: text }); }, 500);
```

**Loading placeholder pattern.** Components that depend on localStorage show this while `loaded === false`:
```tsx
if (!loaded) {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-muted animate-pulse-slow font-mono text-[0.8125rem]">loading...</div>
    </div>
  );
}
```

---

## API Routes

**Route handler signature:** `export async function POST(req: NextRequest)` or `GET`. Named exports only.

**Every route handler follows this structure:**
1. Extract API key from `x-api-key` header, fall back to `process.env.ANTHROPIC_API_KEY`
2. If no key, return 401 immediately
3. Demo mode branch: if no client key was provided, check Redis rate limit via `checkDemoLimit(ip)`
4. Parse and validate request body
5. Call Anthropic via Vercel AI SDK (`generateText` or `streamText`)
6. Return response
7. Entire body wrapped in `try/catch` → `return errorResponse(err)`

**Error responses always go through `errorResponse()` from `lib/api-errors.ts`.** Do not manually construct error JSON in route handlers.

**Non-streaming routes** (`/api/pulp`, `/api/demo-status`): Return `NextResponse.json(...)`.

**Streaming route** (`/api/draft`): Returns `new Response(stream, { headers })` — not `NextResponse`. The stream is built manually from `result.textStream` using a `ReadableStream` + `TextEncoder`. This is intentional to avoid Vercel AI SDK protocol framing on the response.

**Anthropic client:** Created per-request via `createAnthropic({ apiKey })`. Model and demo limit are imported from `lib/config.ts` (`CLAUDE_MODEL`, `DEMO_TEXT_LIMIT`).

**Demo remaining count** is surfaced to the client via the `X-Demo-Remaining` response header. Both routes set this header when in demo mode.

**IP extraction from `x-forwarded-for`:** Use `req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown"`. This pattern appears in both `/api/pulp` and `/api/draft`. The `demo-status` route extracts it via a helper function `getClientIp()`.

---

## Auth (Clerk)

**`ClerkProvider` lives in `app/layout.tsx` — the Server Component.** It wraps the outermost JSX, outside `<html>`. It must NOT be moved into `components/providers.tsx` (which is a Client Component and cannot host Clerk's server-side context provider).

```tsx
// app/layout.tsx — correct placement
return (
  <ClerkProvider>
    <html lang="en">
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  </ClerkProvider>
)
```

**`middleware.ts` lives at the project root.** Uses `clerkMiddleware()` from `@clerk/nextjs/server`. The matcher skips Next.js internals and static files; always runs on `/api/*`. The matcher does NOT include `trpc` (project does not use tRPC).

```ts
import { clerkMiddleware } from "@clerk/nextjs/server";
export default clerkMiddleware();
export const config = {
  matcher: [
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    "/(api)(.*)",
  ],
};
```

**Env vars required:** `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` and `CLERK_SECRET_KEY`. See `.env.example`.

---

## Styling

**Tailwind v4 — no config file.** All configuration is in `app/globals.css` via `@import "tailwindcss"` and `@theme` / `@theme inline` directives.

**Design token layers in `globals.css`:**
1. Raw CSS custom properties on `:root` (the actual values)
2. Dark overrides on `[data-theme="dark"]`
3. `@theme inline` bridges colors to Tailwind: `--color-*: var(--*)`
4. `@theme` (no inline) bridges fonts to Tailwind: `--font-*: var(--font-*)`
5. Component CSS classes (`.btn-primary`, `.icon-btn`, etc.)
6. Animation `@keyframes` and utility classes

**Why `inline` matters for colors but not fonts:** Colors use `@theme inline` so they resolve at the use-site (where `:root` has the right values). Fonts use plain `@theme` so they resolve lazily where `next/font` has already set the CSS vars on `body`. Swapping these breaks theming or font loading.

**Tailwind color tokens available:**
`bg-background`, `bg-surface`, `bg-surface-hover`, `text-foreground`, `text-foreground-secondary`, `text-muted`, `text-muted-light`, `border-border`, `border-border-light`, `text-accent`, `text-accent-dark`, `bg-accent-light`, `bg-accent-highlight`

**Tailwind font utilities:**
- `font-sans` → iA Writer Quattro (writing surface, Refine output, Soft Press output)
- `font-mono` → iA Writer Mono (all UI chrome: buttons, labels, captions, metadata, provocations)
- `font-serif` → Source Serif 4 (Deep Press output only — never use for UI)

**Type scale:** Defined as CSS vars (`--type-3xs` through `--type-2xl`) but referenced as raw `text-[Xrem]` Tailwind arbitrary values in JSX. The vars are documentation; the arbitrary values are what's in the code.

Observed sizes:
- `text-[0.625rem]` — fine print, footer
- `text-[0.6875rem]` — labels, metadata, timestamps
- `text-[0.75rem]` — captions, nav links
- `text-[0.8125rem]` — buttons, UI text, body in loading states
- `text-[0.9375rem]` — secondary body
- `text-[1.125rem]` — writing surface, draft text (via `.draft-text` CSS class)

**Component CSS classes in `globals.css` (use these, do not reinvent with Tailwind utilities):**
- `.btn-primary` — primary action (Provoke, Start writing, Save key)
- `.btn-ghost` — secondary action (Refine, Press)
- `.icon-btn` — 32×32 icon button
- `.link-subtle` — muted underline link
- `.animate-pulse-slow` — loading state pulse
- `.hero-enter` + `.stagger-{0-3}` — homepage entrance animation
- `.slide-over-backdrop` / `.slide-over-panel` — history panel slide-in/out
- `.popover-enter` — settings popover entrance
- `.draft-text`, `.draft-refine`, `.draft-soft`, `.draft-deep`, `.draft-editable` — draft output display

**Dark mode:** Controlled by `next-themes` using `attribute="data-theme"`. Theme values are `"light"`, `"dark"`, `"system"`. The selector in CSS is `[data-theme="dark"]`, not `.dark`. The `ThemeProvider` with these settings lives in `components/providers.tsx`.

**Body font must be set explicitly in globals.css.** `body { font-family: var(--font-quattro), ... }` is required because Tailwind theme vars do not auto-cascade to `body` with Tailwind v4 + next/font.

**Three-font authorship rule (load-bearing):**
- Quattro = writer's voice (writing canvas, Refine output, Soft Press output)
- Mono = system/UI (every non-prose UI element)
- Serif = shared authorship (Deep Press output only)
This distinction is product-level, not cosmetic. Do not break it.

---

## State Management

**localStorage is the entire database.** No server-side persistence for writing sessions.

Key names:
- `"pulp_sessions"` — JSON array of `Session` objects
- `"pulp_api_key"` — user's Anthropic API key string
- `"pulp_demo_mode"` — `"true"` string when demo mode is active
- `"jubel_sessions"` — legacy key, migrated automatically on first load

**Session state machine (`SessionState` from `lib/types.ts`):**
- `"writing"` — editor active
- `"provoking"` — provoke API call in flight
- `"refining"` — refine API call in flight
- `"refine"` — refine output ready/editable
- `"pressing"` — press (soft or deep) API call in flight
- `"press"` — press output ready/editable

`DraftMode` (`"refine" | "soft" | "deep"`) distinguishes which specific transformation produced the output.

**Store hooks** (`lib/store.ts`):
- `useSessions()` — full list + CRUD; returns `{ sessions, loaded, createSession, updateSession, deleteSession, getSession }`
- `useSession(id)` — focused view of a single session; returns `{ session, loaded, update, setState, deleteSession }`

Always check `loaded` before rendering session-dependent UI. `loaded` is `false` until the `useEffect` that reads localStorage has run (prevents hydration mismatch).

---

## Error Handling

**User-facing errors:** Stored in `useState<string | null>(null)`. Displayed inline above the canvas. Always `setError(null)` before a new API call. Dismissed by the user manually.

**Error extraction pattern (used everywhere):**
```ts
err instanceof Error ? err.message : "Something went wrong"
```

**API error mapping** (`lib/api-errors.ts`): All route `catch` blocks call `errorResponse(err)`. It detects known Anthropic error messages by substring match and maps them to HTTP status codes:
- 401 — invalid API key
- 429 — rate limited
- 529 — Anthropic overloaded
- 500 — everything else

**Partial stream recovery:** If streaming fails after some content has arrived, the partial draft is saved and state advances to `doneState`. The error is still surfaced. Only a zero-content failure reverts state to `"writing"`.

**Empty catch blocks are explicit.** Fire-and-forget fetches use `.catch(() => {})` — never omit error handling silently.

---

## Imports

All imports use the `@/*` alias. No relative `../` imports.

**Order in files:**
1. React and framework (`react`, `next/*`, `@tiptap/*`, third-party packages)
2. Internal lib (`@/lib/*`)
3. Internal components (`@/components/*`)

---

## Anti-Patterns

### Storage
- Do not write to localStorage directly from components. Use the store hooks.
- Do not access `localStorage` without a `typeof window === "undefined"` guard — it will throw during SSR.

### API Routes
- Do not construct `{ error: "..." }` JSON manually in catch blocks. Use `errorResponse(err)`.
- Do not use `NextResponse` for the streaming response body in `/api/draft` — use `new Response(stream, ...)`.

### TypeScript
- Do not use `interface`. Use `type`.
- Do not put shared domain types inline in component files. They belong in `lib/types.ts`.

### Styling
- Do not use `font-serif` for UI elements. Source Serif 4 is reserved for Deep Press output only.
- Do not define colors or font tokens inside component files or Tailwind config — all tokens live in `globals.css`.
- Do not create button variants by composing Tailwind utilities inline. New interaction patterns belong as named CSS classes in `globals.css`.

### Components
- Do not use `export default` for components. Only page files use default exports.
- Do not put hooks in a `hooks/` directory. Custom hooks live in `lib/`.

### Testing
- Do not create a `__tests__/` or `tests/` directory. Test files are colocated next to source.
- Do not use `.spec.ts`. The convention is `.test.ts`.
- Do not rely on `globals: true` alone — always explicitly `import { describe, it, expect } from "vitest"`.
- Do not mock what you can test directly. Prefer testing pure functions over mocking dependencies.

---

## Testing

**Runner:** Vitest 4.x. Config in `vitest.config.ts`.

```bash
npm test             # Single run
npm run test:watch   # Watch mode
npm run test:coverage # V8 coverage report
```

**Path aliases work in tests.** `resolve.tsconfigPaths: true` in vitest config resolves `@/*` imports — no separate alias setup needed.

**Environment:** `node` by default. If a test needs DOM APIs (e.g. testing `downloadAsTxt`), set `// @vitest-environment happy-dom` at the top of that test file (install `happy-dom` first).

**Test file conventions:**
- **Colocated with source** — `lib/utils.test.ts` next to `lib/utils.ts`. No `__tests__/` directories.
- **Naming:** `*.test.ts` only. Not `.spec.ts`, not `.test.tsx` (unless testing JSX).
- **Explicit imports from `vitest`** — always `import { describe, it, expect } from "vitest"` at the top, even though `globals: true` is set. Makes the test framework obvious and gives better IDE support.

**Test file structure:**
```ts
import { describe, it, expect } from "vitest";
import { functionUnderTest } from "@/lib/module";

describe("functionUnderTest", () => {
  it("describes expected behavior concisely", () => {
    expect(functionUnderTest(input)).toBe(expected);
  });
});
```

- One `describe` block per exported function or logical group
- `it` descriptions are behavior-focused, not implementation-focused
- Test data and helpers defined as module-level constants or local functions (e.g. `parseResponse` in `api-errors.test.ts`)
- Use `@/*` path alias for importing source under test, `import type` for type-only imports

**Coverage targets:** `lib/` and `app/api/`. Excludes test files themselves.

**What to test:** Pure logic modules first — utility functions, data transformers, error mappers. Modules with external dependencies (Redis, localStorage, React hooks) need mocking or environment setup; defer those unless the logic is critical.

**Planned tests for subscription work (from BUILD-STRATEGY.md):**
1. Stripe webhook handler — use `stripe trigger` CLI to fire real events locally
2. Clerk webhook handler — verify `user.created` syncs to DB correctly
3. Usage gate — user at limit gets 429, user under limit passes

---

## Open Questions

- **`NextResponse.json` vs `new Response(JSON.stringify(...))` in `/api/draft`** — error responses in the draft route use the raw `Response` constructor while `/api/pulp` uses `NextResponse.json`. Both work. New code in `/api/draft` should follow its existing raw `Response` pattern for consistency within that file.

- **`useSessions` double-instantiation** — `app/page.tsx` calls `useSessions()` directly, and `useSession(id)` internally calls `useSessions()` again. Each call creates its own independent React state. This works because both read from the same localStorage key, but two separate state instances exist simultaneously when a write session is open. This has not caused visible bugs but is worth knowing if sync issues appear.

- **`html2canvas-pro` is a production dependency** — used only in `app/share/page.tsx` for the "copy as image" feature. No convention yet for other canvas/screenshot needs if they arise.
