import { RpgAttack } from "./rpg-attack";
import { RpgFaction } from "./rpg-faction";
import { RpgProgress } from "./rpg-progress";
import { RpgStatus } from "./rpg-status";

export const RpgPlayer = {
    // TODO this maybe should be called Status
    Model: {
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
            }
        },
        faction: RpgFaction.Player,
        quirks: {
            emotionalDamageIsFatal: true,
            incrementsAttackerPrideOnDamage: true,
        },
    } satisfies RpgStatus.Model,
    get WalkingTopSpeed() {
        let speed = 2.5;
        speed += 0.75 * Math.min(1, RpgProgress.character.status.poison.level);
        speed += 0.5 * Math.max(0, RpgProgress.character.status.poison.level - 1);
        return speed
    },
    MeleeAttack: {
        emotional: 0,
        get physical() {
            return 5 + RpgProgress.character.attributes.strength * 5;
        },
        poison: 0,
        versus: RpgFaction.Enemy,
    } satisfies RpgAttack.Model,
}