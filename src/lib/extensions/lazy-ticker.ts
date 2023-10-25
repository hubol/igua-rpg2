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
            throw new InvalidLazyTickerAccess(`Attempt to enqueue add() call on already-resolved LazyTicker`, this);
        this._queuedCalls.push({ fn: 'add', arg });
    }

    remove(arg: AsshatTickerFn) {
        if (this._resolved)
            throw new InvalidLazyTickerAccess(`Attempt to enqueue remove() call on already-resolved LazyTicker`, this);
        this._queuedCalls.push({ fn: 'remove', arg });
    }

    update(): void {
        throw new InvalidLazyTickerAccess(`Attempt to call update() on LazyTicker`, this);
    }

    resolve(ticker: AsshatTicker) {
        if (this._resolved)
            throw new InvalidLazyTickerAccess(`Attempt to resolve() already-resolved LazyTicker`, this);

        for (let i = 0; i < this._queuedCalls.length; i++) {
            const call = this._queuedCalls[i];
            ticker[call.fn](call.arg);
        }

        for (let i = 0; i < this._receivers.length; i++) {
            this._receivers[i]._receiveResolvedTicker(ticker);
        }

        this._receivers.length = 0;
        this._resolved = ticker;
    }

    addReceiver(receiver: LazyTickerReceiver) {
        if (this._resolved)
            throw new InvalidLazyTickerAccess(`Attempt to addReceiver() to already-resolved LazyTicker`, this);

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

export const isLazyTicker = (ticker: IAsshatTicker): ticker is LazyTicker => (ticker as any)._isLazy;
