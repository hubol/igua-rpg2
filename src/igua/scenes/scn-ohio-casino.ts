import { Texture } from "pixi.js";
import { Lvl } from "../../assets/generated/levels/generated-level-data";
import { Tx } from "../../assets/textures";
import { ZIndex } from "../core/scene/z-index";
import { renderer } from "../current-pixi-renderer";
import { DataSlotMachines } from "../data/data-slot-machines";
import { DramaInventory } from "../drama/drama-inventory";
import { show } from "../drama/show";
import { mxnCutscene } from "../mixins/mxn-cutscene";
import { mxnSlotMachineBetButton } from "../mixins/mxn-slot-machine-bet-button";
import { mxnSlotMachineSecondaryDisplay } from "../mixins/mxn-slot-machine-secondary-display";
import { objEsotericBoneDusts } from "../objects/esoteric/obj-esoteric-bone-dusts";
import { objSlotMachine } from "../objects/obj-slot-machine";
import { Rpg } from "../rpg/rpg";
import { RpgEconomy } from "../rpg/rpg-economy";
import { RpgSlotMachine } from "../rpg/rpg-slot-machine";

// TODO this is all copy-paste from indiana casino
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

export function scnOhioCasino() {
    const lvl = Lvl.OhioCasino();
    const currencyId: RpgEconomy.Currency.Id = "bone_dusts";

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
            currencyId,
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
            currencyId,
        )
            .at(lvl.SlotMachineDisplay1)
            .zIndexed(ZIndex.Entities)
            .show();

        lvl.SlotMachineSecondaryDisplay1
            .mixin(mxnSlotMachineSecondaryDisplay, slotMachineObj);

        lvl.SlotMachineBetButton1
            .mixin(mxnSlotMachineBetButton, slotMachineObj);

        objEsotericBoneDusts()
            .at(renderer.width, 50)
            .show();
    }

    lvl.PityBossNpc
        .mixin(mxnCutscene, function* () {
            yield* show("Bones for bone dusts.");
            const removedBonesCount = yield* DramaInventory.removeAll({ kind: "pocket_item", id: "BoneTypeA" });
            const dustsGained = removedBonesCount * 3;
            Rpg.wallet.earn("bone_dusts", dustsGained);
            yield* show(
                `Gained ${RpgEconomy.Offer.toString(dustsGained, currencyId)}.`,
                `Now you have ${RpgEconomy.Offer.toString(Rpg.wallet.count(currencyId), currencyId)}.`,
            );
        });
}
