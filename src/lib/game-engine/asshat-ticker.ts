import { ErrorReporter } from "./error-reporter";
import { ICancellationToken } from "../promise/cancellation-token";

export class EscapeTickerAndExecute {
    constructor(readonly execute: () => void) {}
}

export type AsshatTickerFn = ((...params: any[]) => any) & { _removed?: boolean };

export interface IAsshatTicker {
    doNextUpdate: boolean;
    add(fn: AsshatTaskFn, context: AsshatTaskContext, order: number): void;
}

type AsshatTaskFn = (...params: any[]) => any;

export interface AsshatTaskContext {
    cancellationToken: ICancellationToken;
}

interface AsshatTask {
    fn: AsshatTaskFn;
    context: AsshatTaskContext;
}

export class AsshatTicker implements IAsshatTicker {
    ticks = 0;
    doNextUpdate = true;

    private readonly _orders: number[] = [];
    private readonly _tasks: Record<number, AsshatTask[]> = {};

    add(fn: AsshatTaskFn, context: AsshatTaskContext, order: number) {
        const task = { fn, context };

        if (!this._tasks[order]) {
            this._tasks[order] = [task];

            // TODO could be binary search if necessary
            for (let i = 0; i < this._orders.length; i++) {
                if (this._orders[i] > order) {
                    this._orders.splice(i, 0, order);
                    return;
                }
            }

            this._orders.push(order);
        }
        else {
            this._tasks[order].push(task);
        }
    }

    tick() {
        if (!this.doNextUpdate) {
            return;
        }

        try {
            this.tickImpl();
        }
        catch (e) {
            if (e instanceof EscapeTickerAndExecute) {
                e.execute();
                return;
            }
            ErrorReporter.reportSubsystemError("AsshatTicker.tick", e);
        }
    }

    private tickImpl() {
        this.ticks += 1;

        for (let j = 0; j < this._orders.length; j++) {
            const order = this._orders[j];

            let i = 0;
            let shift = 0;

            const tasks = this._tasks[order];

            while (i < tasks.length) {
                const task = tasks[i];

                if (task.context.cancellationToken.isCancelled) {
                    shift += 1;
                    i += 1;
                    continue;
                }

                try {
                    task.fn();
                }
                catch (e) {
                    if (e instanceof EscapeTickerAndExecute) {
                        throw e;
                    }
                    ErrorReporter.reportSubsystemError("AsshatTicker.tickImpl", e, task);
                }

                if (shift) {
                    tasks[i - shift] = task;
                }
                i += 1;
            }

            if (shift) {
                tasks.length -= shift;
            }
        }
    }
}
