import { Lvl } from "../../assets/generated/levels/generated-level-data";
import { Mzk } from "../../assets/music";
import { Jukebox } from "../core/igua-audio";
import { DramaGifts } from "../drama/drama-gifts";
import { mxnShow } from "../mixins/mxn-show";
import { playerObj } from "../objects/obj-player";
import { Rpg } from "../rpg/rpg";

export function scnEndingDemoGood() {
    Jukebox.play(Mzk.DemoGoodEnd);
    const lvl = Lvl.EndingDemoGood();

    lvl.BeetGod.mixin(mxnShow, "Thank you for offering me 50 beets!");
    lvl.BalltownOutskirtsMiner.mixin(mxnShow, "Thank you for fixing my pickaxe!");
    lvl.CavernGatekeeper.mixin(mxnShow, "It was a dream opening the cave roof for you!");
    lvl.CloudHouseAddict.mixin(mxnShow, "I'm still addicted to foam insulation!");
    lvl.CloudHouseMusician.mixin(mxnShow, "Thank you for sharing your music enthusiasm!");
    lvl.CloudHouseNeatFreak.mixin(mxnShow, "Thank you for not wearing shoes!");
    lvl.ColosseumWatcher.mixin(mxnShow, "Thank you for letting me watch you defeat the colosseum sprite!");
    lvl.IndianaDirector.mixin(mxnShow, "Thank you for teaching our students!");
    lvl.IndianaNurse.mixin(mxnShow, "Thank you for being a great patient!");
    lvl.NewBalltownArmorer.mixin(mxnShow, "Thank you for giving me a fish and not insulting my floors!");
    lvl.UnderneathTunneler.mixin(mxnShow, "Thank you for fetching my food!");

    lvl.GiftRegion
        .coro(function* (self) {
            yield () => playerObj.collides(self);
            if (!Rpg.gift("Demo.GoodEnd").isGiven) {
                yield* DramaGifts.give("Demo.GoodEnd");
            }
        });
}
