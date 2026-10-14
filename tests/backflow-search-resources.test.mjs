import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, existsSync } from 'node:fs';
import { resolve } from 'node:path';
import { createHash } from 'node:crypto';

const root = 'backflow-operations-platform';
const routes = ['report-submission', 'syncta-alternative', 'product-tour'];
const read = p => readFileSync(p, 'utf8');
const graph = html => [...html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)].flatMap(m => { const j = JSON.parse(m[1]); return j['@graph'] || [j]; });

test('published media manifest matches the current sales video release', () => {
  const manifest = JSON.parse(read(`${root}/media/manifest.json`));
  const metadata = JSON.parse(read(`${root}/media/sales-story-metadata.json`));
  assert.equal(manifest.sales_story.duration_seconds, metadata.duration_seconds);
  assert.equal(manifest.sales_story.voice_engine, metadata.voice_engine);
  for (const name of ['sales-story.mp4','sales-story-web.mp4','sales-story.vtt','sales-story-transcript.txt','sales-story-poster.jpg','sales-story-metadata.json']) {
    const path = `${root}/media/${name}`;
    const bytes = /\.(txt|vtt|json)$/.test(name) ? Buffer.from(read(path).replace(/\r\n/g, '\n')) : readFileSync(path);
    assert.equal(manifest.sha256[name], createHash('sha256').update(bytes).digest('hex'), name);
  }
});

test('search resources have unique canonicals, sitemap discovery, and working local links', () => {
  const canonicals = new Set();
  for (const route of routes) {
    const path = `${root}/${route}/index.html`;
    const html = read(path);
    const url = `https://strataworks.tech/${root}/${route}/`;
    assert.ok(html.includes(`<link rel="canonical" href="${url}">`));
    assert.ok(read('sitemap.xml').includes(`<loc>${url}</loc>`));
    assert.equal((html.match(/<h1\b/g) || []).length, 1);
    assert.doesNotMatch(html, /noindex/i);
    assert.ok(graph(html).some(n => n['@type'] === 'BreadcrumbList'));
    for (const [, href] of html.matchAll(/(?:href|src)="([^"#]+)"/g)) {
      if (/^(?:https?:|mailto:|tel:|data:)/.test(href)) continue;
      const clean = href.split(/[?#]/)[0];
      const target = resolve(href.startsWith('/') ? '.' : `${root}/${route}`, `.${href.startsWith('/') ? clean : '/' + clean}`);
      assert.ok(existsSync(target), `${path}: missing ${href}`);
    }
    canonicals.add(url);
  }
  assert.equal(canonicals.size, routes.length);
});

test('watch metadata matches the discoverable video and captions stay within duration', () => {
  const watch = read(`${root}/product-tour/index.html`);
  const video = graph(watch).find(n => n['@type'] === 'VideoObject');
  assert.ok(video);
  const metadata = JSON.parse(read(`${root}/media/sales-story-metadata.json`));
  const [, m, s] = video.duration.match(/^PT(\d+)M([\d.]+)S$/);
  assert.equal(Number(m)*60 + Number(s), metadata.duration_seconds);
  assert.ok(watch.includes(`src="${video.contentUrl.replace('https://strataworks.tech', '')}"`));
  assert.ok(watch.includes('id="sales-video"'));
  assert.doesNotMatch(watch, /\bautoplay\b/);
  const seconds = s => {const [h,m,v] = s.split(':').map(Number); return h*3600+m*60+v;};
  let previous = 0;
  for (const [, from, to] of read(`${root}/media/sales-story.vtt`).matchAll(/(\d\d:\d\d:\d\d\.\d{3}) --> (\d\d:\d\d:\d\d\.\d{3})/g)) {
    const start = seconds(from), end = seconds(to);
    assert.ok(start >= previous && end > start && end <= metadata.duration_seconds, `${from} --> ${to}`);
    previous = end;
  }
  assert.ok(previous > 70, 'captions must cover the extended story');
});
