import { DisplayObject } from "pixi.js";
import { sleep } from "../../lib/game-engine/routines/sleep";
import { DataGift } from "../data/data-gift";
import { DramaGifts } from "../drama/drama-gifts";
import { ask, show } from "../drama/show";
import { Cutscene } from "../globals";
import { playerObj } from "../objects/obj-player";
import { Rpg } from "../rpg/rpg";
import { mxnCutscene } from "./mxn-cutscene";
import { mxnReleasePoisonGas } from "./mxn-release-poison-gas";

export function mxnGiftPoisonous(obj: DisplayObject, giftId: DataGift.Id) {
    const configuredObj = obj.mixin(mxnReleasePoisonGas);

    const gift = Rpg.gift(giftId);

    return obj
        .mixin(mxnCutscene, function* () {
            Cutscene.setCurrentSpeaker(playerObj);

            if (gift.isGiveable()) {
                if ((yield* ask("I smell poison! What should I do?", "Search", "Leave it")) === 0) {
                    configuredObj.mxnReleasePoisonGas.release();
                    yield sleep(500);
                    playerObj.head.mouth.emote.sad();
                    yield sleep(1500);
                    yield* show("Aw, nuts.");
                    yield sleep(2000);
                    playerObj.head.mouth.emote.clear();
                    yield* show("But I found something.");
                    yield* DramaGifts.give(gift);
                }
                else {
                    yield* show("Probably a good move.");
                }
                return;
            }

            yield* show("It's empty.");
        });
}
