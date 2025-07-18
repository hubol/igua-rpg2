import { Rpg } from "./rpg";
import { RpgAttack } from "./rpg-attack";
import { RpgFaction } from "./rpg-faction";
import { RpgStatus } from "./rpg-status";

export const RpgPlayer = {
    status: {
        get health() {
            return Rpg.character.status.health;
        },
        set health(value) {
            Rpg.character.status.health = value;
        },
        get invulnerable() {
            return Rpg.character.status.invulnverable;
        },
        set invulnerable(value) {
            Rpg.character.status.invulnverable = value;
        },
        invulnerableMax: 60,
        get healthMax() {
            return 45 + Rpg.character.attributes.health * 5;
        },
        pride: 0,
        conditions: {
            helium: {
                get ballons() {
                    return Rpg.character.status.conditions.helium.ballons;
                },
                get value() {
                    return Rpg.character.status.conditions.helium.value;
                },
                set value(value) {
                    Rpg.character.status.conditions.helium.value = value;
                },
                max: 100,
            },
            poison: {
                immune: false,
                max: 100,
                get level() {
                    return Rpg.character.status.conditions.poison.level;
                },
                set level(value) {
                    Rpg.character.status.conditions.poison.level = value;
                },
                get value() {
                    return Rpg.character.status.conditions.poison.value;
                },
                set value(value) {
                    Rpg.character.status.conditions.poison.value = value;
                },
            },
            wetness: {
                get tint() {
                    return Rpg.character.status.conditions.wetness.tint;
                },
                set tint(value) {
                    Rpg.character.status.conditions.wetness.tint = value;
                },
                get value() {
                    return Rpg.character.status.conditions.wetness.value;
                },
                set value(value) {
                    Rpg.character.status.conditions.wetness.value = value;
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
            isImmuneToPlayerMeleeAttack: true,
        },
    } satisfies Omit<RpgStatus.Model, "state">,
    motion: {
        // TODO some of these "motion" modifications are computed in objPlayer. Pick a place!
        get bouncingMinSpeed() {
            return Math.min(4, 2.5 + Rpg.character.status.conditions.poison.level * 0.25);
        },
    },
    meleeAttack: RpgAttack.create({
        conditions: {
            get poison() {
                return Rpg.character.buffs.combat.melee.conditions.poison;
            },
        },
        emotional: 0,
        get physical() {
            return 4 + Rpg.character.attributes.strength * 3
                + Rpg.character.buffs.combat.melee.attack.physical;
        },
        versus: RpgFaction.Enemy,
        quirks: {
            isPlayerMeleeAttack: true,
        },
    }),
    meleeClawAttack: RpgAttack.create({
        conditions: {
            get poison() {
                return Rpg.character.buffs.combat.melee.conditions.poison;
            },
        },
        emotional: 0,
        get physical() {
            return 5 + Rpg.character.attributes.strength * 5
                + Rpg.character.buffs.combat.melee.clawAttack.physical;
        },
        versus: RpgFaction.Enemy,
        quirks: {
            // TODO should it have both player melee quirks?
            isPlayerClawMeleeAttack: true,
        },
    }),
};
