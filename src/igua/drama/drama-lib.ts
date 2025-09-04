import { SubjectiveColorAnalyzer } from "../../lib/color/subjective-color-analyzer";
import { Cutscene } from "../globals";
import { mxnSpeaker } from "../mixins/mxn-speaker";

export namespace DramaLib {
    function getName(speaker = Speaker.current) {
        return speaker?.is(mxnSpeaker) ? speaker.speaker.name : "???";
    }

    function getColors(speaker = Speaker.current) {
        const primary = speaker?.is(mxnSpeaker) ? speaker.speaker.colorPrimary : 0x600000;
        const secondary = speaker?.is(mxnSpeaker) ? speaker.speaker.colorSecondary : 0x400000;
        const textPrimary = SubjectiveColorAnalyzer.getPreferredTextColor(primary);
        const textSecondary = SubjectiveColorAnalyzer.getPreferredTextColor(secondary);

        return {
            primary,
            secondary,
            textPrimary,
            textSecondary,
        };
    }

    export const Speaker = {
        get current() {
            return Cutscene.current?.attributes?.speaker?.destroyed
                ? null
                : (Cutscene.current?.attributes.speaker ?? null);
        },
        getName,
        getColors,
    };

    export namespace Speaker {
        export type Colors = ReturnType<typeof getColors>;
    }
}
