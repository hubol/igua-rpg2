import { Logger } from "../../lib/game-engine/logger";
import { Integer } from "../../lib/math/number-alias-types";
import { Rng } from "../../lib/math/rng";
import { Undefined } from "../../lib/types/undefined";
import { DataPotion } from "../data/data-potion";
import { RpgInventory } from "./rpg-inventory";

export namespace RpgSlotMachine {
    export namespace Material {
        export interface ConsumePotion {
            kind: "consume_potion";
            id: DataPotion.Id;
        }

        export interface ReceiveItem {
            kind: "receive_item";
            item: RpgInventory.Item;
            count: Integer;
        }
    }

    export type Material = Material.ConsumePotion | Material.ReceiveItem;

    export type Reel = Symbol[];

    export interface Symbol {
        prizeCondition: "line_from_left_consecutive"; // | "scatter";
        // TODO another indentity: "flexible" for matching certain symbols to each other?
        identity: "fixed" | "wild";
        countsToPrize: Array<Integer>;
        countsToMaterial?: Array<Material | null>;
    }

    export type Line = Integer[];

    export interface Rules {
        price: Integer;
        lines: Line[];
        reels: Reel[];
        height: Integer;
    }

    export function spin(rules: Rules) {
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
        const linePrizes = new Array<SpinResult.LinePrize>();

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
        export interface LinePrize {
            index: Integer;
            credits: Integer | null;
            material: Material | null;
        }
    }

    function verifyRules(rules: Rules) {
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
