import { Container, DisplayObject, Graphics, Point, Rectangle, Sprite, Texture } from "pixi.js";
import { objText } from "../../../assets/fonts";
import { Tx } from "../../../assets/textures";
import { Environment } from "../../../lib/environment";
import { AsshatTicker } from "../../../lib/game-engine/asshat-ticker";
import { MusicTrack } from "../../../lib/game-engine/audio/asshat-jukebox";
import { Coro } from "../../../lib/game-engine/routines/coro";
import { holdf } from "../../../lib/game-engine/routines/hold";
import { factor, interp } from "../../../lib/game-engine/routines/interp";
import { onPrimitiveMutate } from "../../../lib/game-engine/routines/on-primitive-mutate";
import { sleep, sleepf } from "../../../lib/game-engine/routines/sleep";
import { TickerContainer } from "../../../lib/game-engine/ticker-container";
import { approachLinear } from "../../../lib/math/number";
import { Integer, RgbInt } from "../../../lib/math/number-alias-types";
import { container } from "../../../lib/pixi/container";
import { Null } from "../../../lib/types/null";
import { Jukebox } from "../../core/igua-audio";
import { renderer } from "../../current-pixi-renderer";
import { DataIdol } from "../../data/data-idol";
import { DataPocketItem } from "../../data/data-pocket-item";
import { DataSongTitle } from "../../data/data-song-title";
import { Cutscene, Input } from "../../globals";
import { mxnBoilPivot } from "../../mixins/mxn-boil-pivot";
import { mxnHasHead } from "../../mixins/mxn-has-head";
import { mxnHudModifiers } from "../../mixins/mxn-hud-modifiers";
import { CtxInteract } from "../../mixins/mxn-interact";
import { Rpg } from "../../rpg/rpg";
import { RpgExperience } from "../../rpg/rpg-experience";
import { RpgSceneIdol } from "../../rpg/rpg-player-aggregated-buffs";
import { RpgPocket, RpgPocketSlot } from "../../rpg/rpg-pocket";
import { RpgSaveFiles } from "../../rpg/rpg-save-files";
import { objFigurePocketItem } from "../figures/obj-figure-pocket-item";
import { objFloppyDisk } from "../obj-floppy-disk";
import { playerObj } from "../obj-player";
import { StepOrder } from "../step-order";
import { objFlopCollectionIndicator } from "./obj-flop-collection-indicator";
import { objHealthBar } from "./obj-health-bar";
import { objStatusBar } from "./obj-status-bar";
import { objUiDelta } from "./obj-ui-delta";
import { objUiSubdividedBar } from "./obj-ui-subdivided-bar";

const Consts = {
    StatusTextTint: 0x00ff00,
};

export function objHud() {
    const healthBarObj = objHealthBar(
        Rpg.character.status.healthMax,
        9,
        Rpg.character.status.health,
        Rpg.character.status.healthMax,
    );
    const valuablesInfoObj = objValuablesInfo();
    const poisonBuildUpObj = objPoisonBuildUp();
    const poisonLevelObj = objPoisonLevel();
    const { buildUpObj: songInfoBuildUpObj, textObj: songInfoObj } = createSongInfoObjs();

    const statusObjs: Array<Container & { advance?: number; effectiveHeight?: number }> = [
        valuablesInfoObj,
        objPocketInfo(),
        objIdolBuff(),
        poisonLevelObj,
        songInfoObj,
        poisonBuildUpObj,
        objHeliumBuildUp(),
        songInfoBuildUpObj,
        objOverheatBuildUp(),
        ...createQuitObjs(),
    ];

    const statusObjsContainer = container(...statusObjs);

    return container(
        objCutsceneLetterbox(),
        container(healthBarObj, statusObjsContainer).at(3, 3),
        objInteractIndicator(),
        objExperienceIndicator(),
        objFlopCollectionIndicator().at(3, 336),
        objSaveIndicator(),
    )
        .merge({ healthBarObj, effectiveHeight: 0 })
        .step(self => {
            {
                const showStatus = !mxnHudModifiers.mxnHideStatus.exists();
                healthBarObj.visible = showStatus;
                statusObjsContainer.visible = showStatus;
            }
            healthBarObj.maxValue = approachLinear(healthBarObj.maxValue, Rpg.character.status.healthMax, 1);
            healthBarObj.width = healthBarObj.maxValue;
            let y = 7;
            let lastVisibleObj: Container = healthBarObj;
            for (const statusObj of statusObjs) {
                if (!statusObj.visible || !statusObjsContainer.visible) {
                    continue;
                }
                lastVisibleObj = statusObj;
                y += 3;
                statusObj.y = y;
                if (statusObj["effectiveHeight"]) {
                    y += statusObj.effectiveHeight!;
                }
                else {
                    y += statusObj.height + (statusObj["advance"] ?? 0);
                }
            }

            if (!playerObj) {
                self.visible = false;
            }
            else {
                self.visible = !playerObj.destroyed;
            }
            self.effectiveHeight = self.visible ? self.y + lastVisibleObj.y + lastVisibleObj.height : 0;
        });
}

