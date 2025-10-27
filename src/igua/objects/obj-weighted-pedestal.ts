import { Sprite } from "pixi.js";
import { OgmoEntities } from "../../assets/generated/levels/generated-ogmo-project-data";
import { Tx } from "../../assets/textures";
import { ask, show } from "../drama/show";
import { mxnCutscene } from "../mixins/mxn-cutscene";
import { Rpg } from "../rpg/rpg";

export function objWeightedPedestal({ uid, values: { requiredFlopsCount } }: OgmoEntities.WeightedPedestal) {
    const rpgWeightedPedestal = Rpg.weightedPedestals.getById(uid, { requiredFlopsCount });
    return Sprite.from(Tx.Esoteric.WeightedPedestal)
        .pivoted(23, 24)
        .mixin(mxnCutscene, function* () {
            const message = `A weighted pedestal for presenting Flops. The scale reads ${rpgWeightedPedestal.weight}f.`;
            yield* show(message);
            const result = yield* ask(
                `${message}
What to do?`,
                "Add a Flop",
                rpgWeightedPedestal.isEmpty ? null : "Remove Flops",
                "Nothing",
            );

            if (result === 0) {
                const list = Rpg.inventory.flops.list;
                const anyFlopsAvailable = list.some(item => item.count > item.loanedCount);

                if (!anyFlopsAvailable) {
                    yield* show("But you don't have any Flops to add.");
                }
            }
        });
}
