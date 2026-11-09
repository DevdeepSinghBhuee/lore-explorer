// Cinematic region stories (atlas.html, story.js). One entry per region; regions without an entry show no story.
// Every text line below is Riot's own words, copied 2026-10-27 from the Universe faction page JSON
// (universe-meeps.leagueoflegends.com/v1/en_us/factions/<id>/index.json: faction.overview.short + image-gallery captions),
// read in the browser pane. Images are hotlinked from Riot's CDN (cmsassets.rgpub.io …?w=N&fm=webp) and Data Dragon.
// Champion bonds come from data/bonds.js, places from data/runeterra-map.js — not repeated here.
// Shape: name, kicker (Riot map subtitle), universe, closeup {city, cfx, cfy, cityTitle}, lore [beats], city [[title, caption, path, w/h]],
// book {kind (story.js KINDS), pages [[title, caption, path]]}, people [[title, caption, path]], video (YouTube id in videos.js), mapPlace, next, nextLine,
// optional placesLabel / peopleLabel / peopleTitle. Chapters without material are skipped. 12 regions added 2026-11-09 the same way as Piltover
// (overview split at sentence ends; galleries picked per region; Bandle City opens on "The Bandle Tree" because its splash is nearly black).
window.ATLAS_RSTORY = {
  piltover: {
    name: "Piltover", placesLabel: "Its streets",
    kicker: "The City of Progress",
    universe: "https://universe.leagueoflegends.com/en_US/region/piltover/",
    cms: "https://cmsassets.rgpub.io/sanity/images/dsfx7636/",
    // 1. opening: Riot's region splash, starting close on (cfx, cfy) and pulling back
    closeup: {
      city: "universe/6c77423961def6e3a82d9a36545782f1a06386e0-4681x2114.jpg", cfx: .58, cfy: .36, cityTitle: "Piltover (Riot's region splash)"
    },
    // 2. the lore, a beat per screen (Riot: faction.overview.short, split at sentence ends, not changed)
    lore: [
      "Piltover is a thriving, progressive city whose power and influence is on the rise.",
      "It is Valoran’s cultural center, where art, craftsmanship, trade and innovation walk hand in hand. Its power comes not through military might, but the engines of commerce and forward thinking.",
      "Situated on the cliffs above the district of Zaun and overlooking the ocean, fleets of ships pass through its titanic sea-gates, bringing goods from all over the world.",
      "The wealth this generates has given rise to an unprecedented boom in the city’s growth. Piltover has - and still is - reinventing itself as a city where fortunes can be made and dreams can be lived.",
      "Burgeoning merchant clans fund development in the most incredible endeavors: grand artistic follies, esoteric hextech research, and architectural monuments to their power.",
      "With ever more inventors delving into the emergent lore of hextech, Piltover has become a lodestone for the most skilled craftsmen the world over."
    ],
    // 3. the city: [title, Riot caption, image path under cms, width/height ratio]
    city: [
      ["Trade and Progress", "The ancient city of Zaun was a northern Shuriman trading post, but it was the creation of Piltover’s sea-gates more than three thousand years later that brought even greater prosperity.", "universe/424d067e9e99e079462dc8067bd6c1c8bb1097b2-1920x839.jpg", 2.29],
      ["The Sun Gates", "The construction of these sea-gates made Piltover a hub of mercantile trade between Valoran and Shurima, bringing unimaginable wealth to the city's rulers.", "universe_live/a8c26270e292331d2826811fb464225d8edb6705-1037x1080.jpg", .96],
      ["Impacts Across Valoran", "Trade is the lifeblood of Piltover, and its command of the main sea-route between east and west has seen its coffers swell with gold. A consequence of this has been the rapid expansion of the Noxian empire, whose armies and supplies can now travel the length and breadth of Valoran with relative ease. It has also allowed Bilgewater to prosper as a haven for reavers who prey on ships traveling to and from Piltover.", "universe_live/529e35506fb3f3889bed61f30a69789c3385ec1f-1920x939.jpg", 2.04],
      ["Structures of Wonder", "Piltover's newer structures are graceful mixtures of polished marble, latticework bronze and shimmering glass that sit alongside older building of hewn stone and weathered timber. Fluted towers inlaid with gold and silver reach for the clear skies, as arching bridges span the chasms between the clifftops.", "universe_live/7a05cbbf68e494dd72d22e4597608e3a8632ffcb-896x1080.jpg", .83],
      ["Wealth and Status", "The entrances to mercantile buildings are often incredibly elaborate. Even those dwellings that predate hextech have since been ornamented with elaborate details to further reinforce the impression that Piltover is a city drowning in gold.", "universe_live/4d91026e2d26f93adec85ebbb1df7ec044d45fa0-843x1080.jpg", .78],
      ["Workshop of the Horological Institute", "Workshops of hextech researchers are magnificent examples of what a wealthy patron can do for an inventor.", "universe_live/7a12e95392eb5446a9224e044e4c0c45b8cfb850-1920x711.jpg", 2.7],
      ["The Ecliptic Vaults, Piltover’s most secure bank", "", "universe/6c8650cd2b140e86ae2fdc7ab534b5d6bf9ec44b-1920x1004.jpg", 1.91],
      ["Bluewind Court", "", "universe_live/505aeb5c36bdc9fa51c4c3482696b40f9edcd3a2-1920x1064.jpg", 1.8]
    ],
    // 4. the region's book: Piltover = a hextech blueprint book. Hold the crystal to power each plate.
    book: {
      kind: "hextech",
      title: "The Hextech Folio",
      hint: "Press and hold the crystal to power this plate",
      pages: [
        ["Hextech", "Hextech is the newly emergent fusion of magic and technology used to create exquisite artifacts that can be wielded by anyone, not just those few with a natural aptitude for the arcane. It harnesses the magical power contained within extremely rare crystals, and its power is limited only by the imagination of their users. It is capable of amazing feats, from powering machinery to creating beams of light capable of cutting the strongest steel. The process of crafting hextech is a closely guarded secret, and no two artificers work to the same methodology. As such, each item of hextech is a unique artifact of rare beauty, a bespoke creation that will likely have taken years to craft", "universe/d6e1ea86cef1a4de4e10720a2d0883ae05a5d697-1920x885.jpg"],
        ["Hextech Cube Battery", "The first attempt to capture crystalline power in portable form was the Hexahedral Configuration, with shards cut from the Odyn Valley.", "universe/17772fa92f4cceb85125cfac5a6f158ef7ecd42b-874x1080.jpg"],
        ["Atlas Gauntlets", "Exceedingly rare and powerful hextech augments that considerably boost the wearer's strength and dexterity. Continued usage has resulted in skeletal damage to the wearer, but this has not halted demand for such items.", "universe/4534a991503ea99095e2e89bb15b858ee32f9b6c-1424x1080.jpg"],
        ["Ekalavya's Hexbow", "The power of the hex-coils in this bow make its bolts so powerful that they can punch through cold forged iron.", "universe/409f73b3160251b1e72f162081f0df7357007441-1101x1080.jpg"],
        ["Vishlaa's Hexlyene Caliver", "Originally manufactured for the Piltover Wardens, the designs for this hex-powered weapon have since been locked away as being too dangerous.", "universe/6e4504c90f5ec1c95dd39d1d41e7d98da7c041cc-1920x624.jpg"],
        ["Pneuma-tube Conduit", "Used for transporting sealed messages between the Commercia Halls, a tangled network of vacuum pipers threads the city, allowing extremely rapid communication across Piltover.", "universe/70d3441cdb579b7c769d651b26d944889e9f7885-1070x1080.jpg"],
        ["Lighting the City of Progress", "A light source on the richest streets in Piltover, these lights pierce the darkness (and rising Zaun Gray) with ease.", "universe/f92fc78b178b9711202fca862a87d56092127e81-1080x1080.jpg"],
        ["Merchant Clan Sigils", "The mercantile clans of Piltover each have their own unique sigil to identify their homes, workshops, shipments, warehouses, inventions, brands and places of business. Each sigil bears many meanings and interpretations; some obvious, some less so.", "universe/6e03e184735fb8cd22a88063144a4b79b364d4fd-1763x1080.jpg"],
        ["Disc-Runner", "", "universe/fffafdb49b6bc17086c6c7c1f004a27a47f8beef-485x1080.jpg"],
        ["Hextech Guns", "", "universe/13583c0484e4d0c646424fc2c835957a50c0b814-1728x1080.jpg"]
      ]
    },
    // 5. people of the city (Riot gallery "Residents")
    people: [
      ["Residents of the City", "The cosmopolitan nature of Piltover makes its inhabitants as varied as their city, but there remains a particular character to its people. A citizen of Piltover is typically self-reliant, does not expect handouts, and always aspires to do better. They are averse to meddling from outsiders, and see an open and free market as essential to the city’s continued prosperity.", "universe_live/1e66722bc3b5b5aea6de1593cd3d4e57728cf67f-1041x1080.jpg"],
      ["Jago Medarda", "The current master of Clan Medarda, Jago commands immense respect and power throughout Piltover. With the revenue generated by his father's piston patents, Jago is funding research into using hextech to speed the opening and closing of the Sun Gates.", "universe_live/bbed115b12edb23a8c8af77f8883e3f9fe82d558-789x1080.jpg"],
      ["Wardens", "The Wardens are the men and women tasked with maintaining the rule of law in Piltover. The organization is funded by trade taxes and 'voluntary' contributions from the mercantile clans, outfitting the Wardens with uniforms and equipment. Many of these donations take the form of unique hextech, such as specialized weaponry or other devices.", "universe_live/95bde7673e26b1e697e03b742848f8f354d75793-789x1080.jpg"],
      ["Vaido Violante", "A former apprentice of Corvin Reveck, Vaido works on numerous projects at once, but stabilizing the energy outputs of his renowned Atlas Gauntlets is at the top of his list of priorities.", "universe_live/349b28338b0929429f67a25fd574b268902ab384-789x1080.jpg"]
    ],
    // 6. official film (videos.js entry; Riot features it on the faction page)
    video: "qCVLRh1y96M",
    // 7. map + the way out
    mapPlace: "piltover-town", next: "zaun", nextLine: "Below the cliffs, Zaun"
  },
  zaun: {
    "name": "Zaun",
    "kicker": "Polluted undercity",
    "universe": "https://universe.leagueoflegends.com/en_US/region/zaun/",
    "closeup": {
      "city": "universe/56d6fa8581379d60cc17951edbe3d686e52bf51b-1730x1080.jpg",
      "cfx": 0.62,
      "cfy": 0.3,
      "cityTitle": "Zaun (Riot's region splash)"
    },
    "lore": [
      "Zaun is a large, undercity district, lying in the deep canyons and valleys threading Piltover.",
      "What light reaches below is filtered through fumes leaking from the tangles of corroded pipework and reflected from the stained glass of its industrial architecture.",
      "Zaun and Piltover were once united, but are now separate, yet symbiotic societies. Though it exists in perpetual smogged twilight, Zaun thrives, its people vibrant and its culture rich.",
      "Piltover’s wealth has allowed Zaun to develop in tandem; a dark mirror of the city above.",
      "Many of the goods coming to Piltover find their way into Zaun’s black markets, and hextech inventors who find the restrictions placed upon them in the city above too restrictive often find their dangerous researches welcomed in Zaun.",
      "Unfettered development of volatile technologies and reckless industry has rendered whole swathes of Zaun polluted and dangerous.",
      "Streams of toxic runoff stagnate in the city’s lower reaches, but even here people find a way to exist and prosper."
    ],
    "city": [
      [
        "Sump Level",
        "",
        "universe/8c9d3e24d072183bda406ff84d7c2b93b0b3d213-743x1080.jpg",
        0.69
      ],
      [
        "Entresol Level",
        "",
        "universe/d241029d1e9ed784ac3b3adfd866e879022065f7-743x1080.jpg",
        0.69
      ],
      [
        "Promenade Level",
        "The upper reaches of Zaun exist alongside the lower districts of Piltover, though the differing architecture means the two could never be confused. This is where the wealthy of Zaun gather to shop, dine, and trade goods and supplies from below.",
        "universe/4cc76adea39a5792d523e3516c1b2cefa7bbaf3b-743x1080.jpg",
        0.69
      ],
      [
        "City of Iron and Glass",
        "Most of Zaun's structures are crafted from lattice ironwork, either forged in the many seething foundries or wrought from scavenged material discarded from above. Though there is brutal functionality to the bolts-and-rivets of Zaun's structures, its inhabitants still manage to craft breathtaking wonders that pierce the smog and reach for the sky.",
        "universe/54fe8ac32c74bb2ae488d24f918f83b9daaf894e-1526x1050.jpg",
        1.45
      ],
      [
        "Tower of the College of Techmaturgy rising into Piltover",
        "",
        "universe/6f32e7187bacff3654d196d1b0e77d12b8edb92a-824x1080.jpg",
        0.76
      ],
      [
        "Backstreet hextech deals",
        "",
        "universe_live/84d22902356e7b69fec7dba23703f3a51ed97410-1920x975.jpg",
        1.97
      ],
      [
        "Breather Station, entrance to Shimmer Bar below",
        "",
        "universe/d7858e6a65fed5e14321604dbde4f144640bd795-1920x1067.jpg",
        1.8
      ],
      [
        "Boundary Markets thrive where Piltover and Zaun meet",
        "",
        "universe/3b6df4047902ac8960f128d24b9f7c62051cb77f-1920x1057.jpg",
        1.82
      ]
    ],
    "book": {
      "kind": "chem",
      "pages": [
        [
          "Sump-gas Nebulizer",
          "",
          "universe_live/66d738bc75a2db9c2e333a6f8fd2d6929d87264d-973x1080.jpg"
        ],
        [
          "Hex Carbine",
          "",
          "universe_live/6e89a08b3d3732526de149cf95cb19c4754a84eb-1920x702.jpg"
        ],
        [
          "Reusable Esophilters",
          "",
          "universe_live/a9bd1ac02cf34a9d3adb9494af77efafc5f04445-1299x1080.jpg"
        ],
        [
          "Chemtech",
          "",
          "universe_live/609ed0dca84011b430d72e61c88a86154b07ed41-1309x1080.jpg"
        ],
        [
          "Integral Exo-philtrator",
          "",
          "universe_live/68e405cb390a4ad556a25a4dbea1947b90a2a757-1046x1080.jpg"
        ]
      ]
    },
    "people": [
      [
        "Baron Velveteen Lenare",
        "A chem-baron with many business interests in Piltover, Lenare deals mainly in research into golem technology. Her ravaged body was dying, so she had her head transplanted to a hextech-powered replacement. She visits Piltover regularly for fluid baths, and blood/oil transfusions.",
        "universe/0304f92e4a41c1b140485b0cfa68e0383bb5cff5-644x1080.jpg"
      ],
      [
        "Chem-Barons",
        "A loose alliance of convenience exists between Zaun's powerful Chem-Barons, powerful individuals who each control an area of the city. It is they and their thugs who keep Zaun from descending into chaos.",
        "universe/fc19b5b9f9c3b2a14b55bf0d2c9b98bb6eebf6e9-1241x1080.jpg"
      ],
      [
        "Baron Wencher Spindlow",
        "Once a lowly lieutenant, Spindlow murdered his boss and took over his empire. Armed with a pair of shock-batons, he is a ruthless killer who sees murder and mayhem as tools of the trade.",
        "universe/41570627dd20d2a9581e36b38264d365ef329528-672x1080.jpg"
      ],
      [
        "Baron Saita Takeda",
        "Takeda has made no secret of his disdain for his fellow chem-barons. Claiming lineage from an exiled caste of warriors from a distant land, he has plans far beyond his own territories and interests.",
        "universe/503e78a76640f7c4394b8fd826909fb12e16f637-719x1080.jpg"
      ],
      [
        "Chem Punks",
        "Though the majority of troublemaking gangs form in the lower reaches of Zaun, their members come from every level of the city, and Piltover too.",
        "universe/54c3a3d5d9fe63f415e24c34baf64cd5e5e99a01-1920x477.jpg"
      ]
    ],
    "mapPlace": "zaun-town",
    "next": "noxus",
    "nextLine": "Next: Noxus",
    "video": "fsnDbealN9E"
  },
  demacia: {
    "name": "Demacia",
    "kicker": "Proud military kingdom",
    "universe": "https://universe.leagueoflegends.com/en_US/region/demacia/",
    "closeup": {
      "city": "universe/5b80fe8ddd3d935c3f258f3e145b8aed4b7460bf-1920x887.jpg",
      "cfx": 0.5,
      "cfy": 0.32,
      "cityTitle": "Demacia (Riot's region splash)"
    },
    "lore": [
      "A strong, lawful kingdom with a prestigious military history, Demacia’s people have always valued the ideals of justice, honor, and duty most highly, and are fiercely proud of their cultural heritage.",
      "But in spite of these lofty principles, this largely self-sufficient nation has grown more insular and isolationist in recent centuries.",
      "Now, Demacia is a kingdom in turmoil.",
      "The capital, the Great City of Demacia, was founded as a refuge from sorcery after the nightmare of the Rune Wars, and built upon the riddle of petricite—a peculiar white stone that dampens magical energy.",
      "It is from here that the royal family has long seen to the defense of the outlying towns and villages, farmland, forests, and mountains rich with mineral resources.",
      "However, following the sudden death of King Jarvan III, the other noble families have not yet approved the succession of his sole heir, young Prince Jarvan, to the throne.",
      "Those who dwell beyond the heavily guarded borders are increasingly viewed with suspicion, and many former allies have begun to look elsewhere for protection, in these uncertain times.",
      "Some dare to whisper that the golden age of Demacia has passed, and unless its people are willing to adapt to a changing world—something many believe they are simply incapable of doing—the kingdom’s decline may be inevitable.",
      "And all the petricite in the land will not protect Demacia from itself."
    ],
    "city": [
      [
        "High Silvermere, a city in the rocky highlands of Demacia’s north-west",
        "",
        "universe_live/3b37fbd9906411615fcf2e5f00b27bfd372cec12-1598x1080.jpg",
        1.48
      ],
      [
        "The Citadel of Dawn, palace of Jarvan III",
        "",
        "universe/222c1bbe2432ad0e7b700a83f238358140d9fdb2-1581x1080.jpg",
        1.46
      ],
      [
        "The Hall of Valor, where fallen Demacian Warriors are remembered for their sacrifice",
        "",
        "universe/5b80fe8ddd3d935c3f258f3e145b8aed4b7460bf-1920x887.jpg",
        2.16
      ],
      [
        "The Temple of the Lightbringers",
        "",
        "universe_live/44e779f5334342c3f3bc1f303354fe4512ce6385-1916x1076.jpg",
        1.78
      ],
      [
        "The Grand Plaza of Demacia City, where its rulers are appointed to roars of acclaim from the people",
        "",
        "universe_live/e642b245f57dc2457f41c147a3ec9cd9a5fe4712-1795x1010.jpg",
        1.78
      ]
    ],
    "book": {
      "kind": "petricite",
      "pages": [
        [
          "Demacian Weapons",
          "The design ethos of Demacia is elegant, yet minimalist and austere. Its armor and weapons are not overly ornate.",
          "universe_live/e52159664be31087a01704e7178816dde219230b-986x1080.jpg"
        ],
        [
          "Military Elite",
          "Demacia boasts a small but elite standing army. Its captains and generals lead from the front, and their warriors follow with unwavering discipline.",
          "universe_live/69a1432ed46d98feb3208d0d0b1284a660627ad3-950x1080.jpg"
        ],
        [
          "Demacia Steel",
          "Sometimes referred to as silver steel or rune-steel, this alloy is highly regarded across Runeterra. It is rumored that Demacian armorers quench the metal in blessed waters, to offer protection from magic in battle.",
          "universe_live/f9c94749b6678b6fa9ef5ca44bbde8ef0846f1ef-558x1080.jpg"
        ],
        [
          "Props",
          "",
          "universe_live/9e9a25be7cfb587cdad4a4a2ff0c690553d94184-1010x1080.jpg"
        ],
        [
          "Demacia Raptors",
          "Native to the high crags, raptors are voracious predators. Nevertheless, rare individuals have been known to forge such a bond with these creatures that the raptor may permit itself to be ridden. These riders serve in the Demacian military, scouting and harassing the enemy lines.",
          "universe_live/7bd076861ced2ff22c56daaf45e5ba0f2240bfa3-835x1080.jpg"
        ],
        [
          "Raptor Wingspan",
          "",
          "universe_live/9e2ecfc4e3c5e8a39ebb3c4afb4a32ab719fca98-1739x1080.jpg"
        ]
      ]
    },
    "people": [
      [
        "Prince Jarvan IV",
        "",
        "universe_live/0c74c30df24708b7b3363e486c6828c20f9d8e43-656x1080.jpg"
      ],
      [
        "Demacia Elite Guard",
        "",
        "universe_live/19a638eff3001cee256eeb0a2a23ff3ed59d371e-469x1080.jpg"
      ],
      [
        "Line Warrior and Palace Guard",
        "",
        "universe_live/e822ba14d538d4a708dbfe83dda96d92474734fe-1792x1080.jpg"
      ],
      [
        "Raptor Knight",
        "",
        "universe_live/18c3942fb79e13ed22453416cf6c8dc4a259febd-1134x1080.jpg"
      ]
    ],
    "mapPlace": "demacia",
    "next": "freljord",
    "nextLine": "Next: The Freljord",
    "video": "oKt58b7AwJc"
  },
  noxus: {
    "name": "Noxus",
    "kicker": "Brutal expansionist empire",
    "universe": "https://universe.leagueoflegends.com/en_US/region/noxus/",
    "closeup": {
      "city": "universe/6310fe5db818f80b84ee784a746cc28ee1273e6b-1920x1080.jpg",
      "cfx": 0.52,
      "cfy": 0.28,
      "cityTitle": "Noxus (Riot's region splash)"
    },
    "lore": [
      "Noxus is a powerful empire with a fearsome reputation.",
      "To those beyond its borders, it is brutal, expansionist, and threatening, yet those who look past its warlike exterior see an unusually inclusive society, where the strengths and talents of its people are respected and cultivated.",
      "The Noxii were once fierce barbarian tribes, until they stormed the ancient city that now lies at the heart of their domain.",
      "Under threat from all sides, they aggressively took the fight to their enemies, pushing their borders outward with each passing year.",
      "This struggle for survival has made modern Noxians a deeply proud people who value strength above all—though that strength can manifest in many different forms.",
      "Anyone can rise to a position of power and respect within Noxus if they display the necessary aptitude, regardless of social standing, background, homeland, or wealth.",
      "Those who are able to wield magic are held in particularly high esteem, and are actively sought out in order that their special talents may be honed and best harnessed for the benefit of the empire.",
      "But in spite of this meritocratic ideal, the old noble houses still wield considerable power… and some fear that the greatest threat to Noxus comes not from its enemies, but from within."
    ],
    "city": [
      [
        "Layers of History",
        "The Immortal Bastion, at the heart of Noxus, is far more ancient than the empire itself. It is said that it was constructed on the order of the dread revenant Mordekaiser, and parts of it have been razed and rebuilt over the centuries, such that there are layers to its streets, and some districts now lie below ground. Few dare walk these streets after dark without guards to protect them.",
        "universe_live/3dc58dc70f017510447a49fd05a0e6ed83deefff-674x1080.jpg",
        0.62
      ],
      [
        "Noxian Presence in Shurima",
        "A number of ports and cities in northern Shurima were voluntarily assimilated into the empire. The original inhabitants of these settlements live in relative peace with their Noxian counterparts, seeing the exchange of food and preferential trade as a price worth paying for military protection from raiders.",
        "universe_live/355a5e1a7319eab08e348d75fbcfb4979986cd21-1920x853.jpg",
        2.25
      ],
      [
        "Life is a Battle",
        "Noxians respect strength above all things, and the only way to remain strong is to be constantly tested. They relish the opportunity to compete with one another, since to not be challenged is to grow weak, and even those at the peak of power must always seek new ways to challenge themselves... or they will not remain in power for long. It is not just physical or martial strength that Noxians admire—those who demonstrate expertise in politics, craftsmanship, trade, and magic all help to create a stronger Noxus.",
        "universe_live/fb300ca74eea40f058e348f4e376293f38b8b68d-1920x962.jpg",
        2.0
      ],
      [
        "A State of Perpetual Conflict",
        "Noxus is an aggressive and expansionist empire, always looking to widen its borders by conquering new lands. It does not always do so by violence—indeed, many are the nations that have taken the knee before the Grand General, seeing a chance for greater stability and security in joining the empire. Those who defy Noxus, however, are crushed without mercy.",
        "universe/52ec6cbffae67a9a693844dd3f7cc0d960557dca-1920x773.jpg",
        2.48
      ],
      [
        "Oppressive and Defensible",
        "Noxian cities are characterized by imposing structures, claustrophobic streets, crenellated buildings, steep-sloped walls, and immense gateways. Their cities emphasize the strength and dominance of the empire, and are highly defensible—an enemy attempting to take a Noxian city by force can expect to be fought and resisted at every turn, for even the humblest home is built like a fortress.",
        "universe_live/3c614aeee79861717acea73ecaf74564ff87f168-1472x1080.jpg",
        1.36
      ]
    ],
    "book": {
      "kind": "banner",
      "pages": [
        [
          "The Warbands of Noxus",
          "Noxus has one of the largest armies in the known world, composed of elite troops such as the Trifarian Legion, as well as hundreds of individual, localized warbands. Led by their own chieftains, marshals, and captains, each warband is unique, with its own culture, hierarchy and favored way of war. They fulfill specific roles as part of a much larger warhost, perhaps fighting as frontline shock troops, heavy infantry, scouts, assassins or cavalry—whatever best suits their skills.",
          "universe_live/6cc26f782bb07b36ba928c82cf23d9c2c4f29790-1920x939.jpg"
        ],
        [
          "Strength in Variety",
          "Even within the Trifarian Legion, there is little uniformity within the ranks. In Noxus, a warrior’s natural talents and specialities are embraced, rather than forcing them to conform to a certain way of waging war. This carries across into all aspects of Noxian life—they believe in discovering what you are good at, and then finding a way to utilize that to make the empire stronger.",
          "universe_live/f1cf6bc8fdb9893bb6d494193047d9a80f156385-1639x1080.jpg"
        ],
        [
          "The Trifarian Legion",
          "The most elite, respected, and battle-hardened military force within the Noxian empire, “the Legion” is led by Darius himself. They are not only the best soldiers in Noxus, but also the most loyal, utterly devoted to the empire and its leaders. Their armor is heavy and utilitarian, and often features three indentations hammered into their breastplates, representing the Trifarix—the three principles of strength, and the name given to Grand General Swain’s ruling council.",
          "universe_live/9146fa476cb2d7c385e0673e0d92ea2f72fa4e65-1565x1080.jpg"
        ],
        [
          "Noxian Weaponry",
          "The forges of Noxus never cool, churning out swords, axes, and armor in vast quantities for distribution to the warhosts. The empire values function over form, their designs often incorporating additional uses, such as hooked handles to unhorse mounted enemies. In recent years, Noxus has begun to experiment with crude black powder weapons and chem-tech from Zaun, though the results are mixed—often as destructive to friend as they are to the enemy.",
          "universe_live/5379ce49b0e34b45a56fccb6f3a7ead93aa0cefb-1920x960.jpg"
        ],
        [
          "Noxian Armor",
          "Noxian-forged weapons, tools, and implements tend to share the same severe aesthetic as can be seen in the empire's architecture and dress.",
          "universe_live/904d020ff0624a25e83599477a6ddfb9ae16d7e9-502x1080.jpg"
        ],
        [
          "Axe of Darius",
          "",
          "universe_live/94aceac9bccad2fb81082144360700d9b1a935fe-603x1080.jpg"
        ],
        [
          "Warmasons",
          "Warmasons are resourceful scouts, engineers, and warriors who design and oversee the construction of roads, bridges and fortifications. Often the first indication of Noxian expansion is not the sight of troops on the march, but a lone warmason scouting enemy territory for possible invasion routes.",
          "universe_live/6e6c916402b21b025857563be2f5b707bed822d0-955x1080.jpg"
        ],
        [
          "Basilisks",
          "Monstrous reptiles from the southern jungles, basilisks are fierce predators that can grow to gargantuan sizes. Young basilisks are prized riding beasts, and few can stand against their charge. After they become too large for a rider to control, they are put to use as beasts of burden, or sometimes as living battering rams to smash down the walls of besieged cities.",
          "universe_live/94d13066d349471e382286fd87eabe8995c73bd4-1920x1073.jpg"
        ]
      ]
    },
    "people": [
      [
        "Culturally Inclusive",
        "As Noxus expands and defeats neighboring cultures and cities, it offers the conquered people a choice; swear loyalty to Noxus and be judged solely on your worth, or be destroyed. This is not subterfuge or any kind of ruse; the Noxians are as good as their word, and many who have embraced their conquerors' way of life find their prospects greatly improved. But those who refuse to bend the knee are crushed without mercy.",
        "universe_live/8bdb851c9cdfc43f1bf1775cbef7488db2736b70-1585x1080.jpg"
      ],
      [
        "Old Blood, New Blood",
        "Anyone can prosper in Noxus, no matter their background, so long as they have the strength of will, and the drive to succeed. The warlord Darius is a perfect example of this, rising from nothing to become one of the empire’s most powerful leaders. Despite this meritocratic ideal, the old noble families still wield considerable power at the heart of the empire, and some fear that the greatest threat to Noxus comes not from its enemies, but from within.",
        "universe_live/112c4b4e614cf56c054bf32f8dc565ae49eba5be-1669x1080.jpg"
      ],
      [
        "Drake-hounds",
        "Drake-hounds are a species of wingless, wolf-sized carnivores that lair in the mountains to the north of the Noxian capital. They are vicious pack hunters, and much favored in Noxus as war-beasts, guard creatures, and expensive (albeit dangerous) pets. To own one or more drake-hounds is a visible symbol of wealth and power.",
        "universe_live/bf01fa227d245d7e78032db9b5ad494d467e42af-1669x1080.jpg"
      ],
      [
        "Noxus and Magic",
        "Noxians generally regard magic as another powerful tool in their arsenal. Those who are able to wield it are held in high esteem, and are actively sought out—even beyond the borders of Noxus—in order that their special talents may be honed and best harnessed for the benefit of the empire.",
        "universe_live/be6da1aaa258f31e33687d64a692aff94926e65a-1920x1080.jpg"
      ]
    ],
    "mapPlace": "noxus",
    "next": "demacia",
    "nextLine": "Next: Demacia",
    "video": "FGlhWPwrkDg"
  },
  freljord: {
    "name": "The Freljord",
    "kicker": "Harsh frozen land",
    "universe": "https://universe.leagueoflegends.com/en_US/region/freljord/",
    "closeup": {
      "city": "universe/ee60551d26850cfbff088f571bc5e1688b1a143b-2034x1080.jpg",
      "cfx": 0.82,
      "cfy": 0.33,
      "cityTitle": "The Freljord (Riot's region splash)"
    },
    "lore": [
      "The Freljord is a harsh and unforgiving place—where the people are born warriors, who must persevere against all odds.",
      "Proud and fiercely independent, the tribes of the Freljord are often considered wild, rugged, and “uncivilized” by their neighbors across Valoran, who do not know the ancient traditions that shaped them.",
      "Many thousands of years ago, the alliance between the sisters Avarosa, Serylda, and Lissandra was shattered in a war that unknowingly threatened all of Runeterra, plunging the northern lands into chaos, and near-constant winter.",
      "Now, only those truly exceptional mortals who seem immune to the ravages of fire or ice seem destined, or able, to lead.",
      "Despite the best efforts of the Frostguard, myths and legends still endure of the old gods, the enigmatic yetis, and restless spirit walker shamans.",
      "The raiders of the Winter’s Claw range further with each passing year, harrying the borders of Demacia to the south, and the frontiers of Noxus to the east.",
      "Finally, seeking a more peaceful future, the fractious independent tribes and clans have begun to offer their allegiance to Ashe, young queen of the Avarosans.",
      "Even so, the portents are grim. War is surely returning to the Freljord, and none can hope to escape it."
    ],
    "city": [
      [
        "Frostguard Citadel",
        "",
        "universe_live/000ce0d5967aaabe1d9b8c2fad2eb924b8bfa53d-788x1080.jpg",
        0.73
      ],
      [
        "The ruined Fortress of the Iceborn",
        "",
        "universe_live/6b165d20dbf3581d00ff72d3413d0abd3e7a1f56-756x1080.jpg",
        0.7
      ],
      [
        "The pilgrim site of Rakelstake",
        "",
        "universe_live/d179f417166142fc42f350770d34848a170aa8c7-1920x1019.jpg",
        1.88
      ],
      [
        "The Ice-locked harbor of Glaserport, with its chained wolfships",
        "",
        "universe_live/a36c34e10a4ff6366028b7d4bbf2401ca1a537b2-1920x959.jpg",
        2.0
      ],
      [
        "The frozen caverns of the Howling Abyss",
        "",
        "universe_live/20bcad642df569884c814cb9c99a5e1257cc9a2c-1577x1080.jpg",
        1.46
      ],
      [
        "Warded gateway to the Howling Abyss",
        "",
        "universe/245b4173f2b90cd0e181ea1be4ad876154696a7a-1920x798.jpg",
        2.41
      ],
      [
        "Vaults of the Iceborn beneath Frosthorn Peak",
        "",
        "universe_live/884a56e9c5937f91fdde2dfe53eeb4b0eeafddc5-1920x967.jpg",
        1.99
      ]
    ],
    "book": {
      "kind": "frost",
      "pages": [
        [
          "Domain of the Ice Witch",
          "In the deepest halls of the Frostguard Citadel, Lissandra spends most of her waking hours in this grand, vaulted audience chamber. It is from here that she delivers her chilling sermons, hears the reports of her priests... and passes judgment on the fate of heretics among the tribes they serve.",
          "universe_live/f1dc099bf08f95d2461e826921a1040441847bdb-1800x2400.jpg"
        ],
        [
          "The Draklorn",
          "As the highest tier of the priesthood—answering only to the Ice Witch herself—Draklorn are among the most zealous and learned of all Frostguard. Some of them rarely set foot outside the Citadel’s walls, and they are no doubt privy to secrets that would never be entrusted to the lower ranks.",
          "universe_live/ba1596e939e595b95b950ba63c9f2df418885c04-1900x1140.jpg"
        ],
        [
          "Holding Back the Darkness",
          "At key points throughout the Howling Abyss, gigantic spiked barricades of stone and iron were set into the walls by the Frostguard, many thousands of years ago. One day, when the Watchers reawaken, these meager defenses may buy some precious time for those above to prepare for the final battle.",
          "universe_live/4ddcef8e31c9849fd0c3d93bbc5c417b4f6409bb-5833x3000.jpg"
        ],
        [
          "Eyes in the Abyss",
          "Warriors of the Keeper’s Lodge diligently patrol the locations of some of the largest known Watchers, or at least those closest to the icy surface. This particular beast is known as “the Pierce-Eye”, ever since it was skewered with titanic Mortis Stones dropped from the fortress high above.",
          "universe_live/2598cfca8ee119c6390e68fa2109328ee3a77d5c-5000x2500.jpg"
        ],
        [
          "Mortis Stones",
          "These sleek daggers of frozen granite, over a hundred feet in length, are weapons of last resort when a Watcher stirs from its slumber. The Frostguard have not needed to drop even a single stone in many centuries... but they stand ready to do so, whenever the alarm is raised.",
          "universe_live/f9feed44690c385387c0325a096aa1a1ae3e8dde-3048x2297.jpg"
        ],
        [
          "Tribal Weaponry",
          "The blades and bows used by the tribes are fashioned from wood, steel, and bone, and in the rarest cases may also incorporate True Ice.",
          "universe_live/1e8922c5afb67405ce9a06444958352816b3db24-1128x1080.jpg"
        ],
        [
          "True Ice",
          "True Ice occurs naturally and never melts, although it is extremely rare. Only Iceborn warriors can stand its freezing touch, and may wield it in battle.",
          "universe_live/192b7e04a9cf4f57440be9196231c0ca990f6d4e-667x1040.jpg"
        ]
      ]
    },
    "people": [
      [
        "Raiders and Reavers",
        "Death stalks the Freljord in a thousand guises—with fangs, blades, numbing frostbite, and bitter starvation. To survive is to fight every death, crush every threat, steal every advantage, and each new dawn brings a choice to the Winter’s Claw: do whatever it takes to survive, or die.",
        "universe_live/2381b4ffc9dd696220c2936d2ae7a2df82ddc336-1900x1019.jpg"
      ],
      [
        "Seasonal Settlements",
        "During the months of summer raiding, warriors of the Winter’s Claw range far across the northern lands, taking and repurposing whatever they need. As winter approaches, they will ground their ships, establish temporary homesteads, and prepare to wait out the longer, colder nights until the thaw comes around again.",
        "universe_live/922fe749c0f9f8d7800ad418081476cf18d246fc-1900x882.jpg"
      ],
      [
        "Take Whatever You Need",
        "The Winter’s Claw rarely let anything go to waste. Their weapons might be steel looted from fallen enemies, or nothing more than sharpened wood and knapped flint. Thick fabrics and animal pelts give protection against the cold—adorned with the bones, tusks, and horns of their most prized kills.",
        "universe_live/826e9c529e29b1ff7aaf4b7a270cc2b6f9eaf1ec-1900x539.jpg"
      ],
      [
        "Beast Riders",
        "In spite of its harsh and unforgiving climate, the Freljord is home to a wide variety of fantastical fauna, particularly suited to life there. The Winter’s Claw do not tame or coddle their mounts, but encourage the creatures’ wild and aggressive survival instincts even as they take the reins.",
        "universe_live/c614322847afb172c9bab9aa1e368cb70ee4b579-1900x885.jpg"
      ],
      [
        "Hunting in the Depths",
        "Whenever conditions in and around the frozen seas permit it, the most skilled divers are sent beneath the waves in search of prey. They rub seal fat over their skin and clothing for extra warmth, and may take an extra lungful of air down with them in reclaimed swim bladders.",
        "universe_live/9ead3d8eb35410b0c754f89043bf4b7048543510-1900x876.jpg"
      ],
      [
        "A Tribe on the Move",
        "Sometimes, the frozen sea routes take longer than usual to open up again. Impatient raiders may sacrifice a ship or two to build harnesses for their beasts of burden, dragging the rest to open water in an attempt to outpace their less enterprising rivals.",
        "universe_live/e2847c8b9cbcf1b576b433592642efb28ae6b6e2-1900x821.jpg"
      ]
    ],
    "mapPlace": "freljord",
    "next": "targon",
    "nextLine": "Next: Targon",
    "video": "BTnVvmqB9fY"
  },
  ionia: {
    "name": "Ionia",
    "kicker": "The First Lands",
    "universe": "https://universe.leagueoflegends.com/en_US/region/ionia/",
    "closeup": {
      "city": "universe/1691574092da433ea3a4c896c96f8c87d5f7e45a-1920x888.jpg",
      "cfx": 0.76,
      "cfy": 0.33,
      "cityTitle": "Ionia (Riot's region splash)"
    },
    "lore": [
      "Surrounded by treacherous seas, Ionia is composed of a number of allied provinces scattered across a massive archipelago, known to many as the First Lands.",
      "Since Ionian culture has long been shaped by the pursuit of balance in all things, the border between the material and spirit realms tends to be more permeable here, especially in the wild forests and mountains.",
      "Although these lands’ enchantments can be fickle, its creatures dangerous and fae, for many centuries most Ionians led lives of plenty.",
      "The warrior monasteries, provincial militias—and even Ionia itself—had been enough to protect them. But that ended twelve years ago, when Noxus attacked the First Lands.",
      "The empire’s seemingly endless warhosts savaged Ionia, and were only defeated after many years, and at great cost.",
      "Now, Ionia exists in an uneasy peace. Different reactions to the war have divided the region—some groups, such as the Shojin monks or the Kinkou, seek a return to isolationist pacifism, and pastoral traditions.",
      "Other more radical factions, such as the Navori Brotherhood and the Order of Shadow, demand a militarization of the land’s magic, to create a single, unified nation that can take vengeance on Noxus.",
      "The fate of Ionia hangs in a delicate balance that few are willing to overturn, but all can feel shifting uneasily beneath their feet."
    ],
    "city": [
      [
        "Market",
        "",
        "universe_live/e0a08a7654a71dd48f624fe7ea2ec189e42af5cf-1917x1080.jpg",
        1.77
      ],
      [
        "The Rainbowed Canyons of Shi",
        "",
        "universe_live/06b68528c3080d7c882118dd8125655cfd000e76-1920x812.jpg",
        2.36
      ],
      [
        "The Luonn-Kon",
        "",
        "universe_live/553df8675b48d321dcb2a072fbfbdb1fa24ba1ae-1764x1080.jpg",
        1.63
      ],
      [
        "Coastal Region",
        "",
        "universe_live/7167be57432556be8170a582c09dae87c0e0251e-1920x1080.jpg",
        1.78
      ],
      [
        "Ionian Farm",
        "",
        "universe_live/be226cc46fc8c540058cc7dd22265327106fbc83-1832x837.jpg",
        2.19
      ],
      [
        "Forest Market",
        "",
        "universe_live/32e13bdc6ee2c23376d5643c0810b9235b2cd8b0-832x1080.jpg",
        0.77
      ],
      [
        "Dragon's Nest",
        "",
        "universe_live/b6046643559a7858083ce2a1f2d9ea8cb1e6a9ba-1920x1080.jpg",
        1.78
      ],
      [
        "Lake of Lighted Lilies",
        "",
        "universe_live/0485b2eb8a1d211826dc4205b9b9aaeadd649e59-835x1080.jpg",
        0.77
      ]
    ],
    "book": {
      "kind": "ink",
      "pages": [
        [
          "The First Lands",
          "Magic suffuses every part of Ionia—its people, its history, and most of all the land itself. All aspects of life there hang in a balance, with still so much left to be discovered and explored. Those who call this vast continent home strive to find harmony among the diverse races and habitats, far older than most others on Runeterra.",
          "universe_live/e8a24e6e60fe602dae0b9211b58465ec689a8d03-1920x737.jpg"
        ],
        [
          "Life As One",
          "The people of Ionia’s many provinces have always seen themselves as part of the natural world, and adapted their ways to live alongside all manner of fantastical flora and fauna. To outsiders, such a close relationship may appear strange, but it is through this interdependence that both the land and its inhabitants have thrived for countless generations.",
          "universe_live/d02f8eb694965633cdfbfe16a70d581a76e4b302-1920x864.jpg"
        ],
        [
          "An Ancient And Respected History",
          "It is certain Ionia has a much longer and richer history than any living soul could claim to know. Indeed, in the more remote mountain passes, the landscape is still littered with evidence of great wars from ages past—but instead of clearing the ruins, the Ionians choose to respect what remains, even if they no longer fully understand what it represents.",
          "universe_live/3345032f09b6067031320bcb39526f3912ebbeb5-1920x1080.jpg"
        ],
        [
          "The Great Monasteries",
          "Though the birthplace of many specialized forms of martial arts, Ionia maintains no standing armies. Rather, the ways of battle are tied to differing philosophies, passed on with reverence and care. In the northeastern mountains, the monastery of Hirana has long been a sanctuary for those seeking to better understand their connection to the spirit realm.",
          "universe_live/72ad1322d9a8b12047f23f9f7d344de6735e54fc-1920x1079.jpg"
        ],
        [
          "Built Into Nature",
          "Ionian architecture is characterized by a sense of natural flow and grace, aspiring to reflect the ethereal beauty of the land. Grand, open spaces ensure that one is never fully divorced from what organically existed there before.",
          "universe_live/f07ae98b4a055e8cf297a41cfc852a4c1c9a7c71-1920x1029.jpg"
        ],
        [
          "The Placidium of Navori",
          "Situated at the heart of the continent, the Placidium is one of Ionia’s most sacred places. Many have journeyed here to study at renowned schools, or meditate in its wild, magical gardens. Undoubtedly, this was why it became such a tempting target for the invading armies of Noxus...",
          "universe_live/5b2f763df14096727e8b38405392126034ab9899-1920x888.jpg"
        ],
        [
          "The Great Stand",
          "It was at the Placidium that the people of Ionia finally took up arms against their Noxian enemies. But the cost of that day’s victory was immense, and some now question if fighting back was the right decision, since the harmonious balance of their homeland may have been lost forever.",
          "universe_live/2ac800dc33ba35196a61cddb5c6cf8ecae24b155-1189x755.jpg"
        ]
      ]
    },
    "people": [
      [
        "The Kinkou",
        "The Kinkou are the self-appointed keepers of Ionia’s sacred balance. Their acolytes walk both Runeterra and the spirit realm, mediating conflicts between them and, when necessary, intervening by force. During the war with Noxus, the Kinkou Order was ousted from its ancient temple by the followers of Zed, himself a former acolyte.",
        "universe_live/6e96758b6430e1d21bc160e829931e62f9e6dca2-2585x736.jpg"
      ],
      [
        "Fruit Merchant",
        "",
        "universe_live/5b430c051d1c5f2c02ef75d3041234f3c2ecbfb4-810x1080.jpg"
      ],
      [
        "Rich Diversity",
        "",
        "universe_live/e35c2bc44cd1f6d7ae51b8af76a5a4842ab3824a-1728x1080.jpg"
      ],
      [
        "Item Merchant",
        "",
        "universe_live/33c28eb1bd81a97572d2953ec1412fe32e9f3602-963x1080.jpg"
      ],
      [
        "Vastaya",
        "",
        "universe_live/436d62b38f970160b1cd9a67709f6855cd501b00-1920x849.jpg"
      ]
    ],
    "mapPlace": "ionia",
    "next": "bilgewater",
    "nextLine": "Next: Bilgewater",
    "video": "HGPoGtSBhu0"
  },
  shurima: {
    "name": "Shurima",
    "kicker": "Fallen desert empire",
    "universe": "https://universe.leagueoflegends.com/en_US/region/shurima/",
    "closeup": {
      "city": "universe/3f24f923ba9871dd870c0d3565075ff8140f44b8-1920x1080.jpg",
      "cfx": 0.8,
      "cfy": 0.18,
      "cityTitle": "Shurima (Riot's region splash)"
    },
    "lore": [
      "The empire of Shurima was once a thriving civilization that spanned an entire continent.",
      "Forged in a bygone age by the mighty god-warriors of the Ascended Host, it united all the disparate peoples of the south, and enforced a lasting peace between them.",
      "Few dared to rebel. Those that did, like the accursed nation of Icathia, were crushed without mercy.",
      "However, after several thousand years of growth and prosperity, the failed Ascension of Shurima’s last emperor left the capital in ruins, and tales of the empire’s former glory became little more than myth.",
      "Now, most of the nomadic inhabitants of Shurima’s deserts eke out a meager existence from the unforgiving land.",
      "Some have built small outposts to defend the few oases, while others delve into long lost catacombs in search of the untold riches that must surely lay buried there.",
      "There are also those who live as mercenaries, taking coin for their service before disappearing back into the lawless wastelands.",
      "Still, a handful dare to dream of a return to the old ways. Indeed, more recently the tribes have been stirred by whispers from the heart of the desert—that their emperor Azir has returned, to lead them into a new, wondrous age."
    ],
    "city": [
      [
        "The rebuilt sun disc over the streets of Nashramae",
        "",
        "universe/9b2ea5c23c55790bdcb49b056df4805d88a10a07-1920x887.jpg",
        2.16
      ],
      [
        "The sands recede, and Shurima is reborn.",
        "",
        "universe/c1f3e06c2deead6fbd679d53d1e9467fbd8f801d-1920x995.jpg",
        1.93
      ],
      [
        "Shurima, risen from the sands to bathe in the sun’s light once more",
        "",
        "universe/e0805e2d0b20f06b7fa6ecfc03a4adfaa7627bd1-1920x833.jpg",
        2.3
      ],
      [
        "Shurima’s people return to their ancestral home.",
        "",
        "universe/701e3cd4ffe9cc83f43abf454bdb36c8ccf41501-1920x885.jpg",
        2.17
      ],
      [
        "The ruins of Shurima, its once grand palaces and citadels cast to ruin",
        "",
        "universe/7642a20fc144843b0011d2184c99f7517d947c39-1920x995.jpg",
        1.93
      ],
      [
        "The Daughter of Setaka, Ascended Hierophant of Zuretta",
        "",
        "universe/87211a39e1f696dbeb0a8d55e0adb887f1a7033a-1920x924.jpg",
        2.08
      ],
      [
        "Marrowmark Market",
        "",
        "universe_live/c17112dadd235379fa63467b449783aa93809e49-1920x713.jpg",
        2.69
      ],
      [
        "The Valley of the Song",
        "This remote pass takes its name from the disorienting whistling that results when the wind blows hard enough through the hollow rock structures. Many unwary travelers have found themselves at the mercy of the deafened marauders who prowl the valley by night.",
        "universe/7e56b44f8e56b898c87f8194bc419e687158a16f-1800x1080.jpg",
        1.67
      ]
    ],
    "book": {
      "kind": "sand",
      "pages": [
        [
          "Skallashi",
          "Hardy beasts of burden common across Shurima, skallashi are ideally suited to the harsh desert environment. Notoriously bad-tempered, they are nevertheless treated with great reverence, their hides often painted with sacred symbols of protection, and their horns hung with totems and charms. To own one is often considered a sign of considerable prosperity.",
          "universe_live/13956f296da1731521acc645e64f0c20e4e1bbaf-1920x1080.jpg"
        ],
        [
          "The Lost",
          "",
          "universe_live/647cc84d0cd3908ec07dd6558a4aadbb62f30345-1920x1080.jpg"
        ],
        [
          "The Endless Plain",
          "",
          "universe_live/79e5283ddbfdb97380c918c980c7696b1fc67b20-1920x1080.jpg"
        ],
        [
          "Atop the Dormun",
          "Some shurimans choose to live their nomadic existence atop giant, slow-moving creatures known as dormun. Protected by large chitinous plates, dormun evolved to survive the perpetual drought and harsh conditions of Shurima. The dormun-riders clean the creature and hunt any airborne pests who venture near, while the dormun uses unknown senses to located hidden reservoirs of water.",
          "universe_live/8d420fbcfc864227ff139432de162aa9baa78590-1920x1080.jpg"
        ],
        [
          "Zoantha Cascade",
          "The shifting tides of the desert has been known to carve paths through bare rock, tumbling over the cliff faces in massive sandfalls. Traditionally, Shurimans toss beloved objects into the sands as gifts to the Ascended. As a result, such falls are often lucrative spots for treasure hunters.",
          "universe/4de1d35edf9f40e5680a40954b0dd6bb6b71d1fe-1903x1080.jpg"
        ]
      ]
    },
    "people": [
      [
        "Raiders",
        "The raiders of Shurima survive not through trade, but through violence. These bands of marauders often attempt to blend into the environment in order to lure unsuspecting travelers into traps before killing them, taking their belongings, and (in very rare cases) eating them.",
        "universe_live/c4ec79b86b334da43886bc1486ba38bdc71767f7-633x1080.jpg"
      ],
      [
        "The Shakkal",
        "These nomadic raiders are known for their agility, using hardened bone-braces and polearms to vault towards their victims at terrifying speeds.",
        "universe_live/95c370f1984b5bdab922a6220d89ec048d639f09-1458x1080.jpg"
      ],
      [
        "Dormun Riders",
        "Dormun-riders use claw grips to traverse the complex series of ropes that connect the mobile village's dwellings. Once a rider becomes too old or infirm to “run the ropes”, they are lowered to the ground to live out the rest of their days as a land-dweller.",
        "universe_live/0cedd7658dafbbdcc323066bfc358f1a478159c0-860x1080.jpg"
      ],
      [
        "Scavengers",
        "Shurima's scavengers live by looting food, valuables, and trade goods. Mostly, they venture into the ruins of abandoned, sand-wrecked cities. Scavengers are prime targets for raiders when moving on foot, so will often ride sandswimmers to avoid ambush.",
        "universe_live/0d1508785c84d614195b613071941e2ab0cf5d36-1139x1080.jpg"
      ],
      [
        "Sandswimmers",
        "These massive creatures traverse the desert in cyclical patterns, feeding on the bugs and other small creatures most desert beasts ignore. Scavengers will often memorize the predictable paths these creatures take, and jump onto their backs to ride as far as they wish.",
        "universe_live/296b0abc0c70a0731cfdf06bb8dad41181f5b87e-1920x624.jpg"
      ],
      [
        "Upper Class City Dwellers",
        "",
        "universe_live/c180d537cf339169760d08868300844874bbaff0-874x1080.jpg"
      ]
    ],
    "mapPlace": "shurima",
    "next": "void",
    "nextLine": "Next: The Void",
    "video": "JKnM6Hh5gOg"
  },
  targon: {
    "name": "Targon",
    "kicker": "Sprawling western mountains",
    "universe": "https://universe.leagueoflegends.com/en_US/region/mount-targon/",
    "closeup": {
      "city": "universe/8ad3cfba4b5d7cb812562108a6e90d07e0865b3f-1920x1041.jpg",
      "cfx": 0.6,
      "cfy": 0.25,
      "cityTitle": "Targon (Riot's region splash)"
    },
    "lore": [
      "Mount Targon is the mightiest peak in Runeterra, a towering peak of sun-baked rock amid a range of summits unmatched in scale anywhere else in the world.",
      "Located far from civilization, Mount Targon is utterly remote and all but impossible to reach save by the most determined seeker.",
      "Many legends cling to Mount Targon, and, like any place of myth, it is a beacon to dreamers, madmen and questors of adventure.",
      "Some of these brave souls attempt to scale the impossible mountain, perhaps seeking wisdom or enlightenment, perhaps chasing glory or some soul-deep yearning to witness its summit.",
      "The ascent is all but impossible, and those hardy few who somehow survive to reach the top almost never speak of what they have seen.",
      "Some return with a haunted, empty look in their eyes, others changed beyond all recognition, imbued by an Aspect of unearthly, inhuman power with a destiny few mortals can comprehend."
    ],
    "city": [
      [
        "Home of the Rakkor",
        "Targon is a sprawling, mountainous region, whose people are both resourceful and devout. For thousands of years, the migratory Rakkor tribes have chiseled markets, seasonal homes, and ceremonial chambers into the very mountains themselves.",
        "universe_live/68cbc6b051ee43da9255b97c14ad2bb60d01fe07-1920x959.jpg",
        2.0
      ],
      [
        "Around the Mountain",
        "For the Rakkor who choose to dwell closest to Mount Targon, life is an unending pilgrimage—following the sun as the seasons change, they migrate between the solstices to remain in its heavenly light all year round.",
        "universe_live/4cdb09aef562abdbd594fa098cf255d62d6f2f5d-1920x1502.jpg",
        1.28
      ],
      [
        "The Vaulted Road",
        "The oldest paths through the mountains are marked by ancient gateways of glittering metal, the largest of which have come to mark the end of each phase of the Rakkor’s migration. They celebrate the moment they cross each threshold, before continuing under the sun's bright path.",
        "universe_live/07455820a21112e0a9f5406fbb686cb5224aa0ef-1868x948.jpg",
        1.97
      ],
      [
        "Four Seasons",
        "In the low-lying valleys, the Rakkor can easily hunt and forage, grow crops, and tend their herds. During spring and summer in particular, the local flora and fauna are known to thrive even at higher altitudes.",
        "universe/8d1e6c6954be9d1caec2c913ea8e554a3532dadb-1893x955.jpg",
        1.98
      ],
      [
        "Unnatural Formations",
        "For the shepherds leading their flocks to graze on the mountain slopes, it is sometimes easy to overlook the strange patterns that seem to flow outward through the rock from Mount Targon. To the ancient Targonians, these patterns were proof that the mountain itself was forged by divine intelligences.",
        "universe/0f8e56d7bb6459067adada96581760e5160ae75d-1920x908.jpg",
        2.11
      ],
      [
        "Written in Stone",
        "Some Rakkor now believe these otherworldly shapes were once part of a great map, depicting unknown realms beyond the heavens. Others say the markings warn of terrible war that will one day ravage the entire world, setting brother against brother. Despite such wild speculation, the true origin and purpose of these patterns remains a mystery to all.",
        "universe/df7b47a1c0aee886ffc9fcf263e0b7c810f9fac8-1920x1067.jpg",
        1.8
      ],
      [
        "Eternal Winter of the Mountaintops",
        "Among the tallest peaks, bitter winds and perilous snows overcome the seasons, creating an everlasting winter. This unnatural landscape is perilous to any stray wanderers, with plants and animals becoming rare sights indeed.",
        "universe/f96baebc3f8a90be5f7c93ff777075152762565f-1048x1848.jpg",
        0.57
      ]
    ],
    "book": {
      "kind": "stars",
      "pages": [
        [
          "The Pilgrim’s Life",
          "During their migrations, the tribes of Targon try to carry as few material objects as possible. Tethered pulley systems are used to transport essential belongings up and down the steep slopes, while heavier tools and equipment are stored in shelters around the mountain, and repaired or remade as needed.",
          "universe_live/094bbdb05d066f30db1ba179238dd6681346d040-1492x1080.jpg"
        ],
        [
          "Climbing Gear",
          "Even young children of the Rakkor are trained to use hooks and picks, which are essential for survival in the mountains.",
          "universe_live/884433080c85f47489ebb9b78b8c35c5ee79b3fb-1498x1080.jpg"
        ],
        [
          "Religious Items",
          "Holding fragrant incense and the extracts of certain rare herbs and plants, these stone-carved offering bowls are used frequently in religious rites.",
          "universe_live/749deb0e098f6c86d57f4cc3345ffa73a3d4355f-1581x1080.jpg"
        ],
        [
          "Zenith Array",
          "Astronomers and astromancers across Targon meticulously track the sun, moon, and stars, hoping to reveal the will of the Aspects and hasten their coming to this world.",
          "universe_live/0956aceefcea920a1dcc20f000ea5af3a017e31e-776x1080.jpg"
        ],
        [
          "Golden Astrolabe",
          "Solari priests keep an even more watchful eye on the heavens, using astrolabes to predict future events by measuring the movement of specific celestial bodies.",
          "universe_live/93e530270cf3f9bb7d0d74169ef8e97e149ccbdf-1627x1080.jpg"
        ],
        [
          "Arms of the Ra’horak",
          "Solari weaponsmiths craft ornate gilded blades to reflect the divine light of the sun, and these are almost always carried prominently and visibly outside a holy warrior’s armor.",
          "universe_live/860bcaa90eb20ec155381a8f0c20f1065c9b747f-947x1080.jpg"
        ],
        [
          "Forbidden Weapons",
          "Conversely, Lunari weapons tend to be elegant and easily concealed, sometimes crafted from iridescent moonstone.",
          "universe_live/06b7146d8868c55df0e4b6a84edad98090e617f1-1180x888.jpg"
        ],
        [
          "Journey Up the Mountain",
          "Leaving the bonds of Runeterra far behind, some climbers say Mount Targon seems to expand and contract beneath them, as if the rock itself were alive. This has always made it impossible to map any reliable path to the summit—each climb is different, with some taking many months, and others apparently only a single day.",
          "universe/993c68c69a977d2d2d396978b519a50362a40f36-1080x1196.jpg"
        ],
        [
          "Patterns of the Dead",
          "Climbers sometimes think to start out in groups, to assist one another on the way—since when one is exhausted or hurt, there is no hope of rescue from below. The bodies of the dead do not tend to decay at such heights, but seem to gradually meld with the rock, becoming twisted into the circular patterns and ridges of the mountain.",
          "universe/e4f3c862a6a2dc179577bfa6ce2705d51e79873c-529x1043.jpg"
        ],
        [
          "Reaching the Summit",
          "In the rare event that a mortal reaches Targon’s peak, the heavens open before them in a dazzling display of cosmic aurorae. Few ever bear witness to that radiant sight, far above the cloudline and beneath the glittering stars, where it is said that timeless, godlike beings dwell in a wondrous city of gold and silver.",
          "universe/0a67b33846063c0c41e8cbe4a4c905aa224008ff-490x1080.jpg"
        ]
      ]
    },
    "people": [
      [
        "The Rakkor",
        "A name thought to mean “the Tribe of the Last Sun”, the Rakkor tribes boast many skilled artisans, craftspeople, and merchants—however, they tend to value a simple life of humility and prayer to the heavens.",
        "universe_live/0c2aa1357baa23f987e95a397cc9d87eab90698c-3000x1594.jpg"
      ],
      [
        "The Warriors",
        "The Rakkor do not seek war with others, but nonetheless maintain highly skilled militias among all the tribes and outlying settlements. It is said to be almost impossible to surprise a Rakkor force in battle on their own lands.",
        "universe_live/bca29de73df4e83a2da2e4652969ecfabc1db536-1362x1080.jpg"
      ],
      [
        "The Solari",
        "While nearly all Rakkor worship the sun, those who completely devote their lives to it are known as the Solari. As the dominant religious sect on Mount Targon, they believe the sun is the source of all life—all other light sources are false, and a threat to the future of their people. Disciples are guided in the strictures of their faith by temple priests, who preach that if the sun was ever to fade, the world would be swallowed by darkness. Accordingly, the Solari stand ready to fight any who would extinguish its holy light.",
        "universe_live/125771314c8f367251a614ebd62690282ffe3ca1-792x887.jpg"
      ],
      [
        "The Lunari",
        "Branded by the Solari as heretics, the Lunari worship the silvery light of the moon. They practice their beliefs in secret, hiding from those who seek to rid Targon of their influence forever—even though some claim that, long ago, the two groups lived in peace, worshipping the heavens as one people.",
        "universe_live/e23e4d4e84f41c1ccff32a268989863b7f6caab6-857x1080.jpg"
      ],
      [
        "Beasts of the Mountains",
        "The various species native to Targon are uniquely primed to survive under the coldest weather conditions, with thick layers of fat and wooly furs to insulate from bitter winds and snow. Cloven hooves provide support on steep slopes and narrow footholds, while hooked claws easily latch onto ice.",
        "universe_live/a8f77d985a23ee4e14c0288d378e1d81c6ddd1ba-1508x1080.jpg"
      ]
    ],
    "mapPlace": "targon",
    "next": "shurima",
    "nextLine": "Next: Shurima",
    "video": "CAAnY_L4Pp4"
  },
  bilgewater: {
    "name": "Bilgewater",
    "kicker": "Lawless port city",
    "universe": "https://universe.leagueoflegends.com/en_US/region/bilgewater/",
    "closeup": {
      "city": "universe/9700d7bf76ec15c8c526f7fea2a960e3846e44a6-2825x1080.jpg",
      "cfx": 0.5,
      "cfy": 0.62,
      "cityTitle": "Bilgewater (Riot's region splash)"
    },
    "lore": [
      "Nestled away in the Blue Flame Isles archipelago, Bilgewater is a port city like no other—home to serpent hunters, dock gangs, and smugglers from across the known world.",
      "Here, fortunes are made and ambitions shattered in the blink of an eye. For those fleeing justice, debt, or persecution, Bilgewater can be a place of new beginnings, for no one on these twisted streets cares about your past.",
      "Even so, with each new dawn, careless travelers can always be found floating in the harbor, their purses empty and their throats slit…",
      "While incredibly dangerous, Bilgewater is ripe with opportunity, free from the shackles of formal government and trade regulation.",
      "If you have the coin, almost anything can be purchased here, from outlawed hextech to the favor of local crime lords.",
      "With the recent removal of the last “reaver king” of Bilgewater, the city has entered a period of transition, while the most prominent captains try to agree on its future.",
      "But as long as there are seaworthy ships and crews to sail them, Bilgewater is likely to remain one of the most colorful and well-connected places in Runeterra."
    ],
    "city": [
      [
        "Bilgewater Bay",
        "Surrounded by treacherous straits and towering cliffs, Bilgewater Bay is as dangerous as those who call it home. Visitors are often seduced by seemingly limitless opportunity, and become permanent residents—realizing that the longer they stay, the more they can exploit others for power and wealth.",
        "universe/e11375ab64f8a8f5c3eb7698b4fc2aa02d738fc4-1920x911.jpg",
        2.11
      ],
      [
        "Butcher's Bridge",
        "Looming over the main harbor is Butcher’s Bridge, an ancient stone overpass built into the cliffs, connecting the bustling piers with the notorious slums beyond. Some still use it to access the Temple of Nagakabouros, but most now gather here to fight duels or exchange their illicit wares.",
        "universe/ff8c5296fd31d2ae93034ef8d97124b654397102-1920x734.jpg",
        2.62
      ],
      [
        "A New Beginning",
        "Lacking natural resources for construction, much of Bilgewater has been built up with whatever people can bring, find, or steal—be it repurposed masonry, or even the broken hulls of the ships they traveled in.",
        "universe/ef261f0073747a41a230b54f96aa22de45e6b40d-1920x900.jpg",
        2.13
      ],
      [
        "Life On The Water",
        "Bilgewater’s lowliest inhabitants dwell in a labyrinth of meandering canals and hidden inlets, with no separation between the homes they build and the sea where they ply their trade. Indeed, traversing perilous waters is not just an occupational hazard, but part of daily life.",
        "universe/d0956a86466d6d4cd9d00be6d1a1cb309d3cb27c-725x1080.jpg",
        0.67
      ],
      [
        "Ancient Architecture",
        "Various settlements within the greater city have been built upon the remains of a far older civilization. Long abandoned temples have been converted into homes and places of business, with scaffold walkways leading from one establishment to another.",
        "universe/c1ce8492421f985cd5a8e2d901138b9ae153cb83-1440x1080.jpg",
        1.33
      ],
      [
        "The Slaughter Docks",
        "Sea monster attacks are a constant threat around Bilgewater, but over the years myriad lucrative industries have grown out of hunting and harvesting the massive creatures. Vessels haul them back to port, to be rendered down into meat, oils, hides, armored scales—even bones and teeth—for sale at the thriving dockside markets.",
        "universe/c418d716abe97ea8f4414e1af4bf40b20a7ad713-1920x608.jpg",
        3.16
      ],
      [
        "The Serpent Isles",
        "While much of Valoran knows the archipelago as the Blue Flame Isles, to the indigenous people of Buhru they have only ever been the Serpent Isles. Buhru’s ancient culture is highly respected, reflected, and sometimes imitated in the daily life of Bilgewater—including traditional medicine, and monster hunting techniques.",
        "universe/f35253b900a44562d6439bdb44e8bc5a21179bef-1920x859.jpg",
        2.24
      ],
      [
        "Nagakabouros",
        "Central to Buhru culture is Nagakabouros—god of life, growth, and perpetual motion. Also known as the Mother Serpent, the Great Kraken, or the Bearded Lady, she is commonly depicted as an enormous, monstrous head with many spiraling tentacles.",
        "universe/6d76f6a956c0577e69a4d03c4ca16f0adcba51d9-1004x1080.jpg",
        0.93
      ]
    ],
    "book": {
      "kind": "chart",
      "pages": [
        [
          "Bounty Board",
          "The closest you can get to laws and government in Bilgewater is the bounty board. Written on it are the names of the most wanted criminals of Bilgewater, ranked by how much would be paid for their heads. It is said that the reaver king Gangplank regularly added a silver serpent to his own bounty, as an open challenge to the entire city.",
          "universe_live/0a8cc724cf95046756c66836f72346a63fd7251a-1214x1080.jpg"
        ],
        [
          "A Watery Grave",
          "In Bilgewater, the dead are not buried - they are given back to the ocean. The port's graveyards consist of innumerable floating buoys, below which are sunk the corpses of the dead. The wealthy are interred within expensive submerged caskets below lavish bobbing tombstones, while the poor are often tied en masse to old anchors beneath waterlogged barrels.",
          "universe_live/4a98fb02faf04e4d39fdc141d85aeee4f980cc00-829x1080.jpg"
        ],
        [
          "Serpent Callers",
          "Bilgewater’s shores are protected by the horns that when blown disorient the waves through the waters to disguise Bilgewater’s location from the sea monsters.",
          "universe_live/f5bc9695b1b9d2760336ab5ea072b9026d965f49-1521x1080.jpg"
        ],
        [
          "Monsters of the Deep",
          "It is unknown whether the sea monsters around Bilgewater inspired the beliefs in the Mother Serpent, or vice versa, nonetheless leviathans have become a staple in Bilgewater’s varied cultures.",
          "universe_live/f520ff56db873e5f6388587b941693b1edcb9ee9-1338x1080.jpg"
        ],
        [
          "Tools Of The Trade",
          "The most skilled monster hunters know the old ways are often the best. Following the traditions of the Serpent Isles, these cunning traps and vicious hooks are each crafted for luring and slaying specific creatures, and such implements will be passed down from generation to generation.",
          "universe_live/0efad95f314b93f500f8f8baf95a1637098ea016-1920x1368.jpg"
        ],
        [
          "Miss Fortune's Blunderbuss",
          "",
          "universe_live/5d87927a7e9438897612158ae94bc89149a51417-1920x1026.jpg"
        ]
      ]
    },
    "people": [
      [
        "Captains and Crew",
        "Bilgewater is home to serpent-hunters, dock gangs, and smugglers from across the known world. For those fleeing justice, debt, or persecution, Bilgewater can be a place of new beginnings, for no one on these twisted streets cares about your past.",
        "universe_live/106e20093011d65115c2b0a6b279093c0e4ebdf4-2513x1359.jpg"
      ],
      [
        "Harpooners",
        "One of the most important roles on a hunting crew is the harpooner, who hooks and slays the beasts, and entire crews will be built around a veteran who can teach others a thing or two along the way. Many harpooners are marksmen, or particularly fearless freedivers... but few survive long enough for their reputation to become widely known",
        "universe_live/483b34d20ed89af51aa77ecbff7a7bf26f44977a-1920x1009.jpg"
      ],
      [
        "The Boatman",
        "A fixture of every floating graveyard, these grim sailors ferry the dead out to their final resting place.",
        "universe_live/2d4d8667c948f119060c0aef6c3dab09bcb209da-1343x1080.jpg"
      ],
      [
        "Harpoon Mistress",
        "",
        "universe_live/61869f5a1dd2f778611d5beea387aa4e06607666-631x1080.jpg"
      ]
    ],
    "mapPlace": "bilgewater",
    "next": "shadowisles",
    "nextLine": "Next: Shadow Isles",
    "video": "lbJhZW-iN0s"
  },
  shadowisles: {
    "name": "Shadow Isles",
    "kicker": "Lands shrouded by the Black Mist",
    "universe": "https://universe.leagueoflegends.com/en_US/region/shadow-isles/",
    "closeup": {
      "city": "universe/94e4bf2e1b30ba553b4fc0f93e94983837082210-2503x1080.jpg",
      "cfx": 0.42,
      "cfy": 0.25,
      "cityTitle": "Shadow Isles (Riot's region splash)"
    },
    "lore": [
      "This cursed land was once home to a noble, enlightened civilization, known to its allies and emissaries as the Blessed Isles.",
      "However, more than a thousand years ago, an unprecedented magical cataclysm left the barrier between the material and spirit realms in tatters, effectively merging the two… and dooming all living things in an instant.",
      "Now, a malevolent Black Mist permanently shrouds the Isles, and the earth itself is tainted by dark sorcery.",
      "Mortals who dare to venture to these dismal shores will slowly have their life force stolen away from them, which in turn attracts the insatiable, restless spirits of the dead.",
      "Those who perish within the Mist are condemned to haunt this nightmarish place for eternity—worse still, the power of the Shadow Isles appears to wax stronger with every passing year, allowing the most powerful specters to roam farther and farther across Runeterra."
    ],
    "city": [
      [
        "The Radiance of Alignments begins the journey to enlightenment",
        "",
        "universe_live/5a9794156d8ad1ae33055107d87eed59adda19cc-810x1080.jpg",
        0.75
      ],
      [
        "The Athenaeum of Light, wherein the litanies of the Sentinels are graven on wall and floor",
        "",
        "universe_live/e3d816def9dae4ac7aa07bd58b19239ff2aca812-1920x1080.jpg",
        1.78
      ],
      [
        "The Celestial Vault, unlocked by the revelations of the Lunatropic Demisphere",
        "",
        "universe_live/c4e1b85a5427c40d3619daaf003a43f33ec5fc38-1918x1080.jpg",
        1.78
      ],
      [
        "The sundered Vaults of Arcana, a confluence of dark magic",
        "",
        "universe/ab3c2d4effe32c931570596363361436d64a2b19-1920x726.jpg",
        2.64
      ],
      [
        "The Hall of Conjunction, through which all seekers must pass",
        "",
        "universe_live/1fdeb58842d9fd21a721dd3e17572ed8ccb8bebb-810x1080.jpg",
        0.75
      ],
      [
        "The crater that was once a grand gallery of ancient artifacts at the heart of the Shadow Isles",
        "",
        "universe/ac8f27055808f5c375af1312c5584cae88124db0-1920x814.jpg",
        2.36
      ],
      [
        "The Library",
        "",
        "universe_live/856fb7a2df80df93e82e45cbdf55de0acf5ce079-556x1057.jpg",
        0.53
      ],
      [
        "Flooded Cities",
        "Helia, the capital of the Blessed Isles, was located on the coast. As a result, many parts of the city were flooded after the Ruination.",
        "universe/a16b2a6f1de9d71d750ed8b14ebfcc8f07c8b6a4-1920x721.jpg",
        2.66
      ]
    ],
    "book": {
      "kind": "mist",
      "pages": [
        [
          "Eternal Scrivener",
          "Many of the humble scribes and archivists of the Blessed Isles perished at their lecterns, unaware of the disaster that had just befallen them. This lost soul now feverishly scratches descriptions of its torment on an endlessly unraveling parchment.",
          "universe_live/d65a839490400da28ae448bde17c607f7b2fcc1c-810x1058.jpg"
        ],
        [
          "Strong Willed",
          "The most powerful specters retained much of their personality and desires even after the Ruination, becoming predatory spirits who may stalk the weak and vulnerable for all eternity.",
          "universe_live/1ea9971724b9e783e3daaf0cef79f950c1f5060d-1097x1080.jpg"
        ],
        [
          "Widow of Forgotten Songs",
          "The Widow of Forgotten Songs was a collector of birds who tried to free them when disaster struck. She now wanders aimlessly, listening for the songs she can no longer recall.",
          "universe_live/1ca546dceeaaa8235afe6a6c3e061c818629382f-819x1080.jpg"
        ],
        [
          "Soul Shepherd",
          "The Soul Shepherd seeks to keep weaker spirits safe from predatory specters.",
          "universe_live/91488631cd36573ee44bf09aa5c3009ad76eb719-899x1080.jpg"
        ],
        [
          "Like Attracts Like",
          "Any mortal who sets foot upon the Shadow Isles will attract the spirits of the fallen.",
          "universe_live/f0d6298ad585b0e92cf20403bf0e636f8085912c-904x1080.jpg"
        ],
        [
          "Beyond the Isles",
          "While weaker spirits may only be able to manifest during a Harrowing, more powerful entities can always do so, sometimes even venturing beyond the Shadow Isles.",
          "universe_live/36187cfc2a4eb99e58c016a080479ead3de7a533-1874x1080.jpg"
        ]
      ]
    },
    "people": [
      [
        "The Blessed Isles",
        "",
        "universe_live/5d4e7caecc32fa879ccb404b6964ef4c282fb0cc-1920x1080.jpg"
      ],
      [
        "Fertile Lands",
        "",
        "universe_live/a2dab6d1182615bbb21be6919357f2b6b8dc5875-1920x960.jpg"
      ],
      [
        "Hidden from Outsiders",
        "",
        "universe_live/ad116c0774047f2ead38cf0c87598076ca5b1780-1923x1080.jpg"
      ],
      [
        "Citizens of the Blessed Isles",
        "",
        "universe_live/c0f8e112090d753f0b5f79f426f66baaa27bee2a-1920x970.jpg"
      ]
    ],
    "mapPlace": "shadow-isles",
    "next": "piltover",
    "nextLine": "Next: Piltover",
    "video": "3yxNUbYZEWU",
    "peopleLabel": "The Blessed Isles",
    "peopleTitle": "The Blessed Isles"
  },
  bandle: {
    "name": "Bandle City",
    "kicker": "Mythical land of curious enchantment",
    "universe": "https://universe.leagueoflegends.com/en_US/region/bandle-city/",
    "closeup": {
      "city": "universe/f1e3c6d09e5dfa75a7c3a786e87757a04499d76a-800x491.jpg",
      "zoom": 1.5,
      "cfx": 0.5,
      "cfy": 0.45,
      "cityTitle": "The Bandle Tree"
    },
    "lore": [
      "Opinions differ as to where exactly the home of the yordles is to be found, though a handful of mortals claim to have traveled unseen pathways to a land of curious enchantment beyond the material realm.",
      "They tell of a place of unfettered magic, where the foolhardy can be led astray by myriad wonders, and end up lost in a dream...",
      "In Bandle City, it is said that every sensation is heightened for non-yordles. Colors are brighter. Food and drink intoxicates the senses for years and, once tasted, will never be forgotten.",
      "The sunlight is eternally golden, the waters crystal clear, and every harvest brings a fruitful bounty.",
      "Perhaps some of these claims are true, or maybe none—for no two taletellers ever seem to agree on what they actually saw.",
      "Only one thing is known for certain, and that is the timeless quality of Bandle City and its inhabitants.",
      "This might explain why those mortals who find their way back often appear to have aged tremendously, while many more never return at all."
    ],
    "city": [
      [
        "The Bandle Tree",
        "Long before the yordles called Bandle City home, there was only a tree. No one knows why, or when, but it grew to fill the space behind reality, unfurling its branches into the Spirit Realm until it had no clear beginning or end—it simply was, and had always been.",
        "universe/f1e3c6d09e5dfa75a7c3a786e87757a04499d76a-800x491.jpg",
        1.63
      ],
      [
        "Stronger Than Life or Death",
        "Fascinated by the relationships they observe among the mortals of Runeterra, the gregarious yordles tend to form deep and lasting connections with one another—and for the folk of Bandle City, there is no greater bond than the family you choose for yourself.",
        "universe/e55d81ae5882b42c3ddc4adcfd24987a1c0114a3-1398x948.jpg",
        1.47
      ],
      [
        "Deep in the Bandlewood",
        "While there are portals whose positions can shift over time, there are many that stay rooted in a single location. The magic of the spirit realm occasionally ebbs back and forth around such places—known as bandlewoods—and affects the local flora and fauna in strange, unpredictable ways.",
        "universe_live/d2eeafb247f20d2feb845dc2ff59b23b59a9446a-1852x1080.jpg",
        1.71
      ]
    ],
    "book": {
      "kind": "popup",
      "pages": [
        [
          "Not Always As They Seem...",
          "In less enlightened parts of the world, a yordle’s appearance could seem frightening or unnatural to mortals. Fortunately, they are adept at blending in, and often protected by a kind of supernatural glamour—subconsciously fading from the viewer’s notice, or being masked as a less remarkable individual.",
          "universe_live/53eb9068ef739a303808ca6f7f551e37b6189da1-623x397.jpg"
        ],
        [
          "Heimerdinger’s Visual Transmogrification",
          "Yordles do not necessarily control their glamour, and may understand it in a variety of ways. The revered inventor Heimerdinger, for example, crafted unique technological devices for himself and Ziggs, to help them blend into Piltovan society.",
          "universe_live/0e724fc32b6361334555a2039f78ab978948c563-1209x837.jpg"
        ],
        [
          "Otherworldly Gateways",
          "Runeterra is linked to an enchanted place in the spirit realm known as Bandle City. The pathways are rarely seen by mortals, for they only open under particular circumstances, or for those with the ability to read and interpret the language of the yordles.",
          "universe_live/8c26e19b80dea4aa39e1e69e9127ce1969bf1d1b-1920x1200.jpg"
        ],
        [
          "Geometry of Transit",
          "Certain pathways can only be opened with a series of specific gestures, often defined by peculiar symbols inscribed nearby. This particular portal opens to a deep cavern, when the low tide reveals a pattern of runic circles, filling the indentations with sea water.",
          "universe_live/8a384b61ff3f9e0af45c0e97f93bfa7b4e68e7cf-1920x583.jpg"
        ]
      ]
    },
    "people": [],
    "mapPlace": "bandle-city",
    "next": "ionia",
    "nextLine": "Next: Ionia",
    "video": "zKXcLjJCLF0"
  },
  ixtal: {
    "name": "Ixtal",
    "kicker": "Perilous Eastern Jungles",
    "universe": "https://universe.leagueoflegends.com/en_US/region/ixtal/",
    "closeup": {
      "city": "universe/1a75d072fa01ec3d0cda3f87fc1bf18dce736424-5000x2811.jpg",
      "cfx": 0.55,
      "cfy": 0.45,
      "cityTitle": "Ixtal (Riot's region splash)"
    },
    "lore": [
      "Renowned for its mastery of elemental magic, Ixtal was one of the first independent nations to join the Shuriman empire.",
      "In truth, Ixtali culture is much older—part of the great westward diaspora that gave rise to civilizations including the Buhru, magnificent Helia, and the ascetics of Targon—and it is likely they played a significant role in the creation of the first Ascended.",
      "But the mages of Ixtal survived the Void, and later the Darkin, by distancing themselves from their neighbors, drawing the wilderness around them like a shield.",
      "While much had already been lost, they were committed to the preservation of what little remained…",
      "Now, secluded deep in the jungle for thousands of years, the sophisticated arcology-city of Ixaocan remains mostly free of outside influence.",
      "Having witnessed from afar the ruination of the Blessed Isles and the Rune Wars that followed, the Ixtali view all the other factions of Runeterra as upstarts and pretenders, and use their powerful magic to keep any intruders at bay."
    ],
    "city": [
      [
        "An Unexplored Frontier",
        "Very little is known of Ixtal’s history by those outside its borders. Indeed, over the years, countless expeditions—from Noxus, Bilgewater, and more recently the Piltover Explorers Guild—have delved into the jungle in search of arcane treasures or new territorial claims... only to vanish without a trace.",
        "universe_live/bb05a80c4083ed777d3da87a9e1d2ff1bd00833f-1600x900.jpg",
        1.78
      ],
      [
        "Ixaocan",
        "In truth, Ixtal is not the uninhabited wilderness many imagine. Far from prying eyes and greedy hands, the sprawling arcologies of Ixaocan remain safely hidden by the deepest rainforests. The cardinal arcology, seat of the ruling Yun Tal caste, has stood since before the ancient Shurimans raised their first Sun Disc.",
        "universe_live/6b7e184e6b82d586d607f6a63261ae610811defa-3840x2160.jpg",
        1.78
      ],
      [
        "Mastery Over the Material Realm",
        "The arcologies are connected by intersecting lines of power, and each represents a specific form or discipline of elemental magic. The largest are home to tens of thousands of Ixtali practitioners, with a social hierarchy based on the length of time spent in study, furthering their progression toward ultimate mastery.",
        "universe_live/a6dd4e10efce4060663ebde2e9ec18c76b8df21a-3840x2310.jpg",
        1.66
      ],
      [
        "Esoteric Knowledge",
        "The further one travels from the cardinal arcology, the more specialized and prestigious the masteries become. High in the mountains, the mages of this relatively small arcology combine their understandings of fire, rock, and magnetism to draw precious metals from the earth, crafting them into exquisite shapes with the merest gesture.",
        "universe_live/7b11239cf024358011444e7d70bb2badbb6b33e2-6000x3155.jpg",
        1.9
      ],
      [
        "The Elemental Drakes",
        "Curiously, the abandoned ruins scattered throughout Ixtal are home to a surprising number of dragons. These terrifying creatures have not fought alongside mortals since the last days of Shurima’s war against the Void—now, for the most part, they seem content just to be left alone.",
        "universe_live/80253aa1b93f81efeb092a0f6618a62ae14cb912-6000x3365.jpg",
        1.78
      ]
    ],
    "book": {
      "kind": "jungle",
      "pages": [
        [
          "The Axiomata",
          "To the people of Ixtal, the world is merely a vast confluence of material forces, which they alone are capable of mastering. Each and every permutation of elemental magic—from the most simple to the most complex—is governed by a numbered Axiom, held almost sacred by the arcology that teaches it.",
          "universe_live/941c0fcc77f3798faa6c852b91190b2b99a636a6-1900x1147.jpg"
        ],
        [
          "The Vidalion",
          "Within the cardinal arcology of Ixaocan is a grand chamber, deliberately positioned at the very center of Ixtal... and indeed the whole of Runeterra, as far as the Ixtali are concerned. Above this chamber hangs the Vidalion, an ancient artifact that can weave magic into material form.",
          "universe_live/d478dc1ab6bb424645305b416cb565a7663dc028-1920x1194.jpg"
        ],
        [
          "Clothed in Power",
          "Upon acceptance into the ruling Yun Tal caste, an initiate will have their own magic woven around them by the Vidalion, creating shimmering garments that respond to the needs of the wearer. This confirms the status of a true elemental master, who will lead and teach others in turn.",
          "universe_live/3a62261ed08f4cf03c3f6f7e7530d072024de78c-1900x1040.jpg"
        ]
      ]
    },
    "people": [
      [
        "Ruling Caste",
        "For countless generations, Ixtal’s secrets have been preserved by their most gifted and wise elementalists. There are no formal criteria for admission to the Yun Tal, though aspirants can expect to be tested to the very limit of their abilities, and any approval must be unanimous among those present.",
        "universe_live/0d552ab661f4b4aac1b01dcf40329ad4e82448ad-3000x1200.jpg"
      ],
      [
        "The Prefectures",
        "The most trusted Yun Tal may be designated as the prefects of outlying villages and settlements beyond Ixaocan, such as Ohmka, Xolen, or Paretha. Their duties include the resolution of local disputes, testing potential aspirants, and generally ensuring that the Ixtali people have as little interaction with outsiders as possible...",
        "universe_live/999f76bb27a44a0e57283bfc3f246f01f99f9552-2400x1016.jpg"
      ],
      [
        "A Privileged Upbringing",
        "The current occupants of the high seat of the Yun Tal were blessed with ten daughters—respectfully referred to by many as “the Yunalai”. Having the benefit of generations of inherited mastery, it is little surprise that all of them were ready to face the Vidalion at prodigiously young ages.",
        "universe_live/c250958652398a9bc63a891042ce2c9e8591ca32-1900x1014.jpg"
      ]
    ],
    "mapPlace": "ixtal",
    "next": "bandle",
    "nextLine": "Next: Bandle City"
  },
  void: {
    "name": "The Void",
    "kicker": "The unknowable nothingness",
    "universe": "https://universe.leagueoflegends.com/en_US/region/void/",
    "closeup": {
      "city": "universe/7107e5dbca7887931748e7ae0924e6eda17ef6f4-1920x1064.jpg",
      "cfx": 0.5,
      "cfy": 0.5,
      "cityTitle": "The Void (Riot's region splash)"
    },
    "lore": [
      "Screaming into existence with the birth of the universe, the Void is a manifestation of the unknowable nothingness that lies beyond.",
      "It is a force of insatiable hunger, waiting through the eons until its masters, the mysterious Watchers, mark the final time of undoing.",
      "To be a mortal touched by this power is to suffer an agonizing glimpse of eternal unreality, enough to shatter even the strongest mind.",
      "Denizens of the Void realm itself are construct-creatures, often of only limited sentience, but tasked with a singular purpose—to usher in total oblivion across Runeterra."
    ],
    "city": [],
    "book": {
      "kind": "glitch",
      "pages": [
        [
          "An Unknowable power",
          "In the abyssal darkness, deep underground, it is believed that the first great Void creatures to walk the surface of Runeterra now lie, dormant and unseen. If that is true, then they have waited patiently through the millennia, and it must surely now be time for them to rise once more.",
          "universe/7107e5dbca7887931748e7ae0924e6eda17ef6f4-1920x1064.jpg"
        ],
        [
          "The Fall of Icathia",
          "A great and terrible battle was fought against the Void before the walls of ancient Icathia. In the aftermath, the lands all around the damned city became deserted wastes, and its very existence was struck from the maps of Shurima. It was hoped, perhaps foolishly, that the horrors unleashed there would eventually be forgotten...",
          "universe/cff392be16fbc5d58802be94d37be8d40dcca3ef-1920x866.jpg"
        ],
        [
          "The Rupture",
          "On the outskirts of Icathia lies the Rupture—evidence of the Void itself bursting forth from deep beneath the ground, in an age now lost to history. Though the bold and the curious alike have often sought to learn more, only the most foolhardy explorer would ever dare venture into the dark spaces beneath.",
          "universe_live/0201dc831ca0c28855514831cbe1cc5f825f20f8-1920x839.jpg"
        ],
        [
          "Salt the earth",
          "One of the few known ways to combat the Void is to starve it. With no organic or magical sustenance nearby, the Void’s material growth will slow, until it eventually falls into a dormant state.",
          "universe_live/752045abbbe86c4f3cbdf76300a3cd680b97dfbe-1920x1019.jpg"
        ],
        [
          "The Voidborn",
          "Though it has bred many of them, no two horrors of the Void are exactly the same. Their otherworldly forms are as varied as they are terrifying—yet all are driven by an insatiable hunger, with the eerie pulsing of their hearts driving them relentlessly onward.",
          "universe_live/279dabdfd5ce59faaec4ab2b89a2717145ea2b30-1920x1053.jpg"
        ],
        [
          "Armored in darkness",
          "Some legends suggest that, when they first emerge into the Runeterran air, the Voidborn are generally pale, fibrous and flexible. As they age, sections of their form harden into a darker, shell-like chitin, which can become strong enough to turn aside almost any weapon.",
          "universe_live/8ec09a29f4be18a50a7593cd1fc47d2198bb33ca-1920x2012.jpg"
        ],
        [
          "The touch of the Void",
          "Over the centuries, many mortals from the world above have answered the Void’s call, or been dragged down against their will. There are those among them—few and far between—who have survived the encounter... though not a single one of them returned unchanged.",
          "universe_live/a44368fba7e954b300db46b11f37a1c5d4617ccd-1920x955.jpg"
        ]
      ]
    },
    "people": [],
    "mapPlace": "the-void",
    "next": "ixtal",
    "nextLine": "Next: Ixtal",
    "video": "OcB-FreSnG8"
  }
};
