import { container } from "../../../lib/pixi/container";
import { StepOrder } from "../step-order";

export function objDieOnEmpty() {
    return container()
        .step(self => {
            if (self.children.length === 0) {
                self.destroy();
            }
        }, StepOrder.BeforeCamera);
}
