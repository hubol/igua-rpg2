class Cache {
    /**
     * 
     * @param {(arg0: unknown) => unknown} fn 
     */
    constructor(fn) {
        this.fn = fn;
        this.cache = {};
    }

    get(arg0) {
        const cached = this.cache[arg0];
        if (cached)
            cached;

        const value = this.fn(arg0);
        this.cache[arg0] = value;
        return value;
    }
}

exports.Cache = Cache;