import { DisplayObject } from "pixi.js";
import { Coro } from "../../../lib/game-engine/routines/coro";
import { sleep } from "../../../lib/game-engine/routines/sleep";
import { Rng } from "../../../lib/math/rng";
import { DramaInventory } from "../../drama/drama-inventory";
import { DramaMisc } from "../../drama/drama-misc";
import { ask, show } from "../../drama/show";
import { MicrocosmPersonalComputer } from "../../rpg/microcosms/microcosm-personal-computer";
import { Rpg } from "../../rpg/rpg";
import { RpgExperienceRewarder } from "../../rpg/rpg-experience-rewarder";
import { mxnCutscene } from "../mxn-cutscene";

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
                const programData = cosmPersonalComputer.insertedSoftwareKeyItemId
                    ? DataProgram.manifest[cosmPersonalComputer.insertedSoftwareKeyItemId]
                    : null;

                const result = yield* ask(
                    "> " + programData?.name ?? "",
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

                const message = "GUESS MY NUMBER [1-100]";

                yield* show(message);

                for (; guessesCount < 10;) {
                    guess = yield* DramaMisc.askInteger(message, { min: 1, max: 100 });
                    guessesCount++;
                    if (guess === number) {
                        break;
                    }

                    if (guess < number) {
                        yield* show("TOO LOW");
                    }
                    else {
                        yield* show("TOO HIGH");
                    }
                }

                if (guess !== number) {
                    yield* show("TOO MANY GUESSES");
                    return "noop";
                }

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
