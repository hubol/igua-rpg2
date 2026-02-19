import { Integer } from "../../lib/math/number-alias-types";
import { DataNpcPersona } from "../data/data-npc-persona";
import { DataQuestReward } from "../data/data-quest-reward";
import { DataShop } from "../data/data-shop";
import { RpgCharacterEquipment } from "./rpg-character-equipment";
import { RpgClassrooms } from "./rpg-classrooms";
import { RpgExperience } from "./rpg-experience";
import { RpgExperienceRewarder } from "./rpg-experience-rewarder";
import { RpgFacts } from "./rpg-facts";
import { RpgFlops } from "./rpg-flops";
import { RpgIdols } from "./rpg-idols";
import { RpgIguanaNpcs } from "./rpg-iguana-npcs";
import { RpgInventory } from "./rpg-inventory";
import { RpgKeyItems } from "./rpg-key-items";
import { RpgLooseValuables } from "./rpg-loose-valuables";
import { RpgLoot } from "./rpg-loot";
import { RpgPlayer } from "./rpg-player";
import { RpgPlayerAggregatedBuffs } from "./rpg-player-aggregated-buffs";
import { RpgPlayerAttributes } from "./rpg-player-attributes";
import { RpgPlayerStatus } from "./rpg-player-status";
import { RpgPlayerWallet } from "./rpg-player-wallet";
import { RpgPocket } from "./rpg-pocket";
import { RpgPotions } from "./rpg-potions";
import { RpgProgressData } from "./rpg-progress";
import { RpgQuests } from "./rpg-quests";
import { RpgShops } from "./rpg-shops";
import { RpgStashPockets } from "./rpg-stash-pockets";
import { RpgWeightedPedestals } from "./rpg-weighted-pedestals";

export namespace RpgFactory {
    export function create(data: RpgProgressData) {
        const {
            programmaticFlags: {
                classrooms: classroomsState,
                idols: idolsState,
                iguanaNpcs: iguanaNpcsState,
                shops: shopsState,
                stashPockets: stashPocketsState,
                looseValuables: looseValuablesState,
                quests: questsState,
                weightedPedestals: weightedPedestalsState,
                ...programmaticFlags
            },
        } = data;

        const equipment = new RpgCharacterEquipment(data.character.inventory.equipment);
        const buffs = new RpgPlayerAggregatedBuffs(equipment);
        const idols = new RpgIdols(idolsState);
        const potions = new RpgPotions(data.character.inventory.potions);
        const keyItems = new RpgKeyItems(data.character.inventory.keyItems);
        const attributes = new RpgPlayerAttributes(data.character.attributes, buffs);
        const status = new RpgPlayerStatus(data.character.status, attributes, buffs);
        const experienceRewarder = new RpgExperienceRewarder(data.character.experience, buffs, status);
        const experience = new RpgExperience(data.character.experience, experienceRewarder);
        const loot = new RpgLoot(experience);
        const classrooms = new RpgClassrooms(classroomsState, experience.reward);
        const iguanaNpcs = new RpgIguanaNpcs(iguanaNpcsState, experience.reward);
        const quests = new RpgQuests(questsState, experience.reward);
        const pocket = new RpgPocket(data.character.inventory.pocket, experience);
        const stashPockets = new RpgStashPockets(stashPocketsState, pocket, experience.reward);
        const facts = new RpgFacts(data.character.facts, attributes);
        const flops = new RpgFlops(data.character.inventory.flops);
        const inventory = new RpgInventory(equipment, flops, keyItems, pocket, potions);
        const wallet = new RpgPlayerWallet(data.character.wallet, experience);
        const looseValuables = new RpgLooseValuables(looseValuablesState);
        const player = new RpgPlayer(
            data.character,
            attributes,
            buffs,
            status,
            facts,
            experience.reward,
            wallet,
            pocket,
            looseValuables,
        );
        const shops = new RpgShops(shopsState, wallet, inventory);
        const weightedPedestals = new RpgWeightedPedestals(weightedPedestalsState);

        return {
            // TODO rename to player
            character: player,
            classroom(classroomId: string) {
                return classrooms.getById(classroomId);
            },
            experience: experience as Omit<RpgExperience, "spend">,
            get flags() {
                return data.flags;
            },
            idol(idolId: Integer) {
                return idols.getById(idolId);
            },
            iguanaNpc(npcId: DataNpcPersona.Id) {
                return iguanaNpcs.getById(npcId);
            },
            inventory,
            looseValuables: looseValuables as Omit<RpgLooseValuables, "nextLifetime">,
            loot,
            programmaticFlags,
            quest(questId: DataQuestReward.Id) {
                return quests.getById(questId);
            },
            shop(shopId: DataShop.Id) {
                return shops.getById(shopId);
            },
            stashPocket(stashPocketId: Integer) {
                return stashPockets.getById(stashPocketId);
            },
            wallet,
            weightedPedestals,
            __private__: {
                data,
            },
        } as const;
    }

    export type Type = ReturnType<typeof create>;
}
