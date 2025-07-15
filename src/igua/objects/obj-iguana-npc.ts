import { Sfx } from "../../assets/sounds";
import { SubjectiveColorAnalyzer } from "../../lib/color/subjective-color-analyzer";
import { Logger } from "../../lib/game-engine/logger";
import { interp } from "../../lib/game-engine/routines/interp";
import { Rng } from "../../lib/math/rng";
import { DataNpcPersona } from "../data/data-npc-personas";
import { Cutscene } from "../globals";
import { IguanaLooks } from "../iguana/looks";
import { mxnIguanaEditable } from "../mixins/mxn-iguana-editable";
import { mxnSpeaker } from "../mixins/mxn-speaker";
import { mxnStartPosition } from "../mixins/mxn-start-position";
import { RpgExperienceRewarder } from "../rpg/rpg-experience-rewarder";
import { RpgProgress } from "../rpg/rpg-progress";
import { objIguanaLocomotive } from "./obj-iguana-locomotive";

export function objIguanaNpc(npcPersonaId: DataNpcPersona.Id) {
    const persona = DataNpcPersona.getById(npcPersonaId as any);

    let speakingStartedCount = 0;
    let isSpeaking = false;

    return objIguanaLocomotive(persona.looks)
        .mixin(mxnIguanaEditable, persona.looks)
        .mixin(mxnSpeaker, { name: persona.name, ...getSpeakerColors(persona.looks) })
        .mixin(mxnStartPosition)
        .coro(function* (self) {
            let speakingHandledCount = 0;

            while (true) {
                yield () => isSpeaking && speakingStartedCount > speakingHandledCount;
                speakingStartedCount = speakingHandledCount;
                const count = Rng.intc(2, 4);
                for (let i = 0; i < count; i++) {
                    yield interp(self.head.mouth, "agape").to(1).over(Rng.float(150, 225));
                    Sfx.Iguana.Speak0.rate(0.8, 1.2).play();
                    yield interp(self.head.mouth, "agape").to(0).over(Rng.float(100, 150));
                    if (!isSpeaking) {
                        break;
                    }
                }
            }
        })
        .handles("mxnSpeaker.speakingStarted", () => {
            const playerHasMetNpc = RpgProgress.uids.metNpcPersonaIds.has(persona.id);
            const spokenDuringCutscene = Cutscene.current
                && Cutscene.current.attributes.speakerNpcPersonaIds.has(persona.id);

            RpgExperienceRewarder.social.onNpcSpeak(
                playerHasMetNpc ? (spokenDuringCutscene ? "default" : "first_in_cutscene") : "first_ever",
            );
            RpgProgress.uids.metNpcPersonaIds.add(persona.id);
            if (Cutscene.current) {
                Cutscene.current.attributes.speakerNpcPersonaIds.add(persona.id);
            }

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
