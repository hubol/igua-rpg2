import { DisplayObject } from "pixi.js";
import { Lvl } from "../../assets/generated/levels/generated-level-data";
import { Mzk } from "../../assets/music";
import { sleepf } from "../../lib/game-engine/routines/sleep";
import { approachLinear } from "../../lib/math/number";
import { PseudoRng } from "../../lib/math/rng";
import { Jukebox } from "../core/igua-audio";
import { scene } from "../globals";
import { mxnBoilPivot } from "../mixins/mxn-boil-pivot";
import { CtxUiIguanaDesigner, objUiIguanaDesignerRoot } from "../ui/iguana-designer/obj-ui-iguana-designer-root";

export function scnIguanaDesigner() {
    Jukebox.play(Mzk.FirstSong);

    const { LightShadowIrregularSmall, ThoughtBubbleGroup } = Lvl.MenuIguanaDesigner();
    ThoughtBubbleGroup.children.forEach(x => x.mixin(mxnBoilPivot));
    objUiIguanaDesignerRoot({ leftFacingPreviewPosition: LightShadowIrregularSmall }).show();

    const rng = new PseudoRng(69);
    const objs = rng.shuffle([
        LightShadowIrregularSmall,
        ...ThoughtBubbleGroup.children,
    ])
        .map(obj => obj.mixin(mxnHides, rng));

    scene.stage.coro(function* () {
        while (true) {
            yield () => CtxUiIguanaDesigner.value.isViewingConfirmPage;
            for (let i = 0; i < objs.length; i++) {
                objs[i].isHiding = true;
                if (i % 3 !== 2) {
                    yield sleepf(1);
                }
            }
            yield () => !CtxUiIguanaDesigner.value.isViewingConfirmPage;
            for (let i = objs.length - 1; i >= 0; i--) {
                objs[i].isHiding = false;
                if (i % 3 !== 2) {
                    yield sleepf(1);
                }
            }
        }
    });
}

function mxnHides(obj: DisplayObject, rng: PseudoRng) {
    const scale = obj.scale.vcpy();
    let factor = 1;
    const delta = rng.float(0.05, .15);
    const resolution = rng.intc(2, 32);

    return obj.merge({ isHiding: false })
        .step(self => {
            factor = approachLinear(factor, self.isHiding ? 0 : 1, delta);
            const r = Math.round(factor * resolution) / resolution;
            self.scale.set(scale.x * r, scale.y * r);
        });
}
