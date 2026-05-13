import { Lvl } from "../../assets/generated/levels/generated-level-data";
import { Mzk } from "../../assets/music";
import { sleep } from "../../lib/game-engine/routines/sleep";
import { Jukebox } from "../core/igua-audio";
import { show } from "../drama/show";
import { Cutscene, scene } from "../globals";
import { playerObj } from "../objects/obj-player";
import { SceneChanger } from "../systems/scene-changer";
import { scnIndianaHallOfDoors } from "./scn-indiana-hall-of-doors";

export function scnIndianaHallEmpty() {
    Jukebox.play(Mzk.SodaMachine);
    Lvl.IndianaHallEmpty();

    const sceneChanger = SceneChanger.create({
        sceneName: scnIndianaHallOfDoors.name,
        checkpointName: "fromMagicDemo",
    });

    const cutsceneFn = function* () {
        yield* show("Nothing here.");
        sceneChanger.changeScene();
    };

    scene.stage
        .coro(function* () {
            yield sleep(2000);
            Cutscene.play(cutsceneFn, { speaker: playerObj });
        });
}
