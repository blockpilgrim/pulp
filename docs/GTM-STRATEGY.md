# Pulp GTM Strategy

Updated: 2026-03-21

## Strategic Thesis

Pulp should not go to market as a generic AI writing tool.

That category is crowded, cheap, and mentally owned by products like [ChatGPT](https://chatgpt.com/), [Claude](https://claude.ai/), [Grammarly](https://www.grammarly.com/ai), [Notion AI](https://www.notion.com/product/ai), [Lex](https://lex.page/), [Jasper](https://www.jasper.ai/), and [Copy.ai](https://www.copy.ai/). If Pulp presents itself as "AI that helps you write," it will be flattened into that commodity pile.

Pulp has a real wedge only if it is positioned as an authorship-preserving writing partner for people who want help thinking and shaping, not outsourcing the act of writing.

The sharpest category frame is:

- AI that helps you figure out what you mean before it writes
- A writing tool for people who want help without surrendering authorship
- The anti-ghostwriter

The core bet is not "AI writing." The core bet is that there is a meaningful niche of writers who actively dislike blank-page generation, distrust AI rewrites, and want a tool that sharpens their thinking before it composes prose.

## 1. Competitive Landscape Analysis

### Market Map

The current AI writing market clusters into a small number of clear categories:

- `Generators / ghostwriters`: ChatGPT, Claude, Jasper, Copy.ai, Writesonic, Rytr
  - Core promise: generate content fast
  - Buyer mindset: speed, volume, convenience
  - Market status: highly commoditized
- `Embedded writing assistants`: Grammarly, Notion AI, Google Docs writing help, HyperWrite, Proton Scribe
  - Core promise: improve or generate text inside tools people already use
  - Buyer mindset: convenience, ubiquity, rewrite quality, integrations
  - Market status: crowded and difficult to out-position unless distribution is built in
- `Correctors / polishers`: Grammarly, QuillBot, Wordtune, ProWritingAid
  - Core promise: clarity, grammar, rewriting, tone adjustment
  - Buyer mindset: cleaner prose with less effort
  - Market status: mature and heavily optimized
- `Creative-writing copilots`: Sudowrite, Novelcrafter
  - Core promise: help with fiction, scenes, characters, worldbuilding, plot
  - Buyer mindset: creative expansion, narrative support
  - Market status: narrower but already well-served for fiction-specific workflows
- `PKM / tools-for-thought with AI layers`: Obsidian ecosystem, Roam-adjacent tools, research notebooks, some indie editors
  - Core promise: organize ideas, summarize, connect notes, assist workflows
  - Buyer mindset: thinking support and knowledge management
  - Market status: fragmented, with AI often bolted on rather than central
- `Editor-native minimalist AI tools`: Lex, Octarine, some indie editors
  - Core promise: a cleaner writing environment with AI integrated into the flow
  - Buyer mindset: better writing UX, taste, craft, focus
  - Market status: smaller but strategically relevant because these tools are closest to Pulp

### Where Saturation Exists

The following value propositions are saturated enough that Pulp should avoid centering them:

- "Write faster"
- "Beat writer's block"
- "Generate a first draft"
- "Rewrite in your voice"
- "Polish your text"
- "AI everywhere you work"
- "Create blog posts, emails, essays, and social posts"
- "Save time on writing"

These messages are either already owned by incumbents or too easy to imitate with a prompt plus any modern LLM.

### Where Genuine Gaps Remain

The most promising gaps are narrower and more philosophical:

- `Thinking-before-drafting`: tools that help users discover what they mean before producing polished prose
- `Authorship clarity`: explicit control over where the human ends and the AI begins
- `Writer-trust UX`: features that reduce the feeling that AI has stolen or replaced the writer's voice
- `Essay / newsletter / creative-nonfiction workflows`: a gap between business writing tools and fiction-writing tools
- `Tasteful restraint`: products that intentionally do less and refuse to generate too early
- `Shareable process artifacts`: outputs that show how thought evolved, not just the final result

### Honest Market Read

- The space is crowded.
- The wedge is real, but it is narrow.
- There is not strong evidence of a giant greenfield market waiting for a new general-purpose writing app.
- There is stronger evidence of a niche market for writers who are alienated by standard AI writing UX.

That is enough to build a serious indie business if the positioning is sharp and the product experience delivers quickly. It is not enough to justify vague "AI for writing" messaging.

## 2. Positioning & Wedge Identification

### Recommended Positioning

Pulp should be positioned as a tool for writers who want AI to sharpen authorship, not replace it.

Recommended message directions:

- `AI that helps you think before it writes`
- `For people who actually want to write`
- `The anti-ghostwriter`
- `Your raw thinking, fully expressed`

The strongest external articulation is:

- Pulp does not start by generating prose for you.
- It starts by interrogating your own raw material.
- It makes authorship explicit instead of hiding it.

### The Actual Wedge

The wedge is not "AI writing."

The wedge is the combination of:

- `Provoke` as the primary interaction model
  - AI responds to writing with ultra-concise provocations instead of premature drafting
- `Authorship spectrum`
  - Refine, Soft Press, and Deep Press make the human/AI relationship explicit
- `Trust and recoverability`
  - raw text is preserved, reversible, exportable, and not silently overwritten
- `Taste and restraint`
  - the product is opinionated about when AI should intervene and how much liberty it should take

`Provoke` is the spear tip. It is the least commoditized part of the product and the fastest way to make the category difference legible.

### Trust Positioning: Strong, But Honest

Pulp should lean into trust, but not overclaim privacy.

Accurate trust claims:

- local-first session storage reduces dependence on a central product database
- BYOK gives users more control than typical AI wrappers
- the product is designed to preserve and recover raw writing rather than overwrite it

Claims to avoid:

- "Pulp forgets everything when you close the tab"
- "Pulp is the only safe AI tool for therapy, journaling, or confidential work"
- any blanket claim that the app is zero-retention or fully confidential

Pulp currently stores sessions in local storage and sends text to an LLM provider through its API flow. That still supports a meaningful trust narrative, but it is a trust-supporting wedge, not a confessional-security wedge.

### What Is Defensible Versus Merely Nice

Meaningful wedge elements:

- A distinct interaction model that users cannot trivially replicate with a one-off prompt
- A clear philosophical stance that matches product behavior
- A writer experience that produces "this still feels like me" reactions
- Visible authorship boundaries
- Real trust features, not just privacy copy

Nice-to-have but weak on their own:

- BYOK
- local-first storage
- a minimalist editor
- prettier typography
- better prompt wording

These are useful support signals. They are not enough to carry positioning by themselves.

### Best-Fit Initial Audience

Pulp should start with one narrow initial user group:

- essayists
- Substack writers
- thoughtful founder-writers
- creative nonfiction / memoir-adjacent writers
- people who draft from raw notes and care about sounding like themselves

These users are more likely to feel the authorship problem acutely and to appreciate the distinction between refinement, collaboration, and ghostwriting.

### Audiences To Avoid Initially

Do not target these groups in the first go-to-market pass:

- SEO marketers
- generic content marketers
- students looking for shortcuts
- fiction-first users who want deep worldbuilding and plotting
- enterprise teams

Those markets either reward very different features or will pull Pulp toward generic generation.

## 3. Feature Gap Assessment Framework

### The Evaluation Filter

Every proposed feature should be judged with four questions:

- `Does this increase the writer's agency or outsource their thinking?`
- `Does this create a visible, memorable difference from generic AI writing UX?`
- `Does this increase trust that the output is still theirs?`
- `Does this make the product easier to explain, demonstrate, or share?`

If a feature fails those tests, it is probably not worth building now.

### Table Stakes For Launch

Users now expect these basics from any serious AI writing product:

- stable editor experience
- reliable copy/export
- clear undo / revert behavior
- no fear of losing work
- reasonably good output quality
- basic privacy clarity
- low-friction onboarding

Pulp does not need to overbuild here, but it cannot be weak on safety or trust. A product centered on authorship loses credibility immediately if users worry their raw text is fragile.

### Novelty Signals Pulp Should Lean Into

These are the features that make Pulp feel like a category deviation rather than a prettier wrapper:

- inline provocations inside the writing flow
- explicit authorship modes
- preserved raw text with clear continue/revert behavior
- typography that visually communicates authorship
- shareable examples that reveal the thinking process

### Current Product Assessment

The current product is good enough to validate the wedge, but not yet good enough for a broad launch push.

What is already strong:

- single-canvas flow
- inline provocations
- explicit Refine / Soft Press / Deep Press framing
- local-first and BYOK trust signals
- shareability foundation
- strong product philosophy

What is still missing or underpowered for launch:

- `Bulletproof raw-text safety`
  - the user must feel certain that original writing is recoverable
- `Canonical examples`
  - the site and launch materials need real before/after/process artifacts
- `Proof of authorship boundaries`
  - users should be able to see, not merely infer, how much liberty each mode takes
- `A sharper onboarding moment around Provoke`
  - users need to understand quickly that Provoke is the point, not a side feature

### Recommended Pre-Launch Additions

Before a serious GTM push, prioritize:

- `Versioning / recoverability improvements`
  - make the preservation of raw material unmistakable
- `A small gallery of example sessions`
  - ideally drawn from real users with permission or carefully anonymized demos
- `Onboarding copy that teaches the intended loop`
  - write, provoke, write more, then refine or press

Initial validation does not require a built "show-the-work" feature. For the first 10 to 15 user tests, manual artifacts are enough:

- screen recordings
- raw draft versus resulting draft screenshots
- manually assembled before/after examples

### Recommended Post-Validation Additions

If early users clearly validate the wedge, then prioritize:

- `Show-the-work export or share mode`
  - reveal the raw draft, provocations, and resulting output as one coherent artifact
- `Proof of authorship boundaries`
  - make the human-versus-AI relationship visible in a way users can trust and share

Avoid spending time on:

- more generation modes
- generic prompt templates
- team features
- enterprise controls
- broad workspace integrations

## 4. GTM Channel Strategy

### Channel Principles

Pulp will not succeed through "virality" in the abstract.

It needs:

- a sharp narrative
- strong demos
- a small set of users who genuinely feel the difference
- channels that reward philosophy and craft, not just novelty

The near-term GTM model should be founder-led distribution plus selective public amplification.

### Direct Outreach

This should be the highest-priority channel.

Target:

- Substack writers
- indie essayists
- founder-writers
- creator-educators who publish thoughtful longform pieces

Tactical hunt list:

- writers on Substack who publish about writing craft, process, or revision
- Write of Passage alumni and adjacent communities
- Foster and similar writing-practice communities
- Indie Hackers members who regularly publish essays or newsletters
- peers-of-peers who already write in public and can test on real drafts

Narrative that resonates:

- "I built a writing tool for people who hate AI ghostwriting but still want help developing a draft."
- "It asks pointed questions before it writes."

Pitfalls:

- sending a generic product pitch
- targeting people who do not write regularly
- overexplaining the architecture instead of the felt problem
- treating broad demographics like channels instead of finding specific communities

Success looks like:

- 10 to 15 serious users agreeing to try it on real writing
- a handful of strong testimonials in the language of authorship and trust
- repeat use on a second draft

Best timing:

- immediately

### X

This is a viable early channel if the founder is willing to write in public.

Narrative that resonates:

- sharp takes on AI and authorship
- short clips showing Provoke in action
- raw draft -> provocation -> improved draft transformations
- direct comparisons against standard rewrite-first workflows

Pitfalls:

- polished launch graphics with no product truth
- abstract philosophical claims with no demo
- trying to farm generic "AI startup" audiences

Success looks like:

- high-quality replies and DMs from real writers
- signups from people who specifically mention the philosophy or the interaction model
- a few posts that clearly outperform the account's normal baseline

Best timing:

- now, as a continuous channel

### Manifesto / Essay Marketing

Pulp is unusually well-suited to a manifesto-style piece because the product comes from a real stance on authorship.

Narrative that resonates:

- why most AI writing tools feel like theft
- why prompting for a full draft too early weakens thinking
- why writers need help excavating thought, not replacing it

Pitfalls:

- publishing the internal concept doc raw without tightening it for public reading
- writing a manifesto that is too abstract to connect back to the product

Success looks like:

- readers sharing the essay because the argument lands
- email captures or beta requests from people who identify with the problem
- the essay becoming a reference point for future launch content

Best timing:

- before broader public launch

### Hacker News

HN is viable, but only after there is enough evidence that the product is more than an idea.

Narrative that resonates:

- "local-first, BYOK writing tool that refuses to ghostwrite"
- explicit contrast with generic AI wrappers
- screenshots or clips of the provocation model
- honest framing around building it for your own writing first

Pitfalls:

- leading with "AI writing app"
- relying only on technical architecture as the story
- pretending the product is more mature than it is

Success looks like:

- a few hundred qualified visits
- signups from technically literate writers and indie builders
- thoughtful comments about authorship, not just pricing or model choice

Best timing:

- after strong demos and initial user validation

### Reddit

Reddit is not a core channel. It is a tactical channel.

There are some pockets where Pulp could resonate, especially in communities interested in tools for thought, writing process, or careful AI use. But many writing communities are anti-AI, and many subreddits are hostile to self-promotion.

Narrative that resonates:

- "I hated how AI rewrites flattened my voice, so I built something that asks better questions instead."
- screen recordings of the writing process
- open discussion of the philosophy, not hype

Pitfalls:

- assuming nuance will overcome anti-AI sentiment
- posting links without participating
- ignoring subreddit rules

Success looks like:

- thoughtful discussion
- requests for access
- learning which communities are sympathetic

Best timing:

- after a strong demo exists and only in carefully chosen communities

### Product Hunt

Product Hunt is not a validation channel for Pulp. It is a visibility channel.

Narrative that resonates:

- anti-ghostwriter writing tool
- tasteful AI product for writers
- local-first / BYOK support as trust signals

Pitfalls:

- launching too early
- treating Product Hunt as the main event
- assuming generic traffic will understand the wedge

Success looks like:

- some backlinks and social proof
- a modest number of signups
- comments that confirm the differentiation is legible

Best timing:

- after product polish, examples, and some community backing exist

### Other Channels Worth Considering

- `Podcasts and newsletters about writing, thought, and creative process`
  - stronger fit than generic startup media
- `Private writer communities and cohorts`
  - often higher trust and better feedback than public launch channels
- `Obsidian / PKM-adjacent communities`
  - only if framed around writing workflow and thought development, not generic AI

## 5. Monetization & Pricing Strategy

### Core Constraint

BYOK and local-first architecture change what users will tolerate.

Pulp should not default to a standard "$15 to $20 per month SaaS subscription" while users are also expected to bring their own API key. That is not impossible to sell, but it is a harder and less natural fit for the current product shape.

### Recommended Monetization Path

Use a staged model:

- `Validation phase`
  - free or lightly gated BYOK beta
  - optimize for learning, examples, and repeat usage
- `Initial monetization`
  - one-time purchase or early-supporter license for the product experience itself
  - this fits the indie-writer-tool market better than a recurring subscription for a thin BYOK wrapper
- `Optional future subscription`
  - only if Pulp later introduces real server-side value such as sync, backup, cross-device history, hosted models, collaboration, or premium managed workflows

### Recommended Pricing Direction

The most coherent initial pricing direction is:

- a one-time paid license or founder pass
- positioned as anti-SaaS and aligned with local-first ownership
- priced like a serious indie writing tool, not like a disposable AI toy

This does not require building a desktop app first. A desktop app could become strategically useful later, but it should not be a prerequisite for monetization.

### Monetization Principles

- charge for workflow value and taste, not raw token access
- do not force a recurring fee before there is recurring hosted value
- keep the pricing model consistent with the trust and ownership story

## 6. Validation Before Execution

### What Must Be Validated

Before any full launch push, validate these questions:

- Do writers find Provoke useful or gimmicky?
- Do they trust the outputs more than generic LLM rewrites?
- Do they feel the authorship spectrum clearly?
- Do they come back for a second real draft?
- Do they describe the product in language close to the intended wedge?

The most important user reaction is some version of:

- "This still sounds like me."
- "This helped me find what I meant."
- "This is the first AI writing tool that doesn't make me feel replaced."

### Recommended Validation Tactics

#### 1. Guided User Cohort

Recruit 10 to 15 writers from the target niche and watch them use the product on real work.

Use a narrow mix:

- Substack writers
- essayists
- founder-writers

What to observe:

- whether they naturally use Provoke more than once
- whether they understand when to use Refine versus Soft Press versus Deep Press
- whether they compare the experience favorably against ChatGPT, Claude, or Lex
- where trust breaks

#### 2. Demo Video Test

Create a short screen recording that shows:

- messy raw writing
- one or two provocation rounds
- a transition into Soft Press or Deep Press

The clip should make the category distinction obvious in under a minute.

This is useful for:

- X
- direct outreach
- HN launch preparation
- testing whether the product can be understood quickly

#### 3. Public Essay / Manifesto Test

Publish a sharper public version of the authorship argument.

Pair it with:

- a beta signup
- a short product demo
- one example session

This validates whether the philosophy itself resonates beyond the founder's own instincts.

#### 4. Comparative User Interviews

Ask target users to show how they currently write with:

- Claude
- ChatGPT
- Lex
- Notion AI
- no AI at all

The goal is not generic research. The goal is to identify the exact moments where existing tools feel too eager, too generic, or too invasive.

### Decision Thresholds

Signals to proceed aggressively:

- multiple users independently praise Provoke
- users return for second-session writing without being chased
- testimonials center on authorship, trust, and thought development
- examples are compelling enough that outsiders immediately understand the product

Signals to slow down and refine:

- users skip Provoke and go straight to Deep Press
- users describe Pulp as "basically a nicer AI editor"
- the value only appears after lengthy explanation
- users like the philosophy but do not adopt the workflow

## Prioritized Next Steps

### Highest Priority

- Narrow the initial ICP to essayists, Substack writers, and thoughtful founder-writers
- Make Provoke the obvious spear tip in messaging and demos
- Tighten raw-text safety and recoverability so trust is earned, not merely claimed
- Run a 10 to 15 user validation cohort before any broad launch push
- Publish a public-facing essay on AI authorship and pair it with a beta capture
- Produce one strong short demo video that makes the product legible quickly
- Decide on an anti-SaaS monetization stance for the BYOK product
- After validation, build a show-the-work artifact so process, authorship, and transformation are visible

### Medium Priority

- Start a founder-led X presence around authorship, writing process, and demos
- Do targeted outreach to writers and creator-educators who fit the niche
- Prepare an eventual HN launch narrative once validation evidence exists

### Lower Priority

- Product Hunt
- broad Reddit promotion
- new generation modes
- enterprise features
- generic AI-writing positioning

## Final Recommendation

Pulp should be launched as a narrow, opinionated product for writers who want help thinking and shaping without losing authorship.

Do not try to win the generic AI writing market. That market is crowded and strategically incoherent for this product.

Win a smaller market first by being unusually clear about the problem:

- most AI writing tools rush to write
- Pulp starts by helping the writer think

If users feel that difference strongly enough to describe it in their own words, the GTM strategy becomes viable. If they do not, no launch channel will save it.
