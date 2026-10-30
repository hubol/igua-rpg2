import { Assert } from "../../../lib/assert";
import { sleepf } from "../../../lib/game-engine/routines/sleep";
import { container } from "../../../lib/pixi/container";
import { TestKey } from "../../dev/test/test-key";
import { DramaCobbler } from "../../drama/drama-cobbler";
import { DramaInventory } from "../../drama/drama-inventory";
import { scene } from "../../globals";
import { mxnDevTest } from "../../mixins/mxn-dev-test";
import { createPlayerObj } from "../../objects/obj-player";
import { Rpg, setRpgProgressData } from "../../rpg/rpg";
import { getInitialRpgProgress } from "../../rpg/rpg-progress";

export function scnDevTestCobbler() {
    container()
        .at(0, 128)
        .mixin(mxnDevTest, function* () {
            setRpgProgressData(getInitialRpgProgress());
            createPlayerObj().at(250, 140);

            yield* DramaInventory.receiveItems([
                { kind: "equipment", id: "BoneCoin", level: 1 },
                { kind: "equipment", id: "BoneCoin", level: 10 },
                { kind: "key_item", id: "EquipmentGlue" },
            ]);

            scene.stage
                .coro(function* () {
                    yield sleepf(20);
                    TestKey.tap("Space");
                    yield sleepf(120);
                    TestKey.tap("ArrowRight");
                    yield sleepf(60);
                    TestKey.tap("Space");
                });
            yield* DramaCobbler.upgradeOrFix();

            Assert(Rpg.inventory.equipment.list.length).toStrictlyBe(1);
            Assert(Rpg.inventory.keyItems.count("EquipmentGlue")).toStrictlyBe(0);
            Assert(Rpg.inventory.equipment.list[0].equipmentId).toStrictlyBe("BoneCoin");
            Assert(Rpg.inventory.equipment.list[0].level).toStrictlyBe(11);
        })
        .show();
}
