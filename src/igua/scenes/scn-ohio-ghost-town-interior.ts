import { DisplayObject } from "pixi.js";
import { Lvl } from "../../assets/generated/levels/generated-level-data";
import { NoAtlasTx } from "../../assets/no-atlas-textures";
import { sleep } from "../../lib/game-engine/routines/sleep";
import { DramaInventory } from "../drama/drama-inventory";
import { DramaLib } from "../drama/drama-lib";
import { ask, show } from "../drama/show";
import { mxnCutscene } from "../mixins/mxn-cutscene";
import { mxnGift } from "../mixins/mxn-gift";
import { objCharacterComputerIbm } from "../objects/characters/obj-character-computer-ibm";
import { CtxTerrainPipe } from "../objects/obj-terrain";
import { MicrocosmPersonalComputer } from "../rpg/microcosms/microcosm-personal-computer";
import { Rpg } from "../rpg/rpg";

export function scnOhioGhostTownInterior() {
    DramaLib.Speaker.isDarkMode = true;
    CtxTerrainPipe.value.texture = NoAtlasTx.Terrain.Pipe.Brick;
    const lvl = Lvl.OhioGhostTownInterior();

    lvl.Gift
        .mixin(mxnGift, "Ohio.GhostTown.Interior.Software");

    objCharacterComputerIbm()
        .at(lvl.ComputerMarker)
        .mixin(mxnPersonalComputer, Rpg.microcosms["Ohio.GhostTown.PersonalComputer"])
        .handles("mxnPersonalComputer.booted", self => self.objCharacterComputerIbm.on = true)
        .handles("mxnPersonalComputer.shutDown", self => self.objCharacterComputerIbm.on = false)
        .show();
}

function mxnPersonalComputer(obj: DisplayObject, cosmPersonalComputer: MicrocosmPersonalComputer) {
    const eventsObj = obj
        .dispatches<"mxnPersonalComputer.booted">()
        .dispatches<"mxnPersonalComputer.shutDown">();
    return eventsObj
        .mixin(mxnCutscene, function* () {
            yield* show("Booting...");
            yield sleep(2000);
            eventsObj.dispatch("mxnPersonalComputer.booted");

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
            eventsObj.dispatch("mxnPersonalComputer.shutDown");
        });
}
