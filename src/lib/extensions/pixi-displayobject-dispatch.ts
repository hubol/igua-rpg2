import { DisplayObject } from "pixi.js";

interface DisplayObjectDispatcher<TEvent extends string> {
    dispatch(event: TEvent): void;
    handles(event: TEvent, fn: (self: this) => unknown): this;
}

interface DisplayObjectValueDispatcher<TEvent extends string, TValue> {
    dispatch(event: TEvent, value: TValue): void;
    handles(event: TEvent, fn: (self: this, arg: TValue) => unknown): this;
}

declare module "pixi.js" {
    interface DisplayObject {
        dispatches<TEvent extends string>(): this & DisplayObjectDispatcher<TEvent>;
        dispatchesValue<TEvent extends string, TValue>(): this & DisplayObjectValueDispatcher<TEvent, TValue>;
    }
}

Object.defineProperties(DisplayObject.prototype, {
    dispatches: {
        value: function (this: DisplayObject) {
            return this;
        },
        configurable: true,
    },
    dispatchesValue: {
        value: function (this: DisplayObject) {
            return this;
        },
        configurable: true,
    },
    dispatch: {
        value: function (this: DisplayObject, event: string, value: unknown) {
            this.emit(event, this, value);
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
