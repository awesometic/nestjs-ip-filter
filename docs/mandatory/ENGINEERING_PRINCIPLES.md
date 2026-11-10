# Engineering Principles

## Purpose

Stack-agnostic design direction and code standards. Project- and stack-specific details
live under `docs/`, starting from `docs/PROJECT_STACK.md`.

## Design Direction

- Keep one legible ownership and dependency direction. The project's
  `STACK_CONVENTIONS.md` owns the actual runtime graph; do not impose a generic
  UI/domain/data shape on stacks that use a different architecture.
- Start from the feature's observable contract and current owner, then choose its
  functions, input shapes, and boundaries. Keep related policy and state transitions
  near that owner. Each feature or module owns its state and exposes a small surface;
  cross-feature reach-through needs an explicit shared boundary.
- One source of truth per piece of state or configuration. No parallel flags or
  duplicated decision paths.
- Prefer framework-default behavior before introducing custom mechanisms.

## UI Composition And Existing Contracts

Existing appearance, information hierarchy, data-dependent emphasis, state-specific
presentation and interaction are observable contracts; missing design documentation does
not make a detail disposable. Before editing, inspect the affected screen, the
design-system, component and page rules, and the shared component's callers. Record the
preserved behavior and intended delta in the readiness note; when the app cannot run, use
source, tests and reference images, and keep unknown states explicit.

Judge widgets, reusable patterns and messages in their consuming screens: surrounding
content, the expected number of instances, repeated rows or grids, representative distinct
contexts, and the combined hierarchy, density, alignment and spacing in the viewport. An
isolated component looking right does not establish a usable screen. Shared code does not
require one shared visual composition; keep each decision at its semantic owner and use
established extension points for a real contextual difference instead of changing shared
defaults for one page.

For repeated UI, decide what belongs once per page, once per section, or per item. Show
shared headings, explanations, status or actions once at the nearest shared scope when
their meaning, state and target are shared, and do not duplicate card shells, headings,
helper text or padding merely because each instance is reusable — several sliders can
share one instruction while each keeps its own label, value and reset control. Keep
item-specific values, status, errors, action targets and accessible associations, and keep
shared information discoverable while scrolling and with assistive technology; tidiness
never justifies hiding a required warning or merging distinct targets.

Preserve details outside the authorized delta across affected consumers. A feature,
extraction, reuse, refactor or framework default does not by itself authorize redesign.
Before a material replacement or removal, name the detail, the reason, the information or
interaction lost and its replacement, and resolve a consequential unapproved loss through
the readiness gate. An already authorized change needs no further question, and a bug or
accessibility fix may replace defective presentation while keeping its information and
interaction. Do not add speculative variants or duplicate widgets to avoid examining
consumers.

## Abstraction, Interfaces, Generics

