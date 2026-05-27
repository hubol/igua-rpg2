import { DisplayObject, Sprite } from "pixi.js";
import { Lvl } from "../../assets/generated/levels/generated-level-data";
import { Tx } from "../../assets/textures";
import { factor } from "../../lib/game-engine/routines/interp";
import { sleep } from "../../lib/game-engine/routines/sleep";
import { ZIndex } from "../core/scene/z-index";
import { mxnFxVibrate } from "../mixins/effects/mxn-fx-vibrate";
import { mxnBoilFlipH } from "../mixins/mxn-boil-flip-h";
import { mxnInteract } from "../mixins/mxn-interact";
import { objFxRipple } from "../objects/effects/obj-fx-ripple";
import { objEsotericTamago } from "../objects/esoteric/obj-esoteric-tamago";

export function scnIndianaHallTamago() {
    const lvl = Lvl.IndianaHallTamago();

    const tamagoObj = objEsotericTamago()
        .at(lvl.TamagoShell)
        .zIndexed(ZIndex.BackgroundEntities)
        .show();

    const screenObj = tamagoObj.objEsotericTamago.screenObj;

    Sprite.from(Tx.Esoteric.Tamago.DemoScreen)
        .mixin(mxnBoilFlipH)
        .show(screenObj);

    [lvl.ButtonA, lvl.ButtonB, lvl.ButtonC]
        .forEach(obj => obj.mixin(mxnTamagoButton));
}

function mxnTamagoButton(obj: DisplayObject) {
    return obj
        .mixin(mxnFxVibrate, "pivot")
        .coro(function* (self) {
            let vibrateStepsCount = 0;

            self
                .step(() => self.mxnFxVibrate.frequency = vibrateStepsCount-- > 0 ? 0.3 : 0)
                .mixin(mxnInteract, () => {
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
