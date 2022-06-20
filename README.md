# NestJS IP Filter

Now we can filter the incoming requests by setting the whitelist and the blacklist IP addresses.

It will work using the built-in feature in NestJS, **Guard**, so it works like a charm as it should be and as much as it should do.

## How to install

Simply, install using NPM by the following command.

```bash
npm install nestjs-ip-filter
```

## Usage

### Use Regex for the IP list

You can use Regex format string for the IP ranges.

For a simple example, if you want to allow the private network hosts in `192.168.0.1/16`, you can write the Regex string like the below.

```bash
# 192.168.0.0 ~ 192.168.255.255
(^192.168.)
```

Check the other use cases.

```bash
# 192.168.0.100 ~ 192.168.0.110
(^192.168.0.1[0-1]0)

# 172.16.16.10, 172.16.17.10, 172.16.18.10
(^172.16.1[6-8].10)

# 110~119.*
(^11[0-9].*)
```

And, writing in this way also works on this pacakge.

But be aware of that you should write the Regex string very carefully to avoid allowing unwanted incoming IP addresses.

### Baisc usage for Whitelist

You can initialize the dedicated Guard using non-async or async mode, as like the other NestJS packages support.

Use `forRoot` for the static IP address list.

```typescript
IpFilter.forRoot({
  whitelist: [
    '(^::1)',
    '(^192.168.)',
    '127.0.0.1',
  ],
}),
```

Or, use `forRootAsync` for the provided IP addresses from the other Provider, such as ConfigModule or RepositoryModule for your database.

```typescript
// If it would like to get the whitelist IPs from a config file,
// and if MyConfigModule provides that

IpFilter.forRootAsync({
  imports: [ MyConfigModule ],
  inject: [ MyConfigService ],
  useFactory: async (myConfigService: MyConfigService) => ({
    whitelist: myConfigService.getWhitelist(),
  }),
}),
```

Yeah, you can use your method to provide some async data.

After setting up the `IpFilter` module with the `forRoot*` method, this will accept only the incoming requests for the given whitelist IP addresses.

### Blacklist

You can deny the requests that are from the blacklist IPs.

Use `blacklist` option to let the Guart know the list.

```typescript
// If it would like to get the whitelist IPs from a config file,
// and if MyConfigModule provides that

IpFilter.forRootAsync({
  imports: [ MyConfigModule ],
  inject: [ MyConfigService ],
  useFactory: async (myConfigService: MyConfigService) => ({
    whitelist: myConfigService.getWhitelist(),
    blacklist: myConfigService.getBlacklist(),
  }),
}),
```

Then its NestJS Guard will deny all the IPs which are from the blacklist.

### Use IpFilterDenyException when denying a request

You can handle the denial condition by catching the HTTP exception.

If you want to throw that `IpFilterDenyException` when denial, set the option `useDenyException` to `true`.

```typescript
// If it would like to get the whitelist IPs from a config file,
// and if MyConfigModule provides that

IpFilter.forRootAsync({
  imports: [ MyConfigModule ],
  inject: [ MyConfigService ],
  useFactory: async (myConfigService: MyConfigService) => ({
    whitelist: myConfigService.getWhitelist(),
    blacklist: myConfigService.getBlacklist(),
    useDenyException: true,
  }),
}),
```

Then it will throw `IpFilterDenyException` when the request is denied for the given whitelist or the blacklist.

So that, you can handle the denied request and can send a custom response on that handler, using NestJS **Exception Filter**.

When the Guard throws an exception, it will also carry some informative data like the incoming IP address, current whitelist and blacklist.

### Inject IpFilterService

If you want, you can inject `IpFilterService` into your code and can see current options you put when you initilize it. And, you can set the whitelist and the blacklist too.

Inject the service using the `IPFILTER_TOKEN` module.

```typescript
@Injectable()
export class SomeService {
  constructor(
    @inject(IPFILTER_TOKEN)
    private readonly ipFilterService: IpFilterService
  ) {}
  // ...
}
```

Then you can edit the whitelist, blacklist IP addresses dynamically.

```typescript
this.ipFilterService.whitelist = [ {NEW_WHITELIST} ];
this.ipFilterService.blacklist = [ {NEW_BLACKLIST} ];
```

## Example project

This repository contains an example project of this `nestjs-ip-filter` package.

Move to `example` directory and run the following commands.

```bash
npm ci
npm start:debug
```

Then, the example project will run in **3001** port.

With the `curl` command, you can do a simple test for the project.

```bash
curl -X GET -H "Content-Type: application/json" http://localhost:3001/ipfilter
```

It will result like the below, if your localhost IP is accepted for the whitelist.

```bash
{"whitelist":["(^::1)","(^192.168.)","127.0.0.1"],"blacklist":[]}
```

If it denies, it will result like the below. Check the `ipFilterData` field.

```bash
{"statusCode":403,"timestamp":"2022-06-13T09:29:40.452Z","ipFilterData":{"clientIp":"::ffff:127.0.0.1","whitelist":["(^::1)","(^192.168.)"],"blacklist":[]},"path":"/ipfilter"}
```

[Our exception filter](example/src/exception/ipfilter-exception-filter.exception.ts) put that additional field on the typical HttpException results.

You can test the projects with your local host IP address, [by editing the whitelist and the blacklist](example/src/ip-repository/ip-repository.service.ts).

## License

It follows the [MIT license](LICENSE).
