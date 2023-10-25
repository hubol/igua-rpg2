import { Container, DisplayObject } from "pixi.js";
import { AsshatTicker, IAsshatTicker } from "../game-engine/asshat-ticker";
import { LazyTicker, isLazyTicker } from "./lazy-ticker";

type StepFn = () => unknown;
type AsyncFn = () => Promise<unknown>;

declare module "pixi.js" {
    interface DisplayObject {
        readonly ticker: IAsshatTicker;
        step(fn: StepFn): this;
        async(fn: AsyncFn): this;
    }

    interface Container {
        withTicker(ticker: AsshatTicker): this;
    }
}

interface DisplayObjectPrivate {
    _ticker: IAsshatTicker;
}

Object.defineProperties(Container.prototype, {
    withTicker: {
        value: function (this: Container & DisplayObjectPrivate, ticker: AsshatTicker) {
            if (this._ticker) {
                if (isLazyTicker(this._ticker))
                    this._ticker.resolve(ticker);
                else
                    console.warn(`Multiple calls detected to withTicker. This may result in undefined behavior!`);
            }
            this._ticker = ticker;
            return this;
        },
        enumerable: false,
        configurable: true,
        writable: true,
    },
});

Object.defineProperties(DisplayObject.prototype, {
    ticker: {
        get: function (this: DisplayObject & DisplayObjectPrivate) {
            if (this._ticker)
                return this._ticker;

            if (this.parent) {
                const parentTicker = this.parent.ticker;

                if (isLazyTicker(parentTicker)) {
                    parentTicker.addReceiver(ticker => {
                        this._ticker = ticker;
                    });
                }

                return this._ticker = parentTicker;
            }

            return this._ticker = new LazyTicker(ticker => {
                this._ticker = ticker;
            });
        },
        enumerable: false,
        configurable: true,
    },
    step: {
        value: function (this: DisplayObject, stepFn: StepFn) {
            if (this.parent)
                this.ticker.add(stepFn);
            else
                this.on('added', () => this.ticker.add(stepFn));
            
            this.on('destroyed', () => this.ticker.remove(stepFn));
            return this;
        },
        enumerable: false,
        configurable: true,
        writable: true,
    },
})

export default 0;