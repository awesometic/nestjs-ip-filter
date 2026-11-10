# Provider Layout

## Purpose

Where each provider reads its instructions, skills, sub-agents and rules in an adopting
project — the single source of truth for those paths. The rules that use them live in
[PROVIDER_HARNESS.md](./PROVIDER_HARNESS.md).

## Layout

| Provider | Reads at session start | Personal/global skills | Project-specific skills | Sub-agents | Rules | Personal lifecycle hooks |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| Codex | `AGENTS.md` | `~/.agents/skills/` | `.agents/skills/` | Personal: `~/.codex/agents/*.toml`; project-specific: `.codex/agents/*.toml` | — | `~/.codex/hooks.json` or `[hooks]` in `~/.codex/config.toml` |
| Claude Code | `CLAUDE.md` (imports `AGENTS.md`) | `~/.claude/skills/` | `.claude/skills/` | Personal: `~/.claude/agents/*.md`; project-specific: `.claude/agents/*.md` | — | `hooks` in `~/.claude/settings.json` |
| Antigravity | `AGENTS.md` | IDE/2.0: `~/.gemini/config/skills/`; CLI: `~/.gemini/antigravity-cli/skills/` | `.agents/skills/` | App and CLI personal: `~/.gemini/config/agents/*.md`; project-specific: `.agents/agents/*.md` | `.agents/rules/` | IDE/2.0/CLI share `~/.gemini/config/hooks.json`; schemas differ from the other providers |

1. A common skill's real source lives in the canonical store; a personal entry links
   directly to its selected runtime build, or the common build when no override exists.
   Project-specific skills stay in the project roots above; do not remove them in
   common-skill cleanup. Global availability does not waive a skill's stack checks.
2. Impeccable is an independently installed global skill, not a harness payload; see
   [PROVIDER_HARNESS.md](./PROVIDER_HARNESS.md) → `Impeccable Operating Mode`.
3. Use current native personal roots. `.codex/skills/` is legacy user-skill guidance;
   preserve its bundled system entries. Do not register one skill in both Antigravity's
   current and legacy personal roots. A filesystem check does not establish Antigravity
   live-session discovery, so report that check separately.
4. Antigravity limits each rules file to 24,000 bytes after expanding includes, and active
   global and always-on rules share a 20,000-token budget. This harness uses workspace rules
   only; the global `~/.gemini/GEMINI.md` is shared with Gemini CLI.
5. `.agents/rules/strict-execution.md` is the one file in `.agents/rules/` the harness
   distributes; every other file there is project-owned, so a project adds its own rules as
   separate files. `.agents/` and `.agents/rules/` must be real
   directories, because sync refuses to write through a symlinked parent. Check the file's
   byte size on every edit; the upstream failure is silent truncation.
   **Distribution does not activate it.** Observed on 2026-07-31 in real Antigravity
   sessions: the agent reported loading `AGENTS.md` and its rules layer at session start and
   did not, and read the rules file only when `AGENTS.md` named it and said to open it — hence
   `AGENTS.md` → `Provider Rules Layer`. What was observed is the rules file's activation, not
   `AGENTS.md` itself; the file sets no activation mode, and Antigravity's rules page (checked
   2026-11-03) injects only Always On rules every turn. Keep explicit loading until a current
   native observation shows otherwise.

Keep no skill or sub-agent inventory or task-to-role matrix in repository documentation
(exceptions: `AGENT_WORKFLOW.md` → `Skills And Sub-Agents`). This table records where
definitions live, never which exist; live provider metadata is the selection contract.
Common sub-agents are complete regular-file copies in the personal roots above; project roots
hold genuine project-specific definitions only. Filesystem parity does not establish live
discovery or invocation.

## Plugin Packages

These are default package locations, not evidence of installation; prefer a natively
reported path/profile, and do not substitute the personal skill roots above for a required
plugin. The installation check lives in
[PROVIDER_HARNESS.md](./PROVIDER_HARNESS.md#ponytail-dependency).

| Runtime | Default package location | Native package marker |
| :--- | :--- | :--- |
| Codex | `~/.codex/plugins/cache/<marketplace>/<plugin>/<version>/` | `.codex-plugin/plugin.json` |
| Claude Code | `~/.claude/plugins/cache/<marketplace>/<plugin>/<version>/` | `.claude-plugin/plugin.json` |
| Antigravity IDE | `~/.gemini/config/plugins/<plugin>/` or workspace `.agents/plugins/<plugin>/` | `plugin.json` |
| Antigravity CLI | `~/.gemini/antigravity-cli/plugins/<plugin>/` | native imported package; inspect through its CLI |

Keep plugin bodies external and never overwrite project `AGENTS.md` with a plugin's bundled
entry file.

## What The Harness Distributes

The harness distributes each provider's **entry and rules layer**: `AGENTS.md` for Codex and
Antigravity, `CLAUDE.md` for Claude Code, and `.agents/rules/strict-execution.md` for
Antigravity's rules layer. It does not distribute **capabilities**: `init` creates project
skill and sub-agent directories and installs nothing into them, and leaves an existing
directory as it is. Common skills and sub-agents come from the personal layer; project-specific
ones are selected from the project context under `PROVIDER_HARNESS.md` →
`Initializing Skills And Sub-Agents`.
