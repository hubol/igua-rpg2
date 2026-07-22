import { Lvl, LvlType } from "../../assets/generated/levels/generated-level-data";
import { Mzk } from "../../assets/music";
import { NoAtlasTx } from "../../assets/no-atlas-textures";
import { Jukebox } from "../core/igua-audio";
import { playerObj } from "../objects/obj-player";
import { CtxTerrainPipe } from "../objects/obj-terrain";
import { SceneChanger } from "../systems/scene-changer";
import { scnWorldMap } from "./scn-world-map";

export function scnIndianaOhioBridge() {
    Jukebox.play(Mzk.UndergroundRucksack);
    CtxTerrainPipe.value.texture = NoAtlasTx.Terrain.Pipe.Orange;
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
