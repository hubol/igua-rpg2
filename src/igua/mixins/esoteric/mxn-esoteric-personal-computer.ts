import { DisplayObject } from "pixi.js";
import { sleep } from "../../../lib/game-engine/routines/sleep";
import { DramaInventory } from "../../drama/drama-inventory";
import { ask, show } from "../../drama/show";
import { MicrocosmPersonalComputer } from "../../rpg/microcosms/microcosm-personal-computer";
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
                const result = yield* ask(
                    ">",
                    "load",
                    "eject",
                    "run",
                    "exit",
                );

                if (result === 0) {
                    if (cosmPersonalComputer.insertedSoftwareKeyItemId) {
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
                    if (!cosmPersonalComputer.insertedSoftwareKeyItemId) {
                        yield* show("No cartridge inserted.");
                        continue;
                    }

                    yield* DramaInventory.receiveItems([cosmPersonalComputer.eject()]);
                }
                else if (result === 2) {
                    if (!cosmPersonalComputer.insertedSoftwareKeyItemId) {
                        yield* show("No cartridge inserted.");
                        continue;
                    }

                    // TODO run
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
