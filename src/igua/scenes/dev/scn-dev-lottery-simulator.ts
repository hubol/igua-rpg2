import { objText } from "../../../assets/fonts";
import { Integer } from "../../../lib/math/number-alias-types";
import { range } from "../../../lib/range";
import { scene } from "../../globals";
import { MicrocosmLottery } from "../../rpg/microcosms/microcosm-lottery";
import { Rpg } from "../../rpg/rpg";

export function scnDevLotterySimulator() {
    scene.style.backgroundTint = 0x1c1336;
    objDevLotterySimulator(Rpg.microcosms["Ohio.Lottery"]).show();
}

function objDevLotterySimulator(lotteryCosm: MicrocosmLottery) {
    let spins = 0;
    let won = 0;

    let maxPrize = 0;
    const prizeCounts = new Map<Integer, Integer>();
    const linePrizeCounts = new Map<Integer, Integer>();

    return objText.Medium().step(self => {
        const timeStart = Date.now();
        while (Date.now() < timeStart + 4) {
            lotteryCosm.pickNumbers({
                lucky: 1,
                normal: range(lotteryCosm.config.normalNumbersCount).map(i => i + 1),
            });

            for (let i = 0; i < 100; i++) {
                // @ts-expect-error go away
                Rpg.records.onDropLoot();
            }

            const result = lotteryCosm.checkWin();
            if (result.isSuccess) {
                spins += 1;
                won += result.prize;
                maxPrize = Math.max(result.prize, maxPrize);
                prizeCounts.set(result.prize, (prizeCounts.get(result.prize) ?? 0) + 1);
            }
        }

        const paid = spins * lotteryCosm.config.price;
        const returnToPlayer = won / paid;

        const mostFrequentPrizes = [...prizeCounts.entries()].map(([prize, count]) => ({ prize, count })).sort((a, b) =>
            b.count - a.count
        );

        self.text = `Spins: ${spins}
Paid: ${paid}
Won: ${won}
Return-to-player: ${(returnToPlayer * 100).toFixed(4)}%
Maximum prize: ${maxPrize} (${((prizeCounts.get(maxPrize)! / spins) * 100).toFixed(5)}%)
Line 1 wins: ${linePrizeCounts.get(0) ?? 0}
Line 2 wins: ${linePrizeCounts.get(1) ?? 0}
Line 3 wins: ${linePrizeCounts.get(2) ?? 0}
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
