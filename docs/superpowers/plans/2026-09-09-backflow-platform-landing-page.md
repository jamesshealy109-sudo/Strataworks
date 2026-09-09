# Backflow Operations Platform Marketing + SEO Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a homepage Featured Platform promotion and a dedicated, indexable `/backflow-operations-platform/` landing page that ranks for commercial-intent backflow software searches and converts prospects into email-based demo requests sent to `james@strataworks.tech`.

**Architecture:** Keep the existing static GitHub Pages architecture. Add one new static product page, one focused stylesheet for the product page, a small JavaScript enhancement for campaign/source preservation and success-state behavior, and targeted edits to the homepage, sitemap, and relevant service pages. Use only verified Backflow Operations Platform capabilities from `jamesshealy109-sudo/backflow-operations-platform`; do not expose private implementation details or invent unsupported product claims.

**Tech Stack:** Static HTML5, CSS, vanilla JavaScript, GitHub Pages, existing FormSubmit email workflow, JSON-LD structured data, XML sitemap, Node-based static regression tests.

**Spec:** `docs/superpowers/specs/2026-09-09-backflow-platform-landing-page-design.md`

## Global Constraints

- Primary conversion is **Request a Demo**.
- Demo submissions go to `james@strataworks.tech`.
- The platform is positioned as available nationwide, with strongest emphasis on South Carolina, North Carolina, and Georgia.
- Primary search topic is **backflow testing software**.
- Do not publish pricing.
- Do not add self-service trial/signup.
- Do not add a CRM dependency.
- Do not add Google Ads conversion code in this implementation.
- Preserve future campaign attribution by retaining UTM/source data in demo submissions where practical.
- Preserve the StrataWorks phone number `(803) 386-7728` and `tel:+18033867728` everywhere touched.
- Do not claim universal municipality form coverage.
- Do not publish fake testimonials, fake logos, invented customer counts, invented ROI, invented uptime, invented security certifications, or unsupported competitor claims.
- Do not expose private Backflow Operations Platform routes, credentials, source-code details, internal deployment paths, or operational secrets.
- Keep the existing StrataWorks industrial/technical visual language.
- Keep the Backflow product funnel separate from future MSP Google Ads work.
- Future MSP planning reference: the user-provided Google Business Profile share URL is `https://share.google/EIudw6cHEhrvtGjSN`; do not wire this into the Backflow product page during this implementation.

---

## File Map

**Create**
- `backflow-operations-platform/index.html` — dedicated SEO/product landing page.
- `backflow-operations-platform/platform.css` — product-page-specific layout and component styling.
- `tests/backflow-platform-marketing.test.mjs` — static regression checks for SEO, routing, phone number, demo email, sitemap, and unsupported claims.

**Modify**
- `index.html` — homepage Featured Platform promotion in the unused Capabilities intro space.
- `styles.css` — homepage Featured Platform styling and responsive behavior.
- `script.js` — preserve UTM/source parameters into hidden demo-form fields and expose success state when applicable.
- `sitemap.xml` — add the Backflow Operations Platform canonical URL.
- `services/ai-automation/index.html` — add one natural internal link to the platform page.
- `services/it-consulting/index.html` — add one natural internal link only if it reads as a product example rather than keyword stuffing; otherwise leave unchanged after review.

**Do not modify**
- the private `backflow-operations-platform` application repository.
- `CNAME`.
- existing F3 footer behavior.
- existing contact form destination on the general StrataWorks homepage.

---

### Task 1: Add Static Regression Coverage Before Marketing Changes

**Files:**
- Create: `tests/backflow-platform-marketing.test.mjs`

**Interfaces:**
- Consumes: current `index.html`, `sitemap.xml`, existing service-page structure.
- Produces: executable Node assertions that later tasks must satisfy.

- [ ] **Step 1: Create a failing static regression test**

Create `tests/backflow-platform-marketing.test.mjs` with Node built-ins only:

