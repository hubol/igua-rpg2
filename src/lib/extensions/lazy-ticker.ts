import { AsshatMicrotask } from "../game-engine/asshat-microtasks";
import { AsshatTicker, AsshatTickerFn, IAsshatTicker } from "../game-engine/asshat-ticker";

type QueuedCall = { fn: 'add' | 'remove'; arg: AsshatTickerFn } | { fn: 'addMicrotask', arg: AsshatMicrotask };

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

    addMicrotask(arg: AsshatMicrotask): void {
        if (this._resolved)
            throw new InvalidLazyTickerAccess(`Attempt to enqueue addMicrotask() call on already-resolved LazyTicker`, this);
        this._queuedCalls.push({ fn: 'addMicrotask', arg });
    }

    push(lazyTicker: LazyTicker) {
        this._queuedCalls.push(...lazyTicker._queuedCalls);
    }

    resolve(ticker: AsshatTicker) {
        if (this._resolved)
            throw new InvalidLazyTickerAccess(`Attempt to resolve() already-resolved LazyTicker`, this);

        for (let i = 0; i < this._queuedCalls.length; i++) {
            const call = this._queuedCalls[i];
            ticker[call.fn](call.arg as any);
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

export const isLazyTicker = (ticker?: IAsshatTicker): ticker is LazyTicker => (ticker as any)?._isLazy;
