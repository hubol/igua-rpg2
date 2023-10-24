import { DisplayObject } from "pixi.js";
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

export default 0;