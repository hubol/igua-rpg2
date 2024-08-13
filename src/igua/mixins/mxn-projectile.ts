import { DisplayObject } from "pixi.js";
import { Instances } from "../../lib/game-engine/instances";
import { mxnRpgStatus } from "./mxn-rpg-status";
import { RpgAttack } from "../rpg/rpg-attack";
import { RpgEnemy } from "../rpg/rpg-enemy";

interface MxnProjectileArgs {
    attack: RpgAttack.Model;
    enemy?: RpgEnemy.Model;
}

export function mxnProjectile(obj: DisplayObject, args: MxnProjectileArgs) {
    return obj
    .dispatches<'hit'>()
    .step(self => {
        for (const instance of Instances(mxnRpgStatus)) {
            // TODO filter by faction here pls
            if (obj.collidesOne(instance.hurtboxes)) {
                const result = instance.damage(args.attack);
                if (!result.rejected)
                    self.dispatch('hit');
                if (self.destroyed)
                    return;
            }       
        }
    })
}