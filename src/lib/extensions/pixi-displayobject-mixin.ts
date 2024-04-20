import { DisplayObject } from "pixi.js";

type TypeError_ThisDoesNotSufficientlyImplementMinimum = 'This DisplayObject does not sufficiently implement the mixin minimum type';

type Mixed<TMinimum, TDst, TThis> = TThis extends TMinimum ? TThis & TDst : TypeError_ThisDoesNotSufficientlyImplementMinimum;

// https://www.reddit.com/r/typescript/comments/13pyj7b/comment/jldm59b/
type ExcludeFirstParameter<T extends [p1: unknown, ...pR: unknown[]]> = T extends [infer _First, ...infer Rest] ? Rest : never;

declare module "pixi.js" {
    interface DisplayObject {
        mixin<TArgs extends [src: any, ...rest: any[]], TFn extends (...args: TArgs) => any>(mixin: TFn, ...args: ExcludeFirstParameter<Parameters<TFn>>): Mixed<Parameters<TFn>[0], ReturnType<TFn>, this>;
    }
}

Object.defineProperties(DisplayObject.prototype, {
    mixin: {
        value: function (this: DisplayObject, mixin: (d: DisplayObject, ...rest: any[]) => unknown, arg1: any, arg2: any, arg3: any) {
            return mixin(this, arg1, arg2, arg3);
        }
    },
});
