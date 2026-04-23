import { Sprite } from "pixi.js";
import { Lvl } from "../../../assets/generated/levels/generated-level-data";
import { Tx } from "../../../assets/textures";
import { sleep } from "../../../lib/game-engine/routines/sleep";
import { Rng } from "../../../lib/math/rng";
import { DataEquipment } from "../../data/data-equipment";
import { DramaInventory } from "../../drama/drama-inventory";
import { DramaItem } from "../../drama/drama-item";
import { DramaLottery } from "../../drama/drama-lottery";
import { DramaPlayerAttributes } from "../../drama/drama-player-attributes";
import { ask } from "../../drama/show";
import { mxnCutscene } from "../../mixins/mxn-cutscene";
import { mxnInteractChangePlayerAppearance } from "../../mixins/mxn-interact-change-player-appearance";
import { objCharacterKingSpino } from "../../objects/characters/obj-character-king-spino";
import { objEsotericHotDogCondimentDispenser } from "../../objects/esoteric/obj-esoteric-hot-dog-condiment-dispenser";
import { playerObj } from "../../objects/obj-player";
import { Rpg } from "../../rpg/rpg";

export function scnDevDramaItem() {
    Lvl.Dummy();
    for (const name of ["peanut", "asssss", "cool", "whatever", "epic", "sweet", "lousy"]) {
        Rpg.character.attributes.names.onCalledName(name);
    }

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
        .add(20, playerObj.y)
        .mixin(mxnCutscene, function* () {
            if (yield* ask("Shall I call you something?")) {
                yield* DramaPlayerAttributes.callName(Rng.choose("dumb", "ass", "bitch"));
            }
            else {
                yield* DramaPlayerAttributes.chooseAvailableName();
            }

            // yield sleep(5000);

            // yield* DramaItem.choose({
            //     message: "hi",
            //     noneMessage: "Nevermind",
            //     options: DataEquipment.ids
            //         .slice(0, 6)
            //         .map(id => ({ message: "Hi", item: { kind: "equipment", id, level: 1 } })),
            // });
        })
        .anchored(0.5, 1)
        .show();

    Sprite.from(Tx.Placeholder)
        .add(140, playerObj.y)
        .mixin(mxnCutscene, function* () {
            const result = yield* ask(
                "What to do?",
                "Get hot dog",
                "Add ketchup",
                "Add mustard",
                "Add onion",
                "Add relish",
            );
            if (result === 0) {
                yield* DramaInventory.receiveItems([{ kind: "potion", id: "HotDog" }]);
            }
            else if (result === 1) {
                yield* DramaInventory.potions.addCondimentToHotDog("ketchup");
            }
            else if (result === 2) {
                yield* DramaInventory.potions.addCondimentToHotDog("mustard");
            }
            else if (result === 3) {
                yield* DramaInventory.potions.addCondimentToHotDog("onion");
            }
            else if (result === 4) {
                yield* DramaInventory.potions.addCondimentToHotDog("relish");
            }
        })
        .anchored(0.5, 1)
        .show();

    Sprite.from(Tx.Placeholder)
        .add(200, playerObj.y)
        .mixin(mxnCutscene, function* () {
            yield* DramaLottery.pickNumbers(Rpg.microcosms["Ohio.Lottery"]);
        })
        .anchored(0.5, 1)
        .show();

    objCharacterKingSpino()
        .at(400, playerObj.y)
        .mixin(mxnInteractChangePlayerAppearance, { checkpointName: "fromAppearanceChange" })
        .show();

    objEsotericHotDogCondimentDispenser("onion")
        .at(300, playerObj.y)
        .show();
}
