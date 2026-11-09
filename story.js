/* Lore Explorer — cinematic region stories (Piltover pilot 2026-10-27; all 13 regions 2026-11-09).
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

  /* ---------------- per-region sound scenes + interactive "book" kinds ---------------- */
  // ambience recipe per region (all generated live; nothing downloaded). wind=[gain, low-pass Hz], drone=[two sine Hz], pulse = recurring small sound
  var SCENES={
    piltover:{wind:[.22,420],drone:[55,82.4],pulse:"tick"}, zaun:{wind:[.14,300],drone:[49,73.4],pulse:"bubble"},
    demacia:{wind:[.16,650],drone:[65.4,98],pulse:"bell"}, noxus:{wind:[.2,350],drone:[41.2,61.7],pulse:"drum"},
    freljord:{wind:[.34,900],drone:[55,82.4]}, ionia:{wind:[.1,700],drone:[73.4,110],pulse:"bell"},
    shurima:{wind:[.28,520],drone:[61.7,92.5]}, targon:{wind:[.3,1100],drone:[82.4,123.5],pulse:"twinkle"},
    bilgewater:{wind:[.1,380],drone:[46.2,69.3],sea:1,pulse:"creak"}, shadowisles:{wind:[.18,250],drone:[36.7,55],detune:18},
    bandle:{wind:[.08,800],drone:[98,146.8],pulse:"twinkle"}, ixtal:{wind:[.12,500],drone:[58.3,87.3],pulse:"bubble"},
    void:{wind:[0,0],drone:[30.9,46.2],detune:28,wobble:1}
  };
  // every region's book uses the same press-and-hold (learned once, Jakob's law); what you hold and what it does differs
  var KINDS={
    hextech:{title:"The Hextech Folio",unit:"Plate",code:"HX",hint:"Press and hold the crystal to power this plate",done:"Powered",hum:["sawtooth",90,260],chime:[880,1318.5,1760,2637],
      icon:'<path class="ico-f" d="M50 18 72 40 50 82 28 40Z"/><path class="ico-l" d="M28 40h44M50 18 41 40 50 82 59 40Z"/>'},
    chem:{title:"Chemtech Gauges",unit:"Gauge",code:"ZN",hint:"Press and hold the valve to vent the gas",done:"Vented",hum:["square",48,70],chime:[392,523.3,659.3],
      icon:'<g class="spin"><circle class="ico-l" cx="50" cy="50" r="22"/><path class="ico-l" d="M50 28v44M28 50h44M34 34l32 32M66 34 34 66"/><circle class="ico-f" cx="50" cy="50" r="7"/></g>'},
    petricite:{title:"The Petricite Archive",unit:"Page",code:"DM",hint:"Press and hold the petricite to dampen the magic",done:"Dampened",hum:["triangle",120,180],chime:[523.3,659.3,784,1046.5],
      icon:'<path class="ico-f" d="M50 20 74 30v20c0 15-10 25-24 31-14-6-24-16-24-31V30Z"/><path class="ico-l" d="M50 30v40M38 44h24"/>'},
    banner:{title:"The War Table",unit:"Order",code:"NX",hint:"Press and hold to raise the banner",done:"Claimed",hum:["sawtooth",55,95],chime:[220,277.2,329.6,440],
      icon:'<path class="ico-l" d="M34 20v62"/><path class="ico-f" d="M36 22h32l-8 12 8 12H36Z"/>'},
    frost:{title:"The Ice Runes",unit:"Rune",code:"FJ",hint:"Press and hold the rune to thaw the frost",done:"Thawed",hum:["sine",200,420],chime:[987.8,1318.5,1975.5],
      icon:'<path class="ico-l" d="M50 22v56M26 36l48 28M74 36 26 64M44 26l6 6 6-6M44 74l6-6 6 6"/><circle class="ico-f" cx="50" cy="50" r="6"/>'},
    ink:{title:"The Ink Scroll",unit:"Panel",code:"IO",hint:"Press and hold the brush to paint the scroll",done:"Painted",hum:["sine",160,240],chime:[587.3,659.3,880,987.8],
      icon:'<path class="ico-f" d="M60 20c6 8 6 18-2 26L44 72c-3 4-10 5-12 1s0-8 4-11l18-26c4-6 4-11 6-16Z"/>'},
    sand:{title:"Buried Relics",unit:"Relic",code:"SH",hint:"Press and hold the sun to blow the sand away",hintMouse:"Brush the sand away with your mouse, or press and hold the sun",done:"Uncovered",hum:["triangle",70,140],chime:[440,554.4,659.3,880],
      icon:'<circle class="ico-f" cx="50" cy="50" r="13"/><path class="ico-l" d="M50 24v8M50 68v8M24 50h8M68 50h8M32 32l6 6M62 62l6 6M68 32l-6 6M32 68l6-6"/>'},
    stars:{title:"The Star Chart",unit:"Chart",code:"TG",hint:"Press and hold the star to trace the constellation",done:"Aligned",hum:["sine",240,520],chime:[659.3,987.8,1318.5,1975.5],
      icon:'<path class="ico-f" d="m50 22 7 19h20l-16 12 6 19-17-11-17 11 6-19-16-12h20Z"/>'},
    mist:{title:"The Ruined Journal",unit:"Entry",code:"SI",hint:"Press and hold your light to push back the Black Mist",done:"Lit",hum:["sine",110,200],chime:[493.9,622.3,740],
      icon:'<path class="ico-l" d="M40 30h20M42 30v-6h16v6M38 34h24l-3 36H41Z"/><path class="ico-f" d="M50 44c5 6 5 11 0 16-5-5-5-10 0-16Z"/>'},
    chart:{title:"Sea Charts",unit:"Chart",code:"BW",hint:"Press and hold the wheel to steady the tide",done:"Charted",hum:["triangle",65,110],chime:[392,493.9,587.3,784],
      icon:'<g class="spin"><circle class="ico-l" cx="50" cy="50" r="18"/><path class="ico-l" d="M50 22v56M22 50h56M30 30l40 40M70 30 30 70"/><circle class="ico-f" cx="50" cy="50" r="6"/></g>'},
    jungle:{title:"The Elemental Codex",unit:"Page",code:"IX",hint:"Press and hold to push back the jungle",done:"Cleared",hum:["triangle",95,160],chime:[523.3,698.5,880,1046.5],
      icon:'<path class="ico-f" d="M50 78C30 66 26 44 34 24c14 6 26 18 26 34 0 8-4 14-10 20Z"/><path class="ico-l" d="M50 78C46 60 42 44 36 30"/>'},
    popup:{title:"The Pop-up Storybook",unit:"Page",code:"BC",hint:"Press and hold to pop the page up",done:"Popped up",hum:["square",180,360],chime:[784,987.8,1174.7,1568],
      icon:'<path class="ico-l" d="M22 66 50 74l28-8V32l-28 8-28-8Z"/><path class="ico-l" d="M50 40v34"/><path class="ico-f" d="M44 24h12l-6 10Z"/>'},
    glitch:{title:"Void Records",unit:"Record",code:"VD",hint:"Press and hold to steady the record",done:"Steadied",hum:["sawtooth",40,65],chime:[311.1,466.2,622.3],
      icon:'<path class="ico-l" d="M22 50c8-13 18-20 28-20s20 7 28 20c-8 13-18 20-28 20s-20-7-28-20Z"/><circle class="ico-f" cx="50" cy="50" r="9"/>'}
  };
  var NOTE_NONE="Riot keeps this one as a picture only — no notes come with it.";

  /* ---------------- sound: everything synthesised, nothing downloaded ---------------- */
  var Sound=(function(){
    var ctx=null,master=null,amb=null,on=false,visible=false,pulseT=null,listeners=[],humOsc=null,humGain=null,scene=SCENES.piltover,sceneG=null,sceneNodes=[],kind=KINDS.hextech;
    function store(v){try{localStorage.setItem("atlas.sound",v?"1":"0");}catch(e){}}
    var bufs={};
    function noiseBuffer(sec,brown){
      var key=sec+(brown?"b":"w"); if(bufs[key])return bufs[key];
      var n=ctx.sampleRate*sec,b=ctx.createBuffer(1,n,ctx.sampleRate),d=b.getChannelData(0),last=0;
      for(var i=0;i<n;i++){var w=Math.random()*2-1;if(brown){last=(last+.02*w)/1.02;d[i]=last*3.5;}else d[i]=w;}
      return (bufs[key]=b);
    }
    function init(){
      if(ctx)return;
      var AC=window.AudioContext||window.webkitAudioContext; if(!AC)return;
      ctx=new AC(); master=ctx.createGain(); master.gain.value=0; master.connect(ctx.destination);
      amb=ctx.createGain(); amb.gain.value=1; amb.connect(master);
      build();
    }
    function build(){ // (re)build the region's ambience
      if(!ctx)return;
      sceneNodes.forEach(function(n){try{n.stop();}catch(e){}}); sceneNodes=[]; if(sceneG){try{sceneG.disconnect();}catch(e){}}
      sceneG=ctx.createGain(); sceneG.gain.value=1; sceneG.connect(amb);
      var S=scene;
      if(S.wind&&S.wind[0]){ // wind: brown noise through a slowly breathing low-pass
        var src=ctx.createBufferSource(); src.buffer=noiseBuffer(4,true); src.loop=true;
        var lp=ctx.createBiquadFilter(); lp.type="lowpass"; lp.frequency.value=S.wind[1]; lp.Q.value=.6;
        var wg=ctx.createGain(); wg.gain.value=S.wind[0];
        var lfo=ctx.createOscillator(); lfo.frequency.value=.07; var lfoG=ctx.createGain(); lfoG.gain.value=S.wind[1]*.42; lfo.connect(lfoG); lfoG.connect(lp.frequency);
        src.connect(lp); lp.connect(wg); wg.connect(sceneG); src.start(); lfo.start(); sceneNodes.push(src,lfo);
      }
      if(S.sea){ // sea swell: noise whose volume rises and falls every ~11 s
        var ss=ctx.createBufferSource(); ss.buffer=noiseBuffer(4,true); ss.loop=true;
        var sl=ctx.createBiquadFilter(); sl.type="lowpass"; sl.frequency.value=700;
        var sg=ctx.createGain(); sg.gain.value=.12; var sw=ctx.createOscillator(); sw.frequency.value=.09; var swg=ctx.createGain(); swg.gain.value=.1; sw.connect(swg); swg.connect(sg.gain);
        ss.connect(sl); sl.connect(sg); sg.connect(sceneG); ss.start(); sw.start(); sceneNodes.push(ss,sw);
      }
      (S.drone||[]).forEach(function(f,i){var o=ctx.createOscillator();o.type="sine";o.frequency.value=f;o.detune.value=(i?1:-1)*(S.detune||5);var g=ctx.createGain();g.gain.value=.035;
        if(S.wobble){var w=ctx.createOscillator();w.frequency.value=.23+i*.11;var wg2=ctx.createGain();wg2.gain.value=9;w.connect(wg2);wg2.connect(o.detune);w.start();sceneNodes.push(w);}
        o.connect(g);g.connect(sceneG);o.start();sceneNodes.push(o);});
    }
    function burst(freq,gain,len,q){ // short filtered noise (clock tick, creak)
      if(!ctx||!on)return;
      var t=ctx.currentTime,s=ctx.createBufferSource(); s.buffer=noiseBuffer(.5,false);
      var bp=ctx.createBiquadFilter(); bp.type="bandpass"; bp.frequency.value=freq; bp.Q.value=q||9;
      var g=ctx.createGain(); g.gain.setValueAtTime(gain,t); g.gain.exponentialRampToValueAtTime(.0001,t+(len||.05));
      s.connect(bp); bp.connect(g); g.connect(sceneG||amb); s.start(t); s.stop(t+(len||.05)+.05);
    }
    function tone(f0,f1,gain,len,type){ // one short pitched note, optionally gliding
      if(!ctx||!on)return; var t=ctx.currentTime,o=ctx.createOscillator(),g=ctx.createGain(); o.type=type||"sine";
      o.frequency.setValueAtTime(f0,t); if(f1)o.frequency.exponentialRampToValueAtTime(f1,t+len);
      g.gain.setValueAtTime(0,t); g.gain.linearRampToValueAtTime(gain,t+.01); g.gain.exponentialRampToValueAtTime(.0001,t+len);
      o.connect(g); g.connect(sceneG||amb); o.start(t); o.stop(t+len+.05);
    }
    var tock=false;
    var PULSES={ // [function, min ms, max ms]
      tick:[function(){tock=!tock;burst(tock?1500:2100,.18);},520,520],
      bubble:[function(){var f=280+Math.random()*500;tone(f,f*1.9,.05,.12);},260,900],
      bell:[function(){var f=[523.3,587.3,659.3,784,880][(Math.random()*5)|0];tone(f,0,.035,2.4);tone(f*2.01,0,.012,1.6);},3200,6400],
      drum:[function(){tone(80,38,.22,.5);},1800,1800],
      twinkle:[function(){tone(2200+Math.random()*1800,0,.018,.5);},500,1500],
      creak:[function(){burst(180+Math.random()*120,.08,1.1,3);},2400,5200]
    };
    function pulsing(run){ clearTimeout(pulseT); pulseT=null; var P=PULSES[scene.pulse]; if(!run||!P)return;
      (function next(){pulseT=setTimeout(function(){P[0]();next();},P[1]+Math.random()*(P[2]-P[1]));})(); }
    function fade(){ if(!ctx)return; var want=on&&visible?.7:0; master.gain.cancelScheduledValues(ctx.currentTime); master.gain.setTargetAtTime(want,ctx.currentTime,.4); pulsing(on&&visible); }
    function set(v){ on=!!v; store(on); if(on){init(); if(ctx&&ctx.state==="suspended")ctx.resume();} fade(); listeners.forEach(function(f){f(on);}); }
    function chime(){ // the book page coming alive
      if(!ctx||!on)return; var t=ctx.currentTime;
      kind.chime.forEach(function(f,i){var o=ctx.createOscillator();o.type=i%2?"triangle":"sine";o.frequency.value=f;var g=ctx.createGain();g.gain.setValueAtTime(0,t+i*.05);g.gain.linearRampToValueAtTime(.12/(i+1),t+i*.05+.02);g.gain.exponentialRampToValueAtTime(.0001,t+1.8+i*.2);o.connect(g);g.connect(master);o.start(t+i*.05);o.stop(t+2.4);});
    }
    function hum(level){ // holding: pitch and volume follow the charge (0..1); null stops it
      if(!ctx||!on){return;}
      if(level==null){ if(humGain){humGain.gain.setTargetAtTime(0,ctx.currentTime,.08); var o=humOsc; setTimeout(function(){try{o.forEach(function(x){x.stop();});}catch(e){}},400); humOsc=null; humGain=null;} return; }
      var H=kind.hum;
      if(!humOsc){ humGain=ctx.createGain(); humGain.gain.value=0; humGain.connect(master); humOsc=[ctx.createOscillator(),ctx.createOscillator()]; humOsc[0].type=H[0]; humOsc[1].type="sine"; var lp=ctx.createBiquadFilter(); lp.type="lowpass"; lp.frequency.value=900; humOsc[0].connect(lp); lp.connect(humGain); humOsc[1].connect(humGain); humOsc.forEach(function(x){x.start();}); }
      var t=ctx.currentTime; humOsc[0].frequency.setTargetAtTime(H[1]+level*H[2],t,.05); humOsc[1].frequency.setTargetAtTime(2*(H[1]+level*H[2]),t,.05); humGain.gain.setTargetAtTime(.04+level*.1,t,.05);
    }
    function page(){ // paper turning: a short rising noise sweep
      if(!ctx||!on)return; var t=ctx.currentTime,s=ctx.createBufferSource(); s.buffer=noiseBuffer(.5,false);
      var hp=ctx.createBiquadFilter(); hp.type="bandpass"; hp.Q.value=1.2; hp.frequency.setValueAtTime(700,t); hp.frequency.exponentialRampToValueAtTime(3800,t+.3);
      var g=ctx.createGain(); g.gain.setValueAtTime(0,t); g.gain.linearRampToValueAtTime(.16,t+.06); g.gain.exponentialRampToValueAtTime(.0001,t+.34);
      s.connect(hp); hp.connect(g); g.connect(master); s.start(t); s.stop(t+.4);
    }
    return {
      get on(){return on;}, set:set, toggle:function(){set(!on);}, chime:chime, hum:hum, page:page,
      tick:function(){burst(2600,.12,.03);},
      scene:function(rid,k){scene=SCENES[rid]||SCENES.piltover;kind=KINDS[k]||KINDS.hextech;build();if(on&&visible)pulsing(true);},
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
  function unmount(){ if(!state)return; state.off.forEach(function(f){f();}); Sound.visible(false); Sound.hum(null); Sound.duck(false); state=null; }

  function mount(el,rid,ctx){
    unmount();
    var D=(window.ATLAS_RSTORY||{})[rid];
    var regionEl=document.getElementById("region");
    if(!D){ el.innerHTML=""; el.hidden=true; if(regionEl)regionEl.classList.remove("has-story"); return false; }
    el.hidden=false; if(regionEl)regionEl.classList.add("has-story");
    ctx=ctx||{};
    D.cms=D.cms||"https://cmsassets.rgpub.io/sanity/images/dsfx7636/";
    var cu=D.closeup, B=D.book||{pages:[]}, K=KINDS[B.kind]||KINDS.hextech;
    var bookTitle=B.title||K.title, hint=B.hint||K.hint, unit=B.unit||K.unit;
    var finePointer=matchMedia("(pointer: fine)").matches;
    if(K.hintMouse&&finePointer)hint=K.hintMouse;
    Sound.scene(rid,B.kind);
    var vid=null;
    if(D.video)(function find(o){if(vid||!o||typeof o!=="object")return; if(o.y===D.video&&o.t){vid=o;return;} for(var k in o)find(o[k]);})(window.ATLAS_VIDEOS);
    var map=(window.ATLAS_RMAP||{}), info=(map.info||{})[D.mapPlace];
    // chapters: only the ones this region has material for (Occam's razor)
    var secs=[{k:"close",l:D.name},{k:"lore",l:"Its story"}];
    if((D.city||[]).length)secs.push({k:"city",l:D.placesLabel||"Its places"});
    if(B.pages.length)secs.push({k:"book",l:bookTitle});
    if((D.people||[]).length)secs.push({k:"people",l:D.peopleLabel||"Its people"});
    if(vid)secs.push({k:"film",l:"On screen"});
    secs.push({k:"end",l:"On the map"});
    var chapters=secs.map(function(x){return x.l;});
    var idOf={}; secs.forEach(function(x,i){idOf[x.k]=i;});
    var head=function(k){return '<span class="st-no">'+fileNo(idOf[k]+1)+' · '+esc(chapters[idOf[k]])+'</span>';};
    var H=[];

    H.push('<div class="st" data-r="'+esc(rid)+'" data-kind="'+esc(B.kind||"hextech")+'">');
    H.push('<div class="st-hud" aria-label="Story controls"><button type="button" class="st-snd" aria-pressed="false"><svg class="spk" viewBox="0 0 16 16" aria-hidden="true"><path d="M2 6h3l4-3v10L5 10H2z"/></svg><span class="eq" aria-hidden="true"><i></i><i></i><i></i></span><span class="lbl">Enable sound</span></button></div>');
    H.push('<div class="st-chap"><button type="button" class="st-chapbtn" aria-expanded="false" aria-controls="stChapList"><span class="pg"><b>01</b>/'+String(chapters.length).padStart(2,"0")+'</span><span class="nmc">'+esc(chapters[0])+'</span><span class="car" aria-hidden="true">▴</span><i class="bar" aria-hidden="true"><i></i></i></button>'+
      '<ol class="st-chaplist" id="stChapList" hidden>'+chapters.map(function(c,i){return '<li><a href="#st-'+i+'" data-i="'+i+'"><b>'+String(i+1).padStart(2,"0")+'</b>'+esc(c)+'</a></li>';}).join("")+'</ol></div>');

    // opening: the region's painting, close on its focal point, pulling back
    H.push('<section class="st-s st-close" id="st-'+idOf.close+'" data-pin data-scene="close"><div class="st-stick">'+
      '<div class="st-frame"><img class="st-cityimg" style="object-position:'+(cu.cfx*100).toFixed(0)+'% '+(cu.cfy*100).toFixed(0)+'%" alt="'+esc(cu.cityTitle)+'" src="'+esc(img(D,cu.city,1600))+'" srcset="'+esc(srcset(D,cu.city,[900,1600,2400]))+'" sizes="100vw" decoding="async"></div>'+
      '<div class="st-vign" aria-hidden="true"></div><div class="st-hudframe" aria-hidden="true"><i></i><i></i><i></i><i></i><em class="st-addr">universe / regions / '+esc(D.name.toLowerCase())+'</em></div>'+
      '<div class="st-who">'+head("close").replace(esc(D.name),esc(cu.cityTitle))+'</div>'+
      '<div class="st-title"><span class="st-no">'+esc(D.kicker)+'</span><h3 class="st-name">'+esc(D.name)+'</h3></div>'+
      '<div class="st-down" aria-hidden="true">Scroll<i></i></div></div></section>');

    // the lore, one beat per screen (Riot's words, unchanged)
    H.push('<section class="st-s st-lore" id="st-'+idOf.lore+'" data-pin data-scene="lore" style="--n:'+D.lore.length+'"><div class="st-stick">'+
      '<img class="st-lorebg" alt="" src="'+esc(img(D,cu.city,1600))+'" decoding="async" loading="lazy">'+
      '<div class="st-head">'+head("lore")+'<span class="st-count"><b>01</b> / '+String(D.lore.length).padStart(2,"0")+'</span></div>'+
      '<div class="st-lines">'+D.lore.map(function(t,i){return '<p class="st-line" data-i="'+i+'">'+words(t)+'</p>';}).join("")+'</div>'+
      '<div class="st-src">Riot Games, <a href="'+esc(D.universe)+'" target="_blank" rel="noopener">'+esc(D.name)+' on Universe ↗</a></div>'+
      '<div class="st-meter" aria-hidden="true"><i></i></div></div></section>');

    // places: a pinned sideways gallery (swipe row on phones)
    if(idOf.city!=null) H.push('<section class="st-s st-city" id="st-'+idOf.city+'" data-pin data-scene="city"><div class="st-stick">'+
      '<div class="st-head">'+head("city")+'<span class="st-hint">Keep scrolling — the view moves sideways</span></div>'+
      '<div class="st-track">'+D.city.map(function(c,i){return '<figure class="st-place" style="--ar:'+(c[3]||1.6)+'"><div class="ph"><img alt="'+esc(c[0])+'" loading="lazy" decoding="async" src="'+esc(img(D,c[2],1200))+'" srcset="'+esc(srcset(D,c[2],[600,1200,1800]))+'" sizes="(max-width:760px) 86vw, 60vw"></div><figcaption><span class="st-no">'+String(i+1).padStart(2,"0")+'</span><strong>'+esc(c[0])+'</strong>'+(c[1]?'<span class="cap">'+esc(c[1])+'</span>':'')+'</figcaption></figure>';}).join("")+'</div></div></section>');

    // the region's book: same press-and-hold everywhere, a different element per region
    if(idOf.book!=null) H.push('<section class="st-s st-book" id="st-'+idOf.book+'" data-scene="book"><div class="st-head">'+head("book")+'<h4 class="st-h">'+esc(bookTitle)+'</h4><p class="st-sub">'+esc(hint)+'. Everything here is Riot\'s own art and notes from the '+esc(D.name)+' page on Universe.</p></div>'+
      '<div class="bk" data-kind="'+esc(B.kind||"hextech")+'"><div class="bk-spread">'+
        '<figure class="bk-plate"><div class="bk-art"><img alt="" decoding="async"></div><div class="bk-grid" aria-hidden="true"></div>'+
          '<svg class="bk-marks" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true"><path d="M4 8H96M4 6v4M96 6v4M92 4V96M90 4h4M90 96h4"/><circle cx="50" cy="50" r="18"/><path d="M50 26v8M50 66v8M26 50h8M66 50h8"/></svg>'+
          '<div class="bk-veil" aria-hidden="true"></div>'+(B.kind==="sand"?'<canvas class="bk-sand" aria-hidden="true"></canvas>':'')+(B.kind==="stars"?'<svg class="bk-stars" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true"></svg>':'')+
          '<div class="bk-glow" aria-hidden="true"></div><figcaption class="bk-no"></figcaption></figure>'+
        '<div class="bk-page"><span class="bk-kicker">'+esc(unit)+' <b class="bk-i">01</b> of '+String(B.pages.length).padStart(2,"0")+'</span><h5 class="bk-title"></h5><p class="bk-cap" aria-live="polite"></p><p class="bk-state"></p>'+
          '<div class="bk-ctl"><button type="button" class="bk-prev" aria-label="Previous">←</button>'+
          '<button type="button" class="bk-crystal" aria-describedby="bkHint"><svg viewBox="0 0 100 100" aria-hidden="true"><circle class="ring0" cx="50" cy="50" r="44"/><circle class="ring" cx="50" cy="50" r="44" pathLength="100"/>'+K.icon+'</svg><span id="bkHint" class="sr">'+esc(hint)+'</span></button>'+
          '<button type="button" class="bk-next" aria-label="Next">→</button></div>'+
          '<button type="button" class="bk-skip">Can\'t hold? Reveal every '+esc(unit.toLowerCase())+'</button></div>'+
      '</div>'+(B.pages.length>1?'<div class="bk-dots" role="tablist" aria-label="'+esc(bookTitle)+'">'+B.pages.map(function(p,i){return '<button type="button" role="tab" data-i="'+i+'" aria-label="'+esc(p[0])+'"></button>';}).join("")+'</div>':'')+'</div></section>');

    // people
    if(idOf.people!=null) H.push('<section class="st-s st-people" id="st-'+idOf.people+'" data-scene="people"><div class="st-head">'+head("people")+'<h4 class="st-h">'+esc(D.peopleTitle||("The people of "+D.name.replace(/^The /,"")))+'</h4></div>'+
      '<div class="st-files">'+D.people.map(function(p,i){return '<article class="st-file" style="--t:'+((i%2?1:-1)*(1+i%3))+'deg"><div class="ph"><img alt="'+esc(p[0])+'" loading="lazy" decoding="async" src="'+esc(img(D,p[2],700))+'"></div><div class="tx"><span class="st-no">File '+String(i+1).padStart(3,"0")+'</span><h5>'+esc(p[0])+'</h5>'+(p[1]?'<p>'+esc(p[1])+'</p>':'')+'</div></article>';}).join("")+'</div></section>');

    // film (YouTube only after a click; stays ≥200 px tall per YouTube's rules)
    if(vid) H.push('<section class="st-s st-film" id="st-'+idOf.film+'" data-scene="film"><div class="st-head">'+head("film")+'<h4 class="st-h">'+esc(vid.t)+'</h4>'+(vid.d?'<p class="st-sub">'+esc(vid.d)+'</p>':'')+'</div>'+
      '<button type="button" class="film" data-y="'+esc(vid.y)+'" aria-label="Play '+esc(vid.t)+'"><img alt="" loading="lazy" src="https://i.ytimg.com/vi/'+esc(vid.y)+'/hqdefault.jpg"><span class="play" aria-hidden="true">▶</span><span class="by">Official video · '+esc(vid.by||"League of Legends")+(vid.yr?' · '+esc(vid.yr):'')+'</span></button></section>');

    // map + way out
    var placeXY=function(id){ if(!id)return null; if(map.regions&&map.regions[id])return map.regions[id]; var p=(map.places||[]).filter(function(q){return q[0]===id;})[0]; return p?[p[3],p[4]]:null; };
    var rp=(map.regions&&map.regions[rid])||placeXY(D.mapPlace);
    var nx=D.next&&(window.ATLAS_REGIONS||[]).filter(function(r){return r.id===D.next;})[0];
    var np=nx&&((map.regions&&map.regions[nx.id])||placeXY(((window.ATLAS_RSTORY||{})[nx.id]||{}).mapPlace));
    H.push('<section class="st-s st-end" id="st-'+idOf.end+'" data-scene="end"><div class="st-head">'+head("end")+'</div><div class="end">'+
      (rp&&map.w?'<div class="minimap" style="--x:'+(rp[0]/map.w*100).toFixed(2)+'%;--y:'+(rp[1]/map.h*100).toFixed(2)+'%"><div class="mm-in"></div><span class="mm-pin" aria-hidden="true"></span>'+(np?'<span class="mm-pin low" aria-hidden="true" style="--dx:'+((np[0]-rp[0])/map.w*100).toFixed(2)+';--dy:'+((np[1]-rp[1])/map.h*100).toFixed(2)+'"></span>':'')+'<span class="mm-src">Riot\'s Map of Runeterra</span></div>':'')+
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
    var titleDone=false, loreAt=-1, chapAt=-1, chapBtn=root.querySelector(".st-chapbtn"), chapList=root.querySelector(".st-chaplist");
    var cityEl=root.querySelector(".st-cityimg"), frame=root.querySelector(".st-frame");
    function focal(imgEl,fx,fy){ // where (fx,fy) of the picture lands inside its object-fit:cover box
      var W=frame.clientWidth,Hh=frame.clientHeight,iw=imgEl.naturalWidth||1600,ih=imgEl.naturalHeight||900,s=Math.max(W/iw,Hh/ih),dw=iw*s,dh=ih*s;
      return [(W-dw)*fx+fx*dw,(Hh-dh)*fy+fy*dh]; // the picture is positioned at its focal point (object-position), so the point lands here
    }
    scenes.close=function(sec,p){ // the region's painting starts close on its focal point and pulls back
      var k=ease(seg(p,0,.75)), c=focal(cityEl,cu.cfx,cu.cfy);
      cityEl.style.transformOrigin=c[0]+"px "+c[1]+"px"; cityEl.style.transform="scale("+lerp(cu.zoom||(PHONE.matches?2.4:2.8),1,k).toFixed(3)+")";
      sec.classList.toggle("who-on",p<.35); sec.classList.toggle("title-on",p>.45);
      if(p>.45&&!titleDone){titleDone=true;scramble(root.querySelector(".st-name"),D.name,900);}
    };
    scenes.lore=function(sec,p){
      var k=D.lore.length, i=Math.min(k-1,Math.floor(p*k*1.0001));
      if(i!==loreAt){loreAt=i; sec.querySelectorAll(".st-line").forEach(function(l,j){l.classList.toggle("on",j===i);l.classList.toggle("past",j<i);}); sec.querySelector(".st-count b").textContent=String(i+1).padStart(2,"0"); if(Sound.on)Sound.tick();}
      sec.querySelector(".st-meter i").style.transform="scaleX("+p.toFixed(3)+")";
      sec.querySelector(".st-lorebg").style.transform="scale("+(1.15-p*.12).toFixed(3)+") translateX("+(-p*3).toFixed(2)+"%)";
    };
    var track=root.querySelector(".st-track"), citySec=root.querySelector(".st-city");
    scenes.city=function(sec,p){ if(PHONE.matches||REDUCE.matches){track.style.transform="";return;} var span=track.scrollWidth-sec.querySelector(".st-stick").clientWidth; track.style.transform="translateX("+(-Math.max(0,span)*ease(p)).toFixed(1)+"px)"; };
    function sizeCity(){ // the sideways view needs as much scroll as its own width
      if(!citySec)return;
      if(PHONE.matches||REDUCE.matches){citySec.style.height="";return;}
      var span=Math.max(0,track.scrollWidth-citySec.querySelector(".st-stick").clientWidth);
      citySec.style.height=(innerHeight+span*1.1)+"px";
    }
    var raf=0;
    function tick(){ raf=0;
      if(REDUCE.matches){root.classList.add("static");return;}
      root.classList.remove("static");
      pins.forEach(function(sec){var r=sec.getBoundingClientRect(),tot=r.height-innerHeight; if(r.bottom<-innerHeight||r.top>innerHeight*2)return; var p=tot>0?clamp(-r.top/tot,0,1):0; var id=sec.dataset.scene; if(last[id]===p)return; last[id]=p; sec.style.setProperty("--p",p.toFixed(4)); scenes[id](sec,p);});
      var all=root.querySelectorAll(".st-s"),cur=0; all.forEach(function(s,i){if(s.getBoundingClientRect().top<innerHeight*.5)cur=i;});
      if(cur!==chapAt){chapAt=cur; chapBtn.querySelector(".pg b").textContent=String(cur+1).padStart(2,"0"); chapBtn.querySelector(".nmc").textContent=chapters[cur];
        chapList.querySelectorAll("a").forEach(function(a,i){a.classList.toggle("on",i===cur);if(i===cur)a.setAttribute("aria-current","step");else a.removeAttribute("aria-current");});}
      var rr=root.getBoundingClientRect(); chapBtn.style.setProperty("--prog",clamp(-rr.top/Math.max(1,rr.height-innerHeight),0,1).toFixed(3));
    }
    var req=function(){if(!raf)raf=requestAnimationFrame(tick);};
    on(window,"scroll",req,{passive:true});
    on(window,"resize",function(){sizeCity();last={};req();});
    on(cityEl,"load",function(){last={};req();});
    root.querySelectorAll(".st-track img").forEach(function(x){on(x,"load",function(){sizeCity();req();});});
    sizeCity(); tick();
    on(REDUCE,"change",function(){last={};sizeCity();tick();});
    on(PHONE,"change",function(){last={};sizeCity();tick();});
    var chapOpen=function(v){chapList.hidden=!v;chapBtn.setAttribute("aria-expanded",String(v));root.classList.toggle("chap-open",v);};
    on(chapBtn,"click",function(e){e.stopPropagation();chapOpen(chapList.hidden);});
    on(document,"click",function(e){if(!chapList.hidden&&!e.target.closest(".st-chap"))chapOpen(false);});
    on(document,"keydown",function(e){if(e.key==="Escape"&&!chapList.hidden){chapOpen(false);chapBtn.focus();}});
    chapList.querySelectorAll("a").forEach(function(a){on(a,"click",function(e){e.preventDefault();chapOpen(false);var t=root.querySelector(a.getAttribute("href"));if(t)t.scrollIntoView({behavior:REDUCE.matches?"auto":"smooth"});});});

    /* reveal-on-enter for non-pinned scenes */
    var io2=new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting){e.target.classList.add("in");io2.unobserve(e.target);}});},{rootMargin:"0px 0px -18% 0px"});
    root.querySelectorAll(".st-book,.st-people,.st-film,.st-end").forEach(function(s){io2.observe(s);}); off.push(function(){io2.disconnect();});

    /* ---- the region's book ---- */
    var bk=root.querySelector(".bk");
    if(bk){
    var pageI=0, powered=B.pages.map(function(){return false;}), charge=0, holding=false, chargeRaf=0, lastT=0, capRaf=0;
    var bImg=bk.querySelector(".bk-art img"), bArt=bk.querySelector(".bk-art"), bTitle=bk.querySelector(".bk-title"), bCap=bk.querySelector(".bk-cap"), bState=bk.querySelector(".bk-state"), crystal=bk.querySelector(".bk-crystal"), ring=crystal.querySelector(".ring");
    var sandCv=bk.querySelector(".bk-sand"), starSvg=bk.querySelector(".bk-stars");
    function redact(t){return t.replace(/[^\s.,;:'’()-]/g,"▮");}
    function rnd(seed){return function(){seed=(seed*16807)%2147483647;return (seed-1)/2147483646;};}
    function drawStars(i){ // a constellation per page, traced as the charge rises
      var r=rnd(97+i*131), pts=[]; for(var j=0;j<7;j++)pts.push([10+r()*80,12+r()*70]);
      pts.sort(function(a,b){return a[0]-b[0];});
      var dots=""; for(var k=0;k<60;k++)dots+='<circle class="sd" cx="'+(r()*100).toFixed(1)+'" cy="'+(r()*100).toFixed(1)+'" r="'+(.15+r()*.35).toFixed(2)+'"/>';
      starSvg.innerHTML=dots+'<polyline class="sl" pathLength="1" points="'+pts.map(function(p){return p[0].toFixed(1)+","+p[1].toFixed(1);}).join(" ")+'"/>'+pts.map(function(p){return '<circle class="sp" cx="'+p[0].toFixed(1)+'" cy="'+p[1].toFixed(1)+'" r="1.1"/>';}).join("");
    }
    var sandCtx=null, sandMoves=0;
    function drawSand(){ // a layer of sand over the relic; the mouse brushes it away
      if(!sandCv)return; var w=sandCv.clientWidth||400, h=sandCv.clientHeight||300; sandCv.width=Math.round(w/2); sandCv.height=Math.round(h/2);
      sandCtx=sandCv.getContext("2d"); var g=sandCtx, W=sandCv.width, Hh=sandCv.height;
      g.globalCompositeOperation="source-over"; var grd=g.createLinearGradient(0,0,W,Hh); grd.addColorStop(0,"#d9b277"); grd.addColorStop(.5,"#c89a5c"); grd.addColorStop(1,"#b98a4f"); g.fillStyle=grd; g.fillRect(0,0,W,Hh);
      for(var i=0;i<W*Hh/18;i++){g.fillStyle="rgba("+(90+Math.random()*80|0)+","+(60+Math.random()*50|0)+",30,"+(Math.random()*.25).toFixed(2)+")"; g.fillRect(Math.random()*W,Math.random()*Hh,1,1);}
      g.strokeStyle="rgba(255,236,200,.18)"; g.lineWidth=2; for(var k=0;k<14;k++){g.beginPath(); var y=Math.random()*Hh; g.moveTo(0,y); for(var x=0;x<=W;x+=W/8)g.lineTo(x,y+Math.sin(x/30+k)*6); g.stroke();}
      sandMoves=0;
    }
    function sandCleared(){ var d=sandCtx.getImageData(0,0,sandCv.width,sandCv.height).data, n=0, t=0; for(var i=3;i<d.length;i+=64){t++;if(d[i]<40)n++;} return n/t; }
    if(sandCv&&finePointer){
      var brushing=false;
      on(sandCv,"pointerdown",function(e){if(powered[pageI])return;brushing=true;try{sandCv.setPointerCapture(e.pointerId);}catch(x){}});
      ["pointerup","pointercancel"].forEach(function(ev){on(sandCv,ev,function(){brushing=false;});});
      on(sandCv,"pointermove",function(e){ if(!brushing&&e.buttons!==1)return; if(powered[pageI]||!sandCtx)return;
        var r=sandCv.getBoundingClientRect(), x=(e.clientX-r.left)/2, y=(e.clientY-r.top)/2;
        sandCtx.globalCompositeOperation="destination-out"; var gr=sandCtx.createRadialGradient(x,y,0,x,y,22); gr.addColorStop(0,"rgba(0,0,0,.9)"); gr.addColorStop(1,"rgba(0,0,0,0)"); sandCtx.fillStyle=gr; sandCtx.beginPath(); sandCtx.arc(x,y,22,0,7); sandCtx.fill();
        if(++sandMoves%10===0){ if(Sound.on)Sound.page(); if(sandCleared()>.55)power(); } });
      sandCv.classList.add("brush");
    }
    function showPage(i,turn){
      var go=function(){
        pageI=(i+B.pages.length)%B.pages.length; var pg=B.pages[pageI];
        bImg.src=img(D,pg[2],1100); bImg.alt=pg[0]; bk.querySelector(".bk-plate").style.setProperty("--img",'url("'+img(D,pg[2],1100)+'")');
        bTitle.textContent=pg[0]; bk.querySelector(".bk-i").textContent=String(pageI+1).padStart(2,"0");
        bk.querySelector(".bk-no").textContent=K.code+"-"+String(pageI+1).padStart(2,"0")+" · "+pg[0].toUpperCase();
        if(starSvg)drawStars(pageI); if(sandCv&&!powered[pageI])requestAnimationFrame(drawSand);
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
      if(ok){ bCap.textContent=pg[1]||NOTE_NONE; bState.textContent=B.done||K.done; }
      else { bCap.textContent=pg[1]?redact(pg[1].length>170?pg[1].slice(0,170)+"…":pg[1]):"▮▮▮▮▮ ▮▮▮▮▮▮▮ ▮▮▮▮"; bState.textContent=hint; }
    }
    function decode(text){ // the notes unscramble once the page is revealed
      if(REDUCE.matches){bCap.textContent=text;return;}
      var t0=performance.now(),ms=Math.min(1600,300+text.length*6);
      (function step(now){var k=clamp((now-t0)/ms,0,1),cut=Math.floor(k*text.length);bCap.textContent=text.slice(0,cut)+redact(text.slice(cut));if(k<1)capRaf=requestAnimationFrame(step);})(t0);
    }
    function paint(){ ring.style.strokeDashoffset=(100-charge*100).toFixed(2); bk.style.setProperty("--c",charge.toFixed(3)); }
    function power(){
      if(powered[pageI])return;
      powered[pageI]=true; holding=false; charge=1; paint(); Sound.hum(null); Sound.chime(); bk.classList.remove("holding"); bk.classList.add("burst"); setTimeout(function(){bk.classList.remove("burst");},900);
      bk.classList.add("on"); bState.textContent=B.done||K.done; decode(B.pages[pageI][1]||NOTE_NONE);
      var dot=bk.querySelectorAll(".bk-dots button")[pageI]; if(dot)dot.classList.add("done");
      if(navigator.vibrate)try{navigator.vibrate(30);}catch(e){}
    }
    function loop(t){
      var dt=Math.min(64,t-(lastT||t)); lastT=t;
      if(powered[pageI]){chargeRaf=0;return;}
      charge=clamp(charge+(holding?dt/1150:-dt/500),0,1); paint();
      if(holding)Sound.hum(charge);
      if(charge>=1){ power(); chargeRaf=0; return; }
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
    var many=B.pages.length>1;
    bk.querySelector(".bk-prev").hidden=bk.querySelector(".bk-next").hidden=!many;
    on(bk.querySelector(".bk-prev"),"click",function(){showPage(pageI-1,-1);});
    on(bk.querySelector(".bk-next"),"click",function(){showPage(pageI+1,1);});
    on(bk.querySelector(".bk-skip"),"click",function(){powered=powered.map(function(){return true;});showPage(pageI,0);});
    bk.querySelectorAll(".bk-dots button").forEach(function(d){on(d,"click",function(){var j=+d.dataset.i;if(j!==pageI)showPage(j,j<pageI?-1:1);});});
    // swipe between pages on touch screens (only clearly sideways swipes, so scrolling past never turns a page)
    var sx=null,sy=0; on(bk.querySelector(".bk-plate"),"touchstart",function(e){if(e.touches.length!==1){sx=null;return;}sx=e.touches[0].clientX;sy=e.touches[0].clientY;},{passive:true});
    on(bk.querySelector(".bk-plate"),"touchend",function(e){if(sx==null||!many)return;var t=e.changedTouches[0],dx=t.clientX-sx,dy=t.clientY-sy;sx=null;
      if(Math.abs(dx)>60&&Math.abs(dx)>2*Math.abs(dy))showPage(pageI+(dx<0?1:-1),dx<0?1:-1);},{passive:true});
    if(B.kind==="ink"&&finePointer&&!REDUCE.matches){ // Ionia: spirit-blossom petals follow the cursor over the scroll
      var lastPetal=0, bookSec=root.querySelector(".st-book");
      on(bookSec,"pointermove",function(e){var now=performance.now(); if(now-lastPetal<90||bookSec.querySelectorAll(".petal").length>14)return; lastPetal=now;
        var r=bookSec.getBoundingClientRect(), p=document.createElement("i"); p.className="petal"; p.style.left=(e.clientX-r.left)+"px"; p.style.top=(e.clientY-r.top)+"px";
        p.style.setProperty("--dx",(Math.random()*80-40).toFixed(0)+"px"); p.style.setProperty("--rot",(Math.random()*360|0)+"deg"); bookSec.appendChild(p); setTimeout(function(){p.remove();},2200);});
    }
    if(sandCv) on(window,"resize",function(){if(!powered[pageI])drawSand();});
    showPage(0,0);
    off.push(function(){cancelAnimationFrame(chargeRaf);cancelAnimationFrame(capRaf);});
    }

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
