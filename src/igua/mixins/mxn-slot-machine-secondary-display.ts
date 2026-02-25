import { Graphics } from "pixi.js";
import { objText } from "../../assets/fonts";
import { interpvr } from "../../lib/game-engine/routines/interp";
import { ObjSlotMachine } from "../objects/obj-slot-machine";
import { mxnBoilSeed } from "./mxn-boil-seed";

export function mxnSlotMachineSecondaryDisplay(regionObj: Graphics, slotMachineObj: ObjSlotMachine) {
    return slotMachineObj
        .coro(function* () {
            regionObj.visible = true;

            const textObj = objText.MediumIrregular("")
                .mixin(mxnBoilSeed)
                .at(regionObj.x + Math.round(regionObj.width / 2), regionObj.y + Math.round(regionObj.height / 2) + 2)
                .anchored(0.5, 0.5)
                .masked(regionObj)
                .coro(function* (self) {
                    while (true) {
                        for (let i = -1; i <= 1; i += 2) {
                            let scroll = Math.max(0, Math.ceil((self.width - regionObj.width) / 2));
                            if (scroll > 0) {
                                scroll += 2;
                            }
                            yield interpvr(self.pivot).to(scroll, 0).over(300);
                            yield interpvr(self.pivot).to(-scroll, 0).over(300);
                        }
                    }
                })
                .show();

            slotMachineObj
                .handles("objSlotMachine.gameStarted", () => textObj.text = "Good luck!")
                .handles("objSlotMachine.gameEnded", (_, result) => {
                    if (result.totalPrize <= 0) {
                        textObj.text = "Try again";
                    }
                })
                .handles(
                    "objSlotMachine.showLinePrize",
                    (_, linePrize) => textObj.text = `Line ${linePrize.index + 1} wins ${linePrize.prize}`,
                );
        });
}
