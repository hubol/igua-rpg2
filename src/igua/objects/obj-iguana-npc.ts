import { DisplayObject } from "pixi.js";
import { SubjectiveColorAnalyzer } from "../../lib/color/subjective-color-analyzer";
import { DataNpcPersona } from "../data/data-npc-persona";
import { IguanaLooks } from "../iguana/looks";
import { mxnIguanaEditable } from "../mixins/mxn-iguana-editable";
import { mxnSpeaker } from "../mixins/mxn-speaker";
import { mxnStartPosition } from "../mixins/mxn-start-position";
import { Rpg } from "../rpg/rpg";
import { objIguanaLocomotive } from "./obj-iguana-locomotive";

export function objIguanaNpc(npcPersonaId: DataNpcPersona.Id) {
    const persona = DataNpcPersona.getById(npcPersonaId as any);

    return objIguanaLocomotive(persona.looks)
        .mixin(mxnIguanaEditable, persona.looks)
        .mixin(mxnRpgIguanaNpc, persona.id)
        .mixin(mxnSpeaker, { name: persona.name, ...objIguanaNpc.getSpeakerColors(persona.looks) })
        .mixin(mxnStartPosition)
        .handles("mxnSpeaker.speakingStarted", (self) => {
            self.rpgIguanaNpc.onSpeak();
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
