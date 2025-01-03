import { Lvl } from "../../assets/generated/levels/generated-level-data";
import { Mzk } from "../../assets/music";
import { Sfx } from "../../assets/sounds";
import { interp } from "../../lib/game-engine/routines/interp";
import { sleep } from "../../lib/game-engine/routines/sleep";
import { Rng } from "../../lib/math/rng";
import { Jukebox } from "../core/igua-audio";
import { show } from "../cutscene/show";
import { Cutscene, scene } from "../globals";
import { mxnBoilPivot } from "../mixins/mxn-boil-pivot";
import { mxnCutscene } from "../mixins/mxn-cutscene";
import { mxnRpgAttack } from "../mixins/mxn-rpg-attack";
import { mxnSpatialAudio } from "../mixins/mxn-spatial-audio";
import { objAngelSuggestive } from "../objects/enemies/obj-angel-suggestive";
import { objIguanaNpc } from "../objects/obj-iguana-npc";
import { playerObj } from "../objects/obj-player";
import { objValuableSpawner } from "../objects/obj-valuable-spawner";
import { RpgAttack } from "../rpg/rpg-attack";
import { RpgProgress } from "../rpg/rpg-progress";

export function scnExperiment() {
    Jukebox.play(Mzk.TrashDay);
    const lvl = Lvl.Experiment();

    objAngelSuggestive().at([128, -128].add(playerObj)).show();

    enrichMiner(lvl);
    enrichFarmer(lvl);
}

function enrichFarmer(lvl: ReturnType<typeof Lvl["Experiment"]>) {
    lvl.FarmerNpc.mixin(mxnCutscene, function* () {
        scene.camera.mode = "controlled";

        yield* show("I should replant the ballfruit? Sure.");

        scene.camera.at(lvl.FarmingRegion);

        // TODO could add that .behind()
        // Or should I figure out layering technology
        const npcObj = objIguanaNpc({ personaName: "BalltownOutskirtsFarmer" }).at(lvl.FarmerAppearMarker).show();
        yield* npcObj.walkTo(lvl.FarmerMoveToMarker.x);

        // TODO should this happen automatically at the end of cutscenes?
        scene.camera.mode = "follow-player";
    });
}

const atkPickaxe = RpgAttack.create({
    physical: 25,
});

function enrichMiner(lvl: ReturnType<typeof Lvl["Experiment"]>) {
    const valuableSpawnerObj = objValuableSpawner([lvl.MinerValuable0, lvl.MinerValuable1, lvl.MinerValuable2]);

    const pickaxeAttackObj = lvl.PickaxeHitbox.mixin(mxnRpgAttack, { attack: atkPickaxe });
    pickaxeAttackObj.isAttackActive = false;

    lvl.MinerPicaxeBrokenBandages.mixin(mxnBoilPivot).invisible();
    lvl.MinerPicaxeBurst.invisible();
    const minerPicaxeObj = lvl.MinerPicaxe
        .merge({ isAtRest: false })
        .mixin(mxnSpatialAudio)
        .coro(function* (self) {
            const initialAngle = self.angle;

            while (true) {
                yield interp(self, "angle").steps(4).to(135).over(1000);
                self.isAtRest = true;
                lvl.MinerPicaxeBrokenBandages.visible = RpgProgress.flags.outskirts.miner.picaxeHealth <= 0;
                yield () =>
                    !valuableSpawnerObj.isFull && RpgProgress.flags.outskirts.miner.picaxeHealth > 0
                    && !Cutscene.isPlaying;
                self.isAtRest = false;
                yield sleep(250);
                yield interp(self, "angle").steps(4).to(initialAngle).over(300);
                RpgProgress.flags.outskirts.miner.picaxeHealth--;
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

    lvl.MinerNpc.mixin(mxnCutscene, function* () {
        yield () => minerPicaxeObj.isAtRest;
        yield* show(
            "I'm a miner. I extract valuables from these boulders.",
            "My picaxe is very precious to me.",
        );

        if (RpgProgress.flags.outskirts.miner.picaxeHealth <= 0) {
            yield* show("It broke after too much use. I heard there are picaxes for sale in the Balltown.");
        }
        else {
            const picaxeHealth = RpgProgress.flags.outskirts.miner.picaxeHealth;
            // TODO pluralization utility?
            yield* show(
                `It currently has ${picaxeHealth} hit ${picaxeHealth === 1 ? "point" : "points"} remaining.`,
            );
        }
    });
}
