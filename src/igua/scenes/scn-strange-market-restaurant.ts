import { Lvl, LvlType } from "../../assets/generated/levels/generated-level-data";
import { DramaFoodOrder } from "../drama/drama-food-order";
import { DramaInventory } from "../drama/drama-inventory";
import { DramaWallet } from "../drama/drama-wallet";
import { show } from "../drama/show";
import { mxnCutscene } from "../mixins/mxn-cutscene";
import { Rpg } from "../rpg/rpg";
import { RpgFoodOrder } from "../rpg/rpg-food-order";
import { RpgInventory } from "../rpg/rpg-inventory";

export function scnStrangeMarketRestaurant() {
    const lvl = Lvl.StrangeMarketRestaurant();
    enrichScenario(lvl);
}

function computeItemToDispense(order: RpgFoodOrder): RpgInventory.Item {
    const tunneler = Rpg.flags.underneath.tunneler;

    if (tunneler.foodOrderSeed !== null && order.equals(RpgFoodOrder.fromSeed(tunneler.foodOrderSeed, "normal"))) {
        tunneler.foodOrderSeed = null;
        return { kind: "key_item", id: "TunnelGuyOrder" };
    }

    if (order.valuablesPrice >= 100) {
        return { kind: "potion", id: "RestoreHealthRestaurantLevel2" };
    }
    if (order.valuablesPrice >= 20) {
        return { kind: "potion", id: "RestoreHealthRestaurantLevel1" };
    }

    return { kind: "potion", id: "RestoreHealthRestaurantLevel0" };
}

function enrichScenario(lvl: LvlType.StrangeMarketRestaurant) {
    function* takeOrder() {
        yield* show("Welcome to Meal Soul");
        const inProgressOrder = new RpgFoodOrder.InProgress();
        const { order } = yield* DramaFoodOrder.buildOrderAtRestaurant(inProgressOrder);

        const question = `Your total is ${order.valuablesPrice} valuables. Are you gonna pay or not?`;
        if (!(yield* DramaWallet.askSpendValuables(question, order.valuablesPrice))) {
            return;
        }

        const item = computeItemToDispense(order);
        yield* DramaInventory.receiveItems([item]);

        yield* show("Enjoy!");
    }

    lvl.WaiterNpc.coro(function* (self) {
        yield () => lvl.MiffedAngel.destroyed;
        self.mixin(mxnCutscene, takeOrder);
    });
}
