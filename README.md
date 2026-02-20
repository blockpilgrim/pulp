# Pulp

A writing tool that inverts the AI-writing flow. You write raw, AI provokes deeper thinking, then presses your ideas into a polished draft.

**write raw → pulp → press**

## How it works

1. **Write** — braindump your raw thoughts, stream of consciousness
2. **Pulp** — AI splits your text into fragments and inserts provocations: tiny nudges that push your thinking further
3. **Fill** — respond to provocations, add more, pulp again as many times as you want
4. **Press** — AI composes a draft from everything you've written, finding the deeper structure in your thinking

## Setup

```bash
npm install
npm run dev
```

Users provide their own Anthropic API key (BYOK). Keys are stored in the browser's localStorage and sent directly to Anthropic's API.

## Tech

- Next.js 16 (App Router)
- Tailwind CSS v4
- Anthropic Claude (via Vercel AI SDK)
- All data stored in browser localStorage
