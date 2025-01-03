import { ErrorReporter } from "../../lib/game-engine/error-reporter";
import { NpcPersonas } from "../data/npc-personas";
import { mxnIguanaEditable } from "../mixins/mxn-iguana-editable";
import { objIguanaLocomotive } from "./obj-iguana-locomotive";

interface ObjIguanaNpcArgs {
    personaName: keyof typeof NpcPersonas;
}

export function objIguanaNpc({ personaName }: ObjIguanaNpcArgs) {
    let persona = NpcPersonas[personaName];
    if (!persona) {
        // TODO make special invalid configuration error (see objDoor)
        ErrorReporter.reportSubsystemError("objIguanaNpc", `NpcPersona "${personaName}" does not exist!`);
        persona = NpcPersonas.__Unknown__;
    }

    return objIguanaLocomotive(persona.looks)
        .mixin(mxnIguanaEditable, persona.looks);
}
