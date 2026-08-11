import { Sprite } from "pixi.js";
import { Lvl } from "../../assets/generated/levels/generated-level-data";
import { interp } from "../../lib/game-engine/routines/interp";
import { sleep, sleepf } from "../../lib/game-engine/routines/sleep";
import { DataItem } from "../data/data-item";
import { scene } from "../globals";
import { mxnSinePivot } from "../mixins/mxn-sine-pivot";
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
