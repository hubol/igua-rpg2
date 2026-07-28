import { Sprite } from "pixi.js";
import { Lvl } from "../../assets/generated/levels/generated-level-data";
import { sleep } from "../../lib/game-engine/routines/sleep";
import { RgbInt } from "../../lib/math/number-alias-types";
import { Rng } from "../../lib/math/rng";
import { range } from "../../lib/range";
import { DramaInventory } from "../drama/drama-inventory";
import { ask, show } from "../drama/show";
import { mxnCutscene } from "../mixins/mxn-cutscene";
import { mxnSparkling } from "../mixins/mxn-sparkling";
import { mxnSpeaker } from "../mixins/mxn-speaker";
import { playerObj } from "../objects/obj-player";

export function scnDungeonBones() {
    const lvl = Lvl.DungeonBones();
    lvl.Skeleton0.mixin(mxnDungeonSkeleton, "Skeleton of Saint (Red)");
    lvl.Skeleton1.mixin(mxnDungeonSkeleton, "Skeleton of Saint (Yellow)");
    lvl.Skeleton2.mixin(mxnDungeonSkeleton, "Skeleton of Saint (Blue)");
}

function mxnDungeonSkeleton(obj: Sprite, name: string) {
    let isCollected = false;

    return obj
        .mixin(mxnSpeaker, { name, tintPrimary: obj.tint as RgbInt, tintSecondary: 0x000000 })
        .mixin(mxnSparkling)
        .mixin(mxnCutscene, function* () {
            if (isCollected) {
                yield* show("Already desecrated.");
                return;
            }
            if (yield* ask("Search the skeleton for goods? You will become hated.")) {
                playerObj.isBeingPiloted = true;
                playerObj.isDucking = true;
                yield sleep(1000);
                playerObj.isDucking = false;
                playerObj.isBeingPiloted = false;

                const count = Rng.int(6);

                if (count === 0) {
                    yield* show("Found nothing.");
                }
                else {
                    yield* show("Found something.");
                    yield* DramaInventory.receiveItems(
                        range(count).map(() => ({ kind: "pocket_item", id: "BoneTypeA" })),
                    );
                }
                isCollected = true;
            }
        })
        .step(self => self.sparklesPerFrame = isCollected ? 0 : 0.1);
}
