import { defineVectorProperties, Vector } from "../math/vector-type";

declare global {
    interface Array<T> {
        x: T extends number ? Vector["x"] : never;
        y: T extends number ? Vector["y"] : never;
        vcpy: T extends number ? Vector["vcpy"] : never;
        vround: T extends number ? Vector["vround"] : never;
        vclamp: T extends number ? Vector["vclamp"] : never;
        add: T extends number ? Vector["add"] : never;
        moveTowards: T extends number ? Vector["moveTowards"] : never;
        normalize: T extends number ? Vector["normalize"] : never;
        scale: T extends number ? Vector["scale"] : never;
        at: T extends number ? Vector["at"] : never;
        vlength: T extends number ? Vector["vlength"] : never;
        isZero: T extends number ? Vector["isZero"] : never;
    }
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
        value: function (x: number, y: number) {
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

const assertAssignableToVector: Vector = [0, 0];
// @ts-expect-error
const assertCantUseVectorMethodsOnNonNumberArray = ["hi"].scale(1, 1);
