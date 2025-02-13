import { Sprite } from "pixi.js";
import { Tx } from "../../../assets/textures";
import { objEphemeralSprite } from "../obj-ephemeral-sprite";
import { mxnDestroyAfterSteps } from "../../mixins/mxn-destroy-after-steps";
import { Rng } from "../../../lib/math/rng";
import { mxnMotion } from "../../mixins/mxn-motion";
import { vdeg } from "../../../lib/math/angle";

const txs = Tx.Effects.FieryBurst170px.split({ width: 170 });

export function objFxFieryBurst170px() {
    // TODO sfx
    return objEphemeralSprite(txs, 0.125).anchored(93 / 170, 83 / 150).coro(function* (self) {
        yield () => self.index >= 1;
        const offset = Rng.float(360);
        for (let i = 0; i < 6; i += 1) {
            const v = vdeg(offset + i * 55);
            const boomObj = objFxBoom().at(self).add(v, Rng.float(24, 48)).show(self.parent);
            boomObj.speed.at(v).scale(Rng.float(2, 4.5));
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
