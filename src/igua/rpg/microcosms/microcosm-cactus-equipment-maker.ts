import { Integer } from "../../../lib/math/number-alias-types";
import { DramaInventory } from "../../drama/drama-inventory";
import { DramaQuests } from "../../drama/drama-quests";
import { show } from "../../drama/show";
import { RpgMicrocosm } from "../rpg-microcosm";

export class MicrocosmCactusEquipmentMaker extends RpgMicrocosm<MicrocosmCactusEquipmentMaker.State> {
    *dramaTryGive(id: MicrocosmCactusEquipmentMaker.PocketItemId) {
        if (this._state[id] >= 5) {
            yield* show("I already have five.");
            return;
        }

        yield* DramaInventory.removeCount({ kind: "pocket_item", id }, 5);
        this._state[id] += 5;

        let receivedReward = false;

        while (this._state.CactusFruitTypeA >= 5 && this._state.CactusFruitTypeB >= 5) {
            receivedReward = true;
            yield* show("Nice. You've given me enough for a shoe!");
            yield* DramaQuests.complete("VaseInhabitant.CombinedCactusFruits");
            this._state.CactusFruitTypeA -= 5;
            this._state.CactusFruitTypeB -= 5;
        }

        if (!receivedReward) {
            yield* show("I will store these. Bring me the other ingredients for your shoe!");
        }
    }

    createState(): MicrocosmCactusEquipmentMaker.State {
        return {
            CactusFruitTypeA: 0,
            CactusFruitTypeB: 0,
        };
    }
}

namespace MicrocosmCactusEquipmentMaker {
    export type PocketItemId = "CactusFruitTypeA" | "CactusFruitTypeB";

    export type State = Record<PocketItemId, Integer>;
}
