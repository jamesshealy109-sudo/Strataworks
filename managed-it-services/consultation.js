// Page-scoped attribution and confirmation hooks; no analytics events are sent.
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
  if (consultationSuccess && consultationQuery.get('consultation') === 'sent') {
    consultationSuccess.hidden = false;
    consultationForm.dataset.state = 'sent';
  }
}
