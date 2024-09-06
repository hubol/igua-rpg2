import { DisplayObject } from "pixi.js";
import { CancellationToken } from "../promise/cancellation-token";
import { RoutineGenerator } from "../generators/routine-generator";

declare module "pixi.js" {
    interface DisplayObject {
        async(fn: (self: this) => RoutineGenerator, order?: number): this;
    }
}

interface DisplayObjectPrivate {
    cancellationToken: CancellationToken;
}

Object.defineProperties(DisplayObject.prototype, {
    async: {
        value: function (this: DisplayObject & DisplayObjectPrivate, generatorFn: (self: any) => RoutineGenerator, order = 0) {
            const generator = generatorFn(this);

            this.cancellationToken;

            let done = false;
            this.ticker.add(() => {
                if (done)
                    return;
                if (generator.next().done)
                    done = true;
            }, this, order);

            return this;
        },
        configurable: true,
    },
})

export default 0;