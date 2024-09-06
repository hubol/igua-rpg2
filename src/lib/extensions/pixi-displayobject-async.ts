import { DisplayObject } from "pixi.js";
import { CancellationToken } from "../promise/cancellation-token";
import { RoutineGenerator, RoutinePredicate } from "../generators/routine-generator";

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
            let predicate: RoutinePredicate | null = null;

            this.ticker.add(() => {
                if (done)
                    return;

                if (predicate === null) {
                    const next = generator.next();
                    if (next.done) {
                        done = true;
                        return;
                    }
                    
                    predicate = next.value as RoutinePredicate;
                }

                if (predicate())
                    predicate = null;
            }, this, order);

            return this;
        },
        configurable: true,
    },
})

export default 0;