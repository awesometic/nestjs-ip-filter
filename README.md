# NestJS IP Filter

A NestJS guard that allows or denies requests by client IP address, using whitelists and blacklists of IPv4/IPv6 addresses and CIDR ranges.

It filters HTTP requests. GraphQL, WebSocket and microservice (RPC) contexts are not filtered and pass through.

## Requirements

- NestJS 11 or 12
- Node.js `^20.19.0 || >=22.12.0`
- The Express platform (`@nestjs/platform-express`)

## Install

```bash
npm install nestjs-ip-filter
```

## Usage

Import `IpFilter` once, in your root module. The guard then applies to every route, and `IpFilterGuard` and `IPFILTER_TOKEN` are available in every module.

```typescript
import { Module } from '@nestjs/common';
import { IpFilter } from 'nestjs-ip-filter';

@Module({
  imports: [
    IpFilter.register({
      whitelist: ['127.0.0.1', '::1', '192.168.0.0/16'],
    }),
  ],
})
export class AppModule {}
```

Use `registerAsync` to load the lists from another provider, such as a config service or a database.

```typescript
IpFilter.registerAsync({
  imports: [ConfigModule],
  inject: [ConfigService],
  useFactory: (config: ConfigService) => ({
    whitelist: config.get<string[]>('ipFilter.whitelist'),
    blacklist: config.get<string[]>('ipFilter.blacklist'),
  }),
});
```

### Rules

Each entry is an IPv4 or IPv6 address, or a CIDR range:

```typescript
'10.0.0.1'; // one address
'10.0.0.0/8'; // 10.0.0.0 – 10.255.255.255
'2001:db8::/32'; // an IPv6 range
```

IPv4-mapped IPv6 client addresses (`::ffff:10.1.2.3`) match IPv4 rules, so write IPv4 ranges as IPv4 CIDR.
A mapped rule with an IPv6 prefix under 96 (`::ffff:192.168.0.0/16`) is rejected: as an IPv6 range it would span all of IPv4.
An invalid entry throws when the module starts or when a list is set, so a typo never silently matches nothing.

### How a request is evaluated

1. A client IP in the `blacklist` is denied.
2. If a `whitelist` is configured, only client IPs in it are allowed. An empty whitelist (`[]`) allows nobody.
3. If no `whitelist` is configured, every client IP not denied by step 1 is allowed.

At least one of `whitelist` and `blacklist` must be configured; otherwise the module throws at startup.
This way a missing configuration value fails loudly instead of opening or closing everything.

| `whitelist` | `blacklist` | Allowed |
| --- | --- | --- |
| `['10.0.0.0/8']` | not set | `10.0.0.0/8` only |
| not set | `['10.0.0.5']` | everyone except `10.0.0.5` |
| `['10.0.0.0/8']` | `['10.0.0.5']` | `10.0.0.0/8` except `10.0.0.5` |
| `[]` | not set | nobody |
| not set | `[]` | everyone |
| not set | not set | throws at startup |

### Behind a proxy or load balancer

The guard uses `req.ip`, so the client IP follows Express's [`trust proxy`](https://expressjs.com/en/guide/behind-proxies.html) setting.
Forwarded headers such as `X-Forwarded-For` are used only from proxies you trust; anyone else can forge them.

```typescript
import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';

const app = await NestFactory.create<NestExpressApplication>(AppModule);
app.set('trust proxy', 'loopback'); // or the proxy's address/CIDR, or the number of hops
```

Without it, every request behind a proxy appears to come from the proxy's address.

### Apply to some routes only

Set `global: false` in the root module and add `IpFilterGuard` where you need it, in any module.

```typescript
@Module({
  imports: [IpFilter.register({ whitelist: ['10.0.0.0/8'], global: false }), AdminModule],
})
export class AppModule {}

@Controller('admin')
@UseGuards(IpFilterGuard)
export class AdminController {}

@Module({ controllers: [AdminController] })
export class AdminModule {}
```

### Handle denied requests

By default a denied request gets NestJS's standard `403 Forbidden`.
With `useDenyException: true` the guard throws `IpFilterDenyException` instead, whose response is `{ clientIp }`, so you can catch it in an exception filter.

```typescript
@Catch(IpFilterDenyException)
export class IpFilterDenyExceptionFilter implements ExceptionFilter {
  catch(exception: IpFilterDenyException, host: ArgumentsHost) {
    const { clientIp } = exception.getResponse() as { clientIp?: string };
    host.switchToHttp().getResponse<Response>().status(403).json({ message: 'Forbidden', clientIp });
  }
}
```

### Change the lists at runtime

Inject `IpFilterService` with `IPFILTER_TOKEN`. Setting a list replaces it and applies to the next request; an invalid entry throws and keeps the previous list.

```typescript
@Injectable()
export class IpRulesService {
  constructor(@Inject(IPFILTER_TOKEN) private readonly ipFilter: IpFilterService) {}

  block(address: string) {
    this.ipFilter.blacklist = [...(this.ipFilter.blacklist ?? []), address];
  }
}
```

The getters return a copy of the list, or `undefined` when that list is not configured. Emptying a list keeps the mode: an empty whitelist still allows nobody.
Setting a whitelist on an app that had none switches it to whitelist mode, so only the whitelisted addresses pass from then on.

## Migrating from 0.x

- **Rules are addresses and CIDR ranges, not regular expressions.** Rewrite `'(^192.168.)'` as `'192.168.0.0/16'` and drop the `::ffff:` prefix workaround (write `'192.168.0.0/16'`, not `'::ffff:192.168.0.0/16'`). A regex entry now throws at startup.
- **The client IP is `req.ip`.** 0.x read `X-Forwarded-For` and similar headers from anyone, which allowed spoofing. Behind a proxy, set [`trust proxy`](#behind-a-proxy-or-load-balancer).
- **The blacklist no longer overrides the whitelist.** With both lists set, a client must be in the whitelist and not in the blacklist; 0.x let anyone outside the blacklist through.
- **Configure at least one list** (`null` counts as not configured). 0.x denied everything when both lists were empty. Set `whitelist: []` to keep that behavior, for example when the lists are filled at runtime.
- **`IpFilterDenyException` carries only `{ clientIp }`.** 0.x also sent both lists to the denied client.
- **The getters return `string[] | undefined`.**
- NestJS 11 or 12 and Node.js `^20.19.0 || >=22.12.0` are required.

## Development

```bash
npm ci
npm run lint
npm test
npm run build
```

## License

[MIT](LICENSE)
