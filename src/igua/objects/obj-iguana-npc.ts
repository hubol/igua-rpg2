import { SubjectiveColorAnalyzer } from "../../lib/color/subjective-color-analyzer";
import { DataNpcPersona } from "../data/data-npc-persona";
import { IguanaLooks } from "../iguana/looks";
import { mxnIguanaEditable } from "../mixins/mxn-iguana-editable";
import { mxnIguanaSpeaker } from "../mixins/mxn-iguana-speaker";
import { mxnStartPosition } from "../mixins/mxn-start-position";
import { objIguanaLocomotive } from "./obj-iguana-locomotive";

export function objIguanaNpc(npcPersonaId: DataNpcPersona.Id) {
    const persona = DataNpcPersona.getById(npcPersonaId as any);

    return objIguanaLocomotive(persona.looks)
        .merge({ objIguanaNpc: { persona } })
        .mixin(mxnIguanaEditable, persona.looks)
        .mixin(mxnStartPosition)
        .mixin(mxnIguanaSpeaker, persona)
        .track(objIguanaNpc);
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

export type ObjIguanaNpc = ReturnType<typeof objIguanaNpc>;
