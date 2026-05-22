import { Lvl } from "../../assets/generated/levels/generated-level-data";
import { Instances } from "../../lib/game-engine/instances";
import { Rng } from "../../lib/math/rng";
import { objDoor } from "../objects/obj-door";
import { playerObj } from "../objects/obj-player";
import { Rpg } from "../rpg/rpg";

export function scnIntelligenceTower() {
    Lvl.IntelligenceTower();

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
