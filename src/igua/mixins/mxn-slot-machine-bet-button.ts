import { DisplayObject } from "pixi.js";
import { DramaWallet } from "../drama/drama-wallet";
import { show } from "../drama/show";
import { Cutscene } from "../globals";
import { ObjSlotMachine } from "../objects/obj-slot-machine";
import { Rpg } from "../rpg/rpg";
import { RpgEconomy } from "../rpg/rpg-economy";
import { mxnInteract } from "./mxn-interact";

export function mxnSlotMachineBetButton(obj: DisplayObject, slotMachineObj: ObjSlotMachine) {
    return obj
        .coro(function* () {
            const self = obj
                .mixin(mxnInteract, () => {
                    const { objSlotMachine } = slotMachineObj;

                    if (!objSlotMachine.paidForGame) {
                        const { pricePerSpin } = objSlotMachine;

                        if (!Rpg.wallet.canAfford(objSlotMachine.pricePerSpin)) {
                            Cutscene.play(function* () {
                                yield* show(
                                    "Minimum bet is "
                                        + RpgEconomy.Offer.toString(pricePerSpin.price, pricePerSpin.currency)
                                        + ".",
                                );
                            }, { speaker: obj });
                        }
                        else {
                            Rpg.wallet.spend(pricePerSpin.currency, pricePerSpin.price, "gambling");
                            // TODO doesn't respect currency
                            // TODO doesn't move towards slot machine
                            DramaWallet.createSpentValuables(pricePerSpin.price);
                            objSlotMachine.fastSpinRequested = false;
                            objSlotMachine.paidForGame = true;
                        }
                    }
                    else if (!objSlotMachine.fastSpinRequested) {
                        objSlotMachine.fastSpinRequested = true;
                        self.interact.enabled = false;
                    }
                });

            slotMachineObj
                .handles("objSlotMachine.fastSpinOpportunityEnded", () => self.interact.enabled = false)
                .handles("objSlotMachine.gameEnded", () => self.interact.enabled = true);
        });
}
