import { Lvl, LvlType } from "../../assets/generated/levels/generated-level-data";
import { Mzk } from "../../assets/music";
import { factor, interpvr } from "../../lib/game-engine/routines/interp";
import { onPrimitiveMutate } from "../../lib/game-engine/routines/on-primitive-mutate";
import { SceneLocal } from "../../lib/game-engine/scene-local";
import { container } from "../../lib/pixi/container";
import { Jukebox } from "../core/igua-audio";
import { ZIndex } from "../core/scene/z-index";
import { DramaInventory } from "../drama/drama-inventory";
import { DramaWallet } from "../drama/drama-wallet";
import { ask, show } from "../drama/show";
import { Cutscene } from "../globals";
import { mxnCutscene } from "../mixins/mxn-cutscene";
import { CtxPocketItems } from "../objects/collectibles/obj-collectible-pocket-item-spawner";
import { playerObj } from "../objects/obj-player";
import { objStatusBar } from "../objects/overlay/obj-status-bar";
import { Rpg } from "../rpg/rpg";
import { RpgInventory } from "../rpg/rpg-inventory";

const CtxObstacleCourseMinigame = new SceneLocal(() => ({
    isActive: false,
    secondsRemaining: 0,
}));

export function scnObstacleCourse() {
    Jukebox.play(Mzk.PerishInstrument);
    CtxPocketItems.value.pocketItemIds.typeA = "Wheat";
    CtxPocketItems.value.pocketItemIds.typeB = "Beet";
    CtxPocketItems.value.variant = "objFloating";
    CtxPocketItems.value.behavior = "respawn";
    const lvl = Lvl.ObstacleCourse();
    enrichMinigameManager(lvl);
}

function objMinigameRemainingTimeIndicator(lvl: LvlType.ObstacleCourse) {
    return objStatusBar.objAutoUpdated({
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
        if (yield* DramaWallet.askSpendValuables("It costs 100 valuables to play. We doin this?", 100)) {
            yield interpvr(lvl.RestrictedBlock).translate(0, 50).over(500);
            CtxObstacleCourseMinigame.value.secondsRemaining = 60;
            objMinigameController(lvl).show();
        }
    });
}

const PrizeConsts = {
    beet: [{ kind: "potion", id: "AttributeStrengthUp" }, { kind: "equipment", id: "NailFile", level: 1 }],
    wheat: [{ kind: "potion", id: "AttributeStrengthUp" }, { kind: "equipment", id: "PatheticCage", level: 1 }],
} satisfies Record<string, RpgInventory.Item[]>;

function objMinigameController(lvl: LvlType.ObstacleCourse) {
    let steps = 0;
    return container()
        .coro(function* (self) {
            yield onPrimitiveMutate(() => Rpg.inventory.pocket.count("Wheat"));
            CtxObstacleCourseMinigame.value.isActive = true;
            const indicatorObj = objMinigameRemainingTimeIndicator(lvl);

            self.coro(function* () {
                while (true) {
                    yield () => Rpg.inventory.pocket.count("Wheat") >= 50;
                    yield Cutscene.play(function* () {
                        // TODO sick ass animation for this
                        yield* DramaInventory.removeCount({ kind: "pocket_item", id: "Wheat" }, 50);
                        const prize = PrizeConsts.wheat[Rpg.flags.obstacleCourse.wheatPrizesCount++];
                        if (prize) {
                            Rpg.inventory.receive(prize);
                        }
                        else {
                            for (let i = 0; i < 5; i++) {
                                Rpg.inventory.receive({ id: "FlopBlindBox", kind: "key_item" });
                            }
                        }

                        yield* show("Gave a prize. Check inv.");
                    }).done;
                }
            });

            // TODO copy-paste sucks

            self.coro(function* () {
                while (true) {
                    yield () => Rpg.inventory.pocket.count("Beet") >= 50;
                    yield Cutscene.play(function* () {
                        // TODO sick ass animation for this
                        yield* DramaInventory.removeCount({ kind: "pocket_item", id: "Beet" }, 50);
                        const prize = PrizeConsts.beet[Rpg.flags.obstacleCourse.beetPrizesCount++];
                        if (prize) {
                            Rpg.inventory.receive(prize);
                        }
                        else {
                            for (let i = 0; i < 5; i++) {
                                Rpg.inventory.receive({ id: "FlopBlindBox", kind: "key_item" });
                            }
                        }

                        yield* show("Gave a prize. Check inv.");
                    }).done;
                }
            });

            self.step(() => {
                if (playerObj.hasControl && ++steps >= 60) {
                    steps = 0;

                    CtxObstacleCourseMinigame.value.secondsRemaining = Math.max(
                        0,
                        CtxObstacleCourseMinigame.value.secondsRemaining - 1,
                    );

                    if (CtxObstacleCourseMinigame.value.secondsRemaining === 0) {
                        CtxObstacleCourseMinigame.value.isActive = false;
                        Cutscene.play(function* () {
                            yield* dramaEndMinigame(lvl);
                            indicatorObj.destroy();
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
    // TODO If I find myself doing shit like this a lot, it might be a good idea to invent a way
    // for the cutscene coro to execute before the camera is applied
    const movePlayerObj = container()
        .coro(function* (self) {
            yield interpvr(playerObj).factor(factor.sine).to(lvl.ResetPlayerMarker).over(4000);
            self.destroy();
        })
        .show();
    yield () => movePlayerObj.destroyed;
    playerObj.physicsEnabled = true;
    yield interpvr(lvl.RestrictedBlock).translate(0, -50).over(500);
}
