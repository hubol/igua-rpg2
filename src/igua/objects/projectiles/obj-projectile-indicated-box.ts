import { Graphics, LINE_CAP, LINE_JOIN } from "pixi.js";
import { interpv } from "../../../lib/game-engine/routines/interp";
import { sleep } from "../../../lib/game-engine/routines/sleep";
import { Integer } from "../../../lib/math/number-alias-types";
import { mxnDischargeable } from "../../mixins/mxn-dischargeable";

export function objProjectileIndicatedBox(width: Integer, height: Integer) {
    return new Graphics()
        .mixin(mxnDischargeable)
        .scaled(0, 0)
        .coro(function* (self) {
            const x = -Math.round(width / 2);
            const y = -Math.round(height / 2);

            const lineArgs = {
                alignment: 0,
                width: 4,
                color: 0xffffff,
                alpha: 1,
                cap: LINE_CAP.ROUND,
                join: LINE_JOIN.ROUND,
            };

            self
                .clear()
                .lineStyle(lineArgs)
                .drawRoundedRect(x, y, width, height, 8);

            yield interpv(self.scale).steps(3).to(1, 1).over(500);
            self.mxnDischargeable.charge();
            yield () => self.mxnDischargeable.isDischarged;

            self
                .clear()
                .lineStyle(lineArgs)
                .beginFill(0xffffff)
                .drawRoundedRect(x, y, width, height, 8);

            // TODO dischargeable needs to be reworked to allow this time to be configurable
            yield sleep(1000);
            self.destroy();
        });
}
