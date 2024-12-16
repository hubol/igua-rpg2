import { BLEND_MODES, Container, Graphics } from "pixi.js";
import { Undefined } from "../../../lib/types/undefined";
import { interp } from "../../../lib/game-engine/routines/interp";
import { renderer } from "../../current-pixi-renderer";
import { Coro } from "../../../lib/game-engine/routines/coro";

export function objSolidOverlay() {
    let container = Undefined<Container>();

    function fade(value: number, ms: number) {
        return Coro.resolve(r => {
            container?.destroy();
            container = new Container().coro(function* (c) {
                g.clear().beginFill(0xffffff).drawRect(0, 0, renderer.width, renderer.height);

                yield interp(g, "alpha").to(value).over(ms);
                c.destroy();

                if (value === 0) {
                    g.blendMode = BLEND_MODES.NORMAL;
                    g.tint = 0xffffff;
                }
            })
                .on("destroyed", r)
                .show(g);
        });
    }

    const g = new Graphics()
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
