# Antigravity Strict Audit Protocol

**Applies to:** every model running in Antigravity, in any project carrying this harness;
Antigravity rules carry no model scope. Other providers do not read `.agents/rules/`.

**Relationship to the harness:** this file adds evidence obligations to rules the harness
already states, and raises no quality bar of its own. Where it and the shared rules disagree
the shared rules win and this file is wrong — except for the one reversal named in §4, which
is recorded in `docs/decisions/`.

**Why it exists:** the harness says what to do; this file makes it observable whether that
happened. Self-reported rows prove nothing alone; they make an omission visible next to rows
that can be checked against a diff, `git status`, a re-run or the session's tool calls.

## 1. Audit table

The first line of every response that ends or stops a task is this table. No greeting
before it. Start-of-task announcements and progress updates stay brief and carry no table;
the table exists for evidence, not recall. The answer — diffs,
command output, reasoning, next step — goes in prose below it, never inside a thinking block.

| Row | Fill with | The row fails when |
| :--- | :--- | :--- |
| **Status** | `VERIFIED` / `PROPOSED — UNVERIFIED` / `INFO` | `VERIFIED` without a command and its result in Evidence |
| **Evidence** | `command — result` per check actually run, or `not run: <reason>` | a pass is claimed for something not executed |
| **Explored** | every path opened this turn | a conclusion about a file not listed here |
| **Searched** | the sanitized query, or `none` | an external web query carries a path, host, IP, user, or credential (a repository search pattern may name repo-relative paths) |
| **Surface checked** | the doc, `--help`, or source read for any API, CLI, or flag used | a capability asserted from memory |
| **Changed** | `file (symbol)`, or `none` | a file was edited and is missing here |
| **Out of scope** | what was deliberately left untouched | an edit landed outside the stated scope |
| **Working tree** | `git status -s` summary, plus any edit left pending revert, or `not run` | a clean tree is claimed without running it |
| **DoD** | one line per `done` condition: `PASSED` / `INCOMPLETE` + what proves it | completion declared while any line reads `INCOMPLETE` |
| **Delegation** | see §4 | work that qualified for delegation stayed in the main context with no reason given, or an iteration count appears with no logs behind it |
| **Secrets** | `none touched` / `redacted in <n> places` | a credential file's contents were read |
| **Risks / pending** | leftovers, cleanup owed, what could not be verified | a known leftover goes unmentioned |
| **Protocol** | `10/10 held`, or the unmet rule numbers | a claim of 10/10 that another row contradicts |

A row may read `N/A`. Never delete a row — a missing row is a protocol failure regardless of
how good the answer is. Render it as a Markdown table with the header `| Row | Value |`, the
delimiter `| :--- | :--- |`, and one row per name above in that order, each value in inline
code (for example `VERIFIED`).

## 2. The ten failure modes

Observed in earlier Gemini sessions. Each rule already exists; this file names the evidence
that checks it.

| # | Failure mode | Rule owner | Proven by |
| :--- | :--- | :--- | :--- |
| R1 | Answer buried in thinking, greeting before the table | §3.1 | table position |
| R2 | "Done", "fixed", "passing" with nothing run | `AGENT_POST_IMPLEMENTATION.md` → `Verification Evidence` | Status + Evidence |
| R3 | Scope creep, unrequested refactor, `// rest unchanged` elision | `ENGINEERING_PRINCIPLES.md` → `Minimal, Local Changes`; §3.2 | Changed + Out of scope |
| R4 | Defending a wrong answer, apology loops | §3.3 | first line of the prose |
| R5 | Answering from memory instead of looking; leaking a path or secret into the query | `AGENT_WORKFLOW.md` → `Read Order`; `ENGINEERING_PRINCIPLES.md` → `Secrets And Sensitive Files`; §3.4, §3.5 | Surface checked + Searched |
| R6 | Guessing at code behavior; skimming roots instead of inspecting subtrees | `AGENT_WORKFLOW.md` → `Read Order`; §3.4, §3.6 | Explored |
| R7 | Reading credential files | `ENGINEERING_PRINCIPLES.md` → `Secrets And Sensitive Files`; §3.7 | Secrets |
| R8 | Orphaned configs, parent or legacy files left redundant after a structural change | `AGENT_POST_IMPLEMENTATION.md` → step 1 and `Files to Review and Update` | Risks / pending |
| R9 | Dirty tree, abandoned debug edits, no mid-course audit | `ENGINEERING_PRINCIPLES.md` → `Minimal, Local Changes`; `AGENT_POST_IMPLEMENTATION.md` → step 1; §3.8 | Working tree |
| R10 | Completion declared on an exit code; invented loop iterations | `AGENT_POST_IMPLEMENTATION.md` checklist; `docs/loop/README.md`; §4 | DoD + Delegation |

Sub-agents are selected from the provider's live descriptions, never from a fixed list.

## 3. Added behaviors

1. **Answer placement.** Table first, then the answer in prose. Never end a turn with only
   the table.
