import { Integer, RgbInt } from "../../lib/math/number-alias-types";
import { DeepPartial } from "../../lib/types/deep-partial";
import { RpgFaction } from "./rpg-faction";

export namespace RpgAttack {
    export interface Model {
        physical: Integer;
        emotional: Integer;
        poison: Integer;
        wetness: {
            value: Integer;
            tint: RgbInt;
        };
        versus: RpgFaction;
        quirks: {
            isPlayerMeleeAttack: boolean;
            isPlayerClawMeleeAttack: boolean;
        };
    }

    export function create(model: DeepPartial<Model>): Model {
        return {
            physical: model.physical ?? 0,
            emotional: model.emotional ?? 0,
            poison: model.poison ?? 0,
            wetness: { value: model.wetness?.value ?? 0, tint: model.wetness?.tint ?? 0xffffff },
            versus: model.versus ?? RpgFaction.Player,
            quirks: {
                isPlayerClawMeleeAttack: model.quirks?.isPlayerClawMeleeAttack ?? false,
                isPlayerMeleeAttack: model.quirks?.isPlayerMeleeAttack ?? false,
            },
        };
    }
}
