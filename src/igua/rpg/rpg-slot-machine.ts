import { Logger } from "../../lib/game-engine/logger";
import { Integer } from "../../lib/math/number-alias-types";
import { Rng } from "../../lib/math/rng";
import { Undefined } from "../../lib/types/undefined";

export namespace RpgSlotMachine {
    export type Reel<TMaterial> = Symbol<TMaterial>[];

    export interface Symbol<TMaterial> {
        prizeCondition: "line_from_left_consecutive"; // | "scatter";
        // TODO another indentity: "flexible" for matching certain symbols to each other?
        identity: "fixed" | "wild";
        countsToPrize: Array<Integer>;
        countsToMaterial?: Array<TMaterial | null>;
    }

    export type Line = Integer[];

    export interface Rules<TMaterial> {
        price: Integer;
        lines: Line[];
        reels: Reel<TMaterial>[];
        height: Integer;
    }

    export function spin<TMaterial>(rules: Rules<TMaterial>) {
        type Symbol = RpgSlotMachine.Symbol<TMaterial>;

        verifyRules(rules);

        const reelsWithOffsets = rules.reels.map(reel => ({ reel, offset: Rng.int(reel.length) }));

        const effectiveReels = reelsWithOffsets.map(({ reel, offset }) => {
            const effectiveReel: Symbol[] = [];
            for (let i = 0; i < rules.height; i++) {
                effectiveReel.push(reel[(offset + i) % reel.length]);
            }
            return effectiveReel;
        });

        let totalMaterialsCount = 0;
        const linePrizes = new Array<SpinResult.LinePrize<TMaterial>>();

        for (let i = 0; i < rules.lines.length; i++) {
            const line = rules.lines[i];
            let symbolToMatch = Undefined<Symbol>();
            let leftmostWildSymbol = Undefined<Symbol>();
            let symbolCount = 0;
            for (let x = 0; x < line.length; x++) {
                const y = line[x];
                const symbol = effectiveReels[x][y];

                if (symbol.identity === "wild") {
                    symbolCount += 1;

                    if (x === 0) {
                        leftmostWildSymbol = symbol;
                    }
                }
                else if (symbolToMatch === undefined) {
                    symbolToMatch = symbol;
                    symbolCount += 1;
                }
                else if (symbol === symbolToMatch) {
                    symbolCount += 1;
                }
                else {
                    break;
                }
            }

            const prizeSymbol = symbolToMatch ? symbolToMatch : leftmostWildSymbol;

            const credits = prizeSymbol?.countsToPrize[symbolCount - 1] ?? null;
            const material = prizeSymbol?.countsToMaterial?.[symbolCount - 1] ?? null;

            if (credits || material) {
                linePrizes.push({ index: i, credits, material });
            }

            if (material) {
                totalMaterialsCount++;
            }
        }

        // TODO const scatterSymbolCounts = new Map<Symbol, Integer>();

        const totalPrize = linePrizes.reduce((sum, { credits }) => sum + (credits ?? 0), 0);

        return {
            reelOffsets: reelsWithOffsets.map(({ offset }) => offset),
            linePrizes,
            totalMaterialsCount,
            totalPrize,
        };
    }

    export type SpinResult = ReturnType<typeof spin>;

    export namespace SpinResult {
        export interface LinePrize<TMaterial> {
            index: Integer;
            credits: Integer | null;
            material: TMaterial | null;
        }
    }

    function verifyRules(rules: Rules<unknown>) {
        if (rules.reels.length < 1) {
            Logger.logContractViolationError(
                "RpgSlotMachine",
                new Error("There must be at least 1 reel"),
                rules,
            );
        }

        for (const line of rules.lines) {
            if (line.length !== rules.reels.length) {
                Logger.logContractViolationError(
                    "RpgSlotMachine",
                    new Error("All lines must have the same length as reels"),
                    rules,
                );
                break;
            }
        }
    }
}
