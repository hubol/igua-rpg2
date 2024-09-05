import { BLEND_MODES, Container, Graphics } from "pixi.js";
import { Undefined } from "../../../lib/types/undefined";
import { lerp } from "../../../lib/game-engine/promise/lerp";
import { renderer } from "../../globals";

export function objSolidOverlay() {
    let dirty = true;
    let container = Undefined<Container>();

    function fade(value: number, ms: number) {
        container?.destroy();
        container = new Container().async(async c => {
            dirty = true;
            await lerp(g, 'alpha').to(value).over(ms);
            c.destroy();
            console.log('c.destroy()');
        })
        .show(g);
        return new Promise<void>(r => container!.once('destroyed', r));
    }

    const g = new Graphics()
        .step(() => {
            if (dirty && g.alpha === 0) {
                g.blendMode = BLEND_MODES.NORMAL;
                g.tint = 0xffffff;
                // REPORTME: It seems like mesh needs to be modified for Pixi to
                // pick up the change with blend modes / tint?
                g.clear().beginFill(0xffffff).drawRect(0, 0, renderer.width, renderer.height);
                dirty = false;
            }
        })
        .merge({
            fadeIn(ms: number) {
                return fade(1, ms);
            },
            fadeOut(ms: number) {
                return fade(0, ms);
            },
        });

    g.alpha = 0;

    return g;
}

export type ObjSolidOverlay = ReturnType<typeof objSolidOverlay>;