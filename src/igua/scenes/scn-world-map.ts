import { DisplayObject } from "pixi.js";
import { Lvl, LvlType } from "../../assets/generated/levels/generated-level-data";
import { Mzk } from "../../assets/music";
import { Sfx } from "../../assets/sounds";
import { Tx } from "../../assets/textures";
import { Instances } from "../../lib/game-engine/instances";
import { interpv } from "../../lib/game-engine/routines/interp";
import { sleep, sleepf } from "../../lib/game-engine/routines/sleep";
import { Rng } from "../../lib/math/rng";
import { container } from "../../lib/pixi/container";
import { Jukebox } from "../core/igua-audio";
import { ZIndex } from "../core/scene/z-index";
import { dramaQuizComputerScience } from "../drama/drama-quiz-computer-science";
import { ask, show } from "../drama/show";
import { mxnBoilPivot } from "../mixins/mxn-boil-pivot";
import { mxnCutscene } from "../mixins/mxn-cutscene";
import { mxnRpgAttack } from "../mixins/mxn-rpg-attack";
import { mxnSinePivot } from "../mixins/mxn-sine-pivot";
import { mxnSpeaker } from "../mixins/mxn-speaker";
import { objFallenBot } from "../objects/characters/obj-character-fallen-bot";
import { playerObj } from "../objects/obj-player";
import { OgmoFactory } from "../ogmo/factory";
import { Rpg } from "../rpg/rpg";
import { RpgAttack } from "../rpg/rpg-attack";
import { RpgSaveFiles } from "../rpg/rpg-save-files";

const atkSpikeBall = RpgAttack.create({ physical: 30 });

export function scnWorldMap() {
    RpgSaveFiles.Current.save();
    if (Jukebox.currentTrack === null) {
        Jukebox.play(Mzk.PoopPainter);
    }

    const lvl = Lvl.WorldMap();
    Instances(OgmoFactory.createDecal).filter(x => x.texture === Tx.WorldMap.Cloud0).forEach(x =>
        x.mixin(mxnSinePivot)
    );
    Instances(OgmoFactory.createDecal).filter(x => x.texture === Tx.Enemy.SpikeBall).forEach(x =>
        x.mixin(mxnRpgAttack, { attack: atkSpikeBall })
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
    const { fallenBot: flagFallenBot } = Rpg.flags.worldMap;

    if (flagFallenBot.landsWhenTimesDroppedLoot === null) {
        flagFallenBot.landsWhenTimesDroppedLoot = Rpg.records.timesDroppedLoot + 10;
    }

    const rootObj = container()
        .at(lvl.FallenBotMarker)
        .zIndexed(ZIndex.Entities)
        .show();

    if (Rpg.records.timesDroppedLoot < flagFallenBot.landsWhenTimesDroppedLoot) {
        rootObj.zIndex -= 1;
        objFallenBot.objImpactSite()
            .mixin(mxnSpeaker, { name: "Impact Site", tintPrimary: 0x384C0E, tintSecondary: 0x648719 })
            .mixin(mxnCutscene, function* () {
                const timesDroppedLootDiff = flagFallenBot.landsWhenTimesDroppedLoot! - Rpg.records.timesDroppedLoot;

                if (Rpg.character.attributes.intelligence < 1) {
                    yield* show("It looks like something has repeatedly crashed here.");
                }
                else if (Rpg.character.attributes.intelligence < 2) {
                    if (timesDroppedLootDiff < 5) {
                        yield* show("You get the sense that it won't be much longer until another crash.");
                    }
                    else {
                        yield* show("It looks like something has repeatedly crashed here.");
                    }
                }
                else {
                    yield* show(`Defeat ${timesDroppedLootDiff} more for a visitation.`);
                }
            })
            .show(rootObj);
        return;
    }

    const botObj = objFallenBot();
    botObj
        .mixin(mxnSpeaker, { name: "Fallen Bot", tintPrimary: 0x5E45B7, tintSecondary: 0x4BDDEA })
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
                if (yield* dramaQuizComputerScience(flagFallenBot.perfectScoreTimes + i)) {
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
                flagFallenBot.perfectScoreTimes++;
            }

            yield* show("I will see you later!");
            flagFallenBot.landsWhenTimesDroppedLoot = Rpg.records.timesDroppedLoot + Rng.intc(10, 20);
            enrichFallenBot(lvl);
            yield interpv(botObj.scale).steps(3).to(0, 0).over(500);
            botObj.destroy();
            yield sleepf(5);
        })
        .show(rootObj);
}
