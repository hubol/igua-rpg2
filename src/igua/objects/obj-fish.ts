import { Sprite } from "pixi.js";
import { Tx } from "../../assets/textures";
import { factor, interpv } from "../../lib/game-engine/routines/interp";
import { sleep, sleepf } from "../../lib/game-engine/routines/sleep";
import { Integer } from "../../lib/math/number-alias-types";
import { PseudoRng, Rng } from "../../lib/math/rng";
import { AdjustColor } from "../../lib/pixi/adjust-color";
import { container } from "../../lib/pixi/container";
import { mxnPhysics } from "../mixins/mxn-physics";
import { objFxBubble4 } from "./effects/obj-fx-bubble-4";

const [txFishBody0, txFishBody1, ...txFishFaces] = Tx.Furniture.Aquarium.Fish.split({ width: 22 });
const pseudo = new PseudoRng();

export function objFish(seed: Integer) {
    pseudo.seed = seed;
    const txFace = pseudo.choose(...txFishFaces);
    const tint = AdjustColor.hsv(pseudo.int(360), 80, 80).toPixi();

    let index = Rng.float(2);
    const bodyObj = Sprite.from(txFishBody0).tinted(tint);
    const faceObj = Sprite.from(txFace);

    let collisionsCount = 0;

    return container(
        bodyObj,
        faceObj,
    )
        .pivoted(16, 11)
        .mixin(mxnPhysics, { gravity: 0, physicsRadius: 4 })
        .handles("moved", (_, e) => {
            if (!e.previousSpeed.isZero && (e.hitCeiling || e.hitGround || e.hitWall)) {
                collisionsCount++;
            }
        })
        .merge({ isMoving: true })
        .step(self => {
            index += (Math.abs(self.speed.x) + Math.abs(self.speed.y)) * 0.15;
            bodyObj.texture = Math.floor(index) % 2 === 0 ? txFishBody0 : txFishBody1;
        })
        .coro(function* (self) {
            yield () => self.isMoving;
            self.speed.at(Rng.vunit());
            while (true) {
                const previousCollisionsCount = collisionsCount;
                yield () => collisionsCount !== previousCollisionsCount;
                yield sleep(Rng.int(100, 300));
                yield interpv(self.speed).factor(factor.sine).to(Rng.vunit()).over(Rng.int(500, 1500));
            }
        })
        .coro(function* (self) {
            self.scale.x = Math.sign(self.speed.x) || 1;
            while (true) {
                yield () => self.speed.x !== 0 && Math.sign(self.speed.x) !== self.scale.x;
                faceObj.x = -2;
                yield sleepf(8);
                faceObj.x = 0;
                self.scale.x *= -1;
                yield sleepf(8);
            }
        })
        .coro(function* (self) {
            while (true) {
                yield sleep(Rng.float(2500, 5000));
                objFxBubble4().at(self).show();
                if (self.speed.vlength > 0.5 && Rng.bool()) {
                    yield sleep(Rng.float(100, 400));
                    objFxBubble4().at(self).show();
                }
            }
        });
}

objFish.forArmorer = () => objFish(5316007);
