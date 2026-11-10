# Execution Profile

## Purpose

How the main agent stages and verifies work without changing what the task must achieve.
An execution profile is an operating mode, not a capability ranking or quality tier.
A sub-agent's narrower assignment is set by its Delegation Packet and
[PROVIDER_HARNESS.md](./PROVIDER_HARNESS.md) → `Model Capability Boundary`, not here.

## Invariants

Every profile completes the full requested goal with the same scope, quality bar, safety
rules, definition of done, risk assessment, approval boundaries, required verification,
and review gates; it never narrows scope, leaves integration to the user, or relaxes
evidence or final-response obligations. The main agent stays responsible for planning,
integration, verification, and the final answer. Batches end at something independently
verifiable, are cut into `AGENT_WORKFLOW.md` → `Change Units`, and close and checkpoint
under [AGENT_WORKFLOW.md](./AGENT_WORKFLOW.md#durable-work-and-checkpoints); a profile may add
checkpoints but never extends that preservation interval or relaxes closure.

A profile changes only four operating dimensions: batch size, delegation breadth and
concurrency, checkpoint frequency, and verification cadence. A provider rules file
distributed with the harness may set delegation breadth for its provider, including reversing
the default direction, under [PROVIDER_HARNESS.md](./PROVIDER_HARNESS.md) →
`Model Capability Boundary`; it changes no other dimension and no invariant.

## Selection Order

The default is the standard cadence: concern-aligned batches that combine tightly coupled
edits, bounded independent concerns delegated with clear contracts (in parallel only for
real latency savings), checkpoints at completed concerns and integration points, targeted
checks during work and the full required verification after integration.

An explicit `EXECUTION_PROFILE: CONSTRAINED` selects the reduced cadence below;
`EXECUTION_PROFILE: CAPABLE` and `EXECUTION_PROFILE: FLAGSHIP` are accepted and select the
standard cadence. When overrides conflict, follow the highest-priority instruction, and ask
when two of equal priority would change execution materially. Do not infer a profile from
model names, prices or brands, and keep no model-to-profile table.

## Downgrading And Stability

A single transient failure is evidence to investigate, not a downgrade. Switch to the
reduced cadence when context loss or tool failure repeats and makes the current cadence
unreliable — forgotten constraints, invalidated integration state, repeated malformed tool
actions, or failed recovery — not because the task is complex. State the switch and its
evidence, return to the last verified checkpoint, and keep completed verified work.

The reduced cadence works in batches of one concern or dependency step, each integrated
before the next; delegates only narrowly bounded work with explicit inputs and expected
evidence, avoiding concurrent delegation when integration state could drift; checkpoints
after each material edit, handoff or recovery; runs the smallest relevant verification
after each batch and re-reads affected requirements. Do not return to the standard cadence
on your own after work begins; a later explicit override may.
