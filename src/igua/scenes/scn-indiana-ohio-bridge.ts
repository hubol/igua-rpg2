import { Lvl, LvlType } from "../../assets/generated/levels/generated-level-data";
import { playerObj } from "../objects/obj-player";
import { SceneChanger } from "../systems/scene-changer";
import { scnWorldMap } from "./scn-world-map";

export function scnIndianaOhioBridge() {
    const lvl = Lvl.IndianaOhioBridge();
    enrichDarkness(lvl);
}

function enrichDarkness(lvl: LvlType.IndianaOhioBridge) {
    if (playerObj.x < 500) {
        return;
    }

    lvl.Darkness.objDarkness.model.exitSceneChanger = SceneChanger.create({
        sceneName: scnWorldMap.name,
        checkpointName: "fromIndianaToOhio",
    });
}
