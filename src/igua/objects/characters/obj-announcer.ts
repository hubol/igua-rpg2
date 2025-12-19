import { Sprite, Texture } from "pixi.js";
import { Tx } from "../../../assets/textures";
import { SoundInstance } from "../../../lib/game-engine/audio/sound";
import { container } from "../../../lib/pixi/container";
import { DataCuesheet } from "../../data/data-cuesheet";
import { mxnBoilPivot } from "../../mixins/mxn-boil-pivot";
import { mxnCuesheet } from "../../mixins/mxn-cuesheet";

type Command = "lip" | "done";

const txsMouth = (() => {
    const txsMouth = Tx.Characters.Announcer.Mouth.split({ width: 98 });
    return {
        default: txsMouth[0],
        o0: txsMouth[1],
        o1: txsMouth[2],
        tall: txsMouth[3],
        wide: txsMouth[4],
        teeth: txsMouth[5],
        tongue: txsMouth[6],
    };
})();

export function objAnnouncer(soundInstance: SoundInstance, cuesheet: DataCuesheet<Command>) {
    let done = false;
    const mouthObj = Sprite.from(txsMouth.default);

    return container(
        Sprite.from(Tx.Characters.Announcer.Noggin).anchored(0.5, 1),
        Sprite.from(Tx.Characters.Announcer.Eyes).at(-81, -140).mixin(mxnBoilPivot),
        mouthObj.at(-50, -93),
        Sprite.from(Tx.Characters.Announcer.Face).at(-90, -117).mixin(mxnBoilPivot),
        Sprite.from(Tx.Characters.Announcer.Arm).at(-220, -73).mixin(mxnBoilPivot),
        Sprite.from(Tx.Characters.Announcer.Arm).at(220, -73).scaled(-1, 1).mixin(mxnBoilPivot),
    )
        .mixin(mxnCuesheet<Command>, soundInstance, cuesheet)
        .handles("cue:start", (_, message) => {
            if (message.command === "done") {
                done = true;
            }
            if (done) {
                return;
            }
            if (message.command === "lip" && message.data) {
                const tx = (txsMouth as any)[message.data] as Texture | undefined;
                if (tx) {
                    mouthObj.texture = tx;
                }
            }
        });
}
