import { Integer } from "../../lib/math/number-alias-types";
import { RpgFaction } from "./rpg-faction";

export namespace RpgAttack {
    export interface Model {
        physical: Integer;
        emotional: Integer;
        poison: Integer;
        versus: RpgFaction;
    }

    export function create(model: Partial<Model>): Model {
        return {
            physical: model.physical ?? 0,
            emotional: model.emotional ?? 0,
            poison: model.poison ?? 0,
            versus: model.versus ?? RpgFaction.Player,
        }
    }
}