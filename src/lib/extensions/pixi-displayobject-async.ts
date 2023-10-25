import { DisplayObject } from "pixi.js";
import { CancellationToken } from "../promise/cancellation-token";
import { AsshatZone } from "../game-engine/asshat-zone";

type AsyncFn = () => Promise<unknown>;

declare module "pixi.js" {
    interface DisplayObject {
        async(fn: AsyncFn): this;
    }
}

interface DisplayObjectPrivate {
    cancellationToken: CancellationToken;
}

Object.defineProperties(DisplayObject.prototype, {
    async: {
        value: function (this: DisplayObject & DisplayObjectPrivate, asyncFn: AsyncFn) {
            if (!this.cancellationToken)
                this.cancellationToken = new CancellationToken();

            // // TODO maybe instead of implicitly waiting on parent, wait on ticker
            if (this.parent)
                AsshatZone.run(asyncFn, this);
            else
                this.on('added', () => AsshatZone.run(asyncFn, this));
            
            this.on('destroyed', () => this.cancellationToken.cancel());

            return this;
        },
        enumerable: false,
        configurable: true,
        writable: true,
    },
})

export default 0;