function objSaveIndicator() {
    return container()
        .coro(function* (self) {
            while (true) {
                yield () => RpgSaveFiles.saveEvents.length > 0;
                const event = RpgSaveFiles.saveEvents.last;
                RpgSaveFiles.saveEvents.length = 0;
                const floppyDiskObj = objFloppyDisk()
                    .pivotedUnit(1, 0)
                    .at(490, 10)
                    .show(self);
                if (event === "error") {
                    Sprite.from(Tx.Ui.SaveFail)
                        .mixin(mxnBoilPivot)
                        .at(-6, -2)
                        .show(floppyDiskObj);
                }
                yield sleep(2000);
                self.removeAllChildren();
            }
        });
}

const p = new Point();
const r = new Rectangle();

function objInteractIndicator() {
    let previousInteractObj = Null<DisplayObject>();
    let updatedOffsetY = 0;

    return container(
        container(
            Sprite.from(Tx.Ui.InteractionIndicator).tinted(0x000000).at(1, 2),
            Sprite.from(Tx.Ui.InteractionIndicator),
        )
            .pivoted(12, 23)
            .step(
                self => {
                    const interactObj = playerObj?.canInteract ? CtxInteract.value.highestScoreInteractObj : null;

                    if (interactObj !== previousInteractObj) {
                        updatedOffsetY = 4;
                        previousInteractObj = interactObj;
                    }

                    if (!interactObj) {
                        self.visible = false;
                        return;
                    }

                    updatedOffsetY = approachLinear(updatedOffsetY, 0, 0.75);

                    self.visible = true;

                    // Concerning -- It appears that getBounds does not reset the rectangle
                    // In particular when a container has no visible children
                    r.x = 0;
                    r.y = 0;
                    r.width = 0;
                    r.height = 0;

                    let boundsObj = interactObj.interact.hotspotObj
                        ?? (interactObj.is(mxnHasHead) ? interactObj.mxnHead.obj : interactObj);

                    if (boundsObj.mask instanceof Container) {
                        boundsObj = boundsObj.mask;
                    }

                    boundsObj.getBounds(false, r);
                    if (r.x === 0 && r.y === 0 && r.width === 0 && r.height === 0) {
                        self.at(interactObj.getGlobalPosition(p, false));
                    }
                    else {
                        self.at(r.x + r.width / 2, r.y);
                    }

                    self.y += updatedOffsetY;
                    self.vround();
                },
            ),
    );
}

const iconTxs = Tx.Ui.Experience.Icon12.split({ width: 22 });

interface ExperienceIndicatorConfig {
    tint: RgbInt;
    iconTx: Texture;
}

export const experienceIndicatorConfigs: Record<RpgExperience.Id, ExperienceIndicatorConfig> = {
    combat: {
        tint: 0xFF401E,
        iconTx: iconTxs[0],
    },
    computer: {
        tint: 0xFF7B00,
        iconTx: iconTxs[1],
    },
    gambling: {
        tint: 0xEABB00,
        iconTx: iconTxs[2],
    },
    jump: {
        tint: 0x19A859,
        iconTx: iconTxs[3],
    },
    pocket: {
        tint: 0x54BAFF,
        iconTx: iconTxs[4],
    },
    quest: {
        tint: 0x3775E8,
        iconTx: iconTxs[5],
    },
    social: {
        tint: 0xA074E8,
        iconTx: iconTxs[6],
    },
    spirit: {
        tint: 0x2e2e2e,
        iconTx: iconTxs[7],
    },
};

export const experienceIndicatorConfigsArray = Object.entries(experienceIndicatorConfigs).map((
    [experienceKey, config],
) => ({
    experienceKey: experienceKey as RpgExperience.Id,
    ...config,
}));

