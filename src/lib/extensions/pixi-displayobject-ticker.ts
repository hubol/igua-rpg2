import { Container, DisplayObject } from "pixi.js";
import { AsshatTicker } from "../game-engine/asshat-ticker";

type StepFn = () => unknown;
type AsyncFn = () => Promise<unknown>;

declare module "pixi.js" {
    interface DisplayObject {
        readonly ticker: AsshatTicker;
        step(fn: StepFn): this;
        async(fn: AsyncFn): this;
    }

    interface Container {
        withTicker(ticker: AsshatTicker): this;
    }
}

Object.defineProperties(Container.prototype, {
    withTicker: {
        value: function (ticker: AsshatTicker) {
            this.ticker = ticker;
            return this;
        },
        enumerable: false,
        configurable: true,
        writable: true,
    },
})

export default 0;