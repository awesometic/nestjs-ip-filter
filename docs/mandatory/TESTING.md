# Testing

## Purpose

This file owns test value, selection, validity, maintenance, test-specific execution scope (including expensive builds and resource use while checks run), and consolidation.
Test commands belong to `docs/PROJECT_STACK.md`, framework and fixture conventions to [STACK_CONVENTIONS.md](./STACK_CONVENTIONS.md), and the project's scenario or debug test guide to its own doc under `docs/`.
Whether an executed check counts as verification evidence is owned by [AGENT_POST_IMPLEMENTATION.md](./AGENT_POST_IMPLEMENTATION.md) → `Verification Evidence`.

## Test Value And Selection

Start with existing behavioral coverage; remove obsolete tests and consolidate redundant cases or fixtures inside the affected scope before adding more.
Keep every distinct required regression protected, and add only for an uncovered failure mode.

Before adding or substantively changing a test, inspect the change and the relevant existing suite, then answer:

1. What observable behavior or contract changed?
2. What realistic regression could the change introduce?
3. What existing tests already detect that regression?
4. What is the least expensive test layer capable of detecting what remains unprotected?

Every proposed test passes one value gate: **what realistic regression would this test catch that existing tests would not?**
A good answer names a production or contract failure, such as unauthorized access, a partial commit, duplicate work after retry, a changed API response, a broken persistence or queue boundary, or recurrence of the bug being fixed.
Coverage improvement, a new function or branch, an untested private helper, another mock call, or another equivalent input is not enough by itself.
When the answer is weak or duplicates existing protection, do not add the test.

Classify the change before selecting tests:

- **Non-behavioral change** — documentation, comments, formatting, a behavior-preserving rename, a type-only edit, or mechanical movement normally adds no test; run an existing check only when it can reveal a real failure in the changed artifact.
- **Behavior-preserving refactor** — rely on relevant behavioral tests; do not test an extracted private helper merely because the internal structure now exists.
- **Bug fix** — prefer the smallest test that reproduces the observable or contract-level bug, with red-before-green evidence when practical; add variants only for distinct failure modes.
- **New or changed business behavior** — identify distinct behavioral rules; do not manufacture a fixed happy-path, failure, and boundary-case set for every rule.
- **Integration or contract change** — test the boundary whose breakage matters; duplicate a contract across unit, integration, and end-to-end layers only when each layer detects a different realistic failure.

Change kind sets the baseline, then test-risk amplifiers independently add depth.
Authentication, authorization, payments, financial calculations, data loss, migrations, transactions, concurrency, distributed locks, retries, idempotency, security-sensitive behavior, and irreversible operations can justify substantially broader testing.
These amplifiers do not redefine the harness-wide `High` classification in [AGENT_WORKFLOW.md](./AGENT_WORKFLOW.md); work that meets it follows its stronger approval and review gates.
Neither change kind nor risk implies a test count: impose no fixed minimum, maximum, production-to-test code ratio, or coverage target unless the project explicitly owns it as an acceptance requirement.

## A Test Proves The Obligation

A test earns its maintenance cost only when it fails if the obligation breaks and passes if the obligation holds.

The failure this file exists to stop is *literal restatement*: an assertion that repeats a value the implementation also states — a path, a key, an identifier, a URL, a copied line of markup — instead of exercising what that value is for.
The two copies are then wrong together, and the suite stays green while the product is broken.

A worked example.
A page references `../assets/image.png`, and its test asserts that the page source contains the string `../assets/image.png`.
The page later moves one directory further out.
The link is now broken for every reader, the asserted string is unchanged, and the test passes.

Assert the effect, not the spelling:

- a reference is **resolved at run time, from the artifact itself** — read the reference out of the document as it stands now, resolve it relative to where that document now lives, and open what it points at
- a configuration key is read back through the loader that consumes it, never compared against the constant sitting beside its own definition
- rendered or serialized output is asserted where the consumer observes it, not where it is constructed

The resolution has to start from the artifact, not from a path someone worked out once.
A test that hardcodes the answer — `assert exists("docs/assets/image.png")` — asserts an effect and still survives the move green, because it stopped asking the document anything.
**A path is not the contract; what resolves at it is.**

