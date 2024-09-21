import { DisplayObject } from "pixi.js";

interface DispatchingDisplayObject<TEvent extends string> {
    dispatch(event: TEvent): void;
    handles(event: TEvent, fn: (self: this) => unknown): this;
}

declare module "pixi.js" {
    interface DisplayObject {
        dispatches<TEvent extends string>(): this & DispatchingDisplayObject<TEvent>;
    }
}

Object.defineProperties(DisplayObject.prototype, {
    dispatches: {
        value: function (this: DisplayObject) {
            return this;
        },
        configurable: true,
    },
    dispatch: {
        value: function (this: DisplayObject, event: string) {
            this.emit(event, this);
        },
        configurable: true,
    },
    handles: {
        value: function (this: DisplayObject, event: string, fn: (self: any) => unknown) {
            this.on(event, fn);
            return this;
        },
        configurable: true,
    },
});

export default 0;
