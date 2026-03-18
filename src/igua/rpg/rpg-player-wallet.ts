import { Logger } from "../../lib/game-engine/logger";
import { Integer } from "../../lib/math/number-alias-types";
import { RpgEconomy } from "./rpg-economy";
import { RpgExperience } from "./rpg-experience";

const currencyIdToStateKey: Record<RpgEconomy.Currency.NonExperienceId, keyof RpgPlayerWallet.State> = {
    casino_pity: "casinoPity",
    mechanical_idol_credits: "mechanicalIdolCredits",
    valuables: "valuables",
};

export class RpgPlayerWallet {
    constructor(private readonly _state: RpgPlayerWallet.State, private readonly _experience: RpgExperience) {
    }

    private _update(id: RpgEconomy.Currency.Id, delta: Integer) {
        if (RpgExperience.isId(id)) {
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
        else {
            const stateKey = currencyIdToStateKey[id];
            if (delta < 0 && (this._state[stateKey] + delta) < 0) {
                Logger.logContractViolationError(
                    "RpgPlayerWallet._update",
                    new Error(`Negative delta would set held ${stateKey} below 0, setting to 0`),
                    { [stateKey]: this._state[stateKey], delta },
                );
                this._state[stateKey] = 0;
            }
            else {
                this._state[stateKey] += delta;
            }
        }
    }

    canAfford(offer: RpgEconomy.Offer) {
        return this.count(offer.currency) >= offer.price;
    }

    count(id: RpgEconomy.Currency.Id) {
        if (RpgExperience.isId(id)) {
            return this._experience[id];
        }
        return this._state[currencyIdToStateKey[id]];
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
            casinoPity: 0,
        };
    }
}

export namespace RpgPlayerWallet {
    export interface State {
        valuables: Integer;
        mechanicalIdolCredits: Integer;
        casinoPity: Integer;
    }

    export type SpendReason = "default" | "gambling";
    export type EarnReason = "default" | "gambling";
}
