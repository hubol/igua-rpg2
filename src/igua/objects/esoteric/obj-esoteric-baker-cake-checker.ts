import { Sprite, Texture } from "pixi.js";
import { Sfx } from "../../../assets/sounds";
import { Tx } from "../../../assets/textures";
import { interp, interpvr } from "../../../lib/game-engine/routines/interp";
import { sleep } from "../../../lib/game-engine/routines/sleep";
import { Rng } from "../../../lib/math/rng";
import { container } from "../../../lib/pixi/container";

const [txBody, txLightRed, txLightGreen, txHead, txHeadLaser] = Tx.Esoteric.Baker.CakeChecker.split({ width: 100 });

export function objEsotericBakerCakeChecker() {
    const api = {
        *dramaReset() {
            Sfx.Esoteric.CakeCheckReset.play();
            lightObj.texture = Texture.EMPTY;
            yield interpvr(headObj).to(0, 0).over(1000);
        },
        *dramaRunHead() {
            laserObj.visible = true;
            laserObj.alpha = 0;
            Sfx.Esoteric.CakeCheckHeadWarm.play();
            yield interp(laserObj, "alpha").steps(3).to(1).over(333);
            Sfx.Esoteric.CakeCheckHeadRun.play();
            const flickerObj = container()
                .step(() => laserObj.alpha = Rng.float(0.5, 1))
                .show(laserObj);
            yield interpvr(headObj).to(81, 0).over(4000);
            flickerObj.destroy();
            laserObj.alpha = 1;
            yield sleep(333);
            yield interp(laserObj, "alpha").steps(3).to(0).over(333);
        },
        *dramaShowLight(result: "ok" | "bad") {
            const isOk = result === "ok";
            lightObj.texture = isOk ? txLightGreen : txLightRed;
            Sfx.Interact[isOk ? "Correct" : "Error"].rate(0.95, 1.05).play();
            yield sleep(500);
        },
    };

    const laserObj = Sprite.from(txHeadLaser);

    const headObj = container(
        Sprite.from(txHead),
        laserObj
            .invisible(),
    );

    const lightObj = Sprite.from(Texture.EMPTY);

    return container(
        Sprite.from(txBody),
        lightObj,
        headObj,
    )
        .merge({ objEsotericBakerCakeChecker: api });
}
