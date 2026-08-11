import { Sprite } from "pixi.js";
import { Lvl } from "../../assets/generated/levels/generated-level-data";
import { Coro } from "../../lib/game-engine/routines/coro";
import { interp } from "../../lib/game-engine/routines/interp";
import { sleep, sleepf } from "../../lib/game-engine/routines/sleep";
import { Integer } from "../../lib/math/number-alias-types";
import { Rng } from "../../lib/math/rng";
import { DataItem } from "../data/data-item";
import { scene } from "../globals";
import { mxnPhysics } from "../mixins/mxn-physics";
import { mxnSinePivot } from "../mixins/mxn-sine-pivot";
import { objCharacterFeederFish } from "../objects/characters/obj-character-feeder-fish";
import { objFxFormativeBurst } from "../objects/effects/obj-fx-formative-burst";
import { objAngelMiffed } from "../objects/enemies/obj-angel-miffed";
import { playerObj } from "../objects/obj-player";
import { Rpg } from "../rpg/rpg";
import { RpgInventory } from "../rpg/rpg-inventory";

export function scnOhioHallFish() {
    const lvl = Lvl.OhioHallFish();

    lvl.WaterRippleGroup
        .children
        .forEach(obj => obj.mixin(mxnSinePivot));

    lvl.ArrowDownGroup
        .children
        .forEach(obj => obj.mixin(mxnEmptiesFishFood));

    [lvl.FishMarker0, lvl.FishMarker1, lvl.FishMarker2]
        .forEach((obj, id) =>
            objRoamingFish(id)
                .at(obj)
                .show()
        );

    scene.stage
        .coro(function* () {
            let enemyObj = lvl.EnemyMiffed;

            const position = enemyObj.vcpy();
            position.y = 0;

            while (true) {
                yield () => enemyObj.destroyed;
                yield sleep(3000);
                objFxFormativeBurst()
                    .at(position)
                    .show();
                yield sleep(500);
                enemyObj = objAngelMiffed("level4")
                    .at(position)
                    .show();
            }
        });
}

function objRoamingFish(id: Integer) {
    return objCharacterFeederFish(69 + id * 420)
        .mixin(mxnPhysics, { gravity: 0, physicsRadius: 10 })
        .coro(function* (self) {
            let dir = Rng.intp();
            while (true) {
                self.scale.x *= 0.67;
                yield sleep(200);
                self.scale.x = -dir;
                yield sleep(200);
                yield interp(self.speed, "x").to(dir * 1).over(500);
                yield* Coro.race([
                    Coro.chain([self.mxnPhysics.dramaHitWall(), sleep(200)]),
                    sleep(Rng.int(1000, 4000)),
                ]);
                if (self.speed.x !== 0) {
                    yield interp(self.speed, "x").to(0).over(500);
                    dir = Rng.intp();
                }
                else {
                    dir *= -1;
                }
            }
        });
}

function mxnEmptiesFishFood(obj: Sprite) {
    return obj
        .coro(function* () {
            const item: RpgInventory.Item = { kind: "pocket_item", id: "FishFood" };

            while (true) {
                yield () => Rpg.inventory.count(item) > 0 && playerObj.collides(obj);
                Rpg.inventory.remove(item, 1);

                const figureObj = DataItem.getFigureObj(item)
                    .pivotedUnit(0.5, 0.5)
                    .at(obj.getWorldCenter())
                    .add(0, -16)
                    .show();

                yield sleep(200);
                yield interp(figureObj, "angle").steps(4).to(180).over(250);
                yield sleep(200);

                for (let i = 0; i < 10; i++) {
                    figureObj.y += i % 2 === 0 ? 3 : -3;
                    yield sleepf(9);
                }

                figureObj.destroy();
            }
        });
}
