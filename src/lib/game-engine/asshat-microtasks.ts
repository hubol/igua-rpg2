import { CancellationToken } from "../promise/cancellation-token";
import { ErrorReporter } from "./error-reporter";

export class AsshatMicrotasks {
    private readonly _tasks: AsshatMicrotaskInternal[] = [];

    add(wait: AsshatMicrotask) {
        this._tasks.push(wait);
    }

    tick() {
        try {
            this._checkPredicates();
            this._resolveTasks();
        }
        catch (e) {
            ErrorReporter.reportSubsystemError('AsshatMicrotasks.tick', e);
        }
    }

    private _checkPredicates() {
        let i = 0;
        let shift = 0;
        while (i < this._tasks.length) {
            const task = this._tasks[i];

            if (task.cancellationToken.rejectIfCancelled(task.reject)) {
                shift += 1;
                i += 1;
                continue;
            }

            try {
                task._predicatePassed = task.predicate();
            }
            catch (e) {
                ErrorReporter.reportSubsystemError('AsshatMicrotasks._checkPredicates', e, task);
            }

            if (shift)
                this._tasks[i - shift] = task;
            i += 1;
        }

        if (shift)
            this._tasks.length -= shift;
    }

    private _resolveTasks() {
        let i = 0;
        let shift = 0;
        while (i < this._tasks.length) {
            const task = this._tasks[i];

            if (task.cancellationToken.rejectIfCancelled(task.reject)) {
                shift += 1;
                i += 1;
                continue;
            }

            if (task._predicatePassed) {
                task.resolve();
                shift += 1;
                i += 1;
                continue;
            }

            if (shift)
                this._tasks[i - shift] = task;
            i += 1;
        }

        if (shift)
            this._tasks.length -= shift;
    }
}

interface AsshatMicrotaskInternal extends AsshatMicrotask {
    _predicatePassed?: boolean;
}

export interface AsshatMicrotask {
    readonly predicate: () => boolean;
    readonly cancellationToken: CancellationToken;
    readonly resolve: () => void;
    readonly reject: (reason: any) => void;
}