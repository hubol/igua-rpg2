import { Lvl, LvlType } from "../../assets/generated/levels/generated-level-data";
import { Mzk } from "../../assets/music";
import { Sfx } from "../../assets/sounds";
import { Instances } from "../../lib/game-engine/instances";
import { interp, interpvr } from "../../lib/game-engine/routines/interp";
import { sleep, sleepf } from "../../lib/game-engine/routines/sleep";
import { Rng } from "../../lib/math/rng";
import { Jukebox } from "../core/igua-audio";
import { ask, show } from "../cutscene/show";
import { Cutscene, scene } from "../globals";
import { mxnBoilPivot } from "../mixins/mxn-boil-pivot";
import { mxnCutscene } from "../mixins/mxn-cutscene";
import { mxnNudgeAppear } from "../mixins/mxn-nudge-appear";
import { mxnRpgAttack } from "../mixins/mxn-rpg-attack";
import { mxnSpatialAudio } from "../mixins/mxn-spatial-audio";
import { objAngelSuggestive } from "../objects/enemies/obj-angel-suggestive";
import { objPocketableItemSpawner } from "../objects/obj-pocketable-item-spawner";
import { objValuableSpawner } from "../objects/obj-valuable-spawner";
import { RpgAttack } from "../rpg/rpg-attack";
import { RpgPocket } from "../rpg/rpg-pocket";
import { RpgProgress } from "../rpg/rpg-progress";

export function scnNewBalltownOutskirts() {
    Jukebox.play(Mzk.TrashDay);
    const lvl = Lvl.NewBalltownOutskirts();

    objAngelSuggestive().at(lvl.EnemyDemoMarker).show();

    enrichMiner(lvl);
    enrichFarmer(lvl);
}

function enrichFarmer(lvl: LvlType.NewBalltownOutskirts) {
    const startingPosition = lvl.FarmerNpc.vcpy();

    lvl.FarmerNpc.mixin(mxnCutscene, function* () {
        scene.camera.mode = "controlled";

        yield* show("I should replant the ballfruit? Sure.");

        const choice = yield* ask("What ballfruit do you want? Choose wisely.", "Type A", "Type B");
        const choicePocketItem = choice === 0 ? RpgPocket.Item.BallFruitTypeA : RpgPocket.Item.BallFruitTypeB;

        yield* show((choice === 0 ? "Type A" : "Type B") + ", got it.");

        yield interpvr(scene.camera).to(lvl.FarmingRegion).over(1000);

        lvl.FarmerNpc.at(lvl.FarmerAppearMarker);
        yield* lvl.FarmerNpc.walkTo(lvl.FarmerMoveToMarker.x);

        for (const spawnerObj of Instances(objPocketableItemSpawner)) {
            const maybeObj = spawnerObj.spawn(choicePocketItem);
            if (maybeObj) {
                maybeObj.mixin(mxnNudgeAppear);
                yield sleepf(5);
            }
        }

        yield sleep(1500);

        // TODO farmer flashes for 1 frame. I think cutscene runner needs to be lowest priority!
        scene.camera.mode = "follow-player";
        lvl.FarmerNpc.at(startingPosition);
        lvl.FarmerNpc.setFacingOverrideAuto(1);
    });
}

const atkPickaxe = RpgAttack.create({
    physical: 25,
});

function enrichMiner(lvl: LvlType.NewBalltownOutskirts) {
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
                lvl.MinerPicaxeBrokenBandages.visible = RpgProgress.flags.outskirts.miner.pickaxeHealth <= 0;
                yield () =>
                    !valuableSpawnerObj.isFull && RpgProgress.flags.outskirts.miner.pickaxeHealth > 0
                    && !Cutscene.isPlaying;
                self.isAtRest = false;
                yield sleep(250);
                yield interp(self, "angle").steps(4).to(initialAngle).over(300);
                RpgProgress.flags.outskirts.miner.pickaxeHealth--;
                pickaxeAttackObj.isAttackActive = true;
                self.play(Sfx.Impact.PickaxeRock.rate(0.9, 1.1));
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

        if (RpgProgress.flags.outskirts.miner.pickaxeHealth <= 0) {
            yield* show("It broke after too much use. I heard there are picaxes for sale in the Balltown.");
            RpgProgress.flags.outskirts.miner.toldPlayerAboutDepletedPickaxeHealth = true;
        }
        else {
            const picaxeHealth = RpgProgress.flags.outskirts.miner.pickaxeHealth;
            // TODO pluralization utility?
            yield* show(
                `It currently has ${picaxeHealth} hit ${picaxeHealth === 1 ? "point" : "points"} remaining.`,
            );
        }
    });
}
