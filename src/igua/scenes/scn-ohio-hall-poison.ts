import { Graphics } from "pixi.js";
import { objText } from "../../assets/fonts";
import { Lvl } from "../../assets/generated/levels/generated-level-data";
import { container } from "../../lib/pixi/container";
import { Check } from "../../lib/types/check";
import { ZIndex } from "../core/scene/z-index";
import { DataEquipment } from "../data/data-equipment";
import { DramaInventory } from "../drama/drama-inventory";
import { show } from "../drama/show";
import { Cutscene } from "../globals";
import { mxnCutscene } from "../mixins/mxn-cutscene";
import { MxnRpgStatus } from "../mixins/mxn-rpg-status";
import { mxnSinePivot } from "../mixins/mxn-sine-pivot";
import { objAngelCactus } from "../objects/enemies/obj-angel-cactus";
import { objBuildUpBar } from "../objects/overlay/obj-build-up-bar";
import { Rpg } from "../rpg/rpg";
import { RpgInventory } from "../rpg/rpg-inventory";

const consts = {
    equipmentId: Check<DataEquipment.Id>("WeakeningPoisonRing"),
    levels: [1, 2, 4, 8],
};

export function scnOhioHallPoison() {
    const lvl = Lvl.OhioHallPoison();

    objAngelCactus("level3")
        .mixin(mxnShowPoisonLevel)
        .at(lvl.EnemyMarker)
        .show();

    container()
        .step(() => {
            if (Rpg.character.buffs.combat.melee.conditions.poison.maxLevel > 0) {
                Rpg.character.temporaryEffects.add("MeleePoisonValueFromHall", 1);
            }
        })
        .show();

    lvl.FacilitatorNpc
        .mixin(mxnCutscene, function* () {
            const itemsToReceive = consts.levels
                .map((level): RpgInventory.Item.Equipment => ({ id: consts.equipmentId, kind: "equipment", level }))
                .filter(item => Rpg.inventory.count(item) < 1);

            if (itemsToReceive.length > 0) {
                yield* show("Oh!", "You'll need these for my little challenge!");
                yield* DramaInventory.receiveItems(itemsToReceive);
            }
        });

    container()
        .coro(function* () {
            const equipmentLevelsToRemove = new Set(
                Rpg.inventory.equipment.list.filter(
                    equipment =>
                        equipment.equipmentId === consts.equipmentId && !consts.levels.includes(equipment.level),
                )
                    .map(equipment => equipment.level),
            );

            if (equipmentLevelsToRemove.size < 1) {
                return;
            }

            Cutscene.play(function* () {
                yield* show("What the?!", "How did you get those shoes?!");
                for (const level of equipmentLevelsToRemove) {
                    yield* DramaInventory.removeAll({ kind: "equipment", id: consts.equipmentId, level });
                }
            }, { speaker: lvl.FacilitatorNpc });
        })
        .show();
}

function mxnShowPoisonLevel(obj: MxnRpgStatus) {
    return obj
        .coro(function* () {
            container(
                new Graphics()
                    .beginFill(objBuildUpBar.tints.Poison.tintBack)
                    .drawCircle(0, 0, 9.5),
                objText.MediumBold("0", { tint: objBuildUpBar.tints.Poison.tintFront })
                    .at(0, 2)
                    .anchored(0.5, 0.5)
                    .step(self => self.text = String(obj.status.conditions.poison.level)),
            )
                .mixin(mxnSinePivot)
                .step(self => {
                    if (obj.destroyed) {
                        self.destroy();
                        return;
                    }
                    self.at(obj).add(0, -64);
                })
                .zIndexed(ZIndex.BackgroundEntities)
                .show();
        });
}
