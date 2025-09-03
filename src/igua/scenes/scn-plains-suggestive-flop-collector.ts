import { Lvl, LvlType } from "../../assets/generated/levels/generated-level-data";
import { sleep } from "../../lib/game-engine/routines/sleep";
import { Rng } from "../../lib/math/rng";
import { vlerp } from "../../lib/math/vector";
import { vnew } from "../../lib/math/vector-type";
import { DramaInventory } from "../drama/drama-inventory";
import { DevKey, scene } from "../globals";
import { mxnCutscene } from "../mixins/mxn-cutscene";
import { objCollectibleFlop } from "../objects/collectibles/obj-collectible-flop";
import { Rpg } from "../rpg/rpg";

export function scnPlainsSuggestiveFlopCollector() {
    const lvl = Lvl.PlainsSuggestiveFlopCollector();
    enrichCollectorNpc(lvl);

    scene.stage.step(() => {
        if (DevKey.isDown("KeyF")) {
            Rpg.inventory.keyItems.receive("FlopBlindBox");
        }
    });
}

function enrichCollectorNpc(lvl: LvlType.PlainsSuggestiveFlopCollector) {
    const minimumToReachEnd = 6;

    lvl.CollectorNpc.mixin(mxnCutscene, function* () {
        const flopsCount = yield* DramaInventory.askRemoveCount("How many flops can we unbox together?", {
            kind: "key_item",
            id: "FlopBlindBox",
        });

        if (!flopsCount) {
            return;
        }

        const v1 = vnew();

        for (let i = 0; i < flopsCount; i++) {
            const position = vlerp(
                v1.at(lvl.FlopStartMarker),
                lvl.FlopEndMarker,
                i / Math.max(minimumToReachEnd, flopsCount),
            );
            objCollectibleFlop(Rng.intc(0, 998)).at(position).show();
            yield sleep(100);
        }
    });
}
