let _counter = 0;

export class CancellationToken {
    private _isCancelled = false;
    private readonly _uid = _counter++;

    cancel() {
        this._isCancelled = true;
    }

    rejectIfCancelled(reject: (reason?: any) => void) {
        if (this._isCancelled) {
            reject(new CancellationError(this));
            return true;
        }

        return false;
    }
}

export class CancellationError extends Error {
    constructor(readonly token: CancellationToken) {
        super('Cancelled by token');
    }
}

