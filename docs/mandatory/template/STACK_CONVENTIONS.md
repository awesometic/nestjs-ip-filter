<!--
TEMPLATE for docs/mandatory/STACK_CONVENTIONS.md — the only project-specific mandatory
file. Copy this to docs/mandatory/STACK_CONVENTIONS.md, then inspect the project's source,
tests, docs, and previous conventions before filling it. The format is portable; the
content is project-owned.

Fixed contract (do not restructure):
  - Title `# Stack Conventions`.
  - The `Template version:` line under the title, kept exactly as shipped. It names the
    template revision this filled file is aligned to; update it only when re-aligning
    the file to a newer template. Agents compare it against this template's own line to
    detect a pending migration (see AGENT_WORKFLOW.md read order). The number is the
    harness minor that last changed this template's format.
  - `## Purpose` first, with the boilerplate below (keep the two cross-links).
  - `## Project Rules` second: only non-obvious language/framework/domain contracts that
    materially constrain implementation.
  - Optional `## Required Reads And Review Gates` last when the project has conditional
    docs or project-specific verification/review exceptions.
  - Use real owners, paths, and types. When a non-obvious cross-boundary contract benefits
    from a trace, describe one representative diagnostic path through the actual
    architecture; do not invent layers or require a fixed sequence.
  - A layered project — Clean, Hexagonal, Onion, MVC, MVVM, feature-sliced or another
    layering — states its dependency direction in `## Project Rules`, even when the
    framework scaffolds the layers: each layer by its real path, which layers it may
    import and, where the project has one, the composition root that wires them.
    Clean-family architectures point dependencies inward: outer layers import inner ones,
    and the domain imports no framework, UI, persistence or transport code. Record the
    direction the code actually follows and name any deviation (persistence annotations
    on domain types, for example); omit the rule when the project has no layers. In the
    shapes below, `A → B` means A may import B and a layer imports nothing its line does
    not list; they illustrate and prescribe nothing, so use the project's real paths:
      - Backend, Clean (NestJS, Spring): `src/main` (composition root) → every layer;
        `src/interface/http` → `src/application` → `src/domain`;
        `src/infrastructure` → `src/application` ports, `src/domain`.
      - Mobile app, Clean (Flutter): `lib/presentation` → `lib/domain`; `lib/data` →
        `lib/domain`, implementing the repository interfaces `lib/domain` declares;
        `lib/main.dart` wires them.
      - Web frontend, feature-sliced (React, Next.js): layers `app`, `pages`, `widgets`,
        `features`, `entities`, `shared`; a slice imports only slices on lower layers,
        and entities may use an explicit `@x` API. `app` and `shared` hold segments, not
        slices: segments within either layer import each other freely, and imports across
        layers still point down. In Next.js, FSD's guide names these layers `src/_app` and
        `src/_pages`, because the router owns `app/` and `pages/`.
      - Server-rendered web, MVC (Rails, Laravel): controllers → models and services;
        views render what controllers pass; models reference no controller or view.
      - Desktop app, MVVM (WPF, Avalonia): View → ViewModel → Model and service
        interfaces; a ViewModel references no View or UI-toolkit type.
      - CLI, hexagonal (Go): `cmd/` (composition root) → `internal/app`,
        `internal/adapters/*`; `internal/app` → `internal/domain`; `internal/adapters/*`
        implement the ports `internal/app` declares.
  - Do not duplicate AGENT_WORKFLOW, skill/sub-agent routing, generic coding advice, or
    rules that are obvious from the framework and repository structure; the dependency
    direction above is the one exception.
Cross-reference links are written relative to docs/mandatory/ (this file's output location).
-->

# Stack Conventions

Template version: 1.17

## Purpose

Project-specific mandatory conventions for the language, framework, and domain of this
repository (`<stack>`). Read before any non-trivial implementation. The portable
engineering rules live in [ENGINEERING_PRINCIPLES.md](./ENGINEERING_PRINCIPLES.md); the
toolchain commands and structure live in [docs/PROJECT_STACK.md](../PROJECT_STACK.md).
This file keeps the same filename and format in every project; only its content differs
per stack.

## Project Rules

- `<non-obvious ownership, dependency, error, persistence, naming, or runtime contract;`
  `name the real file/type that owns it>`
- `<layered projects only — dependency direction: each layer's real path, the layers it may`
  `import, and the composition root that wires them; delete when the project has no layers>`
- `<representative diagnostic trace when useful: actual visible/request/message entry →`
  `actual behavior owners and applicable boundaries → observable outcome; steps may skip,`
  `combine, branch, or cross asynchronous boundaries>`

## Required Reads And Review Gates

- `<conditional project docs and project-specific verification/review exceptions only;`
  `delete this section when none exist>`
