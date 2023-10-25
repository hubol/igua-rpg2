import { AsshatTicker, AsshatTickerFn, IAsshatTicker } from "../game-engine/asshat-ticker";

type QueuedCall = { fn: 'add' | 'remove'; arg: AsshatTickerFn };

export class LazyTicker implements IAsshatTicker {
    readonly _isLazy = true;

    doNextUpdate = true;

    private _resolved?: AsshatTicker;
    private readonly _queuedCalls: QueuedCall[] = [];
    private readonly _receivers: LazyTickerReceiver[];

    constructor(receiver: LazyTickerReceiver) {
        this._receivers = [ receiver ];
    }

    add(arg: AsshatTickerFn) {
        if (this._resolved)
            return this._resolved.add(arg);
        this._queuedCalls.push({ fn: 'add', arg });
    }

    remove(arg: AsshatTickerFn) {
        if (this._resolved)
            return this._resolved.remove(arg);
        this._queuedCalls.push({ fn: 'remove', arg });
    }

    update(): void {
        throw new Error("Not implemented");
    }

    resolve(ticker: AsshatTicker) {
        if (this._resolved) {
            console.error(`Attempt to resolve already resolved LazyTicker`, this);
            return;
        }

        for (let i = 0; i < this._queuedCalls.length; i++) {
            const call = this._queuedCalls[i];
            ticker[call.fn](call.arg);
        }

        for (let i = 0; i < this._receivers.length; i++) {
            this._receivers[i](ticker);
        }

        this._resolved = ticker;
    }

    addReceiver(receiver: LazyTickerReceiver) {
        if (this._resolved) {
            console.error(`Attempt to add receiver to already-resolved LazyTicker`, this, receiver);
            return;
        }

        this._receivers.push(receiver);
    }
}

type LazyTickerReceiver = (ticker: AsshatTicker) => void;

export const isLazyTicker = (ticker: IAsshatTicker): ticker is LazyTicker => (ticker as any)._isLazy;
