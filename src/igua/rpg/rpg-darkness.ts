import { objDarkness } from "../objects/nature/obj-darkness";
import { Rpg } from "./rpg";

export namespace RpgDarkness {
    export type Level = 0 | 1 | 2 | 3;

    export function getLevel() {
        return Math.min(
            3,
            Math.max(0, (objDarkness.getDarkness()?.level ?? 0) - Rpg.character.attributes.vision),
        ) as Level;
    }

    export function isPlayerBlind() {
        return getLevel() >= 3;
    }
}
