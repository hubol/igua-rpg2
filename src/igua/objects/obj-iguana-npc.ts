import { SubjectiveColorAnalyzer } from "../../lib/color/subjective-color-analyzer";
import { DataNpcLooks } from "../data/data-npc-looks";
import { DataNpcPersona } from "../data/data-npc-persona";
import { IguanaLooks } from "../iguana/looks";
import { mxnIguanaEditable } from "../mixins/mxn-iguana-editable";
import { mxnIguanaSpeaker } from "../mixins/mxn-iguana-speaker";
import { mxnStartPosition } from "../mixins/mxn-start-position";
import { objIguanaLocomotive } from "./obj-iguana-locomotive";

export function objIguanaNpc(npcPersonaId: DataNpcPersona.Id) {
    const persona = DataNpcPersona.getById(npcPersonaId);
    const looks: IguanaLooks.Serializable = DataNpcLooks[persona.looksId];

    return objIguanaLocomotive(looks)
        .merge({ objIguanaNpc: { persona, looks } })
        .mixin(mxnIguanaEditable, looks)
        .mixin(mxnStartPosition)
        .mixin(mxnIguanaSpeaker, persona)
        .track(objIguanaNpc);
}

objIguanaNpc.getSpeakerColors = function getSpeakerColors (looks: IguanaLooks.Serializable) {
    return {
        tintPrimary: looks.head.color,
        tintSecondary: SubjectiveColorAnalyzer.getColorWithHighestContrast(looks.head.color, [
            looks.body.color,
            looks.body.tail.color,
            looks.head.crest.color,
        ]),
    };
};

export type ObjIguanaNpc = ReturnType<typeof objIguanaNpc>;
