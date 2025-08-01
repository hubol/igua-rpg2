import { Integer, RgbInt } from "../../lib/math/number-alias-types";
import { merge } from "../../lib/object/merge";
import { DeepPartial } from "../../lib/types/deep-partial";
import { RpgFaction } from "./rpg-faction";

export namespace RpgAttack {
    export interface Model {
        physical: Integer;
        emotional: Integer;
        conditions: {
            helium: Integer;
            poison: Integer;
            wetness: {
                value: Integer;
                tint: RgbInt;
            };
        };
        versus: RpgFaction;
        quirks: {
            isPlayerMeleeAttack: boolean;
            isPlayerClawMeleeAttack: boolean;
        };
    }

    export function create(model: DeepPartial<Model>): Model {
        return merge(
            {
                physical: model.physical ?? 0,
                emotional: model.emotional ?? 0,
                versus: model.versus ?? RpgFaction.Player,
                quirks: {
                    isPlayerClawMeleeAttack: model.quirks?.isPlayerClawMeleeAttack ?? false,
                    isPlayerMeleeAttack: model.quirks?.isPlayerMeleeAttack ?? false,
                },
            },
            merge(model, {
                conditions: merge({
                    helium: model.conditions?.helium ?? 0,
                    poison: model.conditions?.poison ?? 0,
                    wetness: {
                        value: model.conditions?.wetness?.value ?? 0,
                        tint: model.conditions?.wetness?.tint ?? 0xffffff,
                    },
                }, model.conditions ?? {}),
            }),
        );
    }
}
