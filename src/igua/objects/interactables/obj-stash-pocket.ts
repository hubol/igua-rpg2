import { Sprite } from "pixi.js";
import { OgmoEntities } from "../../../assets/generated/levels/generated-ogmo-project-data";
import { Tx } from "../../../assets/textures";
import { container } from "../../../lib/pixi/container";
import { DataPocketItem } from "../../data/data-pocket-item";
import { ask, show } from "../../drama/show";
import { mxnCutscene } from "../../mixins/mxn-cutscene";
import { Rpg } from "../../rpg/rpg";
import { RpgStashPocket } from "../../rpg/rpg-stash-pocket";

export function objStashPocket({ uid }: OgmoEntities.StashPocket) {
    return container(
        Sprite.from(Tx.Esoteric.StashPocket)
            .pivoted(23, 33)
            .mixin(mxnCutscene, function* () {
                const deposited = RpgStashPocket.Methods.check(uid);
                const operations = RpgStashPocket.Methods.checkPossibleOperations(
                    uid,
                    Rpg.character.inventory.pocket,
                );

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
                    RpgStashPocket.Methods.deposit(uid, Rpg.character.inventory.pocket);
                }
                else if (result === 1) {
                    RpgStashPocket.Methods.withdraw(uid, Rpg.character.inventory.pocket);
                }
                else if (result === 2) {
                    RpgStashPocket.Methods.swap(uid, Rpg.character.inventory.pocket);
                }
            }),
    );
}
