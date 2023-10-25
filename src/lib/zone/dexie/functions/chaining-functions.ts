export function nop() { }
export function mirror(val) { return val; }

export function callBoth(on1, on2) {
    return function (this) {
        on1.apply(this, arguments);
        on2.apply(this, arguments);
    };
}
