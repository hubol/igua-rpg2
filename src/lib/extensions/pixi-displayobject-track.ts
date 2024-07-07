import { DisplayObject } from "pixi.js";
import { __InstancesInternalApi } from "../game-engine/instances";

declare module "pixi.js" {
    interface DisplayObject {
        track(sourceFn: (...args: any[]) => any): this;
    }
}

Object.defineProperties(DisplayObject.prototype, {
    track: {
        value: function (this: DisplayObject, sourceFn: (...args: any[]) => any) {
            if (!this.destroyed) {
                const trackedInstances = __InstancesInternalApi.TrackedInstancesSceneLocal.value;
                if (this.parent)
                    trackedInstances.add(sourceFn, this);
                else
                    this.once('added', () => trackedInstances.add(sourceFn, this));
                this.once('destroyed', () => trackedInstances.remove(sourceFn, this));
            }
            
            return this;
        }
    },
});
