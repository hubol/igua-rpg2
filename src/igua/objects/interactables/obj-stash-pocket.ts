import { Sprite } from "pixi.js";
import { OgmoEntities } from "../../../assets/generated/levels/generated-ogmo-project-data";
import { Tx } from "../../../assets/textures";
import { container } from "../../../lib/pixi/container";
import { DataPocketItem } from "../../data/data-pocket-item";
import { ask, show } from "../../drama/show";
import { mxnCutscene } from "../../mixins/mxn-cutscene";
import { Rpg } from "../../rpg/rpg";

export function objStashPocket({ uid }: OgmoEntities.StashPocket) {
    return container(
        Sprite.from(Tx.Esoteric.StashPocket)
            .pivoted(23, 33)
            .mixin(mxnCutscene, function* () {
                const deposited = Rpg.stashPockets.check(uid);
                const operations = Rpg.stashPockets.checkPossibleOperations(uid);

                const message = deposited.kind === "empty"
                    ? "Stash is empty."
                    : `Stash contains ${DataPocketItem.getById(deposited.pocketItemId).name} x${deposited.count}.`;

                yield* show(message);
                const result = yield* ask(
                    `${message}\n\nWhat to do?`,
                    operations.includes("deposit") ? "Deposit" : null,
                    operations.includes("withdraw") ? "Withdraw" : null,
                    operations.includes("swap") ? "Swap" : null,
                    "Nothing",
                );

                if (result === 0) {
                    Rpg.stashPockets.deposit(uid);
                }
                else if (result === 1) {
                    Rpg.stashPockets.withdraw(uid);
                }
                else if (result === 2) {
                    Rpg.stashPockets.swap(uid);
                }
            }),
    );
}
