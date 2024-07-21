import { ErrorReporter } from "./error-reporter";
import { SceneLocal } from "./scene-local";

type Fn = (...args: any[]) => any;

export function Instances<TFn extends Fn>(fn: TFn): ReturnType<TFn>[] {
    return _Internal_Instances.TrackedInstancesSceneLocal.value.get(fn) as any;
}

export namespace _Internal_Instances {
    export const TrackedInstancesSceneLocal = new SceneLocal(() => new TrackedInstances(), `TrackedInstances`);
}

class TrackedInstances {
    private readonly _map = new Map<Fn, unknown[]>();

    get(fn: Fn) {
        let list = this._map.get(fn);
        if (!list) {
            list = [];
            this._map.set(fn, list);
        }
        return list;
    }

    add(fn: Fn, instance: unknown) {
        this.get(fn).push(instance);
    }

    remove(fn: Fn, instance: unknown) {
        const list = this._map.get(fn);
        if (list) {
            for (let i = 0; i < list.length; i++) {
                if (list[i] === instance) {
                    list.splice(i, 1);
                    return;
                }
            }
        }
        // TODO not sure if this is really an error
        ErrorReporter.reportSubsystemError(`TrackedInstances.remove`, `Failed to remove instance!`, { fn, instance });
    }
}