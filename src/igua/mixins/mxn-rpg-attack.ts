import { DisplayObject } from "pixi.js";
import { Instances } from "../../lib/game-engine/instances";
import { mxnRpgStatus } from "./mxn-rpg-status";
import { RpgAttack } from "../rpg/rpg-attack";
import { RpgEnemy } from "../rpg/rpg-enemy";

interface MxnRpgAttackArgs {
    attack: RpgAttack.Model;
    enemy?: RpgEnemy.Model;
}

export function mxnRpgAttack(obj: DisplayObject, args: MxnRpgAttackArgs) {
    return obj
    .dispatches<'mxnRpgAttack.hit'>()
    .step(self => {
        for (const instance of Instances(mxnRpgStatus)) {
            // TODO filter by faction here pls
            if (obj.collidesOne(instance.hurtboxes)) {
                const result = instance.damage(args.attack, args.enemy);
                if (!result.rejected)
                    self.dispatch('mxnRpgAttack.hit');
                if (self.destroyed)
                    return;
            }       
        }
    })
}