import { Container } from "pixi.js";
import { AsshatTicker } from "./asshat-ticker";

export class TickerContainer extends Container {
    constructor(readonly _ticker: AsshatTicker, startTickingOnceAdded = true) {
        super();
        if (startTickingOnceAdded) {
            const tickFn = () => _ticker.tick();
            this.once('added', () => {
                const parent = this.parent;
                parent.ticker.add(tickFn);
                this.once('destroyed', () => parent.ticker.remove(tickFn));
            });
        }
    }

    destroy() {
        super.destroy();
        this._ticker.cancelMicrotasks();
    }
}
