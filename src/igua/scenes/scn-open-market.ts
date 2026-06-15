import { Lvl, LvlType } from "../../assets/generated/levels/generated-level-data";
import { sleepf } from "../../lib/game-engine/routines/sleep";
import { Rng } from "../../lib/math/rng";
import { DataShop } from "../data/data-shop";
import { DramaEquipment } from "../drama/drama-equipment";
import { DramaGifts } from "../drama/drama-gifts";
import { DramaLib } from "../drama/drama-lib";
import { dramaShop } from "../drama/drama-shop";
import { show } from "../drama/show";
import { mxnCutscene } from "../mixins/mxn-cutscene";
import { mxnYell } from "../mixins/mxn-yell";
import { ObjIguanaNpc } from "../objects/obj-iguana-npc";
import { Rpg } from "../rpg/rpg";

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

    lvl.GluemakerNpc
        .mixin(mxnShopkeeper, {
            messages: [
                "Selling glue for combining shoes!",
                "I've got loads of glue! Useful for improving shoes!",
            ],
            shopId: "GluemakerOhio",
        });

    lvl.CobblerNpc
        .mixin(mxnCutscene, function* () {
            yield* DramaEquipment.upgrade();
        });

    enrichFlipNpc(lvl);
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

function enrichFlipNpc(lvl: LvlType.OpenMarket) {
    const gift = Rpg.gift("Ohio.Market.Flip");
    let forceLeft = false;

    lvl.FlipNpc
        .step(self => {
            self.auto.facing = (lvl.FlipDial.objEsotericDial.remainingTicksUnit > 0 || forceLeft) ? -1 : 1;
        })
        .mixin(mxnCutscene, function* () {
            if (lvl.FlipNpc.facing < 0) {
                forceLeft = true;
                yield* show(
                    "Thanks for making me face to the left.",
                    "It's my favorite direction to face.",
                );
                if (gift.isGiveable()) {
                    yield* DramaGifts.give(gift);
                    yield* show("I hope you enjoy that. It's a rarity in this land.");
                }
                forceLeft = false;
                return;
            }
            yield* show(
                "I'm in love with facing to the left.",
                "Please help me face to the left using the dial.",
            );
        });
}
