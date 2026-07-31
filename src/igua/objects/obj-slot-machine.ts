import { Graphics, LINE_CAP, Matrix, Sprite, Texture } from "pixi.js";
import { Sfx } from "../../assets/sounds";
import { Sound } from "../../lib/game-engine/audio/sound";
import { Logger } from "../../lib/game-engine/logger";
import { Coro } from "../../lib/game-engine/routines/coro";
import { factor, interp } from "../../lib/game-engine/routines/interp";
import { onPrimitiveMutate } from "../../lib/game-engine/routines/on-primitive-mutate";
import { sleep } from "../../lib/game-engine/routines/sleep";
import { cyclic } from "../../lib/math/number";
import { Integer, RgbInt } from "../../lib/math/number-alias-types";
import { Rng } from "../../lib/math/rng";
import { vnew } from "../../lib/math/vector-type";
import { container } from "../../lib/pixi/container";
import { range } from "../../lib/range";
import { DataSlotMachines } from "../data/data-slot-machines";
import { DramaWallet } from "../drama/drama-wallet";
import { show } from "../drama/show";
import { Cutscene } from "../globals";
import { GenerativeMusicUtils } from "../lib/generative-music-utils";
import { Rpg } from "../rpg/rpg";
import { RpgEconomy } from "../rpg/rpg-economy";
import { RpgSlotMachine } from "../rpg/rpg-slot-machine";

interface SlotMachineRenderConfigBase {
    mask: {
        y: Integer;
        height: Integer;
    };
    reel: {
        gap: Integer;
    };
    slot: {
        gap: Integer;
    };
    lineHighlightTint: RgbInt;
}

interface SlotMachineRenderConfig<TSymbols extends DataSlotMachines.SymbolsManifest>
    extends SlotMachineRenderConfigBase
{
    sym: TSymbols;
    symbolTxs: Partial<Record<keyof TSymbols, Texture>>;
}

interface SlotMachineSfx {
    tone: Sound;
    win: Sound;
}

namespace SymbolTextures {
    export function create(config: SlotMachineRenderConfig<DataSlotMachines.SymbolsManifest>) {
        const map = new Map<RpgSlotMachine.Symbol, Texture>(
            // @ts-expect-error Don't care
            Object.entries(config.sym)
                .filter(([key]) => key in config.symbolTxs)
                .map(([key, symbol]) => [symbol, config.symbolTxs[key]]),
        );

        if (map.size === 0) {
            Logger.logContractViolationError(
                "SymbolTextures.create",
                new Error("symbolTxs appears to be empty"),
                { config },
            );
        }

        return {
            map,
            fallback: [...map.values()][0],
        };
    }

    export type Type = ReturnType<typeof create>;
}

