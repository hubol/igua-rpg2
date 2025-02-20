import { DisplayObject } from "pixi.js";

interface MxnSpeakerArgs {
    name: string;
    colorPrimary: number;
    colorSecondary: number;
}

export function mxnSpeaker(obj: DisplayObject, speaker: MxnSpeakerArgs) {
    return obj.merge({ speaker })
        .dispatches<"mxnSpeaker.speakingStarted">()
        .dispatches<"mxnSpeaker.speakingEnded">();
}

export type MxnSpeaker = ReturnType<typeof mxnSpeaker>;
