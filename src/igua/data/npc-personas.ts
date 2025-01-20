import { IguanaLooks } from "../iguana/looks";
import { NpcLooks } from "./npc-looks";

interface NpcPersona {
    job: string;
    name: string;
    looks: IguanaLooks.Serializable;
}

export const NpcPersonas = {
    BalltownOutskirtsMiner: { job: "Miner", name: "Dante", looks: NpcLooks.Miner },
    BalltownOutskirtsFarmer: { job: "Farmer", name: "Lars", looks: NpcLooks.Farmer },
    NewBalltownBallFruitFanatic: { job: "Eccentric", name: "Marf", looks: NpcLooks.BallFruitFanatic },
    NewBalltownArmorer: { job: "Armorer", name: "Trav", looks: NpcLooks.Dizzy },
    NewBalltownFishmonger: { job: "Fishmonger", name: "Pop", looks: NpcLooks.Nerd },
    NewBalltownOliveFanatic: { job: "Autist", name: "Oly", looks: NpcLooks.LivingOlive },
    NewBalltownCroupier: { job: "Croupier", name: "Flum", looks: NpcLooks.PartyAnimal },
    __Unknown__: { job: "???", name: "???", looks: NpcLooks.MintyJourney },
} satisfies Record<string, NpcPersona>;
