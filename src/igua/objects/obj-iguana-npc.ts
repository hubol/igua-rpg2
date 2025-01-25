import { Sfx } from "../../assets/sounds";
import { SubjectiveColorAnalyzer } from "../../lib/color/subjective-color-analyzer";
import { ErrorReporter } from "../../lib/game-engine/error-reporter";
import { interp } from "../../lib/game-engine/routines/interp";
import { Rng } from "../../lib/math/rng";
import { NpcPersonas } from "../data/npc-personas";
import { IguanaLooks } from "../iguana/looks";
import { mxnIguanaEditable } from "../mixins/mxn-iguana-editable";
import { mxnSpeaker } from "../mixins/mxn-speaker";
import { RpgExperienceRewarder } from "../rpg/rpg-experience-rewarder";
import { objIguanaLocomotive } from "./obj-iguana-locomotive";

interface ObjIguanaNpcArgs {
    personaName: keyof typeof NpcPersonas;
}

// TODO should have some way to setup the interact hotspot!
export function objIguanaNpc({ personaName }: ObjIguanaNpcArgs) {
    let persona = NpcPersonas[personaName];
    if (!persona) {
        ErrorReporter.reportMisconfigurationError(
            "objIguanaNpc",
            new Error(`NpcPersona "${personaName}" does not exist!`),
        );
        persona = NpcPersonas.__Unknown__;
    }

    let speakingStartedCount = 0;
    let isSpeaking = false;

    return objIguanaLocomotive(persona.looks)
        .mixin(mxnIguanaEditable, persona.looks)
        .mixin(mxnSpeaker, { name: persona.name, ...getSpeakerColors(persona.looks) })
        .coro(function* (self) {
            let speakingHandledCount = 0;

            while (true) {
                yield () => isSpeaking && speakingStartedCount > speakingHandledCount;
                speakingStartedCount = speakingHandledCount;
                const count = Rng.intc(2, 4);
                for (let i = 0; i < count; i++) {
                    yield interp(self.head.mouth, "agape").to(1).over(Rng.float(150, 225));
                    Sfx.Iguana.Speak0.with.rate(Rng.float(0.8, 1.2)).play();
                    yield interp(self.head.mouth, "agape").to(0).over(Rng.float(100, 150));
                    if (!isSpeaking) {
                        break;
                    }
                }
            }
        })
        .handles("mxnSpeaker.speakingStarted", () => {
            RpgExperienceRewarder.social.onSpeakWithNpc(persona.internalName);
            speakingStartedCount++;
            isSpeaking = true;
        })
        .handles("mxnSpeaker.speakingEnded", () => {
            isSpeaking = false;
        });
}

function getSpeakerColors(looks: IguanaLooks.Serializable) {
    return {
        colorPrimary: looks.head.color,
        colorSecondary: SubjectiveColorAnalyzer.getColorWithHighestContrast(looks.head.color, [
            looks.body.color,
            looks.body.tail.color,
            looks.head.crest.color,
        ]),
    };
}
