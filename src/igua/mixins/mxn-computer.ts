import { Cutscene } from "../globals";
import { RpgExperienceRewarder } from "../rpg/rpg-experience-rewarder";
import { MxnSpeaker } from "./mxn-speaker";

export function mxnComputer(speakerObj: MxnSpeaker) {
    return speakerObj.handles("mxnSpeaker.speakingStarted", () => {
        if (Cutscene.current && !Cutscene.current.attributes.computerObjsSpoken.has(speakerObj)) {
            Cutscene.current.attributes.computerObjsSpoken.add(speakerObj);
            RpgExperienceRewarder.computer.onInteract("noop");
        }
    });
}
