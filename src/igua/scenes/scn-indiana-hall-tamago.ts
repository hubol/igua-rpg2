import { DisplayObject } from "pixi.js";
import { Lvl } from "../../assets/generated/levels/generated-level-data";
import { Sfx } from "../../assets/sounds";
import { Sound } from "../../lib/game-engine/audio/sound";
import { factor } from "../../lib/game-engine/routines/interp";
import { ZIndex } from "../core/scene/z-index";
import { DramaHallOfDoors } from "../drama/drama-hall-of-doors";
import { Cutscene } from "../globals";
import { mxnFxVibrate } from "../mixins/effects/mxn-fx-vibrate";
import { mxnInteract } from "../mixins/mxn-interact";
import { objFxRipple } from "../objects/effects/obj-fx-ripple";
import { objEsotericTamago } from "../objects/esoteric/obj-esoteric-tamago";
import { EsotericTamaButtons } from "../objects/esoteric/tamago/esoteric-tama-buttons";
import { EsotericTamaPage } from "../objects/esoteric/tamago/esoteric-tama-page";
import { Rpg } from "../rpg/rpg";

export function scnIndianaHallTamago() {
    const lvl = Lvl.IndianaHallTamago();
    const cosmHallOfDoors = Rpg.microcosms["Indiana.HallOfDoors"];

    const io: EsotericTamaPage.IO = {
        beginUpload() {
            return {
                uploadedItem: null,
            };
        },
        cancelUpload() {
        },
        exit() {
            Cutscene.play(function* () {
                yield* DramaHallOfDoors.returnToHall(cosmHallOfDoors);
            });
        },
        refundItem(item) {
        },
    };

    const buttons = new EsotericTamaButtons();
    const homePage = new EsotericTamaPage.Home(io);

    const tamagoObj = objEsotericTamago(buttons, homePage)
        .at(lvl.TamagoShell)
        .zIndexed(ZIndex.BackgroundEntities)
        .show();

    const buttonIds: EsotericTamaButtons.Id[] = ["a", "b", "c"];

    [lvl.ButtonA, lvl.ButtonB, lvl.ButtonC]
        .forEach((obj, i) => obj.mixin(mxnTamagoButton, buttons, buttonIds[i]));
}

const buttonSfx: Record<EsotericTamaButtons.Id, Sound> = {
    a: Sfx.Interact.Tamago.ButtonA,
    b: Sfx.Interact.Tamago.ButtonB,
    c: Sfx.Interact.Tamago.ButtonC,
};

function mxnTamagoButton(obj: DisplayObject, buttons: EsotericTamaButtons, id: EsotericTamaButtons.Id) {
    return obj
        .mixin(mxnFxVibrate, "pivot")
        .coro(function* (self) {
            let vibrateStepsCount = 0;

            self
                .step(() => self.mxnFxVibrate.frequency = vibrateStepsCount-- > 0 ? 0.3 : 0)
                .mixin(mxnInteract, () => {
                    self.play(buttonSfx[id].rate(0.99, 1.01));

                    buttons.press(id);
                    vibrateStepsCount = 15;

                    objFxTamagotchiButtonRipple()
                        .at(obj)
                        .show();
                });
        });
}

function objFxTamagotchiButtonRipple() {
    return objFxRipple(
        {
            radius: 10,
            stroke: 5,
            tint: 0xffff00,
        },
        {
            radius: 30,
            stroke: 0,
            tint: 0x204A99,
        },
    )
        .mxnFxFactor.play(200, factor.sine);
}
