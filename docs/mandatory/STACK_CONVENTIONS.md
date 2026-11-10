# Stack Conventions

Template version: 1.17

## Purpose

Project-specific mandatory conventions for the language, framework, and domain of this
repository (a TypeScript NestJS library published to npm). Read before any non-trivial
implementation. The portable engineering rules live in [ENGINEERING_PRINCIPLES.md](./ENGINEERING_PRINCIPLES.md); the
toolchain commands and structure live in [docs/PROJECT_STACK.md](../PROJECT_STACK.md).
This file keeps the same filename and format in every project; only its content differs
per stack.

## Project Rules

- The public API is everything `lib/index.ts` re-exports, and the npm package ships only `dist/` and `CHANGELOG.md` (`files` in `package.json`).
  A change to an export, an option or observable guard behavior is a semver decision and lands with its `CHANGELOG.md` entry and the `README.md` section that documents it.
- The peer range is NestJS 11 and 12, and CI runs the suite against each by overriding `@nestjs/*` with `npm install --no-save`.
  Library code uses only APIs present in both majors and runs on the `engines` floor (`node >=22.12.0`).
- The client IP is `req.ip` in `lib/ipfilter.guard.ts`, so forwarded headers count only through the app's Express `trust proxy` setting.
  Never read `X-Forwarded-For` or a similar header directly: that was the spoofing hole 1.0.0 closed.
- Rules are addresses and CIDR ranges parsed into `node:net` `BlockList`s by `toBlockList` in `lib/ipfilter.service.ts`; there are no regex rules.
  An invalid rule throws at startup or from a setter, and a throwing setter keeps the previous list.
- A list that is not configured (`undefined`, or `null` from config) is a different state from an empty list: an empty whitelist allows nobody.
  Configuring neither list throws in the `IpFilterService` constructor, so a missing config value fails loudly.
- Only the `http` execution context is filtered; GraphQL, WebSocket and RPC contexts pass through `IpFilterGuard` unfiltered.
- The module is always global for dependency injection; `global: false` only drops the `APP_GUARD` registration in `lib/ipfilter.module-definition.ts`.
  `lib/ipfilter.guard.ts` imports `IpFilterService` as a type only, because a runtime import cycles through the module definition.
- Tests use `node:test` and `supertest` against a real Express app (`test/app.ts`), compiled by `tsc` into `.test-dist/` before they run; there is no Jest.
  Release tooling under `scripts/`, when present, runs directly as `.mts` through Node's type stripping.
- Diagnostic trace for a denied request: the `APP_GUARD` (or a route's `@UseGuards(IpFilterGuard)`) → `IpFilterGuard.canActivate` reads `req.ip` → `IpFilterService.isAllowed` checks the blacklist, then the whitelist → `canActivate` returns `false` (Nest's `403 Forbidden`) or throws `IpFilterDenyException` with `{ clientIp }` when `useDenyException` is set.
- Documents written for people outside the agent workflow, `README.md`, `CHANGELOG.md` and `docs/CAPABILITY_BRIEF.md` among them, are written in English.

## Required Reads And Review Gates

- Read `README.md` before changing behavior or options: it is the user-facing contract, including the evaluation order and the 0.x migration notes.
- Agent records stay local: `docs/loop/` logs, `docs/loop/current.md`, `docs/decisions/` records and the user's `docs/plan/` documents are ignored by Git on the owner's instruction, and only their harness `README.md` files (and `docs/plan/DELETE_EXISTS.md`) are tracked.
  Never force-add them, and never cite them from a tracked file as if a reader could open them.
