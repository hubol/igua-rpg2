import { DisplayObject } from "pixi.js";
import { Sfx } from "../../assets/sounds";
import { SubjectiveColorAnalyzer } from "../../lib/color/subjective-color-analyzer";
import { Logger } from "../../lib/game-engine/logger";
import { interp } from "../../lib/game-engine/routines/interp";
import { Rng } from "../../lib/math/rng";
import { DataNpcPersona } from "../data/data-npc-persona";
import { Cutscene } from "../globals";
import { IguanaLooks } from "../iguana/looks";
import { mxnIguanaEditable } from "../mixins/mxn-iguana-editable";
import { mxnSpeaker } from "../mixins/mxn-speaker";
import { mxnStartPosition } from "../mixins/mxn-start-position";
import { Rpg } from "../rpg/rpg";
import { objIguanaLocomotive } from "./obj-iguana-locomotive";

export function objIguanaNpc(npcPersonaId: DataNpcPersona.Id) {
    const persona = DataNpcPersona.getById(npcPersonaId as any);

    let speakingStartedCount = 0;
    let isSpeaking = false;

    return objIguanaLocomotive(persona.looks)
        .mixin(mxnIguanaEditable, persona.looks)
        .mixin(mxnRpgIguanaNpc, persona.id)
        .mixin(mxnSpeaker, { name: persona.name, ...objIguanaNpc.getSpeakerColors(persona.looks) })
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
        .handles("mxnSpeaker.speakingStarted", (self) => {
            self.rpgIguanaNpc.onSpeak();

            speakingStartedCount++;
            isSpeaking = true;
        })
        .handles("mxnSpeaker.speakingEnded", () => {
            isSpeaking = false;
        });
}

objIguanaNpc.getSpeakerColors = function getSpeakerColors (looks: IguanaLooks.Serializable) {
    return {
        colorPrimary: looks.head.color,
        colorSecondary: SubjectiveColorAnalyzer.getColorWithHighestContrast(looks.head.color, [
            looks.body.color,
            looks.body.tail.color,
            looks.head.crest.color,
        ]),
    };
};

function mxnRpgIguanaNpc(obj: DisplayObject, id: DataNpcPersona.Id) {
    return obj.merge({
        rpgIguanaNpc: Rpg.iguanaNpc(id),
    });
}