```js
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const read = (path) => readFileSync(path, 'utf8');

const home = read('index.html');
const sitemap = read('sitemap.xml');

assert.match(home, /href="backflow-operations-platform\//, 'homepage must link to platform landing page');
assert.match(home, /Backflow Operations Platform/i, 'homepage must name the platform');
assert.match(home, /Request a Demo/i, 'homepage must expose the primary platform CTA');

const platform = read('backflow-operations-platform/index.html');

assert.match(platform, /<link rel="canonical" href="https:\/\/strataworks\.tech\/backflow-operations-platform\/">/);
assert.match(platform, /<h1[^>]*>[^<]*Backflow Testing Software/i);
assert.match(platform, /james@strataworks\.tech/);
assert.match(platform, /formsubmit\.co\/james@strataworks\.tech/);
assert.match(platform, /South Carolina/i);
assert.match(platform, /North Carolina/i);
assert.match(platform, /Georgia/i);
assert.match(platform, /nationwide|national/i);
assert.match(platform, /\(803\) 386-7728/);
assert.match(platform, /tel:\+18033867728/);
assert.match(sitemap, /https:\/\/strataworks\.tech\/backflow-operations-platform\//);

const forbidden = [
  /guaranteed savings/i,
  /99\.9% uptime/i,
  /SOC 2/i,
  /all municipalities/i,
  /every municipality/i,
  /thousands of customers/i,
  /#1 backflow/i,
];

for (const pattern of forbidden) {
  assert.doesNotMatch(platform, pattern, `unsupported claim found: ${pattern}`);
}

console.log('Backflow marketing regression checks passed.');
```

- [ ] **Step 2: Run the test and confirm RED**

Run:

```bash
node tests/backflow-platform-marketing.test.mjs
```

Expected: FAIL because `backflow-operations-platform/index.html` does not exist and the homepage does not yet link to the new page.

- [ ] **Step 3: Commit the failing test**

```bash
git add tests/backflow-platform-marketing.test.mjs
git commit -m "test: define backflow platform marketing requirements"
```

---

### Task 2: Build the Dedicated Backflow Operations Platform Landing Page

**Files:**
- Create: `backflow-operations-platform/index.html`
- Create: `backflow-operations-platform/platform.css`
- Modify: `script.js`

**Interfaces:**
- Consumes: existing site header/footer patterns, `styles.css`, `service-page.css`, `script.js`, production domain `https://strataworks.tech/`.
- Produces: canonical public route `https://strataworks.tech/backflow-operations-platform/`, demo form posting to `james@strataworks.tech`, hidden attribution fields `utm_source`, `utm_medium`, `utm_campaign`, `utm_term`, `utm_content`, and `landing_page`.

- [ ] **Step 1: Create the page shell and SEO head**

Create `backflow-operations-platform/index.html` as a full static document using the current StrataWorks header/footer conventions.

Use these exact SEO elements:

```html
<title>Backflow Testing Software & Operations Platform | StrataWorks</title>
<meta name="description" content="Run customers, assemblies, testing, routing, invoices, reporting, and compliance workflows in one backflow operations platform. Built nationwide with a strong SC, NC, and GA focus.">
<link rel="canonical" href="https://strataworks.tech/backflow-operations-platform/">
<meta property="og:title" content="Backflow Testing Software & Operations Platform | StrataWorks">
<meta property="og:description" content="Purpose-built backflow testing software for customers, assemblies, field testing, routing, invoices, reporting, and compliance workflows.">
<meta property="og:type" content="website">
<meta property="og:url" content="https://strataworks.tech/backflow-operations-platform/">
<meta property="og:image" content="https://strataworks.tech/assets/strataworks-logo.png">
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="Backflow Testing Software | StrataWorks">
<meta name="twitter:description" content="Backflow operations software built around the real workflow of a testing company.">
```

Keep the existing StrataWorks favicon, fonts, `../../`-appropriate or root-absolute asset paths, and shared `script.js`.

- [ ] **Step 2: Add visible product copy using verified capabilities only**

The body must include these sections and copy themes:

**Hero**

