import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { afterEach, test } from 'node:test';
import timers from 'node:timers/promises';
import { publishGitHubRelease, releaseNotes } from './github-release.mts';

const sha = 'a'.repeat(40);
const archive = Buffer.from([0x1f, 0x8b, 0x00, 0xff, 0x11]);
const digest = (bytes: Buffer) =>
  `sha256:${createHash('sha256').update(bytes).digest('hex')}`;
const checksum = Buffer.from(
  `${digest(archive).slice(7)}  nestjs-ip-filter-1.2.3.tgz\n`,
);
const env = {
  GITHUB_REPOSITORY: 'awesometic/nestjs-ip-filter',
  GITHUB_SHA: sha,
  GITHUB_TOKEN: 'fixture-value',
};
type Asset = { name: string; state: string; digest: string; size: number };
type FakeRelease = {
  id: number;
  draft: boolean;
  assets: Asset[];
  html_url: string;
  body: string;
};
const roots: string[] = [];
afterEach(() => {
  for (const root of roots.splice(0))
    rmSync(root, { recursive: true, force: true });
});

function asset(name: string, bytes: Buffer): Asset {
  return { name, size: bytes.length, digest: digest(bytes), state: 'uploaded' };
}

function fixture() {
  const root = mkdtempSync(join(tmpdir(), 'nestjs-ip-filter-github-release-'));
  roots.push(root);
  writeFileSync(
    join(root, 'package.json'),
    JSON.stringify({ name: 'nestjs-ip-filter', version: '1.2.3' }),
  );
  writeFileSync(
    join(root, 'CHANGELOG.md'),
    '# Changelog\n\n## 1.2.3\n\nRelease notes from the reviewed commit.\n\n## 1.2.2\n\nOlder notes.\n',
  );
  const remote = {
    metadataStatus: 200,
    archiveStatus: 200,
    metadata: {
      name: 'nestjs-ip-filter',
      version: '1.2.3',
      gitHead: sha,
      dist: {
        tarball:
          'https://registry.npmjs.org/nestjs-ip-filter/-/nestjs-ip-filter-1.2.3.tgz',
        integrity: `sha512-${createHash('sha512').update(archive).digest('base64')}`,
      },
    },
    downloaded: archive,
    tagSHA: null as string | null,
    annotatedTag: false,
    unreadableTag: false,
    release: null as FakeRelease | null,
    failedUpload: '',
    invalidUpload: false,
  };
  const calls: { method: string; url: string; body: unknown; at: number }[] =
    [];
  const json = (body: unknown, status = 200) =>
    new Response(JSON.stringify(body), { status });
  const request: typeof fetch = async (input, options) => {
    const url = String(input);
    const method = options?.method ?? 'GET';
    const body =
      typeof options?.body === 'string'
        ? JSON.parse(options.body)
        : options?.body;
    calls.push({ method, url, body, at: Date.now() });
    assert.equal(options?.redirect, 'error');
    if (url.startsWith('https://registry.npmjs.org/')) {
      assert.equal(
        new Headers(options?.headers).get('Authorization'),
        null,
        'GitHub credentials must never reach npm',
      );
      if (url.endsWith('/1.2.3'))
        return json(remote.metadata, remote.metadataStatus);
      if (url.endsWith('/nestjs-ip-filter-1.2.3.tgz'))
        return new Response(Uint8Array.from(remote.downloaded), {
          status: remote.archiveStatus,
        });
    }
    assert.equal(
      new Headers(options?.headers).get('Authorization'),
      'Bearer fixture-value',
    );
    const path = new URL(url).pathname;
    if (method === 'GET' && path.endsWith('/git/ref/tags/v1.2.3'))
      return json(
        remote.unreadableTag
          ? {}
          : {
              object: remote.annotatedTag
                ? { type: 'tag', sha: 'c'.repeat(40) }
                : { type: 'commit', sha: remote.tagSHA },
            },
        remote.tagSHA ? 200 : 404,
      );
    if (method === 'GET' && path.endsWith(`/git/tags/${'c'.repeat(40)}`))
      return json({ object: { type: 'commit', sha: remote.tagSHA } });
    if (method === 'GET' && path.endsWith('/releases/tags/v1.2.3'))
      return json(remote.release, remote.release ? 200 : 404);
    if (method === 'POST' && path.endsWith('/git/refs')) {
      assert.deepEqual(body, { ref: 'refs/tags/v1.2.3', sha });
      remote.tagSHA = sha;
      return json({}, 201);
    }
    if (method === 'POST' && path.endsWith('/releases')) {
      assert.deepEqual(body, {
        tag_name: 'v1.2.3',
        target_commitish: sha,
        name: 'nestjs-ip-filter v1.2.3',
        body: 'Release notes from the reviewed commit.',
        draft: true,
        prerelease: false,
      });
      remote.release = {
        id: 10,
        draft: true,
        assets: [],
        html_url:
          'https://github.com/awesometic/nestjs-ip-filter/releases/tag/v1.2.3',
        body: body.body,
      };
      return json(remote.release, 201);
    }
    if (method === 'POST' && path.endsWith('/releases/10/assets')) {
      assert.equal(new URL(url).origin, 'https://uploads.github.com');
      const name = new URL(url).searchParams.get('name')!;
      assert.ok(remote.release?.draft, 'assets must arrive before publishing');
      if (remote.failedUpload === name) return json({}, 503);
      assert.ok(Buffer.isBuffer(body));
      assert.deepEqual(
        body,
        name === 'SHA256SUMS' ? checksum : archive,
        "attachments must preserve npm's exact bytes",
      );
      const uploaded = asset(name, body);
      if (remote.invalidUpload) uploaded.digest = 'sha256:incorrect';
      remote.release.assets.push(uploaded);
      return json(uploaded, 201);
    }
    if (method === 'PATCH' && path.endsWith('/releases/10')) {
      assert.deepEqual(
        body,
        { draft: false },
        'a retry must preserve existing title and notes',
      );
      assert.ok(remote.release);
      remote.release.draft = false;
      return json(remote.release);
    }
    throw new Error(`Unexpected mock request: ${method} ${url}`);
  };
  return {
    root,
    remote,
    calls,
    request,
    run: () => publishGitHubRelease(root, env, request),
  };
}

