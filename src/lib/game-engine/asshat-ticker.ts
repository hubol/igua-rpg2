export class EscapeTickerAndExecute {
    constructor(readonly execute: () => void) { }
}

type AsshatTickerFn = ((...params: any[]) => any) & { _removed?: boolean };

export class AsshatTicker {
    doNextUpdate = true;

    readonly _callbacks: AsshatTickerFn[] = [];

    add(fn: AsshatTickerFn): this {
        this._callbacks.push(fn);
        return this;
    }

    remove(fn: AsshatTickerFn): this {
        fn._removed = true;
        return this;
    }

    update(): void {
        if (!this.doNextUpdate)
            return;

        try {
            this.updateImpl();
        }
        catch (e) {
            if (e instanceof EscapeTickerAndExecute) {
                e.execute();
                return;
            }
            console.error(`Unhandled error in AsshatTicker.update: ${e}`);
        }
    }

    private updateImpl(): void {
        let i = 0;
        let shift = 0;
        while (i < this._callbacks.length) {
            const callback = this._callbacks[i];

            if (callback._removed) {
                shift += 1;
                i += 1;
                continue;
            }

            try {
                callback();
            }
            catch (e) {
                if (e instanceof EscapeTickerAndExecute)
                    throw e;
                console.error(`Unhandled error while emitting listener`, callback, e);
            }

            if (shift)
                this._callbacks[i - shift] = callback;
            i += 1;
        }

        if (shift)
            this._callbacks.length -= shift;
    }
}
