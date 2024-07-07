import { Container, DisplayObject, Rectangle } from "pixi.js";
import { EngineConfig } from "../game-engine/engine-config";
import { Pojo } from "../types/pojo";
import { merge } from "../object/merge";
import { VectorSimple } from "../math/vector-type";

declare module "pixi.js" {
    interface DisplayObject {
        named(name: string): this;
        
        scaled(vector: VectorSimple): this;
        scaled(scaleX: number, scaleY: number): this;

        show(container?: Container): this;
        merge<T extends Pojo>(t: T): this & T;
        getMinY(): number;
        getMaxY(): number;
    }

    interface Container {
        sized(vector: VectorSimple): this;
        sized(width: number, height: number): this;
        removeAllChildren();
    }
}

const r = new Rectangle();

Object.defineProperties(DisplayObject.prototype, {
    named: {
        value: function (this: DisplayObject, name: string) {
            this.name = name;
            return this;
        },
    },
    scaled: {
        value: function (this: Container, scaleX_vector: number | VectorSimple, scaleY?: number) {
            if (scaleY === undefined)
                this.transform.scale.set((<VectorSimple>scaleX_vector).x, (<VectorSimple>scaleX_vector).y);
            else
                this.transform.scale.set(<number>scaleX_vector, scaleY);

            return this;
        }
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
        }
    },
    getMinY: {
        value: function (this: DisplayObject) {
            return this.getBounds(false, r).y;
        }
    },
    getMaxY: {
        value: function (this: DisplayObject) {
            return this.getBounds(false, r).y + r.height;
        }
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
        }
    },
    sized: {
        value: function (this: Container, width_vector: number | VectorSimple, height?: number) {
            if (height === undefined) {
                this.width = (<VectorSimple>width_vector).x;
                this.height = (<VectorSimple>width_vector).y;
            }
            else {
                this.width = <number>width_vector;
                this.height = height;
            }

            return this;
        }
    }
})

export default 0;