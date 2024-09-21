let _counter = 0;

export interface ICancellationToken {
    readonly isCancelled: boolean;
    cancel(): void;
    rejectIfCancelled(reject: (reason?: any) => void): boolean;
}

export class CancellationToken implements ICancellationToken {
    isCancelled = false;
    private readonly _uid = _counter++;

    cancel() {
        this.isCancelled = true;
    }

    rejectIfCancelled(reject: (reason?: any) => void) {
        if (this.isCancelled) {
            reject(new CancellationError(this));
            return true;
        }

        return false;
    }
}

export class CancellationError extends Error {
    constructor(readonly token: CancellationToken) {
        super("Cancelled by token");
    }
}
