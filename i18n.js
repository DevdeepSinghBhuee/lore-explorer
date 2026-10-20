/* Runeterra Atlas — languages.
   Loaded (not deferred) in <head> of every page, before anything else, so pages can use it at once.
   - AtlasI18n.lang: the visitor's language (chosen in the menu, else their browser's language if we have it, else English)
   - AtlasI18n.t(key, vars): interface text; English lives here, other languages in data/i18n/ui-<lang>.js
   - AtlasI18n.ready: a promise that resolves once that language's interface text has loaded
   - AtlasI18n.loadPack(): loads Riot's official champion text for the language (data/i18n/<lang>.js)
   Champion names, titles, bios, classes, resources, ability and skin names come from Riot's data; interface text is ours. */
(function(){
  "use strict";
  var LANGS=[["en","English"],["ko","한국어"],["zh-CN","简体中文"],["zh-TW","繁體中文"],["ja","日本語"],["es-ES","Español (España)"],["es-MX","Español (Latinoamérica)"],["pt-BR","Português (Brasil)"],["fr","Français"],["de","Deutsch"],["it","Italiano"],["pl","Polski"],["ru","Русский"],["tr","Türkçe"],["vi","Tiếng Việt"],["th","ไทย"],["id","Bahasa Indonesia"]];
  var CODES=LANGS.map(function(l){return l[0];});
  var KEY="atlas.lang";
  function stored(){try{return localStorage.getItem(KEY);}catch(e){return null;}}
  function match(tag){
    if(!tag)return null;tag=String(tag);var low=tag.toLowerCase();
    for(var i=0;i<CODES.length;i++)if(CODES[i].toLowerCase()===low)return CODES[i];
    if(/^zh-(tw|hk|mo|hant)/.test(low))return "zh-TW";
    if(/^zh/.test(low))return "zh-CN";
    if(/^es-(es)$/.test(low))return "es-ES";
    if(/^es/.test(low))return low==="es"?"es-ES":"es-MX";
    if(/^pt/.test(low))return "pt-BR";
    var base=low.split("-")[0];
    for(var j=0;j<CODES.length;j++)if(CODES[j].toLowerCase()===base)return CODES[j];
    return null;
  }
  var lang=match(stored());
  if(!lang){var nav=(navigator.languages&&navigator.languages.length?navigator.languages:[navigator.language||"en"]);for(var k=0;k<nav.length&&!lang;k++)lang=match(nav[k]);}
  if(!lang)lang="en";
  // pages that are translated set <html lang> themselves (others stay "en")

  var EN={
    // menu
    g_champions:"Champions",g_lore:"Lore",g_play:"Play",g_esports:"Esports",g_watch:"Watch & Listen",g_cards:"Card games",
    it_journeys:"Journeys",it_journeys_d:"A guided tour of any champion",
    it_skins:"Skins",it_skins_d:"Every skin and its splash art",
    it_timeline:"Timeline",it_timeline_d:"Every champion in release order",
    it_atlas:"Atlas",it_atlas_d:"The map of Runeterra and its web of bonds",
    it_reading:"Reading Room",it_reading_d:"Every official story and comic",
    it_daily:"Runeterra Daily",it_daily_d:"Guess today's champions: clues, splash, ability, lore",
    it_worlds:"Worlds 2026",it_worlds_d:"Live scores, schedule and teams",
    it_players:"Players",it_players_d:"The pros at Worlds 2026",
    it_theater:"Theater",it_theater_d:"Official cinematics and trailers",
    it_music:"Music",it_music_d:"Anthems, bands and champion themes",
    it_lor:"Runeterra cards",it_lor_d:"Every Legends of Runeterra card",
    it_rb:"Riftbound",it_rb_d:"The Riftbound trading card game",
    mine:"My champions",mine_d:"Your favourites and the stories you have read",yours:"Yours",menu:"Menu",close_menu:"Close menu",language:"Language",
    en_only:"This page is in English for now.",
    resume_title:"Back to your puzzle",resume_sub:"Today's {mode} · {guesses} so far",
    // daily
    m_clues:"Clues",m_splash:"Splash",m_ability:"Ability",m_lore:"Lore",
    md_clues:"Region, class, range and more",md_splash:"Zoomed-in art, then name the skin",md_ability:"A spell icon, turned and greyed",md_lore:"Their biography, name hidden",
    intro:"Four League of Legends champions to find every day: from clues, a zoomed-in splash, an ability icon and their lore. Same puzzles for everyone, free, no sign-up.",
    until_tomorrow:"until tomorrow's puzzles",
    puzzle_n:"Puzzle #{n} · {date}",practice_eye:"Practice round · {mode}",
    guess_champ:"Guess the champion",
    guesses:{one:"{n} guess",other:"{n} guesses"},
    legend_match:"match",legend_close:"close (shares a class · within 2 years · within 2 skins)",legend_miss:"no match",legend_arrows:"the answer is higher / lower",
    whose_splash:"Whose splash art is this?",full_view:"Full view",zoom:"{z}× zoom",
    whose_ability:"Whose ability is this?",hint_colour:"colour after 3 misses",hint_upright:"turns upright after 5 misses",no_more_hints:"no more hints",
    who_is_this:"Who is this?",parts_shown:"{a} of {b} parts shown",hint_region_after:"region hint after 3 misses",hint_class_after:"class hint after 5 misses",
    from_region:"From {r}",class_is:"Class: {c}",
    placeholder:"Type a champion…",guess_btn:"Guess",tried:"{n} tried",start_typing:"Start typing to see champions",reveal:"Reveal the answer",
    col_champion:"Champion",col_region:"Region",col_class:"Class",col_range:"Range",col_resource:"Resource",col_released:"Released",col_skins:"Skins",
    melee:"Melee",ranged:"Ranged",no_resource:"None",r_wanderers:"The Wanderers",
    practice_note:"Practice round · doesn't count towards your streak",back_today:"← Back to today's puzzle",
    bonus_skin:"Bonus · which skin is it?",bonus_ability:"Bonus · which ability is it?",original:"Original {name}",original_short:"Original",passive:"Passive",
    first_try:"First try!",found_it:"Found it",better_luck:"Better luck tomorrow",in_n:"in {guesses}",revealed:"The answer was revealed.",
    skin_label:"skin",ability_label:"ability",
    share:"Share result",journey_btn:"{name}'s journey",practice_btn:"Practice round",resume_practice:"Resume practice",practice_no_streak:"Practice rounds don't count towards your streak.",
    st_played:"Played",st_won:"Won",st_streak:"Streak",st_best:"Best",status_new:"New",
    copied:"Copied — paste it anywhere",copy_fail:"Couldn't copy on this browser",
    how_title:"How to play",
    how_clues:"<b>Clues:</b> guess any champion. Each column compares your guess with the answer: region, class, melee or ranged, resource (mana, energy…), release year and number of skins. Green is a match, orange is close, red is a miss; arrows say whether the answer's year or skin count is higher or lower.",
    how_splash:"<b>Splash:</b> a piece of one of the champion's splash arts. Every wrong guess zooms out. Once you have the champion, a bonus asks which skin it is.",
    how_ability:"<b>Ability:</b> one of the champion's ability icons, turned and drained of colour. After 3 misses it gets its colour back, after 5 it turns the right way up. Once you have the champion, a bonus asks which ability it is.",
    how_lore:"<b>Lore:</b> the champion's biography with their name hidden, shown a part at a time. Each wrong guess reveals more; after 3 misses you get their region, after 5 their class.",
    how_more:"New puzzles at midnight your time. Share your result without spoilers. Practice rounds are unlimited and don't affect your streak.",
    share_head:"Runeterra Daily #{n} · {mode} · {result}",share_practice:"Runeterra Daily (practice) · {mode} · {result}",skin_bonus:"Skin bonus",ability_bonus:"Ability bonus",
    ex_eyebrow:"After your puzzles",ex_title:"Explore Runeterra",
    ex_atlas:"The Atlas",ex_atlas_d:"The map of Runeterra: every region, all 173 champions and the bonds between them.",
    ex_journeys:"Champion journeys",ex_journeys_d:"Pick a champion; we'll show you around.",
    ex_reading:"Reading Room",ex_reading_d:"244 stories and 38 comics from Riot.",
    ex_skins:"Skins",ex_skins_d:"Every skin and its splash art.",
    ex_timeline:"Timeline",ex_timeline_d:"Every champion in the order they arrived.",
    ex_worlds:"Worlds 2026",ex_worlds_d:"Live scores, teams and players.",
    ex_music:"Music",ex_music_d:"Anthems, virtual bands and champion themes.",
    daily_credit:"Inspired by fan games like LoLdle. Champion facts from Riot's Data Dragon, the League Wiki and Leaguepedia; champion text is Riot's. Results and streaks are kept in your browser only.",
    tr_note:"Champion names and text are Riot's official translations; menus and buttons are translated by this site."
  };
  var UI=null;
  function pick(key){var v=UI&&UI[key];return v==null?EN[key]:v;}
  function fill(s,vars){return String(s).replace(/\{(\w+)\}/g,function(m,k){return vars&&vars[k]!=null?vars[k]:m;});}
  var plural;try{plural=new Intl.PluralRules(lang);}catch(e){plural={select:function(n){return n===1?"one":"other";}};}
  function t(key,vars){
    var v=pick(key);if(v==null)return key;
    if(typeof v==="object"){var n=vars&&vars.n!=null?Number(vars.n):0;var form=plural.select(n);v=v[form]!=null?v[form]:(v.other!=null?v.other:v.one);}
    return fill(v,vars);
  }
  function load(src){return new Promise(function(res){var s=document.createElement("script");s.src=src;s.onload=function(){res(true);};s.onerror=function(){res(false);};document.head.appendChild(s);});}
  var ready=lang==="en"?Promise.resolve():load("data/i18n/ui-"+lang+".js").then(function(){UI=window.ATLAS_UI||null;});
  var packP=null;
  window.AtlasI18n={
    LANGS:LANGS,lang:lang,t:t,ready:ready,
    pack:null,
    loadPack:function(){if(lang==="en")return Promise.resolve(null);if(!packP)packP=load("data/i18n/"+lang+".js").then(function(){window.AtlasI18n.pack=window.ATLAS_I18N_PACK||null;return window.AtlasI18n.pack;});return packP;},
    set:function(l){try{localStorage.setItem(KEY,l);}catch(e){}location.reload();},
    // helpers for champion text (fall back to English data)
    name:function(c){var p=window.AtlasI18n.pack;return (p&&p.champs[c.id]&&p.champs[c.id][0])||c.name;},
    title:function(c){var p=window.AtlasI18n.pack;return (p&&p.champs[c.id]&&p.champs[c.id][1])||c.title;},
    region:function(id,en){var p=window.AtlasI18n.pack;if(id==="wanderers")return lang==="en"?(en||"The Wanderers"):t("r_wanderers");return (p&&p.regions&&p.regions[id])||en||id;},
    tag:function(tg){var p=window.AtlasI18n.pack;return (p&&p.tags&&p.tags[tg])||tg;}
  };
})();
