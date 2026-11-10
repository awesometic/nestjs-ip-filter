# Provider Harness

## Purpose

Operating rules for the three supported providers — Codex, Claude Code and Antigravity:
adopting a runtime, required plugins and skills, sub-agent delegation, hooks, Orca, model
capability and Codex continuity. Every path lives in [PROVIDER_LAYOUT.md](./PROVIDER_LAYOUT.md);
read it before wiring or changing a provider directory.

## Adopting A Provider Or Runtime

- Before recording a runtime's tool names, directories, frontmatter fields, context filename
  or invocation method, confirm each against a real sample: the CLI's own help or output, an
  official doc, or one probe agent. A guessed tool name can silently fail or hang a sub-agent.
  Mark a value you could not verify as unverified in the file that carries it.
- A shared brand is not a shared runtime. Similarly named surfaces can differ in layout, tools,
  context file and delegation; confirm each surface's own spec and leave no comparison matrix
  behind.
- Reuse a path the provider already reads natively before adding a directory, symlink rule or
  config file ([SIMPLICITY_FIRST.md](./SIMPLICITY_FIRST.md)).

Confirm a provider asset's format against that provider's official documentation.
Common skills use one personal entry per skill pointing at its canonical runtime build, with no
project-local copies or aliases; project-specific skills stay in the native project root.
Common sub-agents are complete managed copies in the personal roots; project roots hold only
genuine project roles. Personal availability does not authorize delegation or prove native
invocation.

## Ponytail Dependency

