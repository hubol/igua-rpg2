import { DisplayObject } from "pixi.js";
import { Lvl, LvlType } from "../../assets/generated/levels/generated-level-data";
import { sleep } from "../../lib/game-engine/routines/sleep";
import { DramaInventory } from "../drama/drama-inventory";
import { dramaShop } from "../drama/drama-shop";
import { show } from "../drama/show";
import { scene } from "../globals";
import { mxnCutscene } from "../mixins/mxn-cutscene";
import { objPipe } from "../objects/obj-terrain";
import { SceneChanger } from "../systems/scene-changer";
import { scnWorldMap } from "./scn-world-map";

export function scnGreatTower() {
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
        const delta = 1000;

        while (true) {
            for (const blockObj of blockObjs) {
                blockObj.x += delta;
                yield sleep(2000);
                blockObj.x -= delta;
            }
        }
    });
}

function enrichRacePipesRegion(lvl: LvlType.GreatTower) {
    const delta = 102;
    const obj = lvl.RacePipesRegion;

    let x = 0;
    let remainingWidth = obj.width;

    const pipeObjs: DisplayObject[] = [];

    while (remainingWidth > 0) {
        const pipeWidth = Math.min(delta, remainingWidth);
        const pipeObj = objPipe().at(obj).add(x, 0);
        pipeObj.width = pipeWidth;
        pipeObjs.push(pipeObj);

        x += pipeWidth;
        remainingWidth -= pipeWidth;
    }

    scene.stage.coro(function* () {
        // This is so stupid
        const delta = 1000;

        while (true) {
            for (const pipeObj of pipeObjs) {
                pipeObj.x += delta;
                yield sleep(350);
                pipeObj.x -= delta;
            }
        }
    });
}

function enrichReward(lvl: LvlType.GreatTower) {
    lvl.EndingRewarder.mixin(mxnCutscene, function* () {
        yield* show("You did great.");
        yield* DramaInventory.receiveItems([{ kind: "equipment", id: "DefensePhysicalAndPerfectBonus", level: 2 }]);
        yield* show("Bye-bye!!");
        SceneChanger.create({ sceneName: scnWorldMap.name, checkpointName: "" })!.changeScene();
    });
}
