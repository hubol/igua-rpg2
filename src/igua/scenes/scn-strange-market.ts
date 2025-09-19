import { DisplayObject } from "pixi.js";
import { objText } from "../../assets/fonts";
import { Lvl, LvlType } from "../../assets/generated/levels/generated-level-data";
import { Mzk } from "../../assets/music";
import { interpvr } from "../../lib/game-engine/routines/interp";
import { sleep, sleepf } from "../../lib/game-engine/routines/sleep";
import { Rng } from "../../lib/math/rng";
import { VectorSimple } from "../../lib/math/vector-type";
import { container } from "../../lib/pixi/container";
import { Null } from "../../lib/types/null";
import { Jukebox } from "../core/igua-audio";
import { ZIndex } from "../core/scene/z-index";
import { DataCuesheet } from "../data/data-cuesheet";
import { DataPotion } from "../data/data-potion";
import { mxnCuesheet } from "../mixins/mxn-cuesheet";
import { mxnMotion } from "../mixins/mxn-motion";
import { mxnNudgeAppear } from "../mixins/mxn-nudge-appear";
import { objMusician } from "../objects/characters/obj-musician";
import { objCollectiblePotion } from "../objects/collectibles/obj-collectible-potion";
import { objFxEighthNote } from "../objects/effects/obj-fx-eighth-note";
import { Rpg } from "../rpg/rpg";
import { RpgInventory } from "../rpg/rpg-inventory";

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

    const lyricsObj = objText.MediumBoldIrregular("", { tint: 0xFFB200 })
        .anchored(0.5, 0.5)
        .at(lvl.LyricsMarker)
        .zIndexed(ZIndex.AboveEntitiesDecals)
        .show();

    const miscCommandDataToPotionSpawn = {
        "spawn_wetness": {
            position: lvl.PotionSpawn0,
            potionId: "Wetness",
        },
        "spawn_poison": {
            position: lvl.PotionSpawn1,
            potionId: "Poison",
        },
        "spawn_heal": {
            position: lvl.PotionSpawn2,
            potionId: "RestoreHealth",
        },
    } satisfies Record<string, { potionId: DataPotion.Id; position: VectorSimple }>;

    function createFxLottieishNote(sign = Rng.intp()) {
        const target = [Rng.float(0.5) * sign, Rng.float(-0.2, -0.35)];
        objFxEighthNote()
            .at(lottieishObj)
            .add(10 - Math.sign(target.x) * 8, 0)
            .mixin(mxnMotion)
            .tinted(Rng.choose(0xCB9EFF, 0x546DFF, 0xffffff))
            .step(self => self.speed.moveTowards(target, 0.025))
            .show()
            .speed.at(target.x * -2.3, target.y * 2);
    }

    let nudgeGentleHubol = false;
    let guitarStrumming = false;
    let bassPlucking = false;

    container()
        .mixin(
            mxnCuesheet<"beat" | "lyric" | "lip" | "misc" | "offbeat" | "click">,
            Mzk.SoldierBoyDemo,
            DataCuesheet.interlaceClickCues(DataCuesheet.SoldierBoyDemo, "beat", 3),
        )
        .handles("cue:start", (self, { command, data }) => {
            if (command === "beat" || command === "click") {
                hubolishObj.methods.nextBeat();
                if (guitarStrumming) {
                    lottieishObj.methods.nextBeat();
                    createFxLottieishNote();
                }
            }
            if (bassPlucking && (command === "beat" || command === "offbeat")) {
                nudgeGentleHubol = !nudgeGentleHubol;

                hubolishObj.methods.playLowKey();

                if (nudgeGentleHubol) {
                    hubolishObj.mixin(mxnGentleNudge);
                }
                else {
                    lottieishObj.mixin(mxnGentleNudge);
                }
            }
            if (command === "beat" || command === "offbeat" || command === "click") {
                lyricsObj.seed += 1;
            }
            if (command === "lyric") {
                lyricsObj.text = data!;
            }
            else if (command === "lip") {
                hubolishObj.methods.setLip(data);
            }
            else if (command === "misc") {
                const potionSpawn = miscCommandDataToPotionSpawn[data as keyof typeof miscCommandDataToPotionSpawn];
                if (potionSpawn) {
                    objCollectiblePotion(potionSpawn.potionId).at(potionSpawn.position).show();
                }
                else if (data === "guitar_start") {
                    lottieishObj.methods.setStrumming(true);
                    guitarStrumming = true;
                }
                else if (data === "guitar_end") {
                    self.coro(function* () {
                        for (let i = 0; i < 5; i++) {
                            createFxLottieishNote(i % 2 === 0 ? 1 : -1);
                            yield sleepf(3 + i * 0.5);
                        }
                    });
                    lottieishObj.methods.setStrumming(false);
                    guitarStrumming = false;
                }
                else if (data === "bass_start") {
                    bassPlucking = true;
                }
                else if (data === "bass_end") {
                    bassPlucking = false;
                }
                else if (data === "keys_start") {
                    hubolishObj.state.handsPosition = "on_keys";
                }
                else if (data === "keys_end") {
                    hubolishObj.state.handsPosition = "off_keys";
                }
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
