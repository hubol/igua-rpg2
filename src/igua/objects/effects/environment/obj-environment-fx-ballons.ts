import { Integer } from "../../../../lib/math/number-alias-types";
import { PseudoRng } from "../../../../lib/math/rng";
import { container } from "../../../../lib/pixi/container";
import { range } from "../../../../lib/range";
import { mxnBallonable } from "../../../mixins/mxn-ballonable";
import { RpgStatus } from "../../../rpg/rpg-status";

const prng = new PseudoRng();

export function objEnvironmentFxBallons(count: Integer, seed: Integer) {
    prng.seed = seed;
    const ballons = range(count)
        .map(() => prng.int(Number.MAX_SAFE_INTEGER))
        .map((seed): RpgStatus.Ballon => ({ health: 1, healthMax: 1, seed }));

    const obj = container();

    return obj.mixin(mxnBallonable, {
        attachPoint: obj,
        ballons,
    });
}
