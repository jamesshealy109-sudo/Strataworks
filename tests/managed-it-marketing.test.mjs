import assert from 'node:assert/strict';
import { existsSync, readFileSync } from 'node:fs';

const read = path => readFileSync(path, 'utf8');
const pagePath = 'managed-it-services/index.html';
assert.ok(existsSync(pagePath), 'managed IT landing page must exist');
const page = read(pagePath);
assert.match(page, /<title>Managed IT Services Columbia SC \| Business IT Support \| StrataWorks<\/title>/);
assert.match(page, /<link rel="canonical" href="https:\/\/strataworks\.tech\/managed-it-services\/">/);
for (const text of ['Columbia', 'Lexington', 'Enterprise IT support.', 'Without enterprise bureaucracy.', 'Schedule an IT Consultation', '(803) 386-7728', 'tel:+18033867728']) {
  assert.ok(page.includes(text), `missing visible positioning or conversion: ${text}`);
}
assert.match(page, /<form[^>]*id="msp-consultation-form"[^>]*action="https:\/\/formsubmit\.co\/james@strataworks\.tech"[^>]*method="POST"/);
assert.match(page, /data-conversion="consultation-form"/);
assert.match(page, /data-conversion="phone-call"/);
assert.match(page, /id="msp-consultation-success"[^>]*role="status"[^>]*hidden/);
assert.ok(page.includes('?consultation=sent#consultation'));
for (const name of ['utm_source','utm_medium','utm_campaign','utm_term','utm_content','gclid','gbraid','wbraid','landing_page','referrer']) {
  assert.ok(page.includes(`type="hidden" name="${name}"`), `missing attribution field ${name}`);
}
const graph = JSON.parse(page.match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/)[1])['@graph'];
const service = graph.find(item => item['@type'] === 'Service');
assert.deepEqual(service.areaServed, ['Columbia, South Carolina', 'Lexington, South Carolina', 'South Carolina Midlands']);
assert.ok(!JSON.stringify(graph).match(/aggregateRating|review|price|streetAddress/));
assert.ok(read('sitemap.xml').includes('https://strataworks.tech/managed-it-services/'));
for (const file of ['services/it-consulting/index.html','services/networking/index.html']) {
  assert.match(read(file), /href="\/managed-it-services\/"/);
}
const touched = [pagePath, 'managed-it-services/managed-it.css', 'managed-it-services/consultation.js', 'sitemap.xml', 'services/it-consulting/index.html', 'services/networking/index.html'];
const oldPhone = ['(803) ' + '303-6301', '+1803' + '3036301'];
for (const file of touched) for (const number of oldPhone) assert.ok(!read(file).includes(number), `stale phone in ${file}`);
assert.doesNotMatch(page, /24\/7|99\.9%|SOC 2|guaranteed savings|#1 managed|industry.leading/i);
console.log('Managed IT marketing regression checks passed.');
