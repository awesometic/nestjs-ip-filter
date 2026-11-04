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

describe('IpFilterService', () => {
  it('changes rules only through the setters', async () => {
    app = await createApp({ whitelist: ['10.0.0.0/8'] });
    const service = app.get<IpFilterService>(IPFILTER_TOKEN);
    const get = () =>
      request(app!.getHttpServer()).get('/').set('X-Forwarded-For', '11.0.0.1');

    service.whitelist.push('11.0.0.1');
    assert.equal((await get()).status, 403);

    service.whitelist = ['11.0.0.0/8'];
    assert.equal((await get()).status, 200);
  });

  it('rejects an invalid rule from the setter', async () => {
    app = await createApp({ whitelist: ['10.0.0.0/8'] });
    const service = app.get<IpFilterService>(IPFILTER_TOKEN);
    assert.throws(() => (service.blacklist = ['nope']), /nope/);
  });
});
