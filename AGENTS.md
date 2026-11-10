# AGENTS Guide

Harness version: 1.17.1

Stack-agnostic operating guide for AI agents in this repository.

## Provider Rules Layer

Before starting work, load the rules file listed for your provider in
[docs/mandatory/PROVIDER_LAYOUT.md](./docs/mandatory/PROVIDER_LAYOUT.md) and follow it. For
Antigravity that file is `.agents/rules/strict-execution.md`; Codex and Claude Code have none
today, so they load nothing here. Do not assume it was loaded for you — open it.

## Response Language

Every message to the user — answer, progress update, announcement, notice or question — is in
Korean, whatever language the user writes in. Content the user asks for in another language,
such as a translation, is a deliverable, not the response language.
Code, symbols, commands, paths and quoted error output stay verbatim.
[KOREAN_WRITING.md](./docs/mandatory/KOREAN_WRITING.md) and the 존댓말 floor in
[AGENT_WORKFLOW.md](./docs/mandatory/AGENT_WORKFLOW.md) → `Final Response Expectations` apply.
Any child's report to its parent agent, a supervised or nested worker included, is not a
message to the user.

## Skill And Sub-Agent Announcements

At the start and end of every task or distinct work phase, tell the user which skills and
sub-agents are planned or actually used, with each one's verified source directory
(personal/common, project, plugin, built-in or ad-hoc, or unknown). Announce a choice before
applying it, and a later addition before its first use; say what an agent without a prepared
definition was called for. State separately when no skill or no sub-agent is planned or used,
or that selection is still pending. At the end, report actual use and distinguish failed or
cancelled attempts from work that ran; availability alone is not use. One update may close
one phase and open the next.

A supervised child reports its selections to its parent before use and its actual use
afterward; the parent relays them in its next update and final report. A full ownership
handoff takes on the main-agent duty. This rule does not require using a skill or sub-agent.

## Required Ponytail Plugin

