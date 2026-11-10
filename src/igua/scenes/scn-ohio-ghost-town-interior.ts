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

export function scnOhioGhostTownInterior() {
    DramaLib.Speaker.isDarkMode = true;
    CtxTerrainPipe.value.texture = NoAtlasTx.Terrain.Pipe.Brick;
    const lvl = Lvl.OhioGhostTownInterior();

    lvl.Gift
        .mixin(mxnGift, "Ohio.GhostTown.Interior.Software");

    const computerObj = objCharacterComputerIbm()
        .at(lvl.ComputerMarker)
        .mixin(mxnCutscene, function* () {
            yield* show("Booting...");
            yield sleep(2000);
            computerObj.objCharacterComputerIbm.on = true;

            while (true) {
                const result = yield* ask(
                    ">",
                    "load",
                    "eject",
                    "run",
                    "exit",
                );

                if (result === 0) {
                    const item = yield* DramaInventory.askWhichAndRemoveOne([
                        {
                            kind: "key_item",
                            id: "SoftwareHighLow",
                        },
                    ], { message: "Choose desired software." });
                }
                else if (result === 1) {
                    // TODO eject
                }
                else if (result === 2) {
                    // TODO check what is inserted and run
                }
                else if (result === 3) {
                    yield* show("Shutting down...");
                    yield sleep(2000);
                    computerObj.objCharacterComputerIbm.on = false;
                    return;
                }
            }
        })
        .show();
}
