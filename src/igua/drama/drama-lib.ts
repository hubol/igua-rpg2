import { SubjectiveColorAnalyzer } from "../../lib/color/subjective-color-analyzer";
import { renderer } from "../current-pixi-renderer";
import { Cutscene, scene } from "../globals";
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

    function getWorldCenter(speaker = Speaker.current) {
        return speaker?.getWorldCenter()
            ?? scene.camera.vcpy().add(renderer.width / 2, renderer.height / 2);
    }

    export const Speaker = {
        get current() {
            return Cutscene.current?.attributes?.speaker?.destroyed
                ? null
                : (Cutscene.current?.attributes.speaker ?? null);
        },
        getName,
        getColors,
        getWorldCenter,
    };

    export namespace Speaker {
        export type Colors = ReturnType<typeof getColors>;
    }
}
