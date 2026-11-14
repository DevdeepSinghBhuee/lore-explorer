// Builds c/<id>.html: one tiny "share page" per champion, so a shared champion link shows that champion's own
// preview card (Discord, WhatsApp, X, Facebook… read these tags without running JavaScript). Visitors are sent straight on
// to journey.html?c=<id> (any #chapter is kept). Also rewrites the champion part of sitemap.xml.
// Run from the repo root:  node tools/make_share.js /path/to/champion.json
// champion.json = Riot's Data Dragon en_US champion list, from the InFinity54 mirror:
//   https://raw.githubusercontent.com/InFinity54/LoL_DDragon/master/latest/data/en_US/champion.json
// The description is Riot's own short blurb (never our own words). Rerun when a champion is added.
const fs = require("fs");
const SITE = "https://devdeepsinghbhuee.github.io/lore-explorer/";
const DD = "https://ddragon.leagueoflegends.com/cdn/img/champion/splash/";
global.window = {};
require(require("path").resolve("data/champions.js"));
const CHAMPS = window.ATLAS_CHAMPS;
const dd = JSON.parse(fs.readFileSync(process.argv[2], "utf8"));
const byDd = {};
Object.values(dd.data).forEach(c => (byDd[c.id] = c));

const esc = s => String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
// Riot cuts blurbs with "..."; show a clean ellipsis
const clean = s => s.replace(/\s*\.\.\.$/, "…").replace(/\s+/g, " ").trim();
const shorten = (s, n) => {
  if (s.length <= n) return s;
  const cut = s.slice(0, n - 1);
  return cut.slice(0, cut.lastIndexOf(" ")).replace(/[,;:—–-]+$/, "") + "…";
};

fs.mkdirSync("c", { recursive: true });
const missing = [];
for (const c of CHAMPS) {
  const r = byDd[c.dd];
  if (!r) { missing.push(c.id); continue; }
  const name = r.name, title = r.title;          // Riot: "Ahri", "the Nine-Tailed Fox"
  const head = `${name}, ${title}`;
  const blurb = clean(r.blurb);
  const desc = shorten(blurb, 158);
  const url = `${SITE}c/${c.id}.html`;
  const target = `../journey.html?c=${c.id}`;
  const img = `${DD}${c.dd}_0.jpg`;
  const html = `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>${esc(head)} · Lore Explorer</title>
<meta name="description" content="${esc(desc)}">
<link rel="canonical" href="${SITE}journey.html?c=${c.id}">
<meta property="og:type" content="profile">
<meta property="og:site_name" content="Lore Explorer">
<meta property="og:title" content="${esc(head)}">
<meta property="og:description" content="${esc(blurb)}">
<meta property="og:url" content="${url}">
<meta property="og:image" content="${img}">
<meta property="og:image:width" content="1215">
<meta property="og:image:height" content="717">
<meta property="og:image:alt" content="${esc(name)}'s splash art">
<meta name="twitter:card" content="summary_large_image">
<meta name="theme-color" content="#080d18">
<link rel="icon" href="../img/icon.svg" type="image/svg+xml">
<meta http-equiv="refresh" content="0;url=${target}">
<script>location.replace(${JSON.stringify(target)}+location.hash)</script>
<style>body{margin:0;background:#080d18;color:#ebe4d3;font:18px/1.55 Georgia,serif;padding:40px 20px}main{max-width:640px;margin:auto}a{color:#c8aa6e}small{color:#939bb0}</style>
</head>
<body>
<main>
<h1>${esc(name)}</h1>
<p><i>${esc(title.charAt(0).toUpperCase() + title.slice(1))}</i></p>
<p>${esc(blurb)}</p>
<p><a href="${target}">Open ${esc(name)}'s page on Lore Explorer</a></p>
<p><small>Lore Explorer was created under Riot Games' "Legal Jibber Jabber" policy using assets owned by Riot Games. Riot Games does not endorse or sponsor this project.</small></p>
</main>
</body>
</html>
`;
  fs.writeFileSync(`c/${c.id}.html`, html);
}
if (missing.length) { console.error("No Data Dragon entry for:", missing.join(", ")); process.exit(1); }

// sitemap: keep the page rows, replace the champion rows (Google indexes journey.html?c=<id>, the share pages point there)
const today = new Date().toISOString().slice(0, 10);
let sm = fs.readFileSync("sitemap.xml", "utf8").replace(/\n?\s*<!-- champions -->[\s\S]*?<!-- \/champions -->/, "");
const rows = CHAMPS.map(c => `  <url><loc>${SITE}journey.html?c=${c.id}</loc><lastmod>${today}</lastmod><priority>0.6</priority></url>`).join("\n");
sm = sm.replace("</urlset>", `  <!-- champions -->\n${rows}\n  <!-- /champions -->\n</urlset>`);
fs.writeFileSync("sitemap.xml", sm);
console.log(`${CHAMPS.length} share pages written to c/, sitemap has ${CHAMPS.length} champion rows (Data Dragon ${dd.version})`);
