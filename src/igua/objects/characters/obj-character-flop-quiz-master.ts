import { Sprite } from "pixi.js";
import { Sfx } from "../../../assets/sounds";
import { Tx } from "../../../assets/textures";
import { container } from "../../../lib/pixi/container";
import { mxnDetectPlayer } from "../../mixins/mxn-detect-player";
import { mxnSpeaker } from "../../mixins/mxn-speaker";
import { objAngelEyes } from "../enemies/obj-angel-eyes";

export function objCharacterFlopQuizMaster() {
    return container(
        Sprite.from(Tx.Characters.FlopQuizMaster.Head)
            .anchored(0.5, 1),
        objAngelEyes({
            defaultEyelidRestingPosition: 0,
            eyelidsTint: 0xFF7CCF,
            gap: 20,
            pupilRestStyle: {
                kind: "cross_eyed",
                offsetFromCenter: 5,
            },
            pupilsTint: 0x000000,
            pupilsTx: Tx.Characters.FlopQuizMaster.Pupil,
            scleraTx: Tx.Characters.FlopQuizMaster.Sclera,
        })
            .at(0, -10),
    )
        .mixin(mxnDetectPlayer)
        .mixin(mxnSpeaker, { name: "Flop King", tintPrimary: 0xFF7CCF, tintSecondary: 0x000000 })
        .handles("mxnSpeaker.speakingStarted", (self) => self.play(Sfx.Character.FlopQuizMasterSpeak.rate(0.9, 1.1)));
}
