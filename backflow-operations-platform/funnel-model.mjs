const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
export function checkoutDestination(config = {}) {
  if (config.checkoutEnabled !== true || typeof config.checkoutUrl !== 'string') return null;
  try {
    const url = new URL(config.checkoutUrl);
    if (url.protocol !== 'https:' || url.hostname !== 'buy.stripe.com' || url.port || url.username || url.password || !/^\/[A-Za-z0-9]+$/.test(url.pathname) || url.pathname.startsWith('/test_')) return null;
    return url.href;
  } catch { return null; }
}
export function validateSetup(input = {}) {
  const values = {};
  const errors = {};
  for (const key of ['name', 'company', 'email', 'municipalities', 'phone', 'current_system', 'notes', 'staff_emails']) values[key] = String(input[key] ?? '').trim();
  for (const key of ['name', 'company', 'email', 'municipalities']) if (!values[key]) errors[key] = 'Please complete this field.';
  values.email = values.email.toLowerCase();
  if (values.email && !emailPattern.test(values.email)) errors.email = 'Enter a valid email address.';
  const staff = [...new Set(values.staff_emails.split(/[\s,;]+/).filter(Boolean).map(address => address.toLowerCase()))];
  if (staff.length > 5) errors.staff_emails = 'The plan includes up to five staff logins. Enter no more than five email addresses.';
  else if (staff.some(address => !emailPattern.test(address))) errors.staff_emails = 'Enter valid staff email addresses, separated by commas or new lines.';
  values.staff_emails = staff.join('\n');
  return { errors, values };
}
