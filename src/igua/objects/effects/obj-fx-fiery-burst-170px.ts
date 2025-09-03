import { Sprite } from "pixi.js";
import { Tx } from "../../../assets/textures";
import { Rng } from "../../../lib/math/rng";
import { mxnDestroyAfterSteps } from "../../mixins/mxn-destroy-after-steps";
import { mxnMotion } from "../../mixins/mxn-motion";
import { objEphemeralSprite } from "../obj-ephemeral-sprite";
import { FxPattern } from "./lib/fx-pattern";

const txs = Tx.Effects.FieryBurst170px.split({ width: 170 });

export function objFxFieryBurst170px() {
    return objEphemeralSprite(txs, 0.125).anchored(93 / 170, 83 / 150).coro(function* (self) {
        yield () => self.index >= 1;
        for (const { position, normal } of FxPattern.getRadialBurst({ count: 6, radius: [24, 48] })) {
            objFxBoom().at(position).show(self).speed.at(normal, Rng.float(2, 4.5));
        }
    });
}

const boomTints = [
    0x6D2826,
    0xB72826,
    0xEA4E20,
    0xEAC220,
    0xffffff,
].reverse();

function objFxBoom() {
    return Sprite.from(Tx.Effects.BoomText).anchored(0.5, 0.5)
        .tinted(boomTints[0])
        .mixin(mxnDestroyAfterSteps, Rng.int(18, 40))
        .mixin(mxnMotion)
        .step(self => self.speed.scale(0.94))
        .coro(function* (self) {
            yield () => self.stepsUntilDestroyedAsUnit < 0.8;
            self.tint = boomTints[1];
            yield () => self.stepsUntilDestroyedAsUnit < 0.5;
            self.tint = boomTints[2];
            yield () => self.stepsUntilDestroyedAsUnit < 0.4;
            self.tint = boomTints[3];
            yield () => self.stepsUntilDestroyedAsUnit < 0.2;
            self.tint = boomTints[4];
        });
}
