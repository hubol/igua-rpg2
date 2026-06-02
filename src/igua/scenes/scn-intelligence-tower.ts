import { DisplayObject } from "pixi.js";
import { Lvl, LvlType } from "../../assets/generated/levels/generated-level-data";
import { Instances } from "../../lib/game-engine/instances";
import { Rng } from "../../lib/math/rng";
import { ObjDoor, objDoor } from "../objects/obj-door";
import { playerObj } from "../objects/obj-player";
import { Rpg } from "../rpg/rpg";

export function scnIntelligenceTower() {
    const lvl = Lvl.IntelligenceTower();

    enrichCheckTime(lvl);

    const checkpointName = Rpg.character.position.checkpointName;
    if (checkpointName.startsWith("level") || checkpointName.startsWith("wrong")) {
        const doorObjs = Instances(objDoor, (obj) => obj.y > playerObj.y - 50 && obj.y < playerObj.y - 40);

        if (doorObjs.length === 0) {
            return;
        }

        playerObj.x = Rng.item(doorObjs).x;
        playerObj.auto.setFacingImmediately(-1);
    }
}

function enrichCheckTime(lvl: LvlType.IntelligenceTower) {
    const hourOptions = [12, 3, 6, 9] as const;

    const doorObjs: Record<typeof hourOptions[number], ObjDoor> = {
        "12": lvl.TimeCheck12Door,
        "3": lvl.TimeCheck3Door,
        "6": lvl.TimeCheck6Door,
        "9": lvl.TimeCheck9Door,
    };

    const hours = Rng.item(hourOptions);
    lvl.TimeCheckClock.objEsotericClock.hours = hours;
    const doorObj = doorObjs[hours];
    doorObj.objDoor.checkpointName = "level2";
}
