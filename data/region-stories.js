// Cinematic region stories (atlas.html, story.js). One entry per region; regions without an entry show no story.
// Every text line below is Riot's own words, copied 2026-10-27 from the Universe faction page JSON
// (universe-meeps.leagueoflegends.com/v1/en_us/factions/<id>/index.json: faction.overview.short + image-gallery captions),
// read in the browser pane. Images are hotlinked from Riot's CDN (cmsassets.rgpub.io …?w=N&fm=webp) and Data Dragon.
// Champion bonds come from data/bonds.js, places from data/runeterra-map.js — not repeated here.
window.ATLAS_RSTORY = {
  piltover: {
    name: "Piltover",
    kicker: "The City of Progress",
    universe: "https://universe.leagueoflegends.com/en_US/region/piltover/",
    cms: "https://cmsassets.rgpub.io/sanity/images/dsfx7636/",
    // 1. close-up: champion face → pull back → the city (fx/fy = focal point as fractions of the image)
    closeup: {
      champ: "jayce", splash: "https://ddragon.leagueoflegends.com/cdn/img/champion/splash/Jayce_0.jpg", fx: .775, fy: .31,
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
    // 6. champions: Riot's "associated champions" for the faction, in Riot's order
    champs: ["caitlyn", "camille", "ezreal", "heimerdinger", "jayce", "orianna", "seraphine", "vi"],
    // 7. official film (videos.js entry; Riot features it on the faction page)
    video: "qCVLRh1y96M",
    // 8. map + the way out
    mapPlace: "piltover-town", next: "zaun", nextLine: "Below the cliffs, Zaun"
  }
};