```html
<p class="kicker">BACKFLOW OPERATIONS PLATFORM / STRATAWORKS</p>
<h1>Backflow Testing Software<br><span>Built for the Work.</span></h1>
<p>Run customers, service locations, assemblies, testing, schedules, routes, invoices, reporting, and compliance workflows from one system built around the way backflow companies actually operate.</p>
```

Include:
- `Request a Demo` anchor to `#demo`.
- `See What It Handles` anchor to `#workflow`.
- visible line: `Available nationwide · Strong focus on South Carolina, North Carolina & Georgia`.

**Problem section** must discuss:
- spreadsheet duplication
- disconnected scheduling
- scattered customer/assembly history
- manual route planning
- form/report handling
- invoice follow-up
- office/field disconnect

**Workflow section** must visibly show this sequence:

```text
CUSTOMER + LOCATION → ASSEMBLY → SCHEDULE + ROUTE → TEST → REPAIR / RETEST → REPORT / FORM → INVOICE / PAYMENT → SUBMISSION + HISTORY
```

**Capabilities section** must cover only verified items:
- customer and service-location records
- assembly/device data
- testing and technician workflow
- scheduling and route planning
- municipality forms/submission workflow where configured
- invoicing and receivables
- operational search
- office/field role separation
- audit/operational controls
- Jobber customer CSV import as one verified import path, described narrowly

**Regional section** must say:

```text
National platform. Southeast-first experience.
```

Explain that the platform can support companies nationwide while StrataWorks is especially focused on SC, NC, and GA. State that jurisdiction-specific form/submission workflows depend on configured municipality requirements.

**FAQ** must visibly answer:
- What is backflow testing software?
- Can this replace spreadsheets and generic field-service tools?
- Does it handle backflow test forms?
- Can technicians use it in the field?
- Does it handle scheduling and route planning?
- Can it handle invoices and payments?
- Does it support municipality submission workflows?
- Is it available outside South Carolina?
- Can data be imported from another system?

Do not name Syncta, SwiftComply, Jobber, or another competitor in claims except the narrow verified Jobber CSV import statement if useful.

- [ ] **Step 3: Add accurate structured data**

Add one visible-content-aligned JSON-LD graph with `SoftwareApplication`, `Organization`, and `BreadcrumbList`.

Use:

```json
{
  "@type": "SoftwareApplication",
  "name": "StrataWorks Backflow Operations Platform",
  "applicationCategory": "BusinessApplication",
  "operatingSystem": "Web",
  "url": "https://strataworks.tech/backflow-operations-platform/",
  "description": "Backflow testing and operations software for customer records, assemblies, testing, scheduling, routing, invoicing, reporting, and configured compliance workflows.",
  "provider": {
    "@type": "Organization",
    "@id": "https://strataworks.tech/#organization",
    "name": "StrataWorks"
  }
}
```

Do not include price, rating, review count, aggregate rating, offer inventory, or security certification properties.

- [ ] **Step 4: Add the email-based Request a Demo form**

The `#demo` section must contain:

```html
<form class="demo-form" action="https://formsubmit.co/james@strataworks.tech" method="POST">
  <input type="hidden" name="_subject" value="Backflow Operations Platform demo request">
  <input type="hidden" name="_captcha" value="false">
  <input type="hidden" name="_template" value="table">
  <input type="hidden" name="_next" value="https://strataworks.tech/backflow-operations-platform/?demo=sent#demo">
  <input type="hidden" name="landing_page" value="Backflow Operations Platform">
  <input type="hidden" name="utm_source" value="">
  <input type="hidden" name="utm_medium" value="">
  <input type="hidden" name="utm_campaign" value="">
  <input type="hidden" name="utm_term" value="">
  <input type="hidden" name="utm_content" value="">

  <p class="form-success" id="demo-success" role="status" hidden>Thanks — your demo request was received. James will follow up by email.</p>

  <label>Name<input name="name" autocomplete="name" required></label>
  <label>Company<input name="company" autocomplete="organization" required></label>
  <label>Work email<input type="email" name="email" autocomplete="email" required></label>
  <label>Phone <span>(optional)</span><input type="tel" name="phone" autocomplete="tel"></label>
  <label>State<input name="state" autocomplete="address-level1" required></label>
  <label>Approximate backflow tests per month
    <select name="monthly_tests" required>
      <option value="" selected disabled>Select a range</option>
      <option>Under 50</option>
      <option>50–199</option>
      <option>200–499</option>
      <option>500–999</option>
      <option>1,000+</option>
    </select>
  </label>
  <label>Current system or process<input name="current_system" placeholder="Spreadsheet, Jobber, another platform, paper, etc."></label>
  <label>What are you trying to improve?<textarea name="goals" rows="5" required></textarea></label>
  <button class="button button-primary" type="submit">Request a Demo <span aria-hidden="true">↗</span></button>
  <p class="form-note">No mailing list. Your information is only used to respond to this demo request.</p>
</form>
```

