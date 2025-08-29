import { DisplayObject } from "pixi.js";
import { VectorSimple, vnew } from "../../lib/math/vector-type";
import { Empty } from "../../lib/types/empty";

interface MxnFacingPivotArgs {
    left: number;
    right: number;
    up: number;
    down: number;
}

const v = vnew();

export function mxnFacingPivot(obj: DisplayObject, args: MxnFacingPivotArgs) {
    const restPivot = vnew(obj.pivot);

    return obj
        .merge({
            polarOffsets: Empty<VectorSimple>(),
        })
        .coro(function* () {
            // Paranoid, but whatever
            restPivot.at(obj.pivot);
        })
        .step((self) => {
            for (let i = self.polarOffsets.length - 1; i >= 0; i--) {
                const polar = self.polarOffsets[i];
                if (polar) {
                    self.pivot.at(restPivot).add(lerpPosition(args, polar), -1);
                    break;
                }
            }
        });
}

function lerpPosition(args: MxnFacingPivotArgs, polar: VectorSimple) {
    return v.at(
        polar.x > 0 ? args.right : args.left,
        polar.y > 0 ? args.down : args.up,
    )
        .scale(Math.abs(polar.x), Math.abs(polar.y))
        .vround();
}

export type MxnFacingPivot = ReturnType<typeof mxnFacingPivot>;
