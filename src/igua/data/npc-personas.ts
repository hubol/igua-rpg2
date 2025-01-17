import { IguanaLooks } from "../iguana/looks";
import { NpcLooks } from "./npc-looks";

interface NpcPersona {
    name: string;
    looks: IguanaLooks.Serializable;
}

export const NpcPersonas = {
    BalltownOutskirtsMiner: { name: "Dante", looks: NpcLooks.Miner },
    BalltownOutskirtsFarmer: { name: "Lars", looks: NpcLooks.Farmer },
    NewBalltownBallFruitFanatic: { name: "Marf", looks: NpcLooks.BallFruitFanatic },
    NewBalltownArmorer: { name: "Trav", looks: NpcLooks.Dizzy },
    NewBalltownFishmonger: { name: "Pop", looks: NpcLooks.Nerd },
    __Unknown__: { name: "???", looks: NpcLooks.MintyJourney },
} satisfies Record<string, NpcPersona>;
