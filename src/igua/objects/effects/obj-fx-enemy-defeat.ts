import { Geometry, Graphics, Polygon, Sprite } from "pixi.js";
import { Tx } from "../../../assets/textures";
import { factor, interp, interpvr } from "../../../lib/game-engine/routines/interp";
import { RgbInt } from "../../../lib/math/number-alias-types";
import { Rng } from "../../../lib/math/rng";
import { VectorSimple } from "../../../lib/math/vector-type";
import { container } from "../../../lib/pixi/container";
import { MapRgbFilter } from "../../../lib/pixi/filters/map-rgb-filter";
import { range } from "../../../lib/range";
import { Empty } from "../../../lib/types/empty";
import { Null } from "../../../lib/types/null";
import { objFxSpiritualRelease } from "./obj-fx-spiritual-release";

interface ObjFxEnemyDefeatArgs {
    primaryTint: RgbInt;
    secondaryTint: RgbInt;
    tertiaryTint: RgbInt;
}

export function objFxEnemyDefeat(args: ObjFxEnemyDefeatArgs) {
    return container(
        objFxSpiritualRelease().tinted(Rng.choose(args.primaryTint, args.secondaryTint, args.tertiaryTint))
            .scaled(-1, 1),
        objFxSpiritualRelease().tinted(Rng.choose(args.primaryTint, args.secondaryTint, args.tertiaryTint))
            .scaled(1, 1)
            .angled(-90),
        objFxSpiritualRelease().tinted(Rng.choose(args.primaryTint, args.secondaryTint, args.tertiaryTint))
            .scaled(-1, -1),
        objFxSpiritualRelease().tinted(Rng.choose(args.primaryTint, args.secondaryTint, args.tertiaryTint))
            .scaled(1, 1),
        objFxSpiritPresence(args),
    )
        .step(self => {
            if (self.children.length === 0) {
                self.destroy();
            }
        });
}

const [txPresenceBody, ...txsPresenceFace] = Tx.Enemy.Spirit.Presence.split({ count: 3 });

function objFxSpiritPresence(args: ObjFxEnemyDefeatArgs) {
    const gfx = new Graphics();
    const characterObj = container(Sprite.from(txPresenceBody), Sprite.from(Rng.choose(...txsPresenceFace)))
        .pivoted(21, 26)
        .filtered(new MapRgbFilter(args.primaryTint, args.secondaryTint, args.tertiaryTint));

    const points = Empty<VectorSimple>();

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
                gfx.clear().lineStyle(1, args.primaryTint).moveTo(0, 0);

                for (let i = 0; i < points.length; i++) {
                    const { x, y } = points[i];
                    if (i === 8) {
                        gfx.lineStyle(2, args.primaryTint);
                    }
                    else if (i === 14) {
                        gfx.lineStyle(3, args.primaryTint);
                    }

                    gfx.lineTo(x, y);
                }
            }
            yield interp(self, "alpha").steps(3).to(0).over(1000);
            self.destroy();
        });
}
