import assert from 'node:assert/strict';
import { afterEach, describe, it } from 'node:test';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { IPFILTER_TOKEN, IpFilterModuleOptions, IpFilterService } from '../lib';
import { createApp } from './app';

const LOCALHOST = ['127.0.0.1', '::1'];

let app: INestApplication | undefined;
afterEach(() => app?.close());

async function statusFor(
  options: IpFilterModuleOptions,
  clientIp: string,
  trustProxy = true,
) {
  app = await createApp(options, trustProxy);
  return (
    await request(app.getHttpServer()).get('/').set('X-Forwarded-For', clientIp)
  ).status;
}

describe('rule matching', () => {
  it('matches CIDR ranges exactly', async () => {
    assert.equal(
      await statusFor({ whitelist: ['10.0.0.0/8'] }, '10.1.2.3'),
      200,
    );
    assert.equal(
      await statusFor({ whitelist: ['10.0.0.0/8'] }, '110.0.0.15'),
      403,
    );
  });

  it('matches single addresses exactly', async () => {
    assert.equal(await statusFor({ whitelist: ['10.0.0.1'] }, '10.0.0.1'), 200);
    assert.equal(
      await statusFor({ whitelist: ['10.0.0.1'] }, '110.0.0.15'),
      403,
    );
  });

  it('matches IPv4-mapped IPv6 clients against IPv4 rules', async () => {
    assert.equal(
      await statusFor({ whitelist: ['10.0.0.0/8'] }, '::ffff:10.1.2.3'),
      200,
    );
  });

  it('matches IPv6 ranges', async () => {
    assert.equal(
      await statusFor({ whitelist: ['2001:db8::/32'] }, '2001:db8::1'),
      200,
    );
    assert.equal(
      await statusFor({ whitelist: ['2001:db8::/32'] }, '2001:db9::1'),
      403,
    );
  });

  it('trims whitespace around rules', async () => {
    assert.equal(
      await statusFor({ whitelist: [' 10.0.0.1 '] }, '10.0.0.1'),
      200,
    );
  });

  for (const rule of [
    '10.0.0.300',
    '(^192.168.)',
    '10.0.0.0/33',
    'fe80::/129',
  ]) {
    it(`rejects the invalid rule ${rule} at startup`, async () => {
      await assert.rejects(createApp({ whitelist: [rule] }), (err: Error) =>
        err.message.includes(rule),
      );
    });
  }
});

describe('client IP', () => {
  it('ignores X-Forwarded-For unless trust proxy is set', async () => {
    assert.equal(
      await statusFor({ whitelist: LOCALHOST }, '10.9.9.9', false),
      200,
    );
    assert.equal(
      await statusFor({ whitelist: ['10.9.9.9'] }, '10.9.9.9', false),
      403,
    );
  });
});

describe('filter mode', () => {
  it('applies the blacklist before the whitelist', async () => {
    const options = { whitelist: ['10.0.0.0/8'], blacklist: ['10.0.0.5'] };
    assert.equal(await statusFor(options, '10.0.0.5'), 403);
    assert.equal(await statusFor(options, '10.0.0.6'), 200);
    assert.equal(await statusFor(options, '11.0.0.1'), 403);
  });

  it('allows everyone not blacklisted when no whitelist is configured', async () => {
    assert.equal(await statusFor({ blacklist: ['10.0.0.5'] }, '10.0.0.5'), 403);
    assert.equal(await statusFor({ blacklist: ['10.0.0.5'] }, '11.0.0.1'), 200);
    assert.equal(await statusFor({ blacklist: [] }, '11.0.0.1'), 200);
  });

  it('allows nobody with an empty whitelist', async () => {
    assert.equal(await statusFor({ whitelist: [] }, '11.0.0.1'), 403);
  });

  it('rejects a config with neither list at startup', async () => {
    await assert.rejects(createApp({}), /whitelist.*blacklist/);
  });
});

describe('IpFilterService', () => {
  const clientRequest = () =>
    request(app!.getHttpServer()).get('/').set('X-Forwarded-For', '11.0.0.1');

  it('keeps the mode when the setters empty a list', async () => {
    app = await createApp({ blacklist: ['10.0.0.5'] });
    app.get<IpFilterService>(IPFILTER_TOKEN).blacklist = [];
    assert.equal((await clientRequest()).status, 200);
  });

  it('applies rules from the setters', async () => {
    app = await createApp({ whitelist: ['10.0.0.0/8'] });
    const service = app.get<IpFilterService>(IPFILTER_TOKEN);
    assert.equal((await clientRequest()).status, 403);
    service.whitelist = ['11.0.0.0/8'];
    assert.equal((await clientRequest()).status, 200);
  });

  it('keeps unset lists apart from empty ones and returns copies', async () => {
    app = await createApp({ whitelist: ['10.0.0.0/8'] });
    const service = app.get<IpFilterService>(IPFILTER_TOKEN);
    assert.equal(service.blacklist, undefined);
    service.whitelist?.push('11.0.0.1');
    assert.deepEqual(service.whitelist, ['10.0.0.0/8']);
  });

  it('rejects an invalid rule from the setter', async () => {
    app = await createApp({ whitelist: ['10.0.0.0/8'] });
    const service = app.get<IpFilterService>(IPFILTER_TOKEN);
    assert.throws(() => (service.blacklist = ['nope']), /nope/);
  });

  it('denies a request without a client IP', async () => {
    app = await createApp({ blacklist: [] });
    assert.equal(
      app.get<IpFilterService>(IPFILTER_TOKEN).isAllowed(undefined),
      false,
    );
  });
});

describe('deny exception', () => {
  it('reports only the client IP', async () => {
    app = await createApp({
      whitelist: ['10.0.0.0/8'],
      useDenyException: true,
    });
    const res = await request(app.getHttpServer())
      .get('/')
      .set('X-Forwarded-For', '11.0.0.1');
    assert.equal(res.status, 403);
    assert.deepEqual(res.body, { clientIp: '11.0.0.1' });
  });
});

describe('global option', () => {
  const statusOf = (path: string) =>
    request(app!.getHttpServer()).get(path).set('X-Forwarded-For', '11.0.0.1');

  it('guards every route by default', async () => {
    app = await createApp({ whitelist: ['10.0.0.0/8'] });
    assert.equal((await statusOf('/')).status, 403);
    assert.equal((await statusOf('/guarded')).status, 403);
  });

  it('guards only routes using IpFilterGuard with global: false', async () => {
    app = await createApp({ whitelist: ['10.0.0.0/8'], global: false });
    assert.equal((await statusOf('/')).status, 200);
    assert.equal((await statusOf('/guarded')).status, 403);
  });
});
