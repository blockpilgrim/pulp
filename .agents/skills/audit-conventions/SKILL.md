---
name: audit-conventions
description: Bootstrap CONVENTIONS.md by auditing the existing codebase. Run once when setting up /implement on a brownfield project, or after a major refactor changes the established patterns.
---

Bootstrap `CONVENTIONS.md` from the existing codebase.

Use the **codebase-auditor** subagent to:
1. Read the existing codebase — structure, patterns, naming, types, components, API routes, styling, error handling
2. Check for test infrastructure and document its status
3. Note any inconsistencies or open decisions
4. Write (or overwrite) `CONVENTIONS.md` with findings

Wait for the auditor to complete.

Then review the generated `CONVENTIONS.md` yourself:
- Are any patterns missing that you know exist?
- Are any listed patterns wrong based on what you've seen?
- Fix any obvious errors before finishing.

Provide a summary:
- Key conventions documented
- Inconsistencies found (things the codebase does two different ways)
- Test infrastructure status
- Recommended next step (e.g. "Resolve the X inconsistency before starting implementation")
