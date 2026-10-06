# Backflow self-guided sales launch

Implements the website portion of [growth plan PR #3](https://github.com/jamesshealy109-sudo/Strataworks/pull/3). The customer can watch the workflow, subscribe, and submit company details. Standard workspace preparation remains manual.

## Offer and customer journey

- $300/month base subscription, up to five staff logins. Applicable tax is calculated by Stripe.
- Owner-approved offer: the $300 monthly base rate is guaranteed for 60 months from signup only while the subscription stays continuously active. Cancellation ends the guarantee. Separately scoped services and applicable tax are outside the base rate.
- Public copy says "Limited spots remaining at this rate." Confirm availability before publication and remove that line or close enrollment when the allocation is filled. Do not invent a remaining count.
- Owner expects to raise the monthly base rate to $399.99 after the introductory allocation fills. The crossed-out $399.99 on the pricing card is explicitly labeled a planned future rate, not currently charged or a former price. Review this claim if the price plan changes.
- The pricing card crosses out two published Syncta Per Tester examples for five testers beside StrataWorks' $300 monthly offer: $99 × five = $495/month equivalent when billed annually, and $125 × five = $625/month when billed monthly. Syncta also has per-test and unlimited plans; billing and features differ. Source: https://help.syncta.com/en/articles/379405-general-billing-information (checked October 6, 2026; article dated December 5, 2023). Recheck competitor prices before publishing or extending the comparison.
- First monthly payment is collected at checkout. Standard setup is ready within three business days after payment and completed setup details.
- Custom imports, new municipality forms, and optional provider services are scoped separately before work starts.
- Customer journey: Backflow page -> Stripe -> company setup form -> operator verifies payment and fit -> workspace and access email.
- Supported forms vary by jurisdiction. Customers with unusual requirements should confirm fit before subscribing.
- The optional personal walkthrough is still available.

## Checkout connection

Public Payment Link: https://buy.stripe.com/8x2dR86jW3fYdrMg8g14400

The public checkout was inspected on October 5, 2026: merchant Strataworks, product Backflow Operations Platform, $300.00 billed monthly, applicable tax calculated by Stripe. No payment was submitted.

`backflow-operations-platform/funnel-config.json` enables this link. The browser accepts only an enabled HTTPS buy.stripe.com destination and otherwise shows the contact fallback. Secret Stripe keys never belong in this repository.

### Before launch

1. Edit this Payment Link in Stripe. Under **After the payment**, select a redirect to:
   https://strataworks.tech/backflow-operations-platform/setup/
2. Enable successful-payment notifications and customer receipts for the operating account. Confirm the business's actual cancellation, refund, and billing policy before adding corresponding promises to this page.
   Ensure the owner can honor the 60-month base-rate guarantee and record its start and end dates for every qualifying subscription. Check that checkout and the customer agreement do not contradict the website's five-seat and rate-guarantee terms.
3. The production-domain FormSubmit setup endpoint was tested on October 6, 2026: the service accepted a labeled test, and Outlook confirmed delivery to james@strataworks.tech. Local previews require separate origin activation. After publication, verify the browser form on the public setup page as well.
4. Review the narration and visuals of the reused demo footage before publishing.
5. Publish the feature after approval, then check the checkout link and setup page on the public domain.

Stripe Dashboard requires owner sign-in, so the completion redirect is still unverified. Checkout opens in a new tab and the pricing card gives an explicit link to send setup details after payment; the sales page stays available as a fallback. No live purchase was submitted. A browser redirect is never evidence that the customer paid.

[Stripe: post-payment configuration, notifications and receipts](https://docs.stripe.com/payment-links/post-payment)

## Manual onboarding

1. Monitor Stripe and the setup mailbox each business day. Record the paid subscription and matching company request in a private onboarding ledger.
2. Match the checkout email to the setup request. Confirm the correct product, monthly amount, successful payment, and active subscription in Stripe before giving access. Delayed payment methods must settle first.
3. Record Stripe customer/subscription IDs privately, the rate-guarantee start and end dates, continuous subscription status, the time complete details and payment are both available, and the three-business-day deadline. Never place this ledger in the public website repo.
4. Confirm municipality/form coverage, staff email addresses (maximum five), and any separately scoped import work.
5. Prepare an isolated customer environment with its own credentials and provider configuration. Enforce the five-login entitlement; the website validator is assistance, not backend enforcement.
6. Verify the customer workspace, then email access instructions and tutorial links. Keep credentials out of the website form and public repo.
7. Track billing or provisioning exceptions explicitly and communicate with the customer before the promised deadline.

The setup form has required fields, a honeypot, staff-email validation, a 20-second send timeout, duplicate-submit protection, and an email fallback. Failed sends retain the customer's entries. Native HTML submission redirects to a static receipt page, which also works without JavaScript. A setup receipt does not confirm payment or grant access.

## Media maintenance

The public media package uses fictional data from the existing 2026-10-04-v1 narrated tutorial exports. It contains a 2.5-minute product tour plus full field-test, report-review, and invoice/payment workflows, captions, transcripts, and posters.

Rebuild with:
```powershell
python scripts/build-backflow-sales-media.py --source PATH_TO_NARRATED_EXPORT --ffmpeg PATH_TO_FFMPEG
```

The builder does not record against a live customer environment. The manifest records source release, chapter timestamps, durations and SHA-256 hashes. For later recording updates, use the existing disposable demo-video workflow and review substantive changes before replacing public media.

## Verification and rollback

`node --test` runs the existing marketing checks plus checkout destination and setup-validation tests. Preview the static repo locally and check desktop/mobile layouts and setup errors.

To pause new website signup, set `checkoutEnabled` to false and deploy that change. Disable the Payment Link separately in Stripe if its shared URL must also stop taking orders. Existing customer billing is managed separately.

## Next phase

Use verified Stripe webhook signatures, durable event storage, idempotent subscription reconciliation and a provisioning queue to automate customer environments. Retain this public checkout and setup journey while replacing the operator steps. Automatic deployment, secret rotation, support ticketing and monthly tutorial refresh are future phases.
