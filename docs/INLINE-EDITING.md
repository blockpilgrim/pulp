# Pulp — Inline Editing (Post-Output)

Selection-based contextual AI editing after a Polish or Press output.

---

## The Gap

The current output flow ends at the wrong place. The writer gets a pressed or polished piece — sometimes beautiful — and then immediately leaves Pulp to edit it somewhere else. The tool that did the most interesting work becomes a waystation.

The problem is more specific than "the editing experience could be better." It's that the cyclical write → provoke → press flow produces an output the writer *almost* loves, and the one passage that's slightly off — slightly generic, slightly too long, slightly drifted from their voice — has no path to fix inside Pulp. So the writer copies out, edits in Notes or Notion, and Pulp has lost both the session and the writer's attention.

Inline editing closes this loop. After Press or Polish output is complete, the writer can select any passage and invoke a narrow, contextual AI operation on it. The replacement is surgical: the rest of the piece is untouched. The operation streams in, and the original is always one click away.

---

## Operations

Five operations, each with a distinct job and tone:

| Operation | What it does | Analogous to |
|---|---|---|
| **deepen** | Follow the thread further. Draw out the implication that's almost there. | A local Press |
| **cut** | Tighten aggressively. Remove what isn't earning its place. | A local Polish, aggressive |
| **rephrase** | Same meaning, different angle. Try a construction the writer didn't use. | A local Polish, creative |
| **match voice** | AI has drifted. Pull this passage back toward the writer's actual register. | Voice correction |
| **end here** | Reshape this passage so it lands as a closing beat. Give it finality. | Structural edit |

A freeform text input is also available for any instruction that doesn't fit these five. The five labeled operations are essentially pre-filled prompts — the freeform input is the same mechanism without the label.

Operations are not a hierarchy. "Deepen" is not better than "cut." They're tools; the writer picks the one that fits what the passage needs.

---

## Design Principles

**Every edit is anchored to the original raw thinking.**
The AI's prompt always includes the writer's raw pre-output content as a voice anchor. This is what separates this from Notion AI's generic "improve writing." The operation is surgical; the anchor is not. Even when editing a single sentence, the AI is drawing from the writer's actual words and rhythms, not just the polished surface.

**Narrow scope.**
The prompt operates on the selection + a small context window (~300 chars on each side for coherence). It cannot and should not rewrite the whole piece from a sentence selection. If the writer wants global changes, they can return to canvas via "continue with this" and run Press again.

**Instant revert.**
The original selection is stored before any operation. A single "undo" click (or `⌘Z`) restores it exactly. No cascading state changes — just a text splice.

**No silent changes.**
The replacement streams into the document visibly. The writer sees what's happening and can abandon it. Nothing is applied to the stored session state until the operation completes.

**Authorship signal.**
"Deepen" is Press-like: the AI is writing. "Cut" and "rephrase" are Polish-like: the AI is editing. The popover doesn't need to label this explicitly, but the operations should be grouped or ordered to implicitly signal the spectrum (edit operations first, writing operations second).

---

## UX Specification

### Trigger
After streaming completes (state is `draft` or `polish`, `streaming` is false), selecting any text in the output surfaces a floating popover near the selection — above it if there's room, below if not.

The popover does not appear during streaming, while a previous inline operation is in progress, or when the selection is collapsed (no text selected).

### Popover contents
```
[ deepen ]  [ cut ]  [ rephrase ]  [ match voice ]  [ end here ]
[ ______________________________ ] ← freeform input
```

Small, monospace, quiet. Same visual language as the provocation pills — accent-tinted but not dominant. The writer's text is still the loudest thing on the page.

### Application flow
1. Writer selects passage. Popover appears.
2. Writer clicks an operation (or types a freeform instruction and hits Enter).
3. Popover closes. Selection is highlighted with a subtle loading state (muted accent tint, pulsing).
4. Replacement streams in, replacing the loading state token by token. Context around the selection is untouched.
5. On completion: a small inline indicator appears ("undo" or ×) that reverts the edit. It fades after ~8 seconds of inactivity or on next selection.

