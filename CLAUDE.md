# Lore Explorer (formerly Runeterra Atlas) — project notes for Claude

Free, fan-made League of Legends universe site. Owner: Devdeep (not a coder — he wants to see results,
Claude takes full technical responsibility; explain outcomes in plain words, not code).
**Hard rule: zero cost.** No paid APIs, hosting, credits or assets. Free for him and for every visitor.

Live: https://devdeepsinghbhuee.github.io/lore-explorer/  ·  Repo: DevdeepSinghBhuee/lore-explorer (branch main)
**Renamed 2026-10-22** from "Runeterra Atlas" / "Runeterra Daily" to **Lore Explorer** / **Lore Explorer Daily** (repo + address too) so the brand uses no
Riot names (Riot's Legal Jibber Jabber §5: no Riot trademarks in domains, social accounts or search tags; trademarks not "anywhere in your Project").
Runeterra as the WORLD in the content stays ("The map of Runeterra"); "Runeterra cards" = Legends of Runeterra. Never register a domain or social
account with Riot names (also no paid domain — zero cost). Launch posts: no #LeagueOfLegends-style hashtags ("search tags").
Riot §3 "No unauthorized games or apps" (champion appearance, abilities, icons): Devdeep chose to keep the Daily games, like LoLdle/Riftdle do under
the same policy; if Riot ever asks, take them down. Internal names (localStorage atlas.*, AtlasI18n, atlas.html, ATLAS_* globals) were kept on purpose
so visitors' progress carries over.
Hosting: GitHub Pages, deploys ~1 min after push. Static HTML/CSS/JS, **no build step, no framework**.
Custom domain is possible later via Pages settings + CNAME file (not set up).

## Pages
| File | What it is |
|---|---|
| index.html | FRONT PAGE = Runeterra Daily (the game, formerly daily.html) + an "Explore Runeterra" strip of 7 cards. A tiny head script forwards old Atlas links (`/#c-<id>`, `/#<region>`) to atlas.html. daily.html is now only a redirect to ./ (keeps the hash). |
| atlas.html | The Atlas (moved from index.html on 2026-10-20; link champions as `atlas.html#c-<id>`): painted terrain map (canvas → SVG `<image>`), region themes (THEMES), WebGL depth-parallax banners (Scene class, Depth Anything V2 depth maps in assets/), "web of bonds" relationship graph (renderWeb: all champions of the region + outside partners of the selected champion), champion detail panel (bio, official Universe stories, LoR cards, Riftbound cards, videos). Deep link `#c-<id>`. |
| journey.html | Champion Journeys: `?c=<id>` = guided tour in up to 9 chapters (who they are + region; read first = their "-color" story else shortest, other stories, comics; watch = videos.js minus login/making/music, own cinematics first, play in place; listen = login theme + music videos + music.js tracks naming them; bonds; 6 rarest skins; LoR + Riftbound cards; arrival stats; where next = official bonds + same-region picks). Chapter 2 "How they play" (`#play`): passive+QWER tabs with Riot icon, description, cooldown/cost/range and the official preview clip (autoplay muted loop). No `?c` = picker by region with search + Surprise me. Empty chapters are skipped. Linked from Atlas panel, Timeline and Skins plates. |
| (daily game, in index.html) | Runeterra Daily (LoLdle-style, our data only): 4 modes per day — Ability (one ability icon, greyscale + rotated 90/180/270; colour after 3 misses, upright after 5; bonus: which of the 5 abilities) · Clues (region, class=tags partial, range, resource, release year ↑↓ ±2 = close, skin count ↑↓ ±2), Splash (DDragon splash zoom 6×→1× per miss, seeded focal point; bonus: pick the skin of 4), Lore (bio in 5 word-chunks, name parts redacted, region hint at 3 misses, class at 5). Puzzle #1 = 2026-10-20 (visitor's local date); each mode walks a fixed seeded shuffle of all champions. State/streaks in localStorage atlas.daily.* (every guess saved at once; also atlas.daily.view = last mode/practice, atlas.daily.practice = practice rounds per mode, sessionStorage draft of the typed guess). site.js shows a "Back to your puzzle" chip on every other page while a today's puzzle is unfinished; share = emoji grid; practice rounds unlimited (no stats); reveal after 8 guesses. `#clues|#splash|#ability|#lore|#voice|#quote|#item`. 5th mode **Voice** (2026-10-21): 5 different champions a day = the next 5 places of ORDER.voice ((n-1)*5…), one line each, 3 guesses per round (miss 1 → region, miss 2 → class), reveal + "Next voice", results list with replay buttons; score /5, day "won" at ≥3 (streak), dist = score 0–5, share 🟩 first try/🟨 later/🟥. State {rounds:[{g,done,ok}],cur,g(all guesses),won,lost,score}. Line = seeded pick from pick/ban (CommunityDragon, visitor's language) + spoken joke/taunt (Wiki); lines whose quoted words say the champion's own name are skipped (Neeko → a laugh). Loads data/voice.js lazily. 6th mode **Quote** (2026-10-25): quotesOf(id) = spoken words (inside quotes) of voice.js pick/ban/joke/taunt/dance + interactions.js lines the champion speaks (multi-speaker dialogue rows dropped), never one saying their own name, ≥12 chars; own lines first, lines about others last; up to 4 shown one per miss, region at 4 misses, class at 6; champions with <3 quotes are skipped (Bard, Malphite, Rammus, Rek'Sai); English quotes with a note. 7th mode **Item** (2026-10-25): ORDER.item = seeded shuffle of the 126 Legendary + Boots items (data/items.js, lazy) ; icon blurred 7px→0 (−1.6/miss) + grey until 3 misses; clues cost (1 miss), first stat (2), all stats (4), effect names (5); guess rows show cost with ↑/↓ (answer costs more/less; gold frame = within 300) + shared stat count; item names/stats in the visitor's language from data/i18n/items-<code>.js (DDragon per locale: id → [name, stats, effect names]); separate input #ii/#isugg (wireItem), result links to items.html#i-<id>. Modes grid 4 columns (2 on ≤1100px, Item spans 2). site.js "Back to your puzzle" knows both. Keys m_quote/md_quote/m_item/md_item/how_quote/how_item/q_*/i_* + new intro in all 17. Emoji and skin-line modes NOT built (emoji would be invented content; skin line overlaps Splash). **Stream mode** (2026-10-22, Devdeep's "streamer-friendly Daily"): button "Stream mode" under the countdown, or `?stream` / `?stream=<CODE>#<mode>`. Fresh rounds (puzzle() with practiceSeed = codeSeed(code) = 1000+hash("stream|"+code)%100000) so today's puzzles aren't spoiled for chat and stats/streaks are never touched; each mode keeps its own 4-char code (alphabet without 0/O/1/I/L); anyone opening the round link plays the same round. html.stream hides the menu, intro, countdown, how-to, explore cards, mode status chips and footer credits (Riot legal line stays); red stream bar = code, running score (found / played, localStorage atlas.daily.stream {m:{mode:{code,state}},tally:{played,found,seen}}), New round, Reset score, Exit, "Play along at <site address>". Finished round → Next round (focused, so Enter works), Copy round link, journey link. Play column zoom 1.12 at ≥1100px. Text keys s_* + how_stream in all 17 languages. |
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
| beyond.html | Beyond the Rift (2026-10-25): League champions in Riot's other games and shows. Champion finder (datalist + Surprise me, `#c-<id>`) lists every appearance; shelf of 12 cover cards (img/beyond/*.webp) opens a roster panel (`#g-<id>`): 2XKO = portraits (cmsassets, hotlinked) + archetype/likes/dislikes from the official site; Wild Rift = 141 tiles + "not on Wild Rift yet" list; TFT = 25 sets (no revival/mode variants) → that set's champions with TFT skin + cost; LoR/Riftbound = champions with cards (ATLAS_LOR/ATLAS_RB); Arcane + 6 Riot Forge games = playable/major/cameo (main/supporting cast). English only. journey.html chapter "beyond" (after cards, translated: keys it_beyond*, j_beyond*, b_* in all 17) uses ATLAS_BEYOND.of(id). Menu: Champions group. |
| seasons.html | The Seasons (2026-10-25): themed seasons 2025+ (6 cards, newest first; key art img/seasons/s<year>-<n>[a|b].webp switches per act, logo-<year>-<n>.webp; act tabs → champions chips, skin portraits (skins.js row[7] CD path else DDragon loading) linking skins.html#s-, stories & cinematics (▶ to theater.html#v- when the title is in videos.js), game modes); the live act gets an "On now" badge (date-computed). Then one row per year 2026→2009: Wiki-dated line, Worlds final (worlds.html HIST), new champions (releases.js), VGUs 2018–20. `#s-<year>-<n>`, `#y<year>`. English only. Menu: Lore group. |
| items.html | The Armory (2026-10-25): every item buyable on Summoner's Rift (211, duplicates by name dropped). Search (name/effects/stats), role chips (Wiki menu roles), type chips (Legendary, Boots, Epic, Basic, Starter, Consumable, Trinket, New in 2026), sort tier/cost/A–Z; icon wall grouped by tier with cost; sticky plate = type/roles, cost/sell, Wiki lore quote, plaintext, stats, passives/actives, builds from/into (clickable). Icons hotlinked ddragon.leagueoflegends.com/cdn/<ver>/img/item/<id>.png. `#i-<id>`. English only. Menu: Play group. |
| patches.html | Patch Calendar (2026-10-25): next patch card (computed from today in Pacific Time; days to go, patches left) + latest patch card (Riot art hotlinked from cmsassets news_live, tagline, notes link), then every 2026 patch grouped by themed season (seasons.js), future ones dashed. Data data/patches.js. Update when Riot publishes 2027 dates (support page) and add each new patch's notes URL/tagline/art (URL pattern since 26.4: league-of-legends-patch-26-N-notes; 26.1–26.3: patch-26-N-notes). Menu: Play group. |
| gallery.html | The Collection (2026-10-25): every profile icon (5,116), emote (2,423) and ward skin (266) from the game client (data/gallery.js = ATLAS_GALLERY {desc, icons [id,title,year,legacy,descIdx,esportsTeam,esportsEvent,path?], sets [name,[ids]], emotes [id,name,path,[champIds],desc], wards [id,name,desc,legacy,path?]}). Tabs Icons/Emotes/Wards, filters (search, year, icon set, esports teams; League/TFT emotes; legacy wards), 120 per page + Show more, dialog with big picture + Riot description (emote → champion chips to journeys; icon set chip filters). Images hotlinked from CommunityDragon latest/plugins/rcp-be-lol-game-data/global/default/<path> (lazy); all 7,805 checked loading 2026-10-25; 86 old team icons + 7 mastery emotes with no image in the client were dropped. `#icons|#emotes|#wards`, `#icon-<id>|#emote-<id>|#ward-<id>`. English only. Menu: Champions group. |
| tft.html | Teamfight Tactics (2026-10-25): strip of 25 sets (newest first) → set header, trait chips (Wiki SVG icons; tap = dim other units + trait box with effect and (count) bonuses), units by cost (TFT cost colours --c1…--c5) as Wiki renders hotlinked (images/thumb/<f>/240px-<f>, falls back to the full file when there is no thumb), champion units link to journeys. Little Legends gallery from CommunityDragon companions.json (lowest tier of each look; grid uses small copies img/tft/ll/<slug>.webp (126, ~630 KB; Riot's files are ~200 KB each), full looks hotlinked only in the species panel; kinds LittleLegend 77 / Chibi 41 / Style2 8; species panel with Riot description + every look by rarity colour; icons hotlinked CD). `#set-<n>`. Data data/tft.js. Linked from beyond.html TFT panel. English only. Menu: Play group. |
| rift.html | The Rift (2026-10-25): every monster on Summoner's Rift (patch 26.x roster: Atakhan removed in 26.01 → "Gone from the Rift" note). Sticky map (img/rift/map.webp = DDragon map11 recoloured to the palette) with 2 pit markers (Baron pit: grubs/herald/baron; Dragon pit: 6 drakes + Elder) + both sides' camps; detail plate (art, about, reward, soul, Baron's 3 forms as text, facts, Wiki link); "first twenty minutes" clock (desktop axis, phone list); card groups epic / dragons (4-step rules) / buffs / camps. Deep link `#m-<id>`. Data data/rift.js. English only (not in TRANSLATED). "Painted in the lore" (2026-10-25, Devdeep: "lore accurate, eye-catching"): ATLAS_RIFT.lore id → [[file, title, source, artist]] in img/rift/lore/*.webp (1600w) — LoR card full art (05DE015 Mountain, 08IO012 Ocean, 08DE025 Cloud, 08PZ028 Chemtech, 08RU014 + T9 Elder, 04MT004 Blue Sentinel = summons Crest of Insight, Lab of Legends 99NU001 Herald / 99NU002 Baron / 99NU003 Crimson Raptor / 99NU004 Ancient Krug, PoC 98RU014 Baron), the Chemtech+Hextech preseason splash (Hextech, Chemtech 2nd) and Postcards from the Rift 02 (Infernal). Thumbnails swap, click = dialog. None found for grubs, red, gromp, wolves, scuttle (Riftbound art has card frames/text; Murkwolf Shaman is a person). |

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
UI source files (phases 1–3) were in a session scratchpad; copies now live on branch phase4-translations in tools/i18n/ (see its README).
Still English on main: Atlas map/regions, Worlds, Players, Theater, Music, card libraries, bond notes, video and comic titles.
Phase 4 = PAUSED 2026-10-21 at Devdeep's request ("limit language change to the pages already done"). Do NOT merge unless he asks.
Everything is on branch **phase4-translations** (pushed, not deployed): rest of atlas.html (hero, map labels, region tag/desc, design notes),
worlds.html, players.html (countries via Intl.DisplayNames), theater.html, music.html, library.html (Riot's LoR text from data/i18n/lor-<lang>.js,
13 langs, no zh-CN/vi/id; localized card PNGs from InFinity54 LoR_DDragon_Set<N|6cde|7b>/img/cards/<loc>/ — cards.js got "sr" for 6cde/7b),
riftbound.html (data/i18n/rb-<lang>.js: ko/zh-CN/zh-TW cards + set names; game terms = Riot's own labels, English where Riot shows English),
all 16 UI files + site.js TRANSLATED=1 for every page. Tested ko/ru/de/th/zh-CN/en desktop+phone: no errors, no horizontal scroll.
Not yet re-tested: ja, pl, es-MX, tr, it, fr, pt-BR, vi, id. Thai region/champion names follow Riot's Thai data (English names).
To ship it later: checkout the branch, run tools/i18n/t_p4.py for the untested languages, merge into main, update this file.
Arabic (RTL, no Riot data) not started.
Voice lines (2026-10-21): voice.js (window.AtlasVoice.mount(el, champ), lazy-loads data/voice.js) shows a "Voice lines" row of speaker buttons —
Pick, Ban, Joke (Ctrl 1), Taunt (Ctrl 2), Dance (Ctrl 3), Laugh (Ctrl 4); one sound at a time, clicking again plays the next line, caption = Wiki transcript.
Used in the atlas.html champion panel (#voxBox, right under the hero) and the journey.html "Listen" chapter (always shown now). Pick/ban audio = Riot's game
client via CommunityDragon global/<locale>/v1/champion-{choose,ban}-vo/<key>.ogg, in the visitor's language for ko, zh-CN, ja, es-ES, es-MX, pt-BR, fr, de,
it, pl, ru, tr (Riot has no zh_tw/vi/th/id there → English); all 173 × 13 checked 2026-10-21. Emotes = base-skin files on static.wikia.nocookie.net from the
League Wiki <Champion>/LoL/Audio pages (api.php action=parse; first occurrence of each section; skins other than Original dropped); English only.
static.wikia refuses audio requests with a github.io Referer (MediaError 4), so voice.js fetches Wiki files with referrerPolicy no-referrer
(CORS is allowed) and plays a blob URL. Sound-effect-only rows ("SFX") are dropped; no Wiki audio page for Ambessa, Mel, Locke, Yunara, Zaahen
(pick/ban only); Rammus's page didn't parse (pick/ban only).
Conversations (2026-10-25): ix.js (window.AtlasIX.mount(el, id, {limit, title}), lazy-loads data/interactions.js = ATLAS_IX rows [speaker, others "a|b", context, transcript, file]; 3,373 lines, base voice set only = first <tabber> tab of <Champion>/LoL/Audio; every champion appears in at least one). Partner chips sorted by line count (both directions), 12 lines + Show all, play = Wiki MP3 transcode wiki.leagueoflegends.com/en-us/images/transcoded/<f>/<f>.mp3 (works on iPhone; Ogg fallback; hotlinking from github.io works), stops AtlasVoice. Used in journey.html chapter "talk" (after people; dropped + renumbered if empty) and atlas.html panel (#ixBox under the bonds). Keys j_talk, j_talk_sub, ix_* in all 17.
Devdeep also asked for stories read aloud in the champion's own voice — DECLINED (would mean AI-cloning real voice actors and reproducing Riot's story
text); don't build it. Files are Ogg Vorbis: older iPhones/Safari may not play them (the row then says "This browser can't play this sound").
Menu: site.js (loaded with `defer` on every page) replaces each page's <nav class="nav"> with grouped dropdowns — Champions (Journeys, Skins, Timeline, Beyond the Rift) ·
Lore (Atlas = atlas.html, Reading Room, The Seasons) · Play (Daily = ./, The Rift = rift.html, The Armory = items.html, Patch Calendar = patches.html, Teamfight Tactics = tft.html) · Esports (Worlds, Players) · Watch & Listen (Theater, Music) · Card games (Runeterra cards, Riftbound) · ★ My champions;
phone = star + "Menu" sheet. Edit GROUPS in site.js to change it (the plain links left in each page are only a no-JS fallback).
site.js also owns window.AtlasMine (localStorage atlas.mine.favs / atlas.mine.read): any `[data-fav="<id>"]` is a star button (add
`data-fav-label` for the text label), any `[data-read="<slug>"]` badge shows when read, and clicking a Universe story link marks it read.
Every footer carries Riot's
"Legal Jibber Jabber" fan-content notice — keep it on any new page.

## Data (data/*.js, plain globals)
champions.js (173 champs: id, dd, name, title, region, role, tags, bio, hand) · regions.js (ATLAS_REGIONS) · bonds.js (ATLAS_BONDS; atlas.html reads both) · cards.js · stories.js ·
champcards.js · riftbound.js (RB_SETS, RB_CARDS) · champrb.js · videos.js (ATLAS_VIDEOS shelves) ·
worlds.js (WORLDS_TEAMS, WORLDS_SNAPSHOT) · players.js (ATLAS_PLAYERS, saved 2026-10-19) · music.js (ATLAS_MUSIC shelves, saved 2026-10-19) · skins.js (ATLAS_SKINS by champion + ATLAS_SKIN_LINES, saved 2026-10-19, patch 16.20) · reading.js (ATLAS_READ_STORIES, ATLAS_READ_COMICS, ATLAS_READ_SERIES, saved 2026-10-19) · game.js (ATLAS_GAME id → [resource, Melee/Ranged]; DDragon 16.20.1, Gnar = Ranged per Wiki) · abilities.js (ATLAS_ABILITIES id → [key, [[passive name, desc, icon], [name, desc, icon, cd, cost, range]×4]]; DDragon 16.20.1) · abilityvideos.js (ATLAS_ABILITY_VIDEOS key → "PQWER" slots that have a clip; 856/865) · releases.js (ATLAS_RELEASES id → [released, patch, revealed]) · voice.js (ATLAS_VOICE id → {k: champion key, p/b: pick/ban transcript, j/t/d/l: [[wiki image path, transcript]]}; saved 2026-10-21) · beyond.js (ATLAS_BEYOND {games:[{id,name,kind,by,date,note,img,url,roles}], tftSets [num,name,date], tft id → [[set,skin,cost,traits,ability]], x2 id → [archetype,likes,dislikes,img], wr id → slug} + of(id); saved 2026-10-25) · seasons.js (ATLAS_SEASONS {themed:[{id,name,year,n,theme,end,img,logo,acts:[{act,start,champs,skins:[[name,id,num,line]],media:[[kind,title,yt]],modes}],wiki}], years:[{y,name,line,img,wiki,vgu,worlds}], worlds2025}; saved 2026-10-25) · items.js (ATLAS_ITEMS {ver, items:[{id,n,g,s,t,r,q,p,st:[[value,label]],fx (HTML <b>/<br>),from,into,new}]}; DDragon 16.21.1 + Wiki Module:ItemData/data; saved 2026-10-25) · interactions.js (ATLAS_IX, see Conversations; saved 2026-10-25) · patches.js (ATLAS_PATCHES [patch, date, notes url, tagline, art]; saved 2026-10-25) · tft.js (ATLAS_TFT {sets, units set → [[name, champId|null, skin, cost, traits, ability, render]], traits set → name → [type, icon, effect, [[n, bonus]]], legends species → {t, d, v:[[name, rarity, icon, default]]}}; saved 2026-10-25) · gallery.js (ATLAS_GALLERY, see gallery.html; CommunityDragon profile-icons.json, profile-icon-sets.json, summoner-emotes.json, ward-skins.json; saved 2026-10-25) · rift.js (ATLAS_RIFT {groups, monsters (17: pos = [blue/top, red/bottom] map fractions, spawn, respawn, gold, exp, hp, about, reward, soul/trait for drakes), timeline, removed}; saved 2026-10-25; images img/rift/<id>-icon.webp + <id>-art.webp). Bonds (data/bonds.js) are [a,b,type,note,source,necritVideo]; source r = Riot Universe text, w = League Wiki Relations,
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
- Items: DDragon latest/data/en_US/item.json from the InFinity54 mirror (map 11, purchasable, not hideFromAll/requiredChampion, id<100000);
  League Wiki Module:ItemData/data (type, menu roles, caption = lore quote; read in the browser pane). Refresh after big item patches.
- TFT: League Wiki Module:TFTUnitData/data + Module:TFTTraitData/data (Lua, read in the browser pane; nested {{as|…}} templates cleaned iteratively),
  CommunityDragon …/global/default/v1/companions.json (Little Legends). Add the new set when Riot releases it.
- Seasons: League Wiki season pages (Welcome to Noxus, Spirit Blossom Beyond, Trials of Twilight, For Demacia, Pandemonium, Season 3 (Season 2026);
  Thematic Season infobox + "=== Act I/II ===" lists; Season One…Season 2024 intros for dates). Add a new card when Riot starts the next season (2027).
- Beyond the Rift: 2xko.riotgames.com/en-us/champions/<id>/ (meta + main text: Archetype/Likes/Dislikes), wildrift.leagueoflegends.com/en-us/champions/ (links),
  League Wiki Module:TFTUnitData/data (Lua, every set; mid-sets 3.5…9.5 kept, x.1/x.2/x.6 revivals dropped), TFT:<set> pages (release dates), "Champions"
  sections of Ruined King / The Mageseeker / Song of Nunu / Hextech Mayhem / CONVRGENCE / Bandle Tale, Universe:Arcane (TV Series) Contributions (English cast);
  Wikipedia infoboxes for TFT/LoR/Wild Rift/Arcane/2XKO dates. Covers: Wiki cover files; 2XKO/TFT og images (cmsassets), LoR share image. Recheck when 2XKO or Wild Rift add champions.
- Rift lore paintings: LoR set cards from the InFinity54 LoR_DDragon_SetN mirrors (<code>-full.png); Lab of Legends/PoC cards (99NU*, 98RU*) and Riot
  promo art from the League Wiki file pages (Universe:Dragon, Universe:<monster>, LoR:<card>), read in the browser pane, canvas → webp.
- Rift monsters: League Wiki wiki.leagueoflegends.com/en-us/api.php (action=parse; rendered .infobox for spawn/respawn/gold/exp/hp; patch notes
  V26.01 for the Atakhan removal), read in the browser pane. Marker positions measured from the Wiki location maps against DDragon map11.png
  (CommunityDragon 2dlevelminimap images are blocky — don't use). Wiki credited (CC BY-SA 3.0) in the footer. Recheck after big patches.
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
- Pages can silently skip a deploy (happened 2026-10-21 for the Voice game): `gh run list -R DevdeepSinghBhuee/runeterra-atlas -L 3` shows
  each deployment; if the latest push has none, push an empty commit to re-trigger it.
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
   11. ~~Daily guessing game~~ (done 2026-10-20; LoLdle modes studied: Classic, Quote, Ability, Emoji, Splash). 12. ~~Abilities + Daily Ability mode~~ (done 2026-10-20; also icon row in atlas.html panel). 13. ~~Champion voice lines~~ (done 2026-10-21; Devdeep's "one more cool thing"). Next: LoL streamers. Earlier agreed: link previews + SEO, streamer-friendly Daily, launch plan.
