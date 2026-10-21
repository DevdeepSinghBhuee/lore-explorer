# Builds data/i18n/ui-<code>.js from ui_tr.py (phase 1) + ui_tr2 (2) + ui_tr3* (3) + ui4_<code>.py (4), and keeps i18n.js's EN dictionary in sync.
import json,sys,re,importlib.util as u
sys.path.insert(0,'.')
import ui_tr,ui_tr2,ui_tr3,ui_tr3b,ui_tr3c,ui_tr4_en,ui4x
ui_tr3.T.update(ui_tr3b.T);ui_tr3.T.update(ui_tr3c.T)
EN_ALL=dict(ui_tr2.EN);EN_ALL.update(ui_tr3.EN);EN_ALL.update(ui_tr4_en.EN);EN_ALL.update(ui4x.EN)
def L(p):
    s=u.spec_from_file_location('m',p);m=u.module_from_spec(s);s.loader.exec_module(m);return m
RB=json.load(open('i18n/rb_loc.json'))
GAL={'es-ES':'es-es','es-MX':'es-es','de':'de-de','fr':'fr-fr','it':'it-it','ja':'ja-jp','ko':'ko-kr','zh-CN':'zh-cn','zh-TW':'zh-tw'}
def lab(l):return RB[l]['labels'] if 'labels' in RB[l] else RB[l]
ENL=lab('en')
def clean(v):
    v=re.sub(r'\s*\([^)]*\)\s*$','',v).strip()
    return 'Body' if v=='Textkörper' else v
PLUR={'legend':'legends','unit':'units','spell':'spells','gear':'gear','battlefield':'battlefields','rune':'runes'}
def p4(code):
    m=L(f'ui4_{"es-ES" if code=="es-MX" else code}.py')
    d={k:v for k,v in m.T.items() if not k.startswith(('rbt_','rbr_','dom_','rb_t_'))}
    if code=='es-MX':d.update(m.MX)
    for k,(a,b) in m.REG.items():d['rg_'+k+'_tag']=a;d['rg_'+k+'_desc']=b
    for k,v in m.DNA.items():
        for n,x in zip(['magic','materials','shapes','lineage'],v):d[f'dn_{k}_{n}']=x
    # Riftbound game terms: Riot's own labels per language, else English
    G=lab(GAL[code]) if code in GAL else ENL
    for t,en in ENL['type'].items():
        loc=clean(G['type'].get(t,en));d['rbt_'+en]=loc
        d['rb_t_'+PLUR[t]]=loc if loc!=en else ui_tr4_en.EN['rb_t_'+PLUR[t]]
    for r,en in ENL['rar'].items():d['rbr_'+en]=clean(G['rar'].get(r,en))
    for x,en in ENL['dom'].items():d['dom_'+en]=clean(G['dom'].get(x,en))
    d['rbt_Token']='Token';d['rbt_Other']=ui_tr4_en.EN['rbt_Other'] if code not in m.T or 'rbt_Other' not in m.T else m.T['rbt_Other']
    d.update(ui4x.T[code])
    return d
R='/home/claude/runeterra-atlas/'
src=open(R+'i18n.js').read()
a=src.index('var EN={');b=src.index('\n  };',a)
en_block=src[a:b]
missing_en={k:v for k,v in EN_ALL.items() if not re.search(r'[\s,{]'+re.escape(k)+':',en_block)}
if missing_en:
    add=''.join(f',\n    {json.dumps(k) if "-" in k else k}:'+json.dumps(v,ensure_ascii=False) for k,v in missing_en.items())
    src=src[:b]+add+src[b:];open(R+'i18n.js','w').write(src)
print('added to EN:',len(missing_en))
for code in ui_tr.T:
    d=dict(ui_tr.T[code]);d.update(ui_tr2.T[code]);d.update(ui_tr3.T[code]);d.update(p4(code))
    miss=[k for k in EN_ALL if k not in d]
    if miss:print(code,'MISSING',miss)
    open(R+f'data/i18n/ui-{code}.js','w').write('window.ATLAS_UI='+json.dumps(d,ensure_ascii=False,separators=(',',':'))+';\n')
