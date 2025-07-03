import { Container } from "pixi.js";
import { AsshatTaskContext, AsshatTicker } from "./asshat-ticker";

export class TickerContainer extends Container {
    constructor(readonly _ticker: AsshatTicker, startTickingOnceAdded = true, stepOrder = 0) {
        super();
        if (startTickingOnceAdded) {
            const tickFn = () => _ticker.tick();
            this.once("added", () => {
                const parent = this.parent;
                // TODO sucks
                (this as any).cancellationToken;
                // TODO might want to specify order?
                parent.ticker.add({
                    fn: tickFn,
                    context: this as unknown as AsshatTaskContext,
                }, stepOrder);
            });
        }
    }

    destroy() {
        super.destroy();
    }
}