function existingRelease(draft: boolean, assets: Asset[]): FakeRelease {
  return {
    id: 10,
    draft,
    assets,
    html_url:
      'https://github.com/awesometic/nestjs-ip-filter/releases/tag/v1.2.3',
    body: "Maintainer's existing notes.",
  };
}

test('release publishes the verified npm archive and checksum after attaching both to a draft', async () => {
  const f = fixture();
  assert.match(await f.run(), /\/releases\/tag\/v1\.2\.3$/);
  assert.equal(f.remote.tagSHA, sha);
  assert.equal(f.remote.release?.draft, false);
  assert.deepEqual(f.remote.release?.assets, [
    asset('nestjs-ip-filter-1.2.3.tgz', archive),
    asset('SHA256SUMS', checksum),
  ]);
  assert.equal(f.calls.at(-1)?.method, 'PATCH');
});

test('npm metadata and archive 404s wait 15 seconds and publish as soon as both are available', async (t) => {
  t.mock.timers.enable({ apis: ['Date', 'setTimeout'], now: 0 });
  const f = fixture();
  f.remote.metadataStatus = 404;
  f.remote.archiveStatus = 404;
  const result = f.run();
  await timers.setImmediate();
  assert.equal(
    f.calls.length,
    1,
    'the first availability check must be immediate',
  );
  t.mock.timers.tick(14_999);
  await timers.setImmediate();
  assert.equal(f.calls.length, 1, 'do not poll before 15 seconds');
  f.remote.metadataStatus = 200;
  t.mock.timers.tick(1);
  await timers.setImmediate();
  assert.deepEqual(
    f.calls.map((call) => call.at),
    [0, 15_000, 15_000],
  );
  assert.ok(
    f.calls.every((call) => call.url.startsWith('https://registry.npmjs.org/')),
  );
  f.remote.archiveStatus = 200;
  t.mock.timers.tick(15_000);
  await result;
  assert.equal(Date.now(), 30_000);
  assert.equal(f.remote.release?.draft, false);
  assert.deepEqual(f.remote.release?.assets, [
    asset('nestjs-ip-filter-1.2.3.tgz', archive),
    asset('SHA256SUMS', checksum),
  ]);
});

