"""Recapture the How it works screenshots from the current Backflow app with fictional demo data.

Run from the product repo so its demo_video recording environment is importable:
  cd ../backflow-operations-platform
  .venv/bin/python ../Strataworks/scripts/capture-backflow-screenshots.py

Needs local PostgreSQL (or docker), pdftoppm, Pillow, and freezegun in the product .venv.
Writes WebP files straight into backflow-operations-platform/media/. Review every image
before publishing: no subtitles, no stray highlights, fictional records only.
"""
import shutil, subprocess, sys, tempfile, uuid
from pathlib import Path
ROOT = Path.cwd()
MEDIA = Path(__file__).resolve().parent.parent / 'backflow-operations-platform' / 'media'
TMP = Path(tempfile.mkdtemp(prefix='backflow-shots-')); OUT = TMP / 'out'; WORK = TMP / 'work'; OUT.mkdir(); WORK.mkdir()
sys.path.insert(0, str(ROOT))
from PIL import Image, ImageDraw, ImageFont
from playwright.sync_api import sync_playwright
from scripts.demo_video.environment import disposable_database, isolated_application
from scripts.demo_video.combined_actions import CombinedActions
from scripts.demo_video.fixtures import SCENARIO_DATE

def font(size, bold=False):
    for p in ['/System/Library/Fonts/HelveticaNeue.ttc', '/System/Library/Fonts/Helvetica.ttc']:
        try: return ImageFont.truetype(p, size, index=1 if bold else 0)
        except Exception: pass
    return ImageFont.load_default(size)

def session(browser, config, ids, w=1440, h=900, scale=2, mobile=False):
    ctx = browser.new_context(viewport={'width': w, 'height': h}, device_scale_factor=scale, locale='en-US',
                              timezone_id='America/New_York', color_scheme='light', reduced_motion='reduce',
                              is_mobile=mobile, has_touch=mobile)
    page = ctx.new_page(); page.set_default_timeout(15000)
    page.clock.set_fixed_time('2026-11-01T15:00:00Z')
    a = CombinedActions(page, config, ids, 'owner', WORK); a.authenticate()
    return ctx, page, a

def settle(page):
    page.wait_for_load_state('networkidle'); page.evaluate('document.fonts.ready'); page.wait_for_timeout(400)

