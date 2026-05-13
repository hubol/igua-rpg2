import { sleep } from "../../../lib/game-engine/routines/sleep";
import { container } from "../../../lib/pixi/container";
import { show } from "../../drama/show";
import { Cutscene } from "../../globals";
import { MicrocosmHallOfDoors } from "../../rpg/microcosms/microcosm-hall-of-doors";
import { playerObj } from "../obj-player";

export function objEsotericEmptyHall(cosmHallOfDoors: MicrocosmHallOfDoors) {
    const cutsceneFn = function* () {
        yield* show("Nothing here.");
        cosmHallOfDoors.homeSceneChanger.changeScene();
    };

    return container()
        .coro(function* () {
            yield sleep(2000);
            Cutscene.play(cutsceneFn, { speaker: playerObj });
        });
}
