import { Lvl } from "../../assets/generated/levels/generated-level-data";
import { Mzk } from "../../assets/music";
import { Sfx } from "../../assets/sounds";
import { interp } from "../../lib/game-engine/routines/lerp";
import { sleep } from "../../lib/game-engine/routines/sleep";
import { Rng } from "../../lib/math/rng";
import { Jukebox } from "../core/igua-audio";
import { mxnRpgAttack } from "../mixins/mxn-rpg-attack";
import { mxnSpatialAudio } from "../mixins/mxn-spatial-audio";
import { objAngelSuggestive } from "../objects/enemies/obj-angel-suggestive";
import { playerObj } from "../objects/obj-player";
import { objValuableSpawner } from "../objects/obj-valuable-spawner";
import { RpgAttack } from "../rpg/rpg-attack";

const atkPickaxe = RpgAttack.create({
    physical: 25,
});

export function scnExperiment() {
    Jukebox.play(Mzk.TrashDay);
    const lvl = Lvl.Experiment();

    objAngelSuggestive().at([128, -128].add(playerObj)).show();

    const valuableSpawnerObj = objValuableSpawner([lvl.MinerValuable0, lvl.MinerValuable1, lvl.MinerValuable2]);

    const pickaxeAttackObj = lvl.PickaxeHitbox.mixin(mxnRpgAttack, { attack: atkPickaxe });
    pickaxeAttackObj.isAttackActive = false;

    lvl.MinerPicaxeBurst.invisible();
    lvl.MinerPicaxe
        .mixin(mxnSpatialAudio)
        .coro(function* (self) {
            const initialAngle = self.angle;

            while (true) {
                yield interp.steps(4)(self, "angle").to(135).over(1000);
                yield () => !valuableSpawnerObj.isFull;
                yield sleep(250);
                yield interp.steps(4)(self, "angle").to(initialAngle).over(300);
                pickaxeAttackObj.isAttackActive = true;
                self.play(Sfx.Impact.PickaxeRock.with.rate(Rng.float(0.9, 1.1)));
                lvl.MinerPicaxeBurst.visible = true;
                yield sleep(125);
                pickaxeAttackObj.isAttackActive = false;
                valuableSpawnerObj.spawn();
                yield sleep(125);
                lvl.MinerPicaxeBurst.visible = false;
                yield sleep(250);
            }
        });
}
