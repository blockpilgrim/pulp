# App Concept

> **Name: Pulp**
> The name works as a word — punchy, one syllable, evocative of raw material. The papermaking metaphor (raw pulp → pressed paper) loosely maps to the app's transformations but shouldn't be taken literally. The app's flow is cyclical; the metaphor is held loosely.

---

## The Problem

Most AI writing tools start with AI output and let humans edit. This trains people to react to AI's ideas rather than develop their own. Over time, the human voice — and more importantly, the human *thinking* — erodes. The writer becomes an editor of machine-generated text rather than the originator of their own ideas.

There's a subtler version of this problem too: even when AI writes *from* a human's thinking, the act of completely rewriting someone's words can feel like theft. The writer does the hard work of excavating their ideas, then watches their labor dissolve into someone else's prose. The better the output, the worse this can feel — because a mediocre rewrite is easy to reject, but a beautiful one written in someone else's voice is an uncanny valley of authorship.

## The Idea

A writing tool that inverts the default AI-writing flow. The human writes first — raw, unstructured, stream-of-consciousness. The AI never writes *for* the human. Instead, it plays three distinct roles:

1. **Thinking partner (Provoke)** — across multiple rounds, the AI helps the writer excavate their own thinking through gentle, curious provocations. The button promises a challenge; what arrives is a whisper.
2. **Editor (Polish)** — the AI cleans up the writer's own words: fixes grammar, smooths rough edges, adds minimal connective tissue. The writer's sentences are the text. Authorship is unambiguous.
3. **Writer (Press)** — the AI takes the writer's raw thinking and composes something new from it — finding the deeper structure, giving half-formed thoughts their full expression. Authorship is shared.

Polish and Press are not a hierarchy. They are two equally valid transformations with different philosophies: Polish preserves the writer's voice exactly; Press translates it into something the writer couldn't have written alone. The writer chooses which they want, and can try both.

The core principle: by the time AI writes anything substantial, it should be drawing on a rich body of the writer's own raw thinking — not filling a vacuum.

---

## The Flow

```
[Write] → [Provoke] → [Write more] → [Polish or Press] → [Continue writing / Revert] → ...
```

The flow is **cyclical, not linear**. There is no terminal state. After any transformation (Polish or Press), the writer can:
- **Continue with it** — accept the output as their new working text and keep writing, provoking, or transforming again.
- **Revert** — discard the output and return to their raw text. Nothing is ever lost.

Writing is iterative. A writer might: write raw → provoke → write more → polish → continue → provoke again → press → continue → write more → polish → done. Or they might write → press → done. The app supports both.

Everything happens on a single continuous canvas — a TipTap rich text editor. There are no separate screens for writing vs. responding to provocations.

### 1. Write

The user writes freely in the editor — stream of consciousness, no structure, no pressure to be coherent. The editor and nothing else. The app gets out of the way.

### 2. Provoke (AI round)

The user clicks "Provoke." The AI reads everything the user has written and does two things:

**Splits** the text at meaningful seams — not arbitrary line breaks, but the natural joints in the thinking: where one idea ends and another begins, where the tone shifts, where a new thread emerges. This reveals the hidden skeleton of the writer's thinking.

**Inserts provocations inline** between fragments, directly in the editor. These appear as dismissable annotation blocks (highlighter-styled, with an X button) nestled between the user's paragraphs. The user's text is never altered — provocations are inserted *around* it.

### 3. Write more (Human round)

The user edits directly in the same editor — adding text, expanding ideas, or simply dismissing provocations that don't resonate. There is no separate "response" UI. The user just keeps writing. Provocations are invitations; the user is never obligated to follow them.

### 4. Provoke again (AI round)

The user can provoke as many times as they want. Each round re-reads all user text (skipping any remaining provocation nodes), finds the new shape of the thinking, and inserts fresh provocations. Old provocations are replaced.

### 5. Polish or Press

When ready, the user chooses one of two transformations:

**Polish** — the AI cleans up the writer's text while preserving their words, voice, and structure. Fixes grammar, smooths awkward phrasing, adds minimal connective tissue. The result should read like the writer's own writing on a good day. This is an intermediary step — not a final destination.

**Press** — the AI takes everything the user has written and composes something new from it. This is NOT a reassembly of fragments with transitions glued in. This is real writing — the AI finds the deeper structure, draws out implications the writer sensed but didn't articulate, gives half-formed thoughts their full expression, and crafts prose with varied rhythm, an arc that builds, and sentences that breathe. The output should make the writer say: "yes, THAT'S what I was trying to say."

### 6. Continue or Revert

The output streams in and becomes editable when complete. The writer can:
- **Continue with this** — the output becomes their new working text. They return to the canvas and can keep writing, provoke, polish, or press again.
- **Revert** — discard the output and return to their original raw text. The raw text is always preserved until the writer explicitly moves on.
- **Copy or download** — export the current text at any point.

---

## The Three AI Roles

These are fundamentally different jobs with different tones, and they must not bleed into each other.

### Role 1: Thinking Partner (Provoke)

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

**On subsequent rounds (2+):** The AI re-reads all material as one piece and finds the new shape. It doesn't just tack new provocations onto old structure. It notices where the thinking has deepened, where new doors opened, where something wants to be followed further.

**Fragments are preserved verbatim.** The AI never rewrites, edits, or "improves" the user's words during this phase.

### Role 2: Editor (Polish)

The AI is an invisible copy editor. The writer's sentences are the text. The AI works in service of them, not in place of them.

**The job:** Clean up the writer's words without replacing them.

