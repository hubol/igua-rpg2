import { RpgAttack } from "./rpg-attack";
import { RpgEquipmentLoadout } from "./rpg-equipment-loadout";
import { RpgFaction } from "./rpg-faction";
import { RpgProgress } from "./rpg-progress";
import { RpgStatus } from "./rpg-status";

export const RpgPlayer = {
    get equipmentEffects() {
        return RpgEquipmentLoadout.getPlayerEffects();
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
        conditions: {
            get poison() {
                return RpgEquipmentLoadout.getPlayerEffects().combat.melee.conditions.poison;
            },
        },
        emotional: 0,
        get physical() {
            return 4 + RpgProgress.character.attributes.strength * 3
                + RpgEquipmentLoadout.getPlayerEffects().combat.melee.attack.physical;
        },
        versus: RpgFaction.Enemy,
        quirks: {
            isPlayerMeleeAttack: true,
        },
    }),
    meleeClawAttack: RpgAttack.create({
        conditions: {
            get poison() {
                return RpgEquipmentLoadout.getPlayerEffects().combat.melee.conditions.poison;
            },
        },
        emotional: 0,
        get physical() {
            return 5 + RpgProgress.character.attributes.strength * 5
                + RpgEquipmentLoadout.getPlayerEffects().combat.melee.clawAttack.physical;
        },
        versus: RpgFaction.Enemy,
        quirks: {
            // TODO should it have both player melee quirks?
            isPlayerClawMeleeAttack: true,
        },
    }),
};
