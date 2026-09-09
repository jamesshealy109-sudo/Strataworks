import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const read = (path) => readFileSync(path, 'utf8');

const home = read('index.html');
const sitemap = read('sitemap.xml');

assert.match(home, /href="backflow-operations-platform\//, 'homepage must link to platform landing page');
assert.match(home, /Backflow Operations Platform/i, 'homepage must name the platform');
assert.match(home, /Request a Demo/i, 'homepage must expose the primary platform CTA');

const platform = read('backflow-operations-platform/index.html');

assert.match(platform, /<link rel="canonical" href="https:\/\/strataworks\.tech\/backflow-operations-platform\/">/);
assert.match(platform, /<h1[^>]*>[^<]*Backflow Testing Software/i);
assert.match(platform, /james@strataworks\.tech/);
assert.match(platform, /formsubmit\.co\/james@strataworks\.tech/);
assert.match(platform, /South Carolina/i);
assert.match(platform, /North Carolina/i);
assert.match(platform, /Georgia/i);
assert.match(platform, /nationwide|national/i);
assert.match(platform, /\(803\) 386-7728/);
assert.match(platform, /tel:\+18033867728/);
assert.match(sitemap, /https:\/\/strataworks\.tech\/backflow-operations-platform\//);

const forbidden = [
  /guaranteed savings/i,
  /99\.9% uptime/i,
  /SOC 2/i,
  /all municipalities/i,
  /every municipality/i,
  /thousands of customers/i,
  /#1 backflow/i,
];

for (const pattern of forbidden) {
  assert.doesNotMatch(platform, pattern, `unsupported claim found: ${pattern}`);
}

console.log('Backflow marketing regression checks passed.');
