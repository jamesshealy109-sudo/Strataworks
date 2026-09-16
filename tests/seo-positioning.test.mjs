import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const read = path => readFileSync(path, 'utf8');
const publicPages = [
  'index.html',
  'managed-it-services/index.html',
  'backflow-operations-platform/index.html',
  'services/ai-automation/index.html',
  'services/business-phone-systems/index.html',
  'services/it-consulting/index.html',
  'services/networking/index.html',
  'services/web-design/index.html',
];

const canonicalFor = html => html.match(/<link rel="canonical" href="([^"]+)">/)?.[1];
const jsonLdBlocks = html => [...html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)].map(match => JSON.parse(match[1]));

const homepage = read('index.html');
const managed = read('managed-it-services/index.html');
const sitemap = read('sitemap.xml');

for (const pagePath of publicPages) {
  const page = read(pagePath);
  const canonical = canonicalFor(page);
  assert.ok(canonical?.startsWith('https://strataworks.tech/'), `${pagePath} needs an HTTPS canonical`);
  assert.doesNotMatch(page, /<meta[^>]+name="robots"[^>]+content="[^"]*noindex/i, `${pagePath} must remain indexable`);
  assert.doesNotMatch(page, /noindex/i, `${pagePath} must not contain noindex`);
  assert.doesNotMatch(page, /(?:href|action)="[^"]*\/(?:home|contact)(?:["#?])/i, `${pagePath} contains an obsolete route`);
  for (const block of jsonLdBlocks(page)) assert.ok(block['@graph'] || block['@type'], `${pagePath} has valid JSON-LD shape`);
  if (pagePath !== 'managed-it-services/index.html') {
    const nav = page.match(/<nav[^>]+id="site-nav"[\s\S]*?<\/nav>/i)?.[0];
    assert.ok(nav, `${pagePath} needs a standard navigation`);
    assert.equal((nav.match(/href="\/managed-it-services\/"/g) || []).length, 1, `${pagePath} needs one managed IT navigation route`);
    assert.match(nav, /href="\/managed-it-services\/">Managed IT(?: Services)?/i, `${pagePath} needs a descriptive managed IT navigation label`);
  }
}

const homepageGraph = jsonLdBlocks(homepage)[0]['@graph'];
assert.equal(homepageGraph.find(item => item['@type'] === 'WebSite')['@id'], 'https://strataworks.tech/#website');
assert.equal(homepageGraph.find(item => item['@type'] === 'Organization')['@id'], 'https://strataworks.tech/#organization');
assert.match(homepageGraph.find(item => item['@type'] === 'WebSite').description, /managed IT/i);
assert.equal(canonicalFor(homepage), 'https://strataworks.tech/');
assert.equal(canonicalFor(managed), 'https://strataworks.tech/managed-it-services/');
for (const pagePath of publicPages) {
  const canonical = canonicalFor(read(pagePath));
  assert.match(sitemap, new RegExp(canonical.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')));
}
for (const [pagePath, label] of [
  ['services/it-consulting/index.html', 'Ongoing managed IT support'],
  ['services/networking/index.html', 'Managed IT for your business'],
  ['services/business-phone-systems/index.html', 'Managed IT support'],
]) {
  const related = read(pagePath).match(/<div class="related-links"[\s\S]*?<\/div>/i)?.[0];
  assert.ok(related, `${pagePath} needs related links`);
  assert.equal((related.match(/href="\/managed-it-services\/"/g) || []).length, 1, `${pagePath} needs one contextual managed IT link`);
  assert.match(related, new RegExp(`href="/managed-it-services/">${label}`));
}
const styles = read('styles.css');
assert.match(styles, /@media \(max-width: 960px\)[\s\S]*?\.menu-toggle \{ display: block;/, 'standard navigation needs a tablet breakpoint');

console.log('SEO positioning regression checks passed.');
