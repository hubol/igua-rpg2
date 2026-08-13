import { objText } from "../../../assets/fonts";
import { Integer } from "../../../lib/math/number-alias-types";
import { DataSlotMachines } from "../../data/data-slot-machines";
import { scene } from "../../globals";
import { RpgSlotMachine } from "../../rpg/rpg-slot-machine";

export function scnSlotMachineSimulator() {
    scene.style.backgroundTint = 0x1c1336;
    objSlotMachineSimulator(DataSlotMachines.SingleLineThreeReel.rules).show();
}

function objSlotMachineSimulator<TMaterial>(rules: RpgSlotMachine.Rules<TMaterial>) {
    let spins = 0;
    let won = 0;

    let maxPrize = 0;
    const prizeCreditCounts = new Map<Integer, Integer>();
    const prizeMaterialCounts = new Map<TMaterial, Integer>();
    const linePrizeCounts = new Map<Integer, Integer>();

    return objText.Medium().step(self => {
        const timeStart = Date.now();
        while (Date.now() < timeStart + 4) {
            const { totalPrize, linePrizes } = RpgSlotMachine.spin(rules);
            spins += 1;
            won += totalPrize;
            maxPrize = Math.max(totalPrize, maxPrize);
            prizeCreditCounts.set(totalPrize, (prizeCreditCounts.get(totalPrize) ?? 0) + 1);
            for (const { index, material } of linePrizes) {
                linePrizeCounts.set(index, (linePrizeCounts.get(index) ?? 0) + 1);
                if (material) {
                    prizeMaterialCounts.set(material, (prizeMaterialCounts.get(material) ?? 0) + 1);
                }
            }
        }

        const paid = spins * rules.price;
        const returnToPlayer = won / paid;

        const mostFrequentCreditPrizes = getMostFrequentEvents(prizeCreditCounts);
        const mostFrequentMaterialPrizes = getMostFrequentEvents(prizeMaterialCounts);

        self.text = `Spins: ${spins}
Paid: ${paid}
Won: ${won}
Return-to-player: ${(returnToPlayer * 100).toFixed(4)}%
Maximum prize: ${maxPrize} (${((prizeCreditCounts.get(maxPrize)! / spins) * 100).toFixed(5)}%)
Line 1 wins: ${linePrizeCounts.get(0) ?? 0}
Line 2 wins: ${linePrizeCounts.get(1) ?? 0}
Line 3 wins: ${linePrizeCounts.get(2) ?? 0}
Most frequent CREDIT prizes:
${printMostFrequentEvents(mostFrequentCreditPrizes, spins)}
Most frequent MATERIAL prizes:
${printMostFrequentEvents(mostFrequentMaterialPrizes, spins)}
`;
    });
}

function getMostFrequentEvents<TKey>(frequencyEventMap: Map<TKey, Integer>) {
    return [...frequencyEventMap.entries()]
        .map(([event, count]) => ({ event, count }))
        .sort((a, b) => b.count - a.count);
}

function printMostFrequentEvents(events: ReturnType<typeof getMostFrequentEvents<unknown>>, chances: Integer) {
    return events.slice(0, 10)
        .map(({ count, event }) => `${event}: ${((count / chances) * 100).toFixed(2)}%`)
        .join("\n");
}
