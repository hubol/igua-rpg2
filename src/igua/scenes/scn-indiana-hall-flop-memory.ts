import { AlphaFilter, DisplayObject } from "pixi.js";
import { Lvl } from "../../assets/generated/levels/generated-level-data";
import { Sfx } from "../../assets/sounds";
import { interp, interpvr } from "../../lib/game-engine/routines/interp";
import { sleep } from "../../lib/game-engine/routines/sleep";
import { Integer } from "../../lib/math/number-alias-types";
import { Rng } from "../../lib/math/rng";
import { container } from "../../lib/pixi/container";
import { range } from "../../lib/range";
import { Null } from "../../lib/types/null";
import { ZIndex } from "../core/scene/z-index";
import { DramaHallOfDoors } from "../drama/drama-hall-of-doors";
import { show } from "../drama/show";
import { Cutscene, scene } from "../globals";
import { mxnInteract } from "../mixins/mxn-interact";
import { mxnRpgAttack } from "../mixins/mxn-rpg-attack";
import { objCharacterFlopQuizMaster } from "../objects/characters/obj-character-flop-quiz-master";
import { objFxFieryBurst170px } from "../objects/effects/obj-fx-fiery-burst-170px";
import { objFigureFlop } from "../objects/figures/obj-figure-flop";
import { Rpg } from "../rpg/rpg";
import { RpgAttack } from "../rpg/rpg-attack";

export function scnIndianaHallFlopMemory() {
    Lvl.Dummy();

    const picker = new MutateFlopNumberPicker();

    scene.stage
        .coro(function* () {
            yield sleep(500);
            yield interpvr(quizMasterObj).translate(0, -100).over(3000);

            yield sleep(2000);

            yield Cutscene.play(
                function* () {
                    yield* show(
                        "Oh hey.",
                        "I'm the flop king.",
                        "Please remember the Flops that I show you.",
                        "Pick correctly 5 times.",
                    );
                },
                { speaker: quizMasterObj },
            ).done;

            for (let i = 0; i < 5; i++) {
                const number = picker.next();
                const testObj = objFlopMemoryTest(number, quizMasterObj)
                    .zIndexed(ZIndex.BackgroundEntities)
                    .at(100, 180)
                    .show();
                yield () => testObj.destroyed;
            }

            yield sleep(1000);

            yield Cutscene.play(
                function* () {
                    yield* show(
                        "Good job!!!",
                    );
                },
                { speaker: quizMasterObj },
            ).done;

            yield* DramaHallOfDoors.complete(Rpg.microcosms["Indiana.HallOfDoors"], 1);
        });

    const quizMasterObj = objCharacterFlopQuizMaster()
        .at(250, 380)
        .show();
}

class MutateFlopNumberPicker {
    private readonly _pickedSet = new Set<Integer>();

    private static _isFlopElligibleForMutation(dexNumberZeroIndexed: Integer): boolean {
        const args = objFigureFlop.getPrimitiveArgsFromDexNumber(dexNumberZeroIndexed);
        return args.accessory.front !== 14;
    }

    next() {
        let number = Null<Integer>();
        while (
            number === null || this._pickedSet.has(number)
            || !MutateFlopNumberPicker._isFlopElligibleForMutation(number)
        ) {
            number = Rng.intc(0, 998);
        }

        this._pickedSet.add(number);

        return number;
    }
}

const atkIncorrect = RpgAttack.create({
    physical: 90,
    conditions: {
        poison: {
            value: 100,
        },
    },
});

function objFlopMemoryTest(dexNumberZeroIndexed: Integer, speakerObj: DisplayObject) {
    return container()
        .coro(function* (self) {
            const sourceFigureObj = objFigureFlop(dexNumberZeroIndexed)
                .scaled(2, 2)
                .at(150, -50)
                .show(self);
            const alphaFilter = new AlphaFilter(0);
            sourceFigureObj.filters = [sourceFigureObj.objects.filter, alphaFilter];

            yield interp(alphaFilter, "alpha").steps(3).to(1).over(1000);
            yield sleep(1500);
            yield interp(alphaFilter, "alpha").steps(3).to(0).over(1000);

            yield sleep(1000);

            sourceFigureObj.destroy();

            objMutantFlops(dexNumberZeroIndexed, 4)
                .handles("objMutantFlops:correct", () => {
                    self.coro(
                        function* () {
                            Sfx.Character.FlopQuizMasterCorrect.play();
                            yield Cutscene.play(
                                function* () {
                                    yield sleep(1000);
                                    yield* show("Correct!");
                                },
                                { speaker: speakerObj },
                            ).done;
                            self.destroy();
                        },
                    );
                })
                .handles("objMutantFlops:incorrect", (_, flopObj) => {
                    Sfx.Interact.Error.play();
                    objFxFieryBurst170px()
                        .at(flopObj.getWorldCenter())
                        .mixin(mxnRpgAttack, { attack: atkIncorrect })
                        .show();
                    flopObj.destroy();
                })
                .at(0, -10)
                .show(self);
        });
}

function objMutantFlops(dexNumberZeroIndexed: Integer, mutantsCount: Integer) {
    return container()
        .dispatches<"objMutantFlops:correct">()
        .dispatchesValue<"objMutantFlops:incorrect", DisplayObject>()
        .coro(function* (self) {
            const sourceFigureObj = objFigureFlop(dexNumberZeroIndexed)
                .mixin(mxnInteract, () => self.dispatch("objMutantFlops:correct"));
            sourceFigureObj.filtered(sourceFigureObj.objects.filter);

            const mutantFigureObjs = createMutantFlopObjs(dexNumberZeroIndexed, mutantsCount)
                .map(obj => obj.mixin(mxnInteract, () => self.dispatch("objMutantFlops:incorrect", obj)));

            Rng.shuffle([sourceFigureObj, ...mutantFigureObjs])
                .map((obj, i) => obj.at(i * 74, 0).show(self));
        });
}

function createMutantFlopObjs(dexNumberZeroIndexed: Integer, mutantsCount: Integer) {
    const flopObjs = new Array<DisplayObject>();

    const dexNumberArgs = objFigureFlop.getPrimitiveArgsFromDexNumber(dexNumberZeroIndexed);

    const baseArgs = [
        dexNumberArgs,
        ...range(Rng.intc(1, 3))
            .map(() =>
                objFigureFlop.getMutatedPrimitveFlopArgs(
                    Rng,
                    dexNumberArgs,
                    Rng.intc(1, 3),
                )
            ),
    ];

    const mutantJsons = new Set<string>();
    for (let i = 0; i < mutantsCount; i++) {
        let mutantArgs = Null<objFigureFlop.PrimitiveFlopArgs>();
        while (mutantArgs === null || mutantJsons.has(JSON.stringify(mutantArgs))) {
            const intensity = 1 + i;
            mutantArgs = objFigureFlop.getMutatedPrimitveFlopArgs(Rng, Rng.item(baseArgs), intensity);
        }

        mutantJsons.add(JSON.stringify(mutantArgs));

        const figureObj = objFigureFlop.objFromPrimitiveFlopArgs(mutantArgs);
        figureObj.filtered(figureObj.objects.filter);

        flopObjs.push(figureObj);
    }

    return flopObjs;
}
