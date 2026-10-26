/* Lore Explorer — cinematic region stories (pilot: Piltover, 2026-10-27).
   window.AtlasStory.mount(el, regionId, ctx) builds the story for a region into el (or empties/hides el when the region has none yet).
   ctx = {onChamp(id), onRegion(id), onMap(id), name(champ), title(champ)}.
   Data: window.ATLAS_RSTORY (data/region-stories.js), ATLAS_CHAMPS, ATLAS_BONDS, ATLAS_RMAP, ATLAS_VIDEOS.
   No libraries, no build: scroll scenes are position:sticky + a progress value per scene (--p), sound is generated live with Web Audio
   (no audio files) and stays OFF until the visitor turns it on. Styles live in story.css. */
(function(){
  "use strict";
  var esc=function(s){return String(s==null?"":s).replace(/[&<>"]/g,function(c){return {"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c];});};
  var clamp=function(v,a,b){return v<a?a:v>b?b:v;};
  var ease=function(t){return t<.5?4*t*t*t:1-Math.pow(-2*t+2,3)/2;};
  var lerp=function(a,b,t){return a+(b-a)*t;};
  var seg=function(p,a,b){return clamp((p-a)/(b-a),0,1);};
  var REDUCE=matchMedia("(prefers-reduced-motion: reduce)");
  var PHONE=matchMedia("(max-width: 760px)");
  var BTYPE={family:"Family",ally:"Ally",mentor:"Mentor",enemy:"Enemy",complicated:"Complicated",linked:"Linked"};

  /* ---------------- sound: everything synthesised, nothing downloaded ---------------- */
  var Sound=(function(){
    var ctx=null,master=null,amb=null,on=false,visible=false,tickT=null,listeners=[],humOsc=null,humGain=null;
    function store(v){try{localStorage.setItem("atlas.sound",v?"1":"0");}catch(e){}}
    function noiseBuffer(sec,brown){
      var n=ctx.sampleRate*sec,b=ctx.createBuffer(1,n,ctx.sampleRate),d=b.getChannelData(0),last=0;
      for(var i=0;i<n;i++){var w=Math.random()*2-1;if(brown){last=(last+.02*w)/1.02;d[i]=last*3.5;}else d[i]=w;}
      return b;
    }
    function init(){
      if(ctx)return;
      var AC=window.AudioContext||window.webkitAudioContext; if(!AC)return;
      ctx=new AC(); master=ctx.createGain(); master.gain.value=0; master.connect(ctx.destination);
      amb=ctx.createGain(); amb.gain.value=1; amb.connect(master);
      // harbour wind: brown noise through a slowly breathing low-pass
      var src=ctx.createBufferSource(); src.buffer=noiseBuffer(4,true); src.loop=true;
      var lp=ctx.createBiquadFilter(); lp.type="lowpass"; lp.frequency.value=420; lp.Q.value=.6;
      var wg=ctx.createGain(); wg.gain.value=.22;
      var lfo=ctx.createOscillator(); lfo.frequency.value=.07; var lfoG=ctx.createGain(); lfoG.gain.value=180; lfo.connect(lfoG); lfoG.connect(lp.frequency);
      src.connect(lp); lp.connect(wg); wg.connect(amb); src.start(); lfo.start();
      // a low city drone (two detuned sines)
      [55,82.4].forEach(function(f,i){var o=ctx.createOscillator();o.type="sine";o.frequency.value=f;o.detune.value=i?6:-4;var g=ctx.createGain();g.gain.value=.035;o.connect(g);g.connect(amb);o.start();});
    }
    function click(freq,gain,len){ // one clockwork tick
      if(!ctx||!on)return;
      var t=ctx.currentTime,s=ctx.createBufferSource(); s.buffer=noiseBuffer(.05,false);
      var bp=ctx.createBiquadFilter(); bp.type="bandpass"; bp.frequency.value=freq; bp.Q.value=9;
      var g=ctx.createGain(); g.gain.setValueAtTime(gain,t); g.gain.exponentialRampToValueAtTime(.0001,t+(len||.05));
      s.connect(bp); bp.connect(g); g.connect(amb); s.start(t);
    }
    var tock=false;
    function ticking(run){ clearInterval(tickT); tickT=null; if(run) tickT=setInterval(function(){ tock=!tock; click(tock?1500:2100,.18); },520); }
    function fade(){ if(!ctx)return; var want=on&&visible?.7:0; master.gain.cancelScheduledValues(ctx.currentTime); master.gain.setTargetAtTime(want,ctx.currentTime,.4); ticking(on&&visible); }
    function set(v){ on=!!v; store(on); if(on){init(); if(ctx&&ctx.state==="suspended")ctx.resume();} fade(); listeners.forEach(function(f){f(on);}); }
    function chime(){ // the crystal powering up
      if(!ctx||!on)return; var t=ctx.currentTime;
      [880,1318.5,1760,2637].forEach(function(f,i){var o=ctx.createOscillator();o.type=i%2?"triangle":"sine";o.frequency.value=f;var g=ctx.createGain();g.gain.setValueAtTime(0,t+i*.05);g.gain.linearRampToValueAtTime(.12/(i+1),t+i*.05+.02);g.gain.exponentialRampToValueAtTime(.0001,t+1.8+i*.2);o.connect(g);g.connect(master);o.start(t+i*.05);o.stop(t+2.4);});
    }
    function hum(level){ // charging: pitch and volume follow the charge (0..1); null stops it
      if(!ctx||!on){return;}
      if(level==null){ if(humGain){humGain.gain.setTargetAtTime(0,ctx.currentTime,.08); var o=humOsc; setTimeout(function(){try{o.forEach(function(x){x.stop();});}catch(e){}},400); humOsc=null; humGain=null;} return; }
      if(!humOsc){ humGain=ctx.createGain(); humGain.gain.value=0; humGain.connect(master); humOsc=[ctx.createOscillator(),ctx.createOscillator()]; humOsc[0].type="sawtooth"; humOsc[1].type="sine"; var lp=ctx.createBiquadFilter(); lp.type="lowpass"; lp.frequency.value=900; humOsc[0].connect(lp); lp.connect(humGain); humOsc[1].connect(humGain); humOsc.forEach(function(x){x.start();}); }
      var t=ctx.currentTime; humOsc[0].frequency.setTargetAtTime(90+level*260,t,.05); humOsc[1].frequency.setTargetAtTime(180+level*520,t,.05); humGain.gain.setTargetAtTime(.04+level*.1,t,.05);
    }
    function page(){ // paper turning: a short rising noise sweep
      if(!ctx||!on)return; var t=ctx.currentTime,s=ctx.createBufferSource(); s.buffer=noiseBuffer(.35,false);
      var hp=ctx.createBiquadFilter(); hp.type="bandpass"; hp.Q.value=1.2; hp.frequency.setValueAtTime(700,t); hp.frequency.exponentialRampToValueAtTime(3800,t+.3);
      var g=ctx.createGain(); g.gain.setValueAtTime(0,t); g.gain.linearRampToValueAtTime(.16,t+.06); g.gain.exponentialRampToValueAtTime(.0001,t+.34);
      s.connect(hp); hp.connect(g); g.connect(master); s.start(t);
    }
    return {
      get on(){return on;}, set:set, toggle:function(){set(!on);}, chime:chime, hum:hum, page:page,
      tick:function(){click(2600,.12,.03);},
      visible:function(v){visible=v;fade();},
      duck:function(v){if(amb&&ctx)amb.gain.setTargetAtTime(v?0:1,ctx.currentTime,.3);},
      onChange:function(f){listeners.push(f);}
    };
  })();

  /* ---------------- helpers ---------------- */
  function img(D,path,w){ return D.cms+path+"?w="+w+"&fm=webp&accountingTag=LoL"; }
  function srcset(D,path,ws){ return ws.map(function(w){return img(D,path,w)+" "+w+"w";}).join(", "); }
  var GLY="▮▯◆◇░▒▓⌁⌇⏚⟊⟐⋄∎01";
  function scramble(el,text,ms,done){ // letters settle left to right
    if(REDUCE.matches){el.textContent=text;if(done)done();return;}
    var t0=performance.now(); el.setAttribute("aria-label",text);
    (function step(now){var k=clamp((now-t0)/ms,0,1),n=Math.floor(k*text.length),out=text.slice(0,n);
      for(var i=n;i<text.length;i++)out+=text[i]===" "?" ":GLY[(Math.random()*GLY.length)|0];
      el.textContent=out; if(k<1)requestAnimationFrame(step);else{el.textContent=text;if(done)done();}})(t0);
  }
  function words(t){ return t.split(" ").map(function(w,i){return '<span class="w" style="--i:'+i+'">'+esc(w)+'</span>';}).join(" "); }
  function fileNo(n){ return "■ "+String(n).padStart(3,"0"); }

  /* ---------------- build ---------------- */
  var state=null;
  function unmount(){ if(!state)return; state.off.forEach(function(f){f();}); Sound.visible(false); Sound.hum(null); state=null; }

  function mount(el,rid,ctx){
    unmount();
    var D=(window.ATLAS_RSTORY||{})[rid];
    if(!D){ el.innerHTML=""; el.hidden=true; document.getElementById("region")&&document.getElementById("region").classList.remove("has-story"); return false; }
    el.hidden=false; document.getElementById("region")&&document.getElementById("region").classList.add("has-story");
    ctx=ctx||{};
    var CH={}; (window.ATLAS_CHAMPS||[]).forEach(function(c){CH[c.id]=c;});
    var nm=function(c){return ctx.name?ctx.name(c):c.name;}, tt=function(c){return ctx.title?ctx.title(c):c.title;};
    var cu=D.closeup, face=CH[cu.champ];
    var vid=null; (window.ATLAS_VIDEOS||[]).forEach(function(s){(s.items||s.v||[]).forEach(function(v){if(v.y===D.video)vid=v;});});
    if(!vid&&D.video){ // shelves may be shaped differently: search any object with y === id
      (function find(o){if(vid||!o||typeof o!=="object")return; if(o.y===D.video){vid=o;return;} for(var k in o)find(o[k]);})(window.ATLAS_VIDEOS);
    }
    var map=(window.ATLAS_RMAP||{}), info=(map.info||{})[D.mapPlace];
    var chapters=["A close-up","The city","Its streets","The folio","Its people","Its champions","On screen","On the map"];
    var n=0, H=[];

    H.push('<div class="st" data-r="'+esc(rid)+'">');
    // HUD: sound + chapter rail
    H.push('<div class="st-hud" aria-label="Story controls"><button type="button" class="st-snd" aria-pressed="false"><svg class="spk" viewBox="0 0 16 16" aria-hidden="true"><path d="M2 6h3l4-3v10L5 10H2z"/></svg><span class="eq" aria-hidden="true"><i></i><i></i><i></i></span><span class="lbl">Enable sound</span></button></div>');
    H.push('<nav class="st-rail" aria-label="Story chapters">'+chapters.map(function(c,i){return '<a href="#st-'+i+'" data-i="'+i+'"><b>'+String(i+1).padStart(2,"0")+'</b><span>'+esc(c)+'</span></a>';}).join("")+'</nav>');

    // 1 close-up → pull back
    H.push('<section class="st-s st-close" id="st-0" data-pin data-scene="close"><div class="st-stick">'+
      '<div class="st-frame"><img class="st-face" alt="'+esc(face?nm(face)+" — "+tt(face):"")+'" src="'+esc(cu.splash)+'" decoding="async">'+
      '<img class="st-cityimg" alt="'+esc(cu.cityTitle)+'" src="'+esc(img(D,cu.city,1600))+'" srcset="'+esc(srcset(D,cu.city,[900,1600,2400]))+'" sizes="100vw" decoding="async"></div>'+
      '<div class="st-vign" aria-hidden="true"></div><div class="st-hudframe" aria-hidden="true"><i></i><i></i><i></i><i></i><em class="st-addr">universe / factions / '+esc(rid)+'</em></div>'+
      '<div class="st-who"><span class="st-no">'+fileNo(++n)+' · '+esc(chapters[0])+'</span><strong>'+esc(face?nm(face):"")+'</strong><em>'+esc(face?tt(face):"")+'</em></div>'+
      '<div class="st-title"><span class="st-no">'+esc(D.kicker)+'</span><h3 class="st-name">'+esc(D.name)+'</h3></div>'+
      '<div class="st-down" aria-hidden="true">Scroll<i></i></div></div></section>');

    // 2 the lore, one beat per screen
    H.push('<section class="st-s st-lore" id="st-1" data-pin data-scene="lore" style="--n:'+D.lore.length+'"><div class="st-stick">'+
      '<img class="st-lorebg" alt="" src="'+esc(img(D,cu.city,1600))+'" decoding="async" loading="lazy">'+
      '<div class="st-head"><span class="st-no">'+fileNo(++n)+' · '+esc(chapters[1])+'</span><span class="st-count"><b>01</b> / '+String(D.lore.length).padStart(2,"0")+'</span></div>'+
      '<div class="st-lines">'+D.lore.map(function(t,i){return '<p class="st-line" data-i="'+i+'">'+words(t)+'</p>';}).join("")+'</div>'+
      '<div class="st-src">Riot Games, <a href="'+esc(D.universe)+'" target="_blank" rel="noopener">'+esc(D.name)+' on Universe ↗</a></div>'+
      '<div class="st-meter" aria-hidden="true"><i></i></div></div></section>');

    // 3 the city: a pinned sideways gallery (swipe row on phones)
    H.push('<section class="st-s st-city" id="st-2" data-pin data-scene="city"><div class="st-stick">'+
      '<div class="st-head"><span class="st-no">'+fileNo(++n)+' · '+esc(chapters[2])+'</span><span class="st-hint">Keep scrolling — the street moves sideways</span></div>'+
      '<div class="st-track">'+D.city.map(function(c,i){return '<figure class="st-place" style="--ar:'+c[3]+'"><div class="ph"><img alt="'+esc(c[0])+'" loading="lazy" decoding="async" src="'+esc(img(D,c[2],1200))+'" srcset="'+esc(srcset(D,c[2],[600,1200,1800]))+'" sizes="(max-width:760px) 86vw, 60vw"></div><figcaption><span class="st-no">'+String(i+1).padStart(2,"0")+'</span><strong>'+esc(c[0])+'</strong>'+(c[1]?'<span class="cap">'+esc(c[1])+'</span>':'')+'</figcaption></figure>';}).join("")+'</div></div></section>');

    // 4 the book
    var B=D.book;
    H.push('<section class="st-s st-book" id="st-3" data-scene="book"><div class="st-head"><span class="st-no">'+fileNo(++n)+' · '+esc(chapters[3])+'</span><h4 class="st-h">'+esc(B.title)+'</h4><p class="st-sub">'+esc(B.hint)+'. Every plate is a real invention from Riot\'s Piltover archive.</p></div>'+
      '<div class="bk" data-kind="'+esc(B.kind)+'"><div class="bk-spread">'+
        '<figure class="bk-plate"><div class="bk-art"><img alt="" decoding="async"></div><div class="bk-grid" aria-hidden="true"></div>'+
          '<svg class="bk-marks" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true"><path d="M4 8H96M4 6v4M96 6v4M92 4V96M90 4h4M90 96h4"/><circle cx="50" cy="50" r="18"/><path d="M50 26v8M50 66v8M26 50h8M66 50h8"/></svg>'+
          '<div class="bk-glow" aria-hidden="true"></div><figcaption class="bk-no"></figcaption></figure>'+
        '<div class="bk-page"><span class="bk-kicker">Plate <b class="bk-i">01</b> of '+String(B.pages.length).padStart(2,"0")+'</span><h5 class="bk-title"></h5><p class="bk-cap" aria-live="polite"></p><p class="bk-state"></p>'+
          '<div class="bk-ctl"><button type="button" class="bk-prev" aria-label="Previous plate">←</button>'+
          '<button type="button" class="bk-crystal" aria-describedby="bkHint"><svg viewBox="0 0 100 100" aria-hidden="true"><circle class="ring0" cx="50" cy="50" r="44"/><circle class="ring" cx="50" cy="50" r="44" pathLength="100"/><path class="gem" d="M50 18 72 40 50 82 28 40Z"/><path class="facet" d="M28 40h44M50 18 41 40 50 82 59 40Z"/></svg><span id="bkHint" class="sr">Press and hold to power this plate</span></button>'+
          '<button type="button" class="bk-next" aria-label="Next plate">→</button></div>'+
          '<button type="button" class="bk-skip">Can\'t hold? Power every plate</button></div>'+
      '</div><div class="bk-dots" role="tablist" aria-label="Plates">'+B.pages.map(function(p,i){return '<button type="button" role="tab" data-i="'+i+'" aria-label="'+esc(p[0])+'"></button>';}).join("")+'</div></div></section>');

    // 5 people
    H.push('<section class="st-s st-people" id="st-4" data-scene="people"><div class="st-head"><span class="st-no">'+fileNo(++n)+' · '+esc(chapters[4])+'</span><h4 class="st-h">The people of '+esc(D.name)+'</h4></div>'+
      '<div class="st-files">'+D.people.map(function(p,i){return '<article class="st-file" style="--t:'+((i%2?1:-1)*(1+i%3))+'deg"><div class="ph"><img alt="'+esc(p[0])+'" loading="lazy" decoding="async" src="'+esc(img(D,p[2],700))+'"></div><div class="tx"><span class="st-no">File '+String(i+1).padStart(3,"0")+'</span><h5>'+esc(p[0])+'</h5><p>'+esc(p[1])+'</p></div></article>';}).join("")+'</div></section>');

    // 6 champions + bonds (constellation)
    var ids=D.champs.filter(function(id){return CH[id];});
    var inside=(window.ATLAS_BONDS||[]).filter(function(b){return ids.indexOf(b[0])>=0&&ids.indexOf(b[1])>=0;});
    var told=inside.filter(function(b){return b[4]!=="u";}), hinted=inside.filter(function(b){return b[4]==="u";});
    var outside=(window.ATLAS_BONDS||[]).filter(function(b){return (ids.indexOf(b[0])>=0)!==(ids.indexOf(b[1])>=0)&&b[4]!=="u";});
    var R=200,cx=260,cy=250,pos={};
    ids.forEach(function(id,i){var a=-Math.PI/2+i*2*Math.PI/ids.length;pos[id]=[cx+R*Math.cos(a),cy+R*Math.sin(a)];});
    var lines=inside.map(function(b,i){var a=pos[b[0]],c=pos[b[1]];return '<path class="bl t-'+b[2]+(b[4]==="u"?" faint":"")+'" data-a="'+b[0]+'" data-b="'+b[1]+'" d="M'+a[0].toFixed(1)+' '+a[1].toFixed(1)+'Q'+cx+' '+cy+' '+c[0].toFixed(1)+' '+c[1].toFixed(1)+'" pathLength="1" style="--d:'+(i*.12)+'s"/>';}).join("");
    var nodes=ids.map(function(id,i){var p=pos[id],c=CH[id];return '<g class="cn" data-id="'+id+'" tabindex="0" role="button" aria-label="'+esc(nm(c)+", "+tt(c))+'" transform="translate('+p[0].toFixed(1)+' '+p[1].toFixed(1)+')" style="--d:'+(i*.08)+'s"><circle r="40" class="halo"/><clipPath id="stc-'+id+'"><circle r="34"/></clipPath><image href="img/'+id+'-tile.webp" x="-34" y="-34" width="68" height="68" clip-path="url(#stc-'+id+')" preserveAspectRatio="xMidYMid slice"/><circle r="34" class="rim"/><text y="56">'+esc(nm(c))+'</text></g>';}).join("");
    var other=function(b,id){return b[0]===id?b[1]:b[0];};
    H.push('<section class="st-s st-champs" id="st-5" data-scene="champs"><div class="st-head"><span class="st-no">'+fileNo(++n)+' · '+esc(chapters[5])+'</span><h4 class="st-h">Who keeps '+esc(D.name)+' running</h4><p class="st-sub">Riot names '+ids.length+' champions for the city. Lines are their bonds; tap a face to see who they are tied to.</p></div>'+
      '<div class="cst"><svg class="cst-svg" viewBox="0 0 520 520" aria-label="Bonds between '+esc(D.name)+' champions"><circle cx="'+cx+'" cy="'+cy+'" r="'+R+'" class="orbit"/><circle cx="'+cx+'" cy="'+cy+'" r="'+(R*.42)+'" class="orbit o2"/>'+lines+nodes+'</svg>'+
      '<div class="cst-side"><div class="cst-card" aria-live="polite"></div>'+
      '<div class="cst-out"><span class="st-no">Ties beyond the walls</span><div class="chips">'+outside.slice(0,10).map(function(b){var ins=ids.indexOf(b[0])>=0?b[0]:b[1],o=other(b,ins),oc=CH[o];return oc?'<button type="button" class="st-tie t-'+b[2]+'" data-id="'+o+'" title="'+esc(b[3])+'"><img src="img/'+o+'-tile.webp" alt="" loading="lazy">'+esc(nm(CH[ins]))+' · '+esc(nm(oc))+'<em>'+BTYPE[b[2]]+'</em></button>':"";}).join("")+'</div></div>'+
      (hinted.length?'<p class="cst-note">Dotted lines: Riot lists these champions as related, but no official story explains the link yet.</p>':'')+'</div></div></section>');

    // 7 film (YouTube only after a click; stays ≥200 px tall per YouTube's rules)
    if(vid) H.push('<section class="st-s st-film" id="st-6" data-scene="film"><div class="st-head"><span class="st-no">'+fileNo(++n)+' · '+esc(chapters[6])+'</span><h4 class="st-h">'+esc(vid.t)+'</h4>'+(vid.d?'<p class="st-sub">'+esc(vid.d)+'</p>':'')+'</div>'+
      '<button type="button" class="film" data-y="'+esc(vid.y)+'" aria-label="Play '+esc(vid.t)+'"><img alt="" loading="lazy" src="https://i.ytimg.com/vi/'+esc(vid.y)+'/hqdefault.jpg"><span class="play" aria-hidden="true">▶</span><span class="by">Official video · '+esc(vid.by||"League of Legends")+(vid.yr?' · '+esc(vid.yr):'')+'</span></button></section>');
    else n++;

    // 8 map + way out
    var rp=(map.regions||{})[rid]; var nx=D.next&&(window.ATLAS_REGIONS||[]).filter(function(r){return r.id===D.next;})[0];
    H.push('<section class="st-s st-end" id="st-7" data-scene="end"><div class="st-head"><span class="st-no">'+fileNo(++n)+' · '+esc(chapters[7])+'</span></div><div class="end">'+
      (rp&&map.w?'<div class="minimap" style="--x:'+(rp[0]/map.w*100).toFixed(2)+'%;--y:'+(rp[1]/map.h*100).toFixed(2)+'%"><div class="mm-in"></div><span class="mm-pin" aria-hidden="true"></span>'+(nx&&map.regions[nx.id]?'<span class="mm-pin low" aria-hidden="true" style="--dx:'+((map.regions[nx.id][0]-rp[0])/map.w*100).toFixed(2)+';--dy:'+((map.regions[nx.id][1]-rp[1])/map.h*100).toFixed(2)+'"></span>':'')+'<span class="mm-src">Riot\'s Map of Runeterra</span></div>':'')+
      '<div class="end-tx">'+(info?'<h4 class="st-h">'+esc(info[0])+'</h4><p class="st-sub">'+esc(info[1])+'</p><p>'+esc(info[2])+'</p>':'')+
      '<div class="end-ctl"><button type="button" class="st-btn" data-act="map">Find it on the big map</button>'+(nx?'<button type="button" class="st-btn gold" data-act="next">'+esc(D.nextLine||nx.name)+' →</button>':'')+'<a class="st-btn" href="#rDossier">Meet the champions ↓</a></div></div></div></section>');
    H.push('</div>');
    el.innerHTML=H.join("");

    var root=el.firstChild, off=[];
    state={off:off,root:root};
    var on=function(t,ev,f,o){t.addEventListener(ev,f,o);off.push(function(){t.removeEventListener(ev,f,o);});};

    /* sound button + HUD visibility */
    var sb=root.querySelector(".st-snd");
    var paintSnd=function(v){sb.setAttribute("aria-pressed",String(v));sb.querySelector(".lbl").textContent=v?"Sound on":"Enable sound";root.classList.toggle("snd",v);};
    paintSnd(Sound.on); Sound.onChange(function(v){if(state&&state.root===root)paintSnd(v);});
    on(sb,"click",function(){Sound.toggle();});
    var io=new IntersectionObserver(function(es){es.forEach(function(e){root.classList.toggle("inview",e.isIntersecting);Sound.visible(e.isIntersecting);});},{rootMargin:"-30% 0px -30% 0px"});
    io.observe(root); off.push(function(){io.disconnect();});

    /* scroll engine: each [data-pin] scene gets a progress value 0..1 */
    var pins=[].slice.call(root.querySelectorAll("[data-pin]"));
    var scenes={}, last={};
    var titleDone=false, loreAt=-1;
    var faceEl=root.querySelector(".st-face"), cityEl=root.querySelector(".st-cityimg"), frame=root.querySelector(".st-frame");
    function focal(imgEl,fx,fy){ // where (fx,fy) of the picture lands inside its object-fit:cover box
      var W=frame.clientWidth,Hh=frame.clientHeight,iw=imgEl.naturalWidth||1215,ih=imgEl.naturalHeight||717,s=Math.max(W/iw,Hh/ih),dw=iw*s,dh=ih*s;
      return [(W-dw)*fx+fx*dw,(Hh-dh)*fy+fy*dh];
    }
    scenes.close=function(sec,p){
      var k1=ease(seg(p,0,.5)), k2=ease(seg(p,.42,.95));
      var f=focal(faceEl,cu.fx,cu.fy); faceEl.style.transformOrigin=f[0]+"px "+f[1]+"px"; faceEl.style.transform="scale("+lerp(PHONE.matches?3.2:4.4,1.05,k1).toFixed(3)+")";
      faceEl.style.opacity=(1-seg(p,.42,.62)).toFixed(3);
      var c=focal(cityEl,cu.cfx,cu.cfy); cityEl.style.transformOrigin=c[0]+"px "+c[1]+"px"; cityEl.style.transform="scale("+lerp(3.2,1,k2).toFixed(3)+")";
      cityEl.style.opacity=seg(p,.4,.6).toFixed(3);
      sec.classList.toggle("who-on",p<.4); sec.classList.toggle("title-on",p>.58);
      if(p>.58&&!titleDone){titleDone=true;scramble(root.querySelector(".st-name"),D.name,900);}
    };
    scenes.lore=function(sec,p){
      var k=D.lore.length, i=Math.min(k-1,Math.floor(p*k*1.0001));
      if(i!==loreAt){loreAt=i; sec.querySelectorAll(".st-line").forEach(function(l,j){l.classList.toggle("on",j===i);l.classList.toggle("past",j<i);}); sec.querySelector(".st-count b").textContent=String(i+1).padStart(2,"0"); if(Sound.on)Sound.tick();}
      sec.querySelector(".st-meter i").style.transform="scaleX("+p.toFixed(3)+")";
      sec.querySelector(".st-lorebg").style.transform="scale("+(1.15-p*.12).toFixed(3)+") translateX("+(-p*3).toFixed(2)+"%)";
    };
    var track=root.querySelector(".st-track"), citySec=root.querySelector(".st-city");
    scenes.city=function(sec,p){ if(PHONE.matches||REDUCE.matches){track.style.transform="";return;} var span=track.scrollWidth-sec.querySelector(".st-stick").clientWidth; track.style.transform="translateX("+(-Math.max(0,span)*ease(p)).toFixed(1)+"px)"; };
    function sizeCity(){ // the sideways street needs as much scroll as its own width
      if(PHONE.matches||REDUCE.matches){citySec.style.height="";return;}
      var span=Math.max(0,track.scrollWidth-citySec.querySelector(".st-stick").clientWidth);
      citySec.style.height=(innerHeight+span*1.1)+"px";
    }
    var raf=0;
    function tick(){ raf=0;
      if(REDUCE.matches){root.classList.add("static");return;}
      root.classList.remove("static");
      pins.forEach(function(sec){var r=sec.getBoundingClientRect(),tot=r.height-innerHeight; if(r.bottom<-innerHeight||r.top>innerHeight*2)return; var p=tot>0?clamp(-r.top/tot,0,1):0; var id=sec.dataset.scene; if(last[id]===p)return; last[id]=p; sec.style.setProperty("--p",p.toFixed(4)); scenes[id](sec,p);});
      // chapter rail
      var secs=root.querySelectorAll(".st-s"),cur=0; secs.forEach(function(s,i){if(s.getBoundingClientRect().top<innerHeight*.5)cur=i;});
      root.querySelectorAll(".st-rail a").forEach(function(a,i){a.classList.toggle("on",i===cur);});
    }
    var req=function(){if(!raf)raf=requestAnimationFrame(tick);};
    on(window,"scroll",req,{passive:true});
    on(window,"resize",function(){sizeCity();last={};req();});
    [faceEl,cityEl].forEach(function(x){on(x,"load",function(){last={};req();});});
    root.querySelectorAll(".st-track img").forEach(function(x){on(x,"load",function(){sizeCity();req();});});
    sizeCity(); tick();
    on(REDUCE,"change",function(){last={};sizeCity();tick();});
    on(PHONE,"change",function(){last={};sizeCity();tick();});
    root.querySelectorAll(".st-rail a").forEach(function(a){on(a,"click",function(e){e.preventDefault();var t=root.querySelector(a.getAttribute("href"));if(t)t.scrollIntoView({behavior:REDUCE.matches?"auto":"smooth"});});});

    /* reveal-on-enter for non-pinned scenes */
    var io2=new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting){e.target.classList.add("in");io2.unobserve(e.target);}});},{rootMargin:"0px 0px -18% 0px"});
    root.querySelectorAll(".st-book,.st-people,.st-champs,.st-film,.st-end").forEach(function(s){io2.observe(s);}); off.push(function(){io2.disconnect();});

    /* ---- the Hextech book ---- */
    var bk=root.querySelector(".bk"), pageI=0, powered=B.pages.map(function(){return false;}), charge=0, holding=false, chargeRaf=0, lastT=0, capRaf=0;
    var bImg=bk.querySelector(".bk-art img"), bTitle=bk.querySelector(".bk-title"), bCap=bk.querySelector(".bk-cap"), bState=bk.querySelector(".bk-state"), crystal=bk.querySelector(".bk-crystal"), ring=crystal.querySelector(".ring");
    function redact(t){return t.replace(/[^\s.,;:'’()-]/g,"▮");}
    function showPage(i,turn){
      var go=function(){
        pageI=(i+B.pages.length)%B.pages.length; var pg=B.pages[pageI];
        bImg.src=img(D,pg[2],1100); bImg.alt=pg[0];
        bTitle.textContent=pg[0]; bk.querySelector(".bk-i").textContent=String(pageI+1).padStart(2,"0");
        bk.querySelector(".bk-no").textContent="HX-"+String(pageI+1).padStart(2,"0")+" · "+pg[0].toUpperCase();
        charge=0; paint(); paintPage();
        bk.querySelectorAll(".bk-dots button").forEach(function(d,j){d.setAttribute("aria-selected",String(j===pageI));d.classList.toggle("done",powered[j]);});
      };
      if(turn&&!REDUCE.matches){ bk.classList.remove("turn-l","turn-r"); void bk.offsetWidth; bk.classList.add(turn<0?"turn-l":"turn-r"); Sound.page(); setTimeout(go,240); }
      else go();
    }
    function paintPage(){
      var pg=B.pages[pageI], ok=powered[pageI];
      bk.classList.toggle("on",ok);
      cancelAnimationFrame(capRaf);
      if(ok){ bCap.textContent=pg[1]||"Riot's folio keeps this plate as a drawing only — no notes survive with it."; bState.textContent="Powered"; }
      else { bCap.textContent=pg[1]?redact(pg[1].length>170?pg[1].slice(0,170)+"…":pg[1]):"▮▮▮▮▮ ▮▮▮▮▮▮▮ ▮▮▮▮"; bState.textContent=B.hint; }
    }
    function decode(text){ // the notes unscramble once the plate is powered
      if(REDUCE.matches){bCap.textContent=text;return;}
      var t0=performance.now(),ms=Math.min(1600,300+text.length*6);
      (function step(now){var k=clamp((now-t0)/ms,0,1),cut=Math.floor(k*text.length);bCap.textContent=text.slice(0,cut)+redact(text.slice(cut));if(k<1)capRaf=requestAnimationFrame(step);})(t0);
    }
    function paint(){ ring.style.strokeDashoffset=(100-charge*100).toFixed(2); bk.style.setProperty("--c",charge.toFixed(3)); }
    function loop(t){
      var dt=Math.min(64,t-(lastT||t)); lastT=t;
      if(powered[pageI]){chargeRaf=0;return;}
      charge=clamp(charge+(holding?dt/1150:-dt/500),0,1); paint();
      if(holding)Sound.hum(charge);
      if(charge>=1){ powered[pageI]=true; holding=false; Sound.hum(null); Sound.chime(); bk.classList.add("burst"); setTimeout(function(){bk.classList.remove("burst");},900);
        bk.classList.add("on"); bState.textContent="Powered"; var pg=B.pages[pageI]; decode(pg[1]||"Riot's folio keeps this plate as a drawing only — no notes survive with it.");
        var dot=bk.querySelectorAll(".bk-dots button")[pageI]; if(dot)dot.classList.add("done");
        if(navigator.vibrate)try{navigator.vibrate(30);}catch(e){}
        chargeRaf=0; return; }
      if(charge<=0&&!holding){Sound.hum(null);chargeRaf=0;return;}
      chargeRaf=requestAnimationFrame(loop);
    }
    function hold(v){ if(powered[pageI]&&v)return; holding=v; bk.classList.toggle("holding",v); if(!v)Sound.hum(null); if(!chargeRaf){lastT=0;chargeRaf=requestAnimationFrame(loop);} }
    on(crystal,"pointerdown",function(e){e.preventDefault();try{crystal.setPointerCapture(e.pointerId);}catch(x){}hold(true);});
    ["pointerup","pointercancel","lostpointercapture"].forEach(function(ev){on(crystal,ev,function(){hold(false);});});
    on(crystal,"contextmenu",function(e){e.preventDefault();});
    on(crystal,"keydown",function(e){if((e.key===" "||e.key==="Enter")){e.preventDefault();if(!e.repeat)hold(true);}});
    on(crystal,"keyup",function(e){if(e.key===" "||e.key==="Enter")hold(false);});
    on(crystal,"blur",function(){hold(false);});
    on(bk.querySelector(".bk-prev"),"click",function(){showPage(pageI-1,-1);});
    on(bk.querySelector(".bk-next"),"click",function(){showPage(pageI+1,1);});
    on(bk.querySelector(".bk-skip"),"click",function(){powered=powered.map(function(){return true;});showPage(pageI,0);});
    bk.querySelectorAll(".bk-dots button").forEach(function(d){on(d,"click",function(){var j=+d.dataset.i;if(j!==pageI)showPage(j,j<pageI?-1:1);});});
    // swipe between plates on touch screens (not on the crystal)
    var sx=null; on(bk.querySelector(".bk-plate"),"touchstart",function(e){sx=e.touches[0].clientX;},{passive:true});
    on(bk.querySelector(".bk-plate"),"touchend",function(e){if(sx==null)return;var dx=e.changedTouches[0].clientX-sx;sx=null;if(Math.abs(dx)>50)showPage(pageI+(dx<0?1:-1),dx<0?1:-1);},{passive:true});
    showPage(0,0);
    off.push(function(){cancelAnimationFrame(chargeRaf);cancelAnimationFrame(capRaf);});

    /* ---- champion constellation ---- */
    var cst=root.querySelector(".cst"), card=cst.querySelector(".cst-card");
    function focusChamp(id){
      cst.classList.toggle("focus",!!id);
      cst.querySelectorAll(".cn").forEach(function(g){g.classList.toggle("sel",g.dataset.id===id);});
      cst.querySelectorAll(".bl").forEach(function(l){l.classList.toggle("hot",!!id&&(l.dataset.a===id||l.dataset.b===id));});
      if(!id){card.innerHTML='<p class="st-sub">Tap a champion.</p>';return;}
      var c=CH[id], mine=(window.ATLAS_BONDS||[]).filter(function(b){return (b[0]===id||b[1]===id)&&b[4]!=="u";});
      card.innerHTML='<div class="cc-top"><img src="img/'+id+'-tile.webp" alt=""><div><strong>'+esc(nm(c))+'</strong><em>'+esc(tt(c))+'</em></div></div>'+
        '<ul>'+mine.slice(0,5).map(function(b){var o=CH[other(b,id)];return o?'<li class="t-'+b[2]+'"><b>'+BTYPE[b[2]]+' · '+esc(nm(o))+'</b>'+esc(b[3])+'</li>':"";}).join("")+'</ul>'+
        '<button type="button" class="st-btn gold" data-champ="'+id+'">Open '+esc(nm(c))+'\'s file ↓</button>';
      if(Sound.on)Sound.tick();
    }
    cst.querySelectorAll(".cn").forEach(function(g){
      on(g,"click",function(){focusChamp(g.dataset.id);});
      on(g,"keydown",function(e){if(e.key==="Enter"||e.key===" "){e.preventDefault();focusChamp(g.dataset.id);}});
      on(g,"mouseenter",function(){if(!PHONE.matches)focusChamp(g.dataset.id);});
    });
    on(card,"click",function(e){var b=e.target.closest("[data-champ]");if(b&&ctx.onChamp)ctx.onChamp(b.dataset.champ);});
    on(cst.querySelector(".chips"),"click",function(e){var b=e.target.closest(".st-tie");if(b&&ctx.onChamp)ctx.onChamp(b.dataset.id);});
    focusChamp(ids.indexOf(cu.champ)>=0?cu.champ:ids[0]);

    /* ---- film facade ---- */
    var film=root.querySelector(".film");
    if(film) on(film,"click",function(){
      var f=document.createElement("iframe"); f.src="https://www.youtube-nocookie.com/embed/"+film.dataset.y+"?autoplay=1&rel=0"; f.title=film.getAttribute("aria-label").replace(/^Play /,""); f.allow="autoplay; encrypted-media; picture-in-picture; fullscreen"; f.allowFullscreen=true; f.className="film-frame";
      film.replaceWith(f); Sound.duck(true);
    });

    /* ---- ending ---- */
    root.querySelectorAll("[data-act]").forEach(function(b){on(b,"click",function(){
      if(b.dataset.act==="map"&&ctx.onMap)ctx.onMap(rid);
      if(b.dataset.act==="next"&&ctx.onRegion)ctx.onRegion(D.next);
    });});
    return true;
  }

  window.AtlasStory={mount:mount,unmount:unmount,sound:Sound};
})();