Use the external `DietrichGebert/ponytail` plugin, not a copied skill or an earlier adaptation.
The provider's plugin manager owns the package and its updates; harness sync neither installs
it nor replaces its files. Paths are in [PROVIDER_LAYOUT.md](./PROVIDER_LAYOUT.md#plugin-packages).

At main task start or resume, check only the active provider/profile unless a cross-provider
audit was requested. The prerequisite is installation: report whether Ponytail is installed and
its displayed version, or `unknown` when none is shown. Do not compare versions or require a
minimum. Enablement and session or hook activation are outside this check and do not block
authorized work. Use read-only native evidence; never read credentials, private transcripts or
trust caches.

- Codex: `codex plugin list --json` — find the intended source's installed entry in the
  project's profile.
- Claude Code: `claude plugin list --json` or the native plugin UI. A marketplace checkout or
  cached version alone does not establish installation.
- Antigravity IDE: inspect its global and workspace plugin locations for the installed
  package's `plugin.json` and core skill. `agy plugin list` describes the CLI, not the IDE.

Resolve the real installation from native evidence, not the newest-looking cache folder; a loose
skill or leftover cache is not an installation. Report a missing or unverified installation with
the provider's native install step. Until it is installed or the user excepts it, start no
dependent coding; inspection, planning and bounded dependency-bootstrap work may continue. A
check never authorizes installing, changing global settings, trusting hooks or re-enabling a
plugin.

Once installed, open its `skills/ponytail/SKILL.md` (or the manifest-resolved equivalent) and
apply it with [SIMPLICITY_FIRST.md](./SIMPLICITY_FIRST.md#ponytail-and-harness-precedence);
reading it directly counts when the session does not expose the skill. Report an unreadable core
instead of substituting a copy. Apply the core to coding, refactoring, tests and code review;
other Ponytail commands only when their task applies.

A coding child's Delegation Packet carries the verified provider/profile, package root,
requested level and local overlay; the child opens that core and the named harness rules before
editing. Do not reuse one provider/profile's check for another. A child without access returns
the gap to its parent rather than falling back to an unregistered copy.

## Impeccable Operating Mode

Impeccable is the external, independently installed global design skill that owns `PRODUCT.md`
and `DESIGN.md`.

- Check for its `SKILL.md` in the current provider's native personal root, and report the
  observed installation and version separately from actual invocation. Do not infer one
  provider's installation from another's directory.
- If missing, recommend installing it globally for that provider with its official installer
  (currently `npx impeccable install`, choosing the provider and all projects) once per
  project, as `AGENTS.md` → `Copy Pipeline` says; after a recorded decline, do not recommend it
  again, but still note the missing installation in the report of design or copy work. This is
  guidance: do not run it during a presence check or install or update it automatically.
- The canonical repository does not store, link or distribute Impeccable or its bundled parts.
  Keep existing project hook bindings only when they resolve to the external installation; do
  not enable hooks, change trust or alter permissions during skill cleanup.
- Use it before frontend design and shipped UI copy when available. Its absence does not block
  authorized work: proceed within scope and report the missing global installation.
- Shipped Korean copy follows `AGENTS.md` → `Copy Pipeline`.

## Sub-Agent Operating Rules

The shared delegation rules live in [AGENT_WORKFLOW.md](./AGENT_WORKFLOW.md). Provider-specific
points:

- Do not assume another provider has the same role, name or automatic delegation. Claude Code
  delegates from a sub-agent's `description` or explicitly; Antigravity's parent starts
  sub-agents through `invoke_subagent`, not `@`-mentions; Codex starts them through the active
  surface. Repository documents supply constraints, not a role table.
- When the operator specifies a child model or effort, check the role's pins and the runtime's
  precedence before dispatch. A Codex custom agent file's model and effort can override spawn
  values; choose a compatible role or a scoped ad-hoc child. Report an observed rejection or
  substitution instead of silently changing the route. A pin does not prove the backend model.
- Provider asymmetry is valid: use the best available role or keep the work in the main
  context; do not install a nominal counterpart to make inventories match.

### Optional Lifecycle Hooks

Personal lifecycle hooks may deliver live project rules and check concrete filesystem
prerequisites (registration paths in [PROVIDER_LAYOUT.md](./PROVIDER_LAYOUT.md)). Emitted context
is not evidence of comprehension, complete reads or correct test selection, and a file check
does not establish native callback execution.

Resolve the active project; never fall back to the canonical repository. An ambiguous
workspace, unsupported tool or absent harness gets a scoped limitation or a neutral result.
Preserve native permissions: a passing check never auto-authorizes a tool, and hooks and
generated continuation prompts are never human authorization. Completion checks are advisory;
dirty work, a read-only task or a self-report never authorizes automatic continuation, and
nothing overrides a user stop.

### Hook Discovery

Each main-agent task and resume discovers only the current provider's Agent Engineering hook
entries or files, using read-only registration metadata or hook-file checks within the task's
filesystem and permission scope. Do not read credentials, private transcripts or trust caches.

Report `found` or `not found`; an unrelated hook or the settings container alone does not count.
When the location cannot be read, report `discovery unverified`. Discovery does not establish
callback execution and does not check activation, enablement or trust, so routine checks produce no activation
warnings or repeated native trust instructions. Children report
discovery to their parent. Do not enable hooks, modify trust, bypass native review or change
permissions without authorization.

### Claude Code Context Handoff And Observation

A Claude Code non-fork sub-agent starts with fresh context: it does not inherit the parent
conversation, invoked skills or files the parent read, so the Delegation Packet repeats every
fact and constraint it needs. Keep the default `CLAUDE.md` loading for harness-bound roles
(`omitClaudeMd` would skip the entry and its imports). Imports supply entry text; Markdown links
do not load the files they point to, so the worker opens them under the read order. The built-in
Explore and Plan agents skip `CLAUDE.md`; their read-only results may inform readiness but
cannot supply or approve the Implementation stage. A fork inherits context but still writes the
note and passes the same gate before editing.

To measure instruction delivery, use temporary operator-side hooks — `InstructionsLoaded` for
entry text, the `SubagentStop` transcript for mandatory-file reads and their order — and never
distribute or commit them or their logs.

### Orca Multi-Agent Coordination And Auto Modes

Orca is an optional worktree and coordination surface; it replaces no provider entry, native
rule, permission policy or main-agent responsibility. This section binds a Codex, Claude Code or
Antigravity agent when it calls Orca and when Orca starts it. The caller reads it before
dispatch; the recipient reads its own provider entry, this section and the `Read Order` in its
active checkout.

An Orca session is the one [AGENT_WORKFLOW.md](./AGENT_WORKFLOW.md) → `Read Order` defines.
Follow an `Orca session:` startup line when present; otherwise check at task start with
`[ -n "${ORCA_PANE_KEY-}${ORCA_AGENT_PANE-}" ]`, which prints no value, and report the status as
unknown when the environment cannot be inspected. The main agent of an Orca session also reads
the operator's policy at `~/.orca/agent-engineering/OPERATING_POLICY.md` when the host has one,
and says so when it does not. A live Orca Dispatch preamble that binds the session as a worker
limits it to that assignment. A native sub-agent it starts inherits the variables but not these
reads; its Delegation Packet carries what it needs. An Orca worker, nested or not, reads as the
main agent of its own pane.

For exact CLI syntax, load the version-matched `orca skills get orchestration` and
`orca skills get orca-cli` guides. Supervised runs and DAGs use `orca orchestration`; full
ownership handoffs use `orca worktree create` (without `--agent`) and the terminal commands below. Every task spec, worker start, dispatch, nested helper or
handoff prompt carries the Delegation Packet and the supervised-versus-handoff boundary from
[AGENT_WORKFLOW.md](./AGENT_WORKFLOW.md) → `Harness Delivery To Sub-Agents`. Worktree placement
follows `Worktree Location`, including its Orca-session exception. Wait for a running repository
setup before mutating shared dependencies or build outputs, and add no Orca setup script. Remote
liveness reported as `unverifiable` is absence of evidence, never proof of exit. A dispatched
worker starts a helper on its Run only when its preamble has a SUB-DISPATCH section, within the
nested-depth limit. A full handoff uses no orchestration task or `dispatch --inject`: deliver the
prompt and stop at the send receipt.

Launch every Orca-started agent in its provider's native auto mode, inside the existing
permission and sandbox boundaries:

- **Codex**: `codex --approve-for-me` — automatic approval review inside the `workspace-write`
  sandbox.
- **Claude Code**: `claude --permission-mode auto` — the native auto-mode classifier, not a
  skipped permission check.
- **Antigravity (`agy`)**: `agy --mode auto --sandbox` — `--mode auto` alone does not establish a
  sandbox; verify that the host applies the restriction.

These never authorize a dangerous bypass (`--dangerously-bypass-approvals-and-sandbox`,
`--dangerously-bypass-hook-trust`, `--dangerously-skip-permissions`, `bypassPermissions`) or
editing global agent or Orca settings. The high-level launch commands (`orca agent launch`,
`orca worktree create --agent`, and `orca orchestration worker-start` with `--agent`) cannot
select or verify the provider's execution mode, so no agent is started with them.

Start every agent, a full handoff's included, on the explicit-terminal route: create the agent
terminal in the resolved worktree with
`orca terminal create --command "<provider CLI with auto mode, model and effort>"`, wait for TUI
readiness, then bind supervision with `orca orchestration worker-start --terminal`, or deliver a
full handoff's prompt with `terminal send` and stop at `accepted: true`. Resolve worktree and
setup placement first: `worker-start --terminal` cannot combine with `--agent`, `--model`,
`--effort` or creation flags. Verify model, effort and
mode from the started CLI's own footer or status line. Do not substitute raw `dispatch --inject`
where supervised ownership is required. Creating a terminal does not prove mode, sandbox or hook trust, and the
local route is not established for remote hosts. An automatic approval rejection is not
permission to retry outside the sandbox or through another terminal. When a surface cannot
select or verify auto mode or the required restrictions, report it as unsupported or unknown and
stop that launch; never claim success, mutate global settings or use a bypass flag.

## Model Capability Boundary

- Use a current model that the operator policy or a project evaluation approves for broad
  planning, integration and high-risk autonomous work. Faster or lower-cost models default to
  bounded work unless that approval establishes reliable planning, tool use and recovery.
  When delegating, the child's model tier may narrow its assignment this way; the ban on
  inferring from model names in `EXECUTION_PROFILE.md` governs only the main agent's cadence.
- Do not compensate for a weaker model with static routing tables: narrow its assignment, add
  mechanical checks, or configure an operator or provider policy outside the portable harness.
  Named-model comparisons and evaluation evidence belong in decision or operator records;
  `AGENTS.md` → `Main Model Advisory` is the one named-model exception.
- A provider rules file distributed with the harness (see `PROVIDER_LAYOUT.md`) may adjust
  delegation breadth for its provider and add evidence obligations. It may not relax a review gate,
  verification requirement or other invariant; on anything else the shared rules win.

## Codex Context Continuity

This section applies only to Codex, whose runtime owns conversation items, opaque reasoning state
and compaction.

- When work continues the same assignment, resume the existing task or child instead of starting
  a new context from a visible recap. Keep user constraints, accepted decisions, completed-work
  evidence and the next unresolved action available through compaction. Resume from actual tool
  outcomes; a proposed or failed action is not completed work. Loop records stay project facts,
  not a replacement for model state.
- Fresh contexts remain right for independent reviews, independent tasks, explicit user requests
  and handoffs that require a new worker; give them the packet and evidence. Continuity never
  removes independent review or expands a child's authority.
- Keep native Responses and compaction defaults. Do not edit transcripts or caches, request
  private reasoning, or copy opaque payloads into logs. A runtime or request error is an observed
  failure, not permission to erase real side effects and retry as though nothing happened.
- When checking continuity, report checks that could not run as unrun; visible recall does not
  prove exact encrypted-state preservation.

### Codex Batch Completion And Execution State

Codex-only operational checks on top of
[AGENT_WORKFLOW.md](./AGENT_WORKFLOW.md#durable-work-and-checkpoints):

- Record each batch's owner, observable completion condition and prerequisites in the readiness
  note or loop log. Finish integration, verification and preservation before starting work that
  depends on it; independent work may continue.
- After approving a worker's Implementation stage, use the surface's actual start or resume
  operation and confirm an observable execution state or result before reporting it running or
  complete; a delivered message or approval does not start an idle worker. If it did not start,
  resume it or take over — after confirming the old worker stopped or gave up write ownership.
  An unknown state is not permission to start a concurrent writer.
- Track wall-clock time from task start or the last closed batch using the existing log.
  After 60 minutes without closing a batch, inspect the completion condition, blocker, worker
  state and running commands before opening more work, then shrink the batch, reduce writers,
  unblock or take over as the evidence warrants. Cite a long verification's job status and
  latest output rather than guessing or restarting it. Repeat at least every 60 minutes while
  the stall lasts; a checkpoint, rename or split does not reset the clock. Check at tool-return
  and progress boundaries with bounded waits, without a daemon or polling loop; when control returns
  after an overdue check, audit immediately.
- Report the completed result and its evidence, then the remaining dependency or blocker. Do not
  re-delegate, restate the plan or redo preparation without a changed fact.

## Initializing Skills And Sub-Agents

Choosing project-specific skills and sub-agents is a judgment about what the project is, so its
context must exist first. This does not gate the common skills and sub-agent catalogs in personal
roots or required plugin checks. Before project-specific additions, confirm both:

- the harness documents and structure — `AGENTS.md`, `docs/mandatory/`, `docs/loop/` (including
  `current.md`), and `docs/decisions/`;
- a statement of what the project is — `PRODUCT.md` and `DESIGN.md`, or planning documents under
  `docs/plan/`. The harness's `README.md` and `DELETE_EXISTS.md` there satisfy nothing here.

When either is missing or still holds template placeholders, name the gap and ask the user
whether to continue before installing anything; do not substitute an inference from source code.

## Sourcing Sub-Agents

The common catalogs live in the canonical `agent-engineering` repository (`agents/codex/`,
`agents/claude/` and the generated `agents/antigravity/`) and install as complete personal
catalogs: refresh with `./sync.sh agents home` and verify with `./sync.sh agents home --check`
from that checkout (`--runtime codex|claude|antigravity` for one provider). Never hand-edit a
managed personal role or copy a subset into a project.

Change a common role through the canonical `subagent-creator` skill and refresh the catalog. A
genuinely distinct project role follows `Initializing Skills And Sub-Agents` above and is authored
through `subagent-creator` under a name the common store does not own. Keep existing
project-specific or modified roles. Retiring duplicate project copies is a separately authorized
`./sync.sh agents clean-project` run that needs complete personal catalogs and a backup; harness
sync never removes capabilities. A complete catalog is availability, not an instruction to use
every role.