2. **Complete snippets.** `ENGINEERING_PRINCIPLES.md` → `Minimal, Local Changes` binds here,
   and this tier is held to more than it: an elision, a stub, or a marker where the logic
   belongs is reported as `INCOMPLETE` in `DoD`, never handed over as a delivered change.
   `AGENT_WORKFLOW.md`'s repeated-failure stop binds here with extra force: record the stop in
   `DoD` as `INCOMPLETE` rather than absorbing it into another attempt.
3. **No-defense correction.** When the user reports an error or asks for a revert, do not
   justify the previous answer and do not apologize. Open with
   `Correction accepted: <the error, one clause>. Now doing: <the new approach>.` State a
   factual disagreement in one sentence when the correction rests on a wrong premise, then
   follow the instruction anyway.
4. **Verify before asserting; never answer from memory.** `AGENT_WORKFLOW.md` → `Read Order`
   binds here. Every file opened goes in `Explored` and every source consulted in
   `Surface checked`; a claim with neither row filled, or with rows covering less than the
   claim, is a guess.
5. **Query sanitization.** `ENGINEERING_PRINCIPLES.md` → `Secrets And Sensitive Files` binds
   here. Additionally: search external library, framework, CLI, and error questions; never
   internal codebase logic or language built-ins, which rule 4 answers by reading the
   code. Use the runtime's current date for changing facts. Put the query in `Searched`. Wrong:
   `my next app on dev-01 at 10.0.4.15 fails connecting to the redis container`. Right:
   `Next.js Redis Docker ECONNREFUSED troubleshooting`.
6. **Truncation is a status, not a guess.** `AGENT_WORKFLOW.md` → `Read Order` binds here,
   and this tier is held to more than it. Set `PROPOSED — UNVERIFIED` and write
   `SEARCH TRUNCATED — need <file or answer>` in `Risks / pending`, even when the answer looks
   right and when you stopped early because the next step was expensive. A survey reports its
   pattern in `Searched` and its covered set in `Explored`; "none of them have X" with either
   row short of the claim fails both.
7. **Secrets.** `ENGINEERING_PRINCIPLES.md` → `Secrets And Sensitive Files` binds here.
   Additionally: mask a value that reaches tool output as `[REDACTED]`, and fill the
   `Secrets` row in every table, not only when a turn touched one.
8. **Working-tree hygiene.** `ENGINEERING_PRINCIPLES.md` → `Minimal, Local Changes` binds
   here: revert only the changes the abandoned approach made, and use `git restore` on a file only
   when it held no earlier uncommitted edits. Additionally: run the
   check again before declaring completion, so no temporary override or abandoned config
   ships as part of the work, and put its summary in the `Working tree` row.

## 4. Delegation — the one reversal

The shared rules keep work in the main context by default (`AGENT_WORKFLOW.md` warns against
delegating to satisfy a quota; `EXECUTION_PROFILE.md` narrows delegation in `CONSTRAINED`). For
Antigravity the default is inverted, because a fresh sub-agent context keeps the small main
context small. Only delegation breadth changes; every invariant, gate, checkpoint and
verification requirement stays as the profile sets it, under `PROVIDER_HARNESS.md` →
`Model Capability Boundary`.

**Default: delegate.** Keep work in the main context only when it is a single-file local edit,
or a tightly coupled sequential step where the handoff costs more than the work. When the call
is close, delegate.

Delegate without waiting for a threshold: anything read-heavy (surveys, "where is X",
cross-directory inspection, dependency tracing); anything spanning more than one subsystem or
package; any retry or iteration loop, whose failures still count toward the repetition rule —
two failures without new information stop the delegating agent too; any review the harness's own gate already requires, so
the checker is not the author; any exploration whose conclusion is all you need.

Guardrails. The main agent keeps planning, sub-agent selection, integration, verification of
the integrated result, and the final answer — never delegate what "done" means. Scope the work
before delegating; give each sub-agent one isolated scope, its inputs and the evidence it must
return, and integrate one result before chaining another sub-agent onto it.

The `Delegation` row is an inverse audit: `delegated: <role> → <evidence returned>` ·
`in-main: <why this qualified but stayed>` · `no role installed: <the role needed>` ·
`loop <n>` with the log behind each iteration. When neither the personal catalog nor the
project holds a fitting role, report `no role installed` and continue in the main context with
tighter checkpoints rather than pretending the work did not qualify.

## 5. Reading this as a harness test

Count final responses with a missing or partial table, `VERIFIED` rows without a command and result,
edits missing from `Changed` or outside `Out of scope`, and conclusions about files absent from
`Explored`. Any count above zero means the protocol is not holding; record the counts with the
run.

## 6. Language

`AGENT_WORKFLOW.md` → `Final Response Expectations`, `ENGINEERING_PRINCIPLES.md` →
`Readability`, and `AGENTS.md` → `Copy Pipeline` (shipped product copy) bind here.
Additionally: audit rows and their summaries follow `AGENTS.md` → `Response Language` like the
rest of the answer; the status tokens and the `Correction accepted:` / `Now doing:` labels this file defines stay
exactly as written — matched, not
read.
