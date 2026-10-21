/* Runeterra Atlas — champion voice lines.
   window.AtlasVoice.mount(el, champ) fills `el` with a row of speaker buttons:
   Pick + Ban (Riot's champion-select lines from the game client via CommunityDragon, in the visitor's language when Riot recorded it)
   and Joke / Taunt / Dance / Laugh — the Ctrl+1–4 emotes (base-skin lines, English, audio files hosted by the League of Legends Wiki).
   Data: data/voice.js (window.ATLAS_VOICE, loaded on first use). One sound plays at a time; clicking again moves to the next line. */
(function(){
  "use strict";
  var AI=window.AtlasI18n, LANG=AI?AI.lang:"en";
  var t=function(k,v){return AI?AI.t(k,v):k;};
  // Riot recorded champion-select lines in these client languages; the rest hear English
  var LOC={"ko":"ko_kr","zh-CN":"zh_cn","ja":"ja_jp","es-ES":"es_es","es-MX":"es_mx","pt-BR":"pt_br","fr":"fr_fr","de":"de_de","it":"it_it","pl":"pl_pl","ru":"ru_ru","tr":"tr_tr"}[LANG]||"default";
  var CD="https://raw.communitydragon.org/latest/plugins/rcp-be-lol-game-data/global/"+LOC+"/v1/";
  var WIKI="https://static.wikia.nocookie.net/leagueoflegends/images/";
  var esc=function(s){return String(s).replace(/[&<>"]/g,function(c){return {"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c];});};
  var dataP=null;
  function load(){
    if(window.ATLAS_VOICE)return Promise.resolve(window.ATLAS_VOICE);
    if(!dataP)dataP=new Promise(function(res){var s=document.createElement("script");s.src="data/voice.js";s.onload=function(){res(window.ATLAS_VOICE||null);};s.onerror=function(){res(null);};document.head.appendChild(s);});
    return dataP;
  }
  var css=".vox h5{font-family:var(--f-mono,monospace);font-weight:400;font-size:11px;letter-spacing:.18em;text-transform:uppercase;color:var(--muted,#939bb0);margin:0 0 8px}.vox-row{display:flex;flex-wrap:wrap;gap:6px}"+
    ".vox-b{display:inline-flex;align-items:center;gap:7px;min-height:36px;padding:6px 11px 6px 9px;border:1px solid var(--rule,rgba(200,170,110,.22));background:rgba(200,170,110,.05);color:var(--text,#ebe4d3);font:500 13.5px var(--f-body,Georgia,serif);cursor:pointer;border-radius:2px;transition:border-color .15s,background .15s}"+
    ".vox-b:hover,.vox-b:focus-visible{border-color:var(--gold,#c8aa6e);outline:none;background:rgba(200,170,110,.1)}"+
    ".vox-b svg{width:16px;height:16px;flex:none;color:var(--gold,#c8aa6e)}"+
    ".vox-b kbd{font:400 10px var(--f-mono,monospace);letter-spacing:.06em;color:var(--muted,#939bb0);border:1px solid var(--rule,rgba(200,170,110,.22));padding:1px 4px;border-radius:2px}"+
    ".vox-b .eq{display:none;gap:2px;align-items:flex-end;height:14px;width:16px}.vox-b .eq i{display:block;width:3px;background:var(--gold,#c8aa6e);animation:voxeq .9s ease-in-out infinite}"+
    ".vox-b .eq i:nth-child(2){animation-delay:-.3s}.vox-b .eq i:nth-child(3){animation-delay:-.6s}"+
    ".vox-b[aria-pressed=true]{border-color:var(--gold,#c8aa6e);background:rgba(200,170,110,.14)}.vox-b[aria-pressed=true] svg{display:none}.vox-b[aria-pressed=true] .eq{display:inline-flex}"+
    "@keyframes voxeq{0%,100%{height:4px}50%{height:14px}}@media (prefers-reduced-motion:reduce){.vox-b .eq i{animation:none;height:10px}}"+
    ".vox-cap{min-height:1.4em;margin:8px 0 0;font:italic 15px/1.4 var(--f-body,Georgia,serif);color:var(--text,#ebe4d3)}.vox-cap small{font:400 11px var(--f-mono,monospace);letter-spacing:.06em;color:var(--muted,#939bb0);font-style:normal;margin-left:6px}"+
    ".vox-note{margin:6px 0 0;font-size:12.5px;color:var(--faint,#5b6580)}.extra.vox{margin-bottom:22px}"+
    "@media (hover:none){.vox-b kbd{display:none}}";
  var st=document.createElement("style");st.textContent=css;document.head.appendChild(st);
  var SPK='<svg viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 9v6h4l5 4V5L8 9H4z" fill="currentColor" stroke="none"/><path d="M16.5 8.5a5 5 0 0 1 0 7"/><path d="M19 6a8.5 8.5 0 0 1 0 12"/></svg>';
  var audio=null, playingBtn=null;
  function stop(){if(audio){audio.pause();audio=null;}if(playingBtn){playingBtn.setAttribute("aria-pressed","false");playingBtn=null;}}
  function mount(el,c){
    if(!el)return Promise.resolve();
    return load().then(function(V){
      var v=V&&V[c.id];
      if(!v||!el.isConnected||el.dataset.c!==c.id){if(el.isConnected&&el.dataset.c===c.id)el.remove();return;}
      // [kind, label, key hint, lines: [url, caption, english-only]]
      var cs=function(kind,text){return [[CD+"champion-"+kind+"-vo/"+v.k+".ogg",text||"",false]];};
      var wk=function(L){return (L||[]).map(function(x){return [WIKI+x[0]+"/revision/latest",x[1],true];});};
      var B=[["pick",t("v_pick"),"",cs("choose",v.p)],["ban",t("v_ban"),"",v.b!=null?cs("ban",v.b):[]],
        ["joke",t("v_joke"),"Ctrl 1",wk(v.j)],["taunt",t("v_taunt"),"Ctrl 2",wk(v.t)],["dance",t("v_dance"),"Ctrl 3",wk(v.d)],["laugh",t("v_laugh"),"Ctrl 4",wk(v.l)]].filter(function(b){return b[3].length;});
      var anyEn=LANG!=="en"&&B.some(function(b){return b[3][0][2];});
      el.innerHTML='<h5>'+esc(t("v_title"))+'</h5><div class="vox-row">'+B.map(function(b,i){return '<button type="button" class="vox-b" data-i="'+i+'" aria-pressed="false" title="'+esc(t("v_play_tip",{what:b[1]}))+'">'+SPK+'<span class="eq" aria-hidden="true"><i></i><i></i><i></i></span>'+esc(b[1])+(b[2]?'<kbd>'+b[2]+'</kbd>':"")+'</button>';}).join("")+'</div><p class="vox-cap" aria-live="polite"></p>'+(anyEn?'<p class="vox-note">'+esc(t("v_en_note"))+'</p>':"");
      var cap=el.querySelector(".vox-cap"), next={};
      el.querySelector(".vox-row").addEventListener("click",function(e){
        var btn=e.target.closest(".vox-b");if(!btn)return;
        var i=+btn.dataset.i,b=B[i];
        if(playingBtn===btn){stop();return;}
        stop();
        var n=next[i]||0, line=b[3][n%b[3].length]; next[i]=n+1;
        var a=new Audio(line[0]);audio=a;playingBtn=btn;btn.setAttribute("aria-pressed","true");
        // captions are the Wiki's English transcripts; a translated pick/ban line has no caption
        var txt=(LOC==="default"||line[2])?line[1]:"";
        cap.innerHTML=(txt?esc(txt):"")+(b[3].length>1?'<small>'+esc(t("v_n_of",{a:(n%b[3].length)+1,b:b[3].length}))+'</small>':"");
        a.addEventListener("ended",function(){if(audio===a)stop();});
        a.addEventListener("error",function(){if(audio===a){stop();cap.textContent=t("v_cant");}});
        var p=a.play();if(p&&p.catch)p.catch(function(err){if(audio===a&&err&&err.name!=="AbortError"){stop();cap.textContent=t("v_cant");}});
      });
    });
  }
  window.AtlasVoice={mount:mount,stop:stop,load:load};
})();
