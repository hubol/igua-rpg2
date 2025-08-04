import { Integer } from "../../lib/math/number-alias-types";
import { DataQuest } from "../data/data-quest";
import { DataShop } from "../data/data-shop";
import { RpgCharacterEquipment } from "./rpg-character-equipment";
import { RpgIdols } from "./rpg-idols";
import { RpgKeyItems } from "./rpg-key-items";
import { RpgPlayerAggregatedBuffs } from "./rpg-player-aggregated-buffs";
import { RpgPlayerAttributes } from "./rpg-player-attributes";
import { RpgPocket } from "./rpg-pocket";
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
    const { character: { inventory: { pocket: pocketState, keyItems: keyItemsState, ...inventory } } } = data;

    const equipment = new RpgCharacterEquipment(data.character.inventory.equipment);
    const buffs = new RpgPlayerAggregatedBuffs(equipment);
    const idols = new RpgIdols(idolsState);
    const quests = new RpgQuests(data.character.quests);
    const pocket = new RpgPocket(pocketState);
    const keyItems = new RpgKeyItems(keyItemsState);
    const shops = new RpgShops(shopsState);
    const stashPockets = new RpgStashPockets(stashPocketsState, pocket);
    const attributes = new RpgPlayerAttributes(data.character.attributes, buffs);

    return {
        // TODO rename to player
        character: {
            attributes,
            get buffs() {
                return buffs.getAggregatedBuffs();
            },
            equipment,
            get experience() {
                return data.character.experience;
            },
            inventory,
            get looks() {
                return data.character.looks;
            },
            set looks(value) {
                data.character.looks = value;
            },
            get position() {
                return data.character.position;
            },
            get status() {
                return data.character.status;
            },
        } as const,
        get flags() {
            return data.flags;
        },
        idols(idolId: Integer) {
            return idols.getById(idolId);
        },
        // TODO put all inventory here:
        inventory: {
            keyItems,
            pocket,
        },
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
}

export function devGetRpgProgressData(): RpgProgressData {
    const { __private__: { data } } = Rpg as RpgPrivate;
    return data;
}
