import { Logger } from "../../lib/game-engine/logger";
import { Integer } from "../../lib/math/number-alias-types";

export class RpgFlops {
    constructor(private readonly _state: RpgFlops.State) {
        this._clean();
    }

    private _availableFlopIds: Array<RpgFlops.Id> = [];
    private _collectedCountsByFlopId: Record<RpgFlops.Id, Integer> = {};
    private _loanedCountsByFlopId: Record<RpgFlops.Id, Integer> = {};
    private _uniqueFlopIds = new Set<RpgFlops.Id>();

    private _clean() {
        // Zero

        this._availableFlopIds.length = 0;

        for (let i = 0; i < 999; i++) {
            this._collectedCountsByFlopId[i] = 0;
            this._loanedCountsByFlopId[i] = 0;
        }

        this._uniqueFlopIds.clear();

        // Compute

        for (let i = 0; i < this._state.loanedFlopIds.length; i++) {
            const id = this._state.loanedFlopIds[i];
            this._loanedCountsByFlopId[id]++;
        }

        for (let i = 0; i < this._state.collectedFlopIds.length; i++) {
            const id = this._state.collectedFlopIds[i];
            this._collectedCountsByFlopId[id]++;

            this._uniqueFlopIds.add(id);

            if (this._collectedCountsByFlopId[id] > this._loanedCountsByFlopId[id]) {
                this._availableFlopIds.push(id);
            }
        }
    }

    /** Generally, prefer the `count` and `has` methods */
    get values(): Readonly<Record<RpgFlops.Id, Integer>> {
        return this._collectedCountsByFlopId;
    }

    get availableFlopIds(): ReadonlyArray<RpgFlops.Id> {
        return this._availableFlopIds;
    }

    get loanedFlopIds(): ReadonlyArray<RpgFlops.Id> {
        return this._state.loanedFlopIds;
    }

    get uniqueFlopIds(): ReadonlySet<RpgFlops.Id> {
        return this._uniqueFlopIds;
    }

    count(id: RpgFlops.Id) {
        return this._collectedCountsByFlopId[id] ?? 0;
    }

    has(id: RpgFlops.Id) {
        return Boolean(this._collectedCountsByFlopId[id]);
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

        this._state.collectedFlopIds.push(id);
        this._clean();
    }

    createLoan(flopId: RpgFlops.Id): RpgFlops.Loan {
        if (!this._availableFlopIds.includes(flopId)) {
            return {
                accepted: false,
                error: new Error(`${flopId} is not available for loan`),
            };
        }

        this._state.loanedFlopIds.push(flopId);
        this._clean();
        return { flopId, accepted: true };
    }

    processReturn(request: RpgFlops.Return) {
        for (const flopId of request.returnedFlopIds) {
            const index = this._state.loanedFlopIds.indexOf(flopId);
            if (index === -1) {
                Logger.logContractViolationError(
                    "RpgFlops.processReturn",
                    new Error("id must be on loan to be unloaned"),
                    { flopId },
                );
                continue;
            }

            this._state.loanedFlopIds.splice(index, 1);
        }

        this._clean();
    }

    private static _isFlopId(flopId: RpgFlops.Id) {
        return flopId >= 0 && flopId <= 998 && Number.isInteger(flopId);
    }

    static createState(): RpgFlops.State {
        return {
            collectedFlopIds: [],
            loanedFlopIds: [],
        };
    }
}

export namespace RpgFlops {
    export type Id = Integer;
    export interface State {
        collectedFlopIds: Array<RpgFlops.Id>;
        loanedFlopIds: Array<RpgFlops.Id>;
    }

    export type Loan = Loan.Accepted | Loan.Declined;

    export namespace Loan {
        export interface Accepted {
            accepted: true;
            flopId: RpgFlops.Id;
        }

        export interface Declined {
            accepted: false;
            error: Error;
        }
    }

    export interface Return {
        returnedFlopIds: ReadonlyArray<RpgFlops.Id>;
    }
}
