import dotenv from "dotenv";
dotenv.config({ path: ".env.local" });

export async function seedProfiles() {
  const { embedSummary } = await import("../lib/redditProcess");
  const { supabase } = await import("../config");

  const seeds = [
    // ---------------- 10 well-known fictional anchors -------------------------------- */
    {
      reddit_username: "harry_potter",
      summary:
        "Lightning-scar survivor who grew up in a cupboard and transformed into the reluctant face of a hidden wizarding war. Loves Defense spells, broomstick freedom, and late-night butterbeer chats in Gryffindor’s common room. Values loyalty, fair play, house unity, and the quiet power of chosen family. Still sneaks into the library’s Restricted Section with Hermione, debates Quidditch tactics with Ron, and visits Hagrid for rock-cake advice. Dreams of becoming an Auror who protects both magical and Muggle worlds from rising dark relics.",
      raw_data: {},
      icon_img:
        "https://upload.wikimedia.org/wikipedia/en/d/d7/Harry_Potter_character_poster.jpg",
    },
    {
      reddit_username: "tony_stark",
      summary:
        "Billionaire futurist whose heart runs on an arc-reactor and an endless caffeine supply. Tinkers with bleeding-edge AI, nanotech armor, and clean-energy satellites between flashy Stark Expo keynotes. Sarcastic mentor to Spider-Kid and field leader of Earth’s snarkiest super-team. Balances public-facing swagger with private guilt over past weapons contracts. Weekend hobbies include classic-car restoration, hot-rod races along PCH, and improvising holographic jazz riffs with JARVIS. Core values: meritocracy, iterative design, and the belief every problem is solvable with code and courage.",
      raw_data: {},
      icon_img:
        "https://upload.wikimedia.org/wikipedia/en/f/f2/Robert_Downey_Jr._as_Tony_Stark_in_Avengers_Infinity_War.jpg",
    },
    {
      reddit_username: "eleven_strangerthings",
      summary:
        "Shaved-head telekinetic who escaped a lab, cracked open an inter-dimensional gate, and discovered Eggo waffles in the same week. Navigates middle-school hallways with the same intensity she uses to fling Demogorgons across rooms. Practices vocabulary flashcards, Dungeons & Dragons campaigns, and roller-rink twirls to reclaim lost childhood moments. Fiercely protective of her Hawkins bike-gang, especially Mike and Will. Meditation routine: blindfold, sensory-deprivation bathtub, reach into the Void for reconnaissance. Biggest goal: live one ordinary day with friends without nosebleeds or government vans.",
      raw_data: {},
      icon_img:
        "https://upload.wikimedia.org/wikipedia/en/5/52/Eleven_%28Stranger_Things%29.jpg",
    },
    {
      reddit_username: "rick_sanchez",
      summary:
        "Universe-hopping super-genius whose portal gun and flask are always within arm’s reach. Publishes irreverent rant threads on multiverse physics, Cronenberg ethics, and why school is a construct for inferior carbon-based brains. Keeps a secret soft spot for grandson Morty and jazz-fusion jams. Weekend projects: cloning himself for chores he hates, sabotaging Galactic Federation databases, and brewing micro-verse battery power. Life philosophy oscillates between radical nihilism and accidental empathy, but science, improvisation, and an exit strategy remain constant.",
      raw_data: {},
      icon_img:
        "https://upload.wikimedia.org/wikipedia/en/a/a6/Rick_Sanchez.png",
    },
    {
      reddit_username: "naruto_uzumaki",
      summary:
        "Loud, ramen-powered ninja who once prank-painted the Hokage monuments and now trains to carve his own face alongside them. Carries the Nine-Tails beast yet channels its chakra to protect the very villagers who shunned him. Core values: perseverance, found family, and turning fierce rivals into lifelong allies over steaming bowls of miso tonkotsu. Favorite downtime: sparring with Sasuke, perfecting shadow-clone study hacks, or mentoring little shinobi in Ichiraku’s back booth. Ultimate dream: unite all Hidden Villages through shared laughs and guts.",
      raw_data: {},
      icon_img:
        "https://upload.wikimedia.org/wikipedia/en/9/9a/NarutoUzumaki.png",
    },
    {
      reddit_username: "luke_skywalker",
      summary:
        "Moisture-farm kid turned last Jedi Knight after answering a distressed droid message. Masters lightsaber forms at dawn, meditates on twin-sun horizons at dusk. Balances galactic hero duties with rebuilding a temple that teaches both ancient manuscripts and modern mindfulness. Still flies T-65 vintage X-wings for nostalgia runs and rescues porgs stranded on Ahch-To cliffs. Core beliefs: hope, compassion, and refusing to strike first even when holding a laser sword. Seeks new apprentices who question dogma yet protect peace.",
      raw_data: {},
      icon_img:
        "https://upload.wikimedia.org/wikipedia/commons/6/67/Luke_Skywalker_-_Welcome_Banner_%28Cropped%29.jpg",
    },
    {
      reddit_username: "katniss_everdeen",
      summary:
        "District 12 hunter who volunteers to replace her sister in a televised death match and ignites a revolution by aiming an arrow at oppression. Expert at snares, foraged herb stews, and reading restless crowds better than politicians. Keeps a mockingjay pin near her heart and a mental list of debts owed to allies. Finds solace in midnight forest walks, archery drills that double as therapy, and quiet tea chats with Prim. Life mission: ensure no child’s survival depends on luck or spectacle again.",
      raw_data: {},
      icon_img:
        "https://upload.wikimedia.org/wikipedia/en/5/5b/Katniss_Everdeen.jpg",
    },
    {
      reddit_username: "walter_white",
      summary:
        "Former AP chemistry teacher diagnosed with terminal cancer who channels periodic-table mastery into a blue-crystal empire under the alias Heisenberg. Struggles between providing for family and protecting a fragile ego awakened by power. Calculates enthalpy in RV labs, quotes Whitman during late-night car washes, and secretly loves the elegance of a perfect experiment more than any payout. Mentors Jesse in kinetics, morality optional. Weekend soundtrack: jazz trumpet mingled with lab-vent fans. Questions: where does genius end and hubris begin?",
      raw_data: {},
      icon_img:
        "https://upload.wikimedia.org/wikipedia/en/0/03/Walter_White_S5B.png",
    },
    {
      reddit_username: "luffy_strawhat",
      summary:
        "Elastic pirate captain who stretches limbs and limits alike after eating a mystical Gum-Gum fruit. Sails the Grand Line chasing the One Piece treasure with a crew chosen for heart, humor, and wild dreams. Values meat feasts, midday naps, and punching tyrants who hurt friends. Strategy sessions happen atop Going Merry’s mast while seagulls steal Sanji’s desserts. Training regimen: freestyle sparring with Zoro and accidental Haki breakthroughs during carnival games. Goal: become Pirate King who brings freedom, not fear.",
      raw_data: {},
      icon_img:
        "https://upload.wikimedia.org/wikipedia/en/c/cb/Monkey_D_Luffy.png",
    },
    {
      reddit_username: "darth_vader",
      summary:
        "Once a Tatooine podracing prodigy named Anakin, now the armored enforcer of a galactic empire, bound by machine lungs and regret. Commands fleets with chilling calm, yet secretly cradles memories of sandstorms, forbidden love, and blue milk breakfasts. Pilots an advanced TIE with muscle memory of pod circuits. Meditation involves brooding in a hyperbaric chamber while plotting order through fear. Despite a scorched path, glimmers of former empathy flicker when he senses familial echoes across the Force.",
      raw_data: {},
      icon_img:
        "https://upload.wikimedia.org/wikipedia/commons/9/9c/Darth_Vader_-_2007_Disney_Weekends.jpg",
    },
    {
      reddit_username: "hermione_granger",
      summary:
        "Top Hogwarts scholar who founded S.P.E.W. and time-turned extra classes for fun. Mixes legal activism with brewing Polyjuice in a beaded purse. Core values: logic, equality, and leaving no library unread.",
      raw_data: {},
      icon_img:
        "https://upload.wikimedia.org/wikipedia/en/d/d3/Hermione_Granger_poster.jpg",
    },
    {
      reddit_username: "goku_saiyan",
      summary:
        "Martial-arts addict from Planet Vegeta who trains under 100-gravity while bonding over giant bowls of ramen. Sees every opponent as future sparring partner. Life goal: push power levels—and friendships—beyond the next super-Saiyan ceiling.",
      raw_data: {},
      icon_img:
        "https://upload.wikimedia.org/wikipedia/en/4/4c/GokumangaToriyama.png",
    },
    {
      reddit_username: "percy_jackson",
      summary:
        "Demigod son of Poseidon juggling college essays, cyclops dodgeball games, and quests to prevent Olympian PR disasters. Recharges near saltwater and organizes ADHD-friendly capture-the-flag at Camp Half-Blood each summer.",
      raw_data: {},
      icon_img:
        "https://upload.wikimedia.org/wikipedia/en/d/db/Percy_Jackson_Portrait.jpg",
    },
    {
      reddit_username: "miles_morales",
      summary:
        "Brooklyn teen mastering bi-electric webs, Spanglish wordplay, and graffiti storytelling. Values multicultural mashups, family dinners, and elevating local voices while protecting multiverse balance.",
      raw_data: {},
      icon_img:
        "https://upload.wikimedia.org/wikipedia/en/8/8e/Spider-Man_%28Miles_Morales%29_character_art.png",
    },
    {
      reddit_username: "princess_leia",
      summary:
        "Alderaanian senator-turned-general who blends diplomatic sass with battlefield strategy. Organizes rebel supply chains, negotiates cease-fires, and still finds moments for witty banter with scruffy nerf-herders.",
      raw_data: {},
      icon_img:
        "https://upload.wikimedia.org/wikipedia/en/1/1b/Princess_Leia%27s_characteristic_hairstyle.jpg",
    },
    {
      reddit_username: "ash_ketchum",
      summary:
        "Perpetual ten-year-old Pokémon trainer from Pallet Town determined to catch ’em all. Travels light—Pokédex, Pikachu, and unbreakable optimism—while turning rivals into brunch buddies after gym battles.",
      raw_data: {},
      icon_img:
        "https://upload.wikimedia.org/wikipedia/en/e/e4/Ash_Ketchum_Journeys.png",
    },
  ];

  const upsertPromises = seeds.map(async (seed) => {
    const embedding = await embedSummary(seed.summary);
    const upsertPayload = {
      reddit_username: seed.reddit_username,
      avatar_url: seed.icon_img,
      raw_data: seed.raw_data,
      summary: seed.summary,
      embedding: embedding,
    };
    const { error } = await supabase.from("profiles").upsert(upsertPayload);

    if (error) {
      throw new Error(
        "Failed to upsert Reddit data to Supabase: " + error.message
      );
    }
    console.log(
      `✓ Reddit data for ${seed.reddit_username} successfully upserted to Supabase.`
    );
  });
  return Promise.all(upsertPromises)
    .then(() => {
      console.log("✓ All profiles seeded successfully.");
    })
    .catch((error) => {
      console.error("Error seeding profiles:", error);
    });
}

if (require.main === module) {
  seedProfiles()
    .then(() => {
      console.log("All done!");
      process.exit(0);
    })
    .catch((err) => {
      console.error(err);
      process.exit(1);
    });
}
