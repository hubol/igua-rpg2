import { Texture } from "pixi.js";
import { Lvl } from "../../assets/generated/levels/generated-level-data";
import { Tx } from "../../assets/textures";
import { DataSlotMachines } from "../data/data-slot-machines";
import { scene } from "../globals";
import { objSlotMachine } from "../objects/obj-slot-machine";
import { RpgSlotMachine } from "../rpg/rpg-slot-machine";

const { rules, sym } = DataSlotMachines.BasicThreeReel;

const txs = Tx.Casino.Slots.Test.split({ width: 58 });

const symbolTxs = new Map<RpgSlotMachine.Symbol, Texture>();
// symbolTxs.set(// sym.peanut, txs[0]);
symbolTxs.set(sym.cherry, txs[1]);
symbolTxs.set(sym.seven, txs[2]);
symbolTxs.set(sym.bar, txs[3]);
symbolTxs.set(sym.wild, txs[4]);

export function scnCasino() {
    Lvl.Dummy();
    scene.style.backgroundTint = 0x1c1336;
    objSlotMachine(
        rules,
        { reel: { gap: 90 }, slot: { gap: 50, width: 65, height: 65 }, symbolTxs },
    )
        .at(160, 30)
        .show();
}
