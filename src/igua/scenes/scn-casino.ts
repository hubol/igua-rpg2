import { Texture } from "pixi.js";
import { Lvl } from "../../assets/generated/levels/generated-level-data";
import { Tx } from "../../assets/textures";
import { ZIndex } from "../core/scene/z-index";
import { DataSlotMachines } from "../data/data-slot-machines";
import { scene } from "../globals";
import { objSlotMachine } from "../objects/obj-slot-machine";
import { RpgSlotMachine } from "../rpg/rpg-slot-machine";

const { rules, sym } = DataSlotMachines.BasicThreeReel;

const txs = Tx.Casino.Slots.Simple.split({ count: 4 });

const symbolTxs = new Map<RpgSlotMachine.Symbol, Texture>();
symbolTxs.set(sym.cherry, txs[0]);
symbolTxs.set(sym.seven, txs[2]);
symbolTxs.set(sym.bar, txs[1]);
symbolTxs.set(sym.wild, txs[3]);

export function scnCasino() {
    const lvl = Lvl.IndianaCasino();
    objSlotMachine(
        rules,
        { mask: { y: -2, height: 74 }, reel: { gap: 46 }, slot: { gap: 20 }, symbolTxs },
    )
        .at(lvl.SlotMachineDisplay0)
        .zIndexed(ZIndex.Entities)
        .show();
}
