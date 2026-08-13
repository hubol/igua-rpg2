import { objText } from "../../../assets/fonts";
import { sleep, sleepf } from "../../../lib/game-engine/routines/sleep";
import { cyclic } from "../../../lib/math/number";
import { Integer } from "../../../lib/math/number-alias-types";
import { container } from "../../../lib/pixi/container";
import { DataSlotMachines } from "../../data/data-slot-machines";
import { DevKey, scene } from "../../globals";
import { RpgSlotMachine } from "../../rpg/rpg-slot-machine";

function entry(id: string, rules: RpgSlotMachine.Rules<unknown>) {
    return { id, rules };
}

const rulesManifest = [
    entry("BasicThreeReel", DataSlotMachines.BasicThreeReel.rules),
    entry("LowVolatilityGrid", DataSlotMachines.LowVolatilityGrid.rules),
    entry("SingleLineThreeReel", DataSlotMachines.SingleLineThreeReel.rules),
];

export function scnSlotMachineSimulator() {
    scene.style.backgroundTint = 0x1c1336;

    scene.stage
        .coro(function* () {
            const rules = DataSlotMachines.SingleLineThreeReel.rules;
            let index = rulesManifest.findIndex(entry => entry.rules === rules);

            while (true) {
                const entry = rulesManifest[index];
                const simObj = objSlotMachineSimulator(entry.id ?? "???", entry.rules ?? rules)
                    .show();

                yield sleepf(1);
                yield () => DevKey.justWentDown("ArrowLeft") || DevKey.justWentDown("ArrowRight");

                simObj.destroy();

                if (DevKey.justWentDown("ArrowLeft")) {
                    index = Math.max(0, index - 1);
                }
                else {
                    index = Math.min(rulesManifest.length - 1, index + 1);
                }
            }
        });
}

function objSlotMachineSimulator<TMaterial>(id: string, rules: RpgSlotMachine.Rules<TMaterial>) {
    let spins = 0;
    let won = 0;

    let maxPrize = 0;
    const prizeCreditCounts = new Map<Integer, Integer>();
    const prizeMaterialCounts = new Map<TMaterial, Integer>();
    const linePrizeCounts = new Map<Integer, Integer>();

    const creditTextObj = objText.Medium();
    const materialTextObj = objText.Medium().at(250, 0);

    return container(creditTextObj, materialTextObj)
        .step(self => {
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

            creditTextObj.text = `${id} Spins: ${spins}

CREDITS
Paid: ${paid}
Won: ${won}
Return-to-player: ${(returnToPlayer * 100).toFixed(4)}%
Maximum prize: ${maxPrize} (${printOccurrencePercentage(prizeCreditCounts.get(maxPrize)!, spins, 5)})

Line 1 wins: ${printOccurrencePercentage(linePrizeCounts.get(0) ?? 0, spins, 5)}
Line 2 wins: ${printOccurrencePercentage(linePrizeCounts.get(1) ?? 0, spins, 5)}
Line 3 wins: ${printOccurrencePercentage(linePrizeCounts.get(2) ?? 0, spins, 5)}

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
        .map(({ count, event }) => `${event}: ${printOccurrencePercentage(count, chances, 2)}`)
        .join("\n");
}

function printOccurrencePercentage(occurences: Integer, chances: Integer, precision: Integer) {
    return ((occurences / chances) * 100).toFixed(precision) + "%";
}
