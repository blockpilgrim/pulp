# Jubel — Build Spec

## What it is

A writing tool that inverts the AI-writing default. The human writes first. The AI's job is to break apart, provoke, and organize — never to originate. By the time AI produces a draft, it's synthesizing a rich body of the writer's own thinking.

## Core Flow

```
[Braindump] → [Explosion] → [Fill] → [Re-explosion] → [Fill] → ... → [Draft] → [Free Edit]
```

### States

1. **BRAINDUMP** — Blank canvas. User writes stream-of-consciousness on a topic. No structure, no pressure. A single textarea with a "Done" action.

2. **EXPLOSION** — AI reads the braindump, splits it at meaningful seams (thematic, argumentative, narrative), and inserts provocations between fragments. The result is displayed as an interleaved list:
   - **Fragment** (user's original text) — visually distinct, clearly "theirs"
   - **Provocation** (AI-generated) — short, pointed: a word, a question, a nudge. Visually marked as AI-inserted (like a diff addition). Each provocation has a response textarea beneath it.

3. **FILL** — User responds to provocations they care about (skip the rest), and can add free-form material at the end. Still raw, still theirs.

4. **RE-EXPLOSION** — AI re-reads all material (original fragments + fill responses), restructures with new seams and provocations. Same visual format as step 2 but with evolved structure.

5. **DRAFT** — After N rounds (default: 2 explosion/fill cycles), AI composes a full draft grounded in the writer's material. Displayed in an editable rich-text area.

6. **FREE EDIT** — Standard editing. User can manually edit. Option to request AI refinements on selections.

## Tech Stack

- **Next.js 15** (App Router)
- **React 19**
- **TypeScript**
- **Tailwind CSS v4**
- **Anthropic Claude API** (via AI SDK / direct)
- **Vercel AI SDK** for streaming
- **No database** — client-side state only (localStorage for persistence)

## Project Structure

```
jubel/
├── app/
│   ├── layout.tsx
│   ├── page.tsx              # Landing / session list
│   ├── write/
│   │   └── page.tsx          # Main writing interface
│   └── api/
│       ├── explode/
│       │   └── route.ts      # Explosion endpoint
│       └── draft/
│           └── route.ts      # Draft generation endpoint
├── components/
│   ├── braindump.tsx          # Braindump textarea
│   ├── explosion-view.tsx     # Fragments + provocations display
│   ├── provocation.tsx        # Single provocation with response area
│   ├── fragment.tsx           # Single user fragment
│   ├── draft-view.tsx         # Draft display + editing
│   ├── round-indicator.tsx    # Shows current round (1/2, 2/2, etc.)
│   └── session-controls.tsx   # Navigation between states
├── lib/
│   ├── types.ts               # Core type definitions
│   ├── prompts.ts             # All AI prompt templates
│   ├── store.ts               # Client-side state management
│   └── utils.ts               # Helpers
├── tailwind.config.ts
├── tsconfig.json
├── package.json
└── next.config.ts
```

## Data Model

```typescript
type Session = {
  id: string;
  title: string;           // auto-generated from braindump
  createdAt: number;
  updatedAt: number;
  state: SessionState;
  rounds: Round[];
  currentRound: number;
  maxRounds: number;        // default: 2
  draft: string | null;
};

type SessionState =
  | "braindump"
  | "exploding"       // loading state
  | "explosion"
  | "fill"
  | "drafting"        // loading state
  | "draft"
  | "edit";

type Round = {
  number: number;
  fragments: Fragment[];
  provocations: Provocation[];
  freeformAddition: string;
};

type Fragment = {
  id: string;
  text: string;
  source: "braindump" | "fill";
  roundCreated: number;
};

type Provocation = {
  id: string;
  text: string;           // the AI provocation
  afterFragmentId: string; // positioned after this fragment
  response: string;        // user's response (empty if skipped)
};
```

## AI Interactions

### Explosion Prompt

Input: All accumulated user text (braindump + previous fill responses).

Output: Structured JSON —
```json
{
  "fragments": [
    { "id": "f1", "text": "original user text segment" }
  ],
  "provocations": [
    { "id": "p1", "afterFragmentId": "f1", "text": "But what about...?" }
  ]
}
```

Prompt principles:
- Split at *meaningful* seams — thematic shifts, latent argument boundaries, tonal changes
- Provocations should surface what's *unsaid but implied*
- Provocations are SHORT: a word, a phrase, a pointed question
- Never rewrite the user's text — preserve verbatim
- On re-explosion: restructure with awareness of how the material has grown

### Draft Prompt

Input: All fragments and filled responses across all rounds.

Output: Streamed prose draft.

Prompt principles:
- Synthesize, don't generate
- Preserve the writer's voice, phrasing, and word choices
- Structure should reflect the emergent organization from explosions
- Flag (to yourself, not in output) where you're bridging vs. quoting

## UI Design Principles

- **Monochrome + one accent.** Black/white/gray base. Provocations in a single accent color.
- **Typographic hierarchy.** User text in a warm serif. Provocations in a contrasting mono/sans. Clear visual separation.
- **Diff-like provocation display.** Provocations appear like inserted lines — left-border colored bar, slightly indented, lighter background.
- **Minimal chrome.** No sidebars, no toolbars, no menus. The writing surface dominates.
- **Progressive disclosure.** Only show what's relevant to the current state.
- **Smooth transitions.** Animate between states — fragments sliding apart during explosion, provocations fading in.

## Implementation Order

### Phase 1: Scaffold + Braindump
- [ ] Next.js project setup with Tailwind v4
- [ ] Core types and state management
- [ ] Landing page (minimal — just "Start Writing" or list of sessions)
- [ ] Braindump view — full-screen textarea, "Explode" button

### Phase 2: Explosion
- [ ] `/api/explode` route — takes text, returns fragments + provocations
- [ ] Explosion view component — render fragments and provocations
- [ ] Provocation component with inline response textarea
- [ ] Visual styling: diff-like provocation display

### Phase 3: Fill + Re-explosion Loop
- [ ] Fill state — enable response textareas, add freeform area
- [ ] "Re-explode" action that gathers all material and hits API again
- [ ] Round tracking and indicator
- [ ] Loop logic: after N rounds, transition to draft

### Phase 4: Draft Generation
- [ ] `/api/draft` route — takes all material, streams a draft
- [ ] Draft view with streaming display
- [ ] Transition to editable state after stream completes

### Phase 5: Polish
- [ ] localStorage persistence
- [ ] Session list on landing page
- [ ] Animations/transitions between states
- [ ] Mobile responsiveness
- [ ] Error handling and loading states
