import { Graphics } from "pixi.js";
import { Lvl } from "../../assets/generated/levels/generated-level-data";
import { interp } from "../../lib/game-engine/routines/interp";
import { onPrimitiveMutate } from "../../lib/game-engine/routines/on-primitive-mutate";
import { show } from "../drama/show";
import { mxnCutscene } from "../mixins/mxn-cutscene";
import { Rpg } from "../rpg/rpg";

export function scnVaseInhabitant() {
    const lvl = Lvl.VaseInhabitant();

    const vaseMaskObj = new Graphics()
        .beginFill(0xffffff)
        .drawRect(0, -lvl.VaseWater.height, lvl.VaseWater.width, lvl.VaseWater.height)
        .scaled(1, 0)
        .coro(function* (self) {
            function getTargetScaleY() {
                return Math.max(0, Math.min(1, Rpg.flags.vase.moistureUnits / 1000));
            }

            self.scale.y = getTargetScaleY();

            while (true) {
                yield onPrimitiveMutate(() => Rpg.flags.vase.moistureUnits);
                yield interp(self.scale, "y").to(getTargetScaleY()).over(1000);
            }
        })
        .at(lvl.VaseWater)
        .add(0, lvl.VaseWater.height)
        .show();

    lvl.VaseWater
        .masked(vaseMaskObj);

    lvl.VaseNpc
        .mixin(mxnCutscene, function* () {
            yield* show("I'm trapped. Please help.");
            Rpg.flags.vase.moistureUnits += 100;
        });
}