If the operation fails, the original selection is restored silently. No error modals — just a quiet fallback to the previous state.

---

## Technical Implementation

### The DraftView problem

DraftView currently uses:
- A `<div>` during streaming (non-editable, `whitespace-pre-wrap`)
- A `<textarea>` after streaming (plain text editing)

Neither of these supports selection-based floating UI natively. There are two paths forward:

**Option A — Migrate DraftView to TipTap (recommended)**
Replace the post-streaming `<textarea>` with a TipTap editor. Use TipTap's `BubbleMenu` extension for the popover — it's exactly designed for this pattern: floating toolbar that appears on selection, disappears on deselect.

TipTap is already in the project. The migration is:
- On streaming complete, load the streamed text into a TipTap editor via `editor.commands.setContent(htmlFromText(draft))`
- `htmlFromText`: convert `\n\n`-delimited plain text into `<p>` blocks (simple string transform)
- Add `BubbleMenu` with the operation buttons
- On operation complete, apply replacement via `editor.chain().deleteRange({from, to}).insertContent(replacement).run()`
- On serialize (copy, download, continue), extract plain text back via `editor.getText({ blockSeparator: '\n\n' })`

The streaming phase stays as a `<div>` — no change there. Only the editable state after streaming migrates.

**Option B — Custom selection detection on `<textarea>` (simpler v1)**
Use `selectionchange` + `getBoundingClientRect()` to position a custom popover above the selection. When an operation is triggered, capture `textarea.selectionStart`/`selectionEnd`, store the original substring, call the API, replace the substring when complete (no streaming in-place — loading indicator, then swap).

Simpler to implement, no new TipTap complexity. But: no per-token streaming in the edit (only final-replace), less precise popover positioning, and the approach doesn't scale to richer operations later. Option A is the right long-term shape.

### New API route: `/api/edit`

```typescript
// POST /api/edit
{
  selection: string,       // the selected text
  contextBefore: string,   // ~300 chars before selection
  contextAfter: string,    // ~300 chars after selection
  rawThinking: string,     // the pre-output content (voice anchor)
  operation: EditOperation, // see below
  direction?: string
}

type EditOperation =
  | "deepen"
  | "cut"
  | "rephrase"
  | "match-voice"
  | "end-here"
  | { custom: string };    // freeform instruction
```

Response: streamed replacement text (same streaming pattern as `/api/draft`).

The route needs `rawThinking` passed in. Currently `rawContent` is stored on the session and accessible from the write page — it needs to be passed down through DraftView props (or the write page can pass it in the API call directly).

### State changes

DraftView needs a new local state field:

```typescript
type InlineEdit = {
  from: number;         // character offset in the current text
  to: number;
  original: string;     // original selection text, for revert
  replacement: string;  // current replacement (streams in)
  status: "loading" | "streaming" | "done";
};

const [activeEdit, setActiveEdit] = useState<InlineEdit | null>(null);
```

The session-level `draft` in localStorage is only updated after the inline operation completes (on `status === "done"`). During streaming, the replacement lives only in local state.

---

## Prompt Design

### System prompt (shared across all operations)

```
You are making a surgical edit to a single passage in a piece of writing. The piece was composed from a human's raw thinking.

Your only job: replace the selected passage with a better version, as defined by the operation. The rest of the piece is untouched and must remain coherent with whatever you produce.

RULES:
- Return ONLY the replacement text. No preamble, no explanation, no meta-commentary.
- Match the length and register of the surrounding text unless the operation explicitly changes it.
- Never introduce ideas the writer didn't gesture toward in their raw thinking.
- Never use AI-essay phrases.
```

### Per-operation user prompt template

