declare global {
    interface Array<T> {
        last: T;
    }
}

Object.defineProperties(Array.prototype, {
    last: {
        get: function () {
            return this[this.length - 1];
        },
        set: function (value) {
            this[this.length - 1] = value;
        },
        configurable: true,
    },
});

export default 0;
