import { Cutscene } from "../globals";
import { Rpg } from "../rpg/rpg";
import { MxnSpeaker } from "./mxn-speaker";

export function mxnComputer(speakerObj: MxnSpeaker) {
    return speakerObj.handles("mxnSpeaker.speakingStarted", () => {
        if (Cutscene.current && !Cutscene.current.attributes.computerObjsSpoken.has(speakerObj)) {
            Cutscene.current.attributes.computerObjsSpoken.add(speakerObj);
            Rpg.experience.reward.computer.onInteract("noop");
        }
    });
}
