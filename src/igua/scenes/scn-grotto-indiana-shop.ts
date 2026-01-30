import { Lvl, LvlType } from "../../assets/generated/levels/generated-level-data";
import { Mzk } from "../../assets/music";
import { Jukebox } from "../core/igua-audio";
import { dramaShop } from "../drama/drama-shop";
import { ask, show } from "../drama/show";
import { mxnCutscene } from "../mixins/mxn-cutscene";

export function scnGrottoIndianaShop() {
    Jukebox.play(Mzk.IronSkittle);
    const lvl = Lvl.GrottoIndianaShop();
    enrichShopkeeper(lvl);
}

function enrichShopkeeper(lvl: LvlType.GrottoIndianaShop) {
    lvl.ShopkeeperNpc
        .mixin(mxnCutscene, function* () {
            const result = yield* ask("Welcome to the hole. What can I help you with?", "Wares", "The area");
            if (result === 0) {
                // TODO setting tints for shops is getting annoying!
                yield* dramaShop("GrottoIndiana", { primaryTint: 0x808080, secondaryTint: 0x505050 });
            }
            else {
                // TODO stupid
                yield* show("I'm not local. I can't help with that.");
            }
        });
}
