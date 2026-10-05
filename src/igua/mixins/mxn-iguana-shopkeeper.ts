import { sleepf } from "../../lib/game-engine/routines/sleep";
import { Rng } from "../../lib/math/rng";
import { DataShop } from "../data/data-shop";
import { DramaLib } from "../drama/drama-lib";
import { dramaShop } from "../drama/drama-shop";
import { ObjIguanaNpc } from "../objects/obj-iguana-npc";
import { mxnCutscene } from "./mxn-cutscene";
import { mxnYell } from "./mxn-yell";

interface MxnIguanaShopkeeperArgs {
    messages: string[];
    shopId: DataShop.Id;
}

export function mxnIguanaShopkeeper(obj: ObjIguanaNpc, args: MxnIguanaShopkeeperArgs) {
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
