import { DisplayObject } from "pixi.js";
import { CancellationToken } from "../promise/cancellation-token";
import { AsshatZone } from "../game-engine/asshat-zone";

declare module "pixi.js" {
    interface DisplayObject {
        async(fn: (self: this) => Promise<unknown>): this;
    }
}

interface DisplayObjectPrivate {
    cancellationToken: CancellationToken;
}

Object.defineProperties(DisplayObject.prototype, {
    async: {
        value: function (this: DisplayObject & DisplayObjectPrivate, asyncFn: (self?: any, c?: any) => unknown) {
            if (asyncFn.length)
                asyncFn = asyncFn.bind(null, this, this);

            this.cancellationToken;

            // // TODO maybe instead of implicitly waiting on parent, wait on ticker
            if (this.parent)
                AsshatZone.run(asyncFn, this);
            else
                this.on('added', () => AsshatZone.run(asyncFn, this));

            return this;
        },
        configurable: true,
    },
})

export default 0;