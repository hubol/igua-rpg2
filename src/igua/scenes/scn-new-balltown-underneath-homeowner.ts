import { Lvl, LvlType } from "../../assets/generated/levels/generated-level-data";
import { Mzk } from "../../assets/music";
import { Instances } from "../../lib/game-engine/instances";
import { sleep } from "../../lib/game-engine/routines/sleep";
import { Jukebox } from "../core/igua-audio";
import { DramaMisc } from "../drama/drama-misc";
import { DramaQuests } from "../drama/drama-quests";
import { show } from "../drama/show";
import { Cutscene, scene } from "../globals";
import { mxnEnemy } from "../mixins/mxn-enemy";
import { RpgProgress } from "../rpg/rpg-progress";

export function scnNewBalltownUnderneathHomeowner() {
    Jukebox.play(Mzk.PleasureMafia);
    const lvl = Lvl.NewBalltownUnderneathHomeowner();
    enrichEnemyPresence(lvl);
}

function enrichEnemyPresence(lvl: LvlType.NewBalltownUnderneathHomeowner) {
    if (RpgProgress.flags.underneath.homeowner.hasClearedHouseOfEnemies) {
        Instances(mxnEnemy).forEach(enemyObj => enemyObj.destroy());
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
                yield* DramaQuests.completeQuest("NewBalltownUnderneathHomeownerEnemyPresenceCleared", self);
                yield* show("Please come see me again. I can heal poison and also create pornographic images.");
                RpgProgress.flags.underneath.homeowner.hasClearedHouseOfEnemies = true;
            }, { speaker: self, camera: { start: "pan-to-speaker" } });
        });
    }
}
