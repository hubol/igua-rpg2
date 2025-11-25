import { DisplayObject } from "pixi.js";
import { Lvl, LvlType } from "../../assets/generated/levels/generated-level-data";
import { Mzk } from "../../assets/music";
import { Sfx } from "../../assets/sounds";
import { holdf } from "../../lib/game-engine/routines/hold";
import { interpv, interpvr } from "../../lib/game-engine/routines/interp";
import { sleep } from "../../lib/game-engine/routines/sleep";
import { Jukebox } from "../core/igua-audio";
import { DramaQuests } from "../drama/drama-quests";
import { dramaShop } from "../drama/drama-shop";
import { show } from "../drama/show";
import { Cutscene, scene } from "../globals";
import { mxnCutscene } from "../mixins/mxn-cutscene";
import { mxnSpeaker } from "../mixins/mxn-speaker";
import { CtxPocketItems } from "../objects/collectibles/obj-collectible-pocket-item-spawner";
import { objFxBurstDusty } from "../objects/effects/obj-fx-burst-dusty";
import { objPipe, ObjTerrain } from "../objects/obj-terrain";
import { Rpg } from "../rpg/rpg";
import { SceneChanger } from "../systems/scene-changer";
import { scnWorldMap } from "./scn-world-map";

export function scnGreatTower() {
    CtxPocketItems.value.pocketItemIds.typeA = "EssenceWind";
    Jukebox.play(Mzk.FaithBeam);
    const lvl = Lvl.GreatTower();
    enrichEnemyHearts(lvl);
    enrichShopkeeperNpc(lvl);
    enrichTogglingBlocks(lvl);
    enrichRacePipesRegion(lvl);
    enrichReward(lvl);
}

function mxnEnemyHeart(obj: DisplayObject, { enemyObj, lvl }: { enemyObj: DisplayObject; lvl: LvlType.GreatTower }) {
    return obj
        .step(self => {
            if (enemyObj.destroyed) {
                return;
            }
            self.x = Math.max(
                lvl.EnemyHeartRegion.x,
                Math.min(enemyObj.x, lvl.EnemyHeartRegion.x + lvl.EnemyHeartRegion.width),
            );
        });
}

function enrichEnemyHearts(lvl: LvlType.GreatTower) {
    lvl.EnemyHeartLarge
        .invisible();

    if (Rpg.quest("GreatTower.EnemyHearts").everCompleted) {
        lvl.EnemyHeartLeft.destroy();
        lvl.EnemyHeartRight.destroy();
        return;
    }

    lvl.EnemyHeartLeft.mixin(mxnEnemyHeart, { enemyObj: lvl.MiffedLeft, lvl });
    lvl.EnemyHeartRight.mixin(mxnEnemyHeart, { enemyObj: lvl.MiffedRight, lvl });
    lvl.EnemyHeartLarge
        .mixin(mxnSpeaker, { name: "Heart of Wind", colorPrimary: 0x487723, colorSecondary: 0xD0E840 })
        .coro(function* (self) {
            self.scaled(0.5, 0.5);
            yield holdf(() => lvl.EnemyHeartLeft.collides(lvl.EnemyHeartRight), 3);
            lvl.EnemyHeartLeft.visible = false;
            lvl.EnemyHeartRight.visible = false;
            self.visible = true;
            yield interpv(self.scale).steps(3).to(1, 1).over(200);
            yield () => lvl.MiffedLeft.destroyed && lvl.MiffedRight.destroyed;
            yield interpvr(self).translate(0, -90).over(1000);

            yield Cutscene.play(function* () {
                yield* show(
                    "Sometimes...",
                    "Sometimes love is when a pink and yellow guy have green hearts.",
                    "And the green hearts combine into one.",
                );
                yield* DramaQuests.complete("GreatTower.EnemyHearts");
            }, { speaker: self })
                .done;

            objFxBurstDusty().at(self).show();
            self.destroy();
        })
        .step(self => {
            if (!self.visible) {
                return;
            }

            let count = 0;
            let x = 0;

            if (!lvl.MiffedLeft.destroyed) {
                x += lvl.EnemyHeartLeft.x;
                count += 1;
            }
            if (!lvl.MiffedRight.destroyed) {
                x += lvl.EnemyHeartRight.x;
                count += 1;
            }

            if (count > 0) {
                self.x = Math.round(x / count);
            }
        });
}

function enrichShopkeeperNpc(lvl: LvlType.GreatTower) {
    lvl.ShopkeeperNpc.mixin(mxnCutscene, function* () {
        yield* dramaShop("GreatTower", { primaryTint: 0x404040, secondaryTint: 0x707070 });
    });
}

function enrichTogglingBlocks(lvl: LvlType.GreatTower) {
    const blockObjs = [lvl.TogglingBlock0, lvl.TogglingBlock1];

    scene.stage.coro(function* () {
        while (true) {
            for (const blockObj of blockObjs) {
                ObjTerrain.toggle(blockObj);
                yield sleep(2000);
                blockObj.play(Sfx.Effect.PipeAlternate.rate(0.9, 1.1));
                ObjTerrain.toggle(blockObj);
            }
        }
    });
}

function enrichRacePipesRegion(lvl: LvlType.GreatTower) {
    const delta = 102;
    const obj = lvl.RacePipesRegion;

    let x = 0;
    let remainingWidth = obj.width;

    const pipeObjs: ObjTerrain[] = [];

    while (remainingWidth > 0) {
        const pipeWidth = Math.min(delta, remainingWidth);
        const pipeObj = objPipe().at(obj).add(x, 0);
        pipeObj.width = pipeWidth;
        pipeObjs.push(pipeObj);

        x += pipeWidth;
        remainingWidth -= pipeWidth;
    }

    scene.stage.coro(function* () {
        while (true) {
            for (const pipeObj of pipeObjs) {
                ObjTerrain.toggle(pipeObj);
                yield sleep(350);
                ObjTerrain.toggle(pipeObj);
            }
        }
    });
}

function enrichReward(lvl: LvlType.GreatTower) {
    lvl.EndingRewarder.mixin(mxnCutscene, function* () {
        yield* show("You did great.");
        yield* DramaQuests.complete("GreatTower");
        yield* show("Bye-bye!!");
        SceneChanger.create({ sceneName: scnWorldMap.name, checkpointName: "" })!.changeScene();
    });
}
