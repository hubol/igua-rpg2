import { RpgProgress } from "./rpg-progress";
import { RpgStatus } from "./rpg-status";

export namespace RpgPlayer {
    export const Model = {
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
        get maxHealth() {
            return 45 + RpgProgress.character.attributes.health * 5;
        },
        poison: {
            get level() {
                return RpgProgress.character.status.poison.level;
            },
            set level(value) {
                RpgProgress.character.status.poison.level = value;
            },
            max: 100,
            get value() {
                return RpgProgress.character.status.poison.value;
            },
            set value(value) {
                RpgProgress.character.status.poison.value = value;
            }
        }
    } satisfies RpgStatus.Model
}