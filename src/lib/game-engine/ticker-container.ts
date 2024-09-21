import { Container } from "pixi.js";
import { AsshatTicker } from "./asshat-ticker";

export class TickerContainer extends Container {
    constructor(readonly _ticker: AsshatTicker, startTickingOnceAdded = true) {
        super();
        if (startTickingOnceAdded) {
            const tickFn = () => _ticker.tick();
            this.once("added", () => {
                const parent = this.parent;
                // TODO sucks
                (this as any).cancellationToken;
                // TODO might want to specify order?
                parent.ticker.add(tickFn, this as any, 0);
            });
        }
    }

    destroy() {
        super.destroy();
    }
}
