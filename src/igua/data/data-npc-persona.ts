import { IguanaLooks } from "../iguana/looks";
import { DataLib } from "./data-lib";
import { NpcLooks } from "./data-npc-looks";

export namespace DataNpcPersona {
    export interface Model {
        job: string;
        name: string;
        looks: IguanaLooks.Serializable;
    }

    export const Manifest = DataLib.createManifest(
        {
            BalltownOutskirtsMiner: { job: "Miner", name: "Dante", looks: NpcLooks.Miner },
            BalltownOutskirtsFarmer: { job: "Farmer", name: "Lars", looks: NpcLooks.Farmer },
            BalltownOutskirtsSecretShopkeeper: { job: "Shopkeeper", name: "Cryst", looks: NpcLooks.Golvellius },
            NewBalltownBallFruitFanatic: { job: "Eccentric", name: "Marf", looks: NpcLooks.BallFruitFanatic },
            NewBalltownArmorer: { job: "Armorer", name: "Trav", looks: NpcLooks.Dizzy },
            NewBalltownFishmonger: { job: "Fishmonger", name: "Pop", looks: NpcLooks.Nerd },
            NewBalltownOliveFanatic: { job: "Autist", name: "Oly", looks: NpcLooks.LivingOlive },
            NewBalltownCroupier: { job: "Croupier", name: "Flum", looks: NpcLooks.PartyAnimal },
            NewBalltownMiner: { job: "Miner (Retired)", name: "Virgil", looks: NpcLooks.MinerSibling },
            UnderneathHomeowner: { job: "Homeowner", name: "Keef", looks: NpcLooks.Satisfier },
            UnderneathTunneler: { job: "Tunneler", name: "Sheeb", looks: NpcLooks.HighIq },
            Gluemaker: { job: "Gluemaker", name: "Paste", looks: NpcLooks.Paste },
            Cobbler: { job: "Cobbler", name: "Frint", looks: NpcLooks.Spice },
            WheatGod: { job: "God", name: "Wheena", looks: NpcLooks.Wheat },
            BeetGod: { job: "God", name: "Bweena", looks: NpcLooks.Beet },
            __Fallback__: { job: "???", name: "???", looks: NpcLooks.MintyJourney },
        } satisfies Record<string, Model>,
    );

    export type Id = keyof typeof Manifest;

    export const getById = DataLib.createGetById({ manifest: Manifest, namespace: "DataNpcPersona" });
}
