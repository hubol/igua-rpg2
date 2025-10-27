import { Logger } from "../../lib/game-engine/logger";
import { Integer } from "../../lib/math/number-alias-types";
import { range } from "../../lib/range";

export class RpgFlops {
    constructor(private readonly _state: RpgFlops.State) {
    }

    /** Generally, prefer the `count` and `has` methods */
    get values(): Readonly<RpgFlops.State["collections"]> {
        return this._state.collections;
    }

    get list(): ReadonlyArray<{ count: Integer; loanedCount: Integer }> {
        return range(999).map(id => ({
            count: this.count(id),
            loanedCount: this._state.loans[id] ?? 0,
        }));
    }

    count(id: RpgFlops.Id) {
        return this._state.collections[id] ?? 0;
    }

    has(id: RpgFlops.Id) {
        return Boolean(this._state.collections[id]);
    }

    receive(id: RpgFlops.Id) {
        if (!RpgFlops._isFlopId(id)) {
            Logger.logContractViolationError(
                "RpgFlops.receive",
                new Error("id must be integral and in range [0, 998]"),
                { id },
            );
            return;
        }

        this._state.collections[id] = this.count(id) + 1;
    }

    createLoan(flopId: RpgFlops.Id): RpgFlops.Loan {
        if (this.count(flopId) <= (this._state.loans[flopId] ?? 0)) {
            return { accepted: false };
        }

        this._state.loans[flopId] = (this._state.loans[flopId] ?? 0) + 1;
        return { flopId, accepted: true };
    }

    processReturn(request: RpgFlops.Return) {
        for (const flopId of request.returnedFlopIds) {
            if (!this._state.loans[flopId]) {
                Logger.logContractViolationError(
                    "RpgFlops.processReturn",
                    new Error("id must be on loan to be unloaned"),
                    { flopId },
                );
                continue;
            }

            this._state.loans[flopId] = 0;
        }
    }

    private static _isFlopId(flopId: RpgFlops.Id) {
        return flopId >= 0 && flopId <= 998 && Number.isInteger(flopId);
    }

    static createState(): RpgFlops.State {
        return {
            collections: {},
            loans: {},
        };
    }
}

export namespace RpgFlops {
    export type Id = Integer;
    export interface State {
        collections: Record<RpgFlops.Id, Integer>;
        loans: Record<RpgFlops.Id, Integer>;
    }

    export type Loan = Loan.Accepted | Loan.Declined;

    export namespace Loan {
        export interface Accepted {
            accepted: true;
            flopId: RpgFlops.Id;
        }

        export interface Declined {
            accepted: false;
        }
    }

    export interface Return {
        returnedFlopIds: ReadonlyArray<RpgFlops.Id>;
    }
}
