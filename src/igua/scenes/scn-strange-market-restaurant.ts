import { Lvl, LvlType } from "../../assets/generated/levels/generated-level-data";
import { ZIndex } from "../core/scene/z-index";
import { DramaFoodOrder } from "../drama/drama-food-order";
import { DramaInventory } from "../drama/drama-inventory";
import { DramaQuests } from "../drama/drama-quests";
import { DramaWallet } from "../drama/drama-wallet";
import { show } from "../drama/show";
import { Cutscene, scene } from "../globals";
import { mxnCutscene } from "../mixins/mxn-cutscene";
import { objEsotericInProgressOrder } from "../objects/esoteric/obj-esoteric-in-progress-order";
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
    const inProgressOrderObj = objEsotericInProgressOrder()
        .at(lvl.InProgressOrderRegion)
        .zIndexed(ZIndex.TerrainDecals)
        .show();

    if (Rpg.quest("StrangeMarket.Restaurant.EnemyPresenceCleared").everCompleted) {
        lvl.MiffedAngel.destroy();
    }
    else {
        scene.stage.coro(function* () {
            yield () => lvl.MiffedAngel.destroyed;
            Cutscene.play(function* () {
                yield* show(
                    "Thanks for helping me with that customer.",
                    "Retail, am I right?!",
                );
                yield* DramaQuests.complete("StrangeMarket.Restaurant.EnemyPresenceCleared");
            }, { speaker: lvl.WaiterNpc });
        });
    }

    function* takeOrder() {
        yield* show("Welcome to Meal Soul");
        const inProgressOrder = new RpgFoodOrder.InProgress();
        inProgressOrderObj.objEsotericInProgressOrder.controls.inProgressOrder = inProgressOrder;
        const { order } = yield* DramaFoodOrder.buildOrderAtRestaurant(inProgressOrder);

        const question = `Your total is ${order.valuablesPrice} valuables. Are you gonna pay or not?`;
        if (yield* DramaWallet.askSpendValuables(question, order.valuablesPrice)) {
            const item = computeItemToDispense(order);
            yield* DramaInventory.receiveItems([item]);

            yield* show("Enjoy!");
        }

        inProgressOrderObj.objEsotericInProgressOrder.controls.inProgressOrder = null;
    }

    lvl.WaiterNpc.coro(function* (self) {
        yield () => lvl.MiffedAngel.destroyed;
        self.mixin(mxnCutscene, takeOrder);
    });
}
