import { Sprite } from "pixi.js";
import { Lvl, LvlType } from "../../assets/generated/levels/generated-level-data";
import { Mzk } from "../../assets/music";
import { NoAtlasTx } from "../../assets/no-atlas-textures";
import { Sfx } from "../../assets/sounds";
import { Tx } from "../../assets/textures";
import { Coro } from "../../lib/game-engine/routines/coro";
import { factor, interp, interpvr } from "../../lib/game-engine/routines/interp";
import { sleep } from "../../lib/game-engine/routines/sleep";
import { Rng } from "../../lib/math/rng";
import { Jukebox } from "../core/igua-audio";
import { DramaMisc } from "../drama/drama-misc";
import { DramaQuests } from "../drama/drama-quests";
import { ask, show } from "../drama/show";
import { Cutscene, scene } from "../globals";
import { mxnFxBlink } from "../mixins/effects/mxn-fx-blink";
import { mxnBoilPivot } from "../mixins/mxn-boil-pivot";
import { mxnCutscene } from "../mixins/mxn-cutscene";
import { objCharacterBoxer } from "../objects/characters/obj-character-boxer";
import { objFxExpressSurprise } from "../objects/effects/obj-fx-express-surprise";
import { playerObj } from "../objects/obj-player";
import { CtxTerrainPipe } from "../objects/obj-terrain";
import { Rpg } from "../rpg/rpg";
import { RpgAttack } from "../rpg/rpg-attack";

export function scnMountFlop() {
    Jukebox.play(Mzk.EditableMoog);
    CtxTerrainPipe.value.texture = NoAtlasTx.Terrain.Pipe.Grate;
    const lvl = Lvl.MountFlop();
    enrichBestFriendHaverNpc(lvl);
    enrichBoxer(lvl);
}

const atkBoxerPunch = RpgAttack.create({
    physical: 1,
});

function enrichBoxer(lvl: LvlType.MountFlop) {
    function* showLaughTrack(message: string) {
        scene.stage.coro(function* () {
            yield sleep(250);
            Sfx.Cutscene.LaughTrack.rate(0.95, 1.05).play();
        });

        yield* show(message);
    }

    const boxerObj = objCharacterBoxer();
    boxerObj
        .mixin(mxnCutscene, function* () {
            yield () => playerObj.isOnGround;
            playerObj.auto.facing = 1;
            yield* show(
                "YO! YO! Put em up!!!!",
            );
            yield sleep(500);
            playerObj.speed.y = -2;
            yield () => playerObj.speed.y >= 0 && playerObj.isOnGround;
            yield sleep(400);
            Sfx.Cutscene.LaughTrack.play();
            yield sleep(1500);
            yield* showLaughTrack("OK I guess that counts.");

            while (true) {
                const result = yield* ask(
                    "Do you want to play a game? If you win, I'll give you something nice. If you lose, I will punch you. It will hurt very bad.",
                    "Yes",
                    "No",
                    "How bad will it hurt?",
                );

                if (result === 0) {
                    break;
                }

                if (result === 1) {
                    yield* showLaughTrack("YOU EXEMPLIFY COWARDICE!!!");
                    return;
                }

                if (result === 2) {
                    yield* show(
                        "Here is an overview of my punching ability.",
                    );

                    yield* showLaughTrack(JSON.stringify(atkBoxerPunch, undefined, " "));
                    yield* show("Sooo...");
                }
            }

            yield* showLaughTrack("OK. The rules are so simple that even a jock like me could understand them.");
            yield* show("I will think of a number between 1 and 10, and you need to guess what it is!");
            Jukebox.applyGainRamp(Mzk.EditableMoog, 0, 1000);
            yield interp(boxerObj.objCharacterBoxer, "thinking").to(1).over(1000);
            yield sleep(1000);
            for (let i = 0; i < 10; i++) {
                boxerObj.play(Sfx.Cutscene.ThinkTiny.rate(0.9, 1.1));
                boxerObj.x += i % 2 === 0 ? 1 : -1;
                yield sleep(333);
            }
            yield sleep(666);
            Jukebox.applyGainRamp(Mzk.EditableMoog, 1, 1000);
            boxerObj.play(Sfx.Cutscene.ThinkDone.rate(0.9, 1.1));
            yield interp(boxerObj.objCharacterBoxer, "thinking").to(0).over(66);
            objFxExpressSurprise()
                .at(playerObj.head.getWorldCenter())
                .add(0, -16)
                .show();
            playerObj.speed.y = -2;
            yield sleep(500);
            const actualNumber = Rng.intc(1, 10);
            yield* showLaughTrack("That was tricky, but I think I came up with a number.");
            const guessedNumber = yield* DramaMisc.askInteger("What number is\nthis fucker thinking of?", {
                max: 10,
                min: 1,
                messageObj: Sprite.from(Tx.Characters.Boxer.Portrait).anchored(0.46, 0.7),
            });
            if (guessedNumber === actualNumber) {
                yield* show("Heh, you got it right!");
                yield* showLaughTrack("What are the odds of that, like a one-in-a-million?!");
                yield* DramaQuests.complete("MountFlop.Boxer");
            }
            else {
                yield* show(
                    "Heh... WRONG!!!",
                    "My number was: " + actualNumber,
                );

                yield sleep(1000);

                yield* show("Time for the punch of the century!!!");
                yield* showLaughTrack("Assume the position!!!");
                yield* playerObj.walkTo(lvl.PlayerPunchMarker.x);
                playerObj.auto.facing = 1;
                yield sleep(1000);
                yield* boxerObj.objCharacterBoxer.dramaThrow();
                scene.stage
                    .coro(function* () {
                        yield () => !Cutscene.isPlaying;
                        Sfx.Cutscene.LaughTrack.play();
                        playerObj.damage(atkBoxerPunch);
                    });
            }
        })
        .at(lvl.BoxerMarker)
        .show();
}

function enrichBestFriendHaverNpc(lvl: LvlType.MountFlop) {
    const quest = Rpg.quest("MountFlop.Flower");

    lvl.BestFriendHaverNpc
        .mixin(mxnCutscene, function* () {
            if (!quest.isCompletable) {
                yield* show("That foolish wizard...");
                return;
            }

            yield* ask("That foolish wizard...", "What's wrong?");
            yield* show(
                "Oh nothing...",
            );

            scene.camera.mode = "controlled";
            yield* Coro.all([
                show("It's just that my friend is in trouble because of all of the sprites on Mount Flop."),
                interpvr(scene.camera).factor(factor.sine).to(lvl.PanToHouseRegion0).over(3000),
            ]);
            yield interpvr(scene.camera).factor(factor.sine).to(lvl.PanToHouseRegion2).over(3000);

            yield* ask("Think you can help him?", "I will try!");
            yield* show("Thank you. He is known to have really cool items. Maybe he'll give you something nice.");
        });

    if (!quest.isCompletable) {
        lvl.TownSignageHelp.destroy();
        return;
    }

    lvl.TownSignageHelp
        .mixin(mxnBoilPivot)
        .mixin(mxnFxBlink, 1.5);
}
