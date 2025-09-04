import { DisplayObject } from "pixi.js";
import { holdf } from "../../../lib/game-engine/routines/hold";
import { container } from "../../../lib/pixi/container";
import { StepOrder } from "../step-order";

export function objDieOnEmpty(...children: DisplayObject[]) {
    return container(...children)
        .coro(function* (self) {
            // Particularly neurotic implementation
            yield holdf(() => self.children.length === 0, 3);
            self.destroy();
        }, StepOrder.BeforeCamera);
}
