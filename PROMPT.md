# PROMPT — best-household-budget-site-20261126-1457

Build the best household budget site you can for make.fun's bounty
($50, top 10 share it): a working static site, shown in screenshots, with
the pages, tools and sections a household keeping its budget needs, each
reached by a link, with real figures in place and every control doing what
it says — nothing empty, broken or placeholder. Original design, text and
names only; never copy another site's brand, text or images.

Build around one coherent example household in rupiah (Jakarta family of
four, income Rp 12,500,000/month, plan spends Rp 11.0m and saves Rp 1.5m):
Dashboard (KPIs, spending donut, 12-month bars against the plan line),
Planner (editable income and category amounts, live balance and saving rate,
a working 50/30/20 preset that sums exactly to income), Tracker (add/delete
expenses with validation, category totals, browser persistence), Goals
(progress bars with working add-saving buttons, add-a-goal form), Learn
(six money habits + 50/30/20 in rupiah). Draw charts as inline SVG from your
own data file; no external libraries, no network requests, all references
local files. Make it mobile-friendly.

Take 4 real screenshots in headless Chromium (desktop cover, planner,
tracker, phone) and check each is ≤ 256 KiB with long side ≤ 1280 and short
side ≥ 360. Probe every control in a real browser (add/delete an expense,
apply the preset, add to a goal) and fix what fails. `main.ts` (Node 22)
copies app/ + screenshots/ to /output and writes dossier.json with the kit's
vendored buildDossier, then self-checks the dossier by rebuilding it. Run
main.ts twice to two output dirs and confirm byte-identical output. Verify
every screenshot visually before finishing.
