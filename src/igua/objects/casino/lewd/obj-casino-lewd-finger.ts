import { Sprite } from "pixi.js";
import { Tx } from "../../../../assets/textures";
import { interp } from "../../../../lib/game-engine/routines/interp";
import { sleep } from "../../../../lib/game-engine/routines/sleep";
import { Rng } from "../../../../lib/math/rng";
import { container } from "../../../../lib/pixi/container";
import { mxnSinePivot } from "../../../mixins/mxn-sine-pivot";
import { objIndexedSprite } from "../../utils/obj-indexed-sprite";

const txs = {
    arm: Tx.Casino.Lewd.Finger.Arm.split({ count: 5 }),
    legs: Tx.Casino.Lewd.Finger.Legs,
    head: Tx.Casino.Lewd.Finger.Head.split({ count: 2 }),
    holePpTail: Tx.Casino.Lewd.Finger.HolePpTail.split({ count: 2 }),
};

export function objCasinoLewdFinger() {
    const headObj = objIndexedSprite(txs.head);
    const armObj = objIndexedSprite(txs.arm);
    const holePpTailObj = objIndexedSprite(txs.holePpTail);

    return container(
        headObj.at(-110, -45).mixin(mxnSinePivot),
        Sprite.from(txs.legs),
        holePpTailObj.at(56, -66),
        armObj.at(-85, -26),
    )
        .coro(function* () {
            while (true) {
                yield sleep(Rng.intc(300, 600));
                headObj.textureIndex = 0;
                armObj.textureIndex = 1;
                yield sleep(220);
                armObj.textureIndex = 2;
                yield sleep(220);

                let score = 0;

                const count = Rng.intc(10, 20);
                for (let i = 0; i < count; i++) {
                    yield interp(armObj, "textureIndex").to(4).over(300 - i * 5);
                    if (i > 0 && Rng.float() < 0.5) {
                        yield sleep(160);
                        armObj.pivot.x = 1;
                        yield sleep(160);
                        armObj.pivot.x = 0;
                    }
                    if (i > 3 && Rng.float() < 0.3 + i * 0.03) {
                        yield sleep(Rng.intc(20, 100));
                        holePpTailObj.textureIndex = 1;
                        if (score++ >= 4 && i < count - 1) {
                            headObj.textureIndex = 1;
                        }
                        yield sleep(Rng.intc(190, 250));
                        holePpTailObj.textureIndex = 0;
                    }
                    yield sleep(Rng.intc(150, 190) - i * 3);
                    yield interp(armObj, "textureIndex").to(2).over(300 - i * 5);
                }

                yield sleep(500);
                armObj.textureIndex = 1;
                yield sleep(250);
                armObj.textureIndex = 0;
                yield sleep(500);
            }
        });
}