function objExperienceIndicator() {
    const weights = experienceIndicatorConfigsArray.map(({ tint }) => ({
        tint,
        value: 0,
    }));

    const deltaObjs = experienceIndicatorConfigsArray.map(({ experienceKey, ...config }) => {
        function shouldShowTotal() {
            return mxnHudModifiers.mxnExperienceIndicatorShowTotals.exists() && Rpg.experience[experienceKey] > 0;
        }

        return objExperienceIndicatorDelta(config)
            .invisible()
            .coro(function* (self) {
                let value = Rpg.experience[experienceKey];
                while (true) {
                    yield () => Rpg.experience[experienceKey] != value || shouldShowTotal();
                    const forceShowTotal = Rpg.experience[experienceKey] === value && shouldShowTotal();
                    self.visible = true;
                    self.state.total = value;
                    let nextValue = Rpg.experience[experienceKey];
                    if (!forceShowTotal) {
                        yield holdf(() => {
                            const latestValue = Rpg.experience[experienceKey];
                            self.state.delta = latestValue - value;
                            if (latestValue !== nextValue) {
                                nextValue = latestValue;
                                return false;
                            }

                            return true;
                        }, 120);
                    }
                    value = nextValue;
                    self.state.total = value;
                    self.state.delta = 0;
                    if (forceShowTotal) {
                        yield* Coro.race([
                            () => Rpg.experience[experienceKey] != value,
                            () => !shouldShowTotal(),
                            sleepf(120),
                        ]);
                    }
                    else {
                        yield* Coro.race([
                            () => Rpg.experience[experienceKey] != value,
                            shouldShowTotal,
                            sleepf(120),
                        ]);
                    }
                    self.visible = false;
                }
            }, -2);
    });

    function updateWeights() {
        for (let i = 0; i < experienceIndicatorConfigsArray.length; i++) {
            weights[i].value = Rpg.experience[experienceIndicatorConfigsArray[i].experienceKey];
        }
    }

    const xPositions = {
        left: 4,
        right: renderer.width - 128 - 4,
    };

    updateWeights();
    const subdividedBarObj = objUiSubdividedBar({ width: 128, height: 4, tint: 0x404040, weights });

    const root = new TickerContainer(new AsshatTicker(), true, StepOrder.BeforeCamera);

    container(subdividedBarObj, ...deltaObjs)
        .step(updateWeights, -1)
        .step(() => {
            let maximumX = 128;
            for (let i = deltaObjs.length - 1; i >= 0; i--) {
                const deltaObj = deltaObjs[i];
                const rectangle = subdividedBarObj.renderedWeights[i];
                if (!deltaObj.visible) {
                    continue;
                }
                deltaObj.x = Math.min(rectangle.x + rectangle.width, maximumX) - deltaObj.effectiveWidth;
                maximumX = deltaObj.x;
            }

            let xCorrection = 0;

            for (let i = 0; i < deltaObjs.length; i++) {
                const deltaObj = deltaObjs[i];
                if (!deltaObj.visible || deltaObj.x >= 0) {
                    continue;
                }

                if (xCorrection === 0) {
                    xCorrection = -deltaObj.x;
                    break;
                }
            }

            if (xCorrection === 0) {
                return;
            }

            for (let i = 0; i < deltaObjs.length; i++) {
                deltaObjs[i].x += xCorrection;
            }
        }, 2)
        .step(self => {
            self.visible = !mxnHudModifiers.mxnHideExperience.exists();
            self.x = approachLinear(
                self.x,
                mxnHudModifiers.mxnExperienceIndicatorToLeft.exists() ? xPositions.left : xPositions.right,
                16,
            );
        })
        .at(xPositions.right, renderer.height - 8)
        .show(root);

    return root;
}

function objExperienceIndicatorDelta({ tint, iconTx }: ExperienceIndicatorConfig) {
    const state = {
        total: 0,
        delta: 0,
    };

    const gfx = new Graphics();
    const totalTextObj = objText.Medium("", { tint: 0xffffff }).pivoted(-1, -1);
    const deltaTextObj = objText.SmallDigits("", { tint }).pivoted(-1, -2);
    const iconObj = Sprite.from(iconTx).anchored(0.5, 1);

    return container(gfx, totalTextObj, deltaTextObj, iconObj)
        .merge({
            state,
            get effectiveWidth() {
                return gfx.width;
            },
        })
        .step(() => {
            totalTextObj.text = state.delta < 0 ? ("" + (state.total + state.delta)) : ("" + state.total);
            deltaTextObj.visible = state.delta > 0;
            if (deltaTextObj.visible) {
                deltaTextObj.x = totalTextObj.width + 2;
                deltaTextObj.text = "+" + state.delta;
            }

            const { width, height } = totalTextObj;
            gfx.clear()
                .beginFill(tint).drawRect(0, 0, width + 2, height + 2);

            if (deltaTextObj.visible) {
                gfx.beginFill(0xffffff).drawRect(width + 2, 0, deltaTextObj.width + 2, height + 2);
            }

            iconObj.x = Math.round(gfx.width / 2);
        }, 1)
        .pivoted(0, 9);
}

