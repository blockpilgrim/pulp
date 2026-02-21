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
[Write] → [Probe] → [Write more] → [Probe again] → ... → [Write draft] → [Edit]
```

Everything happens on a single continuous canvas — a TipTap rich text editor. There are no separate screens for writing vs. responding to provocations.

### 1. Write

The user writes freely in the editor — stream of consciousness, no structure, no pressure to be coherent. The editor and nothing else. The app gets out of the way.

### 2. Probe (AI round)

The user clicks "Probe." The AI reads everything the user has written and does two things:

**Splits** the text at meaningful seams — not arbitrary line breaks, but the natural joints in the thinking: where one idea ends and another begins, where the tone shifts, where a new thread emerges. This reveals the hidden skeleton of the writer's thinking. Like pulping raw material into its fibers.

**Inserts provocations inline** between fragments, directly in the editor. These appear as dismissable annotation blocks (highlighter-styled, with an X button) nestled between the user's paragraphs. The user's text is never altered — provocations are inserted *around* it.

### 3. Write more (Human round)

The user edits directly in the same editor — adding text, expanding ideas, or simply dismissing provocations that don't resonate. There is no separate "response" UI. The user just keeps writing. Provocations are invitations; the user is never obligated to follow them.

### 4. Probe again (AI round)

The user can probe as many times as they want. Each probe re-reads all user text (skipping any remaining provocation nodes), finds the new shape of the thinking, and inserts fresh provocations. Old provocations are replaced.

### 5. Write draft

When ready, the user clicks "Write draft." The AI takes everything the user has written and presses it into a genuine first draft.

This is NOT a reassembly of fragments with transitions glued in. This is real writing — the AI finds the deeper structure, draws out implications the writer sensed but didn't articulate, gives half-formed thoughts their full expression, and crafts prose with varied rhythm, an arc that builds, and sentences that breathe.

The draft should make the writer say: "yes, THAT'S what I was trying to say."

### 6. Edit

The draft streams in and becomes editable when complete. The writer can refine, copy, or download as .txt.

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
- **Inline provocations.** Provocations appear as dismissable annotation blocks inside the editor — highlighter-styled, with an X to dismiss. They live between user paragraphs, never displacing the user's text.
- **Minimal chrome.** No sidebars, no toolbars, no menus. The writing surface dominates. The blank page should feel peaceful and inviting.
- **Progressive disclosure.** Only show what's relevant to the current state.
- **Smooth transitions.** Animate between states — fragments easing apart, provocations fading in.

---

## Technical Implementation (Current)

### Stack
- Next.js 16 (App Router, Turbopack)
- React 19, TypeScript
- Tailwind CSS v4
- TipTap rich text editor (@tiptap/react, @tiptap/starter-kit, @tiptap/extension-placeholder)
- Anthropic Claude API via Vercel AI SDK v6
- Model: `claude-sonnet-4-6`
- Client-side state with localStorage persistence (no database)

### Key Files
```
app/
  page.tsx                    # Landing — session list + "Start writing"
  write/[id]/page.tsx         # Orchestrator (Canvas for writing/probing, DraftView for drafting/draft)
  api/pulp/route.ts           # Probe endpoint (returns fragments + provocations as JSON)
  api/draft/route.ts          # Draft endpoint (streams prose)
components/
  canvas.tsx                  # TipTap editor + toolbar (write, probe, draft buttons)
  provocation-node.tsx        # React node view for inline provocation blocks
  draft-view.tsx              # Streaming + editable draft display
  round-indicator.tsx         # Current state label
  loading.tsx                 # Loading animation
lib/
  types.ts                    # Session, PulpResponse types
  provocation-extension.ts    # Custom TipTap node extension for provocations
  prompts.ts                  # All AI system/user prompts
  store.ts                    # useSessions / useSession hooks + localStorage
  utils.ts                    # ID generation, filename utils
```

### Data Model
```typescript
Session {
  id, title, direction, createdAt, updatedAt,
  state: "writing" | "probing" | "drafting" | "draft",
  content: string,            // flat user text, persisted to localStorage
  probeCount: number,         // how many times the user has probed
  draft: string | null
}
```

Provocations are ephemeral — they exist only as TipTap nodes in the editor's in-memory document. On refresh, the user gets their text back and can probe again. The API response shape (`PulpResponse` with `fragments[]` and `provocations[]`) is unchanged.

---

## Open Questions

- **App name.** Settled on **Pulp**. Alternatives saved: Textuary, Writual, Undraft.
- **Action language.** User-facing labels: "Probe" / "Write draft". Internal API endpoint is still `/api/pulp`.
- **Post-draft AI assistance.** What does this look like? Inline editing? Selection-based refinement? A second write-to-draft cycle on the draft itself?
- **Persistence.** Currently localStorage only. If this becomes a real product, what's the storage story?
