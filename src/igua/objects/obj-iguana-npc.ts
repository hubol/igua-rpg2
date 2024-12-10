import { ErrorReporter } from "../../lib/game-engine/error-reporter";
import { NpcLooks } from "../iguana/npc-looks";
import { mxnIguanaEditable } from "../mixins/mxn-iguana-editable";
import { objIguanaLocomotive } from "./obj-iguana-locomotive";

interface ObjIguanaNpcArgs {
    looksName: keyof typeof NpcLooks;
}

export function objIguanaNpc({ looksName }: ObjIguanaNpcArgs) {
    let looks = NpcLooks[looksName];
    if (!looks) {
        // TODO make special invalid configuration error (see objDoor)
        ErrorReporter.reportSubsystemError("objIguanaNpc", `NpcLooks "${looksName}" does not exist!`);
        // TODO Special missingno?
        looks = NpcLooks.MintyJourney;
    }

    return objIguanaLocomotive(looks)
        .mixin(mxnIguanaEditable, looks);
}
