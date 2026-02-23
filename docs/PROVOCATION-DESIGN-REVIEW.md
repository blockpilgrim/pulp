# Provocation Visual Design Review

**Date:** 2025-02-23
**Context:** Reviewing provocation styling in light mode against TYPOGRAPHY.md spec

---

## What's Working

- **Mono italic creates immediate textural contrast with Quattro body text** — you never confuse the two voices
- **The pill/badge shape** contains each provocation as a discrete object, not a line of text
- **The × dismiss** is appropriately quiet
- **Size contrast is clear** — provocations read as asides, not headings
- **The provocations themselves are sharp writing** ("the thing.", "who decided that?") — terse, pointed, genuinely provocative

---

## Main Problem: Highlights Are the Loudest Thing on the Page

The warm amber/orange background pulls the eye *before* the writer's prose. When reading the page, gaze jumps to the highlighted pills first, then the body text. That's an inverted hierarchy. The writer's voice should dominate; the provocations should be discoverable but secondary — like marginal notes, not sticky-note warnings.

They feel closer to "code review annotation" or "linter warning" than "a thoughtful friend leaning over and murmuring a question." The spec says provocations "don't shout" (weight 400), but the highlight background *does* shout.

### Specific Observations

1. **Visual weight of the highlight vs. the text color.** The body text is dark-on-cream, relatively quiet. The highlight is a saturated warm tone with high figure-ground contrast. It punches above its typographic station.

2. **Vertical rhythm.** The provocations sit quite tight between paragraphs. There's enough space to read, but the density of four provocations in this amount of text makes the page feel annotated rather than nudged. This is partly a content/AI-tuning issue, but the visual treatment amplifies it — a subtler treatment would make four provocations feel less like a marked-up manuscript.

3. **The highlight reads as "solid" rather than the "gradient" the spec calls for.** A gradient wash (fading out on the right edge, say) would soften the boundary and feel more like a highlighter pen stroke and less like a badge.

---

## Directions to Explore

- **Reduce highlight opacity significantly** — let the cream background bleed through more, so the provocation reads as a tinted whisper rather than a painted label
- **Try the left-bar treatment from dark mode in light mode too** — a thin accent-colored left border + slightly muted text might give provocations their own lane without the visual dominance of a filled background
- **Increase bottom margin slightly** — give each provocation a bit more breathing room from the paragraph below, so the writer's text has room to reassert itself
- **Test without a background entirely** — just mono italic + accent color text + a subtle left border might be enough differentiation. The font change alone (Quattro → Mono) plus the italic plus the smaller size is already three signals. The highlight might be a fourth signal that's doing more harm than good.

---

## Core Tension

The spec says provocations should look "unmistakably different from the writer's text," and they do — but *how* they're different matters. Right now the difference is loudness. It could instead be *quietness* — a provocation that's clearly system-voice but whispered, not highlighted.
