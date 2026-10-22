# Backflow website sales funnel plan

Prepared: October 5, 2026  
Status: Planning proposal for review. This document does not change the live website.

## Launch offer

**$300 per month, including up to three staff logins.**

Audience: established backflow businesses with recurring test volume and an office/field workflow. Validate price with the next 5–10 qualified conversations. Do not promise savings without measuring the customer's process.

Pricing context: [Jobber Grow](https://www.getjobber.com/pricing/) lists $299/month without commitment for five users; other commitments differ. [Syncta's official plans guide](https://help.syncta.com/en/articles/2842141-syncta-s-plans) is dated August 26, 2024 and lists annual-billing monthly equivalents of $99 per tester and $549 for unlimited testers. These comparisons are directional, not equivalent packages.

## Existing source

The Backflow landing page is `backflow-operations-platform/index.html`, with styles in `backflow-operations-platform/platform.css`. Its current primary conversion is a demo request. It correctly scopes municipality forms/submissions to configured jurisdictions and describes the verified Jobber customer CSV import.

## Proposed funnel

1. Focus the page on one complete workflow: customer/assembly record → scheduled test → result and supported report → invoice and history.
2. Present the $300 three-login offer once service and billing terms are finalized.
3. Provide a short product tour and tutorials that match the released app.
4. Keep a low-friction demo request with business, jurisdiction, approximate test volume, and current-system context.
5. Add a purchase link to hosted subscription Checkout only after the subscription/provisioning pilot is ready.
6. Show setup progress and an invitation through the application/control service after verified payment and successful provisioning.
7. Track qualified requests, tour engagement, completed demos, checkout completion, paying customers, and activated accounts with appropriately scoped analytics.

The subscription service, application secrets, infrastructure credentials, and signed webhook processing must run server-side. Do not place secrets or provisioning logic in this static website.

## Draft customer copy

**Keep your backflow jobs moving—from the next due test through the report and invoice.**

StrataWorks Backflow Operations connects customer and assembly records, scheduling, testing history, supported reports, and invoicing for your office and field staff.

**$300 per month, including up to three staff logins.**

See the workflow with a job similar to the ones your business handles. We will review your municipality requirements and current data before planning your setup.

**Current call to action: Request a demo.**

## Terms required before publication

Define included onboarding and import assistance, support channel/hours/response expectations, additional staff pricing, separate charges, cancellation, retention, and export access. Do not promise unlimited custom imports, universal municipality submission, live QuickBooks synchronization, or 24/7 support without verified scope.

## Implementation sequence and acceptance

### First change: offer and demo path

After commercial scope is approved, update the existing Backflow page and styles in a scoped PR. Preserve actual capability claims and improve clarity without expanding to unsupported features.

Acceptance: pricing and three-logins scope are visible; the form submits and acknowledges success; required fields and error recovery are usable on mobile; the page does not advertise an unavailable purchase flow.

### Second change: tour and proof

Link the released tour/tutorial assets after media review. Use testimonials only with permission and attribute measured results accurately.

Acceptance: media links work, captions are available, and instructions match the deployed app.

### Third change: subscription checkout

Coordinate with the private Backflow/control-service implementation. Add the hosted checkout link only after signed webhook, durable provisioning, account isolation, billing portal, and failure-recovery checks pass in test mode.

Acceptance: customers can purchase and reach a ready application; failed or canceled checkout has a clear recovery path; returning from checkout alone cannot create access.

## Sales operations connection

Weekly public-list research and daily qualified drafts feed one reconciled private contact ledger. Check prior contacts, replies, declines, delivery failures, and opt-outs before sending. Prepare up to ten qualified drafts per day; sending needs explicit authorization. Keep mailbox evidence, customer names, direct contact records, and suppression data outside this public repository.

## Cross-repository coordination

The detailed onboarding, billing, support, provisioning, and tutorial policy is proposed in the private `jamesshealy109-sudo/backflow-operations-platform` repository at `docs/plans/2026-10-05-growth-and-automation.md`. Both plans use the same $300/month and three staff logins.

## Approval and release

Review the commercial scope and implementation specifications before the checkout work. Branch/PR preparation is the current deliverable. Website publication and live subscription activation are separate release actions.
