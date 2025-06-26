import { IguanaLooks } from "../iguana/looks";
import { NpcLooks } from "./data-npc-looks";

interface NpcPersona_NoInternalName {
    job: string;
    name: string;
    looks: IguanaLooks.Serializable;
}

const npcPersonas = {
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
    __Unknown__: { job: "???", name: "???", looks: NpcLooks.MintyJourney },
} satisfies Record<string, NpcPersona_NoInternalName>;

export type NpcPersonaInternalName = keyof typeof npcPersonas;

type NpcPersona = NpcPersona_NoInternalName & { internalName: NpcPersonaInternalName };

export const NpcPersonas = Object.entries(npcPersonas).reduce(
    (obj, [internalName, npcPersona]) => {
        obj[internalName as NpcPersonaInternalName] = {
            internalName: internalName as NpcPersonaInternalName,
            ...npcPersona,
        } satisfies NpcPersona;
        return obj;
    },
    {} as Record<NpcPersonaInternalName, NpcPersona>,
);
