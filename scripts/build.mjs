#!/usr/bin/env node
// npm run build: the same build the publish workflow runs, on your computer, with an app checkout next to this one.
// It does not pack anything itself: it runs the app's own tools/publish.mjs (validate every course in published.json,
// pack each into a deterministic course file, write catalog.json), so a local preview and CI can never disagree.
//
//   npm run build                      build into site/ (open site/index.html, or serve site/ and point the app at it)
//   npm run check                      validate and build in memory, write nothing (what pull requests run)
//   node scripts/build.mjs [--app <dir>] [--out <dir>] [--previous <url|file>] [--live] [--check]
//
//   --app       the app checkout (default: ADHYAYAN_APP, else ../adhyayan next to this repository)
//   --out       where to write the site (default: site/)
//   --previous  the catalogue to count revisions from (default: the last local build in --out, if there is one)
//   --live      count revisions from the published catalogue (what CI does; needs the network)
//
// To try a local build in the app: serve the folder (for example `npx http-server site -p 8099`), then start the app
// with ADHY_CATALOG=http://127.0.0.1:8099/catalog.json ADHY_ALLOW_LOCAL_HTTP=1 (or set the address in
// Settings → Advanced, which accepts plain http only for 127.0.0.1 and localhost).
import { spawnSync } from 'node:child_process';
import { copyFileSync, existsSync, mkdtempSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const REPO = fileURLToPath(new URL('..', import.meta.url));
const LIVE = 'https://samir-giripunje.github.io/adhyayan-courses/catalog.json';
const argv = process.argv.slice(2);
const arg = (k) => { const i = argv.indexOf(k); return i >= 0 ? argv[i + 1] : null; };
const has = (k) => argv.includes(k);

const app = resolve(arg('--app') || process.env.ADHYAYAN_APP || join(REPO, '..', 'adhyayan'));
const tool = join(app, 'tools', 'publish.mjs');
if (!existsSync(tool)) {
  console.error(`No app checkout at ${app} (looked for tools/publish.mjs).\nClone https://github.com/Samir-Giripunje/adhyayan next to this repository, run npm install there, or pass --app <dir>.`);
  process.exit(1);
}

const args = [tool, '--root', REPO];
if (has('--check')) args.push('--check');
else {
  const out = resolve(arg('--out') || join(REPO, 'site'));
  args.push('--out', out);
  // The last local build is replaced by this one: keep its catalogue aside to count revisions from.
  let previous = has('--live') ? LIVE : arg('--previous');
  if (!previous && existsSync(join(out, 'catalog.json'))) {
    previous = join(mkdtempSync(join(tmpdir(), 'adhy-prev-')), 'catalog.json');
    copyFileSync(join(out, 'catalog.json'), previous);
  }
  if (previous) args.push('--previous', previous);
  // The commit's time, as CI uses, so the same commit builds the same catalogue.
  const git = spawnSync('git', ['-C', REPO, 'log', '-1', '--format=%cI'], { encoding: 'utf8' });
  if (git.status === 0 && git.stdout.trim()) args.push('--generated', git.stdout.trim());
}
const r = spawnSync(process.execPath, args, { stdio: 'inherit' });
process.exit(r.status ?? 1);