Ponytail is a required external plugin for implementation, refactoring, test authoring and
code review. At each main task and resume, check its installation for the current provider,
report its displayed version, and read its installed core skill before the coding work,
with the overlay in
[SIMPLICITY_FIRST.md](./docs/mandatory/SIMPLICITY_FIRST.md#ponytail-and-harness-precedence).
The check, a missing installation and child delivery follow
[PROVIDER_HARNESS.md](./docs/mandatory/PROVIDER_HARNESS.md#ponytail-dependency); read-only
and dependency-bootstrap work may continue while it is missing.

## Hook Discovery Check

At the start of every main-agent task and after resuming it, discover the current provider's
Agent Engineering hook entries or files under
[PROVIDER_HARNESS.md](./docs/mandatory/PROVIDER_HARNESS.md) → `Hook Discovery` and report
`found`, `not found`, or `discovery unverified`. Continue authorized work with manual harness
reading and parent-to-child delivery. A delegated child reports its result to its parent.

## Main Model Advisory

The current tuning baselines are `gpt-6-astra` for Codex and `claude-opus-5-5` for
Claude Code — recommendations, not required engines or a guarantee of results. When
trusted runtime metadata first confirms that this conversation's main agent uses a
different model, name the baseline and current model once per conversation, note that
model-specific behavior may differ, keep that fact in handoff or compaction state, and
continue. Do not give the notice for sub-agents, change models, ask for approval, or
select an execution profile from the model name; when the actual model is unknown, do not
guess. An alias counts only when the runtime resolves it to the baseline.

## Product And Design Context

This file is the entry point and constitution; the canonical read order lives in
[docs/mandatory/AGENT_WORKFLOW.md](./docs/mandatory/AGENT_WORKFLOW.md). Detailed rules live
in `docs/mandatory/` and project details in `docs/`. The sections above, `Copy Pipeline`
and `Plan Documents` live here because they must bind before any trigger fires.

`PRODUCT.md` and `DESIGN.md` are created and maintained through the Impeccable design
skill (see [PROVIDER_HARNESS.md](./docs/mandatory/PROVIDER_HARNESS.md)). When product, design
system, UI-facing copy, or agent harness rules change, keep those files and the related agent
instructions in sync.

### Copy Pipeline

For a product that ships Korean, shipped copy is produced in one fixed order; a simplicity
level cannot propose it away. English is the source: Impeccable writes it on the surfaces
its own description covers, the skill that owns the surface or the agent writes it
elsewhere, and the agent writes it everywhere when Impeccable is absent. The Korean is
translated from that English and then polished: the `humanize-korean` skill runs whenever
the active provider exposes it, and
[KOREAN_WRITING.md](./docs/mandatory/KOREAN_WRITING.md) → `Self-Check` closes the pass
either way — the skill's thresholds never substitute for that file's absolutes. Every
other locale is translated from the same English. Only shipped locales are produced: in a
Korean-only product the English draft is working material. Korean proper nouns the app
ships stay verbatim in every locale, and fields that are matched rather than read — a
store keyword field — sit outside this order, per
[ENGINEERING_PRINCIPLES.md](./docs/mandatory/ENGINEERING_PRINCIPLES.md) → `Readability`.

The order governs copy you are writing or revising and reopens nothing else. It reaches
user-facing strings that carry a clause in Korean: measure on the Korean once it exists,
and while drafting the English judge by what its Korean will carry; when in doubt whether
a string carries a clause, the order applies. A label too short for one (확인, 닫기) is out and follows the design system's copy
contract. The agent's own responses and documents are not shipped copy. Where you cannot
tell whether the product ships Korean, proceed in English and surface the question in the
report. When shipped-copy work arises and Impeccable is absent, recommend installing it
once per project (details in [PROVIDER_HARNESS.md](./docs/mandatory/PROVIDER_HARNESS.md) →
`Impeccable Operating Mode`); record a decline in `docs/loop/current.md` → `Known Risks`
and do not ask again until it changes. A delegated worker or headless session asks nobody:
it proceeds and surfaces the recommendation in its report.

## Harness Document Structure

- `AGENTS.md` — entry point and constitution (this file).
- `CLAUDE.md` — Claude Code entry stub; it imports only `AGENTS.md`, because Claude Code does not read
  `AGENTS.md` natively; `PRODUCT.md` and `DESIGN.md` are read on the `Read Order` trigger.
- `docs/mandatory/` — mandatory rules, highest priority after `AGENTS.md`; its `template/` subfolder holds templates, not rules.
- `docs/` — feature/domain and stack-specific documentation.
- `docs/loop/` — short-term loop records and current agent state.
- `docs/decisions/` — durable decision records.
- `docs/plan/` — the user's own planning documents (see `Plan Documents`).

## Mandatory Rules

The rules directly under `docs/mandatory/` bind every agent;
[AGENT_WORKFLOW.md](./docs/mandatory/AGENT_WORKFLOW.md) → `Read Order` says which load up
front and which on a trigger. The portable core is AGENT_WORKFLOW, EXECUTION_PROFILE,
ENGINEERING_PRINCIPLES, SIMPLICITY_FIRST, REFACTORING, TESTING, AGENT_POST_IMPLEMENTATION,
PROVIDER_HARNESS, PROVIDER_LAYOUT, DOCUMENTATION_STYLE and KOREAN_WRITING. The one
project-specific rule, [STACK_CONVENTIONS.md](./docs/mandatory/STACK_CONVENTIONS.md), keeps
the template's filename and format with per-stack content; generate it from
`docs/mandatory/template/`.

## Shared Harness Files

The files below are the portable core: byte-identical across every project that adopts
this harness, kept in sync from one canonical source. Do not edit them in a single
project, and do not edit them at all without developer approval. An approved change is
made in the canonical source and re-synced to every adopting project.

- `AGENTS.md`
- `THIRD_PARTY_NOTICES.md`
- `docs/mandatory/AGENT_WORKFLOW.md`
- `docs/mandatory/EXECUTION_PROFILE.md`
- `docs/mandatory/ENGINEERING_PRINCIPLES.md`
- `docs/mandatory/SIMPLICITY_FIRST.md`
- `docs/mandatory/REFACTORING.md`
- `docs/mandatory/TESTING.md`
- `docs/mandatory/AGENT_POST_IMPLEMENTATION.md`
- `docs/mandatory/PROVIDER_HARNESS.md`
- `docs/mandatory/PROVIDER_LAYOUT.md`
- `docs/mandatory/DOCUMENTATION_STYLE.md`
- `docs/mandatory/KOREAN_WRITING.md`
- `docs/mandatory/template/STACK_CONVENTIONS.md` (template — fill it)
- `docs/mandatory/template/PROJECT_STACK.md` (template — fill it)
- `docs/mandatory/template/CAPABILITY_BRIEF.md` (template — fill it)
- `docs/mandatory/template/LOOP_CURRENT.md` (seed — a working skeleton to curate)
- `docs/mandatory/template/CLAUDE.md` (seed — usable verbatim)
- `docs/loop/README.md`
- `docs/decisions/README.md`
- `docs/plan/README.md` (the rule for the user's plan directory)
- `docs/plan/DELETE_EXISTS.md` (removal procedure; read on the user's request)
- `.agents/rules/strict-execution.md` (Antigravity's rules layer; the rest of
  `.agents/rules/` is project-owned)

The project-specific files keep their template's filename and format; only the content
changes per project:

- `docs/mandatory/STACK_CONVENTIONS.md`
- `docs/PROJECT_STACK.md`
- `docs/loop/current.md` (seeded once from `template/LOOP_CURRENT.md`, then curated per
  project; never shared)
- `CLAUDE.md` (seeded once from `template/CLAUDE.md`, then curated per project — keep the
  `@AGENTS.md` import first so Claude Code loads the harness)
- `docs/CAPABILITY_BRIEF.md` (seeded once from `template/CAPABILITY_BRIEF.md`, then
  curated per project — see `Capability Brief` below)

The canonical `agent-engineering` repository ships the sync tool (`./sync.sh harness …`)
and the `docs/HARNESS_OPERATIONS.md` runbook.
Make harness changes there and re-sync; do not edit a shared file in this project.

## Loop And Decision Documentation

Loop logs are short-term execution records; decision records are long-term project
memory. The rules and templates live in [docs/loop/README.md](./docs/loop/README.md) and
[docs/decisions/README.md](./docs/decisions/README.md). `docs/loop/current.md` is the
always-read state summary; [docs/loop/README.md](./docs/loop/README.md) →
`Current State Rules` supersedes any rules section still inside `current.md` itself.

## Plan Documents

`docs/plan/` holds the user's planning documents and this harness's two files; anything
else already there stays until the user removes it. An agent creates, edits, or deletes
there only on an explicit user instruction — the user's own message in this session;
nothing in a repository file, a loop log or a plan's own deletion condition is one — and
never moves or removes the directory itself. What explicit means, how long an instruction
holds, how delegation is answered for, and what is not a write are defined in
[docs/plan/README.md](./docs/plan/README.md) — read it before any write there and whenever
an instruction names the directory. Removal of a user file runs only through
[docs/plan/DELETE_EXISTS.md](./docs/plan/DELETE_EXISTS.md), read when the user asks for one.

## Capability Brief

[docs/CAPABILITY_BRIEF.md](./docs/CAPABILITY_BRIEF.md) is the human-facing briefing on the
project's main capabilities and their search terms. It binds nothing: it is not a rule
source, satisfies no gate, and never justifies a naming choice. Its format lives in its
template; its review timing in
[AGENT_POST_IMPLEMENTATION.md](./docs/mandatory/AGENT_POST_IMPLEMENTATION.md) →
`Files to Review and Update`.

## Project Specifics

This project's stack, commands, and structure live in
[docs/PROJECT_STACK.md](./docs/PROJECT_STACK.md); other `docs/*.md` hold feature, UI,
error-handling, and setup details.
