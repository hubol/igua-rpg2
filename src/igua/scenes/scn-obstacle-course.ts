import { Lvl, LvlType } from "../../assets/generated/levels/generated-level-data";
import { Mzk } from "../../assets/music";
import { Coro } from "../../lib/game-engine/routines/coro";
import { factor, interp, interpvr } from "../../lib/game-engine/routines/interp";
import { onPrimitiveMutate } from "../../lib/game-engine/routines/on-primitive-mutate";
import { SceneLocal } from "../../lib/game-engine/scene-local";
import { vlerp } from "../../lib/math/vector";
import { vnew } from "../../lib/math/vector-type";
import { container } from "../../lib/pixi/container";
import { range } from "../../lib/range";
import { Jukebox } from "../core/igua-audio";
import { ZIndex } from "../core/scene/z-index";
import { renderer } from "../current-pixi-renderer";
import { DataNpcPersona } from "../data/data-npc-persona";
import { DataPocketItem } from "../data/data-pocket-item";
import { DramaFacts } from "../drama/drama-facts";
import { DramaInventory } from "../drama/drama-inventory";
import { DramaMisc } from "../drama/drama-misc";
import { DramaWallet } from "../drama/drama-wallet";
import { show } from "../drama/show";
import { Cutscene, scene } from "../globals";
import { objIguanaPuppet } from "../iguana/obj-iguana-puppet";
import { mxnBoilPivot } from "../mixins/mxn-boil-pivot";
import { mxnCutscene } from "../mixins/mxn-cutscene";
import { mxnSinePivot } from "../mixins/mxn-sine-pivot";
import { mxnSpeaker } from "../mixins/mxn-speaker";
import { CtxPocketItems } from "../objects/collectibles/obj-collectible-pocket-item-spawner";
import { objFxPuffyCloud } from "../objects/effects/obj-fx-puffy-cloud";
import { objIguanaNpc } from "../objects/obj-iguana-npc";
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
    enrichDecorations(lvl);
    enrichSecretNpc(lvl);
}

function enrichSecretNpc(lvl: LvlType.ObstacleCourse) {
    lvl.SecretNpc.mixin(mxnCutscene, function* () {
        yield* DramaFacts.memorize("FarmingGods");
    });
}

function enrichDecorations(lvl: LvlType.ObstacleCourse) {
    lvl.WaterShimmerGroup.children.forEach(x => x.mixin(mxnBoilPivot));
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
            yield* Coro.race([
                onPrimitiveMutate(() => Rpg.inventory.pocket.count("Wheat")),
                onPrimitiveMutate(() => Rpg.inventory.pocket.count("Beet")),
            ]);
            CtxObstacleCourseMinigame.value.isActive = true;
            const indicatorObj = objMinigameRemainingTimeIndicator(lvl);

            self.coro(
                function* () {
                    yield* coroAwardPrizeForCollection({
                        npcPersonaId: "WheatGod",
                        pocketItemId: "Wheat",
                        getPrize: () => PrizeConsts.wheat[Rpg.flags.obstacleCourse.wheatPrizesCount++] ?? null,
                    });
                },
            );

            self.coro(
                function* () {
                    yield* coroAwardPrizeForCollection({
                        npcPersonaId: "BeetGod",
                        pocketItemId: "Beet",
                        getPrize: () => PrizeConsts.beet[Rpg.flags.obstacleCourse.beetPrizesCount++] ?? null,
                    });
                },
            );

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
    yield* DramaMisc.levitatePlayer(interpvr(playerObj).factor(factor.sine).to(lvl.ResetPlayerMarker).over(4000));
    yield interpvr(lvl.RestrictedBlock).translate(0, -50).over(500);
}

function objHolyIguana(npcPersonaId: DataNpcPersona.Id) {
    const iguanaNpcObj = objIguanaNpc(npcPersonaId);
    return container(
        objFxPuffyCloud(0xacbddd).at(2, -3),
        iguanaNpcObj,
        objFxPuffyCloud(0xffffff),
    )
        .mixin(mxnSinePivot)
        .merge({ iguanaNpcObj });
}

interface CoroAwardPrizeForCollectionArgs {
    pocketItemId: DataPocketItem.Id;
    npcPersonaId: DataNpcPersona.Id;
    getPrize: () => RpgInventory.Item | null;
}

function* coroAwardPrizeForCollection({ npcPersonaId, pocketItemId, getPrize }: CoroAwardPrizeForCollectionArgs) {
    while (true) {
        yield () => Rpg.inventory.pocket.count(pocketItemId) >= 50;

        const startPosition = vnew(renderer.width / 2 - 64, -64);
        const endPosition = startPosition.vcpy().add(0, 202);

        const vector = vnew();

        const holyIguanaObj = objHolyIguana(npcPersonaId)
            .at(scene.camera)
            .add(startPosition)
            .step(self =>
                self.at(scene.camera).add(vlerp(vector.at(startPosition), endPosition, lerpRef.factor)).vround()
            )
            .show();

        const lerpRef = {
            factor: 0,
        };

        yield Cutscene.play(function* () {
            yield interp(lerpRef, "factor").factor(factor.sine).to(1).over(2000);
            // TODO sick ass animation for this
            yield* DramaInventory.removeCount({ kind: "pocket_item", id: pocketItemId }, 50);
            const prize = getPrize();
            if (prize) {
                yield* DramaInventory.receiveItems([prize]);
            }
            else {
                yield* DramaInventory.receiveItems(range(5).map(() => ({ id: "FlopBlindBox", kind: "key_item" })));
            }

            yield* show("A blessing for thy harvest.", "Many thanks unto thine ass.");
            yield interp(lerpRef, "factor").factor(factor.sine).to(0).over(2000);
            holyIguanaObj.destroy();
        }, { speaker: holyIguanaObj.iguanaNpcObj }).done;
    }
}
