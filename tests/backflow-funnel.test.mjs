import assert from 'node:assert/strict';
import test from 'node:test';
import { existsSync } from 'node:fs';
const modulePath = '../backflow-operations-platform/funnel-model.mjs';
const missing = {
  checkoutDestination: () => null,
  validateSetup: () => ({ errors: {}, values: {} }),
};
const { checkoutDestination, validateSetup } = existsSync(new URL(modulePath, import.meta.url))
  ? await import(modulePath) : missing;

test('a configured hosted link becomes the purchase destination', () => {
  assert.equal(checkoutDestination({ checkoutEnabled: true, checkoutUrl: 'https://buy.stripe.com/AbC123' }), 'https://buy.stripe.com/AbC123');
});
test('checkout cannot open an unconfigured, disabled, fake, or test destination', () => {
  for (const config of [
    {}, { checkoutEnabled: false, checkoutUrl: 'https://buy.stripe.com/AbC123' },
    { checkoutEnabled: true, checkoutUrl: 'https://buy.stripe.com.evil.test/AbC123' },
    { checkoutEnabled: true, checkoutUrl: 'http://buy.stripe.com/AbC123' },
    { checkoutEnabled: true, checkoutUrl: 'https://buy.stripe.com/test_AbC123' },
    { checkoutEnabled: true, checkoutUrl: 'https://user:secret@buy.stripe.com/AbC123' },
  ]) assert.equal(checkoutDestination(config), null);
});
test('setup requires contact and jurisdiction context before sending', () => {
  assert.deepEqual(Object.keys(validateSetup({}).errors).sort(), ['company', 'email', 'municipalities', 'name']);
});
test('setup accepts at most three unique staff email addresses', () => {
  const base = { name: 'Owner', company: 'Example Testing', email: 'owner@example.test', municipalities: 'Example water district' };
  assert.ok(validateSetup({ ...base, staff_emails: 'a@example.test,b@example.test,c@example.test,d@example.test' }).errors.staff_emails);
  const valid = validateSetup({ ...base, staff_emails: ' A@example.test\nB@example.test\na@example.test ' });
  assert.deepEqual(valid.errors, {});
  assert.equal(valid.values.staff_emails, 'a@example.test\nb@example.test');
});
test('invalid staff or buyer addresses cannot enter the setup request', () => {
  const result = validateSetup({ name: 'Owner', company: 'Example', email: 'bad', municipalities: 'Example', staff_emails: 'valid@example.test,not-an-email' });
  assert.ok(result.errors.email);
  assert.ok(result.errors.staff_emails);
});
