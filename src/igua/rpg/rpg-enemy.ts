import { Integer } from "../../lib/math/number-alias-types";
import { playerObj } from "../objects/obj-player";
import { RpgPlayer } from "./rpg-player";

export namespace RpgEnemy {
    export interface Model {
        shameCount: Integer;
        // TODO I had loot here before, does it need to be here?
        // This shape for an enemy looks like a lie...
    }

    export const Methods = {
        strikePlayer(model: Model, poison: Integer, physical: Integer, emotional: Integer) {
            if (!playerObj)
                return;

            // TODO not sure if shameCount should increase when player is invulnerable
            // Or if a "slow poison" should increase the shameCount
            // Maybe shameCount should only increase when the player was previously vulnerable and becomes invulnerable
            // But capture that in a cooler way
            
            // TODO feels bad!!! Fix!!!
            const wasInvulnerable = RpgPlayer.Model.invulnerable > 0;

            // TODO use poison, physical, emotional
            playerObj.damage(physical);

            // TODO feels bad!!!! Should come from result of damage, I think!!!
            if (!wasInvulnerable && RpgPlayer.Model.invulnerable > 0)
                model.shameCount++;
        }
    }
}