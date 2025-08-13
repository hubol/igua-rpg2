import { Integer } from "../../lib/math/number-alias-types";
import { DataQuest } from "../data/data-quest";
import { DataShop } from "../data/data-shop";
import { RpgCharacterEquipment } from "./rpg-character-equipment";
import { RpgExperience } from "./rpg-experience";
import { RpgFlops } from "./rpg-flops";
import { RpgIdols } from "./rpg-idols";
import { RpgInventory } from "./rpg-inventory";
import { RpgKeyItems } from "./rpg-key-items";
import { RpgPlayer } from "./rpg-player";
import { RpgPlayerAggregatedBuffs } from "./rpg-player-aggregated-buffs";
import { RpgPlayerAttributes } from "./rpg-player-attributes";
import { RpgPlayerStatus } from "./rpg-player-status";
import { RpgPlayerWallet } from "./rpg-player-wallet";
import { RpgPocket } from "./rpg-pocket";
import { RpgPotions } from "./rpg-potions";
import { getInitialRpgProgress, RpgProgressData } from "./rpg-progress";
import { RpgQuests } from "./rpg-quests";
import { RpgShops } from "./rpg-shops";
import { RpgStashPockets } from "./rpg-stash-pockets";

// TODO this is a fuckin mess!
function createRpg(data: RpgProgressData) {
    const {
        programmaticFlags: {
            idols: idolsState,
            shops: shopsState,
            stashPockets: stashPocketsState,
            ...programmaticFlags
        },
    } = data;

    const experience = new RpgExperience(data.character.experience);
    const equipment = new RpgCharacterEquipment(data.character.inventory.equipment);
    const buffs = new RpgPlayerAggregatedBuffs(equipment);
    const idols = new RpgIdols(idolsState);
    const quests = new RpgQuests(data.character.quests, experience);
    const pocket = new RpgPocket(data.character.inventory.pocket, experience);
    const potions = new RpgPotions(data.character.inventory.potions);
    const keyItems = new RpgKeyItems(data.character.inventory.keyItems);
    const stashPockets = new RpgStashPockets(stashPocketsState, pocket);
    const attributes = new RpgPlayerAttributes(data.character.attributes, buffs);
    const status = new RpgPlayerStatus(data.character.status, attributes, buffs);
    const player = new RpgPlayer(data.character, attributes, buffs, status);
    const flops = new RpgFlops(data.character.inventory.flops);
    const inventory = new RpgInventory(equipment, flops, keyItems, pocket, potions);
    const wallet = new RpgPlayerWallet(data.character.wallet, experience);
    const shops = new RpgShops(shopsState, wallet, inventory);

    return {
        // TODO rename to player
        character: player,
        experience: experience as Omit<RpgExperience, "spend">,
        get flags() {
            return data.flags;
        },
        idol(idolId: Integer) {
            return idols.getById(idolId);
        },
        inventory,
        programmaticFlags,
        quest(questId: DataQuest.Id) {
            return quests.getById(questId);
        },
        shop(shopId: DataShop.Id) {
            return shops.getById(shopId);
        },
        stashPocket(stashPocketId: Integer) {
            return stashPockets.getById(stashPocketId);
        },
        wallet,
        __private__: {
            data,
        },
    } as const;
}

type RpgPrivate = ReturnType<typeof createRpg>;
type RpgPublic = Omit<RpgPrivate, "__private__">;

export let Rpg: RpgPublic = createRpg(getInitialRpgProgress());

export function setRpgProgressData(data: RpgProgressData) {
    Rpg = createRpg(data);
    console.log(Rpg);
}

export function devGetRpgProgressData(): RpgProgressData {
    const { __private__: { data } } = Rpg as RpgPrivate;
    return data;
}
