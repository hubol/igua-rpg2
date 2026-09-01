import { Container, DisplayObject } from "pixi.js";
import { Sfx } from "../../assets/sounds";
import { interp } from "../../lib/game-engine/routines/interp";
import { Rng } from "../../lib/math/rng";
import { merge } from "../../lib/object/merge";
import { mxnSpeakingMouth } from "./mxn-speaking-mouth";

interface MxnSpeakerArgs {
    name: string;
    tintPrimary: number;
    tintSecondary: number;
}

export function mxnSpeaker(obj: DisplayObject, args: MxnSpeakerArgs) {
    const speaker = merge(args, { spokeOnceInCurrentScene: false });
    const speakerObj = obj.merge({ speaker })
        .dispatches<"mxnSpeaker.speakingStarted">()
        .dispatches<"mxnSpeaker.speakingEnded">();

    speakerObj.handles("mxnSpeaker.speakingEnded", () => speaker.spokeOnceInCurrentScene = true);

    if (obj instanceof Container) {
        const speakingMouthObjs = obj.findIs(mxnSpeakingMouth);

        if (speakingMouthObjs.length) {
            let speakingStartedCount = 0;
            let isSpeaking = false;

            speakerObj
                .handles("mxnSpeaker.speakingStarted", (self) => {
                    speakingStartedCount++;
                    isSpeaking = true;
                })
                .handles("mxnSpeaker.speakingEnded", () => {
                    isSpeaking = false;
                });

            for (const speakingMouthObj of speakingMouthObjs) {
                speakingMouthObj
                    .coro(function* (self) {
                        let speakingHandledCount = 0;

                        while (true) {
                            yield () => isSpeaking && speakingStartedCount > speakingHandledCount && self.worldVisible;
                            speakingHandledCount = speakingStartedCount;
                            const count = Rng.intc(2, 4);
                            for (let i = 0; i < count; i++) {
                                yield interp(self.mxnSpeakingMouth, "agapeUnit")
                                    .to(1)
                                    .over(self.mxnSpeakingMouth.baseAnimationDuration + Rng.float(150, 225));
                                self.play(Sfx.Iguana.Speak0.rate(0.8, 1.2));
                                yield interp(self.mxnSpeakingMouth, "agapeUnit")
                                    .to(0)
                                    .over(self.mxnSpeakingMouth.baseAnimationDuration + Rng.float(100, 150));
                                if (!isSpeaking) {
                                    break;
                                }
                            }
                        }
                    });
            }
        }
    }

    return speakerObj;
}

export type MxnSpeaker = ReturnType<typeof mxnSpeaker>;
export namespace MxnSpeaker {
    export type Args = MxnSpeakerArgs;
}