test('npm metadata and archive share a 20-minute deadline before any GitHub request', async (t) => {
  t.mock.timers.enable({ apis: ['Date', 'setTimeout'], now: 0 });
  const f = fixture();
  f.remote.metadataStatus = 404;
  f.remote.archiveStatus = 404;
  const result = assert.rejects(
    f.run(),
    /20 minutes.*Re-run only the failed GitHub Release job/,
  );
  await timers.setImmediate();
  f.remote.metadataStatus = 200;
  t.mock.timers.tick(20 * 60_000 - 10_000);
  await timers.setImmediate();
  assert.equal(f.calls.length, 3);
  t.mock.timers.tick(9_999);
  await timers.setImmediate();
  assert.equal(f.calls.length, 3);
  t.mock.timers.tick(1);
  await result;
  assert.equal(
    f.calls.length,
    3,
    'do not issue another request at the deadline',
  );
  assert.ok(
    f.calls.every((call) => call.url.startsWith('https://registry.npmjs.org/')),
  );
});

test('npm errors other than 404 fail immediately without publishing', async (t) => {
  t.mock.timers.enable({ apis: ['Date', 'setTimeout'], now: 0 });
  const f = fixture();
  f.remote.metadataStatus = 403;
  await assert.rejects(f.run(), /metadata is unavailable \(HTTP 403\)/);
  assert.equal(f.calls.length, 1);
  assert.equal(Date.now(), 0);
});

test('wrong npm identity, commit, archive URL or integrity refuses before any GitHub request', async () => {
  for (const change of ['version', 'commit', 'url', 'integrity', 'bytes']) {
    const f = fixture();
    if (change === 'version') f.remote.metadata.version = '9.9.9';
    if (change === 'commit') f.remote.metadata.gitHead = 'b'.repeat(40);
    if (change === 'url')
      f.remote.metadata.dist.tarball = 'https://example.invalid/archive.tgz';
    if (change === 'integrity')
      f.remote.metadata.dist.integrity = 'sha512-incorrect';
    if (change === 'bytes')
      f.remote.downloaded = Buffer.from('altered archive');
    await assert.rejects(f.run(), /does not match|failed its SHA-512/, change);
    assert.ok(
      f.calls.every((call) =>
        call.url.startsWith('https://registry.npmjs.org/'),
      ),
      change,
    );
  }
});

test('mismatched or unverifiable tags and their existing releases are preserved', async () => {
  for (const state of ['mismatch', 'missing', 'unreadable']) {
    const f = fixture();
    f.remote.tagSHA =
      state === 'missing' ? null : state === 'mismatch' ? 'b'.repeat(40) : sha;
    f.remote.unreadableTag = state === 'unreadable';
    f.remote.release = existingRelease(true, []);
    await assert.rejects(f.run(), /no matching commit|no verifiable tag/);
    assert.ok(f.calls.every((call) => call.method === 'GET'));
  }
});

test('retry reuses matching draft assets and preserves notes and unrelated attachments', async () => {
  const f = fixture();
  f.remote.tagSHA = sha;
  const unrelated = asset('maintainer.txt', Buffer.from('keep'));
  f.remote.release = existingRelease(true, [
    unrelated,
    asset('nestjs-ip-filter-1.2.3.tgz', archive),
  ]);
  await f.run();
  assert.equal(f.remote.release.body, "Maintainer's existing notes.");
  assert.deepEqual(f.remote.release.assets, [
    unrelated,
    asset('nestjs-ip-filter-1.2.3.tgz', archive),
    asset('SHA256SUMS', checksum),
  ]);
  assert.equal(f.calls.filter((call) => call.method === 'POST').length, 1);
});

