import { DisplayObject } from "pixi.js";

type MixinFunctionVarArgs<TSrc extends DisplayObject, TDst extends TSrc, TArgs extends Array<unknown>> = (src: TSrc, ...args: TArgs) => TDst

declare module "pixi.js" {
    interface DisplayObject {
        mixin<TDst extends this, TArgs extends Array<unknown>>(mixin: MixinFunctionVarArgs<this, TDst, TArgs>, ...args: TArgs): this & Omit<TDst, keyof this>;
    }
}

Object.defineProperties(DisplayObject.prototype, {
    mixin: {
        value: function (this: DisplayObject, mixin: (d: DisplayObject, ...rest: any[]) => unknown, arg1: any, arg2: any, arg3: any) {
            return mixin(this, arg1, arg2, arg3);
        }
    },
});
