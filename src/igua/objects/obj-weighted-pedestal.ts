import { Sprite } from "pixi.js";
import { OgmoEntities } from "../../assets/generated/levels/generated-ogmo-project-data";
import { Tx } from "../../assets/textures";
import { Logger } from "../../lib/game-engine/logger";
import { onPrimitiveMutate } from "../../lib/game-engine/routines/on-primitive-mutate";
import { Rng } from "../../lib/math/rng";
import { container } from "../../lib/pixi/container";
import { ask, show } from "../drama/show";
import { mxnCutscene } from "../mixins/mxn-cutscene";
import { Rpg } from "../rpg/rpg";
import { objFigureFlop } from "./figures/obj-figure-flop";

export function objWeightedPedestal({ uid, values: { requiredFlopsCount } }: OgmoEntities.WeightedPedestal) {
    const rpgWeightedPedestal = Rpg.weightedPedestals.getById(uid, { requiredFlopsCount });
    return container(
        Sprite.from(Tx.Esoteric.WeightedPedestal)
            .mixin(mxnCutscene, function* () {
                const list = Rpg.inventory.flops.list;

                const message =
                    `A weighted pedestal for presenting Flops. The scale reads ${rpgWeightedPedestal.weight}f.`;
                yield* show(message);
                const result = yield* ask(
                    `${message}
What to do?`,
                    rpgWeightedPedestal.isSufficientlyWeighted ? null : "Add a Flop",
                    rpgWeightedPedestal.isEmpty ? null : "Remove Flops",
                    "Nothing",
                );

                if (result === 0) {
                    const anyFlopsAvailable = list.some(item => item.count > item.loanedCount);

                    if (!anyFlopsAvailable) {
                        yield* show("But you don't have any Flops to add.");
                    }

                    // TODO picker?

                    const possibleFlopIds = list.flatMap((item, flopId) =>
                        item.count > item.loanedCount ? [flopId] : []
                    );
                    const flopId = Rng.item(possibleFlopIds);

                    const loan = Rpg.inventory.flops.createLoan(flopId);
                    if (loan.accepted) {
                        rpgWeightedPedestal.receive(loan);
                    }
                    else {
                        Logger.logAssertError("Failed to create flop loan", loan.error);
                    }
                }
                else if (result === 1) {
                    const request = rpgWeightedPedestal.empty();
                    Rpg.inventory.flops.processReturn(request);
                }
            }),
        container()
            .coro(function* (self) {
                while (true) {
                    self.removeAllChildren();
                    const list = rpgWeightedPedestal.list;
                    for (let i = 0; i < list.length; i++) {
                        const flopObj = objFigureFlop(list[i]);
                        flopObj
                            .filtered(flopObj.objects.filter)
                            .at(0, i * -30)
                            .zIndexed(-i)
                            .show(self);
                    }
                    yield onPrimitiveMutate(() => rpgWeightedPedestal.weight);
                }
            })
            .autoSorted()
            .at(23, -14),
    )
        .pivoted(23, 24);
}