export function objSlotMachine<TSymbols extends DataSlotMachines.SymbolsManifest>(
    rules: RpgSlotMachine.Rules,
    config: SlotMachineRenderConfig<TSymbols>,
    sfx: SlotMachineSfx = { tone: Sfx.Interact.SlotMachine.Tone0, win: Sfx.Interact.SlotMachine.Win0 },
    currencyId: RpgEconomy.Currency.Id = "valuables",
) {
    const symbolTxs = SymbolTextures.create(config);
    const pricePerSpin: RpgEconomy.Offer = { currency: currencyId, price: rules.price };

    let reelsAdvancedCount = 0;

    const reelObjs = rules.reels.map((reel, i) =>
        objReel({ config, reel, rules }, symbolTxs)
            .at(i * config.reel.gap, -symbolPadding * config.slot.gap)
            .handles("objReel.advanced", () => reelsAdvancedCount++)
    );

    const maskObj = new Graphics().beginFill(0xffffff).drawRect(
        0,
        config.mask.y,
        config.reel.gap * (rules.reels.length + 1),
        config.mask.height,
    );
    const reelObj = container(...reelObjs, maskObj).masked(maskObj);
    const resultsObj = container();

    let paidForGame = false;
    let fastSpinRequested = false;

    const api = {
        get rules() {
            return rules;
        },
        get pricePerSpin() {
            return pricePerSpin;
        },
        get canRequestSpin() {
            return !paidForGame || !fastSpinRequested;
        },
        requestSpin() {
            if (!paidForGame) {
                if (!Rpg.wallet.canAfford(pricePerSpin)) {
                    Cutscene.play(function* () {
                        Sfx.Interact.Error.play();
                        yield* show(
                            "Minimum bet is "
                                + RpgEconomy.Offer.toString(pricePerSpin.price, pricePerSpin.currency)
                                + ".",
                        );
                    }, { speaker: obj });
                }
                else {
                    Rpg.wallet.spend(pricePerSpin.currency, pricePerSpin.price, "gambling");
                    DramaWallet.createSpentCurrency(pricePerSpin.currency, pricePerSpin.price);
                    fastSpinRequested = false;
                    paidForGame = true;
                }
            }
            else if (!fastSpinRequested) {
                fastSpinRequested = true;
            }
        },
    };

    const obj = container(reelObj, resultsObj);

    return obj
        .merge({ objSlotMachine: api })
        .dispatches<"objSlotMachine.gameStarted">()
        .dispatches<"objSlotMachine.fastSpinOpportunityEnded">()
        .dispatchesValue<"objSlotMachine.gameEnded", RpgSlotMachine.SpinResult>()
        .dispatchesValue<"objSlotMachine.showLinePrize", RpgSlotMachine.SpinResult.LinePrize>()
        .dispatchesValue<"objSlotMachine.showGamePrize", Integer>()
        .coro(function* (self) {
            while (true) {
                yield () => paidForGame;

                resultsObj.removeAllChildren();
                self.dispatch("objSlotMachine.gameStarted");

                const spinResult = RpgSlotMachine.spin(rules);
                const { totalPrize, reelOffsets, linePrizes } = spinResult;

                for (const reelObj of reelObjs) {
                    reelObj.controls.offsetDelta = Rng.float(0.175, 0.3);
                }

                function* spinReels() {
                    for (let i = 0; i < reelOffsets.length; i++) {
                        const offset = reelOffsets[i];
                        const reelObj = reelObjs[i];

                        yield sleep(i === 0 ? 500 : 125);

                        yield () => Math.abs(reelObj.controls.offset - offset) < 1;

                        reelObj.controls.offsetDelta = 0;
                        yield interp(reelObj.controls, "offset").factor(factor.sine).to(offset).over(Rng.int(250, 750));
                    }
                }

                yield* Coro.race([
                    spinReels(),
                    () => fastSpinRequested,
                ]);

                self.dispatch("objSlotMachine.fastSpinOpportunityEnded");

                if (fastSpinRequested) {
                    const coros: Coro.Type[] = [];

                    for (let i = 0; i < reelOffsets.length; i++) {
                        const controls = reelObjs[i].controls;
                        const targetOffset = reelOffsets[i];
                        coros.push(
                            Coro.chain([
                                Coro.race([
                                    () =>
                                        controls.offset < targetOffset || Math.abs(controls.offset - targetOffset) < 1,
                                    interp(controls, "offsetDelta").steps(4).to(0.9).over(500),
                                ]),
                                () => (controls.offsetDelta = 0, true),
                                interp(controls, "offset").factor(factor.sine).to(targetOffset).over(300),
                            ]),
                        );
                    }
                    yield* Coro.all(coros);
                    yield sleep(100);
                }

                self.dispatch("objSlotMachine.gameEnded", spinResult);

                if (linePrizes.length) {
                    objLineHighlighter(reelObjs, reelObj.localTransform)
                        .tinted(config.lineHighlightTint)
                        .coro(function* (highlighterObj) {
                            while (true) {
                                for (const prize of linePrizes) {
                                    self.dispatch("objSlotMachine.showLinePrize", prize);
                                    highlighterObj.controls.line = rules.lines[prize.index];
                                    yield sleep(1000);
                                    highlighterObj.controls.line = null;
                                    if (prize !== linePrizes.last) {
                                        yield sleep(500);
                                    }
                                }
                                self.dispatch("objSlotMachine.showGamePrize", spinResult.totalPrize);
                                yield sleep(1500);
                            }
                        })
                        .show(resultsObj);
                }

                if (totalPrize > 0) {
                    self.play(sfx.win);
                    self.coro(function* () {
                        yield* DramaWallet.earn(currencyId, totalPrize, "gambling");
                    });
                }
                else {
                    Rpg.wallet.earn("casino_pity", pricePerSpin.price + Rpg.character.buffs.wallet.bonusCasinoPity);
                }

                paidForGame = false;
            }
        })
        .coro(function* (self) {
            while (true) {
                yield onPrimitiveMutate(() => reelsAdvancedCount);
                self.play(sfx.tone.rate(GenerativeMusicUtils.getRate("major")));
                yield sleep(100);
            }
        });
}

