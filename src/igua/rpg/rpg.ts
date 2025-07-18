import { RpgCharacterEquipment } from "./rpg-character-equipment";
import { RpgPlayerAggregatedBuffs } from "./rpg-player-aggregated-buffs";
import { getInitialRpgProgress, RpgProgressData } from "./rpg-progress";

// TODO this is a fuckin mess!
function createRpg(data: RpgProgressData) {
    const equipment = new RpgCharacterEquipment(data.character.inventory.equipment);
    const buffs = new RpgPlayerAggregatedBuffs(equipment);

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
            get inventory() {
                return data.character.inventory;
            },
            get looks() {
                return data.character.looks;
            },
            set looks(value) {
                data.character.looks = value;
            },
            get position() {
                return data.character.position;
            },
            get quests() {
                return data.character.quests;
            },
            get status() {
                return data.character.status;
            },
        },
        get flags() {
            return data.flags;
        },
        get programmaticFlags() {
            return data.programmaticFlags;
        },
        __private__: {
            data,
        },
    };
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
