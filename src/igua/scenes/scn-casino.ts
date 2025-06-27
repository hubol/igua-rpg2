import { objText } from "../../assets/fonts";
import { RpgSlotMachine } from "../rpg/rpg-slot-machine";

const sym = {
    peanut: {
        identity: "fixed",
        prizeCondition: "line_from_left_consecutive",
        countsToPrize: [0, 0, 3, 5],
    },
    cherry: {
        identity: "fixed",
        prizeCondition: "line_from_left_consecutive",
        countsToPrize: [0, 0, 5, 8],
    },
    seven: {
        identity: "fixed",
        prizeCondition: "line_from_left_consecutive",
        countsToPrize: [0, 0, 11, 25],
    },
    bar: {
        identity: "fixed",
        prizeCondition: "line_from_left_consecutive",
        countsToPrize: [0, 0, 6, 10],
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
            sym.cherry,
            sym.peanut,
            sym.seven,
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
            sym.bar,
            sym.cherry,
            sym.cherry,
            sym.peanut,
            sym.seven,
            sym.cherry,
            sym.seven,
            sym.bar,
            sym.seven,
            sym.cherry,
            sym.peanut,
            sym.seven,
            sym.bar,
            sym.cherry,
            sym.seven,
            sym.bar,
        ],
        [
            sym.cherry,
            sym.bar,
            sym.cherry,
            sym.cherry,
            sym.seven,
            sym.bar,
            sym.cherry,
            sym.peanut,
            sym.cherry,
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
    const price = 10;

    let spins = 0;
    let won = 0;

    objText.Large().step(self => {
        const timeStart = Date.now();
        while (Date.now() < timeStart + 4) {
            const { totalPrize } = RpgSlotMachine.spin(rules);
            spins += 1;
            won += totalPrize;
        }

        const paid = spins * price;
        const returnToPlayer = won / paid;

        self.text = `Spins: ${spins}
Paid: ${paid}
Won: ${won}
Return-to-player: ${returnToPlayer}%
`;
    }).show();
}
