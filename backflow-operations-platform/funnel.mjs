import { checkoutDestination, validateSetup } from './funnel-model.mjs';

const config = await fetch(new URL('./funnel-config.json', import.meta.url), { cache: 'no-store' })
  .then(response => response.ok ? response.json() : {}).catch(() => ({}));
const destination = checkoutDestination(config);
if (destination) {
  document.querySelectorAll('[data-subscribe]').forEach(button => {
    button.href = destination;
    button.hidden = false;
  });
  document.querySelectorAll('[data-checkout-pending]').forEach(element => { element.hidden = true; });
}

document.querySelectorAll('[data-chapter]').forEach(button => button.addEventListener('click', () => {
  const video = document.querySelector('#product-tour');
  if (!video) return;
  video.currentTime = Number(button.dataset.chapter);
  video.play().catch(() => { video.focus(); });
}));

const form = document.querySelector('#setup-form');
if (form) {
  const status = document.querySelector('#setup-status');
  const submit = form.querySelector('[type="submit"]');
  form.addEventListener('submit', async event => {
    event.preventDefault();
    if (form.elements._honey.value) return;
    const result = validateSetup(Object.fromEntries(new FormData(form)));
    form.querySelectorAll('[data-field-error]').forEach(element => { element.textContent = ''; });
    form.querySelectorAll('[aria-invalid]').forEach(element => element.removeAttribute('aria-invalid'));
    if (Object.keys(result.errors).length) {
      for (const [name, message] of Object.entries(result.errors)) {
        form.elements[name].setAttribute('aria-invalid', 'true');
        form.querySelector('[data-field-error="' + name + '"]').textContent = message;
      }
      form.elements[Object.keys(result.errors)[0]].focus();
      return;
    }
    submit.disabled = true;
    submit.textContent = 'Sending setup details…';
    status.hidden = false;
    status.textContent = 'Sending your details. Please keep this page open.';
    try {
      const response = await fetch('https://formsubmit.co/ajax/james@strataworks.tech', {
        method: 'POST', signal: AbortSignal.timeout(20000), headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({ ...result.values, _subject: 'Backflow subscription setup details', _template: 'table', _captcha: 'false', package: '$300/month · up to five staff logins · base rate guaranteed for 60 months while subscription stays active' }),
      });
      const body = await response.json();
      if (!response.ok || !(body.success === true || body.success === 'true')) throw new Error('Request not accepted');
      status.textContent = 'Your setup details have been received. We’ll match them to your subscription and follow up by email. Standard setup is ready within three business days after payment and completed setup details.';
      submit.textContent = 'Setup details sent';
      status.focus();
    } catch {
      status.textContent = 'Your details could not be sent. Your entries are still here. Try again, or email james@strataworks.tech.';
      submit.disabled = false;
      submit.textContent = 'Send setup details';
      status.focus();
    }
  });
}
