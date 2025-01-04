let _counter = 0;

export interface ICancellationToken {
    readonly isCancelled: boolean;
    cancel(): void;
}

export class CancellationToken implements ICancellationToken {
    isCancelled = false;
    private readonly _uid = _counter++;

    cancel() {
        this.isCancelled = true;
    }
}
