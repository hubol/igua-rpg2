import { Lvl, LvlType } from "../../assets/generated/levels/generated-level-data";
import { Mzk } from "../../assets/music";
import { Jukebox } from "../core/igua-audio";
import { ZIndex } from "../core/scene/z-index";
import { DataCuesheet } from "../data/data-cuesheet";
import { mxnCuesheet } from "../mixins/mxn-cuesheet";
import { objMusician } from "../objects/characters/obj-musician";
import { Rpg } from "../rpg/rpg";

export function scnStrangeMarket() {
    Jukebox.play(Rpg.character.position.checkpointName === "fromAbove" ? Mzk.SoldierBoyDemo : Mzk.BigLove);
    const lvl = Lvl.StrangeMarket();
    enrichMusicians(lvl);
}

function enrichMusicians(lvl: LvlType.StrangeMarket) {
    objMusician.objHubolish().at(lvl.HubolishMarker).zIndexed(ZIndex.TerrainEntities)
        .mixin(mxnCuesheet<"beat">, Mzk.SoldierBoyDemo, DataCuesheet.SoldierBoyDemo)
        .handles("cue:start", (self, message) => {
            if (message === "beat") {
                self.methods.nextBeat();
            }
        })
        .show();
}
