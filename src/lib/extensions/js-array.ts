import { Pojo } from "../types/pojo";

type IdentityProvider<T> = (item: T) => string | Pojo;

declare global {
    interface Array<T> {
        last: T;
        removeFirst(value: T): void;
        /** Invokes JSON.stringify when the provider returns a Pojo. Be careful to not pass cyclical objects. */
        uniqueBy(identityProvider: IdentityProvider<T>): Array<T>;
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
    uniqueBy: {
        value: function<T> (this: Array<T>, identityProvider: IdentityProvider<T>) {
            const result = new Array<T>();
            const identities = new Set<string>();
            for (let i = 0; i < this.length; i++) {
                const item = this[i];
                const identity = identityProvider(item);
                const identityString = typeof identity === "string" ? identity : JSON.stringify(identity);
                if (!identities.has(identityString)) {
                    identities.add(identityString);
                    result.push(item);
                }
            }
            return result;
        },
        configurable: true,
    },
});

export default 0;
