import { Lvl, LvlType } from "../../assets/generated/levels/generated-level-data";
import { Mzk } from "../../assets/music";
import { Instances } from "../../lib/game-engine/instances";
import { factor, interpvr } from "../../lib/game-engine/routines/interp";
import { Rng } from "../../lib/math/rng";
import { DramaQuests } from "../drama/drama-quests";
import { show } from "../drama/show";
import { scene } from "../globals";
import { mxnCutscene } from "../mixins/mxn-cutscene";
import { objBossMusicPlayer } from "../objects/obj-boss-music-player";
import { ObjDoor, objDoor } from "../objects/obj-door";
import { playerObj } from "../objects/obj-player";
import { Rpg } from "../rpg/rpg";

export function scnIntelligenceTower() {
    const lvl = Lvl.IntelligenceTower();

    enrichCheckTime(lvl);
    enrichMidboss0(lvl);
    enrichMageNpcs(lvl);

    const checkpointName = Rpg.character.position.checkpointName;
    if (checkpointName.startsWith("level") || checkpointName.startsWith("wrong")) {
        const doorObjs = Instances(objDoor, (obj) => obj.y > playerObj.y - 50 && obj.y < playerObj.y - 40);

        if (doorObjs.length === 0) {
            return;
        }

        playerObj.x = Rng.item(doorObjs).x;
        playerObj.auto.setFacingImmediately(-1);
    }

    objBossMusicPlayer({
        bossObjs: [lvl.EnemyChill],
        mzkBattle: Mzk.FuckerLand,
        mzkPeace: Mzk.RochesterDetour,
    })
        .show();
}

function enrichMageNpcs(lvl: LvlType.IntelligenceTower) {
    const defeatMidbossQuest0 = Rpg.quest("IntelligenceTower.DefeatMidboss0");

    lvl.MageNpc0
        .mixin(mxnCutscene, function* () {
            yield* show("You have done well to get here.");
            if (defeatMidbossQuest0.isCompletable) {
                yield* show("Please take this.");
                yield* DramaQuests.complete(defeatMidbossQuest0);
            }
        });

    lvl.MageNpc1
        .mixin(mxnCutscene, function* () {
            yield* show(
                "We study magic here.",
                "Maybe someone has a cool discovery to share with you.",
            );
        });
}

function enrichCheckTime(lvl: LvlType.IntelligenceTower) {
    const hourOptions = [12, 3, 6, 9] as const;

    const doorObjs: Record<typeof hourOptions[number], ObjDoor> = {
        "12": lvl.TimeCheck12Door,
        "3": lvl.TimeCheck3Door,
        "6": lvl.TimeCheck6Door,
        "9": lvl.TimeCheck9Door,
    };

    const hours = Rng.item(hourOptions);
    lvl.TimeCheckClock.objEsotericClock.hours = hours;
    const doorObj = doorObjs[hours];
    doorObj.objDoor.checkpointName = "level2";
}

function enrichMidboss0(lvl: LvlType.IntelligenceTower) {
    const dialObj = lvl.MidbossDial0;

    [
        lvl.Midboss0Pipe0,
        lvl.Midboss0Pipe1,
        lvl.Midboss0Pipe2,
        lvl.Midboss0Pipe3,
    ]
        .forEach((obj, i) => {
            const unit = i / 4;
            const fadeUnit = unit + 0.05;
            obj.step(self => {
                const remainingTicksUnit = dialObj.objEsotericDial.remainingTicksUnit;
                self.alpha = remainingTicksUnit < fadeUnit ? 0.5 : 1;
                self.visible = self.enabled = remainingTicksUnit > unit;
            });
        });

    if (playerObj.y < lvl.EnemyChill.y) {
        lvl.EnemyChill.destroy();
    }
    else {
        scene.stage
            .coro(function* () {
                yield () => lvl.EnemyChill.destroyed;
                yield interpvr(lvl.MidbossDoor0).factor(factor.sine).to(lvl.MidbossDoorMarker0).over(3000);
            });
    }
}
