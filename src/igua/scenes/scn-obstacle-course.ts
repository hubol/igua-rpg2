import { Lvl, LvlType } from "../../assets/generated/levels/generated-level-data";
import { factor, interpvr } from "../../lib/game-engine/routines/interp";
import { onPrimitiveMutate } from "../../lib/game-engine/routines/on-primitive-mutate";
import { SceneLocal } from "../../lib/game-engine/scene-local";
import { container } from "../../lib/pixi/container";
import { ZIndex } from "../core/scene/z-index";
import { ask, show } from "../drama/show";
import { Cutscene } from "../globals";
import { mxnCutscene } from "../mixins/mxn-cutscene";
import { CtxPocketItems } from "../objects/collectibles/obj-collectible-pocket-item-spawner";
import { playerObj } from "../objects/obj-player";
import { objStatusBar } from "../objects/overlay/obj-status-bar";
import { Rpg } from "../rpg/rpg";

const CtxObstacleCourseMinigame = new SceneLocal(() => ({
    secondsRemaining: 0,
}));

export function scnObstacleCourse() {
    CtxPocketItems.value.pocketItemIds.typeA = "Wheat";
    CtxPocketItems.value.pocketItemIds.typeB = "Beet";
    CtxPocketItems.value.variant = "objFloating";
    CtxPocketItems.value.behavior = "respawn";
    const lvl = Lvl.ObstacleCourse();
    enrichMinigameTimer(lvl);
    enrichMinigameManager(lvl);
}

function enrichMinigameTimer(lvl: LvlType.ObstacleCourse) {
    objStatusBar.objAutoUpdated({
        width: lvl.GameHealthbarRegion.width,
        decreases: [{
            tintBar: 0xff7300,
        }],
        height: 9,
        increases: [{
            tintBar: 0x00ff00,
        }],
        maxValue: 60,
        tintBack: 0xf00000,
        tintFront: 0xf0f000,
    }, () => CtxObstacleCourseMinigame.value.secondsRemaining)
        .at(lvl.GameHealthbarRegion)
        .zIndexed(ZIndex.TerrainDecals)
        .show();
}

function enrichMinigameManager(lvl: LvlType.ObstacleCourse) {
    lvl.ObstacleWatcherNpc.mixin(mxnCutscene, function* () {
        if (CtxObstacleCourseMinigame.value.secondsRemaining > 0) {
            yield* show("You should already be playing.");
            return;
        }
        // TODO I think there should be a DramaWallet for this
        if (yield* ask("It costs 100 valuables to play. We doin this?")) {
            Rpg.wallet.spend("valuables", 100);
            yield interpvr(lvl.RestrictedBlock).translate(0, 50).over(500);
            CtxObstacleCourseMinigame.value.secondsRemaining = 60;
            objMinigameTimer(lvl).show();
        }
    });
}

function objMinigameTimer(lvl: LvlType.ObstacleCourse) {
    let steps = 0;
    return container()
        .coro(function* (self) {
            yield onPrimitiveMutate(() => Rpg.inventory.pocket.count("Wheat"));
            self.step(() => {
                if (playerObj.hasControl && ++steps >= 60) {
                    steps = 0;
                    CtxObstacleCourseMinigame.value.secondsRemaining = Math.max(
                        0,
                        CtxObstacleCourseMinigame.value.secondsRemaining - 1,
                    );
                    if (CtxObstacleCourseMinigame.value.secondsRemaining === 0) {
                        Cutscene.play(function* () {
                            yield* dramaEndMinigame(lvl);
                        });
                        self.destroy();
                    }
                }
            });
        });
}

function* dramaEndMinigame(lvl: LvlType.ObstacleCourse) {
    playerObj.physicsEnabled = false;
    playerObj.speed.at(0, 0);
    yield interpvr(playerObj).factor(factor.sine).to(lvl.ResetPlayerMarker).over(4000);
    playerObj.physicsEnabled = true;
    yield interpvr(lvl.RestrictedBlock).translate(0, -50).over(500);
}
