import { interpvr } from "../../../lib/game-engine/routines/interp";
import { sleepf } from "../../../lib/game-engine/routines/sleep";
import { Rng } from "../../../lib/math/rng";
import { vnew } from "../../../lib/math/vector-type";
import { objDieOnEmpty } from "../utils/obj-die-on-empty";
import { FxPattern } from "./lib/fx-pattern";
import { objFxAsterisk16Px } from "./obj-fx-asterisk-16px";

export function objFxFormativeBurst(tint = 0xffffff) {
    return objDieOnEmpty()
        .coro(function* (self) {
            for (const { normal, position } of FxPattern.getRadialBurst({ count: 16, radius: [60, 70] })) {
                objFxAsterisk16Px()
                    .at(position)
                    .coro(function* (self) {
                        yield interpvr(self).to(vnew(normal).scale(0.2, 0.2)).over(Rng.float(500, 750));
                    })
                    .tinted(tint)
                    .show(self);
                yield sleepf(1);
            }
        });
}
