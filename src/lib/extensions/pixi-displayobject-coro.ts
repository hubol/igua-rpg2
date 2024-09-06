import { DisplayObject } from "pixi.js";
import { CancellationToken } from "../promise/cancellation-token";
import { RoutineGenerator } from "../game-engine/routines/routine-generator";
import { Coro } from "../game-engine/routines/coro";

declare module "pixi.js" {
    interface DisplayObject {
        coro(fn: (self: this) => RoutineGenerator, order?: number): this;
    }
}

interface DisplayObjectPrivate {
    cancellationToken: CancellationToken;
}

Object.defineProperties(DisplayObject.prototype, {
    coro: {
        value: function (this: DisplayObject & DisplayObjectPrivate, generatorFn: (self: any) => RoutineGenerator, order = 0) {
            const generator = generatorFn(this);

            this.cancellationToken;

            this.ticker.add(
                Coro.runner.bind(null, generator, { predicate: null, done: false }),
                this,
                order);

            return this;
        },
        configurable: true,
    },
})

export default 0;