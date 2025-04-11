import { DataEquipment } from "../data/data-equipment";
import { RpgAttack } from "./rpg-attack";
import { RpgEquipmentAttributes } from "./rpg-equipment-attributes";
import { RpgFaction } from "./rpg-faction";
import { RpgProgress, RpgProgressEquipment } from "./rpg-progress";
import { RpgStatus } from "./rpg-status";

export const RpgPlayer = {
    get equipmentAttributes() {
        return computeEquipmentAttributes(RpgProgress.character.equipment);
    },
    status: {
        get health() {
            return RpgProgress.character.status.health;
        },
        set health(value) {
            RpgProgress.character.status.health = value;
        },
        get invulnerable() {
            return RpgProgress.character.status.invulnverable;
        },
        set invulnerable(value) {
            RpgProgress.character.status.invulnverable = value;
        },
        invulnerableMax: 60,
        get healthMax() {
            return 45 + RpgProgress.character.attributes.health * 5;
        },
        pride: 0,
        conditions: {
            helium: {
                get ballons() {
                    return RpgProgress.character.status.conditions.helium.ballons;
                },
                get value() {
                    return RpgProgress.character.status.conditions.helium.value;
                },
                set value(value) {
                    RpgProgress.character.status.conditions.helium.value = value;
                },
                max: 100,
            },
            poison: {
                immune: false,
                max: 100,
                get level() {
                    return RpgProgress.character.status.conditions.poison.level;
                },
                set level(value) {
                    RpgProgress.character.status.conditions.poison.level = value;
                },
                get value() {
                    return RpgProgress.character.status.conditions.poison.value;
                },
                set value(value) {
                    RpgProgress.character.status.conditions.poison.value = value;
                },
            },
            wetness: {
                get tint() {
                    return RpgProgress.character.status.conditions.wetness.tint;
                },
                set tint(value) {
                    RpgProgress.character.status.conditions.wetness.tint = value;
                },
                get value() {
                    return RpgProgress.character.status.conditions.wetness.value;
                },
                set value(value) {
                    RpgProgress.character.status.conditions.wetness.value = value;
                },
                max: 100,
            },
        },
        guardingDefenses: {
            physical: 20,
        },
        defenses: {
            physical: 0,
        },
        recoveries: {
            wetness: 1,
        },
        faction: RpgFaction.Player,
        quirks: {
            emotionalDamageIsFatal: true,
            incrementsAttackerPrideOnDamage: true,
            roundReceivedDamageUp: false,
            guardedDamageIsFatal: false,
            ailmentsRecoverWhileCutsceneIsPlaying: false,
            receivesDamageWhileCutsceneIsPlaying: false,
            attackingRewardsExperience: true,
        },
    } satisfies Omit<RpgStatus.Model, "state">,
    motion: {
        // TODO some of these "motion" modifications are computed in objPlayer. Pick a place!
        get bouncingMinSpeed() {
            return Math.min(4, 2.5 + RpgProgress.character.status.conditions.poison.level * 0.25);
        },
    },
    meleeAttack: RpgAttack.create({
        emotional: 0,
        get physical() {
            return 4 + RpgProgress.character.attributes.strength * 3;
        },
        versus: RpgFaction.Enemy,
        quirks: {
            isPlayerMeleeAttack: true,
        },
    }),
    meleeClawAttack: RpgAttack.create({
        emotional: 0,
        get physical() {
            return 5 + RpgProgress.character.attributes.strength * 5;
        },
        versus: RpgFaction.Enemy,
        quirks: {
            // TODO should it have both player melee quirks?
            isPlayerClawMeleeAttack: true,
        },
    }),
};

const equipmentAttributesCacheKey: RpgProgressEquipment = [];
let equipmentAttributesCache: RpgEquipmentAttributes.Model;

function computeEquipmentAttributes(equipment: RpgProgressEquipment) {
    const length = Math.max(equipment.length, equipmentAttributesCacheKey.length);
    let requiresCompute = false;
    for (let i = 0; i < length; i++) {
        if (equipment[i] !== equipmentAttributesCacheKey[i]) {
            requiresCompute = true;
            break;
        }
    }

    if (!requiresCompute) {
        return equipmentAttributesCache;
    }

    equipmentAttributesCacheKey.length = 0;
    equipmentAttributesCacheKey.push(...equipment);

    const attributes = equipment.map(name =>
        (DataEquipment[name ?? "__Empty__"] ?? DataEquipment.__Unknown__).attributes
    );

    // TODO generated code for this?
    equipmentAttributesCache = {
        loot: {
            valuables: {
                constant: attributes.reduce((value, attr) => value + attr.loot.valuables.constant, 0),
            },
        },
        quirks: {
            enablesHighJumpsAtSpecialSigns: attributes.some(attr => attr.quirks.enablesHighJumpsAtSpecialSigns),
        },
    };

    return equipmentAttributesCache;
}
