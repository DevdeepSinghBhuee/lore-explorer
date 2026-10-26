/* Lore Explorer — the Map of Runeterra (2026-10-26).
   Riot's official painted map (map.leagueoflegends.com, copied to img/map/) with pan + zoom, sharp tiles that load as you zoom in,
   Riot's region highlight masks on hover, region crests, landmarks, cities and villages that appear by zoom level (like Riot's own map),
   and a place card with Riot's description and the champions who belong there.
   Use: AtlasMap.mount({frame, stage, tip, hint, zin, zout, zreset, regionName(id), regionColor(id), emblem(id), regionTip(id) → html,
                        champName(id), onRegion(id), onPlace(slug)})  ·  AtlasMap.select(id)  ·  AtlasMap.focus(id). Data: window.ATLAS_RMAP. */
(function(){
  "use strict";
  var D=window.ATLAS_RMAP; if(!D)return;
  var WW=D.w, WH=D.h, T=256, IMG="img/map/";
  var esc=function(s){return String(s==null?"":s).replace(/[&<>"]/g,function(c){return {"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c];});};
  var css=`
.rmap{position:absolute;inset:0;overflow:hidden;background:#0b1a26}
.rmap .world{position:absolute;left:0;top:0;width:${WW}px;height:${WH}px;transform-origin:0 0;will-change:transform}
.rmap .world img{position:absolute;display:block;user-select:none;-webkit-user-drag:none;pointer-events:none}
.rmap .base{left:0;top:0;width:${WW}px;height:${WH}px}
.rmap .tile{width:${T}px;height:${T}px;opacity:0;transition:opacity .35s}
.rmap .tile.in{opacity:1}
.rmap .hl{left:0;top:0;width:${WW}px;height:${WH}px;opacity:0;transition:opacity .25s;mix-blend-mode:screen}
.rmap .hl.on{opacity:.85}.rmap .hl.sel{opacity:.45}
.rmap .shade{position:absolute;inset:0;pointer-events:none;box-shadow:inset 0 0 90px 20px rgba(4,9,16,.75);z-index:2}
.rmap .pins{position:absolute;inset:0;pointer-events:none;z-index:3}
.rmap .pins>*{position:absolute;left:0;top:0;pointer-events:auto;transition:opacity .25s}
.rmap .pins>.off{opacity:0;pointer-events:none}
.rmap .pins>.crest{z-index:3}.rmap .pins>.town{z-index:2}.rmap .pins>.mark{z-index:1}
.rmap .crest{display:flex;flex-direction:column;align-items:center;gap:6px;transform:translate(-50%,-50%);cursor:pointer;background:none;border:0;padding:0;color:#f0e6d2}
.rmap .crest i{display:grid;place-items:center;width:46px;height:46px;border-radius:50%;background:radial-gradient(circle at 50% 35%,#1f2c44,#0b1222 70%);border:2px solid #c8aa6e;box-shadow:0 0 0 3px rgba(11,18,34,.7),0 6px 16px rgba(0,0,0,.6);transition:transform .2s cubic-bezier(.3,1.6,.5,1),box-shadow .2s}
.rmap .crest i img{width:30px;height:30px;position:static}
.rmap .crest b{font-family:var(--f-display,serif);font-weight:400;font-size:15px;letter-spacing:.14em;text-transform:uppercase;white-space:nowrap;text-shadow:0 1px 3px #000,0 0 12px rgba(0,0,0,.9)}
.rmap .crest:hover i,.rmap .crest.hot i{transform:scale(1.15);box-shadow:0 0 0 3px rgba(11,18,34,.7),0 0 22px var(--rc,#c8aa6e)}
.rmap .crest.sel i{border-color:#fff;box-shadow:0 0 0 3px var(--rc,#c8aa6e),0 0 24px var(--rc,#c8aa6e)}
.rmap .crest.up{flex-direction:column-reverse}
.rmap .crest.nolab b{opacity:0}
.rmap .crest.small i{width:36px;height:36px}.rmap .crest.small i img{width:23px;height:23px}.rmap .crest.small b{font-size:12px}
.rmap .mark{transform:translate(-50%,-50%);display:flex;flex-direction:column;align-items:center;gap:4px;cursor:pointer;background:none;border:0;padding:0;color:#f0e6d2}
.rmap .mark i{display:block;border-radius:50%;background:radial-gradient(circle at 50% 40%,#3a3020,#14100a 72%);border:2px solid #c8aa6e;box-shadow:0 0 0 2px rgba(0,0,0,.55),0 0 18px rgba(200,170,110,.35);position:relative}
.rmap .mark i::after{content:"✦";position:absolute;inset:0;display:grid;place-items:center;color:#f0d79a;font-style:normal}
.rmap .mark b,.rmap .town b{font-family:var(--f-display,serif);font-weight:400;font-size:13px;letter-spacing:.06em;white-space:nowrap;text-shadow:0 1px 2px #000,0 0 8px rgba(0,0,0,.95),0 0 3px #000}
.rmap .mark:hover i{box-shadow:0 0 0 2px rgba(0,0,0,.55),0 0 26px rgba(240,215,154,.8)}
.rmap .town{display:flex;align-items:center;gap:6px;transform:translate(-6px,-50%);cursor:pointer;background:none;border:0;padding:0;color:#f0e6d2}
.rmap .town i{width:10px;height:10px;transform:rotate(45deg);background:#c8aa6e;border:1.5px solid #1a1208;box-shadow:0 0 6px rgba(0,0,0,.8);flex:none}
.rmap .town.v i{width:6px;height:6px;border-radius:50%;transform:none;background:#efe6d0}
.rmap .town.v b{font-size:11.5px;font-family:var(--f-body,serif);font-style:italic;letter-spacing:.02em}
.rmap .town:hover b{color:#fff}
.rmap .card{position:absolute;z-index:6;width:min(340px,calc(100% - 24px));background:rgba(10,16,30,.97);border:1px solid #c8aa6e;box-shadow:0 18px 44px rgba(0,0,0,.65);padding:14px 16px 14px;color:#ebe4d3;font-size:15px;line-height:1.45;display:none}
.rmap .card.on{display:block}
.rmap .card .k{font-family:var(--f-mono,monospace);font-size:10px;letter-spacing:.14em;text-transform:uppercase;color:#c8aa6e}
.rmap .card h3{font-family:var(--f-display,serif);font-weight:400;font-size:24px;line-height:1.05;margin:4px 0 2px}
.rmap .card .st{font-style:italic;color:#a9b3c7;margin:0 0 8px}
.rmap .card p{margin:0 0 10px;max-height:9.5em;overflow:auto}
.rmap .card .faces{display:flex;flex-wrap:wrap;gap:6px;margin-bottom:10px}
.rmap .card .faces a{display:block}
.rmap .card .faces img{width:36px;height:36px;object-fit:cover;border:1px solid rgba(200,170,110,.4);display:block}
.rmap .card .faces a:hover img{border-color:#c8aa6e}
.rmap .card .row{display:flex;gap:8px;flex-wrap:wrap}
.rmap .card .row button,.rmap .card .row a{font-family:var(--f-mono,monospace);font-size:10.5px;letter-spacing:.1em;text-transform:uppercase;border:1px solid rgba(200,170,110,.45);background:transparent;color:#ebe4d3;padding:7px 10px;cursor:pointer;text-decoration:none}
.rmap .card .row button:hover,.rmap .card .row a:hover{border-color:#c8aa6e;color:#c8aa6e}
.rmap .card .x{position:absolute;top:8px;right:8px;width:30px;height:30px;border:1px solid rgba(200,170,110,.35);background:none;color:#ebe4d3;cursor:pointer;font-size:18px;line-height:1}
.rmap .cred{position:absolute;right:10px;bottom:8px;z-index:4;font-family:var(--f-mono,monospace);font-size:9.5px;letter-spacing:.08em;color:rgba(235,228,211,.55);text-shadow:0 1px 2px #000;pointer-events:none}
@media (max-width:640px){.rmap .crest i{width:36px;height:36px}.rmap .crest i img{width:23px;height:23px}.rmap .crest b{font-size:11.5px;letter-spacing:.1em}.rmap .mark b,.rmap .town b{font-size:11.5px}.rmap .card{left:12px!important;right:12px;bottom:12px;top:auto!important;width:auto}}
@media (prefers-reduced-motion:reduce){.rmap .tile,.rmap .hl{transition:none}}`;
  var st=document.createElement("style");st.textContent=css;document.head.appendChild(st);

  var O,root,world,base,hl,pinsEl,card,tiles=[],pins=[],hit=null,hitW=0,hitH=0,hover=null,sel=null;
  var Z={s:1,tx:0,ty:0},smin=1,smax=4,LAND=[110,300,1910,1500]; // land bounding box in world px (x0,y0,x1,y1)
  var raf=0;
  function fw(){return O.frame.clientWidth;} function fh(){return O.stage.clientHeight||O.frame.clientHeight;}
  function fit(){var w=fw(),h=fh();smin=w<640?h/(LAND[3]-LAND[1]-120):Math.min(w/(LAND[2]-LAND[0]),h/(LAND[3]-LAND[1]));smax=Math.max(smin*3,Math.min(4,Math.max(smin*5,4/(window.devicePixelRatio||1))));}
  function clamp(){var w=fw(),h=fh();Z.s=Math.min(smax,Math.max(smin,Z.s));
    var mw=WW*Z.s,mh=WH*Z.s;
    Z.tx=mw<=w?(w-mw)/2:Math.min(0,Math.max(w-mw,Z.tx));
    Z.ty=mh<=h?(h-mh)/2:Math.min(0,Math.max(h-mh,Z.ty));}
  function zn(){return 1-Math.log(Z.s/smin)/Math.log(smax/smin);} // 1 = all the way out, 0 = all the way in
  function apply(){clamp();if(!raf)raf=requestAnimationFrame(draw);}
  function draw(){raf=0;
    world.style.transform="translate("+Z.tx+"px,"+Z.ty+"px) scale("+Z.s+")";
    var big=Z.s>smin*1.02||WW*Z.s>fw()+2;O.frame.classList.toggle("zoomed",big);
    O.frame.style.touchAction=Z.s>smin*1.02?"none":"pan-y";
    var z=zn(),w=fw(),h=fh(),dpr=window.devicePixelRatio||1;
    // sharp tiles: only when the overview image would look soft, and only the ones on screen
    if(Z.s*dpr>1.05)tiles.forEach(function(t){if(t.done)return;var x=t.x*Z.s+Z.tx,y=t.y*Z.s+Z.ty,S=T*Z.s;
      if(x<w+S&&x+S>-S&&y<h+S&&y+S>-S){t.done=1;t.el.onload=function(){t.el.classList.add("in");};t.el.src=IMG+"t/"+t.n+".webp";}});
    var boxes=[];
    pins.forEach(function(p){var x=p.x*Z.s+Z.tx,y=p.y*Z.s+Z.ty,show=p.vis(z)&&x>-120&&x<w+120&&y>-80&&y<h+80;
      if(show&&p.bw){var bx=[x-8,y-10,x+p.bw,y+10];if(boxes.some(function(b){return bx[0]<b[2]&&bx[2]>b[0]&&bx[1]<b[3]&&bx[3]>b[1];}))show=false;else boxes.push(bx);}
      else if(show&&p.rid){var lw=(p.lw||60)/2,cb=[x-lw,y-26,x+lw,y+46],hit2=boxes.some(function(b){return cb[0]<b[2]&&cb[2]>b[0]&&cb[1]<b[3]&&cb[3]>b[1];});p.el.classList.toggle("nolab",hit2);boxes.push(hit2?[x-24,y-24,x+24,y+24]:cb);}
      else if(show&&p.size)boxes.push([x-20,y-20,x+20,y+20]);
      p.el.classList.toggle("off",!show);if(show){p.el.style.transform="translate("+x.toFixed(1)+"px,"+y.toFixed(1)+"px)"+p.tf;
        if(p.size){var d=Math.max(26,Math.min(64,p.size*Z.s));p.i.style.width=p.i.style.height=d+"px";p.i.style.fontSize=(d*.42)+"px";}}});
  }
  function zoomAt(k,cx,cy){var ns=Math.min(smax,Math.max(smin,Z.s*k)),f=ns/Z.s;Z.tx=cx-(cx-Z.tx)*f;Z.ty=cy-(cy-Z.ty)*f;Z.s=ns;apply();if(O.hint)O.hint.style.opacity="0";}
  var anim=0;
  function flyTo(wx,wy,s){cancelAnimationFrame(anim);var w=fw(),h=fh(),s1=Math.min(smax,Math.max(smin,s)),s0=Z.s,x0=Z.tx,y0=Z.ty,x1=w/2-wx*s1,y1=h/2-wy*s1,t0=performance.now(),D=matchMedia("(prefers-reduced-motion: reduce)").matches?1:650;
    (function step(now){var k=Math.min(1,(now-t0)/D),e=k<.5?2*k*k:1-Math.pow(-2*k+2,2)/2;Z.s=s0+(s1-s0)*e;Z.tx=x0+(x1-x0)*e;Z.ty=y0+(y1-y0)*e;clamp();draw();if(k<1)anim=requestAnimationFrame(step);})(t0);}
  function toWorld(cx,cy){var r=O.frame.getBoundingClientRect();return [(cx-r.left-Z.tx)/Z.s,(cy-r.top-Z.ty)/Z.s];}
  function regionAt(cx,cy){var el=document.elementFromPoint(cx,cy),c=el&&el.closest&&el.closest(".crest");if(c)return c.dataset.id;
    if(!hit)return null;var p=toWorld(cx,cy),x=Math.floor(p[0]/WW*hitW),y=Math.floor(p[1]/WH*hitH);if(x<0||y<0||x>=hitW||y>=hitH)return null;
    var v=Math.round(hit[(y*hitW+x)*4]/20);return v?D.hitOrder[v-1]:null;}
  function setHL(){var id=hover||sel,has=id&&D.hitOrder.indexOf(id)>=0;
    if(has){var src=IMG+"m/"+id+".webp";if(hl.getAttribute("src")!==src)hl.src=src;}
    hl.className="hl"+(has?(hover?" on":" sel"):"");
    pins.forEach(function(p){if(p.rid)p.el.classList.toggle("hot",p.rid===hover);});}
  function showCard(slug,name,kind){var I=D.info[slug],w=fw();
    var reg=null;Object.keys(D.regions).forEach(function(k){if(D.regions[k][2]===slug)reg=k;});
    var title=I&&I[0]||name, sub=I&&I[1]||"", desc=I&&I[2]||"", chs=(I&&I[3]||[]);
    card.innerHTML='<button type="button" class="x" aria-label="Close">×</button><div class="k">'+esc(kind)+'</div><h3>'+esc(title)+'</h3>'+(sub?'<div class="st">'+esc(sub)+'</div>':'')+(desc?'<p>'+esc(desc)+'</p>':'')+
      (chs.length?'<div class="faces">'+chs.map(function(c){return '<a href="journey.html?c='+c+'" title="'+esc(O.champName(c))+'"><img src="img/'+c+'-tile.webp" alt="'+esc(O.champName(c))+'" loading="lazy"></a>';}).join("")+'</div>':'')+
      '<div class="row">'+(reg?'<button type="button" data-go="'+reg+'">'+esc(O.regionName(reg))+' →</button>':'')+'</div>';
    card.classList.add("on");card.style.left=Math.max(12,Math.min(w-352,w-352))+"px";card.style.top="12px";
    var g=card.querySelector("[data-go]");if(g)g.onclick=function(){O.onRegion(g.dataset.go,true);};
    card.querySelector(".x").onclick=function(){card.classList.remove("on");};}
  function mount(opt){
    O=opt;root=document.createElement("div");root.className="rmap";
    root.innerHTML='<div class="world"><img class="base" alt="" src="'+IMG+(Math.min(screen.width,innerWidth)*(window.devicePixelRatio||1)<900?"base-1024.webp":"base.webp")+'"><img class="hl" alt=""></div><div class="shade"></div><div class="pins"></div><div class="card" role="dialog" aria-live="polite"></div><div class="cred">Map art © Riot Games</div>';
    O.stage.innerHTML="";O.stage.appendChild(root);
    world=root.querySelector(".world");base=root.querySelector(".base");hl=root.querySelector(".hl");pinsEl=root.querySelector(".pins");card=root.querySelector(".card");
    base.onload=function(){if(O.onReady)O.onReady();};
    for(var n=D.tiles[0];n<=D.tiles[1];n++){var i=n-1,x=(i%8)*T,y=Math.floor(i/8)*T-256;if(y+T<=0)continue;var im=document.createElement("img");im.className="tile";im.alt="";im.style.left=x+"px";im.style.top=y+"px";world.insertBefore(im,hl);tiles.push({n:n,x:x,y:y,el:im});}
    // the hit map (which region is under the pointer)
    var hi=new Image();hi.onload=function(){var c=document.createElement("canvas");c.width=hitW=hi.width;c.height=hitH=hi.height;var g=c.getContext("2d");g.drawImage(hi,0,0);hit=g.getImageData(0,0,hitW,hitH).data;};hi.src=IMG+"hit.png";
    // pins
    var add=function(el,x,y,vis,extra){pinsEl.appendChild(el);var p=Object.assign({el:el,x:x,y:y,vis:vis,tf:""},extra||{});pins.push(p);return p;};
    var bandleSpots=[[410,945]],bs=bandleSpots[Math.floor(Math.random()*bandleSpots.length)];
    var R=Object.assign({},D.regions,{bandle:[bs[0],bs[1],"bandle-city"]});if(R.piltover)R.piltover=[R.piltover[0]-30,R.piltover[1]-14,R.piltover[2]];if(R.zaun)R.zaun=[R.zaun[0]+34,R.zaun[1]+22,R.zaun[2]];
    Object.keys(R).forEach(function(id){var p=R[id],b=document.createElement("button");b.type="button";b.className="crest pin"+(id==="piltover"||id==="zaun"||id==="bandle"?" small":"")+(id==="piltover"?" up":"");b.dataset.id=id;
      b.style.setProperty("--rc",O.regionColor(id));b.setAttribute("aria-label",O.regionName(id));
      b.innerHTML='<i><img src="'+O.emblem(id)+'" alt=""></i><b>'+esc(O.regionName(id))+'</b>';
      b.addEventListener("click",function(e){e.stopPropagation();pick(id,true);});
      b.addEventListener("focus",function(){hover=id;setHL();});b.addEventListener("blur",function(){hover=null;setHL();});
      add(b,p[0],p[1],function(z){return z>.3||id===sel;},{rid:id,lw:Math.max(52,O.regionName(id).length*(innerWidth<640?9:11.5)+10)});});
    D.places.forEach(function(q){var slug=q[0],k=q[1],name=q[2],x=q[3],y=q[4],b=document.createElement("button");b.type="button";
      if(k==="l"){b.className="mark";b.innerHTML='<i></i><b>'+esc(name)+'</b>';var p=add(b,x,y,function(){return true;},{size:25});p.i=b.querySelector("i");
        b.addEventListener("click",function(e){e.stopPropagation();showCard(slug,name,"Landmark");});}
      else{b.className="town"+(k==="d"?" v":"");b.innerHTML='<i></i><b>'+esc(name)+'</b>';
        add(b,x,y,k==="c"?function(z){return z<.62;}:function(z){return z<.3;},{bw:name.length*(k==="c"?7.6:6.6)+18,k:k});
        b.addEventListener("click",function(e){e.stopPropagation();showCard(slug,name,k==="c"?"City":"Village");});}
    });
    // landmark labels only show once zoomed in a little; the medallion itself always covers Riot's 3D-model spot
    var CZ=.45;
    
    pins.forEach(function(p){if(!p.size)return;var lb=p.el.querySelector("b"),dmin=Math.min.apply(null,pins.filter(function(q){return q.rid;}).map(function(q){return Math.hypot(q.x-p.x,q.y-p.y);}));
      p.vis=function(z){lb.style.opacity=z<.7?1:0;return dmin<50?z<=.3:dmin<95?z<=.8:true;};});
    pins.sort(function(a,b){var r=function(p){return p.rid?0:p.size?1:p.k==="c"?2:3;};return r(a)-r(b);});
    // interaction
    var F=O.frame,pts=new Map(),drag=null,pinch=null,lastTap=0;
    F.addEventListener("pointerdown",function(e){if(e.target.closest(".hud,.card"))return;pts.set(e.pointerId,{x:e.clientX,y:e.clientY});
      if(pts.size===1)drag={x:e.clientX,y:e.clientY,tx:Z.tx,ty:Z.ty,moved:0};
      if(pts.size===2){var a=Array.from(pts.values());pinch={d:Math.hypot(a[0].x-a[1].x,a[0].y-a[1].y),s:Z.s};if(drag)drag.moved=99;}});
    F.addEventListener("pointermove",function(e){
      if(pts.has(e.pointerId)){pts.set(e.pointerId,{x:e.clientX,y:e.clientY});
        if(pts.size===2&&pinch){var a=Array.from(pts.values()),r=F.getBoundingClientRect(),d=Math.hypot(a[0].x-a[1].x,a[0].y-a[1].y);zoomAt(pinch.s*d/pinch.d/Z.s,(a[0].x+a[1].x)/2-r.left,(a[0].y+a[1].y)/2-r.top);return;}
        if(drag){var dx=e.clientX-drag.x,dy=e.clientY-drag.y;drag.moved=Math.max(drag.moved,Math.hypot(dx,dy));
          if((Z.s>smin*1.02||WW*Z.s>fw()+2)&&drag.moved>4){Z.tx=drag.tx+dx;Z.ty=drag.ty+dy;apply();F.classList.add("dragging");hover=null;setHL();if(O.tip)O.tip.classList.remove("on");}}
        return;}
      if(e.pointerType!=="mouse"||e.target.closest(".card"))return;
      var id=regionAt(e.clientX,e.clientY);if(id!==hover){hover=id;setHL();}
      if(id&&O.showTip)O.showTip(id,e.clientX,e.clientY);else if(O.tip)O.tip.classList.remove("on");
      F.style.cursor=id?"pointer":"";});
    var end=function(e){var was=drag;pts.delete(e.pointerId);if(pts.size<2)pinch=null;F.classList.remove("dragging");
      if(e.type==="pointerup"&&was&&was.moved<6&&pts.size===0&&!e.target.closest(".pins>*,.card,.hud")){
        var now=Date.now(),r=F.getBoundingClientRect();
        if(e.pointerType!=="mouse"&&now-lastTap<320){zoomAt(1.8,e.clientX-r.left,e.clientY-r.top);lastTap=0;}
        else{lastTap=now;var id=regionAt(e.clientX,e.clientY);if(id)pick(id,true);else card.classList.remove("on");}}
      if(pts.size===0)drag=null;};
    F.addEventListener("pointerup",end);F.addEventListener("pointercancel",end);
    F.addEventListener("pointerleave",function(e){if(e.pointerType==="mouse"){hover=null;setHL();if(O.tip)O.tip.classList.remove("on");}});
    F.addEventListener("dblclick",function(e){if(e.target.closest(".pins>*,.card,.hud"))return;var r=F.getBoundingClientRect();zoomAt(e.shiftKey?1/1.8:1.8,e.clientX-r.left,e.clientY-r.top);});
    F.addEventListener("wheel",function(e){if(!(e.ctrlKey||e.metaKey))return;e.preventDefault();var r=F.getBoundingClientRect();zoomAt(Math.exp(-e.deltaY*.01),e.clientX-r.left,e.clientY-r.top);},{passive:false});
    var C=function(){return [fw()/2,fh()/2];};
    if(O.zin)O.zin.onclick=function(){var c=C();zoomAt(1.7,c[0],c[1]);};
    if(O.zout)O.zout.onclick=function(){var c=C();zoomAt(1/1.7,c[0],c[1]);};
    if(O.zreset)O.zreset.onclick=function(){overview(true);};
    var lastW=0;window.addEventListener("resize",function(){var w=fw();if(Math.abs(w-lastW)<2)return;lastW=w;var c=C(),wc=[(c[0]-Z.tx)/Z.s,(c[1]-Z.ty)/Z.s],k=Z.s/smin;fit();Z.s=smin*k;Z.tx=fw()/2-wc[0]*Z.s;Z.ty=fh()/2-wc[1]*Z.s;apply();});
    fit();lastW=fw();overview(false);
  }
  function overview(fly){var cx=(LAND[0]+LAND[2])/2,cy=(LAND[1]+LAND[3])/2;if(fly){flyTo(cx,cy,smin);return;}Z.s=smin;Z.tx=fw()/2-cx*Z.s;Z.ty=fh()/2-cy*Z.s;apply();}
  function pick(id,fly){card.classList.remove("on");if(O.onRegion)O.onRegion(id,false);if(fly)focus(id);}
  function focus(id){var p=id==="bandle"?null:D.regions[id];if(!p){var b=pins.find(function(q){return q.rid===id;});if(b)p=[b.x,b.y];}if(!p)return;flyTo(p[0],p[1]+40,smin*2.1);}
  function select(id){sel=id;setHL();pins.forEach(function(p){if(p.rid)p.el.classList.toggle("sel",p.rid===id);});apply();}
  window.AtlasMap={mount:mount,select:select,focus:focus,overview:overview};
})();
