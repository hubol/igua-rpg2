import { Assert } from "../../../lib/assert";
import { container } from "../../../lib/pixi/container";
import { DataPotion } from "../../data/data-potion";
import { DramaInventory } from "../../drama/drama-inventory";
import { mxnDevTest } from "../../mixins/mxn-dev-test";
import { createPlayerObj } from "../../objects/obj-player";
import { Rpg, setRpgProgressData } from "../../rpg/rpg";
import { RpgFactory } from "../../rpg/rpg-factory";
import { getInitialRpgProgress } from "../../rpg/rpg-progress";

export function scnDevTestPocket() {
    container()
        .at(0, 96)
        .mixin(mxnDevTest, function* () {
            const rpg = RpgFactory.create(getInitialRpgProgress());

            Assert(rpg.inventory.pocket.receive("BallFruitTypeA")).toSerializeTo({ reset: false, count: 1 });
            Assert(rpg.inventory.pocket.receive("BallFruitTypeB")).toSerializeTo({ reset: true, count: 1 });
            Assert(rpg.inventory.pocket.receive("BallFruitTypeB")).toSerializeTo({ reset: false, count: 2 });
            Assert(rpg.inventory.pocket.count("BallFruitTypeB")).toStrictlyBe(2);
            Assert(rpg.inventory.pocket.count("BallFruitTypeA")).toStrictlyBe(0);
            Assert(rpg.inventory.pocket.findSlotThatCanReceive("BallFruitTypeA")).toStrictlyBe(null);
            Assert(rpg.inventory.pocket.findSlotThatCanReceive("BallFruitTypeB")).toBeTruthy();
            Assert(rpg.inventory.pocket.removeAll("BallFruitTypeA")).toStrictlyBe(0);
            Assert(rpg.inventory.pocket.removeAll("BallFruitTypeB")).toStrictlyBe(2);
            Assert(rpg.inventory.pocket.removeAll("BallFruitTypeB")).toStrictlyBe(0);
            const additionalPocketSlotEquipment = rpg.inventory.equipment.receive("PocketSlot", 1);
            rpg.inventory.equipment.equip(additionalPocketSlotEquipment.id, 0);
            Assert(rpg.inventory.pocket.receive("BallFruitTypeA")).toSerializeTo({ reset: false, count: 1 });
            Assert(rpg.inventory.pocket.receive("BallFruitTypeB")).toSerializeTo({ reset: false, count: 1 });
            Assert(rpg.inventory.pocket.count("BallFruitTypeA")).toStrictlyBe(1);
            Assert(rpg.inventory.pocket.count("BallFruitTypeB")).toStrictlyBe(1);
            Assert(rpg.inventory.pocket.totalItemsCount).toStrictlyBe(2);
            Assert(rpg.inventory.pocket.receive("Beet")).toSerializeTo({ reset: true, count: 1 });
            Assert(rpg.inventory.pocket.count("BallFruitTypeA")).toStrictlyBe(0);
            Assert(rpg.inventory.pocket.count("BallFruitTypeB")).toStrictlyBe(1);
            Assert(rpg.inventory.pocket.count("Beet")).toStrictlyBe(1);
            Assert(rpg.inventory.pocket.totalItemsCount).toStrictlyBe(2);
            Assert(rpg.inventory.pocket.receive("BallFruitTypeB")).toSerializeTo({ reset: false, count: 2 });
            Assert(rpg.inventory.pocket.receive("Beet")).toSerializeTo({ reset: false, count: 2 });
            Assert(rpg.inventory.pocket.count("BallFruitTypeB")).toStrictlyBe(2);
            Assert(rpg.inventory.pocket.count("Beet")).toStrictlyBe(2);
            Assert(rpg.inventory.pocket.totalItemsCount).toStrictlyBe(4);
            rpg.inventory.equipment.equip(null, 0);
            Assert(rpg.inventory.pocket.count("BallFruitTypeB")).toStrictlyBe(0);
            Assert(rpg.inventory.pocket.count("Beet")).toStrictlyBe(2);
            Assert(rpg.inventory.pocket.totalItemsCount).toStrictlyBe(2);
        })
        .show();

    // Repro for hot dog condimentizing fail
    container()
        .at(0, 128)
        .mixin(mxnDevTest, function* () {
            setRpgProgressData(getInitialRpgProgress());
            createPlayerObj().at(250, 140);

            for (const id of DataPotion.Ids) {
                Rpg.inventory.potions.receive(id);
            }
            yield* DramaInventory.potions.addCondimentToHotDog("relish");
            Assert(Rpg.inventory.potions.count("HotDog")).toStrictlyBe(0);
        })
        .show();

    // There was a bug where removing a potion from beyond the 12 visible slots would result in the wrong potion being removed
    container()
        .at(0, 192)
        .mixin(mxnDevTest, function* () {
            const rpg = RpgFactory.create(getInitialRpgProgress());
            const potions = rpg.inventory.potions;

            for (let i = 0; i < 12; i++) {
                potions.receive("AnnoyIguanas");
            }

            potions.receive("HotDog");
            potions.remove("HotDog", 1);

            Assert(potions.count("HotDog")).toStrictlyBe(0);
            Assert(potions.count("AnnoyIguanas")).toStrictlyBe(12);
        })
        .show();
}
