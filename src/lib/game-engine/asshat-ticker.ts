import { AsshatMicrotask, AsshatMicrotasks } from "./promise/asshat-microtasks";
import { ErrorReporter } from "./error-reporter";

export class EscapeTickerAndExecute {
    constructor(readonly execute: () => void) { }
}

export type AsshatTickerFn = ((...params: any[]) => any) & { _removed?: boolean };

export interface IAsshatTicker {
    doNextUpdate: boolean;
    add(fn: AsshatTickerFn, order: number): void;
    addMicrotask(task: AsshatMicrotask): void;
    remove(fn: AsshatTickerFn): void;
}

export class AsshatTicker implements IAsshatTicker {
    ticks = 0;
    doNextUpdate = true;

    private readonly _orders: number[] = [];
    private readonly _callbacks: Record<number, AsshatTickerFn[]> = {};
    private readonly _microtasks = new AsshatMicrotasks();

    add(fn: AsshatTickerFn, order: number) {
        if (fn._removed) {
            ErrorReporter.reportSubsystemError('AsshatTicker.add', 'Adding an already-removed AsshatTickerFn. Did you pass a named function reference directly?', { fn ,order });
        }

        if (!this._callbacks[order]) {
            this._callbacks[order] = [fn];

            // TODO could be binary search if necessary
            for (let i = 0; i < this._orders.length; i++) {
                if (this._orders[i] > order) {
                    this._orders.splice(i, 0, order);
                    return;
                }
            }

            this._orders.push(order);
        }
        else 
            this._callbacks[order].push(fn);
    }

    addMicrotask(task: AsshatMicrotask) {
        this._microtasks.add(task);
    }

    cancelMicrotasks() {
        this._microtasks.cancel();
    }

    remove(fn: AsshatTickerFn) {
        fn._removed = true;
    }

    tick() {
        if (!this.doNextUpdate)
            return;

        try {
            this.tickImpl();
            this._microtasks.tick();
        }
        catch (e) {
            if (e instanceof EscapeTickerAndExecute) {
                e.execute();
                return;
            }
            ErrorReporter.reportSubsystemError('AsshatTicker.tick', e);
        }
    }

    private tickImpl() {
        this.ticks += 1;

        for (let j = 0; j < this._orders.length; j++) {
            const order = this._orders[j];

            let i = 0;
            let shift = 0;

            const callbacks = this._callbacks[order];

            while (i < callbacks.length) {
                const callback = callbacks[i];

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
                    ErrorReporter.reportSubsystemError('AsshatTicker.tickImpl', e, callback);
                }

                if (shift)
                    callbacks[i - shift] = callback;
                i += 1;
            }

            if (shift)
                callbacks.length -= shift;
        }
    }
}
