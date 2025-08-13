import { Logger } from "../../lib/game-engine/logger";
import { Integer } from "../../lib/math/number-alias-types";
import { RpgEconomy } from "./rpg-economy";
import { RpgExperience } from "./rpg-experience";

export class RpgPlayerWallet {
    constructor(private readonly _state: RpgPlayerWallet.State, private readonly _experience: RpgExperience) {
    }

    private _update(id: RpgEconomy.Currency.Id, delta: Integer) {
        if (id === "valuables") {
            this._state.valuables += delta;
        }
        else if (id === "mechanical_idol_credits") {
            this._state.mechanicalIdolCredits += delta;
        }
        else {
            if (delta > 0) {
                // TODO it probably should be possible to do this for gambling though!
                Logger.logContractViolationError("RpgPlayerWallet", new Error("The wallet may only spend experience"), {
                    id,
                    delta,
                });
                return;
            }
            this._experience.spend(id, Math.abs(delta));
        }
    }

    canAfford(offer: RpgEconomy.Offer) {
        return this.count(offer.currency) >= offer.price;
    }

    count(id: RpgEconomy.Currency.Id) {
        if (id === "valuables") {
            return this._state.valuables;
        }
        if (id === "mechanical_idol_credits") {
            return this._state.mechanicalIdolCredits;
        }
        return this._experience[id];
    }

    earn(id: RpgEconomy.Currency.Id, amount: Integer, reason: RpgPlayerWallet.EarnReason = "default") {
        amount = Math.abs(amount);
        this._update(id, amount);

        if (reason === "gambling") {
            this._experience.reward.gambling.onWinPrize(amount);
        }
    }

    isEmpty(id: RpgEconomy.Currency.Id) {
        return this.count(id) === 0;
    }

    spend(id: RpgEconomy.Currency.Id, amount: Integer, reason: RpgPlayerWallet.SpendReason = "default") {
        amount = Math.abs(amount);
        this._update(id, -amount);

        if (reason === "gambling") {
            this._experience.reward.gambling.onPlaceBet(amount);
        }
    }

    static createState(): RpgPlayerWallet.State {
        return {
            valuables: 100,
            mechanicalIdolCredits: 10,
        };
    }
}

export module RpgPlayerWallet {
    export interface State {
        valuables: Integer;
        mechanicalIdolCredits: Integer;
    }

    export type SpendReason = "default" | "gambling";
    export type EarnReason = "default" | "gambling";
}
