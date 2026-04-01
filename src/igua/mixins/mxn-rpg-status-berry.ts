import { Container } from "pixi.js";
import { objText } from "../../assets/fonts";
import { Sfx } from "../../assets/sounds";
import { interpc, interpvr } from "../../lib/game-engine/routines/interp";
import { sleep } from "../../lib/game-engine/routines/sleep";
import { Rng } from "../../lib/math/rng";
import { objAngelBerry } from "../objects/enemies/obj-angel-berry";
import { mxnDetectPlayer } from "./mxn-detect-player";
import { mxnPhysics } from "./mxn-physics";
import { MxnRpgStatus } from "./mxn-rpg-status";
import { mxnTextTyped } from "./mxn-text-typed";

const consts = {
    maxStepsSinceBerry: 9999,
};

export function mxnRpgStatusBerry(obj: MxnRpgStatus & Container) {
    let stepsSinceBerry = consts.maxStepsSinceBerry;
    const berryObjs = new Array<Container>();

    const api = {
        *dramaSpawnBerry() {
            if (berryObjs.length || stepsSinceBerry < 6 * 60 || obj.status.health >= obj.status.healthMax) {
                return;
            }

            obj.play(Sfx.Enemy.Berry.Announce.rate(0.9, 1.1));

            const message = Rng.choose(
                "It's berry time",
                "I'm berry ready to heal",
                "Berry...!",
            );

            const textObj = objText.MediumIrregular("", { tint: 0xB85BFF })
                .anchored(0.5, 1)
                .at(obj)
                .add(0, -obj.height / 2)
                .vround()
                .mixin(mxnTextTyped, () => message)
                .show();

            obj.on("destroyed", () => {
                if (!textObj.destroyed) {
                    textObj.destroy();
                }
            });

            yield () => textObj.text === message;
            yield interpc(textObj, "tint").steps(4).to(0xffffff).over(333);
            yield sleep(333);

            yield interpvr(textObj).translate(0, -100).over(300);
            textObj.destroy();

            if (obj.is(mxnPhysics) && obj.isOnGround) {
                obj.speed.y = -2;
            }

            const angelBerryObj = objAngelBerry(obj)
                .at(obj)
                .add(0, -obj.height / 2)
                .vround()
                .show();

            let sign = Rng.intp();

            if (obj.is(mxnDetectPlayer) && obj.mxnDetectPlayer.isDetected) {
                const detectionSign = Math.sign(obj.mxnDetectPlayer.relativePosition.x);
                if (detectionSign !== 0) {
                    sign = -detectionSign;
                }
            }

            angelBerryObj.speed.x = sign * Rng.float(2.5, 3.75);
            angelBerryObj.speed.y = -Rng.float(4, 5);

            berryObjs.push(angelBerryObj);
        },
    };

    return obj
        .merge({ mxnRpgStatusBerry: api })
        .step(() => {
            if (!berryObjs.length) {
                if (stepsSinceBerry < consts.maxStepsSinceBerry) {
                    stepsSinceBerry++;
                }
                return;
            }

            stepsSinceBerry = 0;

            if (berryObjs[0].destroyed) {
                berryObjs.shift();
            }
        });
}
