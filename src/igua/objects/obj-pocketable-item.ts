import { Sprite } from "pixi.js";
import { RpgPocket } from "../rpg/rpg-pocket";
import { playerObj } from "./obj-player";
import { PhysicsFaction, mxnPhysics } from "../mixins/mxn-physics";
import { Rng } from "../../lib/math/rng";
import { RpgProgress } from "../rpg/rpg-progress";
import { DataPocketItem } from "../data/data-pocket-item";
import { approachLinear } from "../../lib/math/number";
import { holdf } from "../../lib/game-engine/routines/hold";
import { sleepf } from "../../lib/game-engine/routines/sleep";
import { scene } from "../globals";
import { objPocketCollectNotification } from "./pocket/obj-pocket-collect-notification";
import { mxnSpatialAudio } from "../mixins/mxn-spatial-audio";
import { Sfx } from "../../assets/sounds";

export function objPocketableItem(item: RpgPocket.Item) {
    const tx = DataPocketItem[item].texture;
    return Sprite.from(tx).merge({ freed: false }).anchored(0.5, 0.5).coro(function* (self) {
        yield () => (playerObj.speed.x !== 0 || playerObj.speed.y !== 0) && self.collides(playerObj);
        Sfx.Impact.PocketableItemFree.rate(Rng.float(0.9, 1.1)).play();
        self.freed = true;

        let virtualAngle = 0;

        const physicsObj = self.mixin(mxnPhysics, {
            gravity: 0.3,
            physicsRadius: Math.floor(tx.height * 0.3),
            physicsOffset: [0, 1],
            physicsFaction: PhysicsFaction.Environment,
        })
            .mixin(mxnSpatialAudio)
            .step(self => {
                virtualAngle += self.speed.x * 2;
                self.angle = Math.round(virtualAngle / 45) * 45;
                self.speed.x *= 0.998;
                self.speed.x = approachLinear(self.speed.x, 0, 0.003);

                // TODO should be a mixin probably
                if (self.y >= scene.level.height + 100) {
                    self.destroy();
                }
            })
            .handles("moved", (obj, e) => {
                if (e.previousOnGround) {
                    return;
                }

                if (e.hitGround) {
                    obj.play(getBounceSfxToPlay(e.previousSpeed.y).rate(Rng.float(0.9, 1.1)));
                    obj.speed.y = Math.abs(e.previousSpeed.y) * -0.8;
                    if (obj.speed.y > -0.5) {
                        obj.speed.y = 0;
                    }
                }
            });
        // TODO VFX
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

        yield () => playerObj.hasControl && self.collides(playerObj);
        const result = RpgPocket.Methods.receive(RpgProgress.character.inventory.pocket, item);
        objPocketCollectNotification(result).at(self).show();
        self.destroy();
    });
}

function getBounceSfxToPlay(vspeed: number) {
    if (vspeed > 5) {
        return Sfx.Impact.PocketableItemBounceHard;
    }
    else if (vspeed > 2) {
        return Sfx.Impact.PocketableItemBounceMedium;
    }
    return Sfx.Impact.PocketableItemBounceSoft;
}
