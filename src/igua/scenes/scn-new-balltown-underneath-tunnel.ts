import { Lvl, LvlType } from "../../assets/generated/levels/generated-level-data";
import { Mzk } from "../../assets/music";
import { Jukebox } from "../core/igua-audio";
import { DramaFoodOrder } from "../drama/drama-food-order";
import { DramaInventory } from "../drama/drama-inventory";
import { DramaMisc } from "../drama/drama-misc";
import { DramaQuests } from "../drama/drama-quests";
import { DramaWallet } from "../drama/drama-wallet";
import { ask, show } from "../drama/show";
import { mxnCutscene } from "../mixins/mxn-cutscene";
import { Rpg } from "../rpg/rpg";
import { RpgFoodOrder } from "../rpg/rpg-food-order";

export function scnNewBalltownUnderneathTunnel() {
    Jukebox.play(Mzk.Covid19);
    const lvl = Lvl.NewBalltownUnderneathTunnel();
    enrichTunneler(lvl);
}

function enrichTunneler(lvl: LvlType.NewBalltownUnderneathTunnel) {
    const { tunneler } = Rpg.flags.underneath;

    lvl.LeftDoor.locked = tunneler.isLeftDoorLocked;
    lvl.Tunneler.mixin(mxnCutscene, function* () {
        yield* show("Welcome. I'm the maintainer of this ancient tunnel.");

        const playerHasOrder = Rpg.inventory.keyItems.has("TunnelGuyOrder", 1);

        const result = yield* ask(
            "Can I help you somehow?",
            tunneler.isLeftDoorLocked ? "Unlock the door" : null,
            !playerHasOrder && tunneler.foodOrderSeed === null ? "Any errands?" : null,
            tunneler.foodOrderSeed !== null ? "Your order?" : null,
            playerHasOrder ? "Your order!!" : null,
            "No, thanks",
        );

        if (result === 0) {
            yield* show("Oh, sure, sorry. I can totally unlock it for you...");
            yield DramaMisc.face(lvl.Tunneler, -1);
            yield* DramaMisc.walkToDoor.andUnlock(lvl.Tunneler, lvl.LeftDoor);
            tunneler.isLeftDoorLocked = false;
            yield DramaMisc.face(lvl.Tunneler, 1);
            yield* lvl.Tunneler.walkTo(lvl.Tunneler.startPosition.x);
            yield* show(
                "Sorry about that.",
                "I locked the door so that I could paint the tunnel in peace.",
                "Let me know if you need anything else.",
            );
        }
        else if (result === 1) {
            yield* show("You wanna run an errand for me? Sweet!");
            if (!(yield* ask("Can you go to Meal Soul in Strange Market and get me something to eat?"))) {
                yield* show("okay");
                return;
            }

            yield* show(
                "Yaaaay! Okay, be warned, my order is a little complicated.",
                "You might want to write it down or something.",
            );
            const { order, seed } = yield* DramaFoodOrder.requestOrderFromPlayer();

            yield* show(
                `Yay! Okay, I order this all the time. It should be exactly ${order.valuablesPrice} valuables.`,
            );

            yield* DramaWallet.rewardValuables(order.valuablesPrice);

            yield* show(`Thanks so much for doing this. I can't wait to dig in!!!`);

            tunneler.foodOrderSeed = seed;
        }
        else if (result === 2) {
            yield* show("You forgot my Meal Soul order? That's okay, it's pretty complicated.");

            const order = RpgFoodOrder.fromSeed(tunneler.foodOrderSeed!, "normal");
            yield* DramaFoodOrder.explainOrder(order);

            yield* show(`Dude I am salivating!!!!`);
        }
        else if (result === 3) {
            yield* DramaInventory.removeCount({ kind: "key_item", id: "TunnelGuyOrder" }, 1);

            yield* show(
                "Yo!!!! I can't wait to eat!!!",
                "Allow me to show my gratitude with a tip.",
            );

            yield* DramaQuests.receiveReward("NewBalltown.Tunneler.ReceivedOrder");
        }
    });
}
