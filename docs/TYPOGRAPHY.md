# Pulp — Typographic Design Directive

---

## Philosophy

Pulp's product arc has three kinds of transformation — and the typography should distinguish them by what matters: who wrote it. **Refine** cleans up the writer's own words; authorship is unambiguous. **Soft Press** collaborates closely with the writer, filling gaps and elevating phrasing; authorship is mostly the writer's. **Deep Press** composes new prose from the writer's raw thinking; authorship is shared. These are fundamentally different acts, but only the last one crosses the typographic threshold.

When the writer is in the raw-thinking phase, the type should feel like a workspace — honest, unfinished, a little rough. When they Refine, the type stays the same — because the words are still theirs, just cleaned up. When they Soft Press, the type *still* stays the same — because the words are still recognizably theirs, just strengthened. The writer should read Soft Press output and think *"that's me, but on a better day"* — and the type confirms it by staying in their world. Only when they Deep Press does the type shift to something warmer and more literary. That moment of visual change *is* the product moment. The writer sees their messy thinking made beautiful.

This is directly inspired by iA Writer's core insight: **monospaced and quasi-monospaced type signals "work in progress."** It tells the writer: this text is about what it says, not how it looks. That's exactly what Pulp needs during the write and probe phases. But unlike iA Writer — which is purely a writing tool and stays in monospace throughout — Pulp has a second act. Deep Press is where craft appears. That's where serif enters. Refine and Soft Press, by contrast, stay in the workspace world — because the voice is still the writer's own.

The key nuance: the font change doesn't signal "AI helped" — it signals "AI wrote." Both Refine and Soft Press involve AI, but the authorship remains recognizably the writer's. The serif is earned only when the AI takes full creative ownership.

Three fonts. Two worlds. One transition that earns the serif.

---

## Font Stack

### Primary recommendation: self-host iA Writer fonts + keep Source Serif 4

| Role | Font | Source | CSS Variable |
|------|------|--------|--------------|
| **Writing surface** | iA Writer Quattro | Self-hosted (GitHub) | `--font-quattro` |
| **UI chrome** | iA Writer Mono | Self-hosted (GitHub) | `--font-mono` |
| **Deep Press output** | Source Serif 4 | Google Fonts | `--font-serif` |

### Why these three

**iA Writer Quattro** (writing surface) — Quattro uses 4 glyph widths. It approaches proportional spacing while retaining the honesty of a typewriter: wider word gaps, monospaced punctuation, generous letter-spacing. It reads beautifully for extended writing but still carries that "this is a draft, not a publication" signal. It fits more characters per line than true monospace, which matters on the narrow max-w-2xl canvas Pulp uses. No Google Font equivalent exists — Quattro's spacing model is unique.

**iA Writer Mono** (UI chrome, provocations, labels) — Strict monospace for everything that isn't the writer's prose. Provocations, buttons, metadata, round indicators, navigation. Mono communicates "system," "tool," "interface." Since Mono and Quattro share the same design DNA (both derived from IBM Plex, both reworked by iA with square dots and adjusted curves), they feel like family — unlike the current Geist Mono + Source Serif pairing, which are unrelated typefaces.

**Source Serif 4** (Deep Press output only) — The serif enters *only* when the AI composes new prose via Deep Press. Not when it Refines. Not when it Soft Presses. This is the reveal. The typographic shift from Quattro to Source Serif tells the writer: "your raw thinking has been transformed into something literary — authorship is now shared." Refine and Soft Press output stay in Quattro because the words are still recognizably the writer's own. Source Serif 4 is an excellent variable serif with optical sizing — it stays on Google Fonts for convenience since it's only loaded when Deep Press renders.

### Why not Google Font alternatives?

- **IBM Plex Mono** is the upstream of iA's fonts, but lacks their refinements: square dots (not round), adjusted swirls on specific letters, and critically, the Quattro spacing model doesn't exist in IBM Plex at all.
- **No Google Font replicates Quattro's 4-width model.** It's not monospace, not proportional — it's its own thing. The closest you'd get is using IBM Plex Mono (true monospace) or IBM Plex Sans (true proportional), and both miss the point.
- Self-hosting is trivial with `next/font/local` and actually eliminates the Google Fonts CDN dependency.