def main():
    work = Path(tempfile.mkdtemp(prefix='shots-', dir=WORK)) / 'env'
    with disposable_database(work, Path('/opt/homebrew/bin')) as config, sync_playwright() as pw:
        browser = pw.chromium.launch()
        def app(fx):
            d = WORK / fx; d.mkdir(exist_ok=True); return isolated_application(config, fx, ROOT, d)
        # 1 schedule
        with app('customer') as ids:
            ctx, page, a = session(browser, config, ids, 1440, 1250)
            a.goto(f'/tests/new?customer_id={ids["customer"]}&location_id={ids["location"]}&device_id={ids["device"]}'); settle(page)
            a.assign_job(); settle(page)
            page.screenshot(path=OUT / 'story-schedule.png', full_page=False)
            page.screenshot(path=WORK / 'schedule-full.png', full_page=True)
            ctx.close()
        # 2 field test (phone) + readings crop for 3
        with app('scheduled') as ids:
            ctx, page, a = session(browser, config, ids, 390, 844, 3, True)
            page.goto(config.url + f'/tests/{ids["test"]}'); a.fill_readings(); settle(page)
            page.locator('fieldset:has(legend:text("Test measurements"))').scroll_into_view_if_needed()
            page.evaluate("const f=[...document.querySelectorAll('fieldset')].find(x=>x.textContent.includes('Test measurements')); scrollTo(0, f.getBoundingClientRect().top + scrollY - 110)"); settle(page)
            page.screenshot(path=OUT / 'story-field-test.png')
            ctx.close()
            ctx, page, a = session(browser, config, ids)
            page.goto(config.url + f'/tests/{ids["test"]}'); a.fill_readings(); settle(page)
            fs = page.locator('fieldset:has(legend:text("Test measurements"))'); fs.scroll_into_view_if_needed()
            fs.screenshot(path=WORK / 'readings.png')
            ctx.close()
        # report PDF + invoice
        with app('approved') as ids:
            ctx, page, a = session(browser, config, ids)
            r = page.request.get(config.url + f'/tests/{ids["test"]}/report/preview'); assert r.body().startswith(b'%PDF')
            (WORK / 'report.pdf').write_bytes(r.body())
            a.fill_invoice(); a.save_invoice(); settle(page)
            page.screenshot(path=OUT / 'story-invoice.png')
            ctx.close()
        # 5 queue
        with app('paid') as ids:
            ctx, page, a = session(browser, config, ids, 1440, 1000)
            a.goto(f'/tests/{ids["test"]}'); a.queue_submission()
            a.goto('/submissions?view=batch'); settle(page)
            row = page.locator('tr[data-batch-row]').first
            page.evaluate("scrollTo(0,330)")
            # tr elements ignore border-radius/outline corners, so draw the outline on an overlay box at the row's rect
            row.evaluate("el => { const r=el.getBoundingClientRect(); const o=document.createElement('div'); Object.assign(o.style,{position:'absolute',left:r.left+scrollX+'px',top:r.top+scrollY+'px',width:r.width+'px',height:r.height+'px',outline:'3px solid #f2b705',outlineOffset:'2px',borderRadius:'6px',pointerEvents:'none',zIndex:50}); document.body.appendChild(o); }")
            page.wait_for_timeout(300)
            page.screenshot(path=OUT / 'story-submission.png')
            ctx.close()
        browser.close()
    # report render
    subprocess.run(['pdftoppm', '-r', '200', '-png', '-singlefile', str(WORK / 'report.pdf'), str(WORK / 'report')], check=True)
    rep = Image.open(WORK / 'report.png').convert('RGB')
    from PIL import ImageChops
    bbox = ImageChops.difference(rep, Image.new('RGB', rep.size, 'white')).getbbox()
    pad = 60; rep = rep.crop((max(0, bbox[0]-pad), max(0, bbox[1]-pad), bbox[2]+pad, bbox[3]+pad))
    rd = Image.open(WORK / 'readings.png').convert('RGB')
    BG = '#f4f3ee'; INK = '#1b2a2f'
    def fit(img, w, h):
        s = min(w / img.width, h / img.height); return img.resize((int(img.width*s), int(img.height*s)), Image.LANCZOS)
    def comp(size, boxes, heads, caption):
        c = Image.new('RGB', size, BG); d = ImageDraw.Draw(c)
        for (x, y, w, h, img), (hy, text) in zip(boxes, heads):
            d.text((x, hy), text, font=font(72, True), fill=INK)
            f = fit(img, w, h); c.paste(f, (x, y)); d.rectangle((x, y, x+f.width-1, y+f.height-1), outline='#d8d6cc', width=2)
        d.text((80, size[1]-110), caption, font=font(44), fill='#52605f')
        return c
    cap = 'Actual platform screens. Fictional records; training form shown.'
    comp((2800, 1560), [(80, 260, 960, 1000, rd), (1200, 260, 1520, 1000, rep)],
         [(80, 'Field results'), (80, 'Populated demonstration report')], cap).save(OUT / 'report-proof.png')
    comp((1680, 2500), [(80, 220, 1520, 640, rd), (80, 1130, 1520, 1100, rep)],
         [(80, 'Field results'), (990, 'Populated demonstration report')], cap).save(OUT / 'report-proof-mobile.png')

def publish():
    # ponytail: fixed crops match the current app layout; revisit if a screen grows or shrinks.
    def save(img, name, width):
        if img.width > width: img = img.resize((width, round(img.height * width / img.width)), Image.LANCZOS)
        img.convert('RGB').save(MEDIA / name, 'WEBP', quality=86, method=6)
    save(Image.open(OUT / 'story-schedule.png').crop((0, 0, 2880, 1800)), 'story-schedule.webp', 1600)
    save(Image.open(OUT / 'story-field-test.png'), 'story-field-test.webp', 780)
    save(Image.open(OUT / 'report-proof.png'), 'report-proof.webp', 1600)
    save(Image.open(OUT / 'report-proof-mobile.png'), 'report-proof-mobile.webp', 840)
    save(Image.open(OUT / 'story-invoice.png'), 'story-invoice.webp', 1600)
    save(Image.open(OUT / 'story-submission.png').crop((0, 150, 2880, 1950)), 'story-submission.webp', 1600)


main()
publish()
print('Screenshots written to', MEDIA)