export type ObjSlotMachine = ReturnType<typeof objSlotMachine>;

interface ObjReelArgs {
    config: SlotMachineRenderConfigBase;
    reel: RpgSlotMachine.Reel;
    rules: RpgSlotMachine.Rules;
}

const symbolPadding = 2;

function objReel(args: ObjReelArgs, symbolTxs: SymbolTextures.Type) {
    // Before, height and width came from slot config. I am not totally sure why.
    const { width, height } = symbolTxs.fallback;
    const { gap } = args.config.slot;

    const reelLength = args.reel.length;

    const controls = { offset: 0, offsetDelta: 0 };

    const symbolObjs = range(args.rules.height + symbolPadding * 2)
        .map((i) => new Sprite().at(0, i * gap));

    const state = {
        slotPositions: range(args.rules.height).map(i => vnew(width / 2, (i + symbolPadding) * gap + height / 2)),
    };

    return container(...symbolObjs)
        .merge({ controls, state })
        .step(self => {
            controls.offset = cyclic(controls.offset + controls.offsetDelta, 0, reelLength);
            self.pivot.y = Math.round((controls.offset % 1) * gap);

            const reelIndexOffset = -symbolPadding + Math.floor(controls.offset);
            for (let i = 0; i < symbolObjs.length; i++) {
                const reelIndex = cyclic(i + reelIndexOffset, 0, reelLength);
                const symbol = args.reel[reelIndex];
                const tx = symbolTxs.map.get(symbol);
                if (tx) {
                    symbolObjs[i].texture = tx;
                }
                symbolObjs[i].visible = Boolean(tx);
            }
        })
        .dispatches<"objReel.advanced">()
        .coro(function* (self) {
            while (true) {
                yield onPrimitiveMutate(() => Math.floor(controls.offset));
                self.dispatch("objReel.advanced");
            }
        });
}

type ObjReel = ReturnType<typeof objReel>;

function objLineHighlighter(reelObjs: ObjReel[], transform: Matrix) {
    let line: RpgSlotMachine.Line | null = null;

    const controls = {
        set line(value: typeof line) {
            line = value;
            gfx.clear();

            if (!line) {
                return;
            }

            gfx.lineStyle({ cap: LINE_CAP.ROUND, color: 0xffffff, width: 6 });

            const slotPositions = line.map((yIndex, xIndex) => {
                const reelObj = reelObjs[xIndex];
                const v = reelObj.vcpy().add(reelObj.state.slotPositions[yIndex]);
                return transform.apply(v, v);
            });

            const distance = slotPositions[1].x - slotPositions[0].x;
            const half = distance / 2;
            const quarter = distance / 4;

            const points = [
                slotPositions[0].vcpy().add(-half, 0),
                slotPositions[0],
                slotPositions[0].vcpy().add(quarter, 0),
                ...slotPositions.slice(1, -1).flatMap(slot => [
                    slot.vcpy().add(-quarter, 0),
                    slot,
                    slot.vcpy().add(quarter, 0),
                ]),
                slotPositions.last.vcpy().add(-quarter, 0),
                slotPositions.last,
                slotPositions.last.vcpy().add(half, 0),
            ];

            for (let i = 0; i < points.length; i++) {
                const point = points[i].vround();
                gfx[i === 0 ? "moveTo" : "lineTo"](point.x, point.y);
            }
        },
    };

    const gfx = new Graphics();

    return gfx.merge({ controls });
}