export type ObjHud = ReturnType<typeof objHud>;

function objCutsceneLetterbox() {
    return new Graphics().beginFill(0x101010).drawRect(0, renderer.height - 12, renderer.width, 12).coro(
        function* (self) {
            while (true) {
                self.scale.x = 0;
                self.pivot.x = 0;
                yield () => Boolean(Cutscene.current) && Cutscene.current!.attributes.letterbox;
                yield interp(self.scale, "x").factor(factor.sine).to(1).over(250);
                yield () => !Cutscene.current?.attributes?.letterbox;
                yield interp(self.pivot, "x").steps(16).to(-renderer.width).over(300);
            }
        },
    );
}

function objPocketInfo() {
    return container()
        .merge({ effectiveHeight: 0 })
        .coro(function* (self) {
            while (true) {
                self.removeAllChildren();

                const count = Rpg.inventory.pocket.slots.length === 1 && Rpg.inventory.pocket.slots[0].isEmpty
                    ? 0
                    : Rpg.inventory.pocket.slots.length;

                for (let i = 0; i < count; i++) {
                    const slot = Rpg.inventory.pocket.slots[i];
                    objPocketSlotInfo(slot, i > 0)
                        .at(0, i * 10)
                        .show(self);
                }

                self.effectiveHeight = self.children.length * 10;

                yield onPrimitiveMutate(() =>
                    Number(Rpg.inventory.pocket.slots[0].isEmpty) + Rpg.inventory.pocket.slots.length * 10
                );
            }
        });
}

function objPocketSlotInfo(slot: RpgPocketSlot, isExtra: boolean) {
    const prefixText = isExtra ? "Your extra pocket has " : "Your pocket has ";
    const prefixTextObj = objText.MediumIrregular(prefixText, { tint: Consts.StatusTextTint });
    const suffixTextObj = objText.MediumIrregular("", { tint: Consts.StatusTextTint });

    let appliedPocketItemId: RpgPocket.Item | null = null;

    const figureMaskObj = new Graphics().beginFill(0xff0000).drawRect(0, 2, 21, 12);

    const figureContainerObj = container(
        container()
            .step((self) => {
                if (appliedPocketItemId === slot.item) {
                    return;
                }

                const pocketItemId = slot.item;
                self.removeAllChildren();
                if (pocketItemId !== null) {
                    objFigurePocketItem(pocketItemId).show(self);
                }
                appliedPocketItemId = pocketItemId;
            })
            .masked(figureMaskObj),
        figureMaskObj,
    )
        .step(self => self.visible = Rpg.character.attributes.intelligence >= 1 && !slot.isEmpty)
        .at(prefixTextObj.width, -4);

    return container(
        prefixTextObj,
        suffixTextObj,
        figureContainerObj,
    )
        .step(() => {
            suffixTextObj.x = figureContainerObj.visible ? (figureContainerObj.x + 24) : prefixTextObj.width;
            if (slot.item) {
                suffixTextObj.text = DataPocketItem.getById(slot.item).name + "x" + slot.count;
            }
            else {
                suffixTextObj.text = "nothing";
            }

            prefixTextObj.seed = slot.count + 81_000;
            suffixTextObj.seed = slot.count + 80_000;
        });
}

function createQuitObjs() {
    if (Environment.isElectron) {
        const max = 180;
        let value = 0;
        return [
            objBuildUp({
                message: "Keep holding ESCAPE to quit...",
                get value() {
                    return value;
                },
                max,
            })
                .step((self) => {
                    if (!Cutscene.isPlaying && Input.isDown("Quit")) {
                        if (self.parent.worldVisible) {
                            value += 1;
                        }

                        if (value >= max) {
                            value = max;
                            window.close();
                        }
                    }
                    else {
                        value = 0;
                    }
                }),
        ];
    }
    return [];
}

