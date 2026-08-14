import { Container, DisplayObject } from "pixi.js";

interface ClassWithConstructor<TInstance, TArgs extends Array<unknown>> {
    new(...args: TArgs): TInstance;
}

declare module "pixi.js" {
    interface Container {
        findInstancesOf<TInstance, TArgs extends Array<unknown>>(
            theClass: ClassWithConstructor<TInstance, TArgs>,
        ): TInstance[];
    }
}

const children: DisplayObject[] = [];

Object.defineProperties(Container.prototype, {
    findInstancesOf: {
        value: function<TInstance, TArgs extends Array<unknown>> (
            this: Container,
            theClass: ClassWithConstructor<TInstance, TArgs>,
        ): TInstance[] {
            const results: TInstance[] = [];

            children.length = 0;
            children[0] = this;

            for (let i = 0; i < children.length; i++) {
                const obj = children[i];

                if (obj instanceof theClass) {
                    results.push(obj);
                }

                if (obj.children) {
                    children.push(...obj.children as any);
                }
            }

            children.length = 0;
            return results;
        },
    },
});
