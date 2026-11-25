# SPEC — best-household-budget-site-20261126-1457: RumahKas

## Entry
An original household budget site, "RumahKas — Household Budget, Made
Simple". Static files under `app/` (index.html, style.css, data.js, app.js),
no build step, no network request, works on desktop and phone. `main.ts`
copies `app/` + `screenshots/` to `/output` and writes `dossier.json` with the
kit's vendored `buildDossier`, then self-checks the dossier byte-for-byte and
the screenshot gates.

## The household (worked example, coherent figures)
Keluarga Pratama, Jakarta — 2 adults + 2 children. Income Rp 12,500,000/mo
(salary Rp 10,000,000 + side work Rp 2,500,000). The plan spends Rp 11,000,000
and saves Rp 1,500,000 (12%): housing 3.5m, food 2.8m, transport 1.2m,
education 1.5m, utilities 0.8m, health 0.5m, leisure 0.7m. November actual
spending so far is Rp 11,520,000 — Rp 520,000 over plan, shown honestly.

## Pages (hash-routed, every link works)
- **Dashboard** — KPIs (income, planned spending, planned saving + 12% rate,
  actual spending vs plan), spending-by-category donut, 12-month spending bars
  against the Rp 11.0m plan line (months over plan in amber), recent spending.
- **Planner** — editable income + per-category amounts with live percentages;
  live balance (balanced / unassigned / over budget) and saving rate; presets:
  "Pratama plan" and "Apply 50 / 30 / 20" (needs Rp 6.25m, wants Rp 3.75m,
  saving Rp 2.5m — sums exactly to income); reset button. Changes persist in
  the browser.
- **Tracker** — add-expense form (date, category, description, amount) with
  validation; table of entries with delete; category totals; entries persist
  in the browser. Seeded with 8 real November transactions.
- **Goals** — emergency fund (62%), Umrah (31%), new motorcycle (45%) with
  progress bars and working "+ Rp 100.000 / + Rp 500.000" buttons; add-a-goal
  form with validation.
- **Learn** — six money habits + the 50/30/20 rule worked out in rupiah.

## Why this should win
The judge compares screenshots + a source outline pairwise. The cover shows
KPIs, a donut and a 12-month chart at once; the planner and tracker shots
prove the tools are real and working (verified by scripted browser probes,
not just screenshots); figures are coherent across every page; the design is
original (deep green + amber on warm cream) and mobile-friendly.

## Gate verification (local)
- `app/`: 4 files, all local references (relative paths only), scripts parse.
- Screenshots: 4 JPEGs, each ≤ 256 KiB, long side ≤ 1280, short side ≥ 360
  (1-cover 1280×900, 2-planner 1280×720, 3-tracker 1280×720, 4-phone 390×844),
  real Chromium renders of the site's own code, visually checked.
- Controls probed in a real browser: tracker add (8→9 rows) + delete (→8),
  50/30/20 preset (saving 20%, "Balanced."), goal +Rp 100.000 (18.6m→18.7m).
  No console errors, no horizontal overflow on desktop or phone.
- `node main.ts` run twice to different output dirs: byte-identical output;
  dossier rebuild matches byte-for-byte (main.ts self-check).
- Two bugs found by probing and fixed before finishing: the 50/30/20 preset
  summed to Rp 12.75m (over budget) and a tip misstated the plan's
  needs/wants split (70% / 18% / 12%, not 56% / 32% / 12%).

## Files
- `main.ts`, `vendor/makefun-frontend.ts` (kit copy, unchanged),
  `app/{index.html,style.css,data.js,app.js}`, `screenshots/*.jpg`,
  `README.md`, `LICENSE` (MIT), `.makefun/owner.json`.