- Abstract only to remove real duplication or to cross a real boundary; prefer a concrete
  implementation until a second real use appears. Do not add a wrapper, factory, registry,
  configuration layer or generic parameter only to prepare for a possible future variant.
  UI reuse follows [UI Composition And Existing Contracts](#ui-composition-and-existing-contracts).
- Introduce an interface only at a real replaceable or external boundary the current
  system enforces — not because code crosses a folder or module, and not for a test seam
  or a hypothetical replacement. Keep public APIs small and stable.
- For behavior within its owning domain, prefer an existing coherent domain object that
  callers already hold over making callers unpack its fields into a growing scalar
  argument list — for example, `changeNickname(user: User, newNickname)`. Keep value-only
  utilities scalar when that is their contract, use narrow DTOs at security,
  serialization, and external boundaries, and add no catch-all context or extra fetch
  merely to avoid arguments.
- Use a shared interface, enum, or base class only for genuine sibling behavior. Shared
  enums that back display or persistence carry stable, locale-independent keys.
- Keep one-caller behavior near its owner. Promote code to a shared module only for a
  stable invariant or real independent callers, and give shared code a narrow owner and a
  conventional entry point rather than a dumping-ground module. Function extraction
  follows [Causal Flow And Diagnostic Trace](#causal-flow-and-diagnostic-trace).

## Causal Flow And Diagnostic Trace

- Keep cohesive logic in one function by default. Extract only for actual composition or
  reuse, to isolate a genuinely complex boundary, or to name an independently meaningful
  operation that makes the caller clearer. Keep distinct responsibilities at their
  existing owners rather than forcing them into one function.
- Keep synchronous call stacks shallow enough to trace. Every hop should add a
  responsibility, contract, state transition, or boundary; remove pass-through wrappers
  that add none.
- Before and after a structural or cross-boundary change, trace at least one
  representative causal path from a user- or system-visible entry point through the
  behavior it owns to the observable outcome. Names, locations, ownership, and state
  transitions should make the path discoverable; where boundaries interrupt direct
  control flow, use event or correlation identifiers, observability, or tests.

Representative traces, for diagnosis only: a UI interaction runs `visible control and its
state → owning handler or intent → behavior and state transition → data, external or
asynchronous boundary → resulting state, error or effect rendered back`; a backend one runs
`entry and payload → routing, authentication, validation or transport adapter → owning
handler or use case → repository, external or event boundary → response, error, side
effects or continuation`. These are diagnostic traversal examples, not required layers or
call sequences: a real path may skip, combine, branch, or cross asynchronous boundaries,
and no layer, wrapper or dependency direction is introduced to match them. Retain both the examples and this qualification when
editing this section.

## File And Module Boundaries

- File size is a cohesion and discoverability signal, not a numeric gate. A hand-written
  file reaching multiple thousands of lines requires an explicit check for mixed roles,
  domains, lifecycle stages, or feature ownership.
- Split along the strongest existing ownership boundary when that improves discovery and
  causal tracing; never by line count alone, into one-function files, or through
  pass-through owners.
- Generated files, vendor code, declarative registries or datasets, fixtures, and
  migrations may remain large when decomposition would make their contract less legible.

## Errors And State

- Use the project's documented error/result contract at public boundaries (its
  `docs/ERROR_HANDLING.md` or equivalent, when it has one). Do not
  universalize one stack's result type or exception policy.
- Catch, translate, or surface failures at the boundary that owns that responsibility.
  Keep user-facing messages stable and actionable while preserving diagnostic evidence
  internally.
- Preserve the original cause when translating a failure. Do not swallow an unexpected
  failure, convert it to a successful default, or log and continue unless the current
  contract explicitly owns that recovery.
- Validate unknown values once at the ingress or trust boundary that owns them, then pass
  validated typed values inward without repeating shape checks a schema, constructor, or
  internal type already guarantees. A cast or static annotation does not validate
  untrusted runtime input. Recheck what a new boundary or relevant mutation invalidates;
  authorization, transaction, and other context-dependent checks keep their own
  obligations.

## Secrets And Sensitive Files

- Never hardcode secrets or credentials.
- Never open, read, or display the contents of a credential-like file: `.env` and its
  variants, `*.pem`, `*.key`, `*id_rsa*`, vault files, and anything named for a token,
  password, or secret, through any tool — a file reader, `cat`, `grep`, `head`, or shell
  redirection. Checking that such a file exists, locating it, or
  moving or removing it during a structural change is allowed; reading its values is not.
  A file whose name marks it as a template — `.env.example`, `.env.sample`, `*.template` —
  is ordinary source and this rule does not reach it; the name decides, never a look at the
  contents. Every other credential-like name, `.env.test` included, stays covered.
- Two things permit an exception and nothing else does: the project names that file in its
  own [STACK_CONVENTIONS.md](./STACK_CONVENTIONS.md) — a test fixture such as `.env.test`,
  for example — or the user explicitly authorizes the specific values the task needs,
  limited to those values. Nothing is permitted by inference. When work needs only the
  shape of a sensitive configuration, ask for masked dummy values instead.
- Keep sensitive values out of anything that leaves the machine: before searching the web
  or calling an external service, restate the problem in general terms and strip
  hostnames, usernames, IP addresses, custom domains, local paths, and tokens.
- Mask a credential that reaches tool output before it reaches the response. What may go
  into a loop log, decision record, or state file is owned by
  [docs/loop/README.md](../loop/README.md) → `Safety And Privacy`.

## Readability

- Use stable, meaningful names; apply a special ordering rule only where the project
  documents one or it materially aids scanning.
- Prefer readable names and direct flow over explaining avoidable obscurity. Keep comments
  only for rationale or constraints a maintainer cannot recover by tracing the code and
  its contracts; required license notices, tool directives and public API contracts keep
  their obligations.
- Symbols, command names, and log or error text stay in the toolchain's language, normally
  English, so search, matching, and pasting an error still work.
- Comments, commit messages, and every document in the repository are written in English.
  Documents written for people outside the agent workflow — `README.md`, `CONTRIBUTING.md`,
  `docs/CAPABILITY_BRIEF.md`, and runbooks or guides of that kind — follow the language the
  project's [STACK_CONVENTIONS.md](./STACK_CONVENTIONS.md) states, and English when it
  states none. A document with its own language contract, or an explicit operator
  instruction for one document, wins for that document. Responses to the user follow
  `AGENTS.md` → `Response Language`; shipped product copy follows `AGENTS.md` →
  `Copy Pipeline`.
- That rule governs prose a person reads. Text that is matched rather than read — trigger
  keywords, a skill's or sub-agent's `description`, any string whose job is to be matched
  — follows the symbol rule and stays in whatever language makes the match work.

## Minimal, Local Changes

- Keep related edits grouped and local unless the architecture requires a wider change.
- Do not change unrelated code, comments, formatting, or names under the guise of
  improvement.
- Remove confirmed unnecessary code in the changed code and directly affected adjacent
  code before adding another mechanism. Pre-existing debt elsewhere, even inside the same
  owner, stays untouched and is reported when material. A broader cleanup requires an explicit refactoring scope
  under [REFACTORING.md](./REFACTORING.md).
- Before proposing or adding any behavior or structure—including architecture, logic,
  modules, components, abstractions, UI states, and integrations—identify the
  responsibility and contract it belongs to. Search the existing owner, extension
  points, sibling implementations, and analogous flows. When the requirement is another
  input, cause, state, or variant of an existing contract, extend or route through that
  contract and implement only the distinct behavior. Add a parallel owner, abstraction,
  or pattern only for a stated contract difference.
- Every changed line should trace directly to the request or required verification
  cleanup.
- When an approach is abandoned, inspect the modified files and restore the edits it left
  behind before continuing.
- Never leave an elided or placeholder edit in place of the work —
  `// rest of code unchanged`, an empty body, or a marker comment where the requested logic belongs; report
  a part that cannot be finished. A comment marking a deliberate ceiling on finished work
  is not a placeholder; [SIMPLICITY_FIRST.md](./SIMPLICITY_FIRST.md#marking-a-deliberate-ceiling)
  owns that distinction.
- For debugging and fix design, follow [SIMPLICITY_FIRST.md](./SIMPLICITY_FIRST.md).
