/* Lore Explorer — champion conversations.
   window.AtlasIX.mount(el, champId) fills `el` with the champions this champion has special in-game lines with
   (both directions: what they say about others, and what others say about them), and plays each line.
   Data: data/interactions.js (window.ATLAS_IX, loaded on first use) from the League Wiki audio pages; audio is the Wiki's own
   files (MP3 copy first, so iPhones play it too; Ogg as fallback). Needs window.ATLAS_CHAMPS on the page. */
(function(){
  "use strict";
  var AI=window.AtlasI18n, LANG=AI?AI.lang:"en";
  var EN={ix_title:"Conversations",ix_lines:"Lines: {n}",ix_en:"Lines are in English, transcribed by the League of Legends Wiki.",ix_more:"Show all",v_cant:"This browser can't play this sound."};
  var t=function(k,v){var r=AI?AI.t(k,v):k;if(r===k&&EN[k])r=EN[k];return String(r).replace(/\{(\w+)\}/g,function(m,x){return v&&v[x]!=null?v[x]:m;});};
  var W="https://wiki.leagueoflegends.com/en-us/images/";
  var esc=function(s){return String(s).replace(/[&<>"]/g,function(c){return {"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c];});};
  var CH={};(window.ATLAS_CHAMPS||[]).forEach(function(c){CH[c.id]=c;});
  var nm=function(id){var p=AI&&AI.pack&&AI.pack.champs&&AI.pack.champs[id];return (p&&p[0])||(CH[id]&&CH[id].name)||id;};
  var dataP=null,IDX=null;
  function load(){
    if(IDX)return Promise.resolve(IDX);
    if(!dataP)dataP=new Promise(function(res){
      var go=function(){var R=window.ATLAS_IX||[];IDX={};R.forEach(function(r){var o=r[1].split("|");
        o.forEach(function(x){if(!CH[x]||!CH[r[0]])return;[[r[0],x],[x,r[0]]].forEach(function(p){var a=IDX[p[0]]=IDX[p[0]]||{};(a[p[1]]=a[p[1]]||[]).push(r);});});});res(IDX);};
      if(window.ATLAS_IX)return go();
      var s=document.createElement("script");s.src="data/interactions.js";s.onload=go;s.onerror=function(){IDX={};res(IDX);};document.head.appendChild(s);});
    return dataP;
  }
  var css=".ixb h5{font-family:var(--f-mono,monospace);font-weight:400;font-size:11px;letter-spacing:.18em;text-transform:uppercase;color:var(--muted,#939bb0);margin:0 0 8px}"+
    ".ix-who{display:flex;flex-wrap:wrap;gap:6px}"+
    ".ix-who button{display:inline-flex;align-items:center;gap:7px;border:1px solid var(--rule,rgba(200,170,110,.22));background:rgba(15,26,46,.6);padding:3px 9px 3px 3px;cursor:pointer;color:var(--text,#ebe4d3);font:inherit;font-size:14.5px;border-radius:2px}"+
    ".ix-who button img{width:30px;height:30px;object-fit:cover;display:block}"+
    ".ix-who button small{font-family:var(--f-num,sans-serif);font-size:15px;color:var(--muted,#939bb0)}"+
    ".ix-who button[aria-pressed=true]{border-color:var(--gold,#c8aa6e);background:rgba(200,170,110,.12)}"+
    ".ix-who .more{font-family:var(--f-mono,monospace);font-size:10.5px;letter-spacing:.12em;text-transform:uppercase;padding:8px 10px}"+
    ".ix-lines{list-style:none;margin:12px 0 0;padding:0;display:grid;gap:6px}"+
    ".ix-lines li{display:grid;grid-template-columns:34px minmax(0,1fr) auto;gap:10px;align-items:center;border:1px solid var(--rule,rgba(200,170,110,.22));background:rgba(13,23,41,.7);padding:6px 8px}"+
    ".ix-lines li img{width:34px;height:34px;object-fit:cover;display:block}"+
    ".ix-lines q{display:block;font-style:italic;quotes:none;line-height:1.4;color:var(--text,#ebe4d3)}"+
    ".ix-lines small{display:block;font-family:var(--f-mono,monospace);font-size:10px;letter-spacing:.08em;text-transform:uppercase;color:var(--muted,#939bb0);margin-top:2px}"+
    ".ix-lines button{width:36px;height:36px;border:1px solid var(--rule,rgba(200,170,110,.22));background:transparent;color:var(--gold,#c8aa6e);cursor:pointer;display:grid;place-items:center;border-radius:2px}"+
    ".ix-lines button[aria-pressed=true]{border-color:var(--gold,#c8aa6e);background:rgba(200,170,110,.14)}"+
    ".ix-lines button svg{width:15px;height:15px}"+
    ".ix-note{margin:8px 0 0;font-size:12.5px;color:var(--faint,#5b6580)}";
  var st=document.createElement("style");st.textContent=css;document.head.appendChild(st);
  var PLAY='<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M7 4v16l13-8z" fill="currentColor"/></svg>', STOP='<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="6" y="6" width="12" height="12" fill="currentColor"/></svg>';
  var audio=null,btn=null;
  function stop(){if(audio){audio.pause();audio=null;}if(btn){btn.setAttribute("aria-pressed","false");btn.innerHTML=PLAY;btn=null;}}
  function play(b,file,cap){
    if(btn===b){stop();return;}
    stop();if(window.AtlasVoice&&window.AtlasVoice.stop)window.AtlasVoice.stop();
    var f=encodeURIComponent(file), a=new Audio();audio=a;btn=b;b.setAttribute("aria-pressed","true");b.innerHTML=STOP;
    var tried=0;
    a.addEventListener("ended",function(){if(audio===a)stop();});
    a.addEventListener("error",function(){if(audio!==a)return;if(!tried){tried=1;a.src=W+f;a.play().catch(function(){});return;}stop();if(cap)cap.textContent=t("v_cant");});
    a.src=W+"transcoded/"+f+"/"+f+".mp3";var p=a.play();if(p&&p.catch)p.catch(function(e){if(e&&e.name==="NotAllowedError")stop();});
  }
  function mount(el,id,opt){
    opt=opt||{};
    if(!el)return Promise.resolve(0);
    return load().then(function(I){
      var P=I[id];if(!el.isConnected||(el.dataset.c&&el.dataset.c!==id))return 0;
      if(!P){el.remove();return 0;}
      var others=Object.keys(P).sort(function(a,b){return P[b].length-P[a].length||nm(a).localeCompare(nm(b));});
      var lim=opt.limit||10, showAll=others.length<=lim, cur=others[0], LL=12, allLines=false;
      function draw(){
        var list=showAll?others:others.slice(0,lim);
        var L=P[cur].slice().sort(function(a,b){return (a[0]===id?0:1)-(b[0]===id?0:1);}), N=L.length;if(!allLines)L=L.slice(0,LL);
        el.innerHTML=(opt.title===false?"":'<h5>'+esc(t("ix_title"))+'</h5>')+
          '<div class="ix-who" role="group">'+list.map(function(o){return '<button type="button" data-o="'+o+'" aria-pressed="'+(o===cur)+'"><img src="img/'+o+'-tile.webp" alt="" loading="lazy">'+esc(nm(o))+' <small>'+P[o].length+'</small></button>';}).join("")+
          (showAll?"":'<button type="button" class="more" data-more="1">'+esc(t("ix_more"))+' ('+others.length+')</button>')+'</div>'+
          '<ul class="ix-lines">'+L.map(function(r,i){return '<li><img src="img/'+r[0]+'-tile.webp" alt="'+esc(nm(r[0]))+'" title="'+esc(nm(r[0]))+'" loading="lazy"><div style="min-width:0"><q>'+esc(r[3])+'</q><small>'+esc(nm(r[0]))+' · '+esc(r[2])+'</small></div><button type="button" data-i="'+i+'" aria-pressed="false" aria-label="Play">'+PLAY+'</button></li>';}).join("")+'</ul>'+(N>L.length?'<div class="ix-who" style="margin-top:8px"><button type="button" class="more" data-lines="1">'+esc(t("ix_more"))+' ('+N+')</button></div>':"")+
          (LANG!=="en"?'<p class="ix-note">'+esc(t("ix_en"))+'</p>':"");
        el._rows=L;
      }
      draw();
      el.onclick=function(e){var b=e.target.closest("button");if(!b||!el.contains(b))return;
        if(b.dataset.more){showAll=true;draw();return;}
        if(b.dataset.lines){allLines=true;draw();return;}
        if(b.dataset.o){stop();cur=b.dataset.o;allLines=false;draw();return;}
        if(b.dataset.i!=null){var r=el._rows[+b.dataset.i];play(b,r[4],b.parentNode.querySelector("small"));}};
      return others.length;
    });
  }
  window.AtlasIX={mount:mount,stop:stop,load:load,count:function(id){return load().then(function(I){return I[id]?Object.keys(I[id]).length:0;});}};
})();
