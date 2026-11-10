# Agent Post-Implementation Instructions

Read and follow this file when an implementation batch closes.

## Mandatory Post-Implementation Checklist

Run these steps once per batch, at its closure, on that batch's integrated result — not per
unit commit — so a dependent batch starts from verified work. `Documentation Sweep` below
also runs on its own request with no implementation. Follow the steps in order, using the project's
commands from [docs/PROJECT_STACK.md](../PROJECT_STACK.md).

No step creates, edits, or deletes anything under `docs/plan/`, the step 1 redundancy
inspection included (`AGENTS.md` → `Plan Documents`); report what a step would have changed
there. A change made there on the user's instruction is still inspected and reviewed by
steps 1, 11, and 12.

1. Inspect the final diff and working-tree status. Compare failures against an observed
   pre-change baseline when one exists; do not label a failure pre-existing from memory.
   Inspect what the change made redundant — an orphaned config, a replaced parent or legacy
   file, a registry entry with nothing behind it — and remove it in scope or record it as a
   finding. For non-trivial implementation, compare the diff with the task contract and the
   accepted `Implementation Readiness Note` from [AGENT_WORKFLOW.md](./AGENT_WORKFLOW.md),
   and for delegated work also with the accepted Implementation approval. A changed owner,
   observable contract, approved scope or write ownership, or parallel structure without a
   revised and rechecked note — and, when delegated, renewed approval — is a verification
   failure.
2. Run the project's code-generation step when generated artifacts changed.
3. If localization or other synced assets changed, follow
   [STACK_CONVENTIONS.md](./STACK_CONVENTIONS.md).
4. Format the edited code with the project formatter.
5. Run the narrowest relevant tests or checks that exercise the changed behavior or
   artifact, per [TESTING.md](./TESTING.md) → `Test Execution Scope`.
6. Audit the tests covering the change per [TESTING.md](./TESTING.md) → `Test Suite Audit`;
   a green run is not this audit. Report the search that produced the covering-test list and
   what was added, updated, deleted, consolidated, or intentionally left unchanged — "nothing
   covers this" carries the same search.
7. Run relevant static analysis when executable, configuration, or generated artifacts
   changed, or when the analyzer directly covers the edited artifact.
8. After the changed code and test edits stabilize, run the full relevant suite once when it
   is runnable and applicable, per [TESTING.md](./TESTING.md) → `Test Execution Scope`. If
   runtime analysis or tests are not applicable, record that limit instead of inventing a
   pass.
9. If end-to-end scenario behavior changed, update and verify the relevant scenario docs and
   tests (see [docs/PROJECT_STACK.md](../PROJECT_STACK.md)).
10. For High-risk work, verify the applicable threat assumptions, security, privacy,
    concurrency, recovery, or rollback behavior, and state any part that cannot be exercised
    safely.
