import { Lvl } from "../../../assets/generated/levels/generated-level-data";
import { sleep } from "../../../lib/game-engine/routines/sleep";
import { Rng } from "../../../lib/math/rng";
import { container } from "../../../lib/pixi/container";
import { objAngelHeatmeat } from "../../objects/enemies/obj-angel-heatmeat";

export function scnDevAngelHeatmeat() {
    Lvl.Dummy();
    const heatObj = objAngelHeatmeat("heat")
        .at(100, 100)
        .show();

    const meatObj = objAngelHeatmeat("meat")
        .at(400, 100)
        .show();

    heatObj
        .handles("mxnEnemy.died", () => meatObj.objAngelHeatmeat.playMessage("Lament"));

    meatObj
        .handles("mxnEnemy.died", () => heatObj.objAngelHeatmeat.playMessage("Lament"));

    container()
        .coro(function* () {
            yield () => heatObj.mxnDetectPlayer.isDetected || meatObj.mxnDetectPlayer.isDetected;
            const objs = Rng.shuffle([heatObj, meatObj]);
            yield objs[0].objAngelHeatmeat.playMessage("YouAreEvil");
            yield sleep(333);
            yield objs[1].objAngelHeatmeat.playMessage("AndYouMustBeDestroyed");
        })
        .show();
}
