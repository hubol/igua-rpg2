import { BLEND_MODES } from "pixi.js";
import { objText } from "../../assets/fonts";
import { Lvl } from "../../assets/generated/levels/generated-level-data";
import { Mzk } from "../../assets/music";
import { Sfx } from "../../assets/sounds";
import { interpr, interpv } from "../../lib/game-engine/routines/interp";
import { sleep } from "../../lib/game-engine/routines/sleep";
import { Integer } from "../../lib/math/number-alias-types";
import { Rng } from "../../lib/math/rng";
import { container } from "../../lib/pixi/container";
import { Null } from "../../lib/types/null";
import { Jukebox } from "../core/igua-audio";
import { ZIndex } from "../core/scene/z-index";
import { ask, show } from "../drama/show";
import { Cutscene, layers, scene } from "../globals";
import { mxnCutscene } from "../mixins/mxn-cutscene";
import { mxnRpgAttack } from "../mixins/mxn-rpg-attack";
import { objCharacterKingSpino } from "../objects/characters/obj-character-king-spino";
import { objUiBubbleNumber } from "../objects/overlay/obj-ui-bubble-numbers";
import { Rpg } from "../rpg/rpg";
import { RpgAttack } from "../rpg/rpg-attack";
import { SceneChanger } from "../systems/scene-changer";
import { scnEndingDemoGood } from "./scn-ending-demo-good";

const atkSpikes = RpgAttack.create({
    physical: 25,
    emotional: 25,
});

export function scnEndingDemo() {
    Jukebox.play(Mzk.BestSeller).warm(Mzk.FuckerLand, Mzk.DemoGoodEnd);
    const lvl = Lvl.EndingDemo();
    lvl.SpikeRegion
        .mixin(mxnRpgAttack, { attack: atkSpikes });

    let gaveSpiel = false;

    const state = {
        get needAtLeastToWin() {
            return Math.max(0, 999 - Math.round(Rpg.character.buffs.esoteric.goodEndingChance * 10));
        },
        rollingValue: Null<Integer>(),
    };

    {
        container(
            objLabeledBubbleNumber("Need to beat:", () => state.needAtLeastToWin),
        )
            .coro(function* (self) {
                yield () => state.rollingValue !== null;
                objLabeledBubbleNumber("Your roll:", () => state.rollingValue ?? 0)
                    .at(0, 15)
                    .show(self);
            })
            .zIndexed(ZIndex.BackgroundDecals)
            .at(lvl.TextMarker)
            .show();
    }

    const kingSpinoObj = objCharacterKingSpino();
    kingSpinoObj
        .at(lvl.KingSpinoMarker)
        .zIndexed(ZIndex.CharacterEntities)
        .mixin(mxnCutscene, function* () {
            if (!gaveSpiel) {
                yield* show(
                    "Wow! You made it here.",
                    "Why am I here? Let's not worry about that for now.",
                    "Anyway...",
                );

                gaveSpiel = true;
            }

            yield* show(
                "Let's play a game!",
                "You'll roll a number on my 1000-sided die.",
                "If your number is higher than the number over there...",
                "Then you get the good ending for the IguaRPG 2 Demo!",
                "Otherwise, something not great will happen.",
                "It might be obvious what that will be.",
            );

            const result = yield* ask("What do you think, do you want to play?");

            if (!result) {
                yield* show("Let me know if you change your mind.");
                return;
            }

            yield* show("That's the spirit! Let's roll!!!");

            yield sleep(500);
            Jukebox.applyGainRamp(Mzk.BestSeller, 0, 500);
            yield sleep(500);

            for (let i = 0; i < 32; i++) {
                Sfx.Collect.Valuable1.rate(0.5, 2).play();
                state.rollingValue = Rng.intc(1, 1000);
                yield sleep(Rng.int(90, 150));
            }

            yield sleep(500);

            if (state.rollingValue! <= state.needAtLeastToWin) {
                yield* show("Oh no! You lost!");
                if (state.rollingValue! === state.needAtLeastToWin) {
                    yield* show(
                        "Yes, I know, but you had to beat the number.",
                        "Rules are rules!",
                    );
                }
                yield interpv(kingSpinoObj.scale).steps(4).to(0, 0).over(750);
                kingSpinoObj.destroy();
                yield* killPlayer();
                return;
            }

            yield* show("You won?!?!?!?!");

            Cutscene.play(function* () {
                layers.overlay.solid.blendMode = BLEND_MODES.SUBTRACT;
                yield layers.overlay.solid.fadeIn(500);
                SceneChanger.create({ sceneName: scnEndingDemoGood.name, checkpointName: "fromEnding" })!
                    .changeScene();
                yield layers.overlay.solid.fadeOut(500);
            });
        })
        .show();

    function* killPlayer() {
        lvl.Door.objDoor.lock();
        yield sleep(500);
        Jukebox.play(Mzk.FuckerLand, 0);
        const height = scene.level.height;
        yield interpr(scene.level, "height").to(height + 250).over(1000);
        Sfx.Cutscene.PipeMove.play();
        lvl.Pipe
            .step(self => self.x -= 1);
    }
}

function objLabeledBubbleNumber(label: string, valueProvider: () => Integer) {
    return container(
        objText.Medium(label).anchored(1, 0.5),
        objUiBubbleNumber({ value: valueProvider(), minimumDigitsCount: 4 })
            .at(28, -2)
            .step(self => self.controls.value = valueProvider()),
    );
}
