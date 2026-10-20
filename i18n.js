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
    tr_note:"Champion names and text are Riot's official translations; menus and buttons are translated by this site.",
    fav_add:"Add to my champions",
    fav_in:"In my champions",
    surprise:"Surprise me",
    en_partial:"Parts of this page are still in English.",
    j_doc:"Runeterra Journeys",
    j_eye:"Runeterra · journeys",
    j_h1a:"Pick a champion.",
    j_h1b:"We'll show you around.",
    j_intro:"Each journey walks you through one champion: who they are, the story to read first, what to watch and listen to, the people in their life, their best skins and when they arrived.",
    j_find:"Find a champion…",
    j_none:"No champion by that name.",
    j_through:"A journey through {r}",
    j_arrived:"Arrived {d}",
    j_another:"Pick another champion",
    j_who:"Who they are",
    j_who_sub:"From Riot's official biography",
    j_full_bio:"Read the full biography on Universe ↗",
    j_play:"How they play",
    j_slot:"{k} ability",
    j_cd:"Cooldown",
    j_cd_val:"{v} s",
    j_cost:"Cost",
    j_range:"Range",
    j_global:"Global",
    j_noclip:"Riot hasn't published a preview clip for this one.",
    j_read:"Read this first",
    j_stories:{"one": "{n} story", "other": "{n} stories"},
    j_comics:{"one": "{n} comic issue", "other": "{n} comic issues"},
    j_own:"{name}'s own story",
    j_shortest:"Shortest way in",
    j_min_read:"{n} min read",
    j_by:"by {a}",
    j_read_uni:"Read on Universe ↗",
    j_then:"Then, in the order Riot published them",
    j_comics_h:"Comics",
    j_min:"{n} min",
    j_reading_all:"Everything about {name} in the Reading Room →",
    read_badge:"✓ Read",
    j_watch:"Watch",
    j_videos:{"one": "{n} official video", "other": "{n} official videos"},
    j_with:{"one": "with {n} other", "other": "with {n} others"},
    j_more_theater:"{n} more in the Theater →",
    j_listen:"Listen",
    j_tracks:{"one": "{n} track", "other": "{n} tracks"},
    j_login:"Login screen theme",
    j_mv:"Music video",
    j_play_btn:"Play →",
    j_people:"The people in their life",
    j_bonds:{"one": "{n} bond", "other": "{n} bonds"},
    bt_family:"Family",
    bt_ally:"Ally",
    bt_mentor:"Mentor",
    bt_enemy:"Enemy",
    bt_complicated:"Complicated",
    bt_linked:"Linked",
    j_web:"See {name}'s web of bonds on the Atlas →",
    j_skins:"Their best looks",
    j_skin_n:{"one": "{n} skin", "other": "{n} skins"},
    j_rarest:"rarest first",
    rar_0:"Standard",
    rar_1:"Rare",
    rar_2:"Epic",
    rar_3:"Legendary",
    rar_4:"Mythic",
    rar_5:"Ultimate",
    rar_6:"Exalted",
    rar_7:"Transcendent",
    j_all_skins:"All {n} skins →",
    j_cards:"In the card games",
    j_arrival:"When they arrived",
    j_nth:"Champion #{n} of {t}",
    j_released:"Released",
    j_patch:"Patch {p}",
    j_revealed:"Revealed",
    j_days_before:{"one": "{n} day before release", "other": "{n} days before release"},
    j_order:"Release order",
    j_of_champs:"of {t} champions",
    j_on_rift:"On the Rift for",
    j_years:"{y} years",
    j_same_day:"Released the same day as {list}",
    j_and_others:"and {n} others",
    j_timeline:"See {name} on the timeline →",
    j_next:"Where to go next",
    j_continue:"Continue the journey",
    j_also_from:"Also from {r}",
    j_credit:"Everything here comes from the rest of the Atlas: Riot's champion bios and Universe stories, Riot's official videos and music, Data Dragon art, and the League Wiki and Leaguepedia for relationships and release dates. Stories open on Riot's Universe site.",
    j_en_bits:"Video titles, relationship notes and comic titles are in English for now.",
    a_take:"Take the {name} journey →",
    a_rel_title:"See {name} on the release timeline",
    a_full_story:"Full story on Universe ↗",
    a_ties:"Ties",
    a_loner:"A loner, as far as the records go.",
    a_no_story:"No official story explains this link yet.",
    a_src_r:"Riot story",
    a_src_w:"League Wiki",
    a_necrit:"▶ Necrit explains this",
    a_stories:"Official stories",
    a_in_lor:"In Legends of Runeterra",
    a_in_rb:"In Riftbound",
    a_clips:"Abilities & clips →",
    a_skins:"Skins · {n}",
    a_browse:"Browse all →",
    a_read_about:"Read about {name}",
    a_rr:"Reading Room →",
    a_other_region:"From another region"
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
  var packP=null,fullP=null,stP=null;
  window.AtlasI18n={
    LANGS:LANGS,lang:lang,t:t,ready:ready,
    pack:null,
    loadPack:function(){if(lang==="en")return Promise.resolve(null);if(!packP)packP=load("data/i18n/"+lang+".js").then(function(){window.AtlasI18n.pack=window.ATLAS_I18N_PACK||null;return window.AtlasI18n.pack;});return packP;},
    set:function(l){try{localStorage.setItem(KEY,l);}catch(e){}location.reload();},
    // helpers for champion text (fall back to English data)
    name:function(c){var p=window.AtlasI18n.pack;return (p&&p.champs[c.id]&&p.champs[c.id][0])||c.name;},
    title:function(c){var p=window.AtlasI18n.pack;return (p&&p.champs[c.id]&&p.champs[c.id][1])||c.title;},
    region:function(id,en){var p=window.AtlasI18n.pack;if(id==="wanderers")return lang==="en"?(en||"The Wanderers"):t("r_wanderers");return (p&&p.regions&&p.regions[id])||en||id;},
    tag:function(tg){var p=window.AtlasI18n.pack;return (p&&p.tags&&p.tags[tg])||tg;},
    // Riot's Universe site in this language (Vietnamese and Indonesian have none, so English)
    uni:({"ko":"ko_KR","zh-CN":"zh_CN","zh-TW":"zh_TW","ja":"ja_JP","es-ES":"es_ES","es-MX":"es_MX","pt-BR":"pt_BR","fr":"fr_FR","de":"de_DE","it":"it_IT","pl":"pl_PL","ru":"ru_RU","tr":"tr_TR","th":"th_TH"})[lang]||"en_US",
    // full biography + ability descriptions (data/i18n/full-<lang>.js) and Universe story titles (data/i18n/stories-<lang>.js)
    full:null,stories:null,
    loadFull:function(){var A=window.AtlasI18n;if(lang==="en")return Promise.resolve(null);if(!fullP)fullP=load("data/i18n/full-"+lang+".js").then(function(){A.full=window.ATLAS_I18N_FULL||null;return A.full;});return fullP;},
    loadStories:function(){var A=window.AtlasI18n;if(A.uni==="en_US")return Promise.resolve(null);if(!stP)stP=load("data/i18n/stories-"+lang+".js").then(function(){A.stories=window.ATLAS_I18N_STORIES||null;return A.stories;});return stP;},
    bio:function(c){var f=window.AtlasI18n.full;return (f&&f[c.id]&&f[c.id][0])||c.bio;},
    // a story link opens in this language only when Riot has it in this language
    storyUrl:function(slug){var A=window.AtlasI18n;var on=A.stories&&A.stories[slug];return "https://universe.leagueoflegends.com/"+(on?A.uni:"en_US")+"/story/"+slug+"/";},
    storyTitle:function(slug,en){var A=window.AtlasI18n;return (A.stories&&A.stories[slug]&&A.stories[slug][0])||en;},
    storyDesc:function(slug,en){var A=window.AtlasI18n;return (A.stories&&A.stories[slug]&&A.stories[slug][1])||en;},
    champUrl:function(uid){return "https://universe.leagueoflegends.com/"+window.AtlasI18n.uni+"/champion/"+uid+"/";},
    skin:function(c,num,en){var p=window.AtlasI18n.pack;var v=p&&p.champs[c.id]&&p.champs[c.id][5]&&p.champs[c.id][5][num];return (v&&v!=="default")?v:en;},
    date:function(iso,opt){var p=String(iso).split("-");var d=new Date(Date.UTC(+p[0],+p[1]-1,+p[2]));return d.toLocaleDateString(lang==="en"?"en-GB":lang,Object.assign({day:"numeric",month:"long",year:"numeric",timeZone:"UTC"},opt||{}));}
  };
})();
