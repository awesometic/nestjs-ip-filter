<!--
TEMPLATE for docs/loop/current.md — the per-project "Current Loop State" summary every agent
reads before non-trivial work. sync.sh seeds this to docs/loop/current.md on `init` (only when
absent; it is never overwritten afterward). Unlike the stack templates this seed is immediately
usable: the body below is the starting skeleton, and each project curates it in place as it runs
loops, so its content legitimately diverges from this template over time.

Fixed contract (do not restructure):
  - Title `# Current Loop State`, then the short preamble, then `## Active Assumptions`,
    `## Recently Completed`, `## Known Risks`, `## Open Follow-ups`, `## Next-session Warnings`,
    then `## Rules`, which holds only the pointer below and never the rules themselves.
  - Replace the placeholder bullets with real, curated state; keep the preamble and the
    pointer.
  - The rules for curating this file live in docs/loop/README.md -> `Current State Rules`,
    never in the file itself: this copy is project-owned and never overwritten, so a rule
    kept here could never be corrected.
You may delete this comment in the seeded copy.
-->

# Current Loop State

This file is a concise cross-session state summary for future AI agent sessions, not a
replacement for the timestamped per-session execution log.
Agents must read this file before starting non-trivial work, but must keep it short and
curated.

## Active Assumptions

- None recorded yet.

## Recently Completed

- None recorded yet.

## Known Risks

- None recorded yet.

## Open Follow-ups

- None recorded yet.

## Next-session Warnings

- None recorded yet.

## Rules

The entry shape, the per-section expiry conditions, and the consolidation procedure for
this file live in [README.md](./README.md) → `Current State Rules`. Follow them there; do
not restate them here.
