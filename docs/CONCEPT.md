# App Concept

> **Name: Pulp**
> The name works as a word — punchy, one syllable, evocative of raw material. The papermaking metaphor (raw pulp → refined fibers → pressed paper) maps to the app's transformation pipeline: raw writing is refined, then pressed into form. The metaphor extends to pressure — more pressure yields more transformation. The app's flow is cyclical; the metaphor is held loosely but honestly.

---

## The Problem

Most AI writing tools start with AI output and let humans edit. This trains people to react to AI's ideas rather than develop their own. Over time, the human voice — and more importantly, the human *thinking* — erodes. The writer becomes an editor of machine-generated text rather than the originator of their own ideas.

There's a subtler version of this problem too: even when AI writes *from* a human's thinking, the act of completely rewriting someone's words can feel like theft. The writer does the hard work of excavating their ideas, then watches their labor dissolve into someone else's prose. The better the output, the worse this can feel — because a mediocre rewrite is easy to reject, but a beautiful one written in someone else's voice is an uncanny valley of authorship.

## The Idea

A writing tool that inverts the default AI-writing flow. The human writes first — raw, unstructured, stream-of-consciousness. The AI never writes *for* the human. Instead, it plays four distinct roles across a spectrum of authorship:

1. **Thinking partner (Provoke)** — across multiple rounds, the AI helps the writer excavate their own thinking through gentle, curious provocations. The button promises a challenge; what arrives is a whisper.
2. **Editor (Refine)** — the AI cleans up the writer's own words: fixes grammar, smooths rough edges, adds minimal connective tissue. The writer's sentences are the text. Authorship is unambiguous.
3. **Collaborator (Soft Press)** — the AI stays anchored to the writer's words while gently restructuring, filling gaps, and elevating phrasing. The writer's text is the skeleton; the AI strengthens it. Authorship is mostly the writer's.
4. **Writer (Deep Press)** — the AI takes the writer's raw thinking and composes something new from it — finding the deeper structure, giving half-formed thoughts their full expression. Authorship is shared.

Refine, Soft Press, and Deep Press form an **authorship spectrum** — from the writer's words untouched, through light collaboration, to full creative partnership. The writer chooses where on this spectrum they want to land, and can try any of them.

The core principle: by the time AI writes anything substantial, it should be drawing on a rich body of the writer's own raw thinking — not filling a vacuum.

---

## The Flow

```
[Write] → [Provoke] → [Write more] → [Refine or Press] → [Continue writing / Revert] → ...
```

The flow is **cyclical, not linear**. There is no terminal state. After any transformation (Refine or Press), the writer can:
- **Continue with it** — accept the output as their new working text and keep writing, provoking, or transforming again.
- **Revert** — discard the output and return to their raw text. Nothing is ever lost.

Writing is iterative. A writer might: write raw → provoke → write more → refine → continue → provoke again → soft press → continue → write more → deep press → done. Or they might write → deep press → done. The app supports both.

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

### 5. Refine or Press

When ready, the user chooses a transformation:

**Refine** — the AI cleans up the writer's text while preserving their words, voice, and structure. Fixes grammar, smooths awkward phrasing, adds minimal connective tissue. The result should read like the writer's own writing on a good day. This is an intermediary step — not a final destination.

**Press** — the AI transforms the writer's raw material into more realized prose. The user chooses the intensity:

- **Soft Press** — the AI stays close to the writer's words. It restructures for flow, fills visible gaps with short connective tissue, and elevates phrasing — but every paragraph remains recognizably the writer's. The writer should feel: *"that's me, but on a better day."*
- **Deep Press** — the AI takes everything the user has written and composes something new from it. This is real writing — the AI finds the deeper structure, draws out implications, gives half-formed thoughts their full expression. The writer should feel: *"that's what I was trying to say."*

### 6. Continue or Revert

The output streams in and becomes editable when complete. The writer can:
- **Continue with this** — the output becomes their new working text. They return to the canvas and can keep writing, provoke, refine, or press again.
- **Revert** — discard the output and return to their original raw text. The raw text is always preserved until the writer explicitly moves on.
- **Copy or download** — export the current text at any point.

---

## The Four AI Roles

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

### Role 2: Editor (Refine)

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

### Role 3: Collaborator (Soft Press)

