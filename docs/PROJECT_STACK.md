# Project Stack

Template version: 1.8

## Purpose

Project- and stack-specific commands, structure, and conventions for `nestjs-ip-filter`. The
portable agent rules live in `AGENTS.md` and `docs/mandatory/`; this file is the project
layer they point to.

## Toolchain Commands

```bash
npm ci              # install from package-lock.json
npm run format      # prettier --write over lib/ and test/
npm run lint        # eslint (typescript-eslint + prettier)
npm test            # tsc into .test-dist/, then node --test
npm run build       # tsc into dist/
npm pack --dry-run  # list the files the npm package would ship
```

CI (`.github/workflows/ci.yml`) runs lint, build and test on Node 22 and 24, each against NestJS 11 and 12.
`prepublishOnly` runs lint, test and build before `npm publish`.

## Project Structure

- `lib/` — the library source; `lib/index.ts` is the public entry point.
  - `ipfilter.module.ts`, `ipfilter.module-definition.ts` — `IpFilter.register`/`registerAsync` and the optional global guard.
  - `ipfilter.service.ts` — rule parsing and the allow/deny decision.
  - `ipfilter.guard.ts` — the guard that reads the client IP.
  - `ipfilter-deny.exception.ts`, `ipfilter.interface.ts`, `ipfilter.constants.ts` — the exception, options type and injection token.
- `test/` — `ipfilter.spec.ts` and the Nest test app it boots (`app.ts`), with their own `tsconfig.json`.
- `dist/`, `.test-dist/` — build and test output, ignored by Git.
- `CHANGELOG.md` — release notes, one `## <version>` section per release; shipped in the package.

## Related Project Docs

- Stack conventions (mandatory): [mandatory/STACK_CONVENTIONS.md](./mandatory/STACK_CONVENTIONS.md)
- Capability brief (what this project does and what makes it different, for people):
  [CAPABILITY_BRIEF.md](./CAPABILITY_BRIEF.md)
- Error handling & logging contract: the library logs nothing; denial behavior is in [README.md → Handle denied requests](../README.md#handle-denied-requests).
- Scenario / debug test guide: none; `test/ipfilter.spec.ts` boots a real app and drives it over HTTP.
- Usage, options and the 0.x migration notes: [README.md](../README.md); release history: [CHANGELOG.md](../CHANGELOG.md).
