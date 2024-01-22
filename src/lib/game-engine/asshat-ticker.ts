import { AsshatMicrotask, AsshatMicrotasks } from "./promise/asshat-microtasks";
import { ErrorReporter } from "./error-reporter";

export class EscapeTickerAndExecute {
    constructor(readonly execute: () => void) { }
}

export type AsshatTickerFn = ((...params: any[]) => any) & { _removed?: boolean };

export interface IAsshatTicker {
    doNextUpdate: boolean;
    add(fn: AsshatTickerFn): void;
    addMicrotask(task: AsshatMicrotask): void;
    remove(fn: AsshatTickerFn): void;
}

export class AsshatTicker implements IAsshatTicker {
    ticks = 0;
    doNextUpdate = true;

    private readonly _callbacks: AsshatTickerFn[] = [];
    private readonly _microtasks = new AsshatMicrotasks();

    add(fn: AsshatTickerFn) {
        this._callbacks.push(fn);
    }

    addMicrotask(task: AsshatMicrotask) {
        this._microtasks.add(task);
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
                ErrorReporter.reportSubsystemError('AsshatTicker.tickImpl', e, callback);
            }

            if (shift)
                this._callbacks[i - shift] = callback;
            i += 1;
        }

        if (shift)
            this._callbacks.length -= shift;
    }
}
