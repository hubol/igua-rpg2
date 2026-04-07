import { Sprite } from "pixi.js";
import { Lvl } from "../../../assets/generated/levels/generated-level-data";
import { Tx } from "../../../assets/textures";
import { DataEquipment } from "../../data/data-equipment";
import { DramaItem } from "../../drama/drama-item";
import { mxnCutscene } from "../../mixins/mxn-cutscene";
import { playerObj } from "../../objects/obj-player";

export function scnDevDramaItem() {
    Lvl.Dummy();

    Sprite.from(Tx.Placeholder)
        .at(playerObj)
        .mixin(mxnCutscene, function* () {
            yield* DramaItem.choose({
                message: "hi",
                noneMessage: "Nevermind",
                options: DataEquipment.ids
                    .map(id => ({ message: "Hi", item: { kind: "equipment", id, level: 1 } })),
            });
        })
        .anchored(0.5, 1)
        .show();

    Sprite.from(Tx.Placeholder)
        .at(playerObj)
        .add(100, 0)
        .mixin(mxnCutscene, function* () {
            yield* DramaItem.choose({
                message: "hi",
                noneMessage: "Nevermind",
                options: DataEquipment.ids
                    .slice(0, 6)
                    .map(id => ({ message: "Hi", item: { kind: "equipment", id, level: 1 } })),
            });
        })
        .anchored(0.5, 1)
        .show();
}
