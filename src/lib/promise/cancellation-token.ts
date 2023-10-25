let _counter = 0;

export class CancellationToken {
    private _isCancelled = false;
    private readonly _uid = _counter++;

    cancel() {
        this._isCancelled = true;
    }

    get isCancelled() {
        return this._isCancelled;
    }

    rejectIfCancelled(reject: (reason?: any) => void) {
        if (this.isCancelled)
            reject({ message: "Cancelled by token", cancellationToken: this });
    }
}

export function handlePromiseCancellation(ev: PromiseRejectionEvent) {
    if (!ev?.reason?.cancellationToken)
        return;

    console.log(ev.promise, ev.reason);
    ev.preventDefault();
}