11. For every non-trivial diff, perform a final self-review: apply the
    [Simplicity Review Lens](./REFACTORING.md#simplicity-review-lens) to the changed and
    directly affected code, then inspect the complete diff for correctness and scope.
12. Apply the independent-review gate below. Resolve or explicitly record every material
    finding, then rerun affected checks.
13. When the task needs a loop log ([docs/loop/README.md](../loop/README.md) →
    `When To Create A Loop Log`), record it, then update `docs/loop/current.md` per
    [docs/loop/README.md](../loop/README.md) → `After A Loop Run`, in the order stated
    there — remove what expired, add this run's entries, consolidate if it grew — and review
    `docs/CAPABILITY_BRIEF.md` when the conditions in `Files to Review and Update` below apply
    to this work.

## Independent-Review Gate

An independent review is required when any of these apply:

- the change is High-risk
- the diff crosses multiple ownership or runtime boundaries
- the change is large or broad enough that one context may miss interactions
- the work is a broad structural refactor
- the change materially affects behavior or configuration that relevant checks cannot
  meaningfully exercise

Otherwise normal local work may finish after verification and self-review; the main agent
may still request a review when uncertainty, partial coverage, or unfamiliar code makes a
fresh context useful. The execution profile changes how review is obtained, not whether a
required gate applies.

Select the reviewer from the active provider's live descriptions, unless the operator's Orca
policy routes that review in an Orca session. Give it the task contract,
final diff, verification evidence, and for non-trivial work the accepted `Implementation
Readiness Note` with any revision (plus the Implementation approval when delegated), without
substituting the main agent's conclusion. The reviewer's stance is to find what disqualifies
the change. It inspects the code, tests, and evidence before choosing a command and reruns a
check only for a named unresolved risk; a request for another test follows
[TESTING.md](./TESTING.md) → `Test Suite Audit`. An approval with no findings states what was
inspected, which fresh evidence it accepted, and which risk-driven checks it reran, or it is
not a review. When an independent context is unavailable, perform the strongest
fresh-context review available and disclose that limitation.

An independent review of a large, broad, or refactoring diff applies the same
[Simplicity Review Lens](./REFACTORING.md#simplicity-review-lens); unnecessary abstraction
or confirmed in-scope accidental complexity is a material finding.

## Verification Evidence

- Report an executed check as `command — result — limit` when a short form is sufficient.
- Distinguish passed, failed, and not run. A skipped or inapplicable command is not a pass.
- Evidence is fresh or it is not evidence: rerun a check that predates the last change to
  the code it covers before making the claim.
- A sub-agent's report of implementation or check success is a claim, not evidence; the
  main agent establishes evidence by inspecting the integrated diff and rerunning the check
  against that state.
- Once the main agent has fresh evidence for unchanged integrated code, an independent
  reviewer may accept it. Rerun for a named risk — stale or missing evidence, later code
  drift, a failed check, environment dependence, or suspected flakiness; "just to be safe"
  is not a risk.
- Fix a failing check; never weaken it to pass. This list is the whole of what counts as
  weakening, and no other file keeps a second copy of it: disabling or stubbing a test,
  marking it expected-to-fail, loosening an assertion, regenerating a snapshot without
  reading the diff, raising a timeout without a root-caused reason, or rerunning a flaky
  check until it passes. A flake is reported as a finding, with the retries that exposed it.
- Claim a pre-existing failure only with baseline or unchanged-path evidence.
- Measure performance when the change targets it or carries a concrete regression concern;
  routine cleanup needs correctness checks, not benchmarks, though a project-owned budget or
  benchmark still runs as the project defines. A measurement compares the same
  representative task before and after (or against the stated budget when there is no
  before), separates cold and warm runs, and labels estimates and unmeasured costs. A
  smaller diff, file or prompt is not evidence of faster execution or lower token cost.
- For testing, report the behavior protected, focused checks, broader validation, and any
  decision that no new test was needed. Raw test counts or coverage percentages are evidence
  only when the project makes them acceptance criteria.

## Files to Review and Update

Nothing under `docs/plan/` is updated or created by this section, whichever route reached
it; `AGENTS.md` → `Plan Documents` owns that directory.

1. **Shared harness files** — see `AGENTS.md` → `Shared Harness Files`.

2. **`README.md`** (project root)
   - Review it at the commit that closes a batch, or a commit requested on its own, as
     `AGENT_WORKFLOW.md` → `After Implementation` sets the schedule.
   - Update it when the repository structure, key features, or supported app scope changed,
     or when it lacks what a new reader needs: what the project is, how to set it up, and
     how to run and test it. A stock generator template counts as missing.
   - Link to a more specific doc rather than restating it.

3. **`docs/*.md` (repo-level project documentation)**
   - In the affected maintained docs, remove obsolete material and consolidate duplicates at
     their existing owner before adding prose; preserve required operating knowledge and the
     history/plan boundaries below.
   - Create a new doc only for required knowledge with no suitable owner, at the most
     specific location under `docs/`, linked from `docs/PROJECT_STACK.md` → `Related
     Project Docs`. Record what a new agent would need and could not infer from the code.
   - Route by the kind of record, not the topic: durable decisions (the topics listed in
     `docs/decisions/README.md`) go to `docs/decisions/`; short-term run state to
     `docs/loop/`; descriptive, reference, or runbook content under `docs/`.

4. **`docs/CAPABILITY_BRIEF.md`** (the human-facing capability briefing)
   - Review it when a loop run, phase, milestone, or release completes, and whenever
     `README.md` is reviewed at commit time. When it does not exist, create it from
     `docs/mandatory/template/CAPABILITY_BRIEF.md`.
   - Update it only when the work added, changed, or removed a capability a person would
     raise when introducing the project, changed a differentiating mechanism, or invalidated
     a search term; verify kept search terms still match. Usually nothing changes; the loop
     log still records the review, and an invented entry is not acceptable.
   - Never create, rename, or reserve a source-code name to improve a search term; naming
     follows [ENGINEERING_PRINCIPLES.md](./ENGINEERING_PRINCIPLES.md) → `Readability` and
     [STACK_CONVENTIONS.md](./STACK_CONVENTIONS.md), and a capability with no usable search
     term is a discoverability finding.
   - Keep it linked from `README.md` and `docs/PROJECT_STACK.md` → `Related Project Docs`.

5. **`MEMORY.md`** (project root)
   - Create or update it only when a stable architecture decision or repeatable user
     preference is established.

## Documentation Sweep

An explicit request to update the documentation for the project's features, or to
reconcile the documentation against the codebase, triggers `Files to Review and Update` on
its own — no implementation and no commit needed. Judge the request by intent, in whatever
language it is made; feature-led and full reconciliation requests cover the same files.

In scope, brought in line with the repository as it is: `README.md`,
`docs/CAPABILITY_BRIEF.md`, the project docs under `docs/`, `docs/PROJECT_STACK.md`,
[STACK_CONVENTIONS.md](./STACK_CONVENTIONS.md), `docs/loop/current.md` (curated, not
rewritten from the code), and the provider entry stub (`CLAUDE.md`). `MEMORY.md` keeps its
condition above. The entry stub follows its shared template: correct its project-specific
notes, and report rather than remove anything the template mandates.

Out of scope — report the mismatch instead of editing:

- the shared harness files, which change only through the approved harness release
  procedure, even in the canonical source
- `docs/decisions/*.md` and the timestamped `docs/loop/*.md` logs, which are history; code
  that diverges from an accepted decision gets a new decision record or a revisit note
- `PRODUCT.md` and `DESIGN.md`, owned by the design skill
  ([PROVIDER_HARNESS.md](./PROVIDER_HARNESS.md) → `Impeccable Operating Mode`)
- `docs/plan/` — `AGENTS.md` → `Plan Documents`

Method: the code is the truth and the documentation follows it; do not change code during a
sweep, and report a contradiction that needs a code change. Verify documented commands,
resolvable links, the related-docs index, the capability brief's search terms (in full; its
incremental update gate does not apply), both template version lines, and whether
`docs/loop/current.md` still carries a rules section that `docs/loop/README.md` now owns.
Enumerate the in-scope files first, then account for each as updated, reviewed with no
change, or reported out of scope. A sweep may run with no loop log and no review gate, so
put every finding it cannot fix in the final response, and in `docs/loop/current.md` →
`Open Follow-ups` when it stays actionable.
