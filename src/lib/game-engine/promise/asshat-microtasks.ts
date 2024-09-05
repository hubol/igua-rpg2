import { AsshatZoneContext } from "../asshat-zone";
import { ErrorReporter } from "../error-reporter";

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

    cancel() {
        while (this._tasks.length) {
            const task = this._tasks.pop()!;
            task.context.cancellationToken.cancel();
            task.context.cancellationToken.rejectIfCancelled(task.reject);
            free(task);
        }
    }

    private _checkPredicates() {
        let i = 0;
        let shift = 0;
        while (i < this._tasks.length) {
            const task = this._tasks[i];

            if (task.context.cancellationToken.rejectIfCancelled(task.reject)) {
                free(task);
                shift += 1;
                i += 1;
                continue;
            }

            try {
                task._predicatePassed = task.predicate();
            }
            catch (e) {
                // TODO is this important?
                if (e instanceof AsshatPredicateRejectError) {
                    task.reject(e);
                    // TODO copy-paste looks like shit!!!
                    free(task);
                    shift += 1;
                    i += 1;
                    continue;
                }
                else
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

            if (task.context.cancellationToken.rejectIfCancelled(task.reject)) {
                free(task);
                shift += 1;
                i += 1;
                continue;
            }

            if (task._predicatePassed) {
                task.resolve();
                free(task);
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

export class AsshatPredicateRejectError extends Error {
    constructor(message?: string | undefined) {
        super(message);
    }
}

interface AsshatMicrotaskInternal extends AsshatMicrotask {
    _predicatePassed?: boolean;
}

type AsshatMicrotaskContext = Pick<AsshatZoneContext, 'cancellationToken'>

export interface AsshatMicrotask {
    readonly __t: unique symbol;
    predicate: () => boolean;
    context: AsshatMicrotaskContext;
    resolve: () => void;
    reject: (reason: any) => void;
}

function free(task: Partial<AsshatMicrotaskInternal>) {
    if (freeAsshatMicrotasks.length >= 64)
        return;
    delete task.predicate;
    delete task.context;
    delete task.resolve;
    delete task.reject;
    delete task._predicatePassed;
    freeAsshatMicrotasks.push(task);
}

const freeAsshatMicrotasks: Partial<AsshatMicrotask>[] = [];

export const AsshatMicrotaskFactory = {
    create(predicate: () => boolean, context: AsshatMicrotaskContext, resolve: () => void, reject: (reason: any) => void): AsshatMicrotask {
        if (freeAsshatMicrotasks.length > 0) {
            const task = freeAsshatMicrotasks.pop()! as AsshatMicrotask;
            task.predicate = predicate;
            task.context = context;
            task.resolve = resolve;
            task.reject = reject;
            return task;
        }

        return { predicate, context, resolve, reject, } as AsshatMicrotask;
    }
}