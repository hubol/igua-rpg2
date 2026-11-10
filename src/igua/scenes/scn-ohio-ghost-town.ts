import { Lvl } from "../../assets/generated/levels/generated-level-data";
import { NoAtlasTx } from "../../assets/no-atlas-textures";
import { CtxTerrainPipe } from "../objects/obj-terrain";

export function scnOhioGhostTown() {
    CtxTerrainPipe.value.texture = NoAtlasTx.Terrain.Pipe.Brick;
    Lvl.OhioGhostTown();
}
