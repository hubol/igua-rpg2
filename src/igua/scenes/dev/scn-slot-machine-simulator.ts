import { objText } from "../../../assets/fonts";
import { Integer } from "../../../lib/math/number-alias-types";
import { DataSlotMachines } from "../../data/data-slot-machines";
import { scene } from "../../globals";
import { RpgSlotMachine } from "../../rpg/rpg-slot-machine";

export function scnSlotMachineSimulator() {
    scene.style.backgroundTint = 0x1c1336;
    objSlotMachineSimulator(DataSlotMachines.BasicThreeReel.rules).show();
}

function objSlotMachineSimulator(rules: RpgSlotMachine.Rules) {
    let spins = 0;
    let won = 0;

    let maxPrize = 0;
    const prizeCounts = new Map<Integer, Integer>();

    return objText.Medium().step(self => {
        const timeStart = Date.now();
        while (Date.now() < timeStart + 4) {
            const { totalPrize } = RpgSlotMachine.spin(rules);
            spins += 1;
            won += totalPrize;
            maxPrize = Math.max(totalPrize, maxPrize);
            prizeCounts.set(totalPrize, (prizeCounts.get(totalPrize) ?? 0) + 1);
        }

        const paid = spins * rules.price;
        const returnToPlayer = won / paid;

        const mostFrequentPrizes = [...prizeCounts.entries()].map(([prize, count]) => ({ prize, count })).sort((a, b) =>
            b.count - a.count
        );

        self.text = `Spins: ${spins}
Paid: ${paid}
Won: ${won}
Return-to-player: ${(returnToPlayer * 100).toFixed(4)}%
Maximum prize: ${maxPrize} (${((prizeCounts.get(maxPrize)! / spins) * 100).toFixed(5)}%)
Most frequent prizes:
${
            mostFrequentPrizes.slice(0, 10).map(({ count, prize }) =>
                `${prize}: ${((count / spins) * 100).toFixed(2)}%`
            )
                .join("\n")
        }
`;
    });
}
