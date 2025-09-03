import { holdf } from "../../../lib/game-engine/routines/hold";
import { container } from "../../../lib/pixi/container";
import { StepOrder } from "../step-order";

export function objDieOnEmpty() {
    return container()
        .coro(function* (self) {
            // Particularly neurotic implementation
            yield holdf(() => self.children.length === 0, 3);
            self.destroy();
        }, StepOrder.BeforeCamera);
}
