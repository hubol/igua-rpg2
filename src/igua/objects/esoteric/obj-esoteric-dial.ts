import { Graphics, Sprite } from "pixi.js";
import { Tx } from "../../../assets/textures";
import { approachLinear } from "../../../lib/math/number";
import { Integer, Unit } from "../../../lib/math/number-alias-types";
import { container } from "../../../lib/pixi/container";
import { mxnInteract } from "../../mixins/mxn-interact";

interface ObjEsotericDialArgs {
    maxTicks: Integer;
}

const [txDial, txDialArrows] = Tx.Esoteric.Dial.split({ count: 2 });

const consts = {
    maxSubticks: 20,
};

export function objEsotericDial(args: ObjEsotericDialArgs) {
    let ticks = 0;
    let subticks = 0;

    const api = {
        get ticks() {
            return ticks;
        },
        get remainingTicksUnit(): Unit {
            return ticks / args.maxTicks;
        },
    };

    const leverObj = new Graphics()
        .beginFill(0x404069)
        .drawRect(0, -1, 7, 1)
        .scaled(1, 0)
        .at(-3, 4);

    const dialArrowsObj = Sprite.from(txDialArrows)
        .anchored(0.5, 0.5);

    const dialObj = Sprite.from(txDial)
        .anchored(0.5, 0.5)
        .mixin(mxnInteract, () => {
            // TODO sfx
            ticks = args.maxTicks;
            subticks = consts.maxSubticks;
        })
        .step(self => {
            if (ticks > 0 && --subticks <= 0) {
                // TODO sfx
                subticks = consts.maxSubticks;
                ticks -= 1;
            }

            const rawAngle = (ticks / args.maxTicks) * 360;
            const roundedAngle = Math.round(rawAngle / 45) * 45;
            dialArrowsObj.angle = approachLinear(dialArrowsObj.angle, roundedAngle, 10);
            leverObj.scale.y = approachLinear(leverObj.scale.y, Math.ceil((ticks / args.maxTicks) * 64), 8);
            self.interact.enabled = ticks <= Math.max(args.maxTicks - 3, 0);
        });

    return container(
        leverObj,
        dialObj,
        dialArrowsObj,
    )
        .merge({ objEsotericDial: api });
}