The AI is a careful co-writer who respects the writer's foundation. The writer's text is the skeleton; the AI strengthens joints, fills visible gaps, and smooths the surface — but never replaces the structure.

**The job:** Improve the writer's text while staying anchored to their words and voice.

- Restructure sentences and paragraphs for better flow — but keep the writer's overall arc and progression.
- Fill visible gaps: where an idea jumps abruptly, add a bridging sentence or two. Where a thought trails off, give it a landing.
- Elevate phrasing where the writer's intent is clear but the execution is rough. Turn a clumsy sentence into the sentence the writer was reaching for.
- Smooth transitions between ideas. Add connective tissue that feels organic, not imposed.
- Lightly develop underdeveloped points — a clarifying sentence, a concrete example — but only where the writer's direction is unambiguous.

**The balance:**
- The writer's words are the foundation. At least 80% of the output should be recognizably the writer's own language.
- The AI has creative liberty in the margins: transitions, connective tissue, phrasing improvements, light gap-filling. It does NOT have liberty with the core ideas, arguments, or emotional content.
- The writer should read the output and feel: *"that's me, but on a better day."* Not: *"who wrote this?"*
- Preserve the writer's register and voice. If they write casually, don't formalize. If they write earnestly, don't add irony.
- Every addition should feel like something the writer would have written given more time and clarity. The AI is channeling the writer, not replacing them.

**Must not:**
- Introduce new ideas, arguments, or themes the writer didn't gesture toward
- Rewrite passages wholesale — improve them in place
- Impose structure the writer didn't establish (no new headers, no reordering sections)
- Elevate the register or make the prose "literary" — match the writer's level
- Add more than 2–3 sentences of new material in any one place
- Use AI-essay phrases or generic filler

### Role 4: Writer (Deep Press)

Only now does the AI fully write. And because the provocation rounds did their job, it has rich material to work with.

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

**The philosophy:** Users come to this app to spend less work on technical prose and more work on thinking and feeling. The AI's job in the Deep Press phase is to flesh out the beauty that users would have otherwise failed to bring to fruition. Raw words are the input, not the output.

**Must not:**
- Simply string answers together with transitions
- Use hollow AI-essay phrases ("In today's world...", "It is worth noting...")
- Add ideas the writer never gestured toward
- Over-structure with headers unless the material demands it
- Write in a generic, interchangeable style
- Pad or repeat

---

## The Authorship Spectrum

Refine, Soft Press, and Deep Press form a spectrum of authorship — from the writer's voice preserved exactly, through careful collaboration, to full creative partnership. This is not a quality hierarchy. The three modes represent different *relationships* between writer and AI, each valid for different moments and different writers.

| Mode | Authorship | The writer feels... |
|------|-----------|---------------------|
| Refine | 100% writer | "That's me, cleaned up." |
| Soft Press | Mostly writer (~80/20) | "That's me, but on a better day." |
| Deep Press | Shared | "That's what I was trying to say." |

The key design principle: **this is a choice the writer makes, not something that happens to them.** The spectrum is explicit, and the writer always knows which mode they're in.

The parallel to Theodore Twombly's job in the film "Her" is instructive. Theodore takes other people's raw emotional material and writes beautiful letters in their voice. Deep Press does essentially the same thing. The difference: Theodore's clients skip the hard work of reflection. Pulp's provocation rounds ensure the writer *earns* the output — they've done the thinking, the wrestling, the excavation. By the time the AI writes, it's working from genuine raw material, not guessing.

Soft Press exists because sometimes you want Theodore to stay closer to your own phrasing — to improve your letter, not rewrite it. Refine exists because sometimes you don't want Theodore at all — you just want a copy editor. The app respects all three needs equally.

### Making the spectrum tangible

The spectrum is not just theoretical — it's surfaced to the writer as a concrete number. After any transformation, the app shows authorship as a percentage: *"156 words · 81% yours."* This is the ratio of the writer's input word count to the output word count. Refine barely changes word count (97–99% yours). Soft Press adds light connective tissue (typically 80–90% yours). Deep Press composes new prose and the percentage drops accordingly (often 35–50% yours). The numbers naturally align with the spectrum because each mode is defined by how much it *adds*, not how much it *changes*.

