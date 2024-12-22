import { Container, DisplayObject, Filter, MaskData, Rectangle } from "pixi.js";
import { EngineConfig } from "../game-engine/engine-config";
import { Pojo } from "../types/pojo";
import { merge } from "../object/merge";
import { VectorSimple } from "../math/vector-type";
import { Logging } from "../logging";

declare module "pixi.js" {
    interface DisplayObject {
        named(name: string): this;
        log(key?: string): this;

        scaled(vector: VectorSimple): this;
        scaled(scaleX: number, scaleY: number): this;

        filtered(filter: Filter): this;

        show(container?: Container): this;
        merge<T extends Pojo>(t: T): this & T;
        getMinY(): number;
        getMaxY(): number;

        invisible(): this;

        masked(value: Container | MaskData | null): this;
        zIndexed(value: number): this;
    }

    interface Container {
        pivoted(vector: VectorSimple): this;
        pivoted(x: number, y: number): this;
        sized(vector: VectorSimple): this;
        sized(width: number, height: number): this;
        autoSorted(): this;
        removeAllChildren(): void;
    }
}

let logObjIndex = 0;
const r = new Rectangle();

Object.defineProperties(DisplayObject.prototype, {
    named: {
        value: function (this: DisplayObject, name: string) {
            this.name = name;
            return this;
        },
    },
    log: {
        value: function (this: DisplayObject, key?: string) {
            if (!key) {
                while (window["obj" + logObjIndex]) {
                    logObjIndex += 1;
                }

                key = "obj" + logObjIndex;
            }

            window[key] = this;
            console.log(...Logging.componentArgs(key, this));

            return this;
        },
    },
    pivoted: {
        value: function (this: Container, x_vector: number | VectorSimple, y?: number) {
            if (y === undefined) {
                this.transform.pivot.set((<VectorSimple> x_vector).x, (<VectorSimple> x_vector).y);
            }
            else {
                this.transform.pivot.set(<number> x_vector, y);
            }

            return this;
        },
    },
    scaled: {
        value: function (this: Container, scaleX_vector: number | VectorSimple, scaleY?: number) {
            if (scaleY === undefined) {
                this.transform.scale.set((<VectorSimple> scaleX_vector).x, (<VectorSimple> scaleX_vector).y);
            }
            else {
                this.transform.scale.set(<number> scaleX_vector, scaleY);
            }

            return this;
        },
    },
    filtered: {
        value: function (this: DisplayObject, filter: Filter) {
            if (!this.filters) {
                this.filters = [];
            }
            this.filters.push(filter);
            return this;
        },
    },
    show: {
        value: function (this: DisplayObject, container = EngineConfig.showDefaultStage) {
            container.addChild(this);
            return this;
        },
    },
    merge: {
        value: function (this: DisplayObject, pojo: Pojo) {
            return merge(this, pojo);
        },
    },
    getMinY: {
        value: function (this: DisplayObject) {
            return this.getBounds(false, r).y;
        },
    },
    getMaxY: {
        value: function (this: DisplayObject) {
            return this.getBounds(false, r).y + r.height;
        },
    },
    invisible: {
        value: function (this: DisplayObject) {
            this.visible = false;
            return this;
        },
    },
    masked: {
        value: function (this: DisplayObject, mask: Container | MaskData | null) {
            this.mask = mask;
            return this;
        },
    },
    zIndexed: {
        value: function (this: DisplayObject, zIndex: number) {
            this.zIndex = zIndex;
            return this;
        },
    },
});

const tempDisplayObjects: DisplayObject[] = [];

Object.defineProperties(Container.prototype, {
    removeAllChildren: {
        value: function (this: Container) {
            tempDisplayObjects.length = 0;
            tempDisplayObjects.push(...this.children);
            for (let i = 0; i < tempDisplayObjects.length; i++) {
                tempDisplayObjects[i].destroy();
            }

            tempDisplayObjects.length = 0;
        },
    },
    sized: {
        value: function (this: Container, width_vector: number | VectorSimple, height?: number) {
            if (height === undefined) {
                this.width = (<VectorSimple> width_vector).x;
                this.height = (<VectorSimple> width_vector).y;
            }
            else {
                this.width = <number> width_vector;
                this.height = height;
            }

            return this;
        },
    },
    autoSorted: {
        value: function (this: Container) {
            this.sortableChildren = true;

            return this;
        },
    },
});

export default 0;
