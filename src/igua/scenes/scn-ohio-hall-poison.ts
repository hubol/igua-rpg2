import { Graphics } from "pixi.js";
import { objText } from "../../assets/fonts";
import { Lvl } from "../../assets/generated/levels/generated-level-data";
import { Sfx } from "../../assets/sounds";
import { holdf } from "../../lib/game-engine/routines/hold";
import { sleep } from "../../lib/game-engine/routines/sleep";
import { Integer } from "../../lib/math/number-alias-types";
import { Rng } from "../../lib/math/rng";
import { container } from "../../lib/pixi/container";
import { range } from "../../lib/range";
import { Check } from "../../lib/types/check";
import { ZIndex } from "../core/scene/z-index";
import { DataEquipment } from "../data/data-equipment";
import { DramaHallOfDoors } from "../drama/drama-hall-of-doors";
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
    const enemyMarkers = [lvl.EnemyMarker0, lvl.EnemyMarker1];

    container()
        .coro(function* () {
            const values = [
                Rng.choose(5, 7, 9),
                Rng.intc(11, 15),
                ...Rng.shuffle([16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29]).slice(-2),
            ];
            for (let i = 0; i < values.length;) {
                const value = values[i];
                const count = value > 15 ? 2 : 1;
                const objs = range(count)
                    .map(i =>
                        objAngelCactus("level3")
                            .at(enemyMarkers[i])
                            .mixin(mxnShowPoisonLevel)
                            .show()
                    );
                const goalObj = objGoal(value, objs)
                    .at(lvl.GoalMarker)
                    .show();
                yield holdf(() => goalObj.objGoal.value <= 0, 60);

                if (goalObj.objGoal.value === 0) {
                    i += 1;
                    Sfx.Interact.Correct.play();
                }
                else {
                    Sfx.Interact.Error.play();
                }

                for (const obj of objs) {
                    // TODO FX
                    obj.destroy();
                }
                yield sleep(1000);
                goalObj.destroy();
            }

            yield* DramaHallOfDoors.complete(Rpg.microcosms["Ohio.HallOfDoors"], 3);
        })
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

function objGoal(offset: Integer, objs: MxnRpgStatus[]) {
    const api = {
        get value() {
            return offset - objs.reduce((value, obj) => value + obj.status.conditions.poison.level, 0);
        },
    };

    return container(
        new Graphics()
            .beginFill(objBuildUpBar.tints.Poison.tintFront)
            .drawCircle(0, 0, 32),
        objText.XLargeIrregular("0", { tint: objBuildUpBar.tints.Poison.tintBack })
            .anchored(0.5, 0.5)
            .step(self => self.text = String(offset)),
    )
        .merge({ objGoal: api })
        .zIndexed(ZIndex.BackgroundEntities);
}