Keep phone optional so the funnel remains email-first.

- [ ] **Step 5: Extend `script.js` for success state and attribution preservation**

Add logic that does not break pages without a demo form:

```js
const query = new URLSearchParams(window.location.search);

const demoSuccess = document.querySelector('#demo-success');
if (demoSuccess && query.get('demo') === 'sent') {
  demoSuccess.hidden = false;
}

const attributionFields = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_term', 'utm_content'];
attributionFields.forEach((name) => {
  const input = document.querySelector(`.demo-form input[name="${name}"]`);
  const value = query.get(name);
  if (input && value) input.value = value;
});
```

Do not remove the existing general-contact `message=sent` behavior.

- [ ] **Step 6: Add product-page styling**

Create `backflow-operations-platform/platform.css` and use the existing StrataWorks tokens/colors where possible.

Required visual rules:
- dark technical hero
- high-contrast blue accent
- large industrial headline typography
- visible workflow rail/sequence without a dependency on a chart library
- square/low-radius technical panels rather than soft SaaS cards
- strong section dividers/rules
- responsive demo form
- no horizontal overflow at 375px
- no video background
- no heavy animation library
- support `prefers-reduced-motion`

Use semantic class names such as `.platform-hero`, `.platform-workflow`, `.platform-capability-grid`, `.regional-focus`, `.demo-section`, `.demo-form`.

- [ ] **Step 7: Run the regression test**

Run:

```bash
node tests/backflow-platform-marketing.test.mjs
```

Expected: still FAIL because homepage and sitemap tasks are not complete yet, but the page-specific assertions should now pass when inspected individually.

- [ ] **Step 8: Commit the landing page**

```bash
git add backflow-operations-platform/index.html backflow-operations-platform/platform.css script.js
git commit -m "feat: add backflow operations platform landing page"
```

---

### Task 3: Turn the Homepage Blank Space Into a Featured Platform Promotion

**Files:**
- Modify: `index.html`
- Modify: `styles.css`

**Interfaces:**
- Consumes: new `/backflow-operations-platform/` route from Task 2.
- Produces: homepage links to the platform landing page and demo anchor.

- [ ] **Step 1: Add the Featured Platform block inside the existing Capabilities introduction area**

Place the new block in the visually unused left-side area associated with the Capabilities section without replacing the existing `ONE PARTNER. EVERY LAYER.` heading.

Use this content direction exactly enough to keep search and conversion intent clear:

```html
<aside class="featured-platform reveal" aria-labelledby="featured-platform-title">
  <p class="featured-platform-kicker">FEATURED PLATFORM / BACKFLOW OPERATIONS</p>
  <h3 id="featured-platform-title">Run the backflow business from one system.</h3>
  <p>Customers, assemblies, testing, routes, invoices, reporting, and compliance workflows—built around the way backflow companies actually work.</p>
  <div class="featured-platform-actions">
    <a class="button button-primary" href="backflow-operations-platform/#demo">Request a Demo <span aria-hidden="true">↗</span></a>
    <a class="text-link" href="backflow-operations-platform/">Explore the platform <span aria-hidden="true">→</span></a>
  </div>
  <div class="featured-platform-ui" aria-hidden="true">
    <div><span>CUSTOMERS</span><strong>Locations + assemblies</strong></div>
    <div><span>FIELD</span><strong>Schedule → Route → Test</strong></div>
    <div><span>OFFICE</span><strong>Report → Invoice → Submit</strong></div>
  </div>
</aside>
```

