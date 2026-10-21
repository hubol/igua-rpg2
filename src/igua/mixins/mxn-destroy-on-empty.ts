import { Container } from "pixi.js";
import { holdf } from "../../lib/game-engine/routines/hold";
import { StepOrder } from "../objects/step-order";

export function mxnDestroyOnEmpty(obj: Container) {
    return obj.coro(
        function* (self) {
            // Particularly neurotic implementation
            yield holdf(() => self.children.length === 0, 3);
            self.destroy();
        },
        StepOrder.BeforeCamera,
    );
}
