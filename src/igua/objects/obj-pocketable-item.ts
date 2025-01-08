import { Sprite } from "pixi.js";
import { RpgPocket } from "../rpg/rpg-pocket";
import { playerObj } from "./obj-player";
import { mxnPhysics } from "../mixins/mxn-physics";
import { Rng } from "../../lib/math/rng";
import { RpgProgress } from "../rpg/rpg-progress";
import { DataPocketItem } from "../data/data-pocket-item";
import { approachLinear } from "../../lib/math/number";
import { holdf } from "../../lib/game-engine/routines/hold";
import { sleepf } from "../../lib/game-engine/routines/sleep";

export function objPocketableItem(item: RpgPocket.Item) {
    const tx = DataPocketItem[item].texture;
    return Sprite.from(tx).anchored(0.5, 0.5).coro(function* (self) {
        yield () => (playerObj.speed.x !== 0 || playerObj.speed.y !== 0) && self.collides(playerObj);

        let virtualAngle = 0;

        const physicsObj = self.mixin(mxnPhysics, {
            gravity: 0.3,
            physicsRadius: Math.floor(tx.height * 0.3),
            physicsOffset: [0, 1],
        })
            .step(self => {
                virtualAngle += self.speed.x * 2;
                self.angle = Math.round(virtualAngle / 45) * 45;
                self.speed.x *= 0.998;
                self.speed.x = approachLinear(self.speed.x, 0, 0.003);
            })
            .handles("moved", (_, e) => {
                if (e.previousOnGround) {
                    return;
                }

                if (e.hitGround) {
                    physicsObj.speed.y = Math.abs(e.previousSpeed.y) * -0.8;
                    if (physicsObj.speed.y > -0.5) {
                        physicsObj.speed.y = 0;
                    }
                }
            });
        // TODO SFX, VFX
        // Bounce is kind of bad
        // Really need to figure out a smart way to compute this for many situations...
        physicsObj.speed.at(playerObj.speed);
        if (physicsObj.speed.x === 0) {
            physicsObj.speed.x = Rng.intp();
        }
        physicsObj.speed.x = Math.max(2, Math.abs(physicsObj.speed.x)) * Math.sign(physicsObj.speed.x);
        if (physicsObj.speed.y === 0) {
            physicsObj.speed.y = -1;
        }
        physicsObj.alpha = 0.5;
        yield sleepf(15);
        yield holdf(() => physicsObj.isOnGround, 3);
        physicsObj.alpha = 1;

        yield () => self.collides(playerObj);
        RpgPocket.Methods.receive(RpgProgress.character.inventory.pocket, item);
        self.destroy();
    });
}