The mini UI is a restrained workflow composite using real product concepts; it must not display fabricated customer names, fake revenue, fake test counts, fake municipal status, or fake performance metrics.

- [ ] **Step 2: Style the homepage block to use the empty space intentionally**

Add `.featured-platform*` rules to `styles.css`.

Desktop requirements:
- use the left side of the Capabilities intro as a product feature panel
- do not shrink or cover the existing oversized section heading
- keep the CTA visible above the fold of the Capabilities section when practical

Mobile requirements:
- stack the product promotion before the service bento grid
- remove any desktop absolute positioning that creates blank space
- maintain 16px+ usable horizontal padding
- no overflow from the mini UI

- [ ] **Step 3: Run the regression test**

```bash
node tests/backflow-platform-marketing.test.mjs
```

Expected: homepage assertions now PASS; sitemap assertion still FAILS.

- [ ] **Step 4: Commit the homepage promotion**

```bash
git add index.html styles.css
git commit -m "feat: feature backflow operations platform on homepage"
```

---

### Task 4: Add Search Discovery and Natural Internal Links

**Files:**
- Modify: `sitemap.xml`
- Modify: `services/ai-automation/index.html`
- Review and optionally modify: `services/it-consulting/index.html`

**Interfaces:**
- Consumes: canonical product URL from Task 2.
- Produces: crawlable sitemap entry and at least one contextual service-page link.

- [ ] **Step 1: Add the product URL to the sitemap**

Insert:

```xml
<url><loc>https://strataworks.tech/backflow-operations-platform/</loc></url>
```

Keep the sitemap valid XML and preserve all existing service URLs.

- [ ] **Step 2: Add one contextual link from AI & Automation**

Add a short product-example sentence in `services/ai-automation/index.html`, near the section explaining practical workflows or related systems:

```html
<p class="product-proof">See how StrataWorks applies workflow automation in a purpose-built product: <a href="/backflow-operations-platform/">Backflow Operations Platform</a>.</p>
```

Do not add repeated exact-match keyword anchors elsewhere on the same page.

- [ ] **Step 3: Review IT Consulting for a natural link**

Only add a link if it improves the copy naturally. If used, the anchor should be branded, for example:

```html
<a href="/backflow-operations-platform/">StrataWorks Backflow Operations Platform</a>
```

Do not force an exact-match `backflow testing software` link onto the IT consulting page.

- [ ] **Step 4: Run the regression test and confirm GREEN**

```bash
node tests/backflow-platform-marketing.test.mjs
```

Expected:

```text
Backflow marketing regression checks passed.
```

- [ ] **Step 5: Commit search-discovery changes**

```bash
git add sitemap.xml services/ai-automation/index.html services/it-consulting/index.html tests/backflow-platform-marketing.test.mjs
git commit -m "seo: index and link backflow platform landing page"
```

If `services/it-consulting/index.html` is unchanged, omit it from `git add`.

---

### Task 5: Visual, Accessibility, and Form Verification

**Files:**
- Review: `index.html`
- Review: `styles.css`
- Review: `backflow-operations-platform/index.html`
- Review: `backflow-operations-platform/platform.css`
- Review: `script.js`

**Interfaces:**
- Consumes: completed marketing implementation.
- Produces: verified deployable static site.

- [ ] **Step 1: Serve the site locally**

Use a simple static server from the repository root:

```bash
python -m http.server 8000
```

Open:

```text
http://localhost:8000/
http://localhost:8000/backflow-operations-platform/
```

- [ ] **Step 2: Verify homepage desktop composition**

At approximately 1440px wide confirm:
- Featured Platform occupies the previously unused Capabilities intro space.
- `ONE PARTNER. EVERY LAYER.` remains dominant and unobstructed.
- `Request a Demo` is immediately readable.
- the feature does not resemble another generic service card.

