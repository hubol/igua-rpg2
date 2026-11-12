import { Lvl } from "../../assets/generated/levels/generated-level-data";
import { Mzk } from "../../assets/music";
import { NoAtlasTx } from "../../assets/no-atlas-textures";
import { Jukebox } from "../core/igua-audio";
import { CtxTerrainPipe } from "../objects/obj-terrain";

export function scnOhioGhostTown() {
    Jukebox.play(Mzk.OldWays);
    CtxTerrainPipe.value.texture = NoAtlasTx.Terrain.Pipe.Brick;
    Lvl.OhioGhostTown();
}
