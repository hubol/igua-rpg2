import { Sprite } from "pixi.js";
import { Tx } from "../../../assets/textures";
import { Rng } from "../../../lib/math/rng";
import { sleepf } from "../../../lib/game-engine/routines/sleep";

export function objFxBurst32() {
    return Sprite.from(Tx.Effects.Burst32).anchored(0.5, 0.5).coro(function* (self) {
        self.scale.x = Rng.intp();
        self.scale.y = Rng.intp();
        self.angle = Rng.int(0, 1) * 180;
        yield sleepf(5);
        self.y -= 2;
        yield sleepf(7);
        self.destroy();
    });
}
