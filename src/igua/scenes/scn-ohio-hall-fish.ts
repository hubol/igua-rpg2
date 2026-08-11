import { Lvl } from "../../assets/generated/levels/generated-level-data";
import { sleep } from "../../lib/game-engine/routines/sleep";
import { scene } from "../globals";
import { objFxFormativeBurst } from "../objects/effects/obj-fx-formative-burst";
import { objAngelMiffed } from "../objects/enemies/obj-angel-miffed";

export function scnOhioHallFish() {
    const lvl = Lvl.OhioHallFish();

    scene.stage
        .coro(function* () {
            let enemyObj = lvl.EnemyMiffed;

            const position = enemyObj.vcpy();
            position.y = 0;

            while (true) {
                yield () => enemyObj.destroyed;
                yield sleep(1000);
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
