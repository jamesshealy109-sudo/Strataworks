import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { runInNewContext } from 'node:vm';

const source = readFileSync('managed-it-services/consultation.js', 'utf8');
const session = new Map();
const events = [];
function visit(search, options = {}) {
  const fields = Object.fromEntries(['utm_source','utm_medium','utm_campaign','utm_term','utm_content','gclid','gbraid','wbraid','referrer'].map(name => [name, { value: '' }]));
  const form = { elements: { namedItem: name => fields[name] }, dataset: {} };
  const success = { hidden: true };
  runInNewContext(source, {
    URLSearchParams,
    document: { referrer: 'https://example.com/', querySelector: selector => selector === '#msp-consultation-form' ? form : success },
    window: { location: { search } },
    sessionStorage: {
      getItem: key => { if (options.storageBlocked) throw new Error('Storage blocked'); return session.get(key) ?? null; },
      setItem: (key, value) => { if (options.storageBlocked) throw new Error('Storage blocked'); session.set(key, value); },
    },
    ...(options.noTag ? {} : { gtag: (...args) => events.push(args) }),
  });
  return { fields, form, success };
}

assert.equal(visit('').success.hidden, true);
assert.equal(events.length, 0, 'normal visit must not convert');
assert.equal(visit('?consultation=pending').success.hidden, true);
assert.equal(events.length, 0);
const sent = visit('?consultation=sent&utm_source=google&utm_medium=cpc&utm_campaign=msp&utm_term=it&utm_content=ad&gclid=click&gbraid=gb&wbraid=wb');
assert.equal(sent.success.hidden, false);
assert.equal(sent.form.dataset.state, 'sent');
assert.equal(events.length, 1, 'successful return must convert');
assert.equal(JSON.stringify(events[0]), JSON.stringify(['event', 'ads_conversion_Submit_lead_form_1', {}]));
for (const [key, value] of Object.entries({utm_source:'google',utm_medium:'cpc',utm_campaign:'msp',utm_term:'it',utm_content:'ad',gclid:'click',gbraid:'gb',wbraid:'wb',referrer:'https://example.com/'})) assert.equal(sent.fields[key].value, value);
visit('?consultation=sent');
visit('');
visit('?consultation=sent');
assert.equal(events.length, 1, 'same session must not repeat the conversion');
session.clear();
assert.equal(visit('?consultation=sent', { noTag: true }).success.hidden, false);
assert.equal(events.length, 1);
visit('?consultation=sent');
assert.equal(events.length, 2, 'a fresh session can convert');
session.clear();
assert.equal(visit('?consultation=sent', { storageBlocked: true }).success.hidden, false);
assert.equal(events.length, 2, 'skip tracking if refresh deduplication cannot be stored');
console.log('Managed IT conversion checks passed.');
