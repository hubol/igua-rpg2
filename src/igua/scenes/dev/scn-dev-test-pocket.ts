import { DisplayObject } from "pixi.js";
import { objText } from "../../../assets/fonts";
import { Assert } from "../../../lib/assert";
import { scene } from "../../globals";
import { RpgFactory } from "../../rpg/rpg-factory";
import { getInitialRpgProgress } from "../../rpg/rpg-progress";

export function scnDevTestPocket() {
    const rpg = RpgFactory.create(getInitialRpgProgress());
    scene.stage.mixin(mxnTest, () => {
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
    });
}

function mxnTest(obj: DisplayObject, program: () => void) {
    obj
        .coro(function* () {
            try {
                program();
                objText.Large("PASS", { tint: 0x00ff00 }).show();
            }
            catch (e) {
                console.log(e);
                objText.Large("FAIL", { tint: 0xff0000 }).show();
            }
        });
}
