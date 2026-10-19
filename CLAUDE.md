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
| index.html | The Atlas: painted terrain map (canvas → SVG `<image>`), region themes (THEMES), WebGL depth-parallax banners (Scene class, Depth Anything V2 depth maps in assets/), "web of bonds" relationship graph (renderWeb: all champions of the region + outside partners of the selected champion), champion detail panel (bio, official Universe stories, LoR cards, Riftbound cards, videos). Deep link `#c-<id>`. |
| worlds.html | Live Worlds 2026: hero scoreboard + countdown, schedule tabs in viewer's time zone, 19 teams + rosters, anthem, champions history 2011–2025. Refreshes every 60 s; falls back to WORLDS_SNAPSHOT. |
| library.html | 1,647 Legends of Runeterra cards, filters, card dialog, deep links. |
| riftbound.html | 1,407 Riftbound TCG cards, domain chips; images hotlinked from Riot CDN. |
| theater.html | 147 official videos in 8 shelves, youtube-nocookie embeds, `#v-<id>`. |
| players.html | 97 Worlds 2026 players: search/role/team filters (`?team=CODE`), dossier dialog with 6 signature champions (link to Atlas `#c-<id>`) and a Worlds timeline. Deep link `#p-<slug>`. Worlds rosters link here. |
| music.html | Music hub: 13 shelves (anthems, virtual bands, Arcane S1/S2/score, Pentakill, Star Guardian, login themes from videos.js, champion songs, Warsongs, DJ Sona, LoR, long listens). One docked YouTube IFrame-API player (youtube-nocookie; kept ≥200px tall per YouTube's rules) plays a shelf in order, shuffle, Media Session controls. Deep links `#s-<shelf>`, `#t-<shelf>-<n>`. |

Nav on every page: Atlas(./) · Worlds · Players · Music · Library · Riftbound · Theater. Every footer carries Riot's
"Legal Jibber Jabber" fan-content notice — keep it on any new page.

## Data (data/*.js, plain globals)
champions.js (173 champs: id, dd, name, title, region, role, tags, bio, hand) · cards.js · stories.js ·
champcards.js · riftbound.js (RB_SETS, RB_CARDS) · champrb.js · videos.js (ATLAS_VIDEOS shelves) ·
worlds.js (WORLDS_TEAMS, WORLDS_SNAPSHOT) · players.js (ATLAS_PLAYERS, saved 2026-10-19) · music.js (ATLAS_MUSIC shelves, saved 2026-10-19). Bonds live in index.html; 236 are generic "Linked" bonds that
could be enriched from official stories.

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
3. Enrich the 236 generic "Linked" bonds using official stories.
4. Custom domain.
