import { RpgCharacterEquipment } from "./rpg-character-equipment";
import { RpgPlayerAggregatedBuffs } from "./rpg-player-aggregated-buffs";
import { RpgPocket } from "./rpg-pocket";
import { getInitialRpgProgress, RpgProgressData } from "./rpg-progress";
import { RpgQuests } from "./rpg-quests";
import { RpgStashPockets } from "./rpg-stash-pockets";

// TODO this is a fuckin mess!
function createRpg(data: RpgProgressData) {
    const { programmaticFlags: { stashPockets: stashPocketsState, ...programmaticFlags } } = data;
    const { character: { inventory: { pocket: pocketState, ...inventory } } } = data;

    const equipment = new RpgCharacterEquipment(data.character.inventory.equipment);
    const buffs = new RpgPlayerAggregatedBuffs(equipment);
    const quests = new RpgQuests(data.character.quests);
    const pocket = new RpgPocket(pocketState);
    const stashPockets = new RpgStashPockets(stashPocketsState, pocket);

    return {
        // TODO rename to player
        character: {
            get attributes() {
                return data.character.attributes;
            },
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
        // TODO put all inventory here:
        inventory: {
            pocket,
        },
        programmaticFlags,
        quests,
        stashPockets,
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
