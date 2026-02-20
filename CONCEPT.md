# App Concept

> **Name: Pulp**
> Alternatives if we revisit: Textuary, Writual, Undraft

---

## The Problem

Most AI writing tools start with AI output and let humans edit. This trains people to react to AI's ideas rather than develop their own. Over time, the human voice — and more importantly, the human *thinking* — erodes. The writer becomes an editor of machine-generated text rather than the originator of their own ideas.

## The Idea

A writing tool that inverts the default AI-writing flow. The human writes first — raw, unstructured, stream-of-consciousness. The AI never writes *for* the human. Instead, it plays two distinct roles at two distinct phases:

1. **Thinking partner** — across multiple rounds, the AI helps the writer excavate their own thinking through gentle, curious provocations.
2. **Writer** — only after the thinking is rich and deep does the AI compose a draft, translating raw thought into realized prose.

The core principle: by the time AI writes anything substantial, it should be drawing on a rich body of the writer's own raw thinking — not filling a vacuum.

---

## The Flow

```
[Write] → [Pulp] → [Fill] → [Pulp again] → [Fill] → ... → [Press] → [Edit]
```

### 1. Write

Blank canvas. The user writes freely — stream of consciousness, no structure, no pressure to be coherent. A single textarea and nothing else. The app gets out of the way.

### 2. Pulp (AI round)

The AI reads everything the user has written and does two things:

**Splits** the text at meaningful seams — not arbitrary line breaks, but the natural joints in the thinking: where one idea ends and another begins, where the tone shifts, where a new thread emerges. This reveals the hidden skeleton of the writer's thinking. Like pulping raw material into its fibers.

**Inserts provocations** between fragments. These are the heart of the app.

### 3. Fill (Human round)

The user responds to whichever provocations resonate, ignores the rest, and adds whatever else comes to mind. Still in their own words, still raw. The provocations are invitations — the user is never obligated to follow them.

### 4. Pulp again (AI round)

The AI re-reads *everything* — original fragments plus new material — with fresh eyes. It doesn't just append new provocations to old structure. It restructures entirely, finding the new shape of the thinking: where it has deepened, where new doors opened, where something wants to be followed further.

### 5. Repeat

Default: 2 pulp/fill cycles. The number could be configurable. Each round should produce diminishing returns — if the thinking feels fully excavated after one round, the user can skip ahead to press.

### 6. Press

This is where the magic happens. The AI takes everything the writer produced across all rounds — raw writing, responses to provocations, freeform additions — and presses it into a genuine first draft.

This is NOT a reassembly of fragments with transitions glued in. This is real writing — the AI finds the deeper structure, draws out implications the writer sensed but didn't articulate, gives half-formed thoughts their full expression, and crafts prose with varied rhythm, an arc that builds, and sentences that breathe.

The draft should make the writer say: "yes, THAT'S what I was trying to say."

### 7. Edit

Free-form editing. The foundation has been set by the human's thinking; now the writer can refine, restructure, or request further AI assistance as needed.

---

## The Two AI Roles

These are fundamentally different jobs with different tones, and they must not bleed into each other.

### Role 1: Thinking Partner (Pulp rounds)

The AI is not a coach, not a therapist, not a know-it-all. It is simply, genuinely curious about what this person is trying to say.

**Tone:** Ultra-concise. Sparse. More pointer than sentence. The curiosity of a rubber duck, the brevity of Yoda, the quiet precision of something that simply sees clearly.

**What a provocation looks like:**
- `failure?`
- `who specifically?`
- `what if that wasn't weakness?`
- `the body remembers.`
- `two truths here. which one?`
- `say more.`
- `the real version?`
- `grief?` / `or relief?` / `both?`

**What a provocation does NOT look like:**
- Therapist voice: "It sounds like you're feeling..."
- Teacher voice: "Have you considered..."
- Confrontational: "You're clearly avoiding..."
- Verbose: anything longer than ~10 words

**The spirit:** The AI is not ahead of the writer. It is beside them, pointing at things in their own thinking they might want to look at more closely. An invitation, never a judgment. Curious, never critical.

**On re-pulps (round 2+):** The AI re-reads all material as one piece and finds the new shape. It doesn't just tack new provocations onto old structure. It notices where the thinking has deepened, where new doors opened, where something wants to be followed further.

**Fragments are preserved verbatim.** The AI never rewrites, edits, or "improves" the user's words during this phase.

### Role 2: Writer (Press)

Only now does the AI write. And because the pulp rounds did their job, it has rich material to work with.

**The job:** Translate raw thought into realized prose.

