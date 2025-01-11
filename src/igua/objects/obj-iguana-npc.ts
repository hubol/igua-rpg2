import { SubjectiveColorAnalyzer } from "../../lib/color/subjective-color-analyzer";
import { ErrorReporter } from "../../lib/game-engine/error-reporter";
import { NpcPersonas } from "../data/npc-personas";
import { IguanaLooks } from "../iguana/looks";
import { mxnIguanaEditable } from "../mixins/mxn-iguana-editable";
import { mxnSpeaker } from "../mixins/mxn-speaker";
import { objIguanaLocomotive } from "./obj-iguana-locomotive";

interface ObjIguanaNpcArgs {
    personaName: keyof typeof NpcPersonas;
}

export function objIguanaNpc({ personaName }: ObjIguanaNpcArgs) {
    let persona = NpcPersonas[personaName];
    if (!persona) {
        ErrorReporter.reportMisconfigurationError(
            "objIguanaNpc",
            new Error(`NpcPersona "${personaName}" does not exist!`),
        );
        persona = NpcPersonas.__Unknown__;
    }

    return objIguanaLocomotive(persona.looks)
        .mixin(mxnIguanaEditable, persona.looks)
        .mixin(mxnSpeaker, { name: persona.name, ...getSpeakerColors(persona.looks) });
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