```typescript
const EDIT_USER = (
  selection: string,
  contextBefore: string,
  contextAfter: string,
  rawThinking: string,
  operation: EditOperation,
  direction?: string
) => {
  const opInstructions: Record<string, string> = {
    "deepen":
      "Follow the thread further. Draw out the implication that's almost there. " +
      "Stay in the writer's register. Don't pad — go deeper or don't go at all.",
    "cut":
      "Tighten aggressively. Remove everything that isn't earning its place. " +
      "Same idea, fewer words, more impact.",
    "rephrase":
      "Reword this. Same meaning, different construction. " +
      "Try an angle the writer didn't use, but keep their voice.",
    "match-voice":
      "This passage has drifted from the writer's voice. Pull it back. " +
      "Use their vocabulary, cadence, and register. Make it sound like them again.",
    "end-here":
      "Reshape this as a closing beat. Give it finality. Let the piece rest on it.",
  };

  const instruction =
    typeof operation === "string"
      ? opInstructions[operation]
      : `The writer's instruction: "${operation.custom}"`;

  return `
Here is the writer's original raw thinking (voice anchor — use this to calibrate their register):
---
${rawThinking}
---
${direction ? `\nTheir stated direction: "${direction}"\n` : ""}
Here is the passage you are editing, with its surrounding context:

[...${contextBefore}]
>>> ${selection} <<<
[...${contextAfter}]

Operation: ${instruction}

Replace only the >>> selected passage <<<. Return ONLY the replacement text.
`.trim();
};
```

### Temperature per operation

| Operation | Temperature | Rationale |
|---|---|---|
| deepen | 0.65 | Generative — needs some reach |
| cut | 0.2 | Precise — tightening is deterministic |
| rephrase | 0.55 | Creative but bounded |
| match-voice | 0.25 | Corrective — match, don't invent |
| end-here | 0.55 | Structural — some craft, some precision |
| custom | 0.5 | Neutral default |

---

## Component Changes

### `components/draft-view.tsx`
- Accept new prop: `rawContent: string` (for voice anchor)
- If going TipTap (Option A): replace `<textarea>` with TipTap editor; add `BubbleMenu`; add `activeEdit` state
- If staying textarea (Option B): add `selectionchange` listener; add custom positioned popover

### `app/write/[id]/page.tsx`
- Pass `session.rawContent` down to `DraftView`
- Add `handleInlineEdit` callback: calls `/api/edit`, handles streaming, updates draft on complete

### `lib/types.ts`
- Add `EditOperation` type
- Add `InlineEdit` type (if not kept local to DraftView)

### `lib/prompts.ts`
- Add `EDIT_SYSTEM` and `EDIT_USER` exports (see above)

### New: `app/api/edit/route.ts`
- Mirrors `/api/draft` structure
- Accepts `{selection, contextBefore, contextAfter, rawThinking, operation, direction}`
- Streams replacement text

---

## Open Questions

- **How long a selection is reasonable?** A word, a sentence, a full paragraph should all work. A multi-paragraph selection is technically possible but the coherence constraint gets harder to satisfy — consider a max character count with a UI indicator.

- **Multiple inline edits in one session.** After one edit completes and the inline indicator fades, the writer should be able to make another. Is there a cap, or unlimited? Unlimited is fine — each edit is independent.

- **Should inline edits appear in the version history?** If version history is ever added, inline edits are a distinct transformation. Whether they each get a snapshot (expensive) or are accumulated before the next major version is a design decision for that feature.

- **Freeform input UX.** The freeform field is the escape hatch for anything the five labeled operations don't cover. Should it remain visible at all times in the popover, or be a secondary disclosure ("more...")? Visible-but-secondary (smaller, below the operation row) seems right — don't hide it, but don't make it the primary affordance.

- **Undo behavior.** The inline "undo" indicator covers reverting the most recent inline edit. But `⌘Z` on a TipTap editor will also undo. These need to be the same action — or the TipTap undo history needs to be managed so `⌘Z` doesn't undo in unexpected ways across streaming operations.
