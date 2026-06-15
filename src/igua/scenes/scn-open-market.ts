import { Lvl } from "../../assets/generated/levels/generated-level-data";
import { sleepf } from "../../lib/game-engine/routines/sleep";
import { Rng } from "../../lib/math/rng";
import { DataShop } from "../data/data-shop";
import { DramaLib } from "../drama/drama-lib";
import { dramaShop } from "../drama/drama-shop";
import { mxnCutscene } from "../mixins/mxn-cutscene";
import { mxnYell } from "../mixins/mxn-yell";
import { ObjIguanaNpc } from "../objects/obj-iguana-npc";

export function scnOpenMarket() {
    const lvl = Lvl.OpenMarket();

    lvl.FoodNpc
        .mixin(mxnShopkeeper, {
            messages: [
                "Food! Get your food here!",
                "Nutritious food!",
                "Selling foods!",
                "Delicious berries!",
            ],
            shopId: "OpenFood",
        });

    lvl.JumpNpc
        .mixin(mxnShopkeeper, {
            messages: [
                "Jump differently with my products!",
                "Love jumping? My wares are for you!",
            ],
            shopId: "OpenJump",
        });

    lvl.CombatNpc
        .mixin(mxnShopkeeper, {
            messages: [
                "Are angels beating your ass? Talk with me!",
                "Need to be tougher? I have some stuff for you!",
            ],
            shopId: "OpenCombat",
        });
}

interface MxnShopkeeperArgs {
    messages: string[];
    shopId: DataShop.Id;
}

function mxnShopkeeper(obj: ObjIguanaNpc, args: MxnShopkeeperArgs) {
    return obj
        .mixin(mxnYell)
        .mixin(mxnCutscene, function* () {
            yield* dramaShop(args.shopId, obj.speaker);
        })
        .coro(function* (self) {
            while (true) {
                yield sleepf(Rng.intc(60, 300));
                if (DramaLib.Speaker.current !== self) {
                    self.mxnYell.yell(Rng.item(args.messages));
                }
                yield sleepf(120);
            }
        });
}
