# Backflow Operations Platform Marketing + SEO Landing Page Design

Date: 2026-09-09
Status: Awaiting user review
Repository: `jamesshealy109-sudo/Strataworks`

## Goal

Add a prominent homepage promotion for the StrataWorks Backflow Operations Platform and create a dedicated, indexable landing page that can rank for commercial-intent backflow software searches and convert qualified prospects into demo requests.

The platform is national in capability. Marketing should emphasize South Carolina, North Carolina, and Georgia as the strongest regional focus while making it clear the product is available nationwide.

Primary conversion: **Request a Demo**
Demo recipient: **james@strataworks.tech**

## Scope

This work includes:

1. A new homepage Featured Platform promotion using the large blank space in the current Capabilities section.
2. A dedicated SEO landing page at `/backflow-operations-platform/`.
3. A lightweight email-based demo request form that sends to `james@strataworks.tech`.
4. Sitemap and internal-link updates so the page can be discovered and indexed.
5. Search-focused metadata, structured content, and FAQ coverage.
6. Campaign-ready hooks that will make future Google Ads work easier without adding Google Ads tracking yet.

This work does **not** include:

- pricing publication
- self-service trial/signup
- CRM integration
- Google Ads campaign creation
- Google Ads conversion scripts
- GA4 changes beyond preserving any existing analytics behavior
- changes to the private Backflow Operations Platform application itself

## Product Positioning

Position the product as:

> Backflow testing and operations software built around the actual workflow of a backflow business.

The page should distinguish the platform from generic field-service software by focusing on backflow-specific operations:

- customers and service locations
- assemblies/devices
- recurring test history
- technician workflows
- scheduling and route planning
- field testing
- invoices and payment workflows
- municipality submission queues
- generated forms and reporting
- search across operational records
- office and technician roles
- auditability and operational controls

Avoid unsupported claims, invented customer counts, invented savings percentages, fake testimonials, or claims that every municipality nationwide is automated.

Municipality-specific automation should be described accurately: the platform supports municipality form and submission workflows where the required mappings/integrations are configured.

## Geographic Positioning

Primary statement:

> Built for backflow testing companies nationwide, with a strong focus on South Carolina, North Carolina, and Georgia.

SC, NC, and GA should receive stronger on-page relevance than other states, but the site must not imply the platform is limited to those states.

Do not create thin doorway pages for individual states as part of this work.

## SEO Strategy

Primary commercial-intent topic:

- backflow testing software

Secondary topics and phrase families:

- backflow management software
- backflow testing business software
- backflow compliance software
- backflow tester software
- backflow test reporting software
- backflow scheduling software
- backflow routing software
- backflow test forms software
- backflow business management software

The page should read naturally and prioritize usefulness over keyword repetition.

### Proposed metadata

Title direction:

`Backflow Testing Software & Operations Platform | StrataWorks`

Meta description direction:

`Run customers, assemblies, testing, routing, invoices, reporting, and compliance workflows in one backflow operations platform. Built nationwide with a strong SC, NC, and GA focus.`

Canonical:

`https://strataworks.tech/backflow-operations-platform/`

Add the URL to `sitemap.xml`.

### Structured data

Use appropriate JSON-LD for a software/product-style offering without fabricating ratings, pricing, reviews, or availability claims that cannot be verified.

FAQ structured data may be included only if the visible FAQ content matches it exactly and current search-engine guidance still supports using it.

## Homepage Featured Platform Block

Use the large empty left-side area in the current Capabilities intro rather than adding another standard bento service card.

The visual should feel intentionally different from a consulting-service tile and clearly communicate that StrataWorks has built a product.

Suggested content:

Eyebrow:

`FEATURED PLATFORM / BACKFLOW OPERATIONS`

Headline direction:

`Run the backflow business from one system.`

Supporting copy direction:

`Customers, assemblies, testing, routes, invoices, reporting, and compliance workflows—built around the way backflow companies actually work.`