The computation is deliberately volume-based, not word-level. A word-level diff — tracking which specific words survived transformation — would penalize Soft Press unfairly. When Soft Press rewrites a clumsy sentence into a cleaner one, the *words* changed but the *authorship* didn't: the idea, the intent, and the voice are still the writer's. The volume ratio sidesteps this by measuring how much of the final output's length came from the writer's input. Sentence-level rewrites don't register as lost authorship, which is correct — they're changes in execution, not ownership.

When the writer accepts the output ("continue with this"), the metric resets. The transformed text becomes their working text — theirs to build on, provoke, or transform again. Each transformation cycle is independent. There is no cumulative decline, no number that creeps downward over a session. The percentage appears when it's meaningful — an active transformation to measure against — and disappears when the writer reclaims the text as their own.

---

## Design Principles

- **Monochrome + one accent.** Black/white/gray base. Provocations in a single accent color (currently teal).
- **Typographic hierarchy.** User text in a warm sans-serif. Provocations in a contrasting mono. Deep Press output in a serif. Clear visual separation so the writer always knows what's theirs and what's shared. Refine and Soft Press output use the same sans-serif as the writer's own text — because authorship hasn't fundamentally shifted.
- **Inline provocations.** Provocations appear as dismissable annotation blocks inside the editor — highlighter-styled, with an X to dismiss. They live between user paragraphs, never displacing the user's text.
- **Minimal chrome.** No sidebars, no toolbars, no menus. The writing surface dominates. The blank page should feel peaceful and inviting.
- **Progressive disclosure.** Only show what's relevant to the current state. Press intensity (Soft/Deep) is revealed when the writer chooses to press, not before.
- **Cyclical flow.** Nothing is a dead end. The writer can always go back to writing after any transformation. Refine and Press are waypoints, not destinations.
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
  write/[id]/page.tsx         # Orchestrator (Canvas for writing/provoking, DraftView for refine/press)
  api/pulp/route.ts           # Provoke endpoint (returns fragments + provocations as JSON)
  api/draft/route.ts          # Refine + Press endpoint (streams prose, mode param selects prompt)
components/
  canvas.tsx                  # TipTap editor + toolbar (provoke, refine, press buttons)
  provocation-node.tsx        # React node view for inline provocation blocks
  draft-view.tsx              # Streaming + editable output display (refine/press results)
  round-indicator.tsx         # Current state label
  loading.tsx                 # Loading animation
lib/
  types.ts                    # Session, DraftMode, PulpResponse types
  provocation-extension.ts    # Custom TipTap node extension for provocations
  prompts.ts                  # All AI system/user prompts (provoke, refine, soft press, deep press)
  store.ts                    # useSessions / useSession hooks + localStorage
  utils.ts                    # ID generation, filename utils
```

### Data Model
```typescript
type DraftMode = "refine" | "soft" | "deep";

Session {
  id, title, direction, createdAt, updatedAt,
  state: "writing" | "provoking" | "refining" | "refine" | "pressing" | "press",
  content: string,            // current working text, persisted to localStorage
  provocationCount: number,   // how many times the user has provoked
  draft: string | null,       // refine/press output
  draftMode: DraftMode | null, // which mode produced the current output
  rawContent: string | null   // pre-transformation text (for revert)
}
```

Provocations are ephemeral — they exist only as TipTap nodes in the editor's in-memory document. On refresh, the user gets their text back and can provoke again. The API response shape (`PulpResponse` with `fragments[]` and `provocations[]`) is unchanged.

### Action Language
- User-facing toolbar: **Provoke** · **Refine** · **Press** (▾ **Soft** · **Deep**)
- After output: **continue with this** · **revert** · copy · download · back to home
- Internal API: `/api/pulp` (provoke), `/api/draft?mode=refine|soft|deep` (refine/soft press/deep press)

---

## Open Questions

- **Post-output AI assistance.** After Refine or Press, the writer can select any passage and invoke a narrow contextual AI operation on it (deepen, cut, rephrase, match voice, end here). See `docs/INLINE-EDITING.md` for the full spec.
- **Persistence.** Currently localStorage only. If this becomes a real product, what's the storage story?
- **Version history.** The cyclical flow means a session could go through many transformations. Should there be a way to see or restore previous versions beyond the immediate revert?
- **Mobile experience.** Three toolbar buttons (with Press expanding to sub-options) — does this work well on small screens?
- **Soft Press visual treatment.** Refine and Soft Press both use the writer's sans-serif font. Should Soft Press have any visual indicator that light AI collaboration occurred, or does the mode label suffice?
