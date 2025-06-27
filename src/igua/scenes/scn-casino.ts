import { Sprite, Texture } from "pixi.js";
import { objText } from "../../assets/fonts";
import { Tx } from "../../assets/textures";
import { Integer } from "../../lib/math/number-alias-types";
import { container } from "../../lib/pixi/container";
import { DevKey } from "../globals";
import { RpgSlotMachine } from "../rpg/rpg-slot-machine";

const sym = {
    peanut: {
        identity: "fixed",
        prizeCondition: "line_from_left_consecutive",
        countsToPrize: [0, 0, 3, 7],
    },
    cherry: {
        identity: "fixed",
        prizeCondition: "line_from_left_consecutive",
        countsToPrize: [0, 0, 4, 8],
    },
    seven: {
        identity: "fixed",
        prizeCondition: "line_from_left_consecutive",
        countsToPrize: [0, 0, 25, 100],
    },
    bar: {
        identity: "fixed",
        prizeCondition: "line_from_left_consecutive",
        countsToPrize: [0, 0, 5, 14],
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
        [1, 2, 2, 1],
        [1, 0, 0, 1],
    ],
    reels: [
        [
            sym.bar,
            sym.bar,
            sym.peanut,
            sym.peanut,
            sym.peanut,
            sym.seven,
            sym.cherry,
            sym.bar,
            sym.cherry,
            sym.cherry,
            sym.seven,
            sym.seven,
            sym.seven,
            sym.cherry,
            sym.cherry,
            sym.cherry,
            sym.bar,
        ],
        [
            sym.bar,
            sym.seven,
            sym.cherry,
            sym.cherry,
            sym.peanut,
            sym.peanut,
            sym.peanut,
            sym.cherry,
            sym.seven,
            sym.bar,
            sym.bar,
            sym.seven,
            sym.seven,
            sym.seven,
            sym.cherry,
            sym.seven,
            sym.bar,
            sym.bar,
            sym.bar,
            sym.peanut,
            sym.peanut,
            sym.peanut,
            sym.bar,
            sym.bar,
            sym.cherry,
            sym.cherry,
            sym.cherry,
            sym.bar,
            sym.bar,
            sym.peanut,
            sym.peanut,
            sym.peanut,
        ],
        [
            sym.peanut,
            sym.peanut,
            sym.peanut,
            sym.bar,
            sym.bar,
            sym.bar,
            sym.cherry,
            sym.cherry,
            sym.cherry,
            sym.seven,
            sym.seven,
            sym.seven,
            sym.bar,
            sym.bar,
            sym.bar,
            sym.bar,
        ],
        [
            sym.peanut,
            sym.peanut,
            sym.peanut,
            sym.bar,
            sym.bar,
            sym.bar,
            sym.cherry,
            sym.cherry,
            sym.cherry,
            sym.seven,
            sym.seven,
            sym.seven,
        ],
    ],
};

const txs = Tx.Casino.Slots.Test.split({ width: 58 });

const symbolTxs = new Map<RpgSlotMachine.Symbol, Texture>();
symbolTxs.set(sym.peanut, txs[0]);
symbolTxs.set(sym.cherry, txs[1]);
symbolTxs.set(sym.seven, txs[2]);
symbolTxs.set(sym.bar, txs[3]);

export function scnCasino() {
    objSlotMachineSimulator(5, rules).show();
    objSlot().at(140, 20).show();
}

function objSlot() {
    return container().coro(function* (self) {
        while (true) {
            yield () => DevKey.isDown("Space");
            self.removeAllChildren();
            const { totalPrize, reelOffsets, linePrizes } = RpgSlotMachine.spin(rules);
            for (let x = 0; x < 4; x++) {
                const reel = rules.reels[x];
                for (let y = 0; y < rules.height; y++) {
                    const symbol = reel[(y + reelOffsets[x]) % reel.length];
                    Sprite.from(symbolTxs.get(symbol)!).at(x * 58, y * 58).show(self);
                }
            }

            objText.Large(`Prize: ${totalPrize}`).at(58 * 1.5, 58 * 3.2).show(self);
            if (linePrizes.length) {
                objText.Medium(`${linePrizes.map(({ index, prize }) => `Line ${index + 1} pays ${prize}`).join("\n")}`)
                    .at(58 * 1.5, 58 * 3.8).show(self);
            }

            yield () => !DevKey.isDown("Space");
        }
    });
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
