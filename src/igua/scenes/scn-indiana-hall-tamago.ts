import { Sprite } from "pixi.js";
import { Lvl } from "../../assets/generated/levels/generated-level-data";
import { Tx } from "../../assets/textures";
import { ZIndex } from "../core/scene/z-index";
import { mxnBoilFlipH } from "../mixins/mxn-boil-flip-h";
import { objEsotericTamago } from "../objects/esoteric/obj-esoteric-tamago";

export function scnIndianaHallTamago() {
    Lvl.IndianaHallTamago();

    const tamagoObj = objEsotericTamago()
        .at(140, 50)
        .zIndexed(ZIndex.BackgroundEntities)
        .show();

    const screenObj = tamagoObj.objEsotericTamago.screenObj;

    Sprite.from(Tx.Esoteric.Tamago.DemoScreen)
        .mixin(mxnBoilFlipH)
        // .step(self => self.x += 1)
        .show(screenObj);
}
