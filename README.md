# Pulp

A writing tool that inverts the AI-writing workflow. Instead of AI writing first and humans editing, humans write first — raw, unstructured, stream-of-consciousness — and AI helps them think deeper and say it better.

<!-- [Live demo](https://pulp.vercel.app) — TODO: add URL after deploy -->

## What It Does

Most AI writing tools start with a blank prompt and generate text for you. Pulp does the opposite: you write first, then AI plays three distinct roles to help you get where you're going.

**Provoke** — AI reads your raw text, splits it at its natural seams, and inserts terse, curious provocations inline: `failure?`, `who specifically?`, `the real version?`. Not therapy, not coaching — just a thinking partner pointing at the interesting parts of your own ideas. You write more, provoke again, as many rounds as you need.

**Polish** — AI cleans up your words without replacing them. Fixes grammar, smooths rough edges, preserves your voice exactly. You read the output and can't tell what changed. Authorship: entirely yours.

**Press** — AI takes everything you've written and composes new prose from it — finding the deeper structure, giving half-formed thoughts their full expression. The writer's ideas, the AI's craft. Authorship: shared.

The flow is cyclical, not linear. After any transformation you can continue writing, provoke again, try the other mode, or revert to your raw text. Nothing is ever lost.

## Tech Stack

- **Next.js 16** (App Router, Turbopack) with **React 19** and **TypeScript** (strict mode)
- **Tailwind CSS v4** — design tokens, dark/light themes, no config file
- **TipTap** rich text editor with a **custom node extension** for rendering inline provocations as React components
- **Anthropic Claude Sonnet 4.6** via **Vercel AI SDK** — streaming responses for Polish/Press, structured JSON for Provoke
- **Fully client-side** — all writing stored in browser localStorage, no database, no server-side persistence
- **BYOK** (bring your own key) — users provide their Anthropic API key, stored locally, sent directly to the API

## Architecture

**State machine**: Sessions cycle through `writing → provoking → writing` (provoke loop) or `writing → polishing/drafting → polish/draft → writing` (transform loop). The state machine enforces valid transitions and enables revert at any point.

**Three-voice typography**: Font changes signal authorship. iA Writer Quattro for the writer's text and polished output. iA Writer Mono for system UI and provocations. Source Serif 4 for Press output only — a visual cue that this prose was co-authored.

**Custom TipTap extension**: Provocations are rendered as ephemeral React node views inside the editor. `buildDocWithProvocations()` interleaves the AI's fragment splits with inline provocation blocks. `extractUserText()` walks the document tree to extract only the writer's words, skipping provocation nodes.

**API design**: Two endpoints — `/api/pulp` returns structured JSON (fragments + provocations), `/api/draft` streams prose. Both accept the API key via header, falling back to a server-side key for development.

**Share links**: Sessions can be shared via URL using LZ-string compression — the full text is encoded in the URL fragment, no server round-trip needed.

## Getting Started

```bash
npm install
npm run dev
```

You'll need an Anthropic API key. The app prompts for it on first visit — it's stored in your browser's localStorage and never touches a server.

## Status

Early-stage product, actively developed. The core writing loop (write → provoke → polish/press) is fully functional. Built as an independent project exploring how AI tools can support human thinking rather than replace it.
