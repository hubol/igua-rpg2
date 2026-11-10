import { Lvl } from "../../assets/generated/levels/generated-level-data";
import { NoAtlasTx } from "../../assets/no-atlas-textures";
import { DramaLib } from "../drama/drama-lib";
import { mxnEsotericPersonalComputer } from "../mixins/esoteric/mxn-esoteric-personal-computer";
import { mxnGift } from "../mixins/mxn-gift";
import { objCharacterComputerIbm } from "../objects/characters/obj-character-computer-ibm";
import { CtxTerrainPipe } from "../objects/obj-terrain";
import { Rpg } from "../rpg/rpg";

export function scnOhioGhostTownInterior() {
    DramaLib.Speaker.isDarkMode = true;
    CtxTerrainPipe.value.texture = NoAtlasTx.Terrain.Pipe.Brick;
    const lvl = Lvl.OhioGhostTownInterior();

    lvl.Gift
        .mixin(mxnGift, "Ohio.GhostTown.Interior.Software");

    objCharacterComputerIbm()
        .at(lvl.ComputerMarker)
        .mixin(mxnEsotericPersonalComputer, Rpg.microcosms["Ohio.GhostTown.PersonalComputer"])
        .handles("mxnEsotericPersonalComputer.booted", self => self.objCharacterComputerIbm.on = true)
        .handles("mxnEsotericPersonalComputer.shutDown", self => self.objCharacterComputerIbm.on = false)
        .show();
}
