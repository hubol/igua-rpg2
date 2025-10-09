import { Container, DisplayObject } from "pixi.js";

type TypeError_ThisDoesNotSufficientlyImplementMinimum =
    "This DisplayObject does not sufficiently implement the mixin minimum type";

type Mixed<TMinimum, TDst, TThis> = TThis extends TMinimum ? TThis & TDst
    : TypeError_ThisDoesNotSufficientlyImplementMinimum;

// https://www.reddit.com/r/typescript/comments/13pyj7b/comment/jldm59b/
type ExcludeFirstParameter<T extends [p1: unknown, ...pR: unknown[]]> = T extends [infer _First, ...infer Rest] ? Rest
    : never;

declare module "pixi.js" {
    interface DisplayObject {
        mixin<TArgs extends [src: any, ...rest: any[]], TFn extends (...args: TArgs) => any>(
            mixin: TFn,
            ...args: ExcludeFirstParameter<Parameters<TFn>>
        ): Mixed<Parameters<TFn>[0], ReturnType<TFn>, this>;
        /** Beware! This method is not well-typed. */
        identify<TFn extends (...args: any) => DisplayObject>(fn: TFn): this;
        is<TFn extends (...args: any) => any>(mixin: TFn): this is ReturnType<TFn>;
    }

    interface Container {
        findIs<TFn extends (...args: any) => any>(mixin: TFn): Array<ReturnType<TFn>>;
    }
}

interface DisplayObjectPrivate {
    _identities?: Set<(...args: any) => any>;
}

Object.defineProperties(DisplayObject.prototype, {
    mixin: {
        value: function (
            this: DisplayObject & DisplayObjectPrivate,
            mixin: (d: DisplayObject, ...rest: any[]) => any,
            arg1: any,
            arg2: any,
            arg3: any,
        ) {
            this.identify(mixin);
            return mixin(this, arg1, arg2, arg3);
        },
    },
    identify: {
        value: function (this: DisplayObject & DisplayObjectPrivate, identity: (...args: any) => any) {
            if (!this._identities) {
                this._identities = new Set();
            }
            this._identities.add(identity);
            return this;
        },
    },
    is: {
        value: function (this: DisplayObject & DisplayObjectPrivate, mixin: (...args: any) => any) {
            return this._identities ? this._identities.has(mixin) : false;
        },
    },
});

const children: DisplayObject[] = [];

Object.defineProperties(Container.prototype, {
    findIs: {
        value: function (this: Container, mixin: (...args: any) => any) {
            const results: any[] = [];

            children.length = 0;
            children[0] = this;

            for (let i = 0; i < children.length; i++) {
                const obj = children[i];

                if (obj.is?.(mixin)) {
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
