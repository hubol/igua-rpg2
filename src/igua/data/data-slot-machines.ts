import { RpgSlotMachine } from "../rpg/rpg-slot-machine";

function interlace<T>(array: T[], item: T): T[] {
    const result: T[] = [];
    for (let i = 0; i < array.length; i++) {
        result.push(array[i], item);
    }

    return result;
}

export namespace DataSlotMachines {
    export type SymbolsManifest = Record<string, RpgSlotMachine.Symbol>;

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
                countsToPrize: [0, 0, 7, 15],
            },
            omegaHappy: {
                identity: "fixed",
                prizeCondition: "line_from_left_consecutive",
                countsToPrize: [0, 0, 30, 100],
            },
            wild: {
                identity: "wild",
                prizeCondition: "line_from_left_consecutive",
                countsToPrize: [0, 0, 0, 300],
            },
        } satisfies SymbolsManifest;

        export const rules: RpgSlotMachine.Rules = {
            price: 10,
            height: 3,
            lines: [
                [0, 0, 0, 0],
                [1, 1, 1, 1],
                [2, 2, 2, 2],
            ],
            reels: [
                [
                    sym.happy,
                    sym.happy,
                    sym.happy,
                    sym.happy,
                    sym.uberHappy,
                    sym.omegaHappy,
                    sym.uberHappy,
                    sym.wild,
                    sym.uberHappy,
                    sym.uberHappy,
                    sym.uberHappy,
                    sym.happy,
                    sym.uberHappy,
                    sym.happy,
                    sym.happy,
                    sym.happy,
                    sym.omegaHappy,
                    sym.omegaHappy,
                    sym.omegaHappy,
                    sym.happy,
                    sym.uberHappy,
                    sym.happy,
                    sym.happy,
                    sym.uberHappy,
                    sym.happy,
                    sym.happy,
                    sym.omegaHappy,
                    sym.happy,
                    sym.uberHappy,
                    sym.uberHappy,
                    sym.uberHappy,
                    sym.wild,
                    sym.wild,
                    sym.wild,
                ],
                [
                    sym.wild,
                    sym.uberHappy,
                    sym.uberHappy,
                    sym.uberHappy,
                    sym.happy,
                    sym.uberHappy,
                    sym.happy,
                    sym.happy,
                    sym.happy,
                    sym.omegaHappy,
                    sym.omegaHappy,
                    sym.omegaHappy,
                    sym.happy,
                    sym.happy,
                    sym.happy,
                    sym.happy,
                    sym.happy,
                    sym.omegaHappy,
                    sym.happy,
                    sym.uberHappy,
                    sym.uberHappy,
                    sym.uberHappy,
                    sym.wild,
                    sym.wild,
                    sym.wild,
                ],
                [
                    sym.happy,
                    sym.happy,
                    sym.happy,
                    sym.happy,
                    sym.wild,
                    sym.uberHappy,
                    sym.uberHappy,
                    sym.uberHappy,
                    sym.omegaHappy,
                    sym.omegaHappy,
                    sym.omegaHappy,
                    sym.happy,
                    sym.happy,
                    sym.happy,
                    sym.happy,
                    sym.omegaHappy,
                    sym.happy,
                    sym.uberHappy,
                    sym.uberHappy,
                    sym.uberHappy,
                    sym.wild,
                    sym.wild,
                    sym.wild,
                ],
                [
                    sym.happy,
                    sym.happy,
                    sym.happy,
                    sym.happy,
                    sym.uberHappy,
                    sym.omegaHappy,
                    sym.uberHappy,
                    sym.wild,
                    sym.wild,
                    sym.uberHappy,
                    sym.uberHappy,
                    sym.uberHappy,
                    sym.happy,
                    sym.uberHappy,
                    sym.happy,
                    sym.happy,
                    sym.happy,
                    sym.omegaHappy,
                    sym.omegaHappy,
                    sym.omegaHappy,
                    sym.happy,
                    sym.uberHappy,
                    sym.happy,
                    sym.happy,
                    sym.uberHappy,
                    sym.happy,
                    sym.happy,
                    sym.omegaHappy,
                    sym.happy,
                    sym.uberHappy,
                    sym.uberHappy,
                    sym.uberHappy,
                    sym.wild,
                    sym.wild,
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
                countsToPrize: [0, 0, 20],
            },
            seven: {
                identity: "fixed",
                prizeCondition: "line_from_left_consecutive",
                countsToPrize: [0, 0, 100],
            },
            wild: {
                identity: "wild",
                prizeCondition: "line_from_left_consecutive",
                countsToPrize: [0, 0, 400],
            },
        } satisfies SymbolsManifest;

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

    export namespace SingleLineThreeReel {
        export const sym = {
            bar: {
                identity: "fixed",
                prizeCondition: "line_from_left_consecutive",
                countsToPrize: [0, 0, 5],
            },
            cherry: {
                identity: "fixed",
                prizeCondition: "line_from_left_consecutive",
                countsToPrize: [0, 0, 15],
            },
            seven: {
                identity: "fixed",
                prizeCondition: "line_from_left_consecutive",
                countsToPrize: [0, 0, 44],
            },
            wild: {
                identity: "wild",
                prizeCondition: "line_from_left_consecutive",
                countsToPrize: [0, 0, 150],
            },
        } satisfies SymbolsManifest;

        export const rules: RpgSlotMachine.Rules = {
            price: 3,
            height: 1,
            lines: [
                [0, 0, 0],
            ],
            reels: [
                [
                    sym.seven,
                    sym.cherry,
                    sym.cherry,
                    sym.bar,
                    sym.seven,
                    sym.bar,
                    sym.wild,
                    sym.bar,
                ],
                [
                    sym.bar,
                    sym.cherry,
                    sym.seven,
                    sym.bar,
                    sym.cherry,
                    sym.bar,
                    sym.cherry,
                    sym.wild,
                ],

                [
                    sym.bar,
                    sym.cherry,
                    sym.bar,
                    sym.bar,
                    sym.seven,
                    sym.bar,
                    sym.wild,
                    sym.bar,
                ],
            ],
        };
    }
}