- Fix grammar, spelling, and punctuation.
- Smooth awkward phrasing — but only where it genuinely trips the reader. Rough edges that carry voice or energy should stay.
- Add minimal connective tissue between ideas where the gaps are jarring. A word, a short phrase, a transition sentence at most. Never a whole paragraph.
- Tighten: cut redundancy, trim filler words, collapse run-ons where they don't serve rhythm.
- Preserve paragraph structure. Don't reorganize sections or impose a new arc.

**The balance:**
- Every sentence in the output should be recognizably the writer's. If they read it and can't tell what changed, the AI has done its job perfectly.
- The writer's voice — however rough, informal, or idiosyncratic — is not a problem to fix. It's the point.
- Do NOT elevate register, add flourishes, or make the prose "better." Make it cleaner.
- Zero creative liberty. No ideas, implications, or conclusions the writer didn't write.

**Must not:**
- Restructure or reorder paragraphs
- Add headers, section breaks, or organizational scaffolding
- Introduce metaphors, imagery, or turns of phrase the writer didn't use
- Change the writer's tone
- Use AI-essay phrases

### Role 3: Writer (Press)

Only now does the AI write. And because the provocation rounds did their job, it has rich material to work with.

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

**The philosophy:** Users come to this app to spend less work on technical prose and more work on thinking and feeling. The AI's job in the Press phase is to flesh out the beauty that users would have otherwise failed to bring to fruition. Raw words are the input, not the output.

**Must not:**
- Simply string answers together with transitions
- Use hollow AI-essay phrases ("In today's world...", "It is worth noting...")
- Add ideas the writer never gestured toward
- Over-structure with headers unless the material demands it
- Write in a generic, interchangeable style
- Pad or repeat

---

## The Authorship Tension

There's an intentional tension between Polish and Press. Polish preserves authorship completely — the writer reads the output and recognizes every sentence as theirs. Press shares authorship — the writer's ideas, the AI's prose. Both are valid. The key insight is that this should be a *choice the writer makes*, not something that happens to them.

The parallel to Theodore Twombly's job in the film "Her" is instructive. Theodore takes other people's raw emotional material and writes beautiful letters in their voice. Press does essentially the same thing. The difference: Theodore's clients skip the hard work of reflection. Pulp's provocation rounds ensure the writer *earns* the output — they've done the thinking, the wrestling, the excavation. By the time the AI writes, it's working from genuine raw material, not guessing.

Polish exists because sometimes the writer doesn't want a Theodore. They want their own words, cleaned up. The app respects both needs equally.

---

## Design Principles

- **Monochrome + one accent.** Black/white/gray base. Provocations in a single warm accent color (currently burnt orange).
- **Typographic hierarchy.** User text in a warm serif. Provocations in a contrasting mono/sans. Clear visual separation so the writer always knows what's theirs and what's a prompt.
- **Inline provocations.** Provocations appear as dismissable annotation blocks inside the editor — highlighter-styled, with an X to dismiss. They live between user paragraphs, never displacing the user's text.
- **Minimal chrome.** No sidebars, no toolbars, no menus. The writing surface dominates. The blank page should feel peaceful and inviting.
- **Progressive disclosure.** Only show what's relevant to the current state.
- **Cyclical flow.** Nothing is a dead end. The writer can always go back to writing after any transformation. Polish and Press are waypoints, not destinations.
- **Revertibility.** Raw text is always preserved. The writer can discard any AI output and return to where they were. AI's words are an offer, never a replacement.
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
  write/[id]/page.tsx         # Orchestrator (Canvas for writing/provoking, DraftView for polish/press)
  api/pulp/route.ts           # Provoke endpoint (returns fragments + provocations as JSON)
  api/draft/route.ts          # Polish + Press endpoint (streams prose, mode param selects prompt)
components/
  canvas.tsx                  # TipTap editor + toolbar (provoke, polish, press buttons)
  provocation-node.tsx        # React node view for inline provocation blocks
  draft-view.tsx              # Streaming + editable output display (polish/press results)
  round-indicator.tsx         # Current state label
  loading.tsx                 # Loading animation
lib/
  types.ts                    # Session, DraftMode, PulpResponse types
  provocation-extension.ts    # Custom TipTap node extension for provocations
  prompts.ts                  # All AI system/user prompts (provoke, polish, press)
  store.ts                    # useSessions / useSession hooks + localStorage
  utils.ts                    # ID generation, filename utils
```

### Data Model
```typescript
type DraftMode = "polish" | "draft";

Session {
  id, title, direction, createdAt, updatedAt,
  state: "writing" | "probing" | "polishing" | "polish" | "drafting" | "draft",
  content: string,            // current working text, persisted to localStorage
  probeCount: number,         // how many times the user has provoked
  draft: string | null,       // polish/press output
  draftMode: DraftMode | null, // which mode produced the current output
  rawContent: string | null   // pre-transformation text (for revert)
}
```

Provocations are ephemeral — they exist only as TipTap nodes in the editor's in-memory document. On refresh, the user gets their text back and can provoke again. The API response shape (`PulpResponse` with `fragments[]` and `provocations[]`) is unchanged.

### Action Language
- User-facing toolbar: **Provoke** · **Polish** · **Press**
- After output: **continue with this** · **revert** · copy · download · back to home
- Internal API: `/api/pulp` (provoke), `/api/draft?mode=polish|draft` (polish/press)

---

## Open Questions

- **Post-output AI assistance.** After Polish or Press, could there be inline refinement? Selection-based editing? This is separate from the cyclical flow (which already lets you keep iterating).
- **Persistence.** Currently localStorage only. If this becomes a real product, what's the storage story?
- **Version history.** The cyclical flow means a session could go through many transformations. Should there be a way to see or restore previous versions beyond the immediate revert?
- **Mobile experience.** Three toolbar buttons + the editor — does this work well on small screens?
