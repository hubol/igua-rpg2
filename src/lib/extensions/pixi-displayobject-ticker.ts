import { Container, DisplayObject } from "pixi.js";
import { AsshatTicker, IAsshatTicker } from "../game-engine/asshat-ticker";
import { LazyTicker, isLazyTicker } from "./lazy-ticker";

type StepFn = () => unknown;

declare module "pixi.js" {
    interface DisplayObject {
        readonly ticker: IAsshatTicker;
        step(fn: StepFn): this;
    }
}

interface DisplayObjectPrivate {
    _ticker?: IAsshatTicker;
    _receiveResolvedTicker(ticker: AsshatTicker): void;
}

const _container_destroy = Container.prototype.destroy;
const defaultContainerDestroyOptions = { children: true };

Object.defineProperties(Container.prototype, {
    // Always destroy children
    // For now, don't support the other options
    // Because I have no idea what they do!
    destroy: {
        value: function (this: Container, options) {
            if (options !== undefined && options !== defaultContainerDestroyOptions)
                throw new Error(`Specifying options to Container.destroy() is not supported! Got: ${JSON.stringify(options)}`);
            _container_destroy.call(this, defaultContainerDestroyOptions);
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
                    return parentTicker;
                }

                return this._ticker = parentTicker;
            }

            const lazyTicker = new LazyTicker(this);
            this.once('added', () => {
                const parentTicker = this.parent.ticker;
                if (isLazyTicker(parentTicker)) {
                    if (!isLazyTicker(this._ticker)) {
                        throw new Error('Expected a LazyTicker, but got something else!');
                    }

                    parentTicker.push(this._ticker);
                    parentTicker.addReceiver(this);
                    this._ticker = parentTicker;
                }
                else {
                    lazyTicker.resolve(parentTicker as AsshatTicker);
                }
            });
            return this._ticker = lazyTicker;
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
            this.ticker.add(stepFn);
            this.once('destroyed', () => this.ticker.remove(stepFn));
            return this;
        },
        configurable: true,
    },
});

export default 0;