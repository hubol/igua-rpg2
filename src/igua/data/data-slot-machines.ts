import { RpgSlotMachine } from "../rpg/rpg-slot-machine";

function interlace<T>(array: T[], item: T): T[] {
    const result: T[] = [];
    for (let i = 0; i < array.length; i++) {
        result.push(array[i], item);
    }

    return result;
}

export namespace DataSlotMachines {
    export namespace LowVolatilityGrid {
        export const sym = {
            happy: {
                identity: "fixed",
                prizeCondition: "line_from_left_consecutive",
                countsToPrize: [0, 0, 3, 5],
            },
            uberHappy: {
                identity: "fixed",
                prizeCondition: "line_from_left_consecutive",
                countsToPrize: [0, 0, 9, 20],
            },
            omegaHappy: {
                identity: "fixed",
                prizeCondition: "line_from_left_consecutive",
                countsToPrize: [0, 0, 30, 100],
            },
            wild: {
                identity: "wild",
                prizeCondition: "line_from_left_consecutive",
                countsToPrize: [0, 0, 90, 300],
            },
        } satisfies Record<string, RpgSlotMachine.Symbol>;

        export const rules: RpgSlotMachine.Rules = {
            price: 10,
            height: 3,
            lines: [
                [0, 0, 0, 0],
                [1, 1, 1, 1],
                [2, 2, 2, 2],
            ],
            reels: [
                [sym.happy, sym.happy, sym.happy, sym.happy, sym.uberHappy, sym.omegaHappy, sym.uberHappy, sym.wild],
                [
                    sym.happy,
                    sym.happy,
                    sym.happy,
                    sym.wild,
                    sym.happy,
                    sym.uberHappy,
                    sym.happy,
                    sym.happy,
                    sym.omegaHappy,
                    sym.wild,
                    sym.uberHappy,
                    sym.happy,
                ],
                [
                    sym.happy,
                    sym.happy,
                    sym.wild,
                    sym.omegaHappy,
                    sym.omegaHappy,
                    sym.happy,
                    sym.happy,
                    sym.happy,
                    sym.uberHappy,
                    sym.uberHappy,
                    sym.wild,
                    sym.happy,
                    sym.happy,
                    sym.happy,
                    sym.wild,
                ],
                [
                    sym.happy,
                    sym.happy,
                    sym.happy,
                    sym.wild,
                    sym.wild,
                    sym.happy,
                    sym.omegaHappy,
                    sym.happy,
                    sym.uberHappy,
                    sym.happy,
                    sym.wild,
                    sym.happy,
                    sym.happy,
                    sym.uberHappy,
                    sym.happy,
                    sym.happy,
                    sym.wild,
                ],
            ],
        };
    }

    export namespace BasicThreeReel {
        export const sym = {
            empty: {
                identity: "fixed",
                prizeCondition: "line_from_left_consecutive",
                countsToPrize: [0, 0, 0],
            },
            bar: {
                identity: "fixed",
                prizeCondition: "line_from_left_consecutive",
                countsToPrize: [0, 0, 10],
            },
            cherry: {
                identity: "fixed",
                prizeCondition: "line_from_left_consecutive",
                countsToPrize: [0, 0, 25],
            },
            seven: {
                identity: "fixed",
                prizeCondition: "line_from_left_consecutive",
                countsToPrize: [0, 0, 100],
            },
            wild: {
                identity: "wild",
                prizeCondition: "line_from_left_consecutive",
                countsToPrize: [0, 0, 500],
            },
        } satisfies Record<string, RpgSlotMachine.Symbol>;

        export const rules: RpgSlotMachine.Rules = {
            price: 5,
            height: 3,
            lines: [
                [0, 0, 0],
                [1, 1, 1],
                [2, 2, 2],
            ],
            reels: [
                interlace([
                    sym.bar,
                    sym.cherry,
                    sym.cherry,
                    sym.seven,
                    sym.cherry,
                    sym.cherry,
                    sym.bar,
                    sym.bar,
                    sym.seven,
                    sym.seven,
                    sym.wild,
                    sym.wild,
                ], sym.empty),
                interlace([
                    sym.cherry,
                    sym.cherry,
                    sym.cherry,
                    sym.bar,
                    sym.bar,
                    sym.seven,
                    sym.seven,
                    sym.bar,
                    sym.wild,
                    sym.wild,
                ], sym.empty),
                interlace([
                    sym.cherry,
                    sym.cherry,
                    sym.bar,
                    sym.bar,
                    sym.cherry,
                    sym.seven,
                    sym.seven,
                    sym.bar,
                    sym.wild,
                    sym.wild,
                ], sym.empty),
            ],
        };
    }
}
