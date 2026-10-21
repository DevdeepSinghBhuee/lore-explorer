import json,re,glob
R='/home/claude/runeterra-atlas/data/i18n/'
M={'de':'de_de','es-ES':'es_es','es-MX':'es_mx','fr':'fr_fr','it':'it_it','ja':'ja_jp','ko':'ko_kr','pl':'pl_pl','pt-BR':'pt_br','ru':'ru_ru','th':'th_th','tr':'tr_tr','zh-TW':'zh_tw'}
NOSP={'ja','th','zh-TW'}
def clean(s,code):
    s=s.replace('\r\n','\n')
    s=s.replace('<br>','' if code in NOSP else ' ')
    s=s.replace('<zwsp>','​').replace('<nbsp>',' ')
    s=re.sub(r'<[^>]*>','',s)
    s=re.sub(r'[ \t]{2,}',' ',s); s=re.sub(r' +\n','\n',s); s=re.sub(r'\n +','\n',s)
    return s.strip()
for code,loc in M.items():
    src={}
    for f in glob.glob(f'lor/*/data/*-{loc}.json'):
        for c in json.load(open(f)):src[c['cardCode']]=c
    p=R+f'lor-{code}.js';js=open(p).read()
    a=js.index('window.ATLAS_I18N_LOR=')+len('window.ATLAS_I18N_LOR=');b=js.index(';\n',a)
    D=json.loads(js[a:b]);ch=0
    for k,v in D.items():
        c=src.get(k)
        if not c:continue
        d=clean(c.get('description',''),code); l=clean(c.get('levelupDescription',''),code)
        if d!=v[1] or l!=v[2]:ch+=1
        v[1]=d;v[2]=l
    js=js[:a]+json.dumps(D,ensure_ascii=False,separators=(',',':'))+js[b:]
    open(p,'w').write(js);print(code,len(D),'changed',ch,'src',len(src))
