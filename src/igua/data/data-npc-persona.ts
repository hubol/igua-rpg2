import { DataLib } from "./data-lib";
import { DataNpcLooks } from "./data-npc-looks";

export namespace DataNpcPersona {
    interface Model {
        job: string;
        name: string;
        looksId: DataNpcLooks.Id;
    }

    export const { manifest, getById } = DataLib.create(
        "DataNpcPersona",
        {
            BalltownOutskirtsMiner: { job: "Miner", name: "Dante", looksId: "Miner" },
            BalltownOutskirtsFarmer: { job: "Farmer", name: "Lars", looksId: "Farmer" },
            BalltownOutskirtsSecretShopkeeper: { job: "Shopkeeper", name: "Cryst", looksId: "Golvellius" },
            NewBalltownBallFruitFanatic: { job: "Eccentric", name: "Marf", looksId: "BallFruitFanatic" },
            NewBalltownArmorer: { job: "Armorer", name: "Trav", looksId: "Dizzy" },
            NewBalltownFishmonger: { job: "Fishmonger", name: "Pop", looksId: "Nerd" },
            NewBalltownOliveFanatic: { job: "Autist", name: "Oly", looksId: "LivingOlive" },
            NewBalltownCroupier: { job: "Croupier", name: "Flum", looksId: "PartyAnimal" },
            NewBalltownMiner: { job: "Miner (Retired)", name: "Virgil", looksId: "MinerSibling" },
            UnderneathHomeowner: { job: "Homeowner", name: "Keef", looksId: "Satisfier" },
            UnderneathTunneler: { job: "Maintainer", name: "Sheeb", looksId: "HighIq" },
            Gluemaker: { job: "Gluemaker", name: "Paste", looksId: "Paste" },
            Cobbler: { job: "Cobbler", name: "Frint", looksId: "Spice" },
            WheatGod: { job: "God", name: "Wheena", looksId: "Wheat" },
            BeetGod: { job: "God", name: "Bweena", looksId: "Beet" },
            CavernShopkeeper: { job: "Shopkeeper", name: "Sweet P", looksId: "CaveDweller" },
            CavernGatekeeper: { job: "Gatekeeper", name: "Tax", looksId: "Ruby" },
            FlopCollector: { job: "Flop Collector", name: "Pin", looksId: "Circus" },
            MarketGreeter: { job: "Greeter", name: "Yrem", looksId: "Bubblegum" },
            ObstacleWatcher: { job: "Host", name: "Tipp", looksId: "Corpo" },
            ColosseumWatcher: { job: "Watcher", name: "Chimm", looksId: "DarkOne" },
            IndianaStudent0: { job: "Student", name: "Ridz", looksId: "TurtleMutant" },
            IndianaStudent1: { job: "Student", name: "Fleem", looksId: "FleshHound" },
            IndianaStudent2: { job: "Student", name: "Chine", looksId: "Tweaker" },
            IndianaStudent3: { job: "Student", name: "Krids", looksId: "Flamboyant" },
            IndianaNurse: { job: "Nurse", name: "Chandelique", looksId: "Unamused" },
            SecretKnower0: { job: "Knower", name: "???", looksId: "KoopaVariety" },
            GreatTowerShopkeeper: { job: "Shopkeeper", name: "Kleek", looksId: "PotteryEnthusiast" },
            MealSoulWaiter: { job: "Franchise Owner", name: "Midge", looksId: "HotTopic" },
            Hubol: { job: "???", name: "Hubol", looksId: "Hubol" },
            CloudHouseArtist: { job: "Artist", name: "Eoonze", looksId: "Rugby" },
            CloudHouseAddict: { job: "Addict", name: "Marin", looksId: "CharmingFool" },
            CloudHouseRinger: { job: "Ringer", name: "Ding Ding Saudah", looksId: "Insecure" },
            IndianaDirector: { job: "Director", name: "Don GPA", looksId: "Miserable" },
            Olympian: { job: "Olympian", name: "Jim Niss", looksId: "Naive" },
            GrottoIndianaMerchant: { job: "Merchant", name: "Nasr", looksId: "AustraliasOwnBluey" },
            CloudHouseNeatFreak: { job: "Custodian", name: "Fries", looksId: "Tamed" },
            BugGlitch0: { job: "Error", name: "K.P.I.", looksId: "AustraliasOwnBluey" },
            Vase: { job: "Cactus Cobbler", name: "Winston", looksId: "EasilyTricked" },
            PityBoss: { job: "Pity Boss", name: "Ga'hvorth", looksId: "LilEmbarrassment" },
            CloudHouseMusician: { job: "Music Fan", name: "Treenje", looksId: "Foolish" },
            CloudHouseNerd: { job: "Nerd", name: "Thinth", looksId: "Smoky" },
            CombatTeacher: { job: "Combat Expert", name: "Prince", looksId: "CombatRed" },
            PocketTeacher: { job: "Pocket Expert", name: "Bishop", looksId: "PocketBlue" },
            QuestTeacher: { job: "Quest Expert", name: "Picky", looksId: "QuestBlue" },
            NerdBouncer: { job: "Nerd Bouncer", name: "Dinz", looksId: "SmokyMagenta" },
            FlopStudent0: { job: "Student", name: "Chens", looksId: "Eager" },
            FlopStudent1: { job: "Student", name: "Pritz", looksId: "Unwell" },
            FlopStudent2: { job: "Student", name: "Rise", looksId: "HighHorse" },
            FlopStudent3: { job: "Student", name: "Reech", looksId: "NaiveWizard" },
            GamblingTeacher: { job: "Gambling Expert", name: "Trinz", looksId: "Goldilocks" },
            SocialTeacher: { job: "Social Expert", name: "Chrinch", looksId: "Plum" },
            // TODO need new looks:
            FbiAgent: { job: "FBI Agent", name: "Funch", looksId: "Plum" },
            Misha: { job: "Staff Engineer", name: "Misha", looksId: "SadMisha" },
            IndianaHallPainter: { job: "Creative Director", name: "Painch", looksId: "PrimaryMess" },
            OhioDmvClerk: { job: "Clerk", name: "Thenra'ahshi", looksId: "Hellion" },
            OpenFood: { job: "Fooder", name: "Ribbit", looksId: "FriendlyGreen" },
            __Fallback__: { job: "???", name: "???", looksId: "MintyJourney" },
        } satisfies Record<string, Model>,
    );

    export type Id = DataLib.Id<typeof manifest>;

    export type Type = DataLib.Type<typeof manifest>;
}
