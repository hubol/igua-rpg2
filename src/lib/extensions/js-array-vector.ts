import { Vector, defineVectorProperties } from "../math/vector-type";

declare global {
    interface Array<T> extends Vector {}
}

defineVectorProperties(Array.prototype, { omit: ["at"] });

Object.defineProperties(Array.prototype, {
    x: {
        get: function () {
            return this[0] ?? 0;
        },
        set: function (x) {
            this[0] = x;
        },
        configurable: true,
    },
    y: {
        get: function () {
            return this[1] ?? 0;
        },
        set: function (y) {
            this[1] = y;
        },
        configurable: true,
    },
    at: {
        value: function (x, y) {
            // Was not aware of this existing Array method
            // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/at
            if (y === undefined && typeof x === "number") {
                return this[x];
            }
            this[0] = x;
            this[1] = y;
            return this;
        },
        configurable: true,
    },
});
