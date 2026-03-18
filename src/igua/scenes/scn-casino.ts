import { Texture } from "pixi.js";
import { objText } from "../../assets/fonts";
import { Lvl } from "../../assets/generated/levels/generated-level-data";
import { Mzk } from "../../assets/music";
import { Tx } from "../../assets/textures";
import { Jukebox } from "../core/igua-audio";
import { ZIndex } from "../core/scene/z-index";
import { DataSlotMachines } from "../data/data-slot-machines";
import { DramaFacts } from "../drama/drama-facts";
import { dramaShop } from "../drama/drama-shop";
import { ask, show } from "../drama/show";
import { mxnCutscene } from "../mixins/mxn-cutscene";
import { mxnSlotMachineBetButton } from "../mixins/mxn-slot-machine-bet-button";
import { mxnSlotMachineSecondaryDisplay } from "../mixins/mxn-slot-machine-secondary-display";
import { objSlotMachine } from "../objects/obj-slot-machine";
import { Rpg } from "../rpg/rpg";
import { RpgSlotMachine } from "../rpg/rpg-slot-machine";

const slotTxs = {
    simple: Tx.Casino.Slots.Simple.split({ count: 4 }),
    happiness: Tx.Casino.Slots.Happiness.split({ count: 4 }),
};

function createSymbolTxs(...symbolTxs: Array<[symbol: RpgSlotMachine.Symbol, texture: Texture]>) {
    const map = new Map<RpgSlotMachine.Symbol, Texture>();
    for (const [symbol, texture] of symbolTxs) {
        map.set(symbol, texture);
    }
    return map;
}

export function scnCasino() {
    Jukebox.play(Mzk.ProfitMotive);
    const lvl = Lvl.IndianaCasino();
    {
        const { rules, sym } = DataSlotMachines.BasicThreeReel;
        const symbolTxs = createSymbolTxs(
            [sym.cherry, slotTxs.simple[0]],
            [sym.bar, slotTxs.simple[1]],
            [sym.seven, slotTxs.simple[2]],
            [sym.wild, slotTxs.simple[3]],
        );

        const slotMachineObj = objSlotMachine(
            rules,
            {
                mask: { y: -2, height: 74 },
                reel: { gap: 46 },
                slot: { gap: 20 },
                symbolTxs,
                lineHighlightTint: 0xFF5200,
            },
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
        const { rules, sym } = DataSlotMachines.LowVolatilityGrid;
        const symbolTxs = createSymbolTxs(
            [sym.happy, slotTxs.happiness[0]],
            [sym.uberHappy, slotTxs.happiness[1]],
            [sym.omegaHappy, slotTxs.happiness[2]],
            [sym.wild, slotTxs.happiness[3]],
        );

        const slotMachineObj = objSlotMachine(
            rules,
            {
                mask: { y: 1, height: 98 },
                reel: { gap: 46 },
                slot: { gap: 33 },
                symbolTxs,
                lineHighlightTint: 0xFF5E42,
            },
        )
            .at(lvl.SlotMachineDisplay1)
            .zIndexed(ZIndex.Entities)
            .show();

        lvl.SlotMachineSecondaryDisplay1
            .mixin(mxnSlotMachineSecondaryDisplay, slotMachineObj);

        lvl.SlotMachineBetButton1
            .mixin(mxnSlotMachineBetButton, slotMachineObj);
    }

    {
        objText.MediumIrregular("", { tint: 0xa00000 })
            .anchored(0.5, 0.5)
            .step(self => self.text = "Pity: " + Rpg.wallet.count("casino_pity"))
            .zIndexed(ZIndex.TerrainDecals)
            .at(lvl.PityMarker)
            .show();
    }

    {
        lvl.PityBossNpc
            .mixin(mxnCutscene, function* () {
                const result = yield* ask(
                    "What's up. I'm the pity boss. What can I do for you?",
                    "What is pity?",
                    "Trade",
                    "What is gambling?",
                    "Nothing",
                );
                if (result === 0) {
                    yield* show(
                        "Pity is part of our rewards program at the dang casino.",
                        "When you lose a bet here, you will receive pity equal to the value of your bet.",
                        "Hopefully that clears things up.",
                    );
                }
                else if (result === 1) {
                    yield* dramaShop("CasinoPity", { tintPrimary: 0xCC2C42, tintSecondary: 0xffffff });
                }
                else if (result === 2) {
                    yield* DramaFacts.memorize("Gambling");
                }
                else {
                    yield* show("Okay! Let me know if you need something!");
                }
            });
    }
}
