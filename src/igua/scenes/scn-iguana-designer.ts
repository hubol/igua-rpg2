import { DisplayObject } from "pixi.js";
import { Lvl } from "../../assets/generated/levels/generated-level-data";
import { Mzk } from "../../assets/music";
import { sleepf } from "../../lib/game-engine/routines/sleep";
import { PseudoRng } from "../../lib/math/rng";
import { container } from "../../lib/pixi/container";
import { Jukebox } from "../core/igua-audio";
import { mxnBoilPivot } from "../mixins/mxn-boil-pivot";
import { CtxUiIguanaDesigner, objUiIguanaDesignerRoot } from "../ui/iguana-designer/obj-ui-iguana-designer-root";
import { approachLinear } from "../../lib/math/number";

export function scnIguanaDesigner() {
    Jukebox.play(Mzk.FirstSong);

    const { LightShadowIrregularSmall, Group1 } = Lvl.MenuIguanaDesigner();
    Group1.children.forEach(x => x.mixin(mxnBoilPivot));
    objUiIguanaDesignerRoot({ leftFacingPreviewPosition: LightShadowIrregularSmall }).show();

    const objs = new PseudoRng(69).shuffle([
        LightShadowIrregularSmall,
        ...Group1.children,
    ])
        .map(obj => obj.mixin(mxnFliesAway));

    // TODO should there be a "fiber" abstraction
    // so that you don't have to write container().coro().show() ?
    container().coro(function* () {
        while (true) {
            yield () => CtxUiIguanaDesigner.value.isViewingConfirmPage;
            for (let i = 0; i < objs.length; i++) {
                objs[i].isFlyingAway = true;
                if (i % 3 !== 2) {
                    yield sleepf(1);
                }
            }
            yield () => !CtxUiIguanaDesigner.value.isViewingConfirmPage;
            for (let i = objs.length - 1; i >= 0; i--) {
                objs[i].isFlyingAway = false;
                if (i % 3 !== 2) {
                    yield sleepf(1);
                }
            }
        }
    })
        .show();
}

function mxnFliesAway(obj: DisplayObject) {
    const y = obj.y;
    let virtualY = y;

    return obj.merge({ isFlyingAway: false })
        .step(self => {
            virtualY = approachLinear(virtualY, self.isFlyingAway ? -64 : y, 12);
            self.y = virtualY;
        });
}
