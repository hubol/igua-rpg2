import { IsoDateString } from "../../lib/math/string-alias-types";
import { Rpg } from "../rpg/rpg";
import { RpgEconomy } from "../rpg/rpg-economy";
import { RpgInventory } from "../rpg/rpg-inventory";
import { DramaInventory } from "./drama-inventory";
import { DramaWallet } from "./drama-wallet";
import { ask, show } from "./show";

const cardKeyItem: RpgInventory.Item.KeyItem = { kind: "key_item", id: "CostcoCard" };

function* checkMembership() {
    const result = yield* ask(
        "Hi! Do you have a membership with us?",
        Rpg.inventory.has(cardKeyItem) ? "Yes" : null,
        !Rpg.inventory.has(cardKeyItem) ? "No" : null,
    );

    if (result === 0) {
        yield* show("Great! Let me see your card!");
        yield* DramaInventory.removeAll(cardKeyItem);
        if (rpgCostcoMembership.isExpired) {
            yield* show("I'm sorry. But this membership is expired.");
            return false;
        }

        yield* show("Yep, still in date.");
        yield* DramaInventory.receiveCount(cardKeyItem, 1);
        yield* show("Enjoy!");
        return true;
    }

    const cost = 200;
    if (
        yield* DramaWallet.askSpendValuables(
            `Would you like to get a membership? It costs ${RpgEconomy.Offer.toString(cost, "valuables")} a year.`,
            cost,
        )
    ) {
        yield* DramaInventory.receiveCount(cardKeyItem, 1);
        yield* show("Enjoy!");
        rpgCostcoMembership.setExpirationDateToOneYearFromNow();
        return true;
    }

    return false;
}

const rpgCostcoMembership = {
    getExpirationDate() {
        if (Rpg.flags.costco.membershipCardExpiration) {
            const date = new Date(Rpg.flags.costco.membershipCardExpiration);
            return Number.isNaN(date.getTime()) ? null : date;
        }

        return null;
    },
    createExpirationDateString(): IsoDateString {
        const hourMs = 1000 * 60 * 60;
        const yearMs = hourMs * 24 * 365.25;
        const date = new Date(new Date().getTime() + yearMs);
        return date.toISOString();
    },
    setExpirationDateToOneYearFromNow() {
        Rpg.flags.costco.membershipCardExpiration = this.createExpirationDateString();
    },
    get isExpired() {
        const date = this.getExpirationDate();
        if (date === null) {
            return true;
        }
        return date.getTime() <= new Date().getTime();
    },
};

export const DramaCostco = {
    checkMembership,
};
