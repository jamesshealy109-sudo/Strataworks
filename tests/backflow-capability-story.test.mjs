import assert from 'node:assert/strict';
import { existsSync, readFileSync } from 'node:fs';

const page = readFileSync('backflow-operations-platform/index.html', 'utf8');
const home = readFileSync('index.html', 'utf8');

const description = page.match(/<meta name="description" content="([^"]+)"/i)?.[1] ?? '';
for (const capability of ['scheduling', 'field testing', 'reports', 'invoicing']) {
  assert.match(description, new RegExp(capability, 'i'), `search copy should explain ${capability}`);
}

const workflow = page.match(/<section\b[^>]*id="workflow"[^>]*>([\s\S]*?)<\/section>/)?.[1];
assert.ok(workflow, 'the Backflow page must show the end-to-end workflow');

const steps = [...workflow.matchAll(/<li class="workflow-step"/g)];
assert.equal(steps.length, 5, 'buyers should see the five stages of a job before pricing');
assert.ok(workflow.indexOf('Invoice the work') < workflow.indexOf('Prepare and send'), 'show billing and payment eligibility before submission');

for (const asset of workflow.matchAll(/<img\b[^>]*src="(media\/[^"]+)"[^>]*alt="([^"]+)"/g)) {
  assert.ok(existsSync(`backflow-operations-platform/${asset[1]}`), `${asset[1]} must exist`);
  assert.ok(asset[2].trim().length > 20, `${asset[1]} needs a useful description`);
}
assert.equal([...workflow.matchAll(/<img\b/g)].length, 5, 'each stage needs its own real product screen');

assert.match(page, /href="#workflow">See the full workflow/i);
assert.match(home, /href="backflow-operations-platform\/#workflow">See the workflow/i);
assert.ok(page.indexOf('id="workflow"') < page.indexOf('id="pricing"'), 'show product proof before the offer');

console.log('Backflow capability story checks passed.');
