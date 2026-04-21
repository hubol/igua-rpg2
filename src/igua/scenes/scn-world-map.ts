import { DisplayObject, Sprite } from "pixi.js";
import { Lvl, LvlType } from "../../assets/generated/levels/generated-level-data";
import { Mzk } from "../../assets/music";
import { Sfx } from "../../assets/sounds";
import { Tx } from "../../assets/textures";
import { Instances } from "../../lib/game-engine/instances";
import { interpv } from "../../lib/game-engine/routines/interp";
import { sleep, sleepf } from "../../lib/game-engine/routines/sleep";
import { Rng } from "../../lib/math/rng";
import { Jukebox } from "../core/igua-audio";
import { ZIndex } from "../core/scene/z-index";
import { DramaQuests } from "../drama/drama-quests";
import { dramaQuizComputerScience } from "../drama/drama-quiz-computer-science";
import { ask, show } from "../drama/show";
import { mxnBoilPivot } from "../mixins/mxn-boil-pivot";
import { mxnCutscene } from "../mixins/mxn-cutscene";
import { mxnSinePivot } from "../mixins/mxn-sine-pivot";
import { mxnSpeaker } from "../mixins/mxn-speaker";
import { objFallenBot } from "../objects/characters/obj-character-fallen-bot";
import { playerObj } from "../objects/obj-player";
import { OgmoFactory } from "../ogmo/factory";
import { Rpg } from "../rpg/rpg";
import { RpgSaveFiles } from "../rpg/rpg-save-files";

export function scnWorldMap() {
    RpgSaveFiles.Current.save();
    if (Jukebox.currentTrack === null) {
        Jukebox.play(Mzk.PoopPainter);
    }

    const lvl = Lvl.WorldMap();
    Instances(OgmoFactory.createDecal).filter(x => x.texture === Tx.WorldMap.Cloud0).forEach(x =>
        x.mixin(mxnSinePivot)
    );
    Object.entries(lvl).flatMap(([key, value]) =>
        key.endsWith("Label") && value instanceof DisplayObject ? [value] : []
    ).forEach(x => x.mixin(mxnBoilPivot));

    enrichSimpleSecretValuables(lvl);
    enrichStrangeMarketGuardian(lvl);
    enrichFallenBot(lvl);
}

function enrichStrangeMarketGuardian(lvl: LvlType.WorldMap) {
    if (!Rpg.flags.strangeMarket.guardian.defeated) {
        lvl.StrangeMarketGate.destroy();
    }
}

function enrichSimpleSecretValuables(lvl: LvlType.WorldMap) {
    lvl.RedSecretGroup.children.forEach(obj =>
        obj.step(self => {
            if (playerObj.collides(self)) {
                self.play(Sfx.Effect.BallonPop.rate(0.5, 2));
                self.destroy();
            }
        })
    );

    lvl.SimpleSecretValuablesGate.coro(function* (self) {
        yield () => lvl.RedSecretGroup.children.length === 0;
        self.interact.enabled = true;
    })
        .interact.enabled = false;
}

function enrichFallenBot(lvl: LvlType.WorldMap) {
    const { fallenBot: fallenBotFlag } = Rpg.flags.worldMap;
    const isSurfacedCosm = Rpg.microcosms["FallenBot.IsSurfaced"];

    if (!isSurfacedCosm.checkIsActive()) {
        objFallenBot.objImpactSite()
            .mixin(mxnSpeaker, { name: "Bottomless Pit", tintPrimary: 0x384C0E, tintSecondary: 0x648719 })
            .mixin(mxnCutscene, function* () {
                const lootDropsUntilActive = isSurfacedCosm.lootDropsUntilActive;

                if (Rpg.character.attributes.intelligence < 1) {
                    yield* show("It looks like something has repeatedly crawled out of this.");
                }
                else if (Rpg.character.attributes.intelligence < 2) {
                    if (lootDropsUntilActive < 5) {
                        yield* show("You hear the sound of metal scraping.");
                    }
                    else {
                        yield* show("It looks like something has repeatedly crawled out of this.");
                    }
                }
                else {
                    yield* show(`Defeat ${lootDropsUntilActive} more for a visitation.`);
                }
            })
            .at(lvl.FallenBotMarker)
            .zIndexed(ZIndex.Entities - 1)
            .show();
        return;
    }

    const botObj = objFallenBot();
    botObj
        .mixin(mxnSpeaker, { name: "Bot from the Bottom", tintPrimary: 0x5E45B7, tintSecondary: 0x4BDDEA })
        .mixin(mxnCutscene, function* () {
            const result = yield* ask("Oh please... Answer me, are there any good programmers left in this world?");
            if (!result) {
                botObj.objFallenBot.mouthObj.controls.frowning = true;
                yield* show("Oh... How it pains me to hear it.");
                yield sleep(333);
                botObj.objFallenBot.mouthObj.controls.frowning = false;
                return;
            }

            yield* show(
                "Is that so? Maybe you are a good programmer, then!",
                "I will show you three simple programs. You must guess their output.",
                "It won't be so bad. And your experience with computer will grow if you guess correctly!",
            );

            let correctAnswersCount = 0;

            for (let i = 0; i < 3; i++) {
                yield* show(`Program #${i + 1}...`);
                if (
                    yield* dramaQuizComputerScience({
                        difficulty: fallenBotFlag.perfectScoreTimes + i,
                        messageObj: Sprite.from(Tx.Characters.FallenBot.AskIntegerPortrait).pivoted(74, 44),
                    })
                ) {
                    Rpg.experience.reward.computer.onCorrectQuizAnswer(++correctAnswersCount);
                }
            }

            yield* show(`You got ${correctAnswersCount} of 3 correct.`);
            if (correctAnswersCount < 2) {
                yield* show("Study hard! Next time you will impress me!");
            }
            else if (correctAnswersCount < 3) {
                yield* show("Keep studying! You're almost there!");
            }
            else {
                yield* show("You've given me some hope.");
                yield* DramaQuests.complete("FallenBot.PerfectScore");
                fallenBotFlag.perfectScoreTimes++;
            }

            yield* show("I will see you later!");
            isSurfacedCosm.reset();
            enrichFallenBot(lvl);
            yield interpv(botObj.scale).steps(3).to(0, 0).over(500);
            botObj.destroy();
            yield sleepf(5);
        })
        .at(lvl.FallenBotMarker)
        .zIndexed(ZIndex.Entities)
        .show();
}
