import { Lvl } from "../../../assets/generated/levels/generated-level-data";
import { sleep } from "../../../lib/game-engine/routines/sleep";
import { Rng } from "../../../lib/math/rng";
import { scene } from "../../globals";
import { objAngelSnow } from "../../objects/enemies/obj-angel-snow";
import { objEsotericHotPineConeTree } from "../../objects/esoteric/obj-esoteric-hot-pine-cone-tree";
import { playerObj } from "../../objects/obj-player";

export function scnDevAngelSnow() {
    Lvl.Dummy();

    objAngelSnow().at(128, 128).show();

    const treeObjs = [
        objEsotericHotPineConeTree().at(playerObj),
        objEsotericHotPineConeTree().at(300, playerObj.y),
    ]
        .map(obj => obj.show());

    scene.stage
        .coro(function* () {
            while (true) {
                yield sleep(4000);
                Rng.item(treeObjs).objEsotericHotPineConeTree.gainPineCone();
            }
        });
}
