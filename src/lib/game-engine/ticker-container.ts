import { Container } from "pixi.js";
import { AsshatTicker } from "./asshat-ticker";

export class TickerContainer extends Container {
    constructor(private readonly _ticker: AsshatTicker) {
        super();
    }

    destroy() {
        super.destroy();
        this._ticker.cancelMicrotasks();
    }
}
