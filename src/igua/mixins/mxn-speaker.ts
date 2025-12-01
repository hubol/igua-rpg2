import { Container, DisplayObject } from "pixi.js";
import { Sfx } from "../../assets/sounds";
import { interp } from "../../lib/game-engine/routines/interp";
import { Rng } from "../../lib/math/rng";
import { merge } from "../../lib/object/merge";
import { mxnSpeakingMouth } from "./mxn-speaking-mouth";

interface MxnSpeakerArgs {
    name: string;
    colorPrimary: number;
    colorSecondary: number;
}

export function mxnSpeaker(obj: DisplayObject, args: MxnSpeakerArgs) {
    const speaker = merge(args, { spokeOnceInCurrentScene: false });
    const speakerObj = obj.merge({ speaker })
        .dispatches<"mxnSpeaker.speakingStarted">()
        .dispatches<"mxnSpeaker.speakingEnded">();

    speakerObj.handles("mxnSpeaker.speakingEnded", () => speaker.spokeOnceInCurrentScene = true);

    if (obj instanceof Container) {
        const speakingMouthObj = obj.findIs(mxnSpeakingMouth).last;

        if (speakingMouthObj) {
            let speakingStartedCount = 0;
            let isSpeaking = false;

            speakerObj.coro(function* (self) {
                let speakingHandledCount = 0;

                while (true) {
                    yield () => isSpeaking && speakingStartedCount > speakingHandledCount;
                    speakingStartedCount = speakingHandledCount;
                    const count = Rng.intc(2, 4);
                    for (let i = 0; i < count; i++) {
                        yield interp(speakingMouthObj.mxnSpeakingMouth, "agapeUnit").to(1).over(Rng.float(150, 225));
                        self.play(Sfx.Iguana.Speak0.rate(0.8, 1.2));
                        yield interp(speakingMouthObj.mxnSpeakingMouth, "agapeUnit").to(0).over(Rng.float(100, 150));
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
    }

    return speakerObj;
}

export type MxnSpeaker = ReturnType<typeof mxnSpeaker>;