Primary CTA:

`Request a Demo →`

Secondary link:

`Explore the platform →`

Both should lead to the dedicated landing page, with the primary CTA optionally deep-linking to the demo form section.

### Visual treatment

Recommended layout:

- preserve the existing industrial/technical StrataWorks visual language
- use a real Backflow Operations Platform screenshot or carefully cropped UI composite
- no generic SaaS illustration
- no AI-generated employee imagery
- use the current blue/technical accent system
- enough contrast that the ad reads immediately against the cream section background
- desktop composition should use the blank left-side space without disturbing the oversized `ONE PARTNER. EVERY LAYER.` statement on the right
- mobile should stack cleanly and avoid oversized blank gaps

## Landing Page Structure

### 1. Hero

Primary H1 direction:

`Backflow Testing Software Built for the Work.`

Subhead should explain that the system connects customer records, assemblies, testing, scheduling, routing, invoices, reporting, and compliance operations.

Primary CTA: `Request a Demo`

Secondary CTA: `See What It Handles`

Include national availability plus SC / NC / GA focus near the hero without overpowering the main product message.

### 2. Problem / Before the Platform

Frame the operational pain clearly:

- spreadsheets and duplicate entry
- disconnected scheduling
- paper/PDF test forms
- scattered customer and assembly history
- manual routing
- invoice follow-up gaps
- municipality submission tracking
- office/field disconnect

Do not attack named competitors in the headline or imply that every competitor has these failures.

### 3. Platform Workflow

Show the end-to-end flow with product-specific language:

1. Customer + location
2. Assembly/device
3. Schedule + route
4. Test
5. Repair/retest when needed
6. Report/form
7. Invoice/payment
8. Submission + record retention

Use actual platform screenshots where possible.

### 4. Core Capabilities

Organize around real workflows rather than generic feature cards.

Recommended groups:

- Customer & assembly records
- Testing & field workflow
- Scheduling & routing
- Municipality forms & submission workflow
- Invoicing & receivables
- Search & office operations
- Roles, controls & auditability

### 5. Built for Real Backflow Operations

Audience examples:

- owner-operators
- residential testing companies
- commercial testing companies
- multi-technician teams
- office + field teams
- recurring testing operations

Avoid claims about company size limits unless verified from licensing rules and product configuration.

### 6. SC / NC / GA Regional Focus

Headline direction:

`National platform. Southeast-first experience.`

Explain:

- the software can support backflow businesses nationwide
- StrataWorks is especially focused on SC, NC, and GA
- local form/municipality workflows can be configured based on jurisdiction requirements

Do not imply universal municipality form coverage.

### 7. FAQ

Recommended visible questions:

- What is backflow testing software?
- Can this replace spreadsheets and generic field-service tools?
- Does the platform handle backflow test forms?
- Can technicians use it in the field?
- Does it handle scheduling and route planning?
- Can it handle invoices and payments?
- Does it support municipality submission workflows?
- Is the Backflow Operations Platform available outside South Carolina?
- Can data be imported from another system?

For import wording, use only verified capabilities. The current platform supports a Jobber customer CSV import workflow; do not imply universal automated migration from every competitor.

### 8. Demo Form

Primary form destination: `james@strataworks.tech`

Recommended fields:

- Name — required
- Company — required
- Work email — required
- Phone — optional
- State — required
- Approximate backflow tests per month — selectable range
- Current system/process — optional short field/select
- What are you trying to improve? — required textarea

Submit button:

`Request a Demo`

Success state:

A simple in-page confirmation indicating that the request was received and James will follow up by email.

No mailing-list opt-in by default.

## Email Handling

Use the site's current lightweight form approach unless implementation review shows a reliability/security reason to change it.

The generated email should clearly identify:

- source page: Backflow Operations Platform
- prospect name/company/email/state
- test-volume range
- current system/process
- notes

