import { objText } from "../../assets/fonts";
import { Integer } from "../../lib/math/number-alias-types";
import { RpgSlotMachine } from "../rpg/rpg-slot-machine";

const sym = {
    peanut: {
        identity: "fixed",
        prizeCondition: "line_from_left_consecutive",
        countsToPrize: [0, 0, 1, 3],
    },
    cherry: {
        identity: "fixed",
        prizeCondition: "line_from_left_consecutive",
        countsToPrize: [0, 0, 3, 7],
    },
    seven: {
        identity: "fixed",
        prizeCondition: "line_from_left_consecutive",
        countsToPrize: [0, 0, 6, 25],
    },
    bar: {
        identity: "fixed",
        prizeCondition: "line_from_left_consecutive",
        countsToPrize: [0, 0, 3, 5],
    },
} satisfies Record<string, RpgSlotMachine.Symbol>;

const rules: RpgSlotMachine.Rules = {
    height: 3,
    lines: [
        [0, 0, 0, 0],
        [1, 1, 1, 1],
        [2, 2, 2, 2],
        [0, 1, 1, 0],
        [2, 1, 1, 2],
    ],
    reels: [
        [
            sym.peanut,
            sym.bar,
            sym.cherry,
            sym.peanut,
            sym.seven,
            sym.bar,
            sym.cherry,
            sym.bar,
        ],
        [
            sym.cherry,
            sym.bar,
            sym.cherry,
            sym.seven,
            sym.seven,
            sym.bar,
            sym.seven,
            sym.bar,
            sym.seven,
            sym.seven,
            sym.peanut,
            sym.bar,
            sym.cherry,
            sym.seven,
            sym.seven,
            sym.peanut,
            sym.peanut,
            sym.seven,
            sym.seven,
            sym.bar,
        ],
        [
            sym.cherry,
            sym.peanut,
            sym.bar,
            sym.cherry,
            sym.peanut,
            sym.peanut,
            sym.cherry,
            sym.peanut,
            sym.peanut,
            sym.seven,
            sym.cherry,
            sym.seven,
            sym.peanut,
            sym.bar,
            sym.seven,
            sym.cherry,
            sym.peanut,
            sym.peanut,
            sym.seven,
            sym.bar,
            sym.peanut,
            sym.cherry,
            sym.seven,
            sym.bar,
            sym.peanut,
        ],
        [
            sym.cherry,
            sym.bar,
            sym.cherry,
            sym.peanut,
            sym.cherry,
            sym.seven,
            sym.bar,
            sym.cherry,
            sym.peanut,
            sym.cherry,
            sym.peanut,
            sym.seven,
            sym.bar,
            sym.cherry,
            sym.peanut,
            sym.cherry,
            sym.bar,
            sym.cherry,
            sym.peanut,
            sym.peanut,
            sym.cherry,
            sym.bar,
            sym.cherry,
            sym.peanut,
            sym.peanut,
            sym.cherry,
            sym.seven,
            sym.bar,
        ],
    ],
};

export function scnCasino() {
    objSlotMachineSimulator(5, rules).show();
}

function objSlotMachineSimulator(price: Integer, rules: RpgSlotMachine.Rules) {
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

        const paid = spins * price;
        const returnToPlayer = won / paid;

        const mostFrequentPrizes = [...prizeCounts.entries()].map(([prize, count]) => ({ prize, count })).sort((a, b) =>
            b.count - a.count
        );

        self.text = `Spins: ${spins}
Paid: ${paid}
Won: ${won}
Return-to-player: ${returnToPlayer.toFixed(4)}%
Maximum prize: ${maxPrize}
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
