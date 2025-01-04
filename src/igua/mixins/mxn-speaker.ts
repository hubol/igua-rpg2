import { DisplayObject } from "pixi.js";

interface MxnSpeakerArgs {
    name: string;
    color: number;
    // TODO head position? Or is that another mixin? mxnHasHead??
}

export function mxnSpeaker(obj: DisplayObject, speaker: MxnSpeakerArgs) {
    return obj.merge({ speaker });
}