### Why not iA Writer Duo?

Duo uses 2 glyph widths (regular + 1.5x for M, W, m, w). It's the middle child — Quattro does everything Duo does but better for extended writing. Two fonts from the iA family (Mono + Quattro) is the right number. A third adds complexity without benefit.

### Why drop Geist Sans?

Geist Sans is currently barely used (the body class references it but almost nothing renders in it). Removing it eliminates a third unrelated typeface. Anything that would have been sans-serif can use Quattro (which reads as sans-serif) or the system font stack as fallback.

---

## Font Files

From the [iA-Fonts GitHub repo](https://github.com/iaolo/iA-Fonts):

### What to download

**Variable TTF files** (recommended — single file covers all weights):
```
iA Writer Mono/Variable/iAWriterMonoV.ttf
iA Writer Mono/Variable/iAWriterMonoV-Italic.ttf
iA Writer Quattro/Variable/iAWriterQuattroV.ttf
iA Writer Quattro/Variable/iAWriterQuattroV-Italic.ttf
```

**Alternative: Static WOFF2 files** (smaller per-file, but 4 files per family):
```
iA Writer Mono/Webfonts/iAWriterMonoS-Regular.woff2
iA Writer Mono/Webfonts/iAWriterMonoS-Italic.woff2
iA Writer Mono/Webfonts/iAWriterMonoS-Bold.woff2
iA Writer Mono/Webfonts/iAWriterMonoS-BoldItalic.woff2
iA Writer Quattro/Webfonts/iAWriterQuattroS-Regular.woff2
iA Writer Quattro/Webfonts/iAWriterQuattroS-Italic.woff2
iA Writer Quattro/Webfonts/iAWriterQuattroS-Bold.woff2
iA Writer Quattro/Webfonts/iAWriterQuattroS-BoldItalic.woff2
```

### Recommended approach

Use the **static WOFF2 files**. Reasons:
- WOFF2 is ~30% smaller than TTF due to Brotli compression
- Next.js `next/font/local` handles both formats, but WOFF2 ships less bytes
- We only need Regular, Italic, and Bold weights (no BoldItalic in current designs) — 6 total files
- Place in `/public/fonts/` or a `/fonts/` directory at project root

### License

The iA fonts are free and open source (SIL Open Font License, derived from IBM Plex). iA asks that you "reference iA Writer clearly" if forking or using the fonts. A comment in globals.css or a note in the README suffices.

---

## Type Roles & Specifications

### The Two Worlds

```
WORKSPACE WORLD (write, probe, refine,      LITERARY WORLD (deep press)
soft press)
─────────────────────────────────────────   ──────────────────────────────
iA Writer Quattro — writing surface         Source Serif 4 — deep-pressed prose
iA Writer Quattro — refine output           iA Writer Mono — UI chrome persists
iA Writer Quattro — soft press output
iA Writer Mono — everything else
```

The mono UI chrome stays constant across both worlds. It's the frame. Only the content font changes — and that single change carries all the meaning.

**Refine stays in the workspace world.** This is deliberate. Refine preserves the writer's words, voice, and structure — authorship is unambiguous. The type should confirm this: "these are still your words." Switching to serif would falsely signal a transformation of authorship that didn't happen.

**Soft Press stays in the workspace world too.** This is the important nuance. Soft Press involves real AI collaboration — restructuring, gap-filling, phrasing elevation — but the writer's words are still the foundation. At least 80% of the output is recognizably the writer's own language. The type confirms this by staying in Quattro: "these are still your words, strengthened." Switching to serif here would overstate the AI's role and undercut the writer's ownership.

**Deep Press crosses into the literary world.** Deep Press composes new prose. Authorship is shared. The serif signals this honestly: "something new has been written from your thinking."

The writer can always **revert** — returning to their raw text and the workspace world. And they can **continue** with any output — taking it back to the canvas for more writing, probing, or another transformation. The flow is cyclical; the typography follows.

---

### Writing Surface (the single canvas)

The most important text in the app. Everything happens here — braindumping, responding to inline provocations, continuing after Refine or Press. One continuous TipTap editor.

| Property | Value | Notes |
|----------|-------|-------|
| Font | iA Writer Quattro | 4-width quasi-proportional |
| Size | 1.125rem (18px) | Large enough to feel generous, not cramped |
| Line-height | 1.8 | Airy. Gives each line room to breathe |
| Weight | 400 (Regular) | Normal weight — no emphasis on the container |
| Color | `var(--foreground)` | Full contrast — this is the writer's voice |
| Caret | `var(--accent)` | Burnt sienna caret — the one warm element |
| Letter-spacing | 0 (default) | Quattro's built-in spacing is already generous |
| Max-width | ~65ch | Optimal reading measure for this size |

**Mobile (< 640px):** Size drops to 1rem (16px). Line-height stays 1.8.

**Placeholder text:** Quattro Italic, `var(--muted-light)`, same size. The italic differentiates placeholder from real text within the same typeface.

### Provocations (AI thinking-partner nudges)

These must look unmistakably different from the writer's text. They're system-inserted, mono, italic, accented — a different voice entirely.

| Property | Value | Notes |
|----------|-------|-------|
| Font | iA Writer Mono | Strict monospace = "this is the tool speaking" |
| Size | 0.8125rem (13px) | Noticeably smaller than writing text |
| Line-height | 1.6 | Tighter than body — compact, terse |
| Weight | 400 | Regular — provocations don't shout |
| Style | Italic | Further distinguishes from writer's text |
| Color | `var(--provocation-color)` | Accent-dark in light mode, muted in dark mode |
| Letter-spacing | 0.01em | Slight openness for readability at small size |
| Background | Highlighter gradient (light) | Gradient on `.provocation-text` in light mode |
| Border | Left bar (dark) | 2px accent left border replaces highlighter in dark mode |
| Block margin | 0.25rem top, 0.75rem bottom | Tight top margin couples provocation to preceding text |

### Refine Output (writer's words, cleaned up)

Refine preserves the writer's words and voice. The type confirms this by staying in the workspace font.

| Property | Value | Notes |
|----------|-------|-------|
| Font | iA Writer Quattro | Same as writing surface — these are still the writer's words |
| Size | 1.125rem (18px) | Same size as writing surface — visual continuity |
| Line-height | 1.8 | Same as writing surface |
| Weight | 400 | Regular |
| Color | `var(--foreground)` | Full contrast |
| Caret | `var(--accent)` | When editing |

The writer should read Refine output and barely notice a typographic change — because there isn't one. The text looks the same; the words are cleaner. That's the point.

**Mobile (< 640px):** Same responsive behavior as writing surface.

### Soft Press Output (writer's words, strengthened)

Soft Press collaborates with the writer but stays anchored to their voice. The type confirms this by remaining in Quattro — the workspace world. The AI's contribution (restructuring, gap-filling, phrasing elevation) is real but invisible in the typography, because the writer's ownership is still dominant.

| Property | Value | Notes |
|----------|-------|-------|
| Font | iA Writer Quattro | Same as writing surface — these are still recognizably the writer's words |
| Size | 1.125rem (18px) | Same size as writing surface — visual continuity |
| Line-height | 1.8 | Same as writing surface |
| Weight | 400 | Regular |
| Color | `var(--foreground)` | Full contrast |
| Caret | `var(--accent)` | When editing |

Soft Press and Refine are typographically identical. The distinction lives in the mode label, not the type. This is intentional — both outputs belong to the writer. If you need to tell Refine from Soft Press, you check the label; if you need to tell the writer's world from the AI's world, you check the font. These are orthogonal concerns.

**Mobile (< 640px):** Same responsive behavior as writing surface.

### Deep Press Output (AI-composed prose)

This is the transformation moment. The font changes from Quattro to Source Serif 4. The writer sees their raw thinking made literary. Authorship is now shared.

| Property | Value | Notes |
|----------|-------|-------|
| Font | Source Serif 4 | Serif enters — signals "new prose has been composed" |
| Size | 1.125rem (18px) | Same size as writing surface — continuity of scale |
| Line-height | 1.9 | Slightly more generous than writing — more finished |
| Weight | 400 | Regular |
| Color | `var(--foreground)` | Full contrast |
| Caret | `var(--accent)` | When editing |

The size parity between writing surface (Quattro 18px) and Deep Press (Serif 18px) is deliberate. The words occupy the same space — only the character changes. Raw becomes refined without getting bigger or louder.

**Mobile (< 640px):** Size drops to 1rem. Line-height to 1.8.

### Continue / Revert Actions

After any transformation, the writer sees "continue with this" and "revert" actions. These follow the standard navigation link style (Mono, 12px, muted). When the writer continues with Refine or Soft Press output, the text returns to the canvas in Quattro — seamless, since it was already in Quattro. When they continue with Deep Press output, the text also returns to the canvas in Quattro — because it's now their working text again, back in the workspace world.

### Home Page Hero

The "Pulp" title uses Quattro — not Mono — because "pulp" metaphorically refers to the writer's raw material. The product name lives in the writer's world, not the system's. This is a deliberate exception to the "anything that isn't the writer's text is Mono" rule.

| Property | Value | Notes |
|----------|-------|-------|
| Font | iA Writer Quattro | Writer's world — "pulp" = raw material |
| Size | 4rem (64px) | Display size — proto-logotype |
| Line-height | 1 | Tight — single word |
| Weight | 300 (Light) | Thin strokes at this scale create rawness |
| Letter-spacing | -0.03em | Tightened for display |
| Color | `var(--foreground)` | Full contrast |

The tagline ("Your raw thinking, fully expressed.") and direction input placeholder use **Mono italic** — the system speaking, inviting the writer in. The vertical rhythm groups into two tight clusters (title+tagline, input+button) with a structural break between them.

### Page Title (session heading)

| Property | Value | Notes |
|----------|-------|-------|
| Font | iA Writer Quattro | Part of the workspace world |
| Size | 1.75rem (28px) | Largest text on the write page |
| Line-height | 1.15 | Tight — titles don't need line spacing |
| Weight | 300 (Light) | Light weight creates elegance at large size |
| Letter-spacing | -0.02em | Slight tightening at display size |
| Color | `var(--foreground)` | Full contrast |

### Section Headers (if we add them)

For any future section headers within the writing or draft view:

| Property | Value |
|----------|-------|
| Font | iA Writer Quattro |
| Size | 1.25rem (20px) |
| Line-height | 1.3 |
| Weight | 600 (Bold) |
| Letter-spacing | -0.01em |
| Color | `var(--foreground)` |

### Subheaders

| Property | Value |
|----------|-------|
| Font | iA Writer Quattro |
| Size | 1.0625rem (17px) |
| Line-height | 1.4 |
| Weight | 600 |
| Letter-spacing | 0 |
| Color | `var(--foreground)` |

### Buttons

| Property | Value | Notes |
|----------|-------|-------|
| Font | iA Writer Mono | UI chrome = mono |
| Size | 0.8125rem (13px) | |
| Line-height | 1 | Buttons are single-line |
| Weight | 500 (Medium) | Slightly heavier for tap-target clarity |
| Letter-spacing | 0.02em | Opens up at small size |
| Text-transform | None | Sentence case, not uppercase |

### Labels & Metadata (probe count, word count, timestamps)

| Property | Value | Notes |
|----------|-------|-------|
| Font | iA Writer Mono | |
| Size | 0.6875rem (11px) | Smallest text in the system |
| Line-height | 1 | |
| Weight | 400 | |
| Letter-spacing | 0.08em | Wide tracking for readability at tiny size |
| Text-transform | Uppercase | Distinguishes metadata from content |
| Color | `var(--muted)` | Subdued — not competing with content |

### Captions & Hints (direction hints, helper text)

| Property | Value |
|----------|-------|
| Font | iA Writer Mono |
| Size | 0.75rem (12px) |
| Line-height | 1.4 |
| Weight | 400 |
| Style | Italic |
| Color | `var(--muted)` |

### Navigation Links (header "pulp" link, action links)

| Property | Value |
|----------|-------|
| Font | iA Writer Mono |
| Size | 0.75rem (12px) |
| Line-height | 1 |
| Weight | 400 |
| Color | `var(--muted)` → `var(--accent)` on hover |
| Text-decoration | Underline on hover, 3px offset |

### Footer / Fine Print

| Property | Value |
|----------|-------|
| Font | iA Writer Mono |
| Size | 0.625rem (10px) |
| Line-height | 1.4 |
| Weight | 400 |
| Color | `var(--muted-light)` |

---

## Complete Type Scale

A rationalized scale replacing the current ad-hoc sizes:

```
--type-3xs:  0.625rem    (10px)   footer, fine print
--type-2xs:  0.6875rem   (11px)   labels, metadata, timestamps
--type-xs:   0.75rem     (12px)   captions, hints, nav links
--type-sm:   0.8125rem   (13px)   buttons, provocations, UI text
--type-base: 0.9375rem   (15px)   secondary body text
--type-md:   1.0625rem   (17px)   subheaders
--type-lg:   1.125rem    (18px)   writing surface, draft text
--type-xl:   1.25rem     (20px)   section headers
--type-2xl:  1.75rem     (28px)   page titles
```

Each step is intentional. The gaps are larger at the top (where hierarchy needs to be clear) and smaller at the bottom (where UI text variations are subtle).

---

## The Three Transitions

### Refine: the non-transition

```
BEFORE (writing)                      AFTER (refine)
──────────────────────────            ──────────────────────────

iA Writer Quattro 18/1.8              iA Writer Quattro 18/1.8

what if the thing i'm                 What if the thing I'm
really afraid of isnt                 really afraid of isn't
failure but the specific              failure, but the specific
shape of success that                 shape of success that
other people want for me              other people want for me?
```

Same font. Same size. Same world. The words are cleaner — grammar fixed, punctuation added, rough edges smoothed — but the type confirms: these are still yours. The non-transition is the message.

### Soft Press: the near-non-transition

```
BEFORE (writing)                      AFTER (soft press)
──────────────────────────            ──────────────────────────

iA Writer Quattro 18/1.8              iA Writer Quattro 18/1.8

what if the thing i'm                 What if the thing I'm really
really afraid of isnt                 afraid of isn't failure — it's
failure but the specific              the specific shape of success
shape of success that                 that other people want for me.
other people want for me              The version of my life that
                                      would make them comfortable.
```

Same font. Same size. Same world — but the words have been *worked*. The AI restructured, smoothed transitions, filled a gap with a clarifying sentence. The writer reads it and thinks: "that's me, but on a better day." The type stays in Quattro because the voice is still theirs. The near-non-transition tells the writer: the AI helped, but you're still the author.

### Deep Press: the transformation

```
BEFORE (writing)                      AFTER (deep press)
──────────────────────────            ──────────────────────────

iA Writer Quattro 18/1.8              Source Serif 4 18/1.9

what if the thing i'm                 There is a quiet violence
really afraid of isn't                in living according to
failure but the specific              someone else's map. The
shape of success that                 fear was never failure —
other people want for me              it was the particular
                                      shape of success that
                                      others had drawn for you.
```

Same size. Same column width. Same basic density. But the character of the text shifts from functional to literary. Quattro's even spacing and square geometry gives way to Source Serif's organic curves, varied widths, and serif details. The writer's raw thinking has been "deep pressed" — and the type tells them so.

All three transitions should be animated — a brief fade or crossfade as the output streams in. But only Deep Press should feel like an unveiling. Refine should feel like a quiet cleanup. Soft Press should feel like a gentle strengthening — noticeable if you're looking, invisible if you're not.

---

## Responsive Behavior

### Mobile (< 640px)

| Element | Desktop | Mobile |
|---------|---------|--------|
| Writing surface | 1.125rem / 1.8 | 1rem / 1.8 |
| Refine output | 1.125rem / 1.8 | 1rem / 1.8 |
| Soft Press output | 1.125rem / 1.8 | 1rem / 1.8 |
| Deep Press output | 1.125rem / 1.9 | 1rem / 1.8 |
| Provocations | 0.8125rem / 1.6 | 0.75rem / 1.6 |
| Buttons | 0.8125rem | 0.875rem (slightly larger for touch) |
| Page title | 1.75rem | 1.5rem |
| Labels | 0.6875rem | 0.6875rem (no change) |

### Large screens (> 1280px)

No type size increases. The max-w-2xl container keeps the measure optimal. Larger screens just get more whitespace around the content column — which reinforces the "blank page" feeling.

---

## Implementation Notes

### next/font/local setup

```typescript
import localFont from "next/font/local";
import { Source_Serif_4 } from "next/font/google";

const iaQuattro = localFont({
  src: [
    { path: "./fonts/iAWriterQuattroS-Regular.woff2", weight: "400", style: "normal" },
    { path: "./fonts/iAWriterQuattroS-Italic.woff2", weight: "400", style: "italic" },
    { path: "./fonts/iAWriterQuattroS-Bold.woff2", weight: "700", style: "normal" },
    { path: "./fonts/iAWriterQuattroS-BoldItalic.woff2", weight: "700", style: "italic" },
  ],
  variable: "--font-quattro",
  display: "swap",
});

const iaMono = localFont({
  src: [
    { path: "./fonts/iAWriterMonoS-Regular.woff2", weight: "400", style: "normal" },
    { path: "./fonts/iAWriterMonoS-Italic.woff2", weight: "400", style: "italic" },
    { path: "./fonts/iAWriterMonoS-Bold.woff2", weight: "500", style: "normal" },
  ],
  variable: "--font-ia-mono",  // NOT --font-mono (conflicts with Tailwind theme var)
  display: "swap",
});

const sourceSerif = Source_Serif_4({
  variable: "--font-serif",
  subsets: ["latin"],
  display: "swap",
  style: ["normal", "italic"],
  weight: ["300", "400", "600"],
});
```

### Tailwind theme mapping

Note: next/font's CSS variable for Mono must differ from Tailwind's theme variable to avoid a circular reference. We use `--font-ia-mono` for next/font and map it to `--font-mono` via @theme.

```css
@theme {
  --font-sans: var(--font-quattro), ui-sans-serif, system-ui, sans-serif;
  --font-mono: var(--font-ia-mono), ui-monospace, monospace;
  --font-serif: var(--font-source-serif), "Georgia", serif;
}
```

### Body base font

The body element must have an explicit `font-family` declaration so elements without a Tailwind font class inherit Quattro rather than falling to the browser default:

```css
body {
  font-family: var(--font-quattro), ui-sans-serif, system-ui, sans-serif;
}
```

### Font attribution

Add to README or globals.css:
```
/* Typography: iA Writer Mono & Quattro (SIL Open Font License)
   https://github.com/iaolo/iA-Fonts — a modification of IBM Plex by iA
   Draft view: Source Serif 4 via Google Fonts */
```

---

## Summary

| What changed | Before | After | Why |
|-------------|--------|-------|-----|
| Writing surface | Source Serif 4 (serif) | iA Writer Quattro (4-width) | Signals "work in progress," not "publication" |
| UI mono | Geist Mono | iA Writer Mono | Same family as Quattro — unified design DNA |
| Refine output | Source Serif 4 | iA Writer Quattro | Writer's own words — stays in workspace world |
| Soft Press output | (n/a — new mode) | iA Writer Quattro | Writer's words, strengthened — still the writer's world |
| Deep Press output | Source Serif 4 | Source Serif 4 (unchanged) | Serif reserved for the shared-authorship moment |
| Sans-serif | Geist Sans | Removed | Barely used; Quattro fills this role |
| Font loading | 3 Google Fonts | 2 self-hosted + 1 Google Font | Eliminates CDN dependency for primary fonts |
| Type scale | Ad-hoc sizes | Rationalized 9-step scale | Consistent hierarchy across all contexts |
| Home hero | 1.75rem serif | 4rem Quattro Light | Proto-logotype; "pulp" = writer's raw material |
| Home tagline | Quattro | Mono italic | System voice — tool speaking to user |
| Provocations (dark) | Highlighter gradient | Left bar + muted text | Adapts to dark mode without noisy highlights |
| Core idea | Same font for everything | Font change signals authorship change | Refine + Soft Press = your words (Quattro). Deep Press = shared prose (Serif). |