- Find the deeper ideas latent in what the writer said — the ones they were circling around, reaching toward, almost grasping. Name them. Give them their full expression.
- Draw out implications they sensed but didn't articulate. Connect dots they laid out but didn't connect.
- Find the emotional center — the thing they care about most — and let the piece orbit around it.
- The writer's specific phrasings, metaphors, and turns of thought are gold — weave them in where they're strong. Elevate language around them.
- Craft real prose: varied rhythm, sentences that breathe, an arc that builds.

**The balance:**
- Every major idea must trace back to the writer's thinking. The AI is not inventing a thesis — it is finding theirs.
- But the AI IS expected to articulate what the writer was struggling to say. If they wrote "I think there's something about how we lose ourselves in other people's expectations," the AI can write "There is a quiet violence in living according to someone else's map."
- The voice should feel like a refined, more articulate version of the writer's voice — not generic AI voice. Match their register (earnest, sardonic, tender, analytical) but elevate the execution.
- Structure should feel inevitable, not imposed.

**The philosophy:** Users come to this app to spend less work on technical prose and more work on thinking and feeling. The AI's job in the draft phase is to flesh out the beauty that users would have otherwise failed to bring to fruition. Raw words are the input, not the output.

**Must not:**
- Simply string answers together with transitions
- Use hollow AI-essay phrases ("In today's world...", "It is worth noting...")
- Add ideas the writer never gestured toward
- Over-structure with headers unless the material demands it
- Write in a generic, interchangeable style
- Pad or repeat

---

## Design Principles

- **Monochrome + one accent.** Black/white/gray base. Provocations in a single warm accent color (currently burnt orange).
- **Typographic hierarchy.** User text in a warm serif. Provocations in a contrasting mono/sans. Clear visual separation so the writer always knows what's theirs and what's a prompt.
- **Diff-like provocation display.** Provocations appear like inserted lines — left-border colored bar, slightly indented, lighter background.
- **Minimal chrome.** No sidebars, no toolbars, no menus. The writing surface dominates. The blank page should feel peaceful and inviting.
- **Progressive disclosure.** Only show what's relevant to the current state.
- **Smooth transitions.** Animate between states — fragments easing apart, provocations fading in.

---

## Technical Implementation (Current)

### Stack
- Next.js 16 (App Router, Turbopack)
- React 19, TypeScript
- Tailwind CSS v4
- Anthropic Claude API via Vercel AI SDK v6
- Model: `claude-sonnet-4-6`
- Client-side state with localStorage persistence (no database)

### Key Files
```
app/
  page.tsx                    # Landing — session list + "Start writing"
  write/[id]/page.tsx         # Main writing interface (orchestrates all states)
  api/explode/route.ts        # Explosion endpoint (returns fragments + provocations as JSON)
  api/draft/route.ts          # Draft endpoint (streams prose)
components/
  braindump.tsx               # Full-screen textarea
  explosion-view.tsx          # Interleaved fragments + provocations
  provocation.tsx             # Single provocation with response textarea
  fragment.tsx                # Single user fragment
  draft-view.tsx              # Streaming + editable draft display
  round-indicator.tsx         # Current state label
  loading.tsx                 # Loading animation
lib/
  types.ts                    # Session, Fragment, Provocation, Round types
  prompts.ts                  # All AI system/user prompts
  store.ts                    # useSessions / useSession hooks + localStorage
  utils.ts                    # ID generation, text aggregation
```

### Data Model
```typescript
Session {
  id, title, createdAt, updatedAt,
  state: "braindump" | "exploding" | "explosion" | "fill" | "drafting" | "draft" | "edit",
  braindump: string,
  rounds: Round[],
  currentRound, maxRounds (default: 2),
  draft: string | null
}

Round {
  number,
  fragments: Fragment[],        // verbatim user text with IDs
  provocations: Provocation[],  // AI provocations with response fields
  freeformAddition: string      // user's additional freeform text
}
```

---

## Open Questions

- **App name.** Settled on **Pulp**. Alternatives saved: Textuary, Writual, Undraft.
- **Action language.** Settled on **Pulp** / **Pulp again** / **Fill** / **Press**. The metaphor extends from papermaking: raw material gets pulped (broken into fibers), then pressed into paper. "Pulp" = AI breaks apart and provokes. "Press" = AI composes the draft. Note: internal code still uses the old terms (explode, explosion, etc.) in variable names, filenames, and state values — only user-facing labels have been updated.
- **Number of rounds.** Currently fixed at 2. Should this be user-configurable? Should the user be able to skip ahead to draft at any point?
- **Post-draft AI assistance.** The spec mentions "further AI assistance" after the draft. What does this look like? Inline editing? Selection-based refinement? A second braindump-to-draft cycle on the draft itself?
- **Sharing/export.** No current mechanism for exporting the final draft.
- **Persistence.** Currently localStorage only. If this becomes a real product, what's the storage story?
