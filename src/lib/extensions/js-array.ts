declare global {
    interface Array<T> {
        last: T;
        removeFirst(value: T): void;
    }
}

Object.defineProperties(Array.prototype, {
    last: {
        get: function<T> (this: Array<T>) {
            return this[this.length - 1];
        },
        set: function<T> (value: T) {
            this[this.length - 1] = value;
        },
        configurable: true,
    },
    removeFirst: {
        value: function<T> (this: Array<T>, value: T) {
            const index = this.indexOf(value);
            if (index > -1) {
                this.splice(index, 1);
            }
        },
        configurable: true,
    },
});

export default 0;
