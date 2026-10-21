# Runeterra Atlas — project notes for Claude

Free, fan-made League of Legends universe site. Owner: Devdeep (not a coder — he wants to see results,
Claude takes full technical responsibility; explain outcomes in plain words, not code).
**Hard rule: zero cost.** No paid APIs, hosting, credits or assets. Free for him and for every visitor.

Live: https://devdeepsinghbhuee.github.io/runeterra-atlas/  ·  Repo: DevdeepSinghBhuee/runeterra-atlas (branch main)
Hosting: GitHub Pages, deploys ~1 min after push. Static HTML/CSS/JS, **no build step, no framework**.
Custom domain is possible later via Pages settings + CNAME file (not set up).

## Pages
| File | What it is |
|---|---|
| index.html | FRONT PAGE = Runeterra Daily (the game, formerly daily.html) + an "Explore Runeterra" strip of 7 cards. A tiny head script forwards old Atlas links (`/#c-<id>`, `/#<region>`) to atlas.html. daily.html is now only a redirect to ./ (keeps the hash). |
| atlas.html | The Atlas (moved from index.html on 2026-10-20; link champions as `atlas.html#c-<id>`): painted terrain map (canvas → SVG `<image>`), region themes (THEMES), WebGL depth-parallax banners (Scene class, Depth Anything V2 depth maps in assets/), "web of bonds" relationship graph (renderWeb: all champions of the region + outside partners of the selected champion), champion detail panel (bio, official Universe stories, LoR cards, Riftbound cards, videos). Deep link `#c-<id>`. |
| journey.html | Champion Journeys: `?c=<id>` = guided tour in up to 9 chapters (who they are + region; read first = their "-color" story else shortest, other stories, comics; watch = videos.js minus login/making/music, own cinematics first, play in place; listen = login theme + music videos + music.js tracks naming them; bonds; 6 rarest skins; LoR + Riftbound cards; arrival stats; where next = official bonds + same-region picks). Chapter 2 "How they play" (`#play`): passive+QWER tabs with Riot icon, description, cooldown/cost/range and the official preview clip (autoplay muted loop). No `?c` = picker by region with search + Surprise me. Empty chapters are skipped. Linked from Atlas panel, Timeline and Skins plates. |
| (daily game, in index.html) | Runeterra Daily (LoLdle-style, our data only): 4 modes per day — Ability (one ability icon, greyscale + rotated 90/180/270; colour after 3 misses, upright after 5; bonus: which of the 5 abilities) · Clues (region, class=tags partial, range, resource, release year ↑↓ ±2 = close, skin count ↑↓ ±2), Splash (DDragon splash zoom 6×→1× per miss, seeded focal point; bonus: pick the skin of 4), Lore (bio in 5 word-chunks, name parts redacted, region hint at 3 misses, class at 5). Puzzle #1 = 2026-10-20 (visitor's local date); each mode walks a fixed seeded shuffle of all champions. State/streaks in localStorage atlas.daily.* (every guess saved at once; also atlas.daily.view = last mode/practice, atlas.daily.practice = practice rounds per mode, sessionStorage draft of the typed guess). site.js shows a "Back to your puzzle" chip on every other page while a today's puzzle is unfinished; share = emoji grid; practice rounds unlimited (no stats); reveal after 8 guesses. `#clues|#splash|#ability|#lore`. |
| mine.html | "My champions": favourites (★) with per-champion story progress, "read next" (unread stories about favourites, shortest first), log of stories read (unmark), clear-all (two-click). Data lives only in localStorage via site.js. |
| worlds.html | Live Worlds 2026: hero scoreboard + countdown, schedule tabs in viewer's time zone, 19 teams + rosters, anthem, champions history 2011–2025. Refreshes every 60 s; falls back to WORLDS_SNAPSHOT. |
| library.html | 1,647 Legends of Runeterra cards, filters, card dialog, deep links. |
| riftbound.html | 1,407 Riftbound TCG cards, domain chips; images hotlinked from Riot CDN. |
| theater.html | 147 official videos in 8 shelves, youtube-nocookie embeds, `#v-<id>`. |
| players.html | 97 Worlds 2026 players: search/role/team filters (`?team=CODE`), dossier dialog with 6 signature champions (link to Atlas `#c-<id>`) and a Worlds timeline. Deep link `#p-<slug>`. Worlds rosters link here. |
| skins.html | Skins wardrobe: 1,994 skins (no base skins/chromas) as loading-screen portraits, rarity gems, featured splash, filters (search, rarity, skin line, region, Legacy), splash plate with Riot description. `?champion=<id>`, `?line=<id>`, deep link `#s-<champ>-<num>` (num "C" = the 2026 "Classic" skins, art from CommunityDragon). Atlas champion panel shows a lazy-loaded skins strip linking here. |
| reading.html | Reading Room: 244 official short stories (illustrated cards, reading time, author, champions; filters: search, length, region, sort) and 38 comics as cover racks per series + one-shots. Plates link out to universe.leagueoflegends.com (never copy story text). `?champion=<id>`, `#comics`, `#story-<slug>`, `#comic-<series>--<issue>`. Atlas champion panel lazy-loads reading.js to show reading times + comic covers. |
| timeline.html | Release timeline: 173 champions in release order. Pulse bar chart (releases per year, drawn at real width, hover tooltip, click jumps), 6 computed milestones, year bands with release-day rows (date + patch, #order), filters (search, class = tags[0], region, oldest/newest). Plate: released/revealed dates, same-day & before/after champs, links to Atlas/Skins/Reading. `?region=`, `#y<year>`, `#t-<id>`. atlas.html panel shows "Released <date> · patch" linking here. |
| music.html | Music hub: 13 shelves (anthems, virtual bands, Arcane S1/S2/score, Pentakill, Star Guardian, login themes from videos.js, champion songs, Warsongs, DJ Sona, LoR, long listens). One docked YouTube IFrame-API player (youtube-nocookie; kept ≥200px tall per YouTube's rules) plays a shelf in order, shuffle, Media Session controls. Deep links `#s-<shelf>`, `#t-<shelf>-<n>`. |

Languages (2026-10-20, phase 1): i18n.js (plain <script> in <head> of every page, before site.js) = window.AtlasI18n: 17 languages
(en, ko, zh-CN, zh-TW, ja, es-ES, es-MX, pt-BR, fr, de, it, pl, ru, tr, vi, th, id). Choice saved in localStorage atlas.lang, else browser language, else en.
English UI text lives in i18n.js (EN); others in data/i18n/ui-<code>.js (window.ATLAS_UI, same keys; plurals as {one,few,many,other}; written by Claude,
source script in the session scratchpad ui_tr.py — add a key to EN AND all 16 files). Riot's official champion text per language in data/i18n/<code>.js
(ATLAS_I18N_PACK: champs id → [name, title, blurb, resource, [5 ability names], {skinNum: skin name}], tags, regions; DDragon 16.20.1 + Universe faction
names; vi/id have no region names → English). zh-CN pack has name/title SWAPPED vs Riot's file on purpose (Riot puts 阿狸 in "title").
Translated so far: the menu + language picker (site.js, every page; untranslated pages show "this page is in English for now" in the picker) and the
whole front page/Daily (names, regions, classes, resources, skins, abilities, Lore = Riot's localized blurb with name + case-ending stems hidden;
zh/ja/th chunked by characters; guesses accept local or English names).
Phase 2 (2026-10-20): journey.html fully translated; atlas.html champion panel + roster + web of bonds translated (rest of Atlas English → picker
says "parts of this page are still in English"; site.js TRANSLATED map: 1 = full, 2 = partly). Extra data, loaded only when needed:
data/i18n/full-<code>.js (ATLAS_I18N_FULL id → [full lore, [5 ability descriptions]], DDragon) and data/i18n/stories-<code>.js
(ATLAS_I18N_STORIES slug → [title, summary], Universe explore2 per locale; 14 languages — vi/id have no Universe → English).
AtlasI18n helpers: uni (Universe locale), loadFull/loadStories, bio(c), storyUrl/storyTitle/storyDesc, champUrl, skin(c,num,en), date(iso).
Story links open Universe in the visitor's language when Riot has that story there; site.js marks stories read for any locale.
UI translations source: scratchpad ui_tr.py + ui_tr2.py, merged by merge_ui.py (also syncs EN into i18n.js). Still English: bond notes, video/comic titles.
Phase 3 (2026-10-21): skins.html, timeline.html, reading.html, mine.html fully translated (their inline script is wrapped in an async IIFE that
awaits AtlasI18n data first; champion objects are copied with name/title localized and `en` = English name, so search matches both).
data/i18n/skins-<code>.js (ATLAS_I18N_SKINS {s: "<champ>-<num>" → [name, description], l: lineId → skin-line name}; game client via CommunityDragon
latest/plugins/rcp-be-lol-game-data/global/<ko_kr…>/v1/skins.json + skinlines.json, pulled through the browser pane as gzip+base64 chunks of 105,000
chars — the device bridge cuts results at ~117 KB). Only "Classic Miss Fortune" has no match (stays English). Thai dates use the Gregorian calendar.
UI source files: scratchpad ui_tr.py, ui_tr2.py, ui_tr3.py/3b/3c → merge_ui.py. Still English: Atlas map/regions, Worlds, Players, Theater, Music,
card libraries, bond notes, video and comic titles. Next: those pages; Arabic (RTL, no Riot data).
Menu: site.js (loaded with `defer` on every page) replaces each page's <nav class="nav"> with grouped dropdowns — Champions (Journeys, Skins, Timeline) ·
Lore (Atlas = atlas.html, Reading Room) · Play (Runeterra Daily = ./) · Esports (Worlds, Players) · Watch & Listen (Theater, Music) · Card games (Runeterra cards, Riftbound) · ★ My champions;
phone = star + "Menu" sheet. Edit GROUPS in site.js to change it (the plain links left in each page are only a no-JS fallback).
site.js also owns window.AtlasMine (localStorage atlas.mine.favs / atlas.mine.read): any `[data-fav="<id>"]` is a star button (add
`data-fav-label` for the text label), any `[data-read="<slug>"]` badge shows when read, and clicking a Universe story link marks it read.
Every footer carries Riot's
"Legal Jibber Jabber" fan-content notice — keep it on any new page.

## Data (data/*.js, plain globals)
champions.js (173 champs: id, dd, name, title, region, role, tags, bio, hand) · regions.js (ATLAS_REGIONS) · bonds.js (ATLAS_BONDS; atlas.html reads both) · cards.js · stories.js ·
champcards.js · riftbound.js (RB_SETS, RB_CARDS) · champrb.js · videos.js (ATLAS_VIDEOS shelves) ·
worlds.js (WORLDS_TEAMS, WORLDS_SNAPSHOT) · players.js (ATLAS_PLAYERS, saved 2026-10-19) · music.js (ATLAS_MUSIC shelves, saved 2026-10-19) · skins.js (ATLAS_SKINS by champion + ATLAS_SKIN_LINES, saved 2026-10-19, patch 16.20) · reading.js (ATLAS_READ_STORIES, ATLAS_READ_COMICS, ATLAS_READ_SERIES, saved 2026-10-19) · game.js (ATLAS_GAME id → [resource, Melee/Ranged]; DDragon 16.20.1, Gnar = Ranged per Wiki) · abilities.js (ATLAS_ABILITIES id → [key, [[passive name, desc, icon], [name, desc, icon, cd, cost, range]×4]]; DDragon 16.20.1) · abilityvideos.js (ATLAS_ABILITY_VIDEOS key → "PQWER" slots that have a clip; 856/865) · releases.js (ATLAS_RELEASES id → [released, patch, revealed]). Bonds (data/bonds.js) are [a,b,type,note,source,necritVideo]; source r = Riot Universe text, w = League Wiki Relations,
u = only listed as related by Riot (note says no official story explains it). Reviewed 2026-10-19: 77 re-typed, 34 verified as Linked, 129 'u'.

## Sources (all free)
- Champion art/data: Data Dragon mirror raw.githubusercontent.com/InFinity54/LoL_DDragon
- LoR cards: InFinity54/LoR_DDragon_SetN mirrors
- Lore: universe-meeps.leagueoflegends.com/v1/en_us/champions|factions/{id}/index.json
  (site id ≠ Universe id for jarvan→jarvaniv, wukong→monkeyking, renata→renataglasc). Link out to full stories; don't copy them.
- Riftbound: __NEXT_DATA__ on playriftbound.com card gallery; images cmsassets.rgpub.io/sanity/images/dsfx7636/game_data_live/<file>?w=400&fm=webp
- Players: Leaguepedia Cargo via lol.fandom.com/wiki/Special:CargoExport (the api.php cargoquery is rate-limited; CargoExport works), read in the
  browser pane since the workspace can't reach it. Tables: TournamentPlayers (rosters), ScoreboardPlayers (champion counts; incomplete for wins, so
  only games are shown), MatchSchedule (reliable series/game records), TournamentResults (placings), PlayerRedirects (old names, e.g. Thanatos kyu/gyu).
  Credit Leaguepedia (CC BY-SA 3.0) in the footer. Refresh after Worlds ends to fill 2026 placings.
- Music: Riot Games Music's YouTube playlists (youtube.com/@RiotGamesMusic/playlists), read in the browser pane: parse ytInitialData
  lockupViewModel items on /playlist?list=…; check embeddability with /oembed (non-200 = can't embed). Each shelf keeps its source playlist id.
- Skins: CommunityDragon raw.communitydragon.org/latest/plugins/rcp-be-lol-game-data/global/default/v1/skins.json + skinlines.json (game client data; read in the
  browser pane — the workspace can't reach it), joined with Data Dragon championFull.json from the mirror. Images hotlinked from
  ddragon.leagueoflegends.com/cdn/img/champion/{loading,splash}/<dd>_<num>.jpg. Big browser exports: a javascript_tool result that is too large
  is saved to a file under ~/.claude/projects/.../tool-results/ — read it with python instead of retyping.
- Reading Room: universe-meeps …/v1/en_us/explore2/index.json (story-preview + comic link-out modules; complete — newest story 2025-03-05),
  comics/index.json (series, one-shots, issue covers), story/<slug>/index.json (word-count, minutes-to-read). Images cmsassets.rgpub.io/sanity/images/dsfx7636/universe/<file>?w=N&fm=webp.
- Release dates: League Wiki Module:ChampionData/data (date, patch; via api.php revisions) + Leaguepedia Cargo Champions.ReleaseDate (fills
  Yunara/Zaahen/Locke; agrees ±1 day elsewhere). Wiki rows for Ambessa & Mel are copies of Ahri — patch not trusted. Universe search/index.json
  release-date = REVEAL date (~2 weeks early; Udyr = rework) — used only as "revealed" when 4–120 days before release.
- Abilities: DDragon championFull (mirror). Icons ddragon.leagueoflegends.com/cdn/16.20.1/img/{passive,spell}/<file>. Official clips (found on leagueoflegends.com/en-us/champions/<id>/):
  lol.dyn.riotcdn.net/x/videos/champion-abilities/<key 4-digit>/ability_<key>_<P|Q|W|E|R>1.{webm,mp4} — play when hotlinked from github.io.
- Lore cross-checks: League Wiki API leagueoflegends.fandom.com/api.php (action=parse, Relations section); Necrit's uploads
  (channel UCiUHGAbtjCrLO3ZPrTfle3Q) matched by champion names in titles.
- Esports: esports-api.lolesports.com/persisted/gw/ (getSchedule, getTeams, getStandings), header
  `x-api-key: 0TvQnueqKa5mxJntVWt0w4LpLfEkrV1Ta8rQBb9Z` (public key the official site uses). Worlds leagueId 98767975604431411,
  worlds_2026 tournament 115660540725177488. CORS works from github.io.

## Design system
Dark Hextech palette (gold accents on near-black navy). CSS tokens in each page's :root:
--f-display "Marcellus SC" (titles) · --f-body "Alegreya" · --f-mono "Spline Sans Mono" (labels) ·
--f-num "Teko" (all numbers: scores, counts, times, years; with tabular-nums). Fonts from Google Fonts.
Must work at phone width with no horizontal scroll (watch grid children: `min-width:0`).

## Working notes
- Test locally over http (`python3 -m http.server`), not file:// (WebGL/fetch break). Playwright works for screenshots.
- After pushing, check the live page (append `?v=N` to dodge cache).
- Commit messages end with the session's attribution lines.

## Ideas not started yet (ask Devdeep which next)
1. ~~Player pages~~ (done 2026-10-19; refresh players.js after the 2026 final).
2. ~~Music hub~~ (done 2026-10-19).
3. ~~Enrich Linked bonds~~ (done 2026-10-19; 129 still have no official explanation — revisit when Riot publishes more).
5. Champion size chart: built and REMOVED 2026-10-19 at Devdeep's request (didn't like it; too few official heights — only 12). Don't rebuild.
4. Custom domain (costs money yearly — conflicts with the zero-cost rule; only if Devdeep insists).
6. ~~Skins gallery~~ (done 2026-10-19). 
7. ~~Comics & short stories (Reading Room)~~ (done 2026-10-19).
8. ~~Champion release timeline~~ (done 2026-10-19).
9. ~~Champion journeys~~ (done 2026-10-20). 10. ~~Grouped menu + My champions~~ (done 2026-10-20). Agreed next, in order:
   11. ~~Daily guessing game~~ (done 2026-10-20; LoLdle modes studied: Classic, Quote, Ability, Emoji, Splash). 12. ~~Abilities + Daily Ability mode~~ (done 2026-10-20; also icon row in atlas.html panel). Next: LoL streamers.
