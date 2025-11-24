import { Lvl, LvlType } from "../../assets/generated/levels/generated-level-data";
import { Mzk } from "../../assets/music";
import { Sfx } from "../../assets/sounds";
import { sleep } from "../../lib/game-engine/routines/sleep";
import { Jukebox } from "../core/igua-audio";
import { DramaQuests } from "../drama/drama-quests";
import { dramaShop } from "../drama/drama-shop";
import { show } from "../drama/show";
import { scene } from "../globals";
import { mxnCutscene } from "../mixins/mxn-cutscene";
import { objPipe, ObjTerrain } from "../objects/obj-terrain";
import { SceneChanger } from "../systems/scene-changer";
import { scnWorldMap } from "./scn-world-map";

export function scnGreatTower() {
    Jukebox.play(Mzk.FaithBeam);
    const lvl = Lvl.GreatTower();
    enrichShopkeeperNpc(lvl);
    enrichTogglingBlocks(lvl);
    enrichRacePipesRegion(lvl);
    enrichReward(lvl);
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
