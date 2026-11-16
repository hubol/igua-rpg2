import { DisplayObject, Sprite } from "pixi.js";
import { Sfx } from "../../../assets/sounds";
import { Tx } from "../../../assets/textures";
import { Coro } from "../../../lib/game-engine/routines/coro";
import { factor, interpvr } from "../../../lib/game-engine/routines/interp";
import { sleep } from "../../../lib/game-engine/routines/sleep";
import { vdeg } from "../../../lib/math/angle";
import { Rng } from "../../../lib/math/rng";
import { VectorSimple } from "../../../lib/math/vector-type";
import { DramaInventory } from "../../drama/drama-inventory";
import { DramaMisc } from "../../drama/drama-misc";
import { ask, show } from "../../drama/show";
import { Cutscene } from "../../globals";
import { playerObj } from "../../objects/obj-player";
import { MicrocosmPersonalComputer } from "../../rpg/microcosms/microcosm-personal-computer";
import { Rpg } from "../../rpg/rpg";
import { RpgAttack } from "../../rpg/rpg-attack";
import { RpgExperienceRewarder } from "../../rpg/rpg-experience-rewarder";
import { mxnFxSpriteGhost } from "../effects/mxn-fx-sprite-ghost";
import { mxnCutscene } from "../mxn-cutscene";
import { mxnRpgAttack } from "../mxn-rpg-attack";

export function mxnEsotericPersonalComputer(obj: DisplayObject, cosmPersonalComputer: MicrocosmPersonalComputer) {
    const eventsObj = obj
        .dispatches<"mxnEsotericPersonalComputer.booted">()
        .dispatches<"mxnEsotericPersonalComputer.shutDown">();
    return eventsObj
        .mixin(mxnCutscene, function* () {
            yield* show("Booting...");
            yield sleep(2000);
            eventsObj.dispatch("mxnEsotericPersonalComputer.booted");

            while (true) {
                // TODO feels a little weird, but i guess it is exceptional for the player to die during cutscenes...
                if (!Rpg.character.status.isAlive) {
                    return;
                }

                const programData = cosmPersonalComputer.insertedSoftwareKeyItemId
                    ? DataProgram.manifest[cosmPersonalComputer.insertedSoftwareKeyItemId]
                    : null;

                const result = yield* ask(
                    "> " + (programData?.name ?? ""),
                    "load",
                    "eject",
                    "run",
                    "exit",
                );

                if (result === 0) {
                    if (programData) {
                        yield* show("Cartridge already inserted.");
                        continue;
                    }

                    const item = yield* DramaInventory.askWhichAndRemoveOne(
                        MicrocosmPersonalComputer.softwareKeyItems,
                        { message: "Choose desired software." },
                    );

                    if (item) {
                        cosmPersonalComputer.insert(item.id);
                    }
                }
                else if (result === 1) {
                    if (!programData) {
                        yield* show("No cartridge inserted.");
                        continue;
                    }

                    yield* DramaInventory.receiveItems([cosmPersonalComputer.eject()]);
                }
                else if (result === 2) {
                    if (!programData) {
                        yield* show("No cartridge inserted.");
                        continue;
                    }

                    const interaction = yield* programData.program();
                    Rpg.experience.reward.computer.onInteract(interaction);
                }
                else if (result === 3) {
                    break;
                }
            }

            yield* show("Shutting down...");
            yield sleep(2000);
            eventsObj.dispatch("mxnEsotericPersonalComputer.shutDown");
        });
}

namespace DataProgram {
    export interface Model {
        name: string;
        program: () => Coro.Type<RpgExperienceRewarder.ComputerInteractionKind>;
    }

    export const manifest: Record<MicrocosmPersonalComputer.SoftwareKeyItemId, Model> = {
        SoftwareHighLow: {
            name: "HIGHLOW.BAS",
            program: function* () {
                const number = Rng.intc(1, 100);
                let guess = -1;
                let guessesCount = 0;

                for (; guessesCount < 10;) {
                    guess = yield* DramaMisc.askInteger(
                        "GUESS MY NUMBER 1-100",
                        {
                            min: 1,
                            max: 100,
                            messageObj: Sprite.from(Tx.Characters.ComputerIbmPortrait)
                                .anchored(0.42, 0.8),
                        },
                    );
                    guessesCount++;
                    if (guess === number) {
                        break;
                    }

                    Cutscene.current!.attributes.allowPlayerMovement = true;

                    const normal = vdeg(Rng.int(2) * 180);

                    const startPosition = playerObj.vcpy().add(normal, 150);
                    const endPosition = playerObj.vcpy().add(normal, -150);

                    const wrongObj = objAttackWrong(endPosition)
                        .at(startPosition)
                        .show();

                    yield () => wrongObj.destroyed;

                    if (!Rpg.character.status.isAlive) {
                        return "noop";
                    }

                    Cutscene.current!.attributes.allowPlayerMovement = false;

                    if (guess < number) {
                        yield* show("TOO LOW");
                    }
                    else {
                        yield* show("TOO HIGH");
                    }
                }

                if (guess !== number) {
                    Sfx.Interact.Error.play();
                    yield* show("TOO MANY GUESSES");
                    return "noop";
                }

                Sfx.Interact.Correct.play();

                yield* show(
                    "CORRECT",
                    "GOT IT IN " + guessesCount + " GUESS(ES)",
                );

                if (guessesCount < 5) {
                    return "xlarge_task";
                }

                if (guessesCount < 7) {
                    return "large_task";
                }

                if (guessesCount < 8) {
                    return "medium_task";
                }

                return "small_task";
            },
        },
    };
}

function objAttackWrong(targetPosition: VectorSimple) {
    return Sprite.from(Tx.Effects.Wrong)
        .anchored(0.5, 1)
        .mixin(mxnRpgAttack, { attack: atks.punishment })
        .mixin(mxnFxSpriteGhost)
        .coro(function* (self) {
            self.play(Sfx.Interact.Error);
            yield sleep(250);
            self.mxnFxSpriteGhost.perFrame = 0.3;
            yield interpvr(self).factor(factor.sine).to(targetPosition).over(2000);
            self.destroy();
        });
}

const atks = {
    punishment: RpgAttack.create({
        emotional: 10,
        quirks: {
            ignoreCutscenePlaying: true,
        },
    }),
};
