# Changelog

## 1.0.0

### Breaking changes

- Rules are IPv4/IPv6 addresses and CIDR ranges instead of regular expressions; an invalid entry throws at startup or from a setter.
- The client IP is `req.ip`, which follows the app's `trust proxy` setting, instead of forwarded headers read from anyone.
- The filter mode is explicit: a configured `whitelist` (even `[]`) allows only its matches; without one, everyone not blacklisted is allowed. Configuring neither list throws at startup.
- `IpFilterDenyException` carries only `{ clientIp }`.
- `IpFilterService.whitelist` / `blacklist` return `string[] | undefined` (a copy, or `undefined` when not configured).
- Requires NestJS 11 or 12 (now peer dependencies) and Node.js `^20.19.0 || >=22.12.0`.
- Removed the unused `IpFilterDenyHandler` interface.

### Fixed

- A rule like `10.0.0.1` also matched `110.0.0.15` (unanchored regex).
- A forged `X-Forwarded-For` header bypassed the whitelist.
- With both lists set, the whitelist was ignored.
- Denied clients received the full whitelist and blacklist in the exception response.

### Added

- `global: false` to apply the guard only where `@UseGuards(IpFilterGuard)` is used (#519).
- IPv6 rules.
- Tests and CI for Node.js 20/22/24 and NestJS 11/12 (#68).

### Removed

- The `@supercharge/request-ip` dependency; the package has no runtime dependencies.
- The `example/` project; the README covers its usage.
