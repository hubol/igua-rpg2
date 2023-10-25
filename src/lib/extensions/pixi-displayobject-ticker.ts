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
            this._ticker = ticker;
            return this;
        },
        enumerable: false,
        configurable: true,
        writable: true,
    },
});

type DisplayObjectProperties = Record<keyof DisplayObject, PropertyDescriptor & ThisType<DisplayObject & Record<string, any>>>
Object.defineProperties(DisplayObject.prototype, <DisplayObjectProperties>{
    ticker: {
        get: function () {
            if (this._ticker)
                return this._ticker;

            if (this.parent?.ticker)
                return this._ticker = this.parent.ticker;
        },
        enumerable: false,
        configurable: true,
    },
    step: {
        value: function (stepFn: StepFn) {
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