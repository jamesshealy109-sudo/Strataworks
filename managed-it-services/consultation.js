// Page-scoped attribution, confirmed FormSubmit requests, and lead conversion.
const consultationForm = document.querySelector('#msp-consultation-form');
if (consultationForm) {
  const consultationQuery = new URLSearchParams(window.location.search);
  const campaignFields = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_term', 'utm_content', 'gclid', 'gbraid', 'wbraid'];
  campaignFields.forEach((name) => {
    const input = consultationForm.elements.namedItem(name);
    if (input) input.value = consultationQuery.get(name) || '';
  });
  consultationForm.elements.namedItem('referrer').value = document.referrer;
  const consultationSuccess = document.querySelector('#msp-consultation-success');
  const consultationError = document.querySelector('#msp-consultation-error');
  const consultationStatus = document.querySelector('#msp-consultation-status');
  const submitButton = consultationForm.querySelector('button[type="submit"]');
  const receiptKey = 'strataworks:msp-consultation:confirmed';
  let pending = false;
  let confirmed = false;

  const showSuccess = () => {
    confirmed = true;
    consultationSuccess.hidden = false;
    consultationError.hidden = true;
    consultationForm.dataset.state = 'sent';
    submitButton.disabled = true;
    submitButton.textContent = 'Request received';
  };

  // The URL is a return location, not evidence of a new submission.
  try {
    if (consultationQuery.get('consultation') === 'sent' && sessionStorage.getItem(receiptKey) === '1') showSuccess();
  } catch {
    // Storage restrictions must not prevent someone from contacting us.
  }

  const trackManagedITLead = () => {
    try {
      const conversionKey = 'strataworks:msp-consultation:conversion-sent';
      if (typeof gtag === 'function' && !sessionStorage.getItem(conversionKey)) {
        sessionStorage.setItem(conversionKey, '1');
        // Existing Google-supplied event; no additional conversion label needed.
        gtag('event', 'ads_conversion_Submit_lead_form_1', {});
      }
    } catch {
      // Skip tracking when refresh deduplication cannot be stored.
    }
  };

  consultationForm.addEventListener('submit', async (event) => {
    event.preventDefault();
    if (pending || confirmed || !consultationForm.reportValidity()) return;
    pending = true;
    submitButton.disabled = true;
    consultationForm.setAttribute('aria-busy', 'true');
    consultationError.hidden = true;
    consultationStatus.textContent = 'Sending your request…';
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 20000);
    try {
      const response = await fetch('https://formsubmit.co/ajax/james@strataworks.tech', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify(Object.fromEntries(new FormData(consultationForm))),
        signal: controller.signal,
      });
      if (!response.ok) throw new Error('Request rejected');
      const result = await response.json();
      if (result.success !== true && result.success !== 'true') throw new Error('Request not confirmed');
    } catch {
      consultationError.hidden = false;
      consultationForm.dataset.state = 'error';
      consultationError.focus();
      return;
    } finally {
      clearTimeout(timeout);
      pending = false;
      submitButton.disabled = false;
      consultationForm.setAttribute('aria-busy', 'false');
      consultationStatus.textContent = '';
    }

    // Only a positive backend response reaches this point.
    showSuccess();
    try { sessionStorage.setItem(receiptKey, '1'); } catch { /* Confirmation still works without storage. */ }
    trackManagedITLead();
    const successUrl = new URL(window.location.href);
    successUrl.searchParams.set('consultation', 'sent');
    successUrl.hash = 'consultation';
    history.replaceState(null, '', successUrl);
    consultationSuccess.focus();
  });
}
