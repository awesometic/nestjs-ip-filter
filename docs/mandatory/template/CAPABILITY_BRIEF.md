<!--
TEMPLATE for docs/CAPABILITY_BRIEF.md — the human-facing briefing on what this project
does, what makes it different, and how each highlight actually works. Copy this to
docs/CAPABILITY_BRIEF.md and fill it from the real repository.

Audience: a person — a new maintainer, a colleague, or the maintainer presenting it. It binds
nothing and is not a rule source (see AGENTS.md -> `Capability Brief`); agents may read it for
orientation.

Fixed contract (do not restructure):
  - Title `# Capability Brief`, then `## Purpose`, `## In One Minute`, `## Highlights`,
    and `## Maintenance` last.
  - `## Highlights` holds one `### <plain-language capability name>` per highlight, each
    with exactly these four labeled bullets and nothing else: `What`,
    `Why it is different`, `How it works`, `Trace terms`.
  - Headings and labels are plain language a listener would understand, never a file,
    type, or command name. Keep each bullet to a sentence or two: four bullets are a
    briefing, not an essay.
  - Write the prose in the language the project's maintainers speak, since the reader is a
    person being briefed rather than an agent. Keep the structural anchors in English — the
    four `##` section names, the four bullet labels, and the trace terms themselves — so the
    contract stays checkable and the search strings stay copy-pasteable. The `###` capability
    headings follow the prose language.
  - `How it works` is one short causal path in the shape
    [ENGINEERING_PRINCIPLES.md](./mandatory/ENGINEERING_PRINCIPLES.md) -> `Causal Flow And
    Diagnostic Trace` already requires: entry -> owning behavior -> applicable boundary ->
    observable outcome, through the project's real architecture. Prose, not a layer
    diagram; steps may skip, combine, or cross asynchronous boundaries.
  - `Why it is different` carries evidence: a decision record, a doc link, or a trace
    term. Write it as a relative link that resolves from docs/ so a reader can follow it.
    Drop a claim that cannot be evidenced rather than softening it.
  - `Trace terms` are search strings that exist in the repository today and return a
    bounded, useful result set for following or debugging that capability. Verify each one
    against the current repository before writing it, and say what it leads to. Keep them
    tool-agnostic (plain strings, no tool-specific syntax).
  - Naming is a consumer relationship: never create, rename, or reserve a file, symbol,
    log tag, or any other source-code name to make a trace term nicer. Naming follows
    ENGINEERING_PRINCIPLES.md -> `Readability` and
    [STACK_CONVENTIONS.md](./mandatory/STACK_CONVENTIONS.md). Citing a name that already
    exists is fine when it is the real anchor. When no usable trace term exists, record a
    discoverability finding instead of inventing one — in the loop log or review, otherwise
    in the final response and `docs/loop/current.md` -> `Open Follow-ups`.
  - Cite a count, version, or inventory that another file owns instead of mirroring it.
    The update trigger below does not fire when a count changes, so a mirrored number goes
    stale silently.
  - Keep it readable in one sitting. A highlight belongs here only if you would actually
    raise it when introducing the project; prefer replacing a weaker highlight over
    appending one.
  - Assume this file may be shown outside the team: no credentials, private identifiers,
    customer-identifying detail, or unannounced roadmap. The safety rules in
    [loop/README.md](./loop/README.md) apply here too.
  - Do not duplicate `PRODUCT.md` (what the product must be), `README.md` (setup and
    run), `docs/decisions/` (one durable choice and its alternatives), or `docs/loop/`
    (session chronology). Link instead.
Cross-reference links are written relative to docs/ (this file's output location).
You may delete this comment in the filled copy.
-->

# Capability Brief

## Purpose

What `<project>` is, what makes it different, and how each highlight works — written for a
person being introduced to this repository or presenting it. It is a curated briefing, not a
specification and not a rule source: [README.md](../README.md) owns setup and run,
[decisions/](./decisions/README.md) owns durable choices, and
[mandatory/](./mandatory/AGENT_WORKFLOW.md) owns what binds agents.

## In One Minute

- `<what this project is and who it is for, in one line>`
- `<the problem it solves that a generic alternative does not>`
- `<its current shape: what exists today, and what it deliberately does not do>`

## Highlights

### `<plain-language capability name>`

- What: `<the behavior a user or operator observes>`
- Why it is different: `<what the usual approach does, what this does instead, and why`
  `that is hard; link the decision record or doc that evidences it>`
- How it works: `<entry -> owning behavior -> applicable boundary -> observable outcome,`
  `through this project's actual architecture>`
- Trace terms: `<search string>` `<what it leads to>`; `<next search string, same shape>`

### `<next capability name>`

- What:
- Why it is different:
- How it works:
- Trace terms:

## Maintenance

- Last reviewed: `<YYYY-MM-DD>` (`<loop log slug>`)

When this file is reviewed and updated is owned by
[mandatory/AGENT_POST_IMPLEMENTATION.md](./mandatory/AGENT_POST_IMPLEMENTATION.md) ->
`Files to Review and Update`; how it is written is fixed by the `Fixed contract` in
`docs/mandatory/template/CAPABILITY_BRIEF.md`. Neither is restated here.
