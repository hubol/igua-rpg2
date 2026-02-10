import { Graphics } from "pixi.js";
import { Lvl } from "../../assets/generated/levels/generated-level-data";
import { interp } from "../../lib/game-engine/routines/interp";
import { onPrimitiveMutate } from "../../lib/game-engine/routines/on-primitive-mutate";
import { ZIndex } from "../core/scene/z-index";
import { DataNpcPersona } from "../data/data-npc-persona";
import { ask, show } from "../drama/show";
import { objIguanaPuppet } from "../iguana/obj-iguana-puppet";
import { mxnCutscene } from "../mixins/mxn-cutscene";
import { mxnSinePivot } from "../mixins/mxn-sine-pivot";
import { mxnSpeaker } from "../mixins/mxn-speaker";
import { Rpg } from "../rpg/rpg";

// TODO I would like this to work differently
// Perhaps flags expose their own API
const consts = {
    maxVaseMoistureUnits: 1000,
};

export function scnVaseInhabitant() {
    const lvl = Lvl.VaseInhabitant();

    const vaseMaskObj = new Graphics()
        .beginFill(0xffffff)
        .drawRect(0, -lvl.VaseWater.height, lvl.VaseWater.width, lvl.VaseWater.height)
        .scaled(1, 0)
        .coro(function* (self) {
            function getTargetScaleY() {
                return Math.max(0, Math.min(1, Rpg.flags.vase.moistureUnits / consts.maxVaseMoistureUnits));
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

    lvl.FillVaseRegion
        .mixin(mxnSpeaker, { name: "Giant Vase", colorPrimary: 0x0000a0, colorSecondary: 0x0080f0 })
        .mixin(mxnCutscene, function* () {
            if (Rpg.flags.vase.moistureUnits >= consts.maxVaseMoistureUnits) {
                yield* show("Already at max.");
                return;
            }
            if (yield* ask("A giant vase... Add moisture?")) {
                if (Rpg.character.status.conditions.wetness.value <= 0) {
                    yield* show("No moisture to add.");
                }
                else {
                    yield* show(`Added ${Rpg.character.status.conditions.wetness.value} units.`);
                    Rpg.flags.vase.moistureUnits += Rpg.character.status.conditions.wetness.value;
                    Rpg.character.status.conditions.wetness.value = 0;
                }
            }
        });

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
        })
        .step(self => {
            self.interact.enabled = !self.collides(lvl.FillVaseRegion);
        })
        .at(lvl.VaseNpcMarker)
        .zIndexed(ZIndex.CharacterEntities)
        .show();
}
