---
name: implement
description: Run the full build → test → review → verify workflow for a feature or task
argument-hint: <task description or IMPLEMENTATION-PLAN.md phase>
---

Run the full implementation workflow for: $ARGUMENTS

Follow these steps in order. Do not skip steps.

---

## Step 0 — Understand

Before the builder touches any code, understand what you're working with:

1. Read `CONVENTIONS.md` — know the patterns before you establish new ones
2. Read the files that will be touched — understand how they work today
3. Grep for similar patterns — how are analogous problems solved elsewhere in the codebase?
4. Identify the blast radius — what existing behavior could this change break?

Document your understanding in a brief note (2–4 bullet points) before proceeding to Step 1.

---

## Step 1 — Build

Use the **builder** subagent to implement: $ARGUMENTS

Wait for it to complete. Note its summary — especially any new patterns or pre-existing issues it flagged.

---

## Step 2 — Test (conditional)

Review the builder's summary. Invoke the **test-writer** subagent if the implementation includes testable logic:
- Webhook handlers
- Usage/subscription gates
- Business rules or data transformations
- Error handling paths

**Skip** if the work is primarily scaffolding, configuration, UI layout, or wiring with no meaningful logic. Also skip if the test-writer reports no test infrastructure. In either case, state your reason explicitly.

If invoked, wait for completion. Note coverage summary and any infrastructure gaps identified.

---

## Step 3 — Code Review

Use the **code-reviewer** subagent to review all changes made in Steps 1–2.

Wait for it to complete. Read the full review document it created.

---

## Step 4 — Address Review Feedback

Address review findings yourself (do not use a subagent):

1. Fix all **Critical** items
2. Fix all **Warning** items
3. Consider **Suggestion** items — fix where the improvement is clear and low-risk
4. Commit the fixes

**Do not fix pre-existing issues** flagged by the reviewer in the "Pre-existing Issues" section — those are tracked separately.

---

## Step 5 — Documentation Verification

Use the **doc-verifier** subagent to verify documentation matches the implementation.

Wait for it to complete. Read the verification report.

---

## Step 6 — Address Doc Issues

Fix any **Critical** documentation discrepancies yourself. Commit the changes.

---

## Step 7 — Finalize

1. **Execute the Self-Improving Protocol:**
   - Review `CONVENTIONS.md`
   - Add any new patterns that emerged from this session
   - Document any anti-patterns discovered or avoided
   - If significant architectural decisions were made, add an entry to `docs/DECISIONS.md`
   - Commit any convention updates

2. **Update progress** — if `docs/IMPLEMENTATION-PLAN.md` exists, mark the completed task/phase as done (`- [x]`). If the file doesn't exist, skip this step.

3. **Provide a final summary:**
   - What was built
   - Test coverage (or why tests were skipped)
   - Review findings and how they were resolved
   - Documentation status
   - Convention updates made
   - Files created or modified
   - Any remaining items, pre-existing issues to track, or known limitations
