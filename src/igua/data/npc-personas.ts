import { IguanaLooks } from "../iguana/looks";
import { NpcLooks } from "./npc-looks";

interface NpcPersona {
    internalName: string;
    job: string;
    name: string;
    looks: IguanaLooks.Serializable;
}

const npcPersonas = [
    { internalName: "BalltownOutskirtsMiner", job: "Miner", name: "Dante", looks: NpcLooks.Miner },
    { internalName: "BalltownOutskirtsFarmer", job: "Farmer", name: "Lars", looks: NpcLooks.Farmer },
    { internalName: "NewBalltownBallFruitFanatic", job: "Eccentric", name: "Marf", looks: NpcLooks.BallFruitFanatic },
    { internalName: "NewBalltownArmorer", job: "Armorer", name: "Trav", looks: NpcLooks.Dizzy },
    { internalName: "NewBalltownFishmonger", job: "Fishmonger", name: "Pop", looks: NpcLooks.Nerd },
    { internalName: "NewBalltownOliveFanatic", job: "Autist", name: "Oly", looks: NpcLooks.LivingOlive },
    { internalName: "NewBalltownCroupier", job: "Croupier", name: "Flum", looks: NpcLooks.PartyAnimal },
    { internalName: "__Unknown__", job: "???", name: "???", looks: NpcLooks.MintyJourney },
] as const satisfies readonly NpcPersona[];

type InternalPersonaName = typeof npcPersonas[number]["internalName"];

export const NpcPersonas = npcPersonas.reduce((obj, npcPersona) => {
    obj[npcPersona.internalName] = npcPersona;
    return obj;
}, {} as Record<InternalPersonaName, NpcPersona>);
