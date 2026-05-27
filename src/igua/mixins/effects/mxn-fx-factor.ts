import { DisplayObject } from "pixi.js";
import { factor, interp } from "../../../lib/game-engine/routines/interp";
import { Integer, Unit } from "../../../lib/math/number-alias-types";

interface MxnFxFactorArgs {
    factor: Unit;
}

export function mxnFxFactor(obj: DisplayObject, args: MxnFxFactorArgs) {
    const api = {
        get factor() {
            return args.factor;
        },
        set factor(value) {
            args.factor = value;
        },
        play(durationMs: Integer, factorFn = factor.linear) {
            return obj
                .coro(function* () {
                    yield interp(args, "factor").factor(factorFn).to(1).over(durationMs);
                    obj.destroy();
                });
        },
    };

    return obj
        .merge({ mxnFxFactor: api });
}