test('conflicting or incomplete existing attachments refuse without overwriting or publishing', async () => {
  for (const state of ['conflict', 'unfinished', 'published-missing']) {
    const f = fixture();
    f.remote.tagSHA = sha;
    const old = asset('nestjs-ip-filter-1.2.3.tgz', archive);
    if (state === 'conflict') old.digest = 'sha256:different';
    if (state === 'unfinished') old.state = 'starter';
    f.remote.release = existingRelease(state !== 'published-missing', [old]);
    await assert.rejects(
      f.run(),
      /will not be overwritten|will not be changed/,
    );
    assert.ok(f.calls.every((call) => call.method === 'GET'));
  }
});

test('an already published matching release is a read-only successful retry', async () => {
  const f = fixture();
  f.remote.tagSHA = sha;
  f.remote.annotatedTag = true;
  f.remote.release = existingRelease(false, [
    asset('nestjs-ip-filter-1.2.3.tgz', archive),
    asset('SHA256SUMS', checksum),
  ]);
  await f.run();
  assert.ok(f.calls.every((call) => call.method === 'GET'));
});

test('failed or unverified uploads leave a recoverable draft', async () => {
  for (const invalid of [false, true]) {
    const f = fixture();
    f.remote.failedUpload = invalid ? '' : 'SHA256SUMS';
    f.remote.invalidUpload = invalid;
    await assert.rejects(f.run(), /HTTP 503|failed verification/);
    assert.equal(f.remote.release?.draft, true);
    assert.ok(!f.calls.some((call) => call.method === 'PATCH'));
    if (!invalid) {
      f.remote.failedUpload = '';
      await f.run();
      assert.equal(f.remote.release?.draft, false);
      assert.equal(f.remote.release?.assets.length, 2);
    }
  }
});

test('wrong workflow identity, missing authorization or absent notes never reaches the network', async () => {
  const f = fixture();
  for (const changed of [
    { ...env, GITHUB_REPOSITORY: 'another/repository' },
    { ...env, GITHUB_TOKEN: '' },
    { ...env, GITHUB_SHA: 'main' },
  ]) {
    await assert.rejects(
      publishGitHubRelease(f.root, changed, f.request),
      /workflow/,
    );
  }
  writeFileSync(
    join(f.root, 'CHANGELOG.md'),
    '# Changelog\n\n## 1.2.3\n\n## 1.2.2\n\nOlder notes.\n',
  );
  await assert.rejects(f.run(), /notes.*empty/);
  assert.equal(f.calls.length, 0);
});

test('publishing remains manual with a dependent release job and scoped write permission', () => {
  const workflow = readFileSync(
    new URL('../.github/workflows/publish.yml', import.meta.url),
    'utf8',
  );
  assert.match(workflow, /on:\n {2}workflow_dispatch:\n/);
  assert.doesNotMatch(workflow, /\n {2}(?:push|release|pull_request):/);
  const [npm, github] = workflow.split('  github-release:');
  assert.ok(npm && github);
  assert.match(npm, /github\.ref == 'refs\/heads\/main'/);
  assert.match(npm, /contents: read\n {6}id-token: write/);
  assert.doesNotMatch(npm, /contents: write/);
  assert.ok(
    npm
      .trimEnd()
      .endsWith(
        'run: npm publish --ignore-scripts --provenance --access public',
      ),
    'post-publish verification belongs to the retryable release job',
  );
  assert.match(github, /needs: publish/);
  assert.match(github, /contents: write/);
  assert.match(github, /ref: \$\{\{ github\.sha \}\}/);
  assert.doesNotMatch(
    github,
    /run: sleep /,
    'npm availability polling replaces the fixed delay',
  );
  assert.match(github, /run: node scripts\/github-release\.mts/);
});

test('release notes are the CHANGELOG section of the version', () => {
  const changelog =
    '# Changelog\n\n## 1.2.3\n\n### Fixed\n\n- A.\n\n## 1.2.30\n\nOther.\n\n## 1.2.2\n\nOld.\n';
  assert.equal(releaseNotes(changelog, '1.2.3'), '### Fixed\n\n- A.');
  assert.equal(releaseNotes(changelog, '1.2.30'), 'Other.');
  assert.equal(releaseNotes(changelog, '9.9.9'), '');
});
