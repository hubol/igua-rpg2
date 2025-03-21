import { Graphics } from "pixi.js";
import { Sfx } from "../../../assets/sounds";
import { holdf } from "../../../lib/game-engine/routines/hold";
import { interpr } from "../../../lib/game-engine/routines/interp";
import { sleepf } from "../../../lib/game-engine/routines/sleep";
import { PseudoRng, Rng } from "../../../lib/math/rng";
import { container } from "../../../lib/pixi/container";
import { mxnBoilSeed } from "../../mixins/mxn-boil-seed";
import { mxnDischargeable } from "../../mixins/mxn-dischargeable";
import { mxnPhysics } from "../../mixins/mxn-physics";

const prng = new PseudoRng();

export function objProjectileElectricalPulseGround(initialHeight: number) {
    const internalState = {
        height: initialHeight,
    };

    const obj = container()
        .mixin(mxnPhysics, { gravity: 0.2, physicsRadius: 12, physicsOffset: [0, -12] })
        .mixin(mxnDischargeable)
        .coro(function* (self) {
            // TODO anytime I'm doing this, this is probably a bug hahahah
            yield sleepf(2);
            self.play(Sfx.Effect.ElectricPulseGroundAppear.rate(0.9, 1.1));
        })
        .coro(function* (self) {
            yield holdf(() => self.isOnGround, 2);
            yield interpr(internalState, "height").to(0).over(500);
            self.mxnDischargeable.charge();
            yield () => self.mxnDischargeable.isDischarged;
            self.play(Sfx.Effect.ElectricPulseGroundDischarge.rate(0.9, 1.1));
            self.speed.x = 0;
            yield interpr(internalState, "height").to(64).over(250);
            self.destroy();
        });

    const segments = 16;

    new Graphics()
        .at(0, 4)
        .merge({ seed: Rng.intc(8_000_000, 16_000_000) })
        .mixin(mxnBoilSeed, 100)
        .step(self => {
            prng.seed = self.seed;

            self.clear();

            const iterations = prng.intc(1, 2);
            for (let i = 0; i < iterations; i++) {
                self.lineStyle(1, prng.choose(0x00ffff, 0xffff00));
                if (internalState.height > 0) {
                    self.moveTo(0, 0);
                    const dy = -Math.floor(internalState.height / segments);
                    for (let i = 0; i < segments; i++) {
                        const isLast = i === segments - 1;
                        self.lineTo(prng.intc(-8, 8), isLast ? -internalState.height : dy * i);
                    }
                }
                else {
                    self.moveTo(8, 0);
                    for (let i = 0; i < 8; i++) {
                        self.lineTo(8 - 2 * i, prng.intc(-4, 4));
                    }
                }
            }
        })
        .show(obj);

    return obj;
}
