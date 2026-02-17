import { Graphics } from "pixi.js";
import { Lvl } from "../../assets/generated/levels/generated-level-data";
import { interp, interpvr } from "../../lib/game-engine/routines/interp";
import { onPrimitiveMutate } from "../../lib/game-engine/routines/on-primitive-mutate";
import { ZIndex } from "../core/scene/z-index";
import { DramaQuests } from "../drama/drama-quests";
import { ask, show } from "../drama/show";
import { Cutscene } from "../globals";
import { objIguanaPuppet } from "../iguana/obj-iguana-puppet";
import { mxnCutscene } from "../mixins/mxn-cutscene";
import { mxnIguanaSpeaker } from "../mixins/mxn-iguana-speaker";
import { mxnSinePivot } from "../mixins/mxn-sine-pivot";
import { mxnSpeaker } from "../mixins/mxn-speaker";
import { Rpg } from "../rpg/rpg";

// TODO I would like this to work differently
// Perhaps flags expose their own API
const consts = {
    maxVaseMoistureUnits: 1000,
};

export function scnVaseInhabitant() {
    const vaseProgress = {
        get fillUnit() {
            return Math.max(0, Math.min(1, Rpg.flags.vase.moistureUnits / consts.maxVaseMoistureUnits));
        },
        get isFilled() {
            return this.fillUnit >= 1;
        },
    };

    const lvl = Lvl.VaseInhabitant();

    const vaseMaskObj = new Graphics()
        .beginFill(0xffffff)
        .drawRect(0, -lvl.VaseWater.height, lvl.VaseWater.width, lvl.VaseWater.height)
        .scaled(1, 0)
        .coro(function* (self) {
            self.scale.y = vaseProgress.fillUnit;

            while (true) {
                yield onPrimitiveMutate(() => vaseProgress.fillUnit);
                yield interp(self.scale, "y").to(vaseProgress.fillUnit).over(1000);
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

    const floatingIguanaObj = objIguanaPuppet(lvl.VaseNpc.objIguanaNpc.persona.looks)
        .mixin(mxnIguanaSpeaker, lvl.VaseNpc.objIguanaNpc.persona)
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

    const iguanaObjs = {
        floatingObj: floatingIguanaObj,
        surfacedObj: lvl.VaseNpc,
    };

    if (vaseProgress.isFilled) {
        iguanaObjs.floatingObj.destroy();
    }
    else {
        iguanaObjs.surfacedObj.visible = false;
        iguanaObjs.floatingObj
            .coro(function* (self) {
                yield () => vaseProgress.isFilled;
                Cutscene.play(function* () {
                    yield interpvr(self).to(iguanaObjs.surfacedObj).over(400);
                    self.destroy();
                    iguanaObjs.surfacedObj.visible = true;
                });
            });
    }

    iguanaObjs.surfacedObj
        .coro(function* (self) {
            yield () => self.visible;
            if (!Rpg.quest("VaseInhabitant.Saved").everCompleted) {
                Cutscene.play(function* () {
                    yield* DramaQuests.complete("VaseInhabitant.Saved");
                });
            }
        });
}
