# Loop Execution Records

Short-term loop execution records and the current agent state. Durable decisions are promoted
to [docs/decisions/](../decisions/README.md). `current.md` is read before any non-trivial work;
read timestamped logs only when relevant to the current task.

## Record Roles

A timestamped loop file preserves what happened in one run and why its result is credible:
goal, scope, verification evidence, blockers, next action and completion condition. `current.md`
is the curated cross-session projection of what remains true or actionable, not a second
chronology. A decision record preserves a durable choice and its trade-offs after the session
stops mattering operationally.

## Current State Rules

These govern `current.md` and live here because `current.md` is project-owned and never
overwritten by sync. They supersede any rules section still inside an older `current.md`;
replace that section with a pointer here on the file's next update.

The five sections below are roles, and each rule binds by role, not heading text. A section
other than the `## Rules` pointer that maps to no role is reference material for `docs/` or
history for the record that owns it.

- An entry is at most two lines of prose, not counting the pointer that follows it. In
  `Recently Completed` that pointer is required — the loop log for what happened, the decision
  record for a durable choice. Elsewhere an entry may point at a doc, or at nothing when it
  states a standing fact. Anything longer belongs in the record: the entry is a summary of what
  the record now holds.
- Every entry answers "what does the next session do differently?"; delete one that answers
  nothing.
- Never copy a fact that already lives in a loop log or a decision record. Point at it.
- Each section expires on its own condition:
  - `Active Assumptions` — until it stops being true.
  - `Recently Completed` — until repeating or contradicting it is no longer a risk.
  - `Known Risks` — until mitigated or disproved; each entry names what would close it.
  - `Open Follow-ups` — until done or obsolete; each entry names one next action.
  - `Next-session Warnings` — one session. Whoever reads a warning acts on it or deletes it;
    anything still live moves to a risk or a follow-up.
- Consolidate once a new session can no longer absorb the file in one read: past roughly 150
  lines, consolidate after this run's entries go in, in the order `After A Loop Run` gives.
  Consolidating promotes
  durable context to `docs/decisions/`, demotes history to the loop log that owns it, and
  deletes the rest — after confirming the owning record holds the fact, writing it there first
  when it does not.
- Keep secrets and unnecessary personal data out (see `Safety And Privacy`).

## When To Create A Loop Log

Create one per-session loop log for goal-mode, loop-mode, multi-step, worktree, or agentic
tasks; trivial work, as `AGENT_WORKFLOW.md` defines it, needs none. Open it at the start of the run, and append as each
batch completes, so finished work survives a context loss.

## Naming Convention

```
docs/loop/YYYY-MM-DD-HHMM-short-feature-slug.md
```

Use the local project timezone (KST, `+0900`) unless the project defines another
standard, and an English lowercase kebab-case slug, e.g.
`docs/loop/2026-06-18-1030-note-editor-validation.md`.

## What To Record

Concise operational records: failed attempts, test failures, important constraints and
unresolved risks matter more than step-by-step narration. No private chain-of-thought.
Record worktree and branch when known, `Unknown` otherwise.

For a multi-batch run, keep each batch's owner and observable completion condition in this
log. At closure, record what finished, verification results and limits, the base and retained
commit or verified snapshot location, and remaining dependencies; keep an incomplete checkpoint
separate from a completed batch. Worker or job state and stalled-batch audits go here too, not
in a parallel tracker; include the last completion and checkpoint times when cadence matters.
One stated exception to this concision: `docs/plan/DELETE_EXISTS.md` step 4 records its carry-over
in full. Readiness notes, messages and delegations are not implemented results.
The operating contract lives in
[AGENT_WORKFLOW.md](../mandatory/AGENT_WORKFLOW.md#durable-work-and-checkpoints), with
Codex-specific stall checks in
[PROVIDER_HARNESS.md](../mandatory/PROVIDER_HARNESS.md#codex-batch-completion-and-execution-state).

### Safety And Privacy

Never record credential-like strings (API keys, tokens, private keys, client secrets,
observability DSNs), production data rows, or private user identifiers in loop logs, decision
records, or `current.md`. Describe sensitive issues abstractly: "A production credential was
present in the environment; it was not copied into documentation."

### Conflict Resolution

Surface merge or rebase conflicts that involve logic, schema, API, privacy, auth, payment or
security behavior; resolve simple formatting or import conflicts and record the resolution.

## Git Tracking

`README.md`, `current.md`, and decision records are committed. Loop logs stay tracked unless
the repository owner decides otherwise; do not add them to `.gitignore` silently.

## Loop Log Template

```markdown
# Loop Run: <Task / Feature Name>

## Metadata
- Date:
- Agent:
- Worktree:
- Branch:
- Related docs:
- Related decision records:

## Goal
-

## Scope
Allowed:
-
Forbidden:
-

## Attempts

### Attempt 1
-
Verification:
-
Result:
-

### Attempt 2
-
Verification:
-
Result:
-

## Files Changed
-

## Behavior Changed
-

## Verification Summary
- Command:
- Result:

## Risks
-

## Follow-ups
-

## Current State Update
Summarize what was added, removed, or changed in `docs/loop/current.md`.

## Capability Brief Review
<what was updated in `docs/CAPABILITY_BRIEF.md`, or why this run needed no update>
```

## After A Loop Run

Update [current.md](./current.md) so the next session starts from accurate state, in this
order: remove what expired under `Current State Rules`, then add this run's entries, then
consolidate if the file grew. Promote durable decisions to
[docs/decisions/](../decisions/README.md).

Then review `docs/CAPABILITY_BRIEF.md` under
[AGENT_POST_IMPLEMENTATION.md](../mandatory/AGENT_POST_IMPLEMENTATION.md) →
`Files to Review and Update`, and record in the log what that review changed — or why the run needed
no change there.
