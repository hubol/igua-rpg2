import { Container } from "pixi.js";
import { AsshatTicker } from "./asshat-ticker";

export class TickerContainer extends Container {
    constructor(private readonly _ticker: AsshatTicker, startTickingOnceAdded = true) {
        super();
        if (startTickingOnceAdded)
            this.once('added', () => this.parent.ticker.add(() => _ticker.tick()));
    }

    destroy() {
        super.destroy();
        this._ticker.cancelMicrotasks();
    }
}
