// Page-scoped attribution, confirmation, and Managed IT lead conversion.
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
    // Count the success return once per tab session, including refreshes.
    try {
      const conversionKey = 'strataworks:msp-consultation:conversion-sent';
      if (typeof gtag === 'function' && !sessionStorage.getItem(conversionKey)) {
        sessionStorage.setItem(conversionKey, '1');
        gtag('event', 'ads_conversion_Submit_lead_form_1', {});
      }
    } catch {
      // Keep the form usable; skip tracking when storage is unavailable.
    }
  }
}
