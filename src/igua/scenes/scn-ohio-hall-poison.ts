import { Graphics } from "pixi.js";
import { objText } from "../../assets/fonts";
import { Lvl } from "../../assets/generated/levels/generated-level-data";
import { Sfx } from "../../assets/sounds";
import { Coro } from "../../lib/game-engine/routines/coro";
import { holdf } from "../../lib/game-engine/routines/hold";
import { interpc, interpv } from "../../lib/game-engine/routines/interp";
import { onPrimitiveMutate } from "../../lib/game-engine/routines/on-primitive-mutate";
import { sleep, sleepf } from "../../lib/game-engine/routines/sleep";
import { approachLinear } from "../../lib/math/number";
import { Integer } from "../../lib/math/number-alias-types";
import { Rng } from "../../lib/math/rng";
import { vnew } from "../../lib/math/vector-type";
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
import { mxnRpgAttack } from "../mixins/mxn-rpg-attack";
import { MxnRpgStatus } from "../mixins/mxn-rpg-status";
import { mxnSinePivot } from "../mixins/mxn-sine-pivot";
import { mxnStopAndDieWhenHitGround } from "../mixins/mxn-stop-and-die-when-hit-ground";
import { mxnYell } from "../mixins/mxn-yell";
import { objFxFormativeBlob } from "../objects/effects/obj-fx-formative-blob";
import { objAngelCactus } from "../objects/enemies/obj-angel-cactus";
import { playerObj } from "../objects/obj-player";
import { objBuildUpBar } from "../objects/overlay/obj-build-up-bar";
import { objSpikedCanonball } from "../objects/projectiles/obj-spiked-canonball";
import { Rpg } from "../rpg/rpg";
import { RpgAttack } from "../rpg/rpg-attack";
import { RpgFaction } from "../rpg/rpg-faction";
import { RpgInventory } from "../rpg/rpg-inventory";

const consts = {
    equipmentId: Check<DataEquipment.Id>("WeakeningPoisonRing"),
    levels: [1, 2, 4, 8],
};

const atkDestroyCactus = RpgAttack.create({
    emotional: 999,
    versus: RpgFaction.Enemy,
});

const atkPunishPlayer = RpgAttack.create({
    physical: 25,
});

export function scnOhioHallPoison() {
    const lvl = Lvl.OhioHallPoison();
    const enemyMarkers = [lvl.EnemyMarker0, lvl.EnemyMarker1];

    const facilitatorObj = lvl.FacilitatorNpc
        .mixin(mxnYell);

    [lvl.CloudGroup0, lvl.CloudGroup1]
        .forEach(obj =>
            obj.coro(function* (self) {
                while (true) {
                    yield sleep(Rng.intc(666, 1111));
                    self.pivot.y = self.pivot.y === 0 ? 1 : 0;
                }
            })
        );

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
                const objs = yield* Coro.all(
                    range(count)
                        .map(i => {
                            return (function* () {
                                objFxFormativeBlob()
                                    .tinted(0x003000)
                                    .at(enemyMarkers[i])
                                    .show();

                                yield sleep(450);

                                return objAngelCactus("level3")
                                    .at(enemyMarkers[i])
                                    .mixin(mxnShowPoisonLevel)
                                    .show();
                            })();
                        }),
                );
                const goalObj = objGoal(value, objs)
                    .at(lvl.GoalMarker)
                    .show();
                yield* Coro.race([
                    holdf(() => goalObj.objGoal.value <= 0, 60),
                    () => objs.every(obj => obj.destroyed),
                ]);

                const isCorrect = goalObj.objGoal.value === 0;
                if (isCorrect) {
                    i += 1;
                    Sfx.Interact.Correct.play();
                }
                else {
                    Sfx.Interact.Error.play();
                }

                for (const obj of objs) {
                    obj.damage(atkDestroyCactus);
                }

                if (!isCorrect) {
                    facilitatorObj.mxnYell.yell("That's not how it's done!!!");

                    const position = vnew(playerObj.x, 40);

                    objFxFormativeBlob()
                        .tinted(0x003000)
                        .at(position)
                        .show();

                    yield sleep(400);

                    for (let dx = 40; dx >= -40; dx -= 20) {
                        const ballObj = objSpikedCanonball()
                            .mixin(mxnRpgAttack, { attack: atkPunishPlayer })
                            .mixin(mxnStopAndDieWhenHitGround)
                            .at(position)
                            .add(Math.round(dx / 8), 0)
                            .show();
                        ballObj.speed.at(dx / 33, -2);
                        yield sleepf(8);
                    }
                }

                yield sleep(1000);
                goalObj.destroy();
            }

            Cutscene.play(function* () {
                yield sleep(500);
                yield* show("What a great ceremony!");
                yield* DramaHallOfDoors.complete(Rpg.microcosms["Ohio.HallOfDoors"], 3);
            }, { speaker: lvl.FacilitatorNpc });
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
                yield* show(
                    "What a beautiful night!",
                    "Oh hey!",
                    "You'll need these for the ceremony!",
                );
                yield* DramaInventory.receiveItems(itemsToReceive);
            }
            else {
                yield* show("You have everything you need!", "Get to work!");
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
                    .step(self => self.text = String(obj.status.conditions.poison.level))
                    .coro(function* (self) {
                        while (true) {
                            const defaultTint = self.tint;
                            yield onPrimitiveMutate(() => self.text as string);
                            self.tint = 0x00ff00;
                            yield interpc(self, "tint").steps(3).to(defaultTint).over(333);
                        }
                    }),
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
            .merge({ radius: 0 })
            .step(self =>
                self
                    .clear()
                    .lineStyle(1, 0x00ff00)
                    .drawCircle(0, 0, self.radius)
            )
            .mixin(mxnSinePivot)
            .step(self => self.radius = approachLinear(self.radius, api.value === 0 ? 40 : 0, 3)),
        new Graphics()
            .beginFill(0xffffff)
            .drawCircle(0, 0, 32)
            .mixin(mxnSinePivot)
            .tinted(objBuildUpBar.tints.Poison.tintFront)
            .step(self => {
                if (api.value < 0) {
                    self.tint = 0x800000;
                }
            }),
    )
        .scaled(0, 0)
        .coro(function* (self) {
            yield interpv(self.scale).steps(2).to(1, 1).over(500);

            objText.XLargeIrregular("0", { tint: objBuildUpBar.tints.Poison.tintBack })
                .anchored(0.5, 0.5)
                .mixin(mxnSinePivot)
                .step(self => {
                    self.text = String(offset);
                    if (api.value === 0) {
                        self.tint = 0x00ff00;
                    }
                    else if (api.value < 0) {
                        self.tint = 0xff0000;
                    }
                })
                .show(self);
        })
        .merge({ objGoal: api })
        .zIndexed(ZIndex.BackgroundEntities);
}
