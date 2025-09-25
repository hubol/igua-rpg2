import { AsshatTask, AsshatTicker, IAsshatTicker } from "../game-engine/asshat-ticker";

type QueuedCall = { fn: "add"; arg0: AsshatTask; arg1: number };

export class LazyTicker implements IAsshatTicker {
    readonly _isLazy = true;

    doNextUpdate = true;

    private _resolved?: AsshatTicker;
    private _obsoletedBy?: IAsshatTicker;

    private readonly _queuedCalls: QueuedCall[] = [];
    private readonly _receivers = new Set<LazyTickerReceiver>();

    constructor(receiver: LazyTickerReceiver) {
        this._receivers.add(receiver);
    }

    add(arg0: AsshatTask, arg1: number) {
        if (this._resolved || this._obsoletedBy) {
            throw new InvalidLazyTickerAccess(
                `Attempt to enqueue add() call on resolved or obsoleted LazyTicker`,
                this,
            );
        }
        this._queuedCalls.push({ fn: "add", arg0, arg1 });
    }

    merge(lazyTicker: LazyTicker) {
        if (this._resolved || this._obsoletedBy) {
            throw new InvalidLazyTickerAccess(`Attempt to merge() resolved or obsoleted LazyTicker`, this);
        }

        this._queuedCalls.push(...lazyTicker._queuedCalls);

        for (const receiver of lazyTicker._receivers) {
            receiver._receiveLatestTicker(this);
            this._receivers.add(receiver);
        }

        lazyTicker._clear();
        lazyTicker._obsoletedBy = this;
    }

    resolve(ticker: AsshatTicker) {
        if (this._resolved || this._obsoletedBy) {
            throw new InvalidLazyTickerAccess(`Attempt to resolve() resolved or obsoleted LazyTicker`, this);
        }

        for (let i = 0; i < this._queuedCalls.length; i++) {
            const call = this._queuedCalls[i];
            ticker[call.fn](call.arg0, call.arg1);
        }

        for (const receiver of this._receivers) {
            receiver._receiveLatestTicker(ticker);
        }

        this._clear();
        this._resolved = ticker;
    }

    private _clear() {
        this._queuedCalls.length = 0;
        this._receivers.clear();
    }
}

class InvalidLazyTickerAccess extends Error {
    constructor(message: string, readonly lazyTicker: LazyTicker) {
        super(message);
    }
}

export interface LazyTickerReceiver {
    _receiveLatestTicker(ticker: IAsshatTicker): void;
}

export const isLazyTicker = (ticker?: IAsshatTicker): ticker is LazyTicker => (ticker as any)?._isLazy;
