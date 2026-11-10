# Removing The Existing Plan Files

Read this file when the user asks to remove files from `docs/plan/` — for example "docs/plan 에 있는 기존 파일들 제거해줘".
The procedure never starts on the agent's own initiative.
[README.md](./README.md) → `The Rule` holds throughout: the user's choice in step 3 is the explicit instruction, it means "delete everything I did not keep", and it authorizes the deletions and record edits these steps prescribe and nothing else.
A request that names one file runs the same steps for that file only: the table lists it alone, and only it can be deleted.
Inside this directory this file governs any "cleanup": what goes is chosen by the user, never derived from evidence, and the record edits of step 4 are made even though a documentation sweep would leave records as history.
This file and `README.md` are shared harness files (`AGENTS.md` → `Shared Harness Files`); sync overwrites them, so they are never edited in a project.

Nothing is deleted before the user has chosen, the content is carried into the linked records, a sub-agent has verified that, and the main agent has checked the carry-over itself.

## 1. Open The Log And Take The Baseline

Open this run's loop log ([docs/loop/README.md](../loop/README.md) → `When To Create A Loop Log`) and record the baseline there, or in the report when the run has no confirmation channel: `git status --porcelain`, and a recursive listing of `docs/plan/` with each file's tracked state and uncommitted changes.
List every file under `docs/plan/`, subdirectories included, except `docs/plan/README.md` and `docs/plan/DELETE_EXISTS.md`.

For each file record any agent-authorship evidence — a commit message or `Co-Authored-By` trailer naming an agent; content such as an `Implementation Readiness Note`, a deletion gate, a `Status: revision N` line or a Delegation Packet; a record naming it as an agent's output — or that there is none; a file name's shape or language is not evidence.
Record also how it can be recovered (its last commit, that commit plus uncommitted changes, or not at all when untracked), any deletion condition it states, and whether `docs/loop/current.md` still names it.
This evidence helps the user choose; it decides nothing.

## 2. Find The Linked Records

For each file, search its basename as a literal string with `git grep -F` over tracked files and over the untracked ones from `git ls-files --others --exclude-standard`; for a slug-shaped name search its stem too and open a stem hit before counting it. Exclude the file itself.
When a linked path is in a sibling repository, run the same search there read-only and record the pattern and repositories even when nothing matches; a hit there is reported, never edited from here.
Record what each file alone holds, split into live (unresolved findings and tasks, an accepted readiness note, a plan still to implement) and closed (implemented or shipped).

## 3. Show, And Let The User Choose What To Keep

Present one table: file, agent evidence, recoverability, in-file deletion condition, whether `current.md` names it, every linked record, what would be carried over and where, and any subdirectory the deletion would empty.
Ask which files to keep and whether each subdirectory that would be emptied is removed.
Everything not kept is deleted; a file the user asks to empty is kept and emptied in step 6 after the same carry-over.
The table says when a file is untracked or has uncommitted changes, because it cannot be recovered afterwards.
Without a confirmation channel, present the table as the report and stop.

## 4. Carry The Content Into The Linked Records

Each file to delete gets one dated section in one loop log: the log that created it or names it as its plan, else this run's log.
The section holds what the file alone held — live content in full, closed content as a summary plus the last commit that holds the file.
Live content in full is this procedure's stated exception to [docs/loop/README.md](../loop/README.md) → `What To Record`.
A decision record that names the file gets a summary and the dated line below, never the full content, and its `## Status` is not touched.
After every other line that points at the file, add one dated line naming the removal and where the content went; inside a kept `docs/plan/` file or a file on the delete list, report the reference instead; in `docs/loop/current.md`, rewrite the pointer to the content's new home.
What is still actionable also gets a line in `docs/loop/current.md` → `Open Follow-ups`, and this run's log records the map: each file, what it held, where it went.

## 5. Verify With A Sub-Agent, Then Check It Yourself

Give a sub-agent the delete and keep lists, the baseline, the record edits (this run's loop log and `docs/loop/current.md` included) and the step 4 map.
It verifies against the files, not the report, that every carried item is present in its named record compared with the source text; that every remaining reference to a deleted file is an allowed kind — a line followed by its dated line, a dated line, the rewritten `current.md` pointer, this run's loop log, a kept `docs/plan/` file, or the delete list; that the changes since the baseline are exactly the edit list; and that nothing kept changed.
Repair what it finds and verify again.
A sub-agent's report is not evidence ([AGENT_POST_IMPLEMENTATION.md](../mandatory/AGENT_POST_IMPLEMENTATION.md) → `Verification Evidence`): before deleting, compare the map against the records yourself.
When no sub-agent can be run, stop before deleting and report; a fallback review is not a ground for this deletion.

## 6. Delete And Confirm

Delete every file not kept (`git rm` when tracked, `rm` when not), empty a file kept empty down to its title line, and `rmdir` each subdirectory the user chose to remove.
Compare a fresh recursive listing with the baseline — `git status` shows neither a deleted untracked file nor a removed directory — and run the reference search once more; any hit outside the allowed kinds is a step 4 miss to repair.
Close this run's loop log and update `docs/loop/current.md` in the order [docs/loop/README.md](../loop/README.md) → `After A Loop Run` states.
Commit only when the user asks.
