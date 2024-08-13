import { Integer } from "../../lib/math/number-alias-types";
import { playerObj } from "../objects/obj-player";
import { RpgAttack } from "./rpg-attack";
import { RpgPlayer } from "./rpg-player";

export namespace RpgEnemy {
    export interface Model {
        shameCount: Integer;
        // TODO I had loot here before, does it need to be here?
        // This shape for an enemy looks like a lie...
    }

    export const Methods = {
        strikePlayer(model: Model, attack: RpgAttack.Model) {
            if (!playerObj)
                return;

            // TODO not sure if a "slow poison" should increase the shameCount
            
            const result = playerObj.damage(attack);
            if (!result.rejected && result.damaged)
                model.shameCount++;
        }
    }
}