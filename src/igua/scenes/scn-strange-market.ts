import { DisplayObject } from "pixi.js";
import { objText } from "../../assets/fonts";
import { Lvl, LvlType } from "../../assets/generated/levels/generated-level-data";
import { Mzk } from "../../assets/music";
import { interpvr } from "../../lib/game-engine/routines/interp";
import { sleep } from "../../lib/game-engine/routines/sleep";
import { Rng } from "../../lib/math/rng";
import { container } from "../../lib/pixi/container";
import { Jukebox } from "../core/igua-audio";
import { ZIndex } from "../core/scene/z-index";
import { DataCuesheet } from "../data/data-cuesheet";
import { mxnCuesheet } from "../mixins/mxn-cuesheet";
import { mxnNudgeAppear } from "../mixins/mxn-nudge-appear";
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

    let nudgeGentleHubol = false;

    container()
        .mixin(mxnCuesheet<"beat" | "lyric" | "lip">, Mzk.SoldierBoyDemo, DataCuesheet.SoldierBoyDemo)
        .handles("cue:start", (self, { command, data }) => {
            if (command === "beat") {
                hubolishObj.methods.nextBeat();
                lottieishObj.methods.nextBeat();

                nudgeGentleHubol = !nudgeGentleHubol;

                if (nudgeGentleHubol) {
                    hubolishObj.mixin(mxnGentleNudge);
                }
                else {
                    lottieishObj.mixin(mxnGentleNudge);
                }
            }
            else if (command === "lyric") {
                lyricsObj.text = data!;
            }
            else if (command === "lip") {
                hubolishObj.methods.setLip(data);
            }
        })
        .handles("cue:end", (self, { command, data }) => {
            if (command === "lyric" && lyricsObj.text === data) {
                lyricsObj.text = "";
            }
            else if (command === "lip") {
                hubolishObj.methods.unsetLip(data);
            }
        })
        .show();
}

function mxnGentleNudge(obj: DisplayObject) {
    return obj.coro(function* () {
        yield interpvr(obj.pivot).translate(0, 5).over(100);
        yield sleep(100);
        yield interpvr(obj.pivot).translate(0, -5).over(400);
    });
}
