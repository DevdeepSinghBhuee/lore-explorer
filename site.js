/* Lore Explorer: shared site menu + "My champions" (favourites and stories read, kept in this browser only).
   Every page loads this file. It
   1. replaces the plain link list in <nav class="nav"> with the grouped menu (the plain links stay in the HTML as a fallback),
   2. exposes window.AtlasMine for favourites and read stories,
   3. wires any element with data-fav="<champion id>" as a star button, and marks a story read when a Universe story link is opened,
   4. keeps [data-read="<story slug>"] badges and [data-fav] stars in sync across the page. */
(function(){
  "use strict";
  var I=window.AtlasI18n||null;
  if(I&&/^(ko|ja|zh|th)/.test(I.lang))document.documentElement.classList.add("cjk");
  function T(k,v){return I?I.t(k,v):k;}
  var TRANSLATED={"index.html":1,"daily.html":1,"journey.html":1,"atlas.html":2,"skins.html":1,"timeline.html":1,"reading.html":1,"mine.html":1};   // 2 = partly   // pages whose own text is translated so far (the menu is translated everywhere)
  /* Site map (2026-10-26): 5 sections. Pages that belong together share one menu entry and a tab strip under the header (TABS). */
  var DAILY="daily.html";
  var GROUPS,TABS;
  function makeGroups(){
    TABS={
      cos:[["skins.html",T("it_skins")],["makeovers.html",T("it_makeovers")],["gallery.html",T("it_gallery_t")]],
      hist:[["timeline.html",T("it_timeline")],["seasons.html",T("it_seasons")]],
      game:[["rift.html",T("it_rift")],["items.html",T("it_items")],["patches.html",T("it_patches")]],
      cards:[["library.html",T("it_lor")],["riftbound.html",T("it_rb")]],
      esp:[["worlds.html",T("it_worlds")],["players.html",T("it_players")],["finals.html",T("it_finals")]],
      watch:[["theater.html",T("it_theater")],["music.html",T("it_music")]]
    };
    GROUPS=[
    {t:T("g_champions"),items:[["journey.html",T("it_champs"),T("it_champs_d")],["skins.html",T("it_cos"),T("it_cos_d"),"cos"],["beyond.html",T("it_beyond"),T("it_beyond_d")]]},
    {t:T("g_lore"),items:[["atlas.html",T("it_atlas"),T("it_atlas_d")],["reading.html",T("it_reading"),T("it_reading_d")],["timeline.html",T("it_history"),T("it_history_d"),"hist"]]},
    {t:T("g_play"),items:[[DAILY,T("it_daily"),T("it_daily_d")],["rift.html",T("it_game"),T("it_game_d"),"game"],["tft.html",T("it_tft"),T("it_tft_d")],["library.html",T("it_cards"),T("it_cards_d"),"cards"]]},
    {t:T("g_esports"),link:["worlds.html","esp"]},
    {t:T("g_watch"),link:["theater.html","watch"]}
  ];}
  function tabSetOf(f){for(var k in TABS)if(TABS[k].some(function(x){return x[0]===f;}))return k;return null;}
  var KEY_F="atlas.mine.favs", KEY_R="atlas.mine.read";

  /* ---------- storage (wrapped: private windows and blocked storage must not break pages) ---------- */
  function load(k){try{var v=JSON.parse(localStorage.getItem(k)||"null");return v&&typeof v==="object"?v:null;}catch(e){return null;}}
  function save(k,v){try{localStorage.setItem(k,JSON.stringify(v));}catch(e){}}
  var favs=load(KEY_F)||[];            // [champion id, …] in the order starred
  var read=load(KEY_R)||{};            // {story slug: "YYYY-MM-DD"}
  if(!Array.isArray(favs))favs=[];
  var listeners=[];
  function changed(){save(KEY_F,favs);save(KEY_R,read);sync();listeners.forEach(function(f){try{f();}catch(e){}});updateCount();}
  var Mine={
    favs:function(){return favs.slice();},
    isFav:function(id){return favs.indexOf(id)>=0;},
    toggleFav:function(id){var i=favs.indexOf(id);if(i>=0)favs.splice(i,1);else favs.push(id);changed();return i<0;},
    read:function(){var o={};for(var k in read)o[k]=read[k];return o;},
    isRead:function(slug){return !!read[slug];},
    markRead:function(slug){if(!slug||read[slug])return;read[slug]=new Date().toISOString().slice(0,10);changed();},
    unmarkRead:function(slug){if(read[slug]){delete read[slug];changed();}},
    onChange:function(f){listeners.push(f);},
    clear:function(){favs=[];read={};changed();}
  };
  window.AtlasMine=Mine;
  // another tab changed it
  window.addEventListener("storage",function(e){if(e.key===KEY_F||e.key===KEY_R){favs=load(KEY_F)||[];read=load(KEY_R)||{};sync();updateCount();listeners.forEach(function(f){try{f();}catch(_){}});}});

  /* ---------- styles for the menu, stars and read badges ---------- */
  var css=`
.snav{display:flex;align-items:center;gap:2px;flex-wrap:wrap;position:relative;z-index:30}
.snav>a,.snav .sg>button{font-family:var(--f-mono,monospace);font-size:12px;letter-spacing:.14em;text-transform:uppercase;color:var(--muted,#939bb0);text-decoration:none;padding:8px 12px;background:none;border:1px solid transparent;cursor:pointer;display:inline-flex;align-items:center;gap:7px;line-height:1.2}
.snav>a:hover,.snav .sg>button:hover,.snav .sg.open>button{color:var(--text,#ebe4d3)}
.snav .sg>button::after{content:"";width:6px;height:6px;border-right:1.5px solid currentColor;border-bottom:1.5px solid currentColor;transform:rotate(45deg) translateY(-2px);opacity:.7}
.snav .here{color:var(--ink,#080d18)!important;background:var(--gold,#c8aa6e)!important}
.snav .sg{position:relative}
.snav .dd{position:absolute;top:calc(100% + 6px);left:0;min-width:270px;background:#0b1120;border:1px solid rgba(200,170,110,.35);box-shadow:0 18px 40px rgba(0,0,0,.6);padding:6px;display:none}
.snav .sg.open .dd{display:block}
.snav .dd a,.snav .sheet a{text-transform:none;letter-spacing:normal;font-size:inherit;font-family:inherit;background:none}
.snav .dd a[aria-current="page"],.snav .sheet a[aria-current="page"]{background:none;color:var(--text,#ebe4d3)}
.snav .dd a{display:block;padding:10px 12px;text-decoration:none;color:var(--text,#ebe4d3);border-left:2px solid transparent}
.snav .dd a b{display:block;font-family:var(--f-display,serif);font-weight:400;font-size:18px;line-height:1.15}
.snav .dd a span{display:block;font-family:var(--f-body,serif);font-size:14px;color:var(--muted,#939bb0);margin-top:2px}
.snav .dd a:hover,.snav .dd a:focus-visible{background:rgba(200,170,110,.08);border-left-color:var(--gold,#c8aa6e)}
.snav .dd a[aria-current="page"]{border-left-color:var(--gold,#c8aa6e)}
.snav .dd a[aria-current="page"] b{color:var(--gold,#c8aa6e)}
.snav .mine{margin-left:6px;border:1px solid rgba(200,170,110,.35)!important;color:var(--text,#ebe4d3)!important}
.snav .mine i{font-style:normal;color:var(--gold,#c8aa6e)}
.snav .mine.here i{color:var(--ink,#080d18)}
.snav .mine em{font-style:normal;font-family:var(--f-num,sans-serif);font-size:15px;letter-spacing:.02em;min-width:10px}
.snav .menu{display:none}
.snav .lang>button{border:1px solid rgba(200,170,110,.35)!important;margin-left:6px}
.snav .lang .lc{display:none}
.snav .lang>button i{font-style:normal;font-size:14px;letter-spacing:0}
.snav .lang .dd{left:auto;right:0;min-width:230px;max-height:70vh;overflow:auto}
.snav .lang .dd a{padding:7px 12px}
.snav .lang .dd a b{font-size:16px}
.snav .lang .dd a[aria-current="true"]{border-left-color:var(--gold,#c8aa6e)}
.snav .lang .dd a[aria-current="true"] b{color:var(--gold,#c8aa6e)}
.snav .lang .dd p{margin:4px 12px 8px;font-family:var(--f-body,serif);font-size:13px;color:var(--muted,#939bb0)}
.snav .sheet .langs{display:flex;flex-wrap:wrap;gap:6px}
.snav .sheet .langs a{border:1px solid rgba(200,170,110,.25);padding:6px 10px;font-size:15px}
.snav .sheet .langs a[aria-current="true"]{border-color:var(--gold,#c8aa6e);color:var(--gold,#c8aa6e)}
.snav .mine-n:empty{display:none}
@media (max-width:820px){
  .snav{gap:6px}
  .snav .sg{display:none}
  .snav .sg.lang{display:block}
  .snav .lang>button::after{display:none}
  .snav .lang>button .ln{display:none}
  .snav .lang>button .lc{display:inline}
  .snav .menu{display:inline-flex}
  header .snav,.snav{flex-wrap:nowrap!important}
  .snav .mine{margin-left:0}
}
@media (max-width:560px){
  .snav .mine .lbl{display:none}
  .snav .lang .lc{display:none!important}
  .snav .lang>button,.snav>a.mine,.snav .menu{padding:8px 10px!important;margin-left:0!important}
  .snav.sheet-open .sheet{display:block}
}
.snav.sheet-open{z-index:1000}
/* scripts without capital letters: wide letter-spacing pulls their characters apart */
.cjk .snav *,.cjk .resume,.cjk .resume *{letter-spacing:.02em!important}
html.cjk:not([lang="en"]) body *{letter-spacing:.02em!important}
.snav .sheet{display:none;position:fixed;inset:0;z-index:1000;background:#080d18;overflow:auto;padding:max(18px,env(safe-area-inset-top)) 20px 40px}
.snav .sheet .top{display:flex;justify-content:space-between;align-items:center;margin-bottom:10px}
.snav .sheet .top b{font-family:var(--f-display,serif);font-weight:400;color:var(--gold,#c8aa6e);font-size:22px;letter-spacing:.06em}
.snav .sheet .x{width:42px;height:42px;background:none;border:1px solid rgba(200,170,110,.35);color:var(--text,#ebe4d3);font-size:22px;cursor:pointer}
.snav .sheet h3{font-family:var(--f-mono,monospace);font-weight:400;font-size:11px;letter-spacing:.18em;text-transform:uppercase;color:var(--muted,#939bb0);margin:22px 0 6px}
.snav .sheet a{display:block;padding:9px 0;text-decoration:none;color:var(--text,#ebe4d3);border-bottom:1px solid rgba(200,170,110,.12)}
.snav .sheet a b{font-family:var(--f-display,serif);font-weight:400;font-size:21px}
.snav .sheet a span{display:block;font-size:14px;color:var(--muted,#939bb0)}
.snav .sheet a[aria-current="page"] b{color:var(--gold,#c8aa6e)}
.fav-btn{display:inline-flex;align-items:center;gap:7px;background:transparent;border:1px solid rgba(200,170,110,.4);color:var(--text,#ebe4d3);padding:8px 12px;font-family:var(--f-mono,monospace);font-size:11.5px;letter-spacing:.1em;text-transform:uppercase;cursor:pointer;line-height:1.2}
.fav-btn::before{content:"☆";font-size:15px;letter-spacing:0;color:var(--gold,#c8aa6e)}
.fav-btn[aria-pressed="true"]{background:rgba(200,170,110,.14);border-color:var(--gold,#c8aa6e)}
.fav-btn[aria-pressed="true"]::before{content:"★"}
.fav-btn:hover{border-color:var(--gold,#c8aa6e)}
.read-badge{display:none;font-family:var(--f-mono,monospace);font-size:10px;letter-spacing:.12em;text-transform:uppercase;color:#0b1120;background:#7fd1a0;padding:2px 6px;vertical-align:middle;margin-left:6px;white-space:nowrap}
.read-badge.on{display:inline-block}
.snav>a.top,.snav>button.srch{font-family:var(--f-mono,monospace);font-size:12px;letter-spacing:.14em;text-transform:uppercase;color:var(--muted,#939bb0);text-decoration:none;padding:8px 12px;background:none;border:1px solid transparent;cursor:pointer;display:inline-flex;align-items:center;gap:7px;line-height:1.2}
.snav>a.top:hover,.snav>button.srch:hover{color:var(--text,#ebe4d3)}
.snav>button.srch{border-color:rgba(200,170,110,.35);margin-left:6px;color:var(--text,#ebe4d3)}
.snav>button.srch svg{width:15px;height:15px;color:var(--gold,#c8aa6e)}
.snav .sheet .srch.wide{display:block;width:100%;text-align:left;margin:4px 0 6px;padding:12px 14px;background:#0f1a2e;border:1px solid rgba(200,170,110,.35);color:var(--muted,#939bb0);font:inherit;font-size:16px;cursor:pointer}
@media (max-width:1180px){.snav>button.srch .lbl{display:none}}
@media (max-width:980px){.snav>a.top{display:none}.snav>button.srch{margin-left:0;padding:8px 10px}}
/* section tabs: pages that are one place */
.stabs{display:flex;gap:4px;overflow-x:auto;scrollbar-width:none;margin:0 0 18px;border-bottom:1px solid rgba(200,170,110,.22);max-width:100%}
.stabs::-webkit-scrollbar{display:none}
.stabs a{flex:none;font-family:var(--f-mono,monospace);font-size:11.5px;letter-spacing:.12em;text-transform:uppercase;color:var(--muted,#939bb0);text-decoration:none;padding:11px 14px 10px;border-bottom:2px solid transparent;margin-bottom:-1px;white-space:nowrap}
.stabs a:hover{color:var(--text,#ebe4d3)}
.stabs a[aria-current="page"]{color:var(--text,#ebe4d3);border-bottom-color:var(--gold,#c8aa6e)}
/* search */
.qs{position:fixed;inset:0;z-index:2000;background:rgba(3,6,12,.78);display:none;align-items:flex-start;justify-content:center;padding:min(12vh,90px) 16px 16px}
.qs.on{display:flex}
.qs .box{width:min(680px,100%);max-height:min(78vh,720px);display:flex;flex-direction:column;background:#0b1120;border:1px solid rgba(200,170,110,.45);box-shadow:0 30px 80px rgba(0,0,0,.7)}
.qs .in{display:flex;align-items:center;gap:10px;padding:12px 14px;border-bottom:1px solid rgba(200,170,110,.22)}
.qs .in svg{width:18px;height:18px;color:var(--gold,#c8aa6e);flex:none}
.qs input{flex:1;min-width:0;background:none;border:0;outline:0;color:var(--text,#ebe4d3);font-family:var(--f-body,serif);font-size:19px}
.qs .x{background:none;border:1px solid rgba(200,170,110,.3);color:var(--text,#ebe4d3);font-size:20px;line-height:1;width:36px;height:36px;cursor:pointer;flex:none}
.qs input::-webkit-search-cancel-button{display:none}
.qs .res{overflow:auto;padding:6px 0 10px}
.qs h4{font-family:var(--f-mono,monospace);font-weight:400;font-size:10.5px;letter-spacing:.18em;text-transform:uppercase;color:var(--muted,#939bb0);margin:12px 16px 4px}
.qs a{display:flex;align-items:center;gap:12px;padding:7px 16px;color:var(--text,#ebe4d3);text-decoration:none;border-left:2px solid transparent}
.qs a img,.qs a i{width:34px;height:34px;flex:none;object-fit:cover;border:1px solid rgba(200,170,110,.25);background:#05080f;display:grid;place-items:center;font-style:normal;color:var(--gold,#c8aa6e);font-size:15px}
.qs a b{display:block;font-family:var(--f-display,serif);font-weight:400;font-size:17px;line-height:1.15}
.qs a small{display:block;font-size:13px;color:var(--muted,#939bb0);white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.qs a span{min-width:0}
.qs a.on,.qs a:hover{background:rgba(200,170,110,.09);border-left-color:var(--gold,#c8aa6e)}
.qs mark{background:none;color:var(--gold,#c8aa6e)}
.qs .none{padding:18px 16px;color:var(--muted,#939bb0)}
.qs .hint{padding:8px 16px;border-top:1px solid rgba(200,170,110,.15);font-family:var(--f-mono,monospace);font-size:10px;letter-spacing:.1em;text-transform:uppercase;color:var(--faint,#5b6580)}
@media (max-width:640px){.qs{padding:0}.qs .box{max-height:100%;height:100%;border:0}.qs .hint{display:none}}
`;
  var st=document.createElement("style");st.textContent=css;document.head.appendChild(st);

  /* ---------- menu ---------- */
  var file=(location.pathname.split("/").pop()||"index.html");
  if(file==="")file="index.html";
  var isHere=function(href,set){return (href==="./"&&(file==="index.html"))||href===file||(!!set&&tabSetOf(file)===set);};
  function esc(s){return String(s).replace(/[&<>"]/g,function(c){return {"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c];});}
  var countEl=null;
  function updateCount(){if(countEl)countEl.textContent=favs.length?String(favs.length):"";}
  function buildNav(){
    var nav=document.querySelector("header nav.nav");if(!nav)return;
    nav.classList.add("snav");
    var h='';
    GROUPS.forEach(function(g,gi){
      if(g.link){var on1=isHere(g.link[0],g.link[1]);h+='<a class="top'+(on1?" here":"")+'" href="'+g.link[0]+'"'+(on1?' aria-current="page"':'')+'>'+esc(g.t)+'</a>';return;}
      var on=g.items.some(function(it){return isHere(it[0],it[3]);});
      h+='<div class="sg" data-g="'+gi+'"><button type="button" aria-expanded="false" class="'+(on?"here":"")+'">'+esc(g.t)+'</button><div class="dd" role="menu">'+
        g.items.map(function(it){return '<a role="menuitem" href="'+it[0]+'"'+(isHere(it[0],it[3])?' aria-current="page"':'')+'><b>'+esc(it[1])+'</b><span>'+esc(it[2])+'</span></a>';}).join("")+'</div></div>';
    });
    h+='<button type="button" class="srch" aria-label="'+esc(T("search"))+'" title="'+esc(T("search"))+' ( / )"><svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="10.5" cy="10.5" r="6.5" fill="none" stroke="currentColor" stroke-width="2"/><path d="M15.5 15.5 21 21" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg><span class="lbl">'+esc(T("search"))+'</span></button>';
    var LANGS=I?I.LANGS:[["en","English"]],cur=I?I.lang:"en",curName="English";
    LANGS.forEach(function(l){if(l[0]===cur)curName=l[1];});
    var note=(cur!=="en"&&TRANSLATED[file]!==1)?'<p>'+esc(T(TRANSLATED[file]?"en_partial":"en_only"))+'</p>':'';
    var langLinks=function(cls){return LANGS.map(function(l){return '<a href="#" data-lang="'+l[0]+'" lang="'+l[0]+'"'+(l[0]===cur?' aria-current="true"':'')+(cls?'':' role="menuitem"')+'>'+(cls?esc(l[1]):'<b>'+esc(l[1])+'</b>')+'</a>';}).join("");};
    h+='<a class="mine'+(file==="mine.html"?" here":"")+'" href="mine.html"'+(file==="mine.html"?' aria-current="page"':'')+' title="'+esc(T("mine"))+'"><i>★</i><span class="lbl">'+esc(T("mine"))+'</span> <em class="mine-n"></em></a>';
    h+='<div class="sg lang"><button type="button" aria-expanded="false" title="'+esc(T("language"))+'" aria-label="'+esc(T("language"))+': '+esc(curName)+'"><i>🌐</i><span class="ln">'+esc(curName)+'</span><span class="lc">'+esc(cur.split("-")[0].toUpperCase())+'</span></button><div class="dd" role="menu">'+note+langLinks(false)+'</div></div>';
    h+='<button type="button" class="menu" aria-expanded="false" style="font-family:var(--f-mono,monospace);font-size:12px;letter-spacing:.14em;text-transform:uppercase;background:none;border:1px solid rgba(200,170,110,.35);color:var(--text,#ebe4d3);padding:8px 12px;cursor:pointer">'+esc(T("menu"))+'</button>';
    h+='<div class="sheet" role="dialog" aria-label="'+esc(T("menu"))+'"><div class="top"><b>Lore Explorer</b><button type="button" class="x" aria-label="'+esc(T("close_menu"))+'">×</button></div>'+
      '<button type="button" class="srch wide">'+esc(T("search_ph"))+'</button>'+
      GROUPS.map(function(g){
        if(g.link)return '<h3>'+esc(g.t)+'</h3>'+TABS[g.link[1]].map(function(it){return '<a href="'+it[0]+'"'+(isHere(it[0])?' aria-current="page"':'')+'><b>'+esc(it[1])+'</b></a>';}).join("");
        return '<h3>'+esc(g.t)+'</h3>'+g.items.map(function(it){return '<a href="'+it[0]+'"'+(isHere(it[0],it[3])?' aria-current="page"':'')+'><b>'+esc(it[1])+'</b><span>'+esc(it[2])+'</span></a>';}).join("");}).join("")+
      '<h3>'+esc(T("yours"))+'</h3><a href="mine.html"><b>★ '+esc(T("mine"))+'</b><span>'+esc(T("mine_d"))+'</span></a>'+
      '<h3>🌐 '+esc(T("language"))+'</h3>'+(note?note.replace('<p>','<p style="color:var(--muted,#939bb0);margin:0 0 8px">'):'')+'<div class="langs">'+langLinks(true)+'</div></div>';
    nav.innerHTML=h;
    countEl=nav.querySelector(".mine-n");updateCount();
    nav.addEventListener("click",function(e){var a=e.target.closest&&e.target.closest("[data-lang]");if(!a)return;e.preventDefault();var l=a.getAttribute("data-lang");if(I&&l!==I.lang)I.set(l);});
    var groups=[].slice.call(nav.querySelectorAll(".sg"));
    function closeAll(except){groups.forEach(function(g){if(g!==except){g.classList.remove("open");g.querySelector("button").setAttribute("aria-expanded","false");}});}
    groups.forEach(function(g){
      var b=g.querySelector("button"),t;
      b.addEventListener("click",function(e){e.stopPropagation();var o=!g.classList.contains("open");closeAll(g);g.classList.toggle("open",o);b.setAttribute("aria-expanded",String(o));});
      // hover opens on devices with a real pointer
      g.addEventListener("mouseenter",function(){if(matchMedia("(hover:hover)").matches){clearTimeout(t);closeAll(g);g.classList.add("open");b.setAttribute("aria-expanded","true");}});
      g.addEventListener("mouseleave",function(){if(matchMedia("(hover:hover)").matches){t=setTimeout(function(){g.classList.remove("open");b.setAttribute("aria-expanded","false");},180);}});
    });
    document.addEventListener("click",function(e){if(!nav.contains(e.target))closeAll();});
    document.addEventListener("keydown",function(e){if(e.key==="Escape"){closeAll();nav.classList.remove("sheet-open");}});
    var menu=nav.querySelector(".menu");
    menu.addEventListener("click",function(){nav.classList.add("sheet-open");menu.setAttribute("aria-expanded","true");document.documentElement.style.overflow="hidden";});
    nav.querySelector(".sheet .x").addEventListener("click",function(){nav.classList.remove("sheet-open");menu.setAttribute("aria-expanded","false");document.documentElement.style.overflow="";});
  }

  /* ---------- stars, read badges, auto-mark ---------- */
  var syncing=false;
  function sync(){
    if(syncing)return;syncing=true;
    var els=document.querySelectorAll("[data-fav]");
    for(var i=0;i<els.length;i++){var id=els[i].getAttribute("data-fav"),on=favs.indexOf(id)>=0;
      if(els[i].getAttribute("aria-pressed")!==String(on))els[i].setAttribute("aria-pressed",String(on));
      var lbl=els[i].getAttribute("data-fav-label");if(lbl!==null){var want=on?T("fav_in"):T("fav_add");if(els[i].textContent!==want)els[i].textContent=want;}}
    var rb=document.querySelectorAll("[data-read]");
    for(var j=0;j<rb.length;j++){var on2=!!read[rb[j].getAttribute("data-read")];if(rb[j].classList.contains("on")!==on2)rb[j].classList.toggle("on",on2);}
    syncing=false;
  }
  document.addEventListener("click",function(e){
    var f=e.target.closest&&e.target.closest("[data-fav]");
    if(f){e.preventDefault();e.stopPropagation();Mine.toggleFav(f.getAttribute("data-fav"));return;}
    var a=e.target.closest&&e.target.closest("a[href*='universe.leagueoflegends.com/'][href*='/story/']");
    if(a){var m=a.getAttribute("href").match(/\/story\/([^\/?#]+)/);if(m)Mine.markRead(decodeURIComponent(m[1]));}
  },true);
  // middle-click / ctrl-click on a story link also counts as opening it
  document.addEventListener("auxclick",function(e){var a=e.target.closest&&e.target.closest("a[href*='universe.leagueoflegends.com/'][href*='/story/']");if(a){var m=a.getAttribute("href").match(/\/story\/([^\/?#]+)/);if(m)Mine.markRead(decodeURIComponent(m[1]));}},true);
  var mo,pend=false;
  function watch(){
    if(!("MutationObserver" in window))return;
    mo=new MutationObserver(function(){if(pend)return;pend=true;requestAnimationFrame(function(){pend=false;sync();});});
    mo.observe(document.body,{childList:true,subtree:true});
  }
  /* ---------- "back to your puzzle": on every other page while today's Lore Explorer Daily is unfinished ---------- */
  function resumeChip(){
    if(file==="index.html"||file==="daily.html")return;
    var d=new Date(),key=d.getFullYear()+"-"+String(d.getMonth()+1).padStart(2,"0")+"-"+String(d.getDate()).padStart(2,"0");
    var names={clues:T("m_clues"),splash:T("m_splash"),ability:T("m_ability"),lore:T("m_lore"),voice:T("m_voice"),quote:T("m_quote"),item:T("m_item")},open=null;
    var v=load("atlas.daily.view")||{};
    var order=[v.mode].concat(["clues","splash","ability","lore","voice","quote","item"]).filter(function(m,i,a){return m&&names[m]&&a.indexOf(m)===i;});
    for(var i=0;i<order.length;i++){var st=load("atlas.daily."+order[i]+"."+key);if(st&&st.g&&st.g.length&&!st.won&&!st.lost){open={m:order[i],n:st.g.length};break;}}
    if(!open)return;
    var st2=document.createElement("style");st2.textContent=`
.resume{position:fixed;left:16px;bottom:max(16px,env(safe-area-inset-bottom));z-index:60;display:flex;align-items:center;gap:10px;background:#0b1120;border:1px solid var(--gold,#c8aa6e);color:var(--text,#ebe4d3);text-decoration:none;padding:9px 12px 9px 10px;box-shadow:0 10px 26px rgba(0,0,0,.55);font-family:var(--f-mono,monospace);font-size:11.5px;letter-spacing:.1em;text-transform:uppercase;max-width:calc(100vw - 32px)}
.resume b{display:grid;place-items:center;width:26px;height:26px;background:var(--gold,#c8aa6e);color:#080d18;font-size:12px;flex:none}
.resume small{display:block;font-family:var(--f-body,serif);text-transform:none;letter-spacing:0;font-size:13px;color:var(--muted,#939bb0)}
.resume:hover{background:#111a2c}
.resume .x{background:none;border:0;color:var(--muted,#939bb0);font-size:16px;cursor:pointer;padding:0 0 0 4px}
@media print{.resume{display:none}}`;document.head.appendChild(st2);
    var a=document.createElement("a");a.className="resume";a.href="daily.html#"+open.m;
    a.innerHTML='<b>▶</b><span>'+esc(T("resume_title"))+'<small>'+esc(T("resume_sub",{mode:names[open.m],guesses:T("guesses",{n:open.n})}))+'</small></span><button class="x" type="button" aria-label="×">×</button>';
    a.querySelector(".x").addEventListener("click",function(e){e.preventDefault();e.stopPropagation();a.remove();});
    document.body.appendChild(a);
  }
  /* ---------- section tabs ---------- */
  function sectionTabs(){
    var set=tabSetOf(file);if(!set)return;
    var hd=document.querySelector("header.bar")||document.querySelector("header");if(!hd||document.querySelector(".stabs"))return;
    var n=document.createElement("nav");n.className="stabs";n.setAttribute("aria-label",T("section_tabs"));
    n.innerHTML=TABS[set].map(function(x){return '<a href="'+x[0]+'"'+(x[0]===file?' aria-current="page"':'')+'>'+esc(x[1])+'</a>';}).join("");
    hd.insertAdjacentElement("afterend",n);
    var cur=n.querySelector('[aria-current]');if(cur&&cur.scrollIntoView&&n.scrollWidth>n.clientWidth)n.scrollLeft=cur.offsetLeft-16;
  }

  /* ---------- search (data/search.js, loaded the first time it opens) ---------- */
  var QS=null,IDX=null,idxP=null,sel=0,hits=[];
  var KIND={c:"k_c",pg:"k_pg",s:"k_s",i:"k_i",st:"k_st",cm:"k_cm",p:"k_p",v:"k_v",m:"k_m",t:"k_t",f:"k_f"};
  var ORDER=["pg","c","s","st","cm","i","v","m","p","f","t"], CAP={pg:4,c:6,s:6,st:5,cm:3,i:5,v:4,m:4,p:4,f:3,t:3};
  var norm=function(s){return String(s||"").normalize("NFD").replace(/[̀-ͯ]/g,"").toLowerCase().replace(/[’']/g,"");};
  function pages(){var L=[];GROUPS.forEach(function(g){
    if(g.link)TABS[g.link[1]].forEach(function(x){L.push(["pg",x[1],g.t,x[0],""]);});
    else g.items.forEach(function(it){L.push(["pg",it[1],it[2],it[0],""]);if(it[3])TABS[it[3]].forEach(function(x){if(x[0]!==it[0])L.push(["pg",x[1],it[1],x[0],""]);});});});
    L.push(["pg",T("mine"),T("mine_d"),"mine.html",""]);return L;}
  function loadIdx(){if(IDX)return Promise.resolve(IDX);if(idxP)return idxP;
    idxP=new Promise(function(res){var go=function(){var P=I&&I.pack&&I.pack.champs;IDX=pages().concat((window.ATLAS_SEARCH||[]).map(function(r){
        if(P&&(r[0]==="c")&&P[r[4]]&&P[r[4]][0]&&P[r[4]][0]!==r[1])return [r[0],P[r[4]][0],r[1]+" · "+r[2],r[3],r[4]];return r;}));
      IDX.forEach(function(r){r.n=norm(r[1]);r.m=norm(r[2]);});res(IDX);};
      if(window.ATLAS_SEARCH)return go();var s=document.createElement("script");s.src="data/search.js";s.onload=go;s.onerror=go;document.head.appendChild(s);});
    return idxP;}
  function score(r,q,words){var n=r.n;if(n===q)return 100;if(n.indexOf(q)===0)return 80;
    if(words.every(function(w){return (" "+n).indexOf(" "+w)>=0;}))return 60;if(n.indexOf(q)>=0)return 40;
    if(words.every(function(w){return (n+" "+r.m).indexOf(w)>=0;}))return 15;return 0;}
  function hl(s,q){var i=norm(s).indexOf(q);return i<0||!q?esc(s):esc(s.slice(0,i))+'<mark>'+esc(s.slice(i,i+q.length))+'</mark>'+esc(s.slice(i+q.length));}
  function icon(r){var k=r[0],id=r[4];
    if(id&&(k==="c"||k==="s"||k==="st"||k==="v"||k==="cm"))return '<img src="img/'+id+'-tile.webp" alt="" loading="lazy">';
    if(k==="i")return '<img src="https://ddragon.leagueoflegends.com/cdn/'+(window.ATLAS_SEARCH_IV||"16.21.1")+'/img/item/'+id+'.png" alt="" loading="lazy">';
    return '<i>'+({pg:"◆",p:"♟",m:"♪",f:"🏆",t:"◈",v:"▶",st:"✎",cm:"✎"}[k]||"•")+'</i>';}
  function render(){var inp=QS.querySelector("input"),q=norm(inp.value.trim()),words=q.split(/\s+/).filter(Boolean),box=QS.querySelector(".res");
    if(!IDX){box.innerHTML='<p class="none">'+esc(T("loading"))+'</p>';return;}
    var groups={};
    if(!q){groups.pg=IDX.filter(function(r){return r[0]==="pg";});}
    else IDX.forEach(function(r){var s=score(r,q,words);if(s){if(r[0]==="c")s+=8;(groups[r[0]]=groups[r[0]]||[]).push([s,r]);}});
    hits=[];var h='';
    ORDER.forEach(function(k){var g=groups[k];if(!g||!g.length)return;
      var L=q?g.sort(function(a,b){return b[0]-a[0]||a[1][1].length-b[1][1].length;}).slice(0,CAP[k]).map(function(x){return x[1];}):g;
      h+='<h4>'+esc(T(KIND[k]))+'</h4>'+L.map(function(r){var i=hits.length;hits.push(r);return '<a href="'+r[3]+'" data-i="'+i+'">'+icon(r)+'<span><b>'+hl(r[1],q)+'</b>'+(r[2]?'<small>'+esc(r[2])+'</small>':'')+'</span></a>';}).join("");});
    box.innerHTML=h||'<p class="none">'+esc(T("no_results"))+'</p>';sel=0;mark();}
  function mark(){var a=QS.querySelectorAll(".res a");for(var i=0;i<a.length;i++)a[i].classList.toggle("on",i===sel);if(a[sel]&&a[sel].scrollIntoView)a[sel].scrollIntoView({block:"nearest"});}
  function openSearch(){
    if(!QS){QS=document.createElement("div");QS.className="qs";QS.setAttribute("role","dialog");QS.setAttribute("aria-modal","true");QS.setAttribute("aria-label",T("search"));
      QS.innerHTML='<div class="box"><div class="in"><svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="10.5" cy="10.5" r="6.5" fill="none" stroke="currentColor" stroke-width="2"/><path d="M15.5 15.5 21 21" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg><input type="search" autocomplete="off" spellcheck="false" placeholder="'+esc(T("search_ph"))+'" aria-label="'+esc(T("search"))+'"><button type="button" class="x" aria-label="'+esc(T("close_menu"))+'">×</button></div><div class="res"></div><div class="hint">↑ ↓ · Enter · Esc</div></div>';
      document.body.appendChild(QS);var inp=QS.querySelector("input");
      inp.addEventListener("input",render);
      inp.addEventListener("keydown",function(e){var n=QS.querySelectorAll(".res a").length;
        if(e.key==="ArrowDown"){e.preventDefault();sel=Math.min(n-1,sel+1);mark();}
        else if(e.key==="ArrowUp"){e.preventDefault();sel=Math.max(0,sel-1);mark();}
        else if(e.key==="Enter"){var a=QS.querySelectorAll(".res a")[sel];if(a){e.preventDefault();goTo(a.getAttribute("href"));}}});
      QS.addEventListener("click",function(e){if(e.target===QS||e.target.closest(".x")){closeSearch();return;}var a=e.target.closest(".res a");if(a){e.preventDefault();goTo(a.getAttribute("href"));}});}
    QS.classList.add("on");document.documentElement.style.overflow="hidden";var nav=document.querySelector(".snav");if(nav)nav.classList.remove("sheet-open");
    var inp2=QS.querySelector("input");inp2.value="";render();setTimeout(function(){inp2.focus();},30);loadIdx().then(render);}
  function goTo(href){closeSearch();var u=new URL(href,location.href);
    if(u.pathname===location.pathname&&u.search===location.search&&u.hash){location.hash=u.hash;if(u.hash===location.hash)location.reload();return;}location.href=href;}
  function closeSearch(){if(QS)QS.classList.remove("on");document.documentElement.style.overflow="";}
  function wireSearch(){
    document.addEventListener("click",function(e){var b=e.target.closest&&e.target.closest(".srch");if(b){e.preventDefault();openSearch();}});
    document.addEventListener("keydown",function(e){var t=e.target,typing=t&&(t.tagName==="INPUT"||t.tagName==="TEXTAREA"||t.tagName==="SELECT"||t.isContentEditable);
      if((e.key==="k"||e.key==="K")&&(e.ctrlKey||e.metaKey)){e.preventDefault();openSearch();return;}
      if(e.key==="/"&&!typing&&!e.ctrlKey&&!e.metaKey&&!e.altKey){e.preventDefault();openSearch();return;}
      if(e.key==="Escape"&&QS&&QS.classList.contains("on"))closeSearch();});
    window.AtlasSearch={open:openSearch};
  }
  function start(){makeGroups();buildNav();sectionTabs();wireSearch();sync();watch();resumeChip();}
  function go(){if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",start);else start();}
  if(I&&I.ready)I.ready.then(go,go);else go();
})();
