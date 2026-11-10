# Agent Workflow

## Purpose

The canonical read order and the before/during/after workflow for every agent in this
repository. Project commands live in `docs/PROJECT_STACK.md`; project rules in
`docs/mandatory/STACK_CONVENTIONS.md`.

Trivial work is a read-only lookup, or an edit confined to one place whose correctness is
evident on sight — a typo or link fix, a one-line value change. Everything else is
non-trivial, and so is any change that touches a High-risk area below, whatever its size;
every "non-trivial" in the harness means this.

## Read Order (before any non-trivial work)

1. `AGENTS.md`.
2. `PRODUCT.md` and `DESIGN.md` when the task affects product behavior, UI/UX,
   user-facing copy, or the design system, or when the project's Stack rules require
   them. Do not load product/design context for unrelated infrastructure or backend work.
3. These baseline mandatory rules (skip `docs/mandatory/template/`; it holds templates,
   not rules):
   - [EXECUTION_PROFILE.md](./EXECUTION_PROFILE.md) — select the execution shape.
   - [ENGINEERING_PRINCIPLES.md](./ENGINEERING_PRINCIPLES.md) — portable design and code
     standards.
   - [SIMPLICITY_FIRST.md](./SIMPLICITY_FIRST.md) — simplest correct change, the build
     ladder, and the active `SIMPLICITY` level.
   - [STACK_CONVENTIONS.md](./STACK_CONVENTIONS.md) — this project's stack and domain
     contracts. `docs/mandatory/STACK_CONVENTIONS.md` and `docs/PROJECT_STACK.md` each
     carry a `Template version:` line that pairs with the template of the same name in
     `docs/mandatory/template/`. When a line is missing or the versions differ, that file
     predates its template — before starting the requested task, whatever its topic, tell
     the user and ask whether to re-align it now (an agent-driven migration that keeps the
     project's real contracts in the current template format). When the user declines,
     record that in `docs/loop/current.md` → `Known Risks` with the versions involved, and
     do not ask again until they change. A delegated worker or headless session asks
     nobody: it proceeds and reports the mismatch.
4. The relevant feature/domain and stack docs under `docs/`; follow their conventions.
   `docs/CAPABILITY_BRIEF.md` may be read for orientation; it binds nothing and is never a
   rule source. A plan document under `docs/plan/` relevant to the task is read here as
   the user's planning context; writing there follows `AGENTS.md` → `Plan Documents`.
5. `docs/loop/current.md`. For goal-mode, loop-mode, multi-step, worktree, or agentic
   tasks, also read `docs/loop/README.md`. When the task touches something this repository
   may have handled before — a recurring defect, a revisited subsystem, an approach that
   sounds already tried — search `docs/loop/` by slug and keyword before starting, so a
   failed attempt is not repeated.
6. If the task involves full-app scenario or debug testing, read the project's
   scenario/debug test guide first (linked from `docs/PROJECT_STACK.md`) and follow its
   execution order.

The remaining mandatory files bind when triggered:

- [REFACTORING.md](./REFACTORING.md) — read fully before an explicit refactor,
  simplification, cleanup, or broad structural change. Feature work with a broad structural
  change applies its `Ordinary Changes` and `Simplicity Review Lens`; the explicit-refactor
  procedure binds only an explicit request. The lens also applies when post-implementation
  review calls for it.
- [TESTING.md](./TESTING.md) — read before writing or changing a test, and when a change
  touches code, paths, resources, or artifacts that existing tests cover. The trigger is
  the work, not the request's wording: in a repository with tests, ordinary implementation
  reaches this file.
- [PROVIDER_HARNESS.md](./PROVIDER_HARNESS.md) — read in full, together with
  [PROVIDER_LAYOUT.md](./PROVIDER_LAYOUT.md), which holds every provider path, when
  installing, changing, or wiring provider assets (skills, sub-agents, Impeccable). When
  invoking an agent through Orca, or when the main agent runs in an Orca session, read its
  `Orca Multi-Agent Coordination And Auto Modes` section and the operator policy it names;
  the rest of this read order still applies. An Orca session is one launched with an Orca
  Dispatch preamble or a Delegation Packet that names Orca as its launcher, whose startup
  context carries an `Orca session:` line, or where `ORCA_PANE_KEY` or `ORCA_AGENT_PANE` is
  set. Check presence only, never print a value, and report the status as unknown when the
  environment cannot be inspected. Codex reads its `Codex Context Continuity` section when the
  work spans several batches, runs or supervises workers, or resumes earlier work.
- [AGENT_POST_IMPLEMENTATION.md](./AGENT_POST_IMPLEMENTATION.md) — read when
  an implementation batch closes (see `After Implementation`).
- [DOCUMENTATION_STYLE.md](./DOCUMENTATION_STYLE.md) — read before creating a Markdown
  document or substantively editing one.
- [KOREAN_WRITING.md](./KOREAN_WRITING.md) — read whenever the text you are about to
  write is Korean, whether a response or a document; it binds in no other language. Read
  every section once while the file is open, not only the part that looks relevant; open
  it again when it is not in front of you. Shipped copy order lives in `AGENTS.md` →
  `Copy Pipeline`.

Throughout the task and in every answer, verify before asserting: open the file before stating what this repository does, and the
official source before stating what an external library, API, CLI flag, output format,
platform limit, or an error you did not just produce means. Investigate to the depth the
question needs, in the subtrees and configuration roots that own the behavior, and finish
a survey before reporting it. A result carries the pattern that produced it, what it
covered, and whether it was observed by running something or only read from code or
documentation, because "nothing matches" is a claim about the search; when something cuts
the investigation short, say what is missing and what it would have settled.

Then, before committing to an approach — as an edit, a presented plan, or remediation
from review findings:

- State the goal, key assumptions, and verification path briefly. The execution profile
  shapes batches and delegation, never the goal or quality bar.
- Classify risk independently of the profile. Authentication, payment, private data,
  destructive migrations, irreversible operations, concurrency, and production permission
  changes are High when materially affected; SQL or shell use alone is not. For the
  High-risk subset that is hard to reverse once applied — a destructive migration, a
  production permission change, an irreversible external effect — state the intent and get
  confirmation before making the edit. A user request that names that action and its target
  is the confirmation, unless a procedure prescribes its own (such as
  `docs/plan/DELETE_EXISTS.md` step 3); a broader request, or such an action discovered during the work, still
  needs one. When no confirmation channel is available, stop and report instead.
- If multiple interpretations would change the result, surface them instead of choosing
  silently.
- Collect what planning uncovers and raise it once: a contradiction between the
  requirement and the repository, or within the requirement, goes to the user in one
  batched question before work begins.
- If unclear requirements cannot be resolved through repository exploration, ask before
  implementing.

## Implementation Readiness Gate

An actionable request authorizes the routine, reversible work within its stated scope.
Carry that work to its required outcome rather than stopping at an offer or asking again
for an approval already given. An explicit planning-only request ends at the plan. Ask
about a missing consequential decision when it would change scope, ownership or the
result, and continue independent authorized work while the answer is pending. The risk
and permission gates above and the
[speculative-complexity agreement](./SIMPLICITY_FIRST.md#speculative-complexity) still
apply. Prepare what can be made concrete and reviewable before asking for a remaining
approval. A failed question tool, an unanswered prompt, or elapsed time supplies no
approval.

During sustained work, give brief progress updates when a finding, decision, or change of
direction matters to the user, then continue. The task is complete when every required
outcome is accounted for and the results of tools and children the deliverable depends on
are collected; a progress summary or announced next step is not completion. Continue
independent work while results are pending. A blocker may end the turn with a precise
account of unfinished work, and a dispatch-only assignment ends at its handoff contract.
These rules never override permission boundaries, a user request to stop, or the
repetition limit below. A correction or side question during active work steers the
existing assignment unless the user cancels or replaces it.

Before committing to an approach on any non-trivial work, make the ownership and contract
decision observable in an `Implementation Readiness Note`. The commitment is the trigger:
the first edit when you implement directly, the plan itself when the deliverable is a plan
or plan mode is in force, and the first remediation edit after review findings. The note
stays in working context; it needs no repository file or user confirmation when no open
decision remains, and for a plan deliverable it is what you present. Fields:

- `Contract` — the responsibility and observable product or system contract the requirement
  belongs to
- `Evidence` — the documents, owner, extension points, sibling flows, and tests inspected
- `Route` — the existing owner to extend or route through, plus behavior unique to this change
- `Verification` — the observable behavior, contract, and risks the check must prove, the
  existing tests to inspect and intended evidence layer, and the check named before work
  starts or the reason nothing can exercise it; follow [TESTING.md](./TESTING.md) and do
  not freeze speculative test counts or case matrices
- `Parallel structure` — `None`, or the stated contract difference that justifies one
- `Open decision` — `None`, or a blocker that must be resolved before implementation. A
  reversible choice you have already made with a default goes under `Route` and into the
  response

When the main agent implements directly, it creates and checks this note before the first
edit and continues without asking when the note is complete and `Open decision` is `None`.

One approach commitment owns one note; an approval to proceed releases it rather than
producing a second. Resuming from an accepted note re-checks it: confirm the approval
closed what was open and that `Evidence` still holds, checking `Evidence` first when the
session changed. "Go ahead" does not answer an `Open decision`.

When the commitment is a plan (a requested plan or explicit plan mode), review it before
presenting it with two independent contexts selected per
[AGENT_POST_IMPLEMENTATION.md](./AGENT_POST_IMPLEMENTATION.md) → `Independent-Review Gate`:
one reads it as the person who must act on it — is it complete, unambiguous, and executable
as written — and one reads it to disqualify it. With one
context, run the disqualifying read and disclose the missing one; with none, that gate's
fallback governs. Give each the plan and the note's evidence; a clean report states what was inspected and
which pointers were settled. Repair material findings —
those that would change owner, contract, scope, or verification path — carry the rest to
the user, and re-review. The initial review is round one, a round reads one version of the
plan in both stances or in the one the fallback leaves, and the loop ends after the fifth round, or earlier when the
repetition rule below stops it, and remaining material findings go to the user with each
round's changes. An approved reviewed plan gets only the note re-check before the first
edit. When no plan review ran and the `Independent-Review Gate` conditions are already
visible while planning, run that review against the note before the first edit.

### Harness Delivery To Sub-Agents

Every non-trivial delegation — to a native sub-agent, an external orchestrator's
supervised worker, a nested helper, an existing session, or a full ownership handoff —
sends a Delegation Packet naming:

- the target repository identity and how to resolve its active and primary durable
  checkouts on the execution host (exact paths when known, or the recipient confirms them
  in its own workspace)
- `AGENTS.md` in that active checkout and an explicit instruction to follow the complete
  `Read Order` of its `docs/mandatory/AGENT_WORKFLOW.md`, including the provider rules
  layer and triggered documents at their stages
- scoped task facts separated from hypotheses, explicit write ownership and scope,
  product/domain constraints, and verification conditions
- for coding work, the verified Ponytail fields required by
  `docs/mandatory/PROVIDER_HARNESS.md` → `Ponytail Dependency`

The parent's prior reads, a shared workspace, inherited conversation, a hook invocation,
or a successful enqueue or terminal injection do not show that the recipient opened or
followed the rules; native delivery may supply entry text, and linked mandatory files
still need reading. In supervised delegation the parent or coordinator keeps integration
and batch closure and enforces `AGENT_WORKFLOW.md` → `Delegated Implementation Stages`,
including for nested helpers. A full ownership handoff transfers main-agent responsibility:
the receiving session runs its own `Read Order`, Ponytail and hook checks, readiness gate,
implementation, verification, and loop-log curation without stage approval from the
sender. Resolve the recipient's `Read Order` from its active target checkout, never the
caller's. Provider-specific delivery, Orca orchestration, and auto-mode launch rules live
in `docs/mandatory/PROVIDER_HARNESS.md` → `Sub-Agent Operating Rules`.

Hooks may supplement delivery or check an observable condition; they never replace the
Delegation Packet, readiness note, parent evidence check, or Implementation approval, and
a successful hook establishes only its measured condition.

### Delegated Implementation Stages

Every supervised non-trivial implementation has two stages (a full ownership handoff
transfers both and the integration to the receiving session):

1. **Readiness.** The worker receives the Delegation Packet (goal, read scope, constraints,
   document paths, facts separated from hypotheses, verification conditions), may only read
   and search, and returns the `Implementation Readiness Note`. Record the worktree or
   equivalent state before this stage and compare it afterward; the main agent checks the
   note against repository evidence and verifies the worker introduced no mutation.
2. **Implementation.** Start only after the note is complete and unblocked. Resume the same
   worker, or give a replacement the original packet and accepted note. The approval names
   the accepted owner, write ownership, and verification conditions. The worker returns the
   changed files, reused route, behavior unique to the change, test results, and final note.

Do not enter the Implementation stage when:

- the owner or observable contract is unresolved
- a parent-provided owner hypothesis conflicts with repository evidence
- a parallel owner, state, page, module, or abstraction has no stated contract difference
- the Readiness stage changed the worktree or other delegated state
- the work would exceed delegated write ownership

A parent-provided owner is a hypothesis until repository evidence confirms it. If new
evidence changes the owner, contract, or scope during implementation, stop editing and
revise the note first: a directly implementing main agent re-checks it before resuming, and
a worker returns it and waits for a new implementation approval.

Repetition is a signal, not a strategy. When the same command or approach has failed twice
in a row and the second attempt produced no new diagnostic information — a different error
message is not new information unless it changes the hypothesis — do not run a third
variation: stop, report the attempts and their failing evidence, and either re-derive the
approach under [SIMPLICITY_FIRST.md](./SIMPLICITY_FIRST.md) or surface the blocker. Repair
that keeps creating fresh defects in its own fixes is not converging either: read the second
round that finds a defect in a previous round's repair — applied or only proposed — as the
same signal and take the same exits. Stopping on repeated failure is reported, never
hidden; when the failures make the working cadence unreliable,
[EXECUTION_PROFILE.md](./EXECUTION_PROFILE.md) → `Downgrading And Stability` governs.

## Durable Work And Checkpoints

### Worktree Location

Before implementation, identify the active checkout and its repository's primary durable
checkout from project documentation and Git worktree metadata, and record the primary root
in the loop log; a child's current directory does not establish it. Resolve an ambiguous
or missing primary root before creating a worktree. Working directly in an authorized
durable checkout remains valid.

Every new implementation worktree belongs under
`<primary-project-root>/.agents/worktrees/<task-name>/`. Derive the directory name from
the short branch name: strip exactly one recognized leading provider or agent name and its
following delimiter run (`/`, `-`, `_`, or `.`), then replace any remaining `/` with `-`
(`codex/fix-login`, `claude-fix-login` → `fix-login`; `feature/login` → `feature-login`).
An empty, dot-only, or invalid result is a location decision to resolve, not a reason to
fall back to a temporary path.

In an Orca session, as `Read Order` defines it, the location and name above do not apply
to the main agent or an Orca worker: it creates a worktree through Orca at the location
Orca chooses and treats the session's own Orca-managed checkout as compliant. A native
sub-agent uses the location its Delegation Packet names. Branch occupancy, preservation,
and the bar on moving, deleting or cleaning another session's worktree still apply; the
destination, collision, symlink, Git-ignore and explicit-path rules below do not. If Orca
cannot create the worktree, or the session status is unknown, use the location above.

Before creation, check the worktree list, branch occupancy, destination and real parent
paths; reuse a checkout only when its branch and task ownership match, and on another
task's name collision append a short hash of the full branch name and record it. Do not
follow a symlink outside the primary root, reset a branch, or force a second checkout of
an occupied branch. Git-ignore only the worktree subtree, never all of `.agents/`, and use
an explicit-path Git operation when a native creator cannot honor this location. For an
existing external or temporary worktree, preserve task-owned work before moving new
implementation to a compliant location. Do not silently move, delete or clean another
session's worktree. A temporary directory never holds the only copy of source or required
evidence.

### Change Units

A change unit is one commit, or one pull request when the work goes through review, that
makes one self-contained change — usually one part of a feature. Plan the whole goal, then
cut it into units small enough to reason about, verify and review in one pass, and record
the cut in the readiness note's `Route`. The execution profile changes batch size, never
what each unit must satisfy:

- **Works on its own.** After each unit lands, the build, the tests and the running system
  still work, shown by a build and the narrowest relevant tests at that unit's state. A
  unit that only works together with a later one is not a unit; merge them. This clause
  wins over the others.
- **One kind of change.** Keep a refactoring, rename or move apart from a behavior change
  or bug fix; a small cleanup inside code the change already touches may ride along, under
  [ENGINEERING_PRINCIPLES.md](./ENGINEERING_PRINCIPLES.md) → `Minimal, Local Changes`. The
  tests that prove a change land in its unit; tests that pin existing behavior before a
  refactoring may land first.
- **Lands with its use.** A new API, constant, configuration key, flag or helper arrives
  with a caller, a test that exercises it, or the next unit of the same batch that consumes
  it. Remove one in the unit that drops its last use.
- **Keeps one owner.** Each value, constant, setting and infrastructure definition stays at
  its single owner, as [ENGINEERING_PRINCIPLES.md](./ENGINEERING_PRINCIPLES.md) →
  `Design Direction` requires; do not copy a value into several units, and remove a
  temporary shim, stub or flag in a named later unit.
- **Deploys separately when it rolls back separately.** An infrastructure, configuration,
  schema or dependency change with its own rollout or rollback goes in its own unit, ahead
  of the code that needs it, with its rollback path in the unit's record — unless the code
  must change in the same step for the system to keep working.

Cut along the seams the work actually has: by layer behind an agreed shared contract, by
end-to-end slice of behavior, or a grid of both with one unit per cell; by group of files
that different owners or reviewers approve; and, within one batch, by stacking, where the
next unit starts from the previous one before that one is accepted. Size is a judgment:
about 100 changed lines is usually comfortable and about 1,000 usually too large, and lines
spread over many files weigh more; when in doubt, cut smaller. A whole-file deletion, generated output, a trusted
mechanical rewrite, a migration or a declarative dataset may stay large when splitting would make it harder to
check. When a unit cannot
be made small, look for a preparatory refactoring unit; otherwise keep it whole, say why in
its record and verify it more thoroughly. A tightly coupled change with no independently
usable intermediate state stays one unit, as `Completion And Preservation` says.

Units do not multiply the batch's gates: the post-implementation checklist, its full-suite
run, its commit-time document review and the `Independent-Review Gate` in
[AGENT_POST_IMPLEMENTATION.md](./AGENT_POST_IMPLEMENTATION.md) run once on the batch's
integrated result, judged over the whole batch.

When a unit stops fitting — its evidence outgrows working context, its diff grows past
the cut, or its verification has to restart — land the part that meets these clauses,
checkpoint the rest, and re-cut; a re-cut that changes owner, contract or scope follows the
revise-the-note rule in `Delegated Implementation Stages`, otherwise it only updates
`Route`. Where commits are not authorized, a unit lands as a loop-log entry naming its
files, verification and what follows, preserved under `Completion And Preservation`. Each
unit's commit message or entry says what it changes and what follows.

### Completion And Preservation

A batch has one accountable owner and an observable completion condition. It closes only
after the main agent checks the integrated result, applicable verification and recoverable
preservation; a worker's completion message or a saved checkpoint alone does not close it.
Open dependent implementation only after its prerequisite batch closes; independent work
may run in parallel. Keep a tightly coupled change in one batch when no intermediate
contract is independently usable. Codex's execution-state and stall checks live in
[PROVIDER_HARNESS.md](./PROVIDER_HARNESS.md#codex-batch-completion-and-execution-state).

Preserve task-owned changes at batch closure and before a planned handoff, and during
active editing leave a recoverable checkpoint at least every 60 minutes by default and
before a long-running command — a preservation interval, not a deadline. If control is
unavailable when one is due, record that and preserve at the next safe opportunity. Honor
a user stop immediately; checkpointing and audits never delay it or authorize resuming
stopped work.

A checkpoint records the base commit, owned changed/deleted/new files, required
verification evidence, and how to recover them. Use a task-scoped commit reachable from a
retained branch in the primary repository, or a verified snapshot outside every removable
worktree and temporary directory; a detached commit ID, a tracked-files-only diff, or a Git
bundle alone is insufficient. If commits are not authorized, use a scoped snapshot in the
allowed durable storage. Check the saved inventory and recovery inputs before calling it
preserved. Keep credentials and unrelated session changes out, and never overwrite another
session's index or files. If safe preservation is blocked, report the gap and stop
accumulating edits that depend on it.

Use the existing loop log for completion evidence, preservation references and remaining
dependencies, following [docs/loop/README.md](../loop/README.md#what-to-record). A batch
boundary or elapsed time does not itself require another approval, a full reread or a
duplicate test run.

## Skills And Sub-Agents

- Treat the live skill and sub-agent names, descriptions, and paths exposed by the active
  provider as the routing source of truth; do not preload or recreate a static
  task-to-role matrix. The stated exceptions are the `write-commit-messages` preference
  below and `AGENTS.md` → `Copy Pipeline` and `Required Ponytail Plugin`.
- Select zero or more skills whose descriptions materially match the task, follow each
  skill's trigger rules, and honor a skill the user names. Loading none is valid when none
  adds task-specific knowledge and no Ponytail coding dependency applies.
- Announce selections as required by [AGENTS.md](../../AGENTS.md) →
  `Skill And Sub-Agent Announcements`.
- The user's explicit instructions and existing authorization take precedence over a
  skill's guidelines, within higher-priority policy. If a skill causes a pause, new
  approval request or incomplete result, identify the exact `SKILL.md`, quote the clause
  and explain its applicability; do not turn a guideline into a new approval gate.
- When creating a commit, use the `write-commit-messages` skill whenever the active
  provider exposes it; otherwise follow the repository's documented style.
- Keep fast local work and tightly coupled sequential steps in the main context. Use a
  sub-agent for a bounded independent question, read-heavy or output-heavy work, a fresh
  context, or parallel work with real latency savings. Do not delegate merely to satisfy a
  quota. Prefer a roster role scoped for bounded read-heavy work — investigation,
  comparison, classification, summarization, repetitive execution — unless doing it
  directly costs less than the handoff; the worker returns findings and open decisions,
  and the main agent decides them.
- The main agent owns planning, selection, integration, verification, and the final
  answer. Split work by concern with a narrow ownership boundary per sub-agent.
- A provider rules file distributed with the harness may set a different delegation breadth
  for its provider, per
  [PROVIDER_HARNESS.md](./PROVIDER_HARNESS.md) → `Model Capability Boundary`; these rules
  govern everything else about delegation.

## After Implementation

When an implementation batch closes, follow
[AGENT_POST_IMPLEMENTATION.md](./AGENT_POST_IMPLEMENTATION.md).

The commit that closes a batch, or a commit requested on its own, triggers that file's
`Files to Review and Update` step, even when no implementation preceded it; intermediate
unit commits and checkpoint commits do not. An explicit request to update or reconcile the
project's documentation triggers the same step with neither implementation nor a commit;
that file's `Documentation Sweep` owns its scope.

## Final Response Expectations

Keep the response proportional to the work and omit fields that do not apply. For
implementation, diagnosis, or review work, report the material outcome and verification,
plus manual gaps, risks, assumptions, or deferred findings when useful to the handoff.
Report skill and sub-agent use as `AGENTS.md` → `Skill And Sub-Agent Announcements`
requires.

The response language is set in `AGENTS.md` → `Response Language`. Korean responses follow
[KOREAN_WRITING.md](./KOREAN_WRITING.md) and address the reader in 존댓말 (해요체 or
하십시오체).

Write for a working engineer: practical and grounded in evidence, in a tone that stays
warm rather than clipped. Lead a long answer with the outcome, then the detail that
supports it. Mark sections with emoji so a reader can tell at a glance what each one is
about, and where they fit, use tables, lists, and small charts to make the answer easy to
read; put a comparison in a table when it has more than one dimension. A simple question
— one answerable in a few sentences — still gets a short answer, and inline code for a
symbol or command name is not formatting in this sense and stays. Where a provider rules
layer mandates a fixed response frame, that frame is not optional formatting and this
paragraph does not override it. Presentation never earns an inaccuracy: a table, a
summary, or a cut for brevity that distorts a fact or drops a material finding is a
failure of the answer, not a formatting choice.
