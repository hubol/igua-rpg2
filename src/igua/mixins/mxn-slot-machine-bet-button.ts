import { DisplayObject } from "pixi.js";
import { ObjSlotMachine } from "../objects/obj-slot-machine";
import { mxnInteract } from "./mxn-interact";

export function mxnSlotMachineBetButton(obj: DisplayObject, slotMachineObj: ObjSlotMachine) {
    return obj
        .coro(function* () {
            const self = obj
                .mixin(mxnInteract, () => {
                    const { objSlotMachine } = slotMachineObj;
                    objSlotMachine.requestSpin();
                    self.interact.enabled = objSlotMachine.canRequestSpin;
                });

            slotMachineObj
                .handles("objSlotMachine.fastSpinOpportunityEnded", () => self.interact.enabled = false)
                .handles("objSlotMachine.gameEnded", () => self.interact.enabled = true);
        });
}
