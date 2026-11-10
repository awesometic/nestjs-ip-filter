<!--
TEMPLATE for docs/PROJECT_STACK.md — the project-layer doc for toolchain commands, project
structure, and related-doc pointers. Copy this to docs/PROJECT_STACK.md and fill it for the
project. The FORMAT below is mandatory and identical in every project; only the content
changes. (This template lives under docs/mandatory/template/ with the other generation
templates, but its output file lives at docs/PROJECT_STACK.md, not under docs/mandatory/.)

Fixed contract (do not restructure):
  - Title `# Project Stack`, then the `Template version:` line kept exactly as shipped,
    then `## Purpose`, `## Toolchain Commands`, `## Project Structure`, then any optional
    stack-specific `## ` sections, then `## Related Project Docs` last.
  - The version line names the template revision this filled file is aligned to; update it
    only when re-aligning the file. Agents compare it against this template's own line to
    detect a pending migration (see AGENT_WORKFLOW.md read order).
Cross-reference links are written relative to docs/ (this file's output location).
-->

# Project Stack

Template version: 1.8

## Purpose

Project- and stack-specific commands, structure, and conventions for `<project>`. The
portable agent rules live in `AGENTS.md` and `docs/mandatory/`; this file is the project
layer they point to.

## Toolchain Commands

```bash
# format / static analysis / tests / build / code generation, e.g.
<format-command>
<analyze-command>
<test-command>
```

## Project Structure

- `<top-level layout and where each kind of code lives>`

## Related Project Docs

- Stack conventions (mandatory): [mandatory/STACK_CONVENTIONS.md](./mandatory/STACK_CONVENTIONS.md)
- Capability brief (what this project does and what makes it different, for people):
  [CAPABILITY_BRIEF.md](./CAPABILITY_BRIEF.md)
- Error handling & logging contract: `<ERROR_HANDLING.md or the project's equivalent>`
- Scenario / debug test guide: `<the project's scenario-test guide>` (the
  `docs/mandatory/AGENT_WORKFLOW.md` read order points here for scenario/debug testing)
- Other `docs/*.md` cover feature behavior and setup.
