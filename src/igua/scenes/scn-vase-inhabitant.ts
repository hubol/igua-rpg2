import { Graphics } from "pixi.js";
import { Lvl } from "../../assets/generated/levels/generated-level-data";
import { interp } from "../../lib/game-engine/routines/interp";
import { onPrimitiveMutate } from "../../lib/game-engine/routines/on-primitive-mutate";
import { approachLinear } from "../../lib/math/number";
import { ZIndex } from "../core/scene/z-index";
import { DataNpcPersona } from "../data/data-npc-persona";
import { show } from "../drama/show";
import { objIguanaPuppet } from "../iguana/obj-iguana-puppet";
import { mxnCutscene } from "../mixins/mxn-cutscene";
import { mxnSinePivot } from "../mixins/mxn-sine-pivot";
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

    objIguanaPuppet(DataNpcPersona.getById("Vase" as any)!.looks)
        .coro(function* (self) {
            self.facing = -1;
            const y = self.y;

            self
                .step(() => {
                    self.y = y - (vaseMaskObj.height > 15 ? (vaseMaskObj.height - 15) : 0);
                    if (self.y !== y) {
                        self.pedometer += 0.035;
                    }
                })
                .coro(function* () {
                    yield () => self.y !== y;
                    self.gait = 1;
                    self.mixin(mxnSinePivot);
                });
        })
        .mixin(mxnCutscene, function* () {
            yield* show("I'm trapped. Please help.");
            Rpg.flags.vase.moistureUnits += 100;
        })
        .at(lvl.VaseNpcMarker)
        .zIndexed(ZIndex.CharacterEntities)
        .show();
}
