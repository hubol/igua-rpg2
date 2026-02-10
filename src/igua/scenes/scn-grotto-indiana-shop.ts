import { Lvl, LvlType } from "../../assets/generated/levels/generated-level-data";
import { Mzk } from "../../assets/music";
import { Jukebox } from "../core/igua-audio";
import { dramaShop } from "../drama/drama-shop";
import { ask, show } from "../drama/show";
import { mxnCutscene } from "../mixins/mxn-cutscene";
import { Rpg } from "../rpg/rpg";

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
                if (Rpg.character.buffs.approval.indianaMerchants <= 0) {
                    yield* show(
                        "... Hm...",
                        "Sorry, I don't think I can trust you yet...",
                        "I hail from a tribe of merchants.",
                        "We have long relished the bittered beets found in the strange market.",
                        "Produce the symbol of our god and you may take a look at my wares.",
                    );
                }
                else {
                    // TODO setting tints for shops is getting annoying!
                    yield* dramaShop("GrottoIndiana", { primaryTint: 0x808080, secondaryTint: 0x505050 });
                }
            }
            else {
                yield* show(
                    "This is Indiana.",
                    "Currently, you are in my trade grotto.",
                    "There are many iguanas in New Balltown, south of here.",
                    "You'll need a way to climb up there, though...",
                    "Another place with a lot of iguanas is the strange market to the southwest.",
                    "To the southeast is the university.",
                    "To the north is the great tower.",
                    "There is an apartment complex there.",
                );
            }
        });
}
