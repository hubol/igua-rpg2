import { Sfx } from "../../assets/sounds";
import { interp } from "../../lib/game-engine/routines/interp";
import { Rng } from "../../lib/math/rng";
import { ObjIguanaLocomotive } from "../objects/obj-iguana-locomotive";
import { MxnSpeaker } from "./mxn-speaker";

export function mxnSpeakingIguana(obj: ObjIguanaLocomotive & MxnSpeaker) {
    let speakingStartedCount = 0;
    let isSpeaking = false;

    return obj.coro(function* (self) {
        let speakingHandledCount = 0;

        while (true) {
            yield () => isSpeaking && speakingStartedCount > speakingHandledCount;
            speakingStartedCount = speakingHandledCount;
            const count = Rng.intc(2, 4);
            for (let i = 0; i < count; i++) {
                yield interp(self.head.mouth, "agape").to(1).over(Rng.float(150, 225));
                self.play(Sfx.Iguana.Speak0.rate(0.8, 1.2));
                yield interp(self.head.mouth, "agape").to(0).over(Rng.float(100, 150));
                if (!isSpeaking) {
                    break;
                }
            }
        }
    })
        .handles("mxnSpeaker.speakingStarted", (self) => {
            speakingStartedCount++;
            isSpeaking = true;
        })
        .handles("mxnSpeaker.speakingEnded", () => {
            isSpeaking = false;
        });
}
