# Decision Records

Durable decisions, as lightweight ADRs: long-term project memory that future agents respect,
unlike the short-term records in [docs/loop/](../loop/README.md). Read a record only when it is
relevant to the current task. The `Safety And Privacy` rules in
[docs/loop/README.md](../loop/README.md) apply here too.

## When To Create A Decision Record

Create a decision record only for long-lived decisions involving:

- product direction
- architecture
- data model
- API contract
- privacy
- security
- encryption
- authentication/authorization
- monetization
- AI/recommendation behavior
- workflow/process decisions that future agents must respect

Do not create a decision record for every small implementation task.

## Records Owned Elsewhere

A decision made in another repository — a harness band in the canonical source, a producer's
contract policy — is pointed at, never copied in, because a copy here is never corrected.
When the local consequence of an outside decision is itself durable — an adoption, a
contract this project now honors — write a local record of that consequence and point it
at the owning record.

## Naming Convention

```
docs/decisions/YYYY-MM-DD-HHMM-short-agenda-slug.md
```

Timezone and slug follow [docs/loop/README.md](../loop/README.md) → `Naming Convention`.

## Decision Record Template

```markdown
# Decision: <Agenda>

## Status
Accepted

## Date
YYYY-MM-DD HH:mm

## Context
What problem, trade-off, or uncertainty led to this decision?

## Decision
What was decided?

## Alternatives Considered

### Option A
-

### Option B
-

## Consequences
Positive:
-
Negative / Risks:
-

## Revisit Conditions
Revisit this decision if:
-
```
