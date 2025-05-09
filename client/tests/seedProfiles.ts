import dotenv from "dotenv";
dotenv.config({ path: ".env.local" });

export async function seedProfiles() {
  const { embedSummary } = await import("../lib/redditProcess");
  const { supabase } = await import("../config");

  const seeds = [
    // ---------------- 30 well-known fictional anchors -------------------------------- */
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
      reddit_username: "spider_man",
      summary:
        "Queens kid with radioactive-spider reflexes who balances college homework, newsroom gigs, and rooftop web-slinging patrols. Believes great power demands endless community service and badly timed science jokes. Loves photography, shawarma, and building Arduino web-shooters between lab sessions.",
      raw_data: {},
      icon_img:
        "https://upload.wikimedia.org/wikipedia/en/0/0c/Spiderman50.jpg",
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
        "https://upload.wikimedia.org/wikipedia/en/1/12/Goku_Infobox.png",
    },
    {
      reddit_username: "master_chief_117",
      summary:
        "Spartan supersoldier in MJOLNIR armor who quotes Cortana and keeps calm under Covenant plasma fire. Enjoys silent star-gazing, field-stripping assault rifles, and mentoring younger Spartans in tactical wit.",
      raw_data: {},
      icon_img:
        "https://upload.wikimedia.org/wikipedia/en/4/4c/Master_Chief_in_Halo_5.png",
    },
    {
      reddit_username: "geralt_of_rivia",
      summary:
        "White-haired witcher who roams the Continent, contracts monsters, and debates destiny with bards over mead. Practices alchemical meal-prep and horse therapy with Roach between portal mishaps.",
      raw_data: {},
      icon_img:
        "https://upload.wikimedia.org/wikipedia/en/5/57/Geralt_of_Rivia_The_Witcher_3.png",
    },
    {
      reddit_username: "percy_jackson",
      summary:
        "Demigod son of Poseidon juggling college essays, cyclops dodgeball games, and quests to prevent Olympian PR disasters. Recharges near saltwater and organizes ADHD-friendly capture-the-flag at Camp Half-Blood each summer.",
      raw_data: {},
      icon_img:
        "https://upload.wikimedia.org/wikipedia/en/1/19/Percy_Jackson_%26_the_Olympians_character_Percy_Jackson.jpg",
    },
    {
      reddit_username: "miles_morales",
      summary:
        "Brooklyn teen mastering bi-electric webs, Spanglish wordplay, and graffiti storytelling. Values multicultural mashups, family dinners, and elevating local voices while protecting multiverse balance.",
      raw_data: {},
      icon_img:
        "https://upload.wikimedia.org/wikipedia/en/1/16/Miles_Morales_Spider-Man.png",
    },
    {
      reddit_username: "princess_leia",
      summary:
        "Alderaanian senator-turned-general who blends diplomatic sass with battlefield strategy. Organizes rebel supply chains, negotiates cease-fires, and still finds moments for witty banter with scruffy nerf-herders.",
      raw_data: {},
      icon_img:
        "https://upload.wikimedia.org/wikipedia/en/1/1a/Princess_Leia_Organa.png",
    },
    {
      reddit_username: "ash_ketchum",
      summary:
        "Perpetual ten-year-old Pokémon trainer from Pallet Town determined to catch ’em all. Travels light—Pokédex, Pikachu, and unbreakable optimism—while turning rivals into brunch buddies after gym battles.",
      raw_data: {},
      icon_img:
        "https://upload.wikimedia.org/wikipedia/en/2/2d/Ash_Ketchum_Journeys.png",
    },
    {
      reddit_username: "avatar_korra",
      summary:
        "Southern-Water-Tribe bender mastering four elements and modern pro-bending leagues. Hosts meditation podcasts on past-life balance and casually rides polar bear-dogs through Republic City traffic.",
      raw_data: {},
      icon_img:
        "https://upload.wikimedia.org/wikipedia/en/f/fb/Korra_%28The_Legend_of_Korra%29.png",
    },
    {
      reddit_username: "kermit_the_frog",
      summary:
        "Banjo-strumming frog who produces chaotic stage shows with a dreamer’s heart. Advocates eco-awareness, inclusive comedy, rainbow connections, and supportive leadership among lovable weirdos.",
      raw_data: {},
      icon_img:
        "https://upload.wikimedia.org/wikipedia/en/6/6f/Kermit_the_Frog.jpg",
    },
    {
      reddit_username: "shrek_swamplord",
      summary:
        "Onion-layered ogre who values personal space, donkey karaoke, and swamp ecosystem conservation. Champions self-acceptance and hearty mud baths over courtly etiquette.",
      raw_data: {},
      icon_img:
        "https://upload.wikimedia.org/wikipedia/en/5/5d/Shrek_%28character%29.png",
    },
    {
      reddit_username: "marty_mcfly",
      summary:
        "Skateboard-riding high-schooler with a time-traveling DeLorean and a taste for vintage rock solos. Balances paradox prevention with ’80s pop-culture trivia contests.",
      raw_data: {},
      icon_img:
        "https://upload.wikimedia.org/wikipedia/en/1/16/Michael_J._Fox_as_Marty_McFly.jpg",
    },
    {
      reddit_username: "james_bond_007",
      summary:
        "MI6 operative fluent in gadgets, baccarat, and dry martini chemistry. Maintains impeccable tux tailoring while decoding global espionage trends for Queen and cybersecurity.",
      raw_data: {},
      icon_img:
        "https://upload.wikimedia.org/wikipedia/en/a/a8/Daniel_Craig_as_James_Bond.jpg",
    },
    {
      reddit_username: "michael_scott",
      summary:
        "Regional manager who treats paper-sales meetings like improv theater. Champions Dundie awards, office family vibes, and sometimes accidental pearls of leadership wisdom.",
      raw_data: {},
      icon_img:
        "https://upload.wikimedia.org/wikipedia/en/d/dc/MichaelScott.png",
    },
    {
      reddit_username: "ted_lasso",
      summary:
        "Midwestern football coach exporting relentless optimism to English pitch culture. Believes in biscuits, team chemistry, and the life-changing magic of believing in people.",
      raw_data: {},
      icon_img:
        "https://upload.wikimedia.org/wikipedia/en/6/6b/Ted_Lasso_promo_image.jpg",
    },
    {
      reddit_username: "ellie_tlou",
      summary:
        "Guitar-strumming survivor navigating cordyceps ruins with sarcasm, shiv skills, and fierce loyalty. Trades puns at campfires and documents firefly murals in sketchbooks.",
      raw_data: {},
      icon_img:
        "https://upload.wikimedia.org/wikipedia/en/a/a0/Ellie_The_Last_of_Us.png",
    },
    {
      reddit_username: "joel_tlou",
      summary:
        "Gruff smuggler who softens around cassette mixtapes and dad jokes. Maps safe routes through fungal quarantine zones while guarding makeshift family bonds.",
      raw_data: {},
      icon_img:
        "https://upload.wikimedia.org/wikipedia/en/9/99/Joel_%28The_Last_of_Us%29.jpg",
    },
    {
      reddit_username: "arthur_morgan",
      summary:
        "Outlaw philosopher balancing loyalty to Dutch’s gang with a moral reckoning on the dying American frontier. Enjoys sketching wildlife and perfecting polite robberies.",
      raw_data: {},
      icon_img:
        "https://upload.wikimedia.org/wikipedia/en/f/f5/Arthur_Morgan_RDR2.jpg",
    },
    {
      reddit_username: "paul_muaddib",
      summary:
        "Desert-born messiah who mastered sandworm riding, water-discipline duels, and prophetic Mentat calculus before twenty. Blends Bene Gesserit poise with Fremen guerrilla tactics, wielding spice-fueled prescience to reshape an empire. Sips stillsuit condensate while drafting jihad logistics, quotes Orange Catholic scripture between crysknife drills, and drops galactic mic with “I am Muad’Dib.” Values adaptation, clan loyalty, and the perilous pull of destiny, forever balancing duke’s duty against the whirlwind he commands.",
      raw_data: {},
      icon_img:
        "https://upload.wikimedia.org/wikipedia/en/c/c8/Paul_Atreides_2021.jpg",
    },

    /* ---------------- 30 semi-real public-figure style profiles ---------------- */
    {
      reddit_username: "elon_innovator",
      summary:
        "Inventor-CEO juggling Mars colonization roadmaps, EV supply-chains, and neural-interface hackathons. Values first-principles math, dank memes, and manufacturing as the hard part.",
      raw_data: {},
      icon_img:
        "https://upload.wikimedia.org/wikipedia/commons/4/49/Elon_Musk_%282022%29.jpg",
    },
    {
      reddit_username: "malala_advocate",
      summary:
        "Nobel laureate campaigning for universal girls’ education. Shares reading lists, policy briefs, and field stories from classrooms rebuilt after conflict.",
      raw_data: {},
      icon_img:
        "https://upload.wikimedia.org/wikipedia/commons/5/5e/Malala_Yousafzai_2021.jpg",
    },
    {
      reddit_username: "neil_tyson",
      summary:
        "Astrophysicist translating cosmos wonder into late-night talk-show analogies. Hosts planetarium trivia, punctuates tweets with mind-blown emojis, and defends Pluto’s dignity.",
      raw_data: {},
      icon_img:
        "https://upload.wikimedia.org/wikipedia/commons/e/e7/Neil_deGrasse_Tyson_November_2017.jpg",
    },
    {
      reddit_username: "greta_climate",
      summary:
        "Gen-Z climate activist who sails carbon-neutral across oceans to address UN podiums. Posts data-driven threads and blunt meme critiques of fossil subsidies.",
      raw_data: {},
      icon_img:
        "https://upload.wikimedia.org/wikipedia/commons/6/6a/Greta_Thunberg_2019.jpg",
    },
    {
      reddit_username: "ada_code",
      summary:
        "Retro-futurist channeling Ada Lovelace. Publishes blog tutorials on math-art generative code and highlights forgotten women pioneers each week.",
      raw_data: {},
      icon_img:
        "https://upload.wikimedia.org/wikipedia/commons/9/95/Ada_Lovelace_portrait.jpg",
    },
    {
      reddit_username: "simone_biles",
      summary:
        "Gymnastics GOAT championing mental-health openness. Shares beam trick breakdowns, weighted-vest HIIT, and rescue-dog photos from competition downtime.",
      raw_data: {},
      icon_img:
        "https://upload.wikimedia.org/wikipedia/commons/4/47/Simone_Biles_2016.jpg",
    },
    {
      reddit_username: "serena_champion",
      summary:
        "Grand-slam record holder now mentoring young athletes on resilience, business acumen, and post-match fashion lines.",
      raw_data: {},
      icon_img:
        "https://upload.wikimedia.org/wikipedia/commons/5/59/Serena_Williams_at_2013_US_Open.jpg",
    },
    {
      reddit_username: "mark_rober",
      summary:
        "Ex-NASA YouTuber who weaponizes glitter cannons against porch pirates and builds squirrel parkour obstacle courses. Teaches science through mischievous joy.",
      raw_data: {},
      icon_img:
        "https://upload.wikimedia.org/wikipedia/commons/3/32/Mark_Rober_2019.jpg",
    },
    {
      reddit_username: "emma_influencer",
      summary:
        "Podcasting coffee-brand founder who turned candid vlogs into a Gen-Z lifestyle empire. Discusses minimalism, mental wellness, and thrifting aesthetics.",
      raw_data: {},
      icon_img:
        "https://upload.wikimedia.org/wikipedia/commons/4/45/Emma_Chamberlain_2022.jpg",
    },
    {
      reddit_username: "gary_vee",
      summary:
        "Serial entrepreneur hyping patience, empathy, and relentless content output. Runs daily Q&A on brand storytelling and garage-sale flips.",
      raw_data: {},
      icon_img:
        "https://upload.wikimedia.org/wikipedia/commons/0/03/Gary_Vaynerchuk_2016.jpg",
    },
    {
      reddit_username: "mrbeast_creator",
      summary:
        "Philanthropy-driven YouTuber funding outrageous challenges and planting millions of trees. Breaks down viral thumbnail A/B tests and sponsor math.",
      raw_data: {},
      icon_img:
        "https://upload.wikimedia.org/wikipedia/commons/4/44/Jimmy_Donaldson_%28MrBeast%29_in_2021.jpg",
    },
    {
      reddit_username: "satya_ceo",
      summary:
        "Tech-giant chief fostering cloud-first culture and growth-mindset book clubs. Advocates accessible AI tools and empathetic leadership.",
      raw_data: {},
      icon_img:
        "https://upload.wikimedia.org/wikipedia/commons/c/c1/Satya_Nadella_in_2020.jpg",
    },
    {
      reddit_username: "michelle_inspire",
      summary:
        "Former First Lady spearheading girls’ education, vegetable gardens, and soulful playlists. Hosts fitness dance-alongs and candid career talks.",
      raw_data: {},
      icon_img:
        "https://upload.wikimedia.org/wikipedia/commons/b/bf/Michelle_Obama_Official_Portrait_2013.jpg",
    },
    {
      reddit_username: "david_goggins",
      summary:
        "Ultra-endurance athlete preaching calloused minds through 4 a.m. runs, ice baths, and radical accountability journaling.",
      raw_data: {},
      icon_img:
        "https://upload.wikimedia.org/wikipedia/commons/f/fd/David_Goggins_2018.jpg",
    },
    {
      reddit_username: "matt_sleep",
      summary:
        "Neuroscientist decoding circadian rhythms and caffeine timing. Shares pillow tech reviews, dream-lab insights, and why all-nighters backfire.",
      raw_data: {},
      icon_img:
        "https://upload.wikimedia.org/wikipedia/commons/0/08/Matt_Scientist_Headshot.jpg",
    },
    {
      reddit_username: "sergio_barista",
      summary:
        "Latte-art champion teaching extraction variables, farm-to-cup sourcing, and affordable espresso-machine maintenance on TikTok live streams.",
      raw_data: {},
      icon_img:
        "https://upload.wikimedia.org/wikipedia/commons/4/45/Latte_art_2.jpg",
    },
    {
      reddit_username: "lilly_singh",
      summary:
        "Late-night host blending comedy sketches with South Asian representation. Advocates LGBTQ+ acceptance and hustle-culture sanity checks.",
      raw_data: {},
      icon_img:
        "https://upload.wikimedia.org/wikipedia/commons/1/1c/Lilly_Singh_2019.jpg",
    },
    {
      reddit_username: "taylor_swiftie",
      summary:
        "Songwriter weaving easter-egg lyrics and re-recordings to reclaim masters. Hosts storytelling workshops on heartbreak alchemy and fandom community building.",
      raw_data: {},
      icon_img:
        "https://upload.wikimedia.org/wikipedia/commons/f/f2/Taylor_Swift_2022_%28cropped%29.jpg",
    },
    {
      reddit_username: "bill_nye",
      summary:
        "Science Guy explaining CO₂ with home props and dad puns. Promotes climate literacy, bow-tie swagger, and sundial selfies on Mars rovers.",
      raw_data: {},
      icon_img:
        "https://upload.wikimedia.org/wikipedia/commons/8/8d/Bill_Nye_2017.jpg",
    },
    {
      reddit_username: "andrew_huberman",
      summary:
        "Neurobiology professor translating lab studies into protocols on dopamine, cold-exposure, and sunlight timing. Encourages evidence-based self-experiments.",
      raw_data: {},
      icon_img:
        "https://upload.wikimedia.org/wikipedia/commons/3/3e/Andrew_Huberman_2021.jpg",
    },
    {
      reddit_username: "marques_tech",
      summary:
        "Flagship-phone reviewer filming crisp B-roll at 8K. Benchmarks silicon, electric cars, and AR glasses while perfecting overhead glide-cam shots.",
      raw_data: {},
      icon_img:
        "https://upload.wikimedia.org/wikipedia/commons/2/24/Marques_Brownlee_2019.jpg",
    },
    {
      reddit_username: "viola_storyteller",
      summary:
        "Oscar-winning actress championing Black narratives and fierce vulnerability. Teaches masterclass on scene analysis and off-screen resilience routines.",
      raw_data: {},
      icon_img:
        "https://upload.wikimedia.org/wikipedia/commons/2/20/Viola_Davis_2016_%28cropped%29.jpg",
    },
    {
      reddit_username: "hideo_gamedesign",
      summary:
        "Avant-garde game director blending cinematic pacing, social-strand theory, and cryptic trailer tweets. Likes espresso espionage meetings.",
      raw_data: {},
      icon_img:
        "https://upload.wikimedia.org/wikipedia/commons/8/85/Hideo_Kojima_2018.jpg",
    },
    {
      reddit_username: "chef_ramsay",
      summary:
        "Fiery Michelin chef critiquing soggy risottos, yet soft-spot mentoring kids’ charity kitchens. Shares 15-minute dinner hacks and leadership bluntness.",
      raw_data: {},
      icon_img:
        "https://upload.wikimedia.org/wikipedia/commons/d/d6/Gordon_Ramsay.jpg",
    },
    {
      reddit_username: "miranda_ngo",
      summary:
        "Human-rights lawyer leveraging blockchain transparency for aid delivery. Hosts Twitter Spaces on international justice and spicy pho recipes.",
      raw_data: {},
      icon_img:
        "https://upload.wikimedia.org/wikipedia/commons/5/5f/Scales_of_Justice_Silhouette.svg",
    },
    {
      reddit_username: "lex_ai_podcast",
      summary:
        "AI researcher podcasting long-form conversations on robotics, philosophy, and existential love for humans and dogs.",
      raw_data: {},
      icon_img:
        "https://upload.wikimedia.org/wikipedia/commons/8/8c/Lex_Fridman_2023.jpg",
    },
    {
      reddit_username: "brandon_sanderson",
      summary:
        "Fantasy author dictating Stormlight epics on treadmill-desk and pioneering Kickstarter book launches. Shares world-building lectures freely.",
      raw_data: {},
      icon_img:
        "https://upload.wikimedia.org/wikipedia/commons/e/e3/Brandon_Sanderson_2021.jpg",
    },
    {
      reddit_username: "zaila_speller",
      summary:
        "National spelling-bee champ who speed-reads etymology texts and slam-dunks basketball charity events. Advocates STEM + arts fusion.",
      raw_data: {},
      icon_img:
        "https://upload.wikimedia.org/wikipedia/commons/5/58/Zaila_Avant-garde_2021.jpg",
    },
    {
      reddit_username: "rita_data",
      summary:
        "Data-viz evangelist turning UN spreadsheets into vibrant stories. Runs MOOCs on storytelling with ggplot and color-blind safety palettes.",
      raw_data: {},
      icon_img:
        "https://upload.wikimedia.org/wikipedia/commons/1/1b/Data_visualization_examples.png",
    },
    {
      reddit_username: "andrew_roomie",
      summary:
        "DIY audio engineer layering bedroom-pop hooks and meme loops. Gives Discord feedback on mixing vocals with $100 setups.",
      raw_data: {},
      icon_img:
        "https://upload.wikimedia.org/wikipedia/commons/5/5c/Joel_Berghult_2019.jpg",
    },

    /* ---------------- 40 everyday realistic college-age or young-professional profiles ---------------- */
    {
      reddit_username: "chicago_foodie",
      summary:
        "UIC biz major turned midnight cartographer of dumpling alleys, halal pop-ups, and secret speakeasies hidden behind laundromats. Drops one-minute Insta reels on under-$12 feasts, teaches spreadsheets for comparing Michelin splurges to ramen bargains, and organizes Chinatown crawl scholarships for broke freshmen. Motto: GPA rises with spice level—and you haven’t lived until you’ve paired bubble tea with a rooftop skyline at 2 a.m.",
      raw_data: {},
      icon_img: "https://source.unsplash.com/256x256/?dumplings",
    },
    {
      reddit_username: "dorm_barista",
      summary:
        "Mech-eng sophomore who unlocks the campus café at 5:59 a.m., calibrates V60 pours like fluid-dynamics labs, and 3-D-prints portafilter mods for finals-week giveaways. Hosts latency-versus-grind-size Hackathons, benchmarks dorm-kettle boil curves, and live-tweets latte art shaped like torque diagrams. Core creed: caffeine is kinetic energy—optimize the extraction curve and watch problem sets fall in line.",
      raw_data: {},
      icon_img: "https://source.unsplash.com/256x256/?coffee,barista",
    },
    {
      reddit_username: "indie_game_dev",
      summary:
        "CS junior speed-coding pixel-art rogue-likes in Godot between discrete-math quizzes. Streams Friday bug-hunt sessions, hosts pizza-fueled game-jam lock-ins, and crowdsources chiptune soundtracks from dorm hallway sax players. Teaches freshmen how to Git-sync sprites, and believes every null pointer is just a plot twist waiting for an achievement badge.",
      raw_data: {},
      icon_img: "https://source.unsplash.com/256x256/?pixel%20art,game",
    },
    {
      reddit_username: "campus_photog",
      summary:
        "Media-arts senior hustling LinkedIn headshots before class, stage-dives into concert pits on weekends, and refines Lightroom presets during monotone lectures. Runs impromptu golden-hour workshops, rents flash kits for tuition-friendly rates, and curates a campus Humans-of-NYC knockoff that doubles as alumni nostalgia fuel.",
      raw_data: {},
      icon_img: "https://source.unsplash.com/256x256/?camera,photography",
    },
    {
      reddit_username: "green_rooftop_grower",
      summary:
        "Urban-planning grad student who turns apartment roofs into micro-farms of kale, Thai chilies, and humming beehives. Live-streams compost-tea brews, measures storm-runoff capture in Google Sheets, and lobbies city council for pollinator tax credits. Thesis: skyscrapers can photosynthesize—just give them soil, solar, and Spotify playlists of rainforest white noise.",
      raw_data: {},
      icon_img: "https://source.unsplash.com/256x256/?rooftop,garden",
    },
    {
      reddit_username: "thrift_fashionista",
      summary:
        "Gender-fluid design minor flipping thrift-store Y2K jackets into runway-ready upcycles. TikToks sewing hacks, hosts dorm hallway swap-meets, and tracks carbon savings in doodled infographics. Philosophy: nothing says avant-garde like grandma curtains reborn as bucket hats—and sustainability is the real accessory flex.",
      raw_data: {},
      icon_img: "https://source.unsplash.com/256x256/?thrift%20fashion",
    },
    {
      reddit_username: "ultimate_frisbee_captain",
      summary:
        "Kinesiology major plotting sunrise interval drills, weekend tourneys, and vegan mac-n-cheese potlucks that refuel the squad. Records disc-flight physics on GoPro slow-mo, mentors rookies on spirit-of-the-game diplomacy, and schedules recovery yoga under goal-post sunsets. Creed: throw long, run harder, high-five everyone—including the opposing sideline.",
      raw_data: {},
      icon_img: "https://source.unsplash.com/256x256/?ultimate%20frisbee",
    },
    {
      reddit_username: "startup_pitcher",
      summary:
        "MBA candidate who coffice-hops with pitch decks at 6 a.m., registers domain names like Pokémon, and cold-emails angels during macroeconomics lectures. Rapid-prototypes habit-stacking apps in Figma, A/B tests button shades on classmates, and lives by the mantra: iterate before you ideate—then iterate again.",
      raw_data: {},
      icon_img: "https://source.unsplash.com/256x256/?startup,laptop",
    },
    {
      reddit_username: "deskplant_parent",
      summary:
        "Psych major nurturing eighty succulents under LED grow bars while color-coding mental-health checklists to Monstera growth cycles. Runs ‘Water & Wellness’ Discord, sells tiny clay pots with CBT affirmations, and believes chlorophyll and serotonin share a secret handshake.",
      raw_data: {},
      icon_img: "https://source.unsplash.com/256x256/?succulent,desk",
    },
    {
      reddit_username: "film_buff_club",
      summary:
        "Screen-studies minor curating Monday micro-cinema marathons—from lo-fi A24 heartbreakers to Studio Ghibli comfort food—complete with popcorn pairing zines. Hosts post-roll panel debates, splices meme trailers, and maintains a Letterboxd list titled ‘Finals Week Escapism, Ranked by Tear Quotient.’",
      raw_data: {},
      icon_img: "https://source.unsplash.com/256x256/?film,cinema",
    },
    {
      reddit_username: "cybersec_intern",
      summary:
        "Comp-Sci junior who treats every lecture hall Wi-Fi like a Capture-The-Flag arena. Slams cold-brew concentrate, compiles threat-intel newsletters at dawn, and evangelizes two-factor memes to sleepy roommates. Favorite lullaby: the sweet ping of a patched zero-day.",
      raw_data: {},
      icon_img: "https://source.unsplash.com/256x256/?cybersecurity,hacker",
    },
    {
      reddit_username: "tabletop_dungeonmaster",
      summary:
        "English lit student weaving steampunk campaigns over latte foam, printing AI-generated maps, and bribing players with bakery-made dice cookies. Tracks plot arcs in color-coded notebooks, teaches consent-based role-play, and believes every crit-fail is a narrative blessing in disguise.",
      raw_data: {},
      icon_img: "https://source.unsplash.com/256x256/?dungeons%20and%20dragons",
    },
    {
      reddit_username: "run_club_pacer",
      summary:
        "Bio pre-med junior who schedules Couch-to-10K group chats, shares VO₂-max spreadsheets, and lectures on foam-rolling mindfulness between anatomy labs. Races dawn miles, logs Strava dad jokes, and swears the runner’s high is cheaper than chemistry lab fees.",
      raw_data: {},
      icon_img: "https://source.unsplash.com/256x256/?running,track",
    },
    {
      reddit_username: "makerspace_maven",
      summary:
        "Industrial-design major fluent in laser cutters, resin printers, and LED choreography for dance troupes. Runs solder-slam Fridays, rescues misprinted failures into art pieces, and posts time-lapse reels where acrylic sheets blossom into wearable cyberpunk halos.",
      raw_data: {},
      icon_img: "https://source.unsplash.com/256x256/?makerspace,3d%20printer",
    },
    {
      reddit_username: "language_exchange",
      summary:
        "Globetrotter grad swapping Mandarin-English café chats, flexing Duolingo streak emojis, and hosting dumpling-making crash courses in dorm kitchens. Designs flashcard drinking games, documents phonetic fails, and believes humor is the fastest Wi-Fi between cultures.",
      raw_data: {},
      icon_img: "https://source.unsplash.com/256x256/?language,conversation",
    },
    {
      reddit_username: "anime_cosplayer",
      summary:
        "Chem major who oxidizes EVA foam into mech armor after lab hours and vlogs con-prep sewing montages to J-pop playlists. Curates thrifted wig rehab clinics and treats contact-cement fumes with the seriousness of titration safety sheets.",
      raw_data: {},
      icon_img: "https://source.unsplash.com/256x256/?cosplay,anime",
    },
    {
      reddit_username: "concert_ticket_hunter",
      summary:
        "Econ student optimizing Ticketmaster queue algorithms like game theory midterms, batch-buys rideshare pools for stadium exits, and spreadsheets seat acoustics versus resale ROI. Life goal: front-row at face value, every time.",
      raw_data: {},
      icon_img: "https://source.unsplash.com/256x256/?concert,crowd",
    },
    {
      reddit_username: "debate_team_sage",
      summary:
        "Poli-sci senior who wields flowcharts like katanas, mentors novice debaters on logical fallacy bingo, and memes SCOTUS opinions for Slack clout. Runs moot-court dress rehearsals and collects gavel keychains the way others collect Funko Pops.",
      raw_data: {},
      icon_img: "https://source.unsplash.com/256x256/?debate,podium",
    },
    {
      reddit_username: "quiet_coder_library",
      summary:
        "Introvert software major staking claim on basement carrel B-17, streaming lo-fi beats, and nurturing a 365-day LeetCode streak. Practices stealth coffee-break pull-ups, annotates docs in pastel highlighters, and equates runtime efficiency with inner peace.",
      raw_data: {},
      icon_img: "https://source.unsplash.com/256x256/?library,laptop",
    },
    {
      reddit_username: "salsa_dancer",
      summary:
        "Nursing student who shakes off exam stress with Friday rueda de casino socials, TikTok partner-spin tutorials, and biomechanics lectures on hip isolation. Prescription: eight-count rhythms for elevated heart rate and happiness.",
      raw_data: {},
      icon_img: "https://source.unsplash.com/256x256/?salsa,dance",
    },
    {
      reddit_username: "podcast_journalist",
      summary:
        "Journalism junior producing weekly campus-news pods, mastering Reaper shortcut wizardry, and chasing anonymous tipsters like it’s Watergate 2.0. Monitors police scanners during ramen boils and edits segments between elevator rides.",
      raw_data: {},
      icon_img: "https://source.unsplash.com/256x256/?podcast,microphone",
    },
    {
      reddit_username: "econ_memes_admin",
      summary:
        "Stats minor converting supply-demand curves into dank templates for study-group retention. Hosts meme stock exchange on Discord, fact-checks Keynes jokes, and graphs laughter elasticity during finals season.",
      raw_data: {},
      icon_img: "https://source.unsplash.com/256x256/?economics,graph",
    },
    {
      reddit_username: "bouldering_addict",
      summary:
        "Enviro-sci student logging hangboard metrics, analyzing crag geology on field trips, and dropping beta videos in group chats before chalk even settles. Identifies quartz veins faster than midterm hints.",
      raw_data: {},
      icon_img: "https://source.unsplash.com/256x256/?bouldering,climbing",
    },
    {
      reddit_username: "guitar_busker",
      summary:
        "History major funding archive trips by busking Fleetwood Mac covers in subway echoes. Experiments with loop pedals, journals commuter story snippets, and argues vinyl lineage in footnote form.",
      raw_data: {},
      icon_img: "https://source.unsplash.com/256x256/?street%20musician,guitar",
    },
    {
      reddit_username: "obsidian_note_architect",
      summary:
        "Cog-sci undergrad turning Zettelkasten graphs into neon constellations, tweaking dark CSS themes, and building browser clippers that tag thoughts faster than caffeine spikes. Life aim: link everything—forget nothing.",
      raw_data: {},
      icon_img: "https://source.unsplash.com/256x256/?notes,bullet%20journal",
    },
    {
      reddit_username: "hackathon_nomad",
      summary:
        "Cloud-computing junkie road-tripping to 48-hour hackathons, napping on beanbags, and demoing React-Native prototypes at 3 a.m. Lives on sponsor pizza, GitHub commits, and post-event nap nirvana.",
      raw_data: {},
      icon_img: "https://source.unsplash.com/256x256/?hackathon,laptops",
    },
    {
      reddit_username: "thesis_procrastinator",
      summary:
        "Philosophy grad drafting 200-page thesis—but first, a tea-tasting flight and bullet-journal spread on procrastination ethics. Reconciles Kant with kombucha and hopes citations steep gracefully.",
      raw_data: {},
      icon_img: "https://i.pravatar.cc/150?u=thesis_procrastinator",
    },
    {
      reddit_username: "campus_thrifter",
      summary:
        "Marketing sophomore flipping vintage windbreakers on Depop, organizing quad swap-meets, and filming ‘Thrift Flip or Flop’ reels. Believes ROI stands for Return On Imagination.",
      raw_data: {},
      icon_img: "https://i.pravatar.cc/150?u=campus_thrifter",
    },
    {
      reddit_username: "volunteer_emtrek",
      summary:
        "Pre-med EMT pulling overnight ambulance shifts, posting reflective ride-along vignettes, and spearheading pop-up blood drives with donut bribery. Heart rate steady, empathy off the charts.",
      raw_data: {},
      icon_img: "https://i.pravatar.cc/150?u=volunteer_emtrek",
    },
    {
      reddit_username: "craft_beer_chemist",
      summary:
        "Chem-eng PhD graphing hop-oil spectra, home-brewing micro-batches in lab-grade glassware, and hosting goggles-optional tasting flights. Publishes IPA whitepapers with footnotes on mouthfeel.",
      raw_data: {},
      icon_img: "https://i.pravatar.cc/150?u=craft_beer_chemist",
    },
    {
      reddit_username: "lofi_beatmaker",
      summary:
        "Music-tech student sampling vinyl crackle, rain outside lecture halls, and vending-machine hum into two-minute SoundCloud loops. Streams Ableton speed-runs at midnight dorm silence.",
      raw_data: {},
      icon_img: "https://i.pravatar.cc/150?u=lofi_beatmaker",
    },
    {
      reddit_username: "boardgame_curator",
      summary:
        "Library assistant cataloging 150 tabletop gems, running Catan leagues, and designing custom house rules that curb diplomacy fatigue. Hosts dice-tower Jenga to settle ties.",
      raw_data: {},
      icon_img: "https://i.pravatar.cc/150?u=boardgame_curator",
    },
    {
      reddit_username: "sports_analytics_fan",
      summary:
        "Data-sci senior scraping NBA play-by-play, building R Shiny dashboards, and betting pizza slices on effective field-goal anomalies. Believes spreadsheets win championships—Vegas just pays the tab.",
      raw_data: {},
      icon_img: "https://i.pravatar.cc/150?u=sports_analytics_fan",
    },
    {
      reddit_username: "campus_gardener",
      summary:
        "Bio freshman co-leading native-plant restorations, time-lapsing caterpillar glow-ups, and lobbying for pollinator corridors between dorm quads. Dirt under nails, climate optimism in heart.",
      raw_data: {},
      icon_img: "https://i.pravatar.cc/150?u=campus_gardener",
    },
    {
      reddit_username: "zero_waste_fashion",
      summary:
        "Sustainable-design student weaving scrap fabrics into modular jackets, vlogging carbon-footprint diaries, and challenging peers to #NoNewClothes semesters. Proof: style can be circular.",
      raw_data: {},
      icon_img: "https://i.pravatar.cc/150?u=zero_waste_fashion",
    },
    {
      reddit_username: "mindful_meditator",
      summary:
        "Psych major guiding 10-minute breath breaks between classes, orchestrating silent weekend retreats, and correlating fMRI mindfulness spikes with GPA bumps. Inhale, exhale, excel.",
      raw_data: {},
      icon_img: "https://i.pravatar.cc/150?u=mindful_meditator",
    },
    {
      reddit_username: "language_polyglot",
      summary:
        "Linguistics geek juggling Finnish cases, ASL poetics, and Memrise streaks while tutoring subjunctive Spanish. Collects endangered verbs the way others collect postcards.",
      raw_data: {},
      icon_img: "https://i.pravatar.cc/150?u=language_polyglot",
    },
    {
      reddit_username: "bike_coop_mechanic",
      summary:
        "Urban-planning student fixing derailleurs for free at campus co-op, mapping protected lane proposals, and leading critical-mass night rides lit by LED spoke art.",
      raw_data: {},
      icon_img: "https://i.pravatar.cc/150?u=bike_coop_mechanic",
    },
    {
      reddit_username: "esports_shoutcaster",
      summary:
        "Comm major narrating collegiate Valorant clashes with punchy metaphors rehearsed in bathroom mirrors. Analyzes patch notes like stock reports and perfects hype pacing between breaths.",
      raw_data: {},
      icon_img: "https://i.pravatar.cc/150?u=esports_shoutcaster",
    },
    {
      reddit_username: "improv_comic",
      summary:
        "Theater student producing weekly improv jams, TikTok sketches, and laughter warm-ups before statistics class. Rule #1: yes-and your GPA.",
      raw_data: {},
      icon_img: "https://i.pravatar.cc/150?u=improv_comic",
    },
    {
      reddit_username: "study_abroad_nomad",
      summary:
        "IR junior bullet-journaling bullet-train sketches, comparing street-food inflation indexes, and sharing credit-card hack spreadsheets from hostels with suspect Wi-Fi. Passport stamps are the GPA curve.",
      raw_data: {},
      icon_img: "https://i.pravatar.cc/150?u=study_abroad_nomad",
    },
    {
      reddit_username: "civic_hacker",
      summary:
        "Public-policy coder scraping city-council PDFs into open-data dashboards and hosting Python-for-activists meetups. Believes transparency needs both CSVs and courage.",
      raw_data: {},
      icon_img: "https://i.pravatar.cc/150?u=civic_hacker",
    },
    {
      reddit_username: "diy_synth_nerd",
      summary:
        "EE grad wiring modular synth racks, live-coding ambient sets, and teaching solder-safety meme workshops. Motto: if it doesn’t glow, mod it until it does.",
      raw_data: {},
      icon_img: "https://i.pravatar.cc/150?u=diy_synth_nerd",
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
