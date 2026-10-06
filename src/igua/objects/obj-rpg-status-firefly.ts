import { Container, Rectangle } from "pixi.js";
import { approachLinear } from "../../lib/math/number";
import { Integer } from "../../lib/math/number-alias-types";
import { vnew } from "../../lib/math/vector-type";
import { objIguanaPuppet } from "../iguana/obj-iguana-puppet";
import { objCharacterFirefly } from "./characters/obj-character-firefly";
import { StepOrder } from "./step-order";

const v = vnew();
const r = new Rectangle();

export function objRpgStatusFirefly(targetObj: Container, index: Integer) {
    const api = {
        isFleeing: false,
        index,
    };

    const previousTargetPosition = targetObj.vcpy();
    let targetApproachDistance = 0;

    const targetVectorProvider = getTargetVectorProvider(targetObj, api);

    return objCharacterFirefly()
        .merge({ objRpgStatusFirefly: api })
        .step(() => {
            if (api.isFleeing) {
                return;
            }
            const observedTargetSpeed = v.at(targetObj).add(previousTargetPosition, -1);
            targetApproachDistance = approachLinear(
                targetApproachDistance,
                observedTargetSpeed.vlength + 1,
                observedTargetSpeed.vlength / 2 + 1,
            );
            previousTargetPosition.at(targetObj);
        }, StepOrder.Camera)
        .step((self) => {
            if (api.isFleeing) {
                self.y -= 4;
                if (self.getBounds(true, r).bottom < 0) {
                    self.destroy();
                }
                return;
            }

            self.moveTowards(targetVectorProvider(), targetApproachDistance);
        }, StepOrder.Camera)
        .at(targetVectorProvider());
}

export namespace objRpgStatusFirefly {
    export type Type = ReturnType<typeof objRpgStatusFirefly>;
}

function getTargetVectorProvider(targetObj: Container, indexRef: { index: Integer }) {
    const v = vnew();

    if (targetObj.is(objIguanaPuppet)) {
        return () => {
            if (targetObj.destroyed) {
                return v;
            }

            return v
                .at(targetObj)
                .add(targetObj.facing * -(32 + 22 * indexRef.index), -24)
                .vround();
        };
    }

    return () => {
        if (targetObj.destroyed) {
            return v;
        }

        const bounds = targetObj.getWorldBounds();
        return v.at(bounds.right + 22 * indexRef.index, bounds.top + 14);
    };
}
