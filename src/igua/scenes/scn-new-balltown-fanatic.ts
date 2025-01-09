import { BLEND_MODES } from "pixi.js";
import { Lvl } from "../../assets/generated/levels/generated-level-data";
import { Mzk } from "../../assets/music";
import { Jukebox } from "../core/igua-audio";
import { mxnBoilPivot } from "../mixins/mxn-boil-pivot";
import { mxnBoilMirrorRotate } from "../mixins/mxn-boil-mirror-rotate";

export function scnNewBalltownFanatic() {
    Jukebox.play(Mzk.CedarWorld);
    const lvl = Lvl.NewBalltownFanatic();
    lvl.FurnitureChandelier.mixin(mxnBoilPivot);
    lvl.ChandelierLights.children.forEach(x => x.mixin(mxnBoilMirrorRotate).blendMode = BLEND_MODES.ADD);
}
