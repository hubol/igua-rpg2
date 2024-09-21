import { AsshatTaskContext, AsshatTicker, AsshatTickerFn, IAsshatTicker } from "../game-engine/asshat-ticker";

type QueuedCall = { fn: "add"; arg1: AsshatTickerFn; arg2: AsshatTaskContext; arg3: number };

export class LazyTicker implements IAsshatTicker {
    readonly _isLazy = true;

    doNextUpdate = true;

    private _resolved?: AsshatTicker;
    private readonly _queuedCalls: QueuedCall[] = [];
    private readonly _receivers: LazyTickerReceiver[];

    constructor(receiver: LazyTickerReceiver) {
        this._receivers = [receiver];
    }

    add(arg1: AsshatTickerFn, arg2: AsshatTaskContext, arg3: number) {
        if (this._resolved) {
            throw new InvalidLazyTickerAccess(`Attempt to enqueue add() call on already-resolved LazyTicker`, this);
        }
        this._queuedCalls.push({ fn: "add", arg1, arg2, arg3 });
    }

    push(lazyTicker: LazyTicker) {
        this._queuedCalls.push(...lazyTicker._queuedCalls);
        this._receivers.push(...lazyTicker._receivers);
    }

    resolve(ticker: AsshatTicker) {
        if (this._resolved) {
            throw new InvalidLazyTickerAccess(`Attempt to resolve() already-resolved LazyTicker`, this);
        }

        for (let i = 0; i < this._queuedCalls.length; i++) {
            const call = this._queuedCalls[i];
            ticker[call.fn](call.arg1 as any, (call as any).arg2, (call as any).arg3);
        }

        for (let i = 0; i < this._receivers.length; i++) {
            this._receivers[i]._receiveResolvedTicker(ticker);
        }

        this._receivers.length = 0;
        this._resolved = ticker;
    }

    addReceiver(receiver: LazyTickerReceiver) {
        if (this._resolved) {
            throw new InvalidLazyTickerAccess(`Attempt to addReceiver() to already-resolved LazyTicker`, this);
        }

        this._receivers.push(receiver);
    }
}

class InvalidLazyTickerAccess extends Error {
    constructor(message: string, readonly lazyTicker: LazyTicker) {
        super(message);
    }
}

export interface LazyTickerReceiver {
    _receiveResolvedTicker(ticker: AsshatTicker): void;
}

export const isLazyTicker = (ticker?: IAsshatTicker): ticker is LazyTicker => (ticker as any)?._isLazy;
