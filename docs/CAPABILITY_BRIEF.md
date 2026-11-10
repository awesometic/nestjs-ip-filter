# Capability Brief

## Purpose

What `nestjs-ip-filter` is, what makes it different, and how each highlight works — written for a
person being introduced to this repository or presenting it. It is a curated briefing, not a
specification and not a rule source: [README.md](../README.md) owns setup and run,
[decisions/](./decisions/README.md) owns durable choices, and
[mandatory/](./mandatory/AGENT_WORKFLOW.md) owns what binds agents.

## In One Minute

- A NestJS guard that allows or denies HTTP requests by client IP, for NestJS 11 and 12 apps on Express.
- Rules are IPv4/IPv6 addresses and CIDR ranges checked by Node's own `BlockList`, so an entry matches exactly what it says and a typo stops the app at startup instead of silently matching nothing.
- It filters HTTP only; GraphQL, WebSocket and RPC contexts pass through, and it does no rate limiting or geo lookup.

## Highlights

### Exact address and range rules that fail loudly

- What: whitelists and blacklists take addresses and CIDR ranges, and an invalid entry throws at startup or when a list is set at runtime.
- Why it is different: the 0.x line matched unanchored regular expressions, so `10.0.0.1` also matched `110.0.0.15`; parsing into `BlockList` removes that class of mistake (see [CHANGELOG.md](../CHANGELOG.md) → 1.0.0).
- How it works: `IpFilter.register` options → `IpFilterService` constructor or setter → `toBlockList` validates each entry, including IPv4-mapped prefixes under 96 → one `BlockList` per list, or an error that keeps the previous list.
- Trace terms: `toBlockList` leads to the parser; `Invalid IP filter rule` leads to the error every rejected entry produces.

### A client IP that cannot be forged from outside

- What: the guard decides on `req.ip`, so forwarded headers count only from proxies the app trusts.
- Why it is different: many IP filters read `X-Forwarded-For` from anyone, which lets a client claim any address; this one follows Express's `trust proxy` setting instead (see [README.md → Behind a proxy or load balancer](../README.md#behind-a-proxy-or-load-balancer)).
- How it works: HTTP request → `IpFilterGuard.canActivate` reads `req.ip`, which Express resolves under `trust proxy` → `IpFilterService.isAllowed` → `403 Forbidden`, or `IpFilterDenyException` with `{ clientIp }`.
- Trace terms: `trust proxy` leads to the guard, the test app and the README section; `isAllowed` leads to the decision and its tests.

### An explicit filter mode

- What: a configured whitelist, even an empty one, allows only its matches; without one, everyone not blacklisted passes; configuring neither list throws.
- Why it is different: a missing config value would otherwise open or close the whole app silently; here "not configured" and "empty" are separate states (see [README.md → How a request is evaluated](../README.md#how-a-request-is-evaluated)).
- How it works: options → `IpFilterService` keeps an unset list as `undefined` → `isAllowed` checks the blacklist first, then the whitelist when one exists → allow or deny.
- Trace terms: `configure "whitelist", "blacklist" or both` leads to the startup check; `allows nobody with an empty whitelist` leads to the test that pins the empty-list mode.

## Maintenance

- Last reviewed: 2026-11-10 (agent-harness-adoption)

When this file is reviewed and updated is owned by
[mandatory/AGENT_POST_IMPLEMENTATION.md](./mandatory/AGENT_POST_IMPLEMENTATION.md) ->
`Files to Review and Update`; how it is written is fixed by the `Fixed contract` in
`docs/mandatory/template/CAPABILITY_BRIEF.md`. Neither is restated here.
