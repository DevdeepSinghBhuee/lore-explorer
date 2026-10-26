from PIL import Image, ImageDraw, ImageFont, ImageFilter
import math,os
S="./og-work/"  # needs fonts/ (Marcellus SC, Alegreya Italic, Spline Sans Mono from github.com/google/fonts) and art/ (DDragon splashes from the InFinity54 mirror)
R="./"  # run from the repo root
OUT=R+"img/og/"; os.makedirs(OUT,exist_ok=True)
W,H=1200,630
GOLD=(200,170,110); TEXT=(235,228,211); MUTED=(170,176,192); INK=(8,13,24)
def font(n,size,wght=None):
    f=ImageFont.truetype(S+"fonts/"+n,size)
    if wght:
        try: f.set_variation_by_axes([wght])
        except Exception: pass
    return f
PAGES=[ # file, art, title, tagline, focus x (0-1)
 ("index",R+"img/scene/ionia.webp","Lore Explorer","Every champion, story and skin, in one place",0.62),
 ("daily","art/Jinx_0.jpg","Lore Explorer Daily","Seven League of Legends guessing games, new every day",0.62),
 ("atlas",R+"img/scene/ionia.webp","The Atlas","The map of Runeterra: every region, 173 champions and their bonds",0.5),
 ("journey","art/Ahri_0.jpg","Champion Journeys","Pick a champion. We'll show you everything worth knowing",0.66),
 ("reading",R+"img/scene/shadowisles.webp","The Reading Room","Every official League of Legends story and comic",0.5),
 ("skins","art/Ahri_15.jpg","The Wardrobe","Every League of Legends skin and its splash art",0.6),
 ("timeline",R+"img/scene/shurima.webp","The Timeline","Every champion, in the order they arrived",0.5),
 ("worlds",R+"img/scene/noxus.webp","Worlds 2026","Live scores, schedule and every roster",0.5),
 ("players",R+"img/scene/targon.webp","Worlds Players","Signature champions and Worlds history for every pro",0.5),
 ("theater",R+"img/scene/zaun.webp","The Theater","Cinematics, trailers and Worlds anthems",0.5),
 ("music",R+"img/scene/bilgewater.webp","League Music","Anthems, virtual bands and champion themes",0.5),
 ("library",R+"img/scene/freljord.webp","Runeterra Cards","Every Legends of Runeterra card and its lore",0.5),
 ("riftbound",R+"img/scene/void.webp","Riftbound Gallery","Every card of League's trading card game",0.5),
 ("rift",R+"img/rift/baron-art.webp","The Rift","Dragons, Baron Nashor and every jungle camp on Summoner's Rift",0.55),
 ("tft",R+"img/scene/bandle.webp","Teamfight Tactics","Every set, unit and Little Legend",0.5),
 ("finals",R+"img/scene/demacia.webp","The Finals","Every Worlds and MSI final, game by game",0.6),
 ("makeovers",R+"img/scene/zaun.webp","Then & Now","Old and new art of every reworked champion",0.6),
 ("gallery",R+"img/scene/piltover.webp","The Collection","Every profile icon, emote and ward skin",0.6),
 ("patches",R+"img/scene/zaun.webp","Patch Calendar","When the next League patch lands",0.5),
 ("items",R+"img/scene/piltover.webp","The Armory","Every item on Summoner's Rift and what it does",0.5),
 ("seasons",R+"img/seasons/s2026-1a.webp","The Seasons","Every season of League since 2009",0.62),
 ("beyond",R+"img/beyond/2xko.webp","Beyond the Rift","Every champion in Riot's other games and shows",0.62),
 ("mine","art/Lux_0.jpg","My Champions","Your favourite champions and the stories you've read",0.62),
]
def cover(im,fx):
    im=im.convert("RGB"); w,h=im.size; s=max(W/w,H/h); im=im.resize((math.ceil(w*s),math.ceil(h*s)),Image.LANCZOS)
    w,h=im.size; x=int(max(0,min(w-W,fx*w-W/2))); y=(h-H)//2; return im.crop((x,y,x+W,y+H))
def emblem(d,cx,cy,r,col,wid=3):
    pts=[(cx+r*math.cos(math.radians(a)),cy+r*math.sin(math.radians(a))) for a in range(-90,270,60)]
    d.line(pts+[pts[0]],fill=col,width=wid,joint="curve")
    cr=r*5/14; d.ellipse((cx-cr,cy-cr,cx+cr,cy+cr),outline=col,width=wid)
    for p in pts:
        dx,dy=p[0]-cx,p[1]-cy; L=math.hypot(dx,dy)
        d.line((cx+dx/L*cr,cy+dy/L*cr,p[0]-dx/L*(r*0.0),p[1]-dy/L*0),fill=col,width=wid)
def wrap(d,text,f,maxw):
    words=text.split(); lines=[]; cur=""
    for w in words:
        t=(cur+" "+w).strip()
        if d.textlength(t,font=f)<=maxw: cur=t
        else: lines.append(cur); cur=w
    lines.append(cur); return lines
for key,art,title,tag,fx in PAGES:
    src=art if art.startswith("/") else S+art
    im=cover(Image.open(src),fx)
    # darken: strong on the left where the text sits, lighter on the right
    grad=Image.new("L",(W,H))
    gd=ImageDraw.Draw(grad)
    for x in range(W):
        a=int(245*max(0,1-(x/W)/0.78)**1.15)+40; gd.line((x,0,x,H),fill=min(255,a))
    shade=Image.new("RGB",(W,H),INK); im=Image.composite(shade,im,grad)
    bottom=Image.new("L",(W,H)); bd=ImageDraw.Draw(bottom)
    for y in range(H): bd.line((0,y,W,y),fill=int(200*max(0,(y/H-0.55)/0.45)))
    im=Image.composite(shade,im,bottom)
    d=ImageDraw.Draw(im)
    d.rectangle((24,24,W-25,H-25),outline=(200,170,110,),width=2)
    d.rectangle((32,32,W-33,H-33),outline=(125,106,69),width=1)
    emblem(d,96,104,26,GOLD,3)
    d.text((140,90),"LORE EXPLORER",font=font("SplineSansMono.ttf",22,500),fill=GOLD,spacing=4)
    ft=font("MarcellusSC.ttf",92 if len(title)<17 else 80)
    lines=wrap(d,title,ft,720)
    y=230 if len(lines)==1 else 190
    for ln in lines:
        d.text((76,y),ln,font=ft,fill=TEXT); y+=ft.size*1.05
    fs=font("Alegreya-Italic.ttf",36,500)
    y+=14
    for ln in wrap(d,tag,fs,800):
        d.text((78,y),ln,font=fs,fill=(214,210,200)); y+=46
    d.text((78,H-84),"Free fan site  ·  devdeepsinghbhuee.github.io/lore-explorer",font=font("SplineSansMono.ttf",18,400),fill=MUTED)
    im.save(OUT+key+".jpg",quality=84,optimize=True,progressive=True)
    print(key,os.path.getsize(OUT+key+".jpg")//1024,"KB")
