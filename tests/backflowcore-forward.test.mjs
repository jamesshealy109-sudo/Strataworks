import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const read = path => readFileSync(path, 'utf8');
const root = 'backflow-operations-platform';
const destinations = new Map([
  [`${root}/index.html`, 'https://backflowcore.com/'],
  [`${root}/report-submission/index.html`, 'https://backflowcore.com/software/report-submission'],
  [`${root}/syncta-alternative/index.html`, 'https://backflowcore.com/compare/syncta-alternative'],
  [`${root}/product-tour/index.html`, 'https://backflowcore.com/how-it-works'],
  [`${root}/setup/index.html`, 'https://backflowcore.com/'],
]);

test('the StrataWorks homepage sends Backflow visitors directly to BackflowCore', () => {
  const feature = read('index.html').match(/<aside class="featured-platform reveal"[\s\S]*?<\/aside>/)?.[0];
  assert.ok(feature);
  assert.match(feature, /BackflowCore/);
  assert.match(feature, /href="https:\/\/backflowcore\.com\/"/);
  assert.doesNotMatch(feature, /href="backflow-operations-platform\//);
  assert.doesNotMatch(feature, /\$300|60 months|Limited spots remaining/);
});

test('every legacy Backflow HTML entry hands visitors to the new domain', () => {
  for (const [path, destination] of destinations) {
    const page = read(path);
    assert.match(page, /<meta name="robots" content="noindex, follow">/, path);
    assert.ok(page.includes(`<link rel="canonical" href="${destination}">`), path);
    assert.ok(page.includes(`<meta http-equiv="refresh" content="0; url=${destination}">`), path);
    assert.ok(page.includes(`window.location.replace('${destination}' + window.location.search)`), path);
    assert.ok(page.includes(`<a href="${destination}">`), path);
    assert.doesNotMatch(page, /<form\b|buy\.stripe\.com/, path);
  }
});

test('StrataWorks stops submitting the retired Backflow pages for indexing', () => {
  assert.doesNotMatch(read('sitemap.xml'), /strataworks\.tech\/backflow-operations-platform\//);
});

test('the retired StrataWorks Backflow checkout is disabled', () => {
  const config = JSON.parse(read('backflow-operations-platform/funnel-config.json'));
  assert.equal(config.checkoutEnabled, false);
  assert.equal(config.checkoutUrl, null);
});

test('an in-flight legacy setup return shows confirmation before forwarding', () => {
  const receipt = read(`${root}/setup/received/index.html`);
  assert.match(receipt, /<h1>Setup request received<\/h1>/);
  assert.match(receipt, /does not confirm payment or account access/i);
  assert.match(receipt, /<meta http-equiv="refresh" content="15; url=https:\/\/backflowcore\.com\/">/);
  assert.match(receipt, /<a href="https:\/\/backflowcore\.com\/">/);
  assert.doesNotMatch(receipt, /window\.location\.replace|<form\b/);
});

test('remaining StrataWorks pages link directly to BackflowCore', () => {
  for (const path of ['index.html', 'managed-it-services/index.html', 'services/ai-automation/index.html']) {
    assert.doesNotMatch(read(path), /href="\/?backflow-operations-platform\//, path);
  }
});
