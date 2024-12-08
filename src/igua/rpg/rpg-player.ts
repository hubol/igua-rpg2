import { RpgAttack } from "./rpg-attack";
import { RpgFaction } from "./rpg-faction";
import { RpgProgress } from "./rpg-progress";
import { RpgStatus } from "./rpg-status";

export const RpgPlayer = {
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
        isGuarding: false as boolean,
        invulnerableMax: 60,
        get healthMax() {
            return 45 + RpgProgress.character.attributes.health * 5;
        },
        pride: 0,
        poison: {
            immune: false,
            max: 100,
            get level() {
                return RpgProgress.character.status.poison.level;
            },
            set level(value) {
                RpgProgress.character.status.poison.level = value;
            },
            get value() {
                return RpgProgress.character.status.poison.value;
            },
            set value(value) {
                RpgProgress.character.status.poison.value = value;
            },
        },
        wetness: {
            get value() {
                return RpgProgress.character.status.wetness.value;
            },
            set value(value) {
                RpgProgress.character.status.wetness.value = value;
            },
            max: 100,
        },
        guardingDefenses: {
            physical: 20,
        },
        defenses: {
            physical: 0,
        },
        faction: RpgFaction.Player,
        quirks: {
            emotionalDamageIsFatal: true,
            incrementsAttackerPrideOnDamage: true,
            roundReceivedDamageUp: false,
            guardedDamageIsFatal: false,
        },
    } satisfies RpgStatus.Model,
    motion: {
        get bouncingMinSpeed() {
            return Math.min(4, 2.5 + RpgProgress.character.status.poison.level * 0.25);
        },
        get walkingTopSpeed() {
            let speed = 2.5;
            speed += 0.75 * Math.min(1, RpgProgress.character.status.poison.level);
            speed += 0.5 * Math.max(0, RpgProgress.character.status.poison.level - 1);
            return speed;
        },
    },
    meleeAttack: RpgAttack.create({
        emotional: 0,
        get physical() {
            return 5 + RpgProgress.character.attributes.strength * 5;
        },
        poison: 0,
        wetness: 0,
        versus: RpgFaction.Enemy,
    }),
};
