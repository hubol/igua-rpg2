import { Assert } from "../../../lib/assert";
import { container } from "../../../lib/pixi/container";
import { DramaQuests } from "../../drama/drama-quests";
import { mxnDevTest } from "../../mixins/mxn-dev-test";
import { createPlayerObj } from "../../objects/obj-player";
import { Rpg, setRpgProgressData } from "../../rpg/rpg";
import { getInitialRpgProgress } from "../../rpg/rpg-progress";

export function scnDevTestQuestCompletion() {
    container()
        .at(0, 128)
        .mixin(mxnDevTest, function* () {
            setRpgProgressData(getInitialRpgProgress());
            createPlayerObj().at(250, 140);

            yield* DramaQuests.complete("BeetGod");
            Assert(Rpg.inventory.equipment.list.length).toStrictlyBe(1);
            Assert(Rpg.experience.quest).toStrictlyBe(50);

            yield* DramaQuests.complete("BeetGod");
            Assert(Rpg.inventory.equipment.list.length).toStrictlyBe(2);
            Assert(Rpg.experience.quest).toStrictlyBe(75);

            yield* DramaQuests.complete("BeetGod");
            Assert(Rpg.inventory.equipment.list.length).toStrictlyBe(2);
            Assert(Rpg.inventory.keyItems.count("FlopBlindBox")).toStrictlyBe(5);
            Assert(Rpg.experience.quest).toStrictlyBe(76);

            yield* DramaQuests.complete("BeetGod");
            Assert(Rpg.inventory.equipment.list.length).toStrictlyBe(2);
            Assert(Rpg.inventory.keyItems.count("FlopBlindBox")).toStrictlyBe(10);
            Assert(Rpg.experience.quest).toStrictlyBe(77);
        })
        .show();
}
