import { DisplayObject } from "pixi.js";
import { objText } from "../../../assets/fonts";
import { Assert } from "../../../lib/assert";
import { scene } from "../../globals";
import { RpgFactory } from "../../rpg/rpg-factory";
import { getInitialRpgProgress } from "../../rpg/rpg-progress";

export function scnDevTestPocket() {
    const rpg = RpgFactory.create(getInitialRpgProgress());
    scene.stage.mixin(mxnTest, () => {
        Assert(rpg.inventory.pocket.receive("BallFruitTypeA")).toSerializeTo({ reset: false, count: 1 });
        Assert(rpg.inventory.pocket.receive("BallFruitTypeB")).toSerializeTo({ reset: true, count: 1 });
        Assert(rpg.inventory.pocket.receive("BallFruitTypeB")).toSerializeTo({ reset: false, count: 2 });
        Assert(rpg.inventory.pocket.count("BallFruitTypeB")).toStrictlyBe(2);
        Assert(rpg.inventory.pocket.count("BallFruitTypeA")).toStrictlyBe(0);
    });
}

function mxnTest(obj: DisplayObject, program: () => void) {
    obj
        .coro(function* () {
            try {
                program();
                objText.Large("PASS", { tint: 0x00ff00 }).show();
            }
            catch (e) {
                console.log(e);
                objText.Large("FAIL", { tint: 0xff0000 }).show();
            }
        });
}
