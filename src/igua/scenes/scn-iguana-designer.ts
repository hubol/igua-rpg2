import { Lvl } from "../../assets/generated/levels/generated-level-data";
import { sleepf } from "../../lib/game-engine/routines/sleep";
import { PseudoRng } from "../../lib/math/rng";
import { container } from "../../lib/pixi/container";
import { mxnBoilPivot } from "../mixins/mxn-boil-pivot";
import { CtxUiIguanaDesigner, objUiIguanaDesignerRoot } from "../ui/iguana-designer/obj-ui-iguana-designer-root";

export function scnIguanaDesigner() {
    const { LightShadowIrregularSmall, Group1 } = Lvl.MenuIguanaDesigner();
    Group1.children.forEach(x => x.mixin(mxnBoilPivot));
    objUiIguanaDesignerRoot({ leftFacingPreviewPosition: LightShadowIrregularSmall }).show();

    const objs = new PseudoRng(69).shuffle([
        LightShadowIrregularSmall,
        ...Group1.children,
    ]);

    // TODO should there be a "fiber" abstraction
    // so that you don't have to write container().coro().show() ?
    container().coro(function* () {
        while (true) {
            yield () => CtxUiIguanaDesigner.value.isViewingConfirmPage;
            for (let i = 0; i < objs.length; i++) {
                objs[i].visible = false;
                if (i % 3 !== 2) {
                    yield sleepf(1);
                }
            }
            yield () => !CtxUiIguanaDesigner.value.isViewingConfirmPage;
            for (let i = objs.length - 1; i >= 0; i--) {
                objs[i].visible = true;
                if (i % 3 !== 2) {
                    yield sleepf(1);
                }
            }
        }
    })
        .show();
}
