import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { runInNewContext } from 'node:vm';

const source = readFileSync('managed-it-services/consultation.js', 'utf8');
const session = new Map();
const events = [];
function visit(search = '', options = {}) {
  const values = { name: 'Test', company: 'Test business', email: 'test@example.com', phone: '', users: '1–5', locations: '1', service: 'Microsoft 365', message: 'Help with new employees', utm_source: '', utm_medium: '', utm_campaign: '', utm_term: '', utm_content: '', gclid: '', gbraid: '', wbraid: '', referrer: '' };
  const fields = Object.fromEntries(Object.entries(values).map(([name,value]) => [name,{value}]));
  const handlers = {};
  const element = () => ({ hidden: true, textContent: '', focus() { this.focused = true; } });
  const success = element(), error = element(), status = element();
  const button = { disabled: false };
  const form = { elements: { namedItem: name => fields[name] }, dataset: {}, reportValidity: () => !options.invalid, addEventListener: (type, fn) => { handlers[type] = fn; }, querySelector: () => button, setAttribute(name,value) { this[name] = value; } };
  const requests = [], urls = [];
  runInNewContext(source, {
    URL, URLSearchParams, AbortController, setTimeout, clearTimeout,
    FormData: class { constructor() { return Object.entries(fields).map(([name,f])=>[name,f.value])[Symbol.iterator](); } },
    document: { referrer: 'https://example.com/', querySelector: selector => ({'#msp-consultation-form':form,'#msp-consultation-success':success,'#msp-consultation-error':error,'#msp-consultation-status':status})[selector] },
    window: { location: { search, href: 'https://strataworks.tech/managed-it-services/'+search } },
    history: { replaceState: (_a,_b,url) => urls.push(String(url)) },
    sessionStorage: {
      getItem: key => { if (options.storageBlocked) throw new Error('Blocked'); return session.get(key) ?? null; },
      setItem: (key,value) => { if (options.storageBlocked) throw new Error('Blocked'); session.set(key,value); },
    },
    fetch: async (url, init) => {
      requests.push({url,init});
      if (options.networkError) throw new Error('Offline');
      if (options.response) return options.response;
      return {ok:true,json:async()=>({success:'true'})};
    },
    ...(options.noTag ? {} : { gtag: (...args) => events.push(args) }),
  });
  return { fields, form, success, error, status, button, requests, urls, submit: () => handlers.submit({preventDefault(){}}) };
}

assert.equal(visit().success.hidden, true);
assert.equal(events.length, 0);
assert.equal(visit('?consultation=sent').success.hidden, true, 'URL alone cannot confirm a lead');
assert.equal(events.length, 0, 'success URL alone must not convert');
const invalid = visit('', {invalid:true});
await invalid.submit();
assert.equal(invalid.requests.length, 0);
assert.equal(events.length, 0);
for (const options of [{networkError:true},{response:{ok:false,json:async()=>({success:'true'})}},{response:{ok:true,json:async()=>({success:'false'})}},{response:{ok:true,json:async()=>{throw new Error('Not JSON');}}}]) {
  const failed = visit('',options); await failed.submit();
  assert.equal(failed.error.hidden,false);
  assert.equal(failed.success.hidden,true);
  assert.equal(failed.button.disabled,false);
  assert.equal(failed.fields.company.value,'Test business');
  assert.equal(events.length,0,'failed request must not convert');
}
let resolveResponse;
const pendingResponse = new Promise(resolve => { resolveResponse = resolve; });
const lead = visit('?utm_source=google&utm_medium=cpc&utm_campaign=msp&utm_term=it&utm_content=ad&gclid=click&gbraid=gb&wbraid=wb', {response:pendingResponse});
const submitting = lead.submit();
await lead.submit();
assert.equal(lead.requests.length,1,'ignore duplicate attempts while pending');
assert.equal(events.length,0,'pending request must not convert');
assert.equal(lead.button.disabled,true);
resolveResponse({ok:true,json:async()=>({success:'true'})});
await submitting;
assert.equal(lead.success.hidden,false);
assert.equal(lead.form.dataset.state,'sent');
assert.equal(events.length,1);
assert.equal(JSON.stringify(events[0]),JSON.stringify(['event','ads_conversion_Submit_lead_form_1',{}]));
assert.equal(lead.requests[0].url,'https://formsubmit.co/ajax/james@strataworks.tech');
const payload=JSON.parse(lead.requests[0].init.body);
for(const [key,value] of Object.entries({users:'1–5',locations:'1',utm_source:'google',utm_medium:'cpc',utm_campaign:'msp',utm_term:'it',utm_content:'ad',gclid:'click',gbraid:'gb',wbraid:'wb',referrer:'https://example.com/'})) assert.equal(payload[key],value,key);
assert.ok(lead.urls[0].includes('consultation=sent'));
assert.ok(lead.urls[0].endsWith('#consultation'));
await lead.submit();
assert.equal(lead.requests.length,1,'confirmed form must not resubmit');
const refresh = visit('?consultation=sent');
assert.equal(refresh.success.hidden,false);
assert.equal(events.length,1,'refresh must not convert again');
assert.equal(visit().success.hidden,true);
session.clear();
const noTag = visit('',{noTag:true});await noTag.submit();assert.equal(noTag.success.hidden,false);
session.clear();
const blocked = visit('',{storageBlocked:true});await blocked.submit();assert.equal(blocked.success.hidden,false);
assert.equal(events.length,1,'blocked storage does not break success or create duplicate tracking');
console.log('Managed IT conversion and submission checks passed.');
