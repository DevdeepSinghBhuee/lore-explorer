# Translation sources (not served by the site)
- ui_tr.py (phase 1), ui_tr2.py (2), ui_tr3.py + ui_tr3b/3c.py (3), ui_tr4_en.py + ui4_<lang>.py + ui4x.py (4): UI text per language.
- merge_ui.py builds data/i18n/ui-<lang>.js from all of them and appends missing English keys to i18n.js.
  Run from this folder: `cd tools/i18n && python3 merge_ui.py` (it writes to /home/claude/runeterra-atlas/ — change R if the repo lives elsewhere).
  Riftbound game terms come from Riot's own labels in i18n/rb_loc.json.
- fix_lor.py rebuilt LoR card text from Riot's `description` fields (needs the LoR_DDragon clones, not stored here).
- t_p4.py: Playwright check of the phase-4 pages in several languages (needs `python3 -m http.server 8765` in the repo).
