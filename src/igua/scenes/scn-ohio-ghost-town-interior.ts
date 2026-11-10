import { Lvl } from "../../assets/generated/levels/generated-level-data";
import { NoAtlasTx } from "../../assets/no-atlas-textures";
import { mxnGift } from "../mixins/mxn-gift";
import { CtxTerrainPipe } from "../objects/obj-terrain";

export function scnOhioGhostTownInterior() {
    CtxTerrainPipe.value.texture = NoAtlasTx.Terrain.Pipe.Brick;
    const lvl = Lvl.OhioGhostTownInterior();

    lvl.Gift
        .mixin(mxnGift, "Ohio.GhostTown.Interior.Software");
}
