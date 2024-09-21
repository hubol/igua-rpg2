import { DisplayObject } from "pixi.js";
import { SceneLocal } from "./scene-local";

type Fn = (...args: any[]) => any;

const filteredItems: any[] = [];

/**
 * Utility for finding game objects that called `.track()` with the specified function `fn`.
 *
 * `Instances()` makes the guarantee that, once called, it will contain the latest tracked objects
 * and it will not contain any destroyed objects.
 *
 * However, if while iterating the list, you destroy game objects in the list;
 * they will continue to exist in the list.
 */
export function Instances<TFn extends Fn>(fn: TFn): ReturnType<TFn>[];
export function Instances<TFn extends Fn>(fn: TFn, filter: (item: ReturnType<TFn>) => boolean): ReturnType<TFn>[];
export function Instances<TFn extends Fn>(fn: TFn, filter?: (item: ReturnType<TFn>) => boolean): ReturnType<TFn>[] {
    const items = _Internal_Instances.TrackedInstancesSceneLocal.value.get(fn).array();
    if (!filter) {
        return items as any;
    }
    filteredItems.length = 0;
    for (let i = 0; i < items.length; i++) {
        const item = items[i];
        if (filter(item as any)) {
            filteredItems.push(item);
        }
    }
    return filteredItems;
}

export namespace _Internal_Instances {
    export const TrackedInstancesSceneLocal = new SceneLocal(() => new TrackedInstances(), `TrackedInstances`);
}

class TrackedInstances {
    private readonly _map = new Map<Fn, DisplayObjectList>();

    get(fn: Fn) {
        let list = this._map.get(fn);
        if (!list) {
            list = new DisplayObjectList();
            this._map.set(fn, list);
        }
        return list;
    }

    add(fn: Fn, instance: DisplayObject) {
        this.get(fn).add(instance);
    }

    remove(fn: Fn, instance: DisplayObject) {
        this.get(fn).remove(instance);
    }
}

class DisplayObjectList {
    private readonly _array: DisplayObject[] = [];
    private _removed = false;

    array() {
        if (this._removed) {
            let i = 0;
            while (i < this._array.length) {
                if (this._array[i].destroyed) {
                    this._array.splice(i, 1);
                    continue;
                }
                i++;
            }
            this._removed = false;
        }

        return this._array;
    }

    add(obj: DisplayObject) {
        this._array.push(obj);
    }

    remove(obj: DisplayObject) {
        this._removed = true;
    }
}
