import { container } from "../../../lib/pixi/container";
import { DataNpcPersona } from "../../data/data-npc-persona";
import { mxnSinePivot } from "../../mixins/mxn-sine-pivot";
import { objFxPuffyCloud } from "../effects/obj-fx-puffy-cloud";
import { objIguanaNpc } from "../obj-iguana-npc";

export function objHolyIguana(npcPersonaId: DataNpcPersona.Id) {
    const iguanaNpcObj = objIguanaNpc(npcPersonaId)
        .step(self => self.physicsEnabled = false);
    return container(
        objFxPuffyCloud(11320797).at(2, -3),
        iguanaNpcObj,
        objFxPuffyCloud(16777215),
    )
        .mixin(mxnSinePivot)
        .merge({ iguanaNpcObj });
}