The workflow should remain email-first and require no CRM.

## Future Google Ads / MSP Readiness

The user plans to advertise StrataWorks MSP-side services on Google later. This implementation should not start that campaign, but it should avoid choices that make later PPC work harder.

### Design for future campaign attribution

- preserve query parameters when a visitor lands on the page and submits the form where practical
- structure forms so UTM/source fields can be added without redesigning the form
- provide a distinct success state or destination that can later become a Google Ads conversion event
- use stable CTA labels and semantic form markup
- avoid putting important conversion actions behind JavaScript-only navigation

### Site architecture consideration

The Backflow Operations Platform remains a dedicated product page at `/backflow-operations-platform/`.

Future MSP/IT Google Ads landing pages should likely live under focused service routes such as existing `/services/it-consulting/`, `/services/networking/`, `/services/business-phone-systems/`, etc., or dedicated campaign variants if later justified.

Do not mix MSP paid-search messaging into the Backflow product page merely because both are StrataWorks offerings.

## Internal Linking

Add relevant links to the platform page from:

- homepage Featured Platform block
- AI & automation page where contextually appropriate
- web/digital systems or IT consulting only if the wording is natural and useful

Do not add sitewide spammy keyword links.

The landing page should link back to relevant StrataWorks consulting capabilities only where they help establish who builds/supports the platform.

## Accessibility

- semantic headings
- visible keyboard focus
- descriptive alt text for meaningful product screenshots
- decorative UI imagery marked appropriately
- high-contrast CTA treatment
- form labels remain visible
- errors and success messages should be announced accessibly
- responsive behavior must work on mobile, tablet, and desktop

## Performance

Product screenshots should be compressed and sized appropriately.

Do not ship giant raw screenshots or video backgrounds in the homepage promotional area.

Avoid adding heavy JavaScript libraries solely for animation.

## Search / Crawl Requirements

- indexable production page
- unique title and description
- canonical to the production StrataWorks URL
- sitemap entry
- internal links from existing indexed pages
- one clear H1
- descriptive headings that match buyer intent
- no keyword stuffing
- no hidden SEO text
- no generated thin state pages

## Verification Requirements

Before implementation is considered complete:

1. Verify the homepage promotional block does not break the current desktop composition.
2. Verify mobile layout has no oversized empty space or horizontal overflow.
3. Verify `/backflow-operations-platform/` loads directly and from internal links.
4. Verify form submission is addressed to `james@strataworks.tech`.
5. Verify the new phone number remains `(803) 386-7728` everywhere touched.
6. Verify canonical/meta/structured data on the new page.
7. Verify sitemap contains the new landing page.
8. Verify all primary CTAs reach the platform page or demo form correctly.
9. Verify screenshots and assets load on GitHub Pages/custom-domain deployment paths.
10. Check the page visually at common desktop, tablet, and mobile widths.
11. Search the final page for unsupported claims, invented numbers, universal municipality coverage claims, fake testimonials, or unverified competitor claims.

## Content Guardrails

Use only real platform capabilities supported by the Backflow Operations Platform repository.

Do not publish:

- fake client logos
- invented customer counts
- invented ROI percentages
- invented uptime claims
- invented security certifications
- invented state/municipality coverage counts
- universal form-automation claims
- pricing unless separately approved

## Success Criteria

The work succeeds when:

- the previously unused homepage space actively promotes the Backflow Operations Platform without making the page feel crowded
- visitors immediately understand that StrataWorks offers purpose-built backflow testing software
- the landing page has a credible chance to rank for commercial-intent backflow software searches
- SC, NC, and GA receive strong relevance while national availability remains clear
- the primary path is a low-friction `Request a Demo` form to `james@strataworks.tech`
- the implementation remains consistent with the current StrataWorks visual identity
- the site is structurally ready for future paid-search attribution work without prematurely adding Google Ads campaign code
