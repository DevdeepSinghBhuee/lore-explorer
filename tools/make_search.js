// Builds data/search.js (the site-wide search index used by site.js) from the other data files.
// Run from the repo root after changing champion, skin, item, story, player, video, music, TFT or finals data:  node tools/make_search.js
const fs=require("fs");const window={};
for(const f of ["champions","skins","reading","items","players","videos","music","tft","finals"])eval(fs.readFileSync("data/"+f+".js","utf8"));
const R=[],CH=Object.fromEntries(window.ATLAS_CHAMPS.map(c=>[c.id,c]));
// row: [kind, name, subtitle, url, champion id or extra]
window.ATLAS_CHAMPS.forEach(c=>R.push(["c",c.name,c.title,"journey.html?c="+c.id,c.id]));
for(const [id,list] of Object.entries(window.ATLAS_SKINS))list.forEach(s=>R.push(["s",s[1],CH[id]?CH[id].name:id,"skins.html#s-"+id+"-"+s[0],id]));
window.ATLAS_ITEMS.items.forEach(i=>R.push(["i",i.n,i.t||"",`items.html#i-${i.id}`,i.id]));
window.ATLAS_READ_STORIES.forEach(s=>R.push(["st",s.t,(s.by||"")+(s.min?" · "+s.min+" min":""),"reading.html#story-"+s.s,(s.ch||[])[0]||""]));
window.ATLAS_READ_COMICS.forEach(c=>R.push(["cm",c.t,"Comic","reading.html#comic-"+c.u.replace("/","--"),(c.ch||[])[0]||""]));
window.ATLAS_PLAYERS.players.forEach(p=>R.push(["p",p.name,[p.role,p.team].filter(Boolean).join(" · "),"players.html#p-"+p.id,""]));
window.ATLAS_VIDEOS.forEach(sh=>sh.v.forEach(v=>R.push(["v",v.t,[v.yr,sh.t].filter(Boolean).join(" · "),"theater.html#v-"+v.y,(v.ch||[])[0]||""])));
window.ATLAS_MUSIC.shelves.forEach(sh=>(sh.k||[]).forEach((k,n)=>R.push(["m",k[1],k[2]||sh.t,`music.html#t-${sh.id}-${n}`,""])));
window.ATLAS_TFT.sets.forEach(s=>R.push(["t","TFT Set "+s[0]+": "+s[1],s[2].slice(0,4),"tft.html#set-"+s[0],""]));
window.ATLAS_FINALS.forEach(f=>R.push(["f",(f.t==="worlds"?"Worlds ":"MSI ")+f.y+" final",f.w+" "+f.sc.join("–")+" "+f.l,`finals.html#${f.t}-${f.y}`,""]));
const seen=new Set(),out=R.filter(r=>{const k=r[0]+"|"+r[3];if(seen.has(k))return false;seen.add(k);return true;});
fs.writeFileSync("data/search.js","// Site-wide search index, built by tools/make_search.js. Row: [kind, name, subtitle, url, champion id or item id].\nwindow.ATLAS_SEARCH_IV="+JSON.stringify(window.ATLAS_ITEMS.ver)+";\nwindow.ATLAS_SEARCH="+JSON.stringify(out)+";\n");
console.log(out.length,"rows",fs.statSync("data/search.js").size,"bytes",Object.entries(out.reduce((a,r)=>(a[r[0]]=(a[r[0]]||0)+1,a),{})).join(" "));
