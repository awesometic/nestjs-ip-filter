# Refactoring

## Purpose

The stack-agnostic execution contract for removing accidental complexity without changing
the behavior the user placed in scope. It applies when the user explicitly requests a
refactor, simplification, cleanup, consolidation, dead-code removal, or structural
reduction; ordinary feature work and defect fixes, including feature work with a broad
structural change, use `Ordinary Changes` and the `Simplicity Review Lens` below.
[ENGINEERING_PRINCIPLES.md](./ENGINEERING_PRINCIPLES.md) owns design constraints; this file
owns the investigation and removal scope.

## Fix The Boundary First

Before editing, state the user-requested behavior and ownership boundary in operational
terms:

- the observable behavior to preserve or intentionally change
- the current owner or owners of that behavior
- the entry points and observable outcomes used to trace it
- the files, modules, components, or runtime paths included by that ownership boundary
- any explicitly excluded area or external dependency

Prefer the user's named boundary. When the user names behavior but not files, trace it
through the repository's actual ownership and dependency direction rather than a
convenient file list. Scope follows behavior and ownership, not directory or diff size.
For shared UI, include the affected consumer compositions and preserve
[UI Composition And Existing Contracts](./ENGINEERING_PRINCIPLES.md#ui-composition-and-existing-contracts).

If repository evidence resolves a minor ambiguity, record the assumption and continue.
If materially different boundaries remain plausible and choosing one would change what
is removed, follow `Audit-Only Mode`.

## Ordinary Changes Versus Explicit Refactors

### Ordinary Changes

For a feature, fix, migration, or other request that is not an explicit refactor, the
working scope is the changed code plus directly affected adjacent code, under the
[minimal, local change rules](./ENGINEERING_PRINCIPLES.md#minimal-local-changes): remove
complexity the change introduced or expanded, simplify directly affected flow when safe
and relevant to the request, and leave unrelated pre-existing debt unchanged, reporting material
findings when useful.

### Explicit Refactors

For an explicit refactor, the fixed behavior/ownership boundary is the working scope, and
pre-existing accidental complexity inside it is related work even when its lines were not
initially changed. Inspect the whole boundary, not only the first site or the current
diff, and remove every confirmed candidate below while preserving the stated observable
contract. A small diff is not success if known accidental complexity remains inside the
boundary without evidence-based justification. Debt outside the boundary is report-only,
however similar it looks.

## Accidental-Complexity Sweep

Build a candidate inventory by searching usages and tracing representative causal paths
through the full boundary, across every category the `Simplicity Review Lens` names: dead
or unreferenced code and configuration, pass-through layers, single-use helpers that
obscure flow, speculative abstractions and fallbacks, duplicated state or decision paths,
and hidden control flow. Search conventional shared locations and every relevant call site
before calling a candidate unused or duplicated, and trace at least one representative
path before and after structural changes per
[Causal Flow And Diagnostic Trace](./ENGINEERING_PRINCIPLES.md#causal-flow-and-diagnostic-trace).

Classify each candidate from evidence:

- **Confirmed accidental complexity** — it has no distinct current responsibility or
  obligation, and a more direct expression preserves the observable contract. Remove it.
- **Justified structure** — it owns a real responsibility, invariant, duplication
  boundary, state transition, or protected boundary. Keep it and make that role legible
  when the code does not already do so.
- **Uncertain** — available evidence cannot establish safe removal or required
  preservation. Defer only that candidate, record the missing evidence and risk, and
  continue removing every other confirmed candidate. Do not add a shim or abstraction to
  make an uncertain deletion feel safer.

After each removal, re-search names, imports, registrations, configuration, generated
references, tests, and documentation that could retain or depend on the old path, and
remove newly orphaned pieces inside the boundary.

## Evidence-Based Preservation

Do not preserve accidental-looking structure for vague safety, possible future reuse,
architectural symmetry, test convenience, or the fact that it already exists.

When removal may affect a boundary obligation, preservation requires repository or
runtime evidence of an active obligation in one of these categories:

- a public contract used outside the ownership boundary
- a persisted or serialized format that existing data must continue to read or write
- a security, identity, authorization, or authority boundary
- a transaction, atomicity, ordering, or consistency boundary
- an external system, platform, protocol, framework, or integration boundary

Useful evidence includes current callers, schemas, migrations, protocol or platform
requirements, tests of observable behavior, production-supported configuration, and
project documentation. A test qualifies only when it would fail if the obligation broke
([TESTING.md](./TESTING.md)); one that restates a literal, or verifies an interaction
that is only implementation, proves the structure exists, never that anything depends on
it. An interaction that is itself an external contract — an idempotency key on a payment
request, a required protocol order — is evidence, as `TESTING.md` treats it. A name such as
`adapter`, `legacy`, `compat`, `safe`, or `transaction` is not evidence by itself.

Preserve the smallest mechanism that satisfies the evidenced obligation, not an entire
internal layer when only a narrow mapping, conversion, authority check, transaction scope,
or external adapter is required. Structure that plainly owns a current responsibility or
stable invariant needs no category; the categories govern claims that old compatibility,
fallback, indirection, or shape must remain to protect a boundary.

## Behavioral Evidence And Characterization Tests

When existing tests or contracts do not make the relevant behavior clear, pin the
observable contract with characterization tests before removing structure — inputs and
externally observable outputs, state, errors, ordering, or side effects, including
security, transaction, persistence, and external-integration behavior in scope. Never
characterize topology such as helper names, layer presence, or internal call order; a test
that freezes removable topology is updated or deleted with the implementation, keeping
coverage of the real outcome. [TESTING.md](./TESTING.md) owns what any test must prove and
the audit a structural move triggers.

Verification covers the representative causal path, the affected observable contract, and
any evidenced protected boundary, using the project's own commands and gates.

## Simplicity Review Lens

This section is the single owner of the simplicity lens for implementation and refactor
review; other files link here. For ordinary work it covers the changed and directly
affected code; for an explicit refactor, self-review and every applicable independent
review apply it to the resulting code and the full fixed boundary. Ask:

- Does each interface represent a real replaceable or external boundary enforced by the
  current system, or remove demonstrated duplication across current implementations?
- Does each factory select among real current constructions with meaningful policy, or
  is direct construction clearer?
- Does each wrapper or layer add responsibility, contract, state transition, authority,
  transaction handling, external adaptation, or diagnostic value?
- Does each helper meet the
  [function-extraction criteria](./ENGINEERING_PRINCIPLES.md#causal-flow-and-diagnostic-trace),
  or does it add a single-use hop that reads better inline?
- Does each fallback, compatibility path, retry, or recovery branch have an active
  requirement and observable success/failure semantics backed by boundary evidence?
- Is state, transformation, validation, configuration, or policy duplicated, and can one
  existing owner become the source of truth?
  Apply [boundary-validation guarantees](./ENGINEERING_PRINCIPLES.md#errors-and-state)
  without removing context-dependent obligations.
- Is control flow hidden behind registration, delegation, callbacks, implicit hooks,
  dynamic lookup, or broad error handling without a necessary boundary reason?
- Can the same observable contract be expressed more directly with fewer hops, owners,
  representations, branches, or states?
- For shared UI, does the result preserve the authorized contract in its consuming
  compositions, including repetition and each action's target, rather than only in isolation?
- Did the sweep cover every category, and did removals leave dead imports, registrations,
  tests, documentation, or compatibility paths? Tests the boundary still references are
  audited under [TESTING.md](./TESTING.md#test-suite-audit), not merely rerun.
- Does any confirmed accidental complexity remain inside the explicit refactor boundary?
  If so, the refactor is incomplete; remove it or correct its classification with
  evidence.

Reviewers challenge preservation rationales rather than reward deletion volume: a larger
construct may be the simplest correct owner, and a tiny abstraction may still be needless.

## Boundary Discipline And Reporting

Do not edit debt outside the fixed boundary. Record a material out-of-bound finding with
its location, why it is outside scope, and any risk or follow-up value.

At handoff, distinguish:

- confirmed complexity removed inside the boundary
- justified structure retained, with evidence when its necessity was not obvious
- uncertain candidates deferred and the specific evidence needed to resolve each one
- out-of-bound debt recorded without modification
- observable contracts and protected boundaries verified

A candidate is deferred only when the evidence available in scope cannot settle it, never
because it was inconvenient to investigate.

## Audit-Only Mode

Use audit-only mode only when the user asked for an audit/review without authorizing
changes, or when the behavior/ownership change range cannot be determined after repository
exploration. Do not choose it because the refactor is broad, risky, unfamiliar, or
contains one uncertain candidate.

In audit-only mode, fix the best-supported provisional boundary, perform the same sweep
and Simplicity Review Lens, and report candidates as confirmed, justified, uncertain, or
out of boundary without mutating implementation files. If authorization or a boundary
decision would unlock implementation, state the smallest concrete decision required.
