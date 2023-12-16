import { Container, DisplayObject } from "pixi.js";
import { AsshatTicker, IAsshatTicker } from "../game-engine/asshat-ticker";
import { LazyTicker, isLazyTicker } from "./lazy-ticker";

type StepFn = () => unknown;

declare module "pixi.js" {
    interface DisplayObject {
        readonly ticker: IAsshatTicker;
        step(fn: StepFn): this;
    }

    interface Container {
        withTicker(ticker: AsshatTicker): this;
    }
}

interface DisplayObjectPrivate {
    _ticker: IAsshatTicker;
    _receiveResolvedTicker(ticker: AsshatTicker): void;
}

const _containerDestroy = Container.prototype.destroy;
const defaultContainerDestroyOptions = { children: true };

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
        configurable: true,
    },
    // Always destroy children
    // For now, don't support the other options
    // Because I have no idea what they do!
    destroy: {
        value: function (this: Container, options) {
            if (options !== undefined && options !== defaultContainerDestroyOptions)
                throw new Error(`Specifying options to Container.destroy() is not supported! Got: ${JSON.stringify(options)}`);
            _containerDestroy.call(this, defaultContainerDestroyOptions);
        },
        configurable: true,
    }
});

Object.defineProperties(DisplayObject.prototype, {
    ticker: {
        get: function (this: DisplayObject & DisplayObjectPrivate) {
            if (this._ticker)
                return this._ticker;

            if (this.parent) {
                const parentTicker = this.parent.ticker;

                if (isLazyTicker(parentTicker)) {
                    parentTicker.addReceiver(this);
                }

                return this._ticker = parentTicker;
            }

            return this._ticker = new LazyTicker(this);
        },
        configurable: true,
    },
    _receiveResolvedTicker: {
        value: function (this: DisplayObject & DisplayObjectPrivate, ticker: AsshatTicker) {
            this._ticker = ticker;
        },
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
        configurable: true,
    },
});

export default 0;