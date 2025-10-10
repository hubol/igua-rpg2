import { Graphics, Sprite } from "pixi.js";
import { Tx } from "../../../assets/textures";
import { factor, interp, interpvr } from "../../../lib/game-engine/routines/interp";
import { RgbInt } from "../../../lib/math/number-alias-types";
import { Rng } from "../../../lib/math/rng";
import { VectorSimple } from "../../../lib/math/vector-type";
import { container } from "../../../lib/pixi/container";
import { MapRgbFilter } from "../../../lib/pixi/filters/map-rgb-filter";
import { Empty } from "../../../lib/types/empty";
import { mxnBoilFlipH } from "../../mixins/mxn-boil-flip-h";
import { objDieOnEmpty } from "../utils/obj-die-on-empty";
import { objFxSpiritualRelease } from "./obj-fx-spiritual-release";

interface ObjFxEnemyDefeatArgs {
    map: MapRgbFilter.Map;
}

export function objFxEnemyDefeat(args: ObjFxEnemyDefeatArgs) {
    return objDieOnEmpty(
        objFxSpiritualRelease.objBurst({ tints: args.map }),
        objFxSpiritPresence(args),
    );
}

const [txPresenceBody, ...txsPresenceFace] = Tx.Enemy.Spirit.Presence.split({ count: 3 });

function objFxSpiritPresence(args: ObjFxEnemyDefeatArgs) {
    const gfx = new Graphics();
    const characterObj = container(Sprite.from(txPresenceBody), Sprite.from(Rng.choose(...txsPresenceFace)))
        .pivoted(21, 26)
        .mixin(mxnBoilFlipH)
        .filtered(new MapRgbFilter(...args.map));

    const points = Empty<VectorSimple>();

    const primaryTint = args.map[0];

    return container(
        gfx,
        characterObj,
    )
        .coro(function* (self) {
            for (let i = 0; i < 25; i++) {
                const ms = 90 + i * 5;
                const x = Rng.intc(-6 - i, 6 + i);
                const y = -Rng.intc(4) - i * 2;
                const mode = Rng.int(3);
                if (mode === 0) {
                    yield interpvr(characterObj).translate(x, y).over(ms);
                }
                else if (mode === 1) {
                    yield interpvr(characterObj).steps(Rng.intc(2, 4)).translate(x, y).over(ms);
                }
                else if (mode === 2) {
                    yield interpvr(characterObj).factor(factor.sine).translate(x, y).over(ms);
                }

                points.push(characterObj.vcpy());
                gfx.clear().lineStyle(1, primaryTint).moveTo(0, 0);

                for (let i = 0; i < points.length; i++) {
                    const { x, y } = points[i];
                    if (i === 8) {
                        gfx.lineStyle(2, primaryTint);
                    }
                    else if (i === 14) {
                        gfx.lineStyle(3, primaryTint);
                    }

                    gfx.lineTo(x, y);
                }
            }
            yield interp(self, "alpha").steps(3).to(0).over(1000);
            self.destroy();
        });
}