For [UI composition contracts](./ENGINEERING_PRINCIPLES.md#ui-composition-and-existing-contracts), verify the effect in representative consuming screens and distinct contexts, with surrounding content and the expected repetition when it changes the result.
When consolidating repeated UI, verify that shared information and actions appear once at the intended scope and stay discoverable, while each item's identity, values, state, errors, action targets and accessible associations stay clear.
Retained values, element counts and an isolated widget render do not prove that hierarchy, emphasis, fit or action targeting survived.
Use the smallest existing test or render layer that exposes the realistic regression, add no universal screenshot matrix or style-property quota, and report unavailable rendered evidence precisely.

Some literals are themselves the obligation.
A wire format, a persisted key, a published route, user-facing copy, a public symbol name — these are contracts, and pinning them is correct.
Pin them at the boundary that owns them: a round trip through the serializer, the response a real client receives, the rendered output.
Re-typing the constant next to its definition is still literal restatement, and a reference from one file to another is never in this category — it is a lookup whose success is the obligation.

## Falsifiability Check

1. **Name the change that must turn this test red.** When no such change exists, the test proves nothing, and writing it moves the obligation onto the covered list while leaving it uncovered.
2. **Name a way the obligation can break that leaves this test green.** Answer it before accepting the test, because question 1 alone passes almost anything — the `../assets/image.png` test answers it easily while failing the obligation completely.

Two answers to question 2 are not acceptable outcomes; they are the finding:

- *editing the very literal the assertion copies* — that is the assertion agreeing with itself, not evidence
- *a relocation, rename, or move* — these break the obligation while changing no implementation byte, so a check phrased only against "a change to the implementation" is blind to the entire class

A test that iterates over what it discovers — a glob, a query, a crawl — asserts first that it found something to check (see `Vacuous pass` below).

Prove it once where proving is cheap: run the test before the fix and watch it fail, or break the behavior deliberately and confirm red.

## Test Design And Level

Prefer assertions about observable outcomes: returned values, persisted state, API responses, emitted events, authorization or transaction results, and externally visible errors.
Avoid private methods, temporary variables, internal class layout, exact internal call sequences, and mocks that merely mirror the implementation.

An interaction assertion is appropriate when the interaction itself is the contract.
Examples include an email sent exactly once, a payment request carrying an idempotency key, or an event withheld until a transaction commits.
Assert that interaction precisely; otherwise prefer the outcome the caller or consumer observes.

Do not write application tests for ordinary behavior owned by the language, framework, mature library, ORM, annotation processor, or generated code when the project adds no decision of its own.
Test the project's consumer, round trip, generated artifact, compatibility promise, validation decision, or integration boundary instead.

Prefer one representative case for equivalent inputs under one behavioral rule, parameterized or table-driven when several are worth keeping.
Split cases only when they exercise materially different behavior or failure modes; one cohesive test may protect several aspects of one contract.
Trivial getters, setters, constructors, and direct mappings normally need no independent test.

Choose the least expensive test level capable of detecting the intended regression; a cheap unit test is insufficient when the real failure exists only at a database, HTTP, filesystem, cache, queue, serialization, or transaction boundary.

## When Not To Write The Test

Where the real obligation cannot be exercised in the current environment, write no test and record the gap instead.
A surrogate that cannot fail is worse than an acknowledged hole, because the hole stays visible and the surrogate does not.

Record it in the final response, and in `docs/loop/current.md` → `Open Follow-ups` when it stays actionable.
Name what could not be exercised and what would make it exercisable — a fixture, a harness, a runnable environment.

## Test Code Is Code

Tests are bound by [ENGINEERING_PRINCIPLES.md](./ENGINEERING_PRINCIPLES.md) and [SIMPLICITY_FIRST.md](./SIMPLICITY_FIRST.md) exactly as production code is.
Use existing framework fixtures before building helpers or setup layers; keep the exercised behavior visible and name each test for the behavior it guards.
Apply the [Simplicity Review Lens](./REFACTORING.md#simplicity-review-lens) to scaffolding and duplicated cases; disproportionate size prompts inspection, never deletion by ratio.

## Test Execution Scope

During implementation, use progressively wider feedback:

1. the changed or nearest focused test
2. the affected test file
3. the affected module or package

Widen only when the change, dependency impact, or a failure gives a concrete reason, and do not rerun the complete repository suite after each edit.
When a coordinator supervises several agents on one host, it names the one agent that runs an expensive suite or build for a given code state; the others reuse that result only for the same code state, keep doing independent work meanwhile, and rerun any check whose code state differs.
A check that uses far more CPU or memory than it normally does is stopped, together with only the processes the stopping agent started for it; a long run that is merely slow is not stopped.
Find the cause on a bounded representative case before rerunning the check; that diagnostic run is not a performance measurement under `Verification Evidence`.

Before completion, after the tested code and tests have stabilized, run the full relevant suite once when it is runnable and applicable.
For a large monorepo, relevant normally means the affected package or module, meaningful dependents, and appropriate integration tests; expand to the whole repository when shared infrastructure, build configuration, dependency impact, cross-package behavior, or an explicit project or CI requirement justifies it.
When no applicable suite can run, record the gap under `When Not To Write The Test` rather than inventing a pass.

## Test Suite Audit

A change that touches something existing tests cover triggers an audit of those tests, including a move, rename, or relocation that changes no code content — the case where a green suite is least informative.

**Running the suite is not the audit.**
A green run answers whether the assertions still hold; the audit answers whether they still mean anything.

1. **Enumerate.** Two kinds of test cover a change, and only one of them names it.
   *Named references* come out of a search for the symbol, file path, route, fixture, resource, or generated artifact.
   *Class-wide tests* assert over a category the change belongs to — a link checker, a schema sweep, a glob-driven validator — and contain no literal to search for; find them by what they scan, using the directory, extension, or pattern the changed thing sits inside as the search key.
   Report the search pattern with the result, including an empty one.
2. **Read every test the search found**, not only the ones that failed, and check each against `Known Agent Failure Modes` below.
3. **Remediate**, which means add, update, or delete:
   - **Add** — an obligation the change introduced or exposed has a realistic regression that existing tests do not exercise, and the proposed test passes `Test Value And Selection`.
   - **Update** — the intent is right, and the assertion tracks the old spelling or the old topology. Re-point it at the obligation per `A Test Proves The Obligation`.
   - **Delete** — the test can no longer fail for a real reason, it froze structure the change removed, or a stronger test now covers the same obligation. Name what covers the obligation now, or state the coverage loss plainly when nothing does.
4. **Consolidate.** Inspect every added or changed test for realistic value, a duplicate invariant, equivalent inputs, implementation coupling, dependency behavior, sufficient test level, and proportionality to risk.
   Merge or delete low-value protection; do not remove a distinct realistic regression merely to reduce test count.
5. **Report** the search, the tests audited, and what was added, updated, deleted, or intentionally left unchanged.

Scope follows the changed unit's coverage, not a repository-wide test rewrite; a finding outside it is reported and left alone, per [REFACTORING.md](./REFACTORING.md) → `Ordinary Changes`.

Never make a failing test pass by weakening it; which edits count as weakening is owned by [AGENT_POST_IMPLEMENTATION.md](./AGENT_POST_IMPLEMENTATION.md) → `Verification Evidence`.

Reviewers judge whether realistic regression risk is adequately protected, not test count; a request for another test names the missing failure mode and why current tests cannot detect it.
Whether a reviewer accepts existing execution evidence or reruns a check is owned by [AGENT_POST_IMPLEMENTATION.md](./AGENT_POST_IMPLEMENTATION.md) → `Independent-Review Gate`.

## Known Agent Failure Modes

Recurring ways a generated test ends up proving nothing; the sections above say what replaces each.

- **Literal restatement / change detector** — the test is a transformation of the same information as the code under test, so a correct and an incorrect implementation are equally likely to pass it.
- **Interaction without a contract** — the test verifies that a collaborator was called, in order, with certain arguments, when that interaction is merely implementation.
- **Over-mocking** — the boundary under test is mocked, so the test exercises the mock and stays green when the real boundary breaks; mock only what is slow, remote, or nondeterministic.
- **Weak assertion** — not null, not empty, no exception thrown, is defined; every wrong value passes.
- **Tautology** — the expected value is produced by the code under test, or the test asserts on data it constructed itself and never calls the unit; derive the expectation independently of the implementation.
- **Assertion-free test** — the test runs the code and prints or logs, with nothing that can fail; add the assertion the contract needs, or delete a file that only observes.
- **Vacuous pass** — the test iterates over what it discovers, the discovery returns nothing, zero assertions execute, and it reports green; a move or rename is the usual cause.
- **Green-seeking edit** — the test is changed until it passes instead of the behavior being fixed; a test genuinely updated to new behavior states that the behavior is the intended one.
- **Special-casing to the fixture** — the implementation returns what the test expects, branches on test input, or memorizes fixtures; run the falsifiability check with an input the fixture does not contain.
- **Coverage as the goal** — the coverage number rises and nothing has become harder to break; coverage locates untested code and never establishes that tested code is checked.
- **Assertion roulette and magic numbers** — unrelated or unlabeled assertions and unexplained literals leave a failure unable to say what broke; label distinct contract aspects and use named constants or fixtures whose origin is stated.
- **Testing the framework** — the assertions exercise the library, ORM, or framework rather than this project's own decisions.
