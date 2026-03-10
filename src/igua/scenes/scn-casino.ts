import { Texture } from "pixi.js";
import { Lvl } from "../../assets/generated/levels/generated-level-data";
import { Tx } from "../../assets/textures";
import { ZIndex } from "../core/scene/z-index";
import { DataSlotMachines } from "../data/data-slot-machines";
import { mxnSlotMachineBetButton } from "../mixins/mxn-slot-machine-bet-button";
import { mxnSlotMachineSecondaryDisplay } from "../mixins/mxn-slot-machine-secondary-display";
import { objSlotMachine } from "../objects/obj-slot-machine";
import { RpgSlotMachine } from "../rpg/rpg-slot-machine";

const { rules, sym } = DataSlotMachines.BasicThreeReel;

const txs = Tx.Casino.Slots.Simple.split({ count: 4 });

const symbolTxs = new Map<RpgSlotMachine.Symbol, Texture>();
symbolTxs.set(sym.cherry, txs[0]);
symbolTxs.set(sym.seven, txs[2]);
symbolTxs.set(sym.bar, txs[1]);
symbolTxs.set(sym.wild, txs[3]);

// TODO try to reduce boilerplate!

const { rules: rules1, sym: sym1 } = DataSlotMachines.Epic;

const symbolTxs1 = new Map<RpgSlotMachine.Symbol, Texture>();
symbolTxs1.set(sym1.happy, txs[0]);
symbolTxs1.set(sym1.uberHappy, txs[1]);
symbolTxs1.set(sym1.omegaHappy, txs[2]);
symbolTxs1.set(sym1.wild, txs[3]);

export function scnCasino() {
    const lvl = Lvl.IndianaCasino();
    {
        const slotMachineObj = objSlotMachine(
            rules,
            { mask: { y: -2, height: 74 }, reel: { gap: 46 }, slot: { gap: 20 }, symbolTxs },
        )
            .at(lvl.SlotMachineDisplay0)
            .zIndexed(ZIndex.Entities)
            .show();

        lvl.SlotMachineSecondaryDisplay0
            .mixin(mxnSlotMachineSecondaryDisplay, slotMachineObj);

        lvl.SlotMachineBetButton0
            .mixin(mxnSlotMachineBetButton, slotMachineObj);
    }

    {
        const slotMachineObj = objSlotMachine(
            rules1,
            { mask: { y: -2, height: 120 }, reel: { gap: 46 }, slot: { gap: 30 }, symbolTxs: symbolTxs1 },
        )
            .at(lvl.SlotMachineDisplay1)
            .zIndexed(ZIndex.Entities)
            .show();

        lvl.SlotMachineSecondaryDisplay1
            .mixin(mxnSlotMachineSecondaryDisplay, slotMachineObj);

        lvl.SlotMachineBetButton1
            .mixin(mxnSlotMachineBetButton, slotMachineObj);
    }
}
