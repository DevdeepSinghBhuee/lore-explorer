import asyncio,sys
from playwright.async_api import async_playwright
OUT='/tmp/claude-0/-home-claude/8ee0a6b0-fce1-509d-a3d5-f0b3af1791e2/scratchpad/'
LANGS=sys.argv[1].split(',') if len(sys.argv)>1 else ['ko','ru','de','th','zh-CN','en']
def cut(s,n=220):return (s or '').replace('\n',' | ')[:n]
async def run():
  async with async_playwright() as p:
    b=await p.chromium.launch()
    for i,lang in enumerate(LANGS):
      vp=(390,844) if i%2 else (1280,900)
      ctx=await b.new_context(viewport={'width':vp[0],'height':vp[1]})
      await ctx.add_init_script(f"if(!localStorage.getItem('atlas.lang'))localStorage.setItem('atlas.lang','{lang}')")
      pg=await ctx.new_page();errs=[];pg.on('pageerror',lambda e:errs.append(str(e)))
      await pg.route(lambda u: not u.startswith('http://localhost'), lambda r:r.abort())
      async def sw():
        return await pg.evaluate('document.documentElement.scrollWidth>innerWidth+1')
      await pg.goto('http://localhost:8765/atlas.html#c-jinx');await pg.wait_for_timeout(3000)
      print(lang,vp[0],'ATLAS',cut(await pg.inner_text('.hero'),200));print('  map labels',await pg.eval_on_selector_all('#map text.rname','x=>x.slice(0,5).map(e=>e.textContent)'))
      print('  region',cut(await pg.inner_text('.rhead'),400));print('  roster',await pg.inner_text('#rosterHead'),'| travel',cut(await pg.inner_text('#travel'),120),'| hscroll',await sw())
      await pg.screenshot(path=f'{OUT}p4_{lang}_atlas.png')
      await pg.goto('http://localhost:8765/theater.html');await pg.wait_for_timeout(1500)
      print('  THEATER',cut(await pg.inner_text('#now'),120),'|',await pg.eval_on_selector_all('.shelf h2','x=>x.slice(0,3).map(e=>e.textContent)'),'| chips',await pg.eval_on_selector_all('#regions .chip','x=>x.slice(0,3).map(e=>e.textContent)'),'|',cut(await pg.inner_text('footer'),160),'| hscroll',await sw())
      await pg.goto('http://localhost:8765/music.html');await pg.wait_for_timeout(1500)
      print('  MUSIC',cut(await pg.inner_text('.hero'),160),'|',cut(await pg.inner_text('#main'),200))
      await pg.click('[data-play="0"]');await pg.wait_for_timeout(300);print('  dock',await pg.inner_text('#nShelf'),'| hscroll',await sw())
      await pg.screenshot(path=f'{OUT}p4_{lang}_music.png')
      await pg.goto('http://localhost:8765/worlds.html');await pg.wait_for_timeout(1500)
      print('  WORLDS',cut(await pg.inner_text('.hero'),400));print('  tabs',await pg.inner_text('#tabs'),'|',await pg.inner_text('#tzNote'),'|',cut(await pg.inner_text('#schedule'),160))
      await pg.click('#teams .team');await pg.wait_for_timeout(300);print('  roster',cut(await pg.inner_text('#teams .roster'),120),cut(await pg.inner_text('#teams .allp'),80),'| trophy',cut(await pg.inner_text('#trophy'),100),'| hscroll',await sw())
      await pg.screenshot(path=f'{OUT}p4_{lang}_worlds.png')
      await pg.goto('http://localhost:8765/players.html');await pg.wait_for_timeout(1500)
      print('  PLAYERS',cut(await pg.inner_text('.hero'),150),'|',await pg.inner_text('#count'),'|',cut(await pg.inner_text('#roles'),80),'|',cut(await pg.inner_text('#grid .card'),80))
      await pg.goto('http://localhost:8765/players.html#p-faker');await pg.wait_for_timeout(1200)
      print('  dossier',cut(await pg.inner_text('#dz'),600),'| hscroll',await sw())
      await pg.screenshot(path=f'{OUT}p4_{lang}_players.png')
      await pg.goto('http://localhost:8765/library.html');await pg.wait_for_timeout(2000)
      print('  LIB',cut(await pg.inner_text('.hero'),250),'|',await pg.inner_text('#status'),'|',cut(await pg.inner_text('#types'),80),'|',await pg.eval_on_selector_all('#grid .card','x=>x.slice(0,2).map(e=>e.innerText.replace(/\\n/g," / "))'))
      await pg.click('#grid .card');await pg.wait_for_timeout(400);print('  plate',cut(await pg.inner_text('#plate'),300),await pg.eval_on_selector('#plate img.big','e=>e.getAttribute("src")'),'| hscroll',await sw())
      await pg.screenshot(path=f'{OUT}p4_{lang}_lib.png')
      await pg.goto('http://localhost:8765/riftbound.html');await pg.wait_for_timeout(2000)
      print('  RB',cut(await pg.inner_text('.hero'),200),'|',await pg.inner_text('#status'),'|',cut(await pg.inner_text('#domains'),90),'|',await pg.eval_on_selector_all('#grid .card','x=>x.slice(0,2).map(e=>e.innerText.replace(/\\n/g," / "))'))
      await pg.click('#grid .card');await pg.wait_for_timeout(400);print('  plate',cut(await pg.inner_text('#plate'),300),'| hscroll',await sw(),'|',cut(await pg.inner_text('footer'),200))
      await pg.screenshot(path=f'{OUT}p4_{lang}_rb.png')
      print('  errors',errs)
      await ctx.close()
    await b.close()
asyncio.run(run())