- [ ] **Step 3: Verify mobile and tablet layout**

Check at 375px, 768px, and 1024px widths.

Confirm:
- no horizontal scrollbar
- no clipped headline
- CTA buttons remain tappable
- demo form labels are visible
- mini workflow UI wraps cleanly
- nav remains usable

- [ ] **Step 4: Verify accessibility basics**

Confirm manually:
- one H1 on the product page
- heading order is logical
- all form fields have visible labels
- keyboard tab order reaches every CTA and form control
- focus indicators remain visible
- success message uses `role="status"`
- meaningful imagery has alt text; decorative visuals are hidden from assistive tech

- [ ] **Step 5: Verify SEO output in page source**

On the product page confirm exact production values:

```text
Title: Backflow Testing Software & Operations Platform | StrataWorks
Canonical: https://strataworks.tech/backflow-operations-platform/
Phone: (803) 386-7728
Demo recipient: james@strataworks.tech
```

Confirm the page contains visible references to nationwide availability plus South Carolina, North Carolina, and Georgia.

- [ ] **Step 6: Verify attribution handling without submitting a real lead**

Open:

```text
http://localhost:8000/backflow-operations-platform/?utm_source=google&utm_medium=cpc&utm_campaign=backflow_test
```

In browser devtools, inspect the demo form and confirm:

```text
utm_source = google
utm_medium = cpc
utm_campaign = backflow_test
```

Do not send a production FormSubmit request as part of automated testing.

- [ ] **Step 7: Run final static regression test**

```bash
node tests/backflow-platform-marketing.test.mjs
```

Expected:

```text
Backflow marketing regression checks passed.
```

- [ ] **Step 8: Search for stale phone numbers and unsupported claims**

Run:

```bash
grep -RniE '803[- )]303[- ]6301|\+18033036301' --exclude-dir=.git .
```

Expected: no matches.

Run:

```bash
grep -RniE 'all municipalities|every municipality|99\.9% uptime|SOC 2|guaranteed savings|thousands of customers' backflow-operations-platform index.html
```

Expected: no matches.

- [ ] **Step 9: Commit verification-only corrections if needed**

If visual/accessibility fixes were required:

```bash
git add index.html styles.css script.js backflow-operations-platform/index.html backflow-operations-platform/platform.css tests/backflow-platform-marketing.test.mjs sitemap.xml services/ai-automation/index.html services/it-consulting/index.html
git commit -m "fix: polish backflow platform marketing experience"
```

If no corrections were required, do not create an empty commit.

---

### Task 6: Deploy and Validate the Production GitHub Pages Site

**Files:**
- No planned source changes unless deployment validation reveals a real issue.

**Interfaces:**
- Consumes: verified implementation branch.
- Produces: live `https://strataworks.tech/backflow-operations-platform/` route after merge/deploy.

- [ ] **Step 1: Review the branch diff before merge**

Run:

```bash
git diff main...HEAD -- index.html styles.css script.js sitemap.xml services/ai-automation/index.html services/it-consulting/index.html backflow-operations-platform tests
```

Confirm the diff contains only marketing/SEO changes in scope.

- [ ] **Step 2: Merge through the repository's normal main-branch workflow**

Do not alter `CNAME`, Pages source, DNS, or the Backflow application deployment.

- [ ] **Step 3: Validate production URLs after GitHub Pages updates**

Check:

```text
https://strataworks.tech/
https://strataworks.tech/backflow-operations-platform/
```

Confirm:
- homepage Featured Platform block is visible
- product page returns normally
- CSS/JS/assets load
- demo form action is `https://formsubmit.co/james@strataworks.tech`
- phone links call `(803) 386-7728`
- canonical is production domain
- sitemap contains the product page

- [ ] **Step 4: Final report**

Report:
- files changed
- landing-page URL
- demo-recipient email
- SEO title/canonical
- tests run and results
- whether the user still needs to provide any real platform screenshots for a future visual upgrade
- note that MSP Google Ads planning is intentionally deferred and should use the provided Google Business Profile link when that separate campaign-planning work begins
