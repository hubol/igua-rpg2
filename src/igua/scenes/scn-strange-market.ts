import { objText } from "../../assets/fonts";
import { Lvl, LvlType } from "../../assets/generated/levels/generated-level-data";
import { Mzk } from "../../assets/music";
import { container } from "../../lib/pixi/container";
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
    const hubolishObj = objMusician.objHubolish()
        .at(lvl.HubolishMarker)
        .zIndexed(ZIndex.TerrainEntities)
        .show();

    const lottieishObj = objMusician.objLottieish()
        .at(lvl.LottieishMarker)
        .zIndexed(ZIndex.TerrainEntities)
        .show();

    const lyricsObj = objText.MediumBoldIrregular("", { tint: 0x000000 })
        .anchored(0.5, 0.5)
        .at(lvl.LyricsMarker)
        .zIndexed(ZIndex.AboveEntitiesDecals)
        .show();

    container()
        .mixin(mxnCuesheet<"beat" | "lyric">, Mzk.SoldierBoyDemo, DataCuesheet.SoldierBoyDemo)
        .handles("cue:start", (self, { command, data }) => {
            if (command === "beat") {
                hubolishObj.methods.nextBeat();
                lottieishObj.methods.nextBeat();
            }
            else if (command === "lyric") {
                lyricsObj.text = data!;
            }
        })
        .handles("cue:end", (self, { command, data }) => {
            if (command === "lyric" && lyricsObj.text === data) {
                lyricsObj.text = "";
            }
        })
        .show();
}