function createSongInfoObjs() {
    // TODO is there a clever way for this state to be tracked in the player's RPG status?
    const state = {
        recognizedTrack: Null<MusicTrack>(),
        value: 0,
        max: 200,
    };

    return {
        buildUpObj: objBuildUp({
            message: "You recognize this song...",
            get value() {
                return Math.round(state.value);
            },
            get max() {
                return state.max;
            },
        })
            .coro(function* () {
                while (true) {
                    yield onPrimitiveMutate(() => Jukebox.currentTrack);
                    state.value = 0;
                    state.recognizedTrack = null;
                }
            })
            .step(() => {
                if (Rpg.character.buffs.esoteric.recognizeSongFactor <= 0) {
                    state.value = 0;
                    state.recognizedTrack = null;
                    return;
                }
                if (Jukebox.currentTrack && state.recognizedTrack !== Jukebox.currentTrack) {
                    state.value = Math.min(
                        state.max,
                        state.value + (Rpg.character.buffs.esoteric.recognizeSongFactor / 100),
                    );
                    if (state.value >= state.max) {
                        state.recognizedTrack = Jukebox.currentTrack;
                        state.value = 0;
                    }
                }
            }),
        textObj: objText.MediumIrregular("", { tint: Consts.StatusTextTint })
            .step(self => {
                self.visible = Boolean(state.recognizedTrack);
                self.text = state.recognizedTrack
                    ? `Listening to: "${DataSongTitle.getByMusicTrack(state.recognizedTrack).title}"`
                    : "";
            }),
    };
}

function objValuablesInfo() {
    const youHaveTextObj = objText.MediumIrregular("You have 0 valuables", { tint: Consts.StatusTextTint })
        .step(text => {
            const valuables = Rpg.wallet.count("valuables");
            text.seed = valuables + 64;
            text.text = valuables === 1
                ? "You have 1 valuable"
                : `You have ${valuables} valuables`;
        });

    return container(
        youHaveTextObj,
        objUiDelta({
            valueProvider: () => Rpg.wallet.count("valuables"),
            bgNegativeTint: 0xff0000,
            bgPositiveTint: 0x00ff00,
            fgTint: 0xffffff,
        })
            .step(self => self.x = youHaveTextObj.width + 4),
    )
        .merge({ effectiveHeight: 8 });
}

function objPoisonLevel() {
    return objText.MediumIrregular("You are poisoned", { tint: Consts.StatusTextTint })
        .merge({ advance: -3 })
        .step(text => {
            const level = Rpg.character.status.conditions.poison.level;
            text.visible = level > 0;
            if (text.visible) {
                text.text = level > 1 ? ("You are poisoned x" + level) : "You are poisoned";
            }
        });
}

function objPoisonBuildUp() {
    return objConditionBuildUp({
        message: "Poison is building...",
        conditionsKey: "poison",
    });
}

function objHeliumBuildUp() {
    return objConditionBuildUp({
        message: "Helium is potent...",
        conditionsKey: "helium",
    });
}

function objOverheatBuildUp() {
    return objConditionBuildUp({
        message: "You are overheating!",
        conditionsKey: "overheat",
    });
}

function objIdolBuff() {
    return objText.MediumIrregular("", { tint: Consts.StatusTextTint })
        .step(text => {
            const idol = RpgSceneIdol.value.idol;
            text.visible = Boolean(idol && !idol.isEmpty);
            if (text.visible) {
                text.text = DataIdol.getById(idol?.idolId!).hudText;
            }
        })
        .merge({ effectiveHeight: 9 });
}

interface ObjConditionBuildUpArgs {
    message: string;
    conditionsKey: "poison" | "helium" | "overheat";
    // TODO tint
}

function objConditionBuildUp({ message, conditionsKey }: ObjConditionBuildUpArgs) {
    return objBuildUp({
        message,
        get value() {
            return Rpg.character.status.conditions[conditionsKey].value;
        },
        get max() {
            return Rpg.character.status.conditions[conditionsKey].max;
        },
    });
}

interface ObjBuildUpArgs {
    message: string;
    value: Integer;
    max: Integer;
    // TODO tint
}

function objBuildUp(args: ObjBuildUpArgs) {
    let value = args.value;
    const text = objText.MediumIrregular(args.message, { tint: Consts.StatusTextTint });
    const bar = objStatusBar({
        height: 1,
        width: 85,
        value,
        maxValue: args.max,
        tintBack: 0x003000,
        tintFront: 0x008000,
        increases: [{ tintBar: 0x00ff00 }],
        decreases: [{ tintBar: 0x003000 }],
    }).at(0, 8);

    let visibleSteps = 0;

    return container(bar, text)
        .step(self => {
            const nextValue = args.value;
            bar.maxValue = args.max;

            if (nextValue > value) {
                bar.increase(nextValue, nextValue - value, 0);
            }
            else if (nextValue < value) {
                bar.decrease(nextValue, nextValue - value, 0);
            }
            value = nextValue;
            // I don't remember what I was trying to accomplish with this.
            // const maxVisibleSteps = RpgPlayer.status.conditions.poison.level === 0 ? 1 : 2;
            visibleSteps = value > 0 ? 2 : (visibleSteps - 1);
            self.visible = visibleSteps > 0;
        });
}
