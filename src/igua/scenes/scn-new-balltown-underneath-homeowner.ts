import { Graphics } from "pixi.js";
import { Lvl, LvlType } from "../../assets/generated/levels/generated-level-data";
import { Mzk } from "../../assets/music";
import { Instances } from "../../lib/game-engine/instances";
import { interpvr } from "../../lib/game-engine/routines/interp";
import { sleep } from "../../lib/game-engine/routines/sleep";
import { Jukebox } from "../core/igua-audio";
import { DramaFacts } from "../drama/drama-facts";
import { DramaMisc } from "../drama/drama-misc";
import { DramaQuests } from "../drama/drama-quests";
import { dramaShop } from "../drama/drama-shop";
import { ask, show } from "../drama/show";
import { Cutscene, scene } from "../globals";
import { mxnCutscene } from "../mixins/mxn-cutscene";
import { mxnEnemy } from "../mixins/mxn-enemy";
import { Rpg } from "../rpg/rpg";

export function scnNewBalltownUnderneathHomeowner() {
    Jukebox.play(Mzk.PleasureMafia);
    const lvl = Lvl.NewBalltownUnderneathHomeowner();
    enrichEnemyPresence(lvl);
    enrichArtwork(lvl);
}

function enrichEnemyPresence(lvl: LvlType.NewBalltownUnderneathHomeowner) {
    if (Rpg.flags.underneath.homeowner.hasClearedHouseOfEnemies) {
        Instances(mxnEnemy).forEach(enemyObj => enemyObj.destroy());
        enrichHomeowner(lvl);
    }
    else {
        lvl.Homeowner.visible = false;
        lvl.Homeowner.at(lvl.HomeownerAppearPosition);
        lvl.Homeowner.setFacingOverrideAuto(1);

        Cutscene.play(function* () {
            yield sleep(500);
            yield* show("OK! I'm locking the door :-)");
            yield sleep(500);
            lvl.Door.lock();
            yield sleep(1000);
            yield* show("Good luck soldier");
        }, { speaker: lvl.Homeowner });

        lvl.Homeowner.coro(function* (self) {
            yield () => Instances(mxnEnemy).length === 0;
            Cutscene.play(function* () {
                lvl.Door.unlock();
                yield sleep(1000);
                DramaMisc.arriveViaDoor(self);
                yield sleep(500);
                yield* show("Great work!");
                yield* self.walkTo(lvl.HomeownerLandPosition.x);
                yield () => self.isOnGround;
                yield scene.camera.auto.panToSubject(self);
                yield* show("I hope this is a sufficient reward.");
                yield* DramaQuests.receiveReward("NewBalltown.Homeowner.EnemyPresenceCleared");
                yield* show("Please come see me again. I sell medication and also create thought-provoking artworks.");
                Rpg.flags.underneath.homeowner.hasClearedHouseOfEnemies = true;
                enrichHomeowner(lvl);
            }, { speaker: self, camera: { start: "pan_to_speaker" } });
        });
    }
}

function enrichHomeowner(lvl: LvlType.NewBalltownUnderneathHomeowner) {
    lvl.Homeowner.mixin(mxnCutscene, function* () {
        const result = yield* ask("Hey! What's up?", "About poison", "Let's trade", "I'm leaving");
        if (result === 0) {
            yield* DramaFacts.memorize(
                "Poison",
                "Poison is not fatal. Also, it increases your running speed and bounciness.",
                "If you want to cure poisoning, buy my medicine.",
            );
        }
        else if (result === 1) {
            yield* dramaShop("UnderneathHomeowner", { primaryTint: 0x103418, secondaryTint: 0xA5A17E });
        }
        else if (result === 2) {
            yield* show("Be seeing you!");
        }
    });
}

function enrichArtwork(lvl: LvlType.NewBalltownUnderneathHomeowner) {
    if (Rpg.flags.underneath.homeowner.hasClearedHouseOfEnemies) {
        return;
    }

    const maskObj = new Graphics()
        .beginFill(0xffffff)
        .drawRect(0, 0, scene.level.width, scene.level.height)
        .at(0, scene.level.height)
        .coro(function* (self) {
            yield () => Rpg.flags.underneath.homeowner.hasClearedHouseOfEnemies;
            yield sleep(500);
            yield interpvr(self).steps(32).to(0, 0).over(2000);
        })
        .show();

    lvl.ArtworkFrontGroup.masked(maskObj);
    lvl.ArtworkTerrainGroup.masked(maskObj);
}
