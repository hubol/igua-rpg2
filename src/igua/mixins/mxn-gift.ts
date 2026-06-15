import { DisplayObject } from "pixi.js";
import { DataGift } from "../data/data-gift";
import { DramaGifts } from "../drama/drama-gifts";
import { show } from "../drama/show";
import { Cutscene } from "../globals";
import { playerObj } from "../objects/obj-player";
import { Rpg } from "../rpg/rpg";
import { mxnCutscene } from "./mxn-cutscene";

export function mxnGift(obj: DisplayObject, giftId: DataGift.Id) {
    const gift = Rpg.gift(giftId);

    return obj
        .step(() => {
            if (!gift.isGiveable()) {
                obj.destroy();
            }
        })
        .mixin(mxnCutscene, function* () {
            if (!gift.isGiveable()) {
                return;
            }

            Cutscene.setCurrentSpeaker(playerObj);
            yield* show("A lovely gift--addressed to me!");
            Cutscene.setCurrentSpeaker(obj);
            yield* DramaGifts.give(gift);
        });
}
