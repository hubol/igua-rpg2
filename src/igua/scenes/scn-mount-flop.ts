import { Lvl, LvlType } from "../../assets/generated/levels/generated-level-data";
import { DramaGifts } from "../drama/drama-gifts";
import { show } from "../drama/show";
import { mxnCutscene } from "../mixins/mxn-cutscene";
import { objCharacterFlower } from "../objects/characters/obj-character-flower";
import { Rpg } from "../rpg/rpg";

export function scnMountFlop() {
    const lvl = Lvl.MountFlop();
    enrichFlowerNpc(lvl);
}

function enrichFlowerNpc(lvl: LvlType.MountFlop) {
    const gift = Rpg.gift("MountFlop.Flower");
    objCharacterFlower()
        .mixin(mxnCutscene, function* () {
            if (!gift.isGiveable()) {
                yield* show("Have you been opening a bunch of flops?");
                return;
            }

            yield* show(
                "Are you a fan of flops?",
                "If so, this will help you open them.",
            );

            yield* DramaGifts.give(gift);
        })
        .at(lvl.FlowerMarker)
        .show();
}
