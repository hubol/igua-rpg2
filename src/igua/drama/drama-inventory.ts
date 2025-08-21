import { DisplayObject, Graphics, LINE_CAP, LINE_JOIN, Sprite } from "pixi.js";
import { objText } from "../../assets/fonts";
import { Tx } from "../../assets/textures";
import { Logger } from "../../lib/game-engine/logger";
import { Coro } from "../../lib/game-engine/routines/coro";
import { factor, interpv, interpvr } from "../../lib/game-engine/routines/interp";
import { onMutate } from "../../lib/game-engine/routines/on-mutate";
import { sleep, sleepf } from "../../lib/game-engine/routines/sleep";
import { approachLinear } from "../../lib/math/number";
import { Integer, RgbInt } from "../../lib/math/number-alias-types";
import { Rng } from "../../lib/math/rng";
import { vnew } from "../../lib/math/vector-type";
import { container } from "../../lib/pixi/container";
import { renderer } from "../current-pixi-renderer";
import { DataItem } from "../data/data-item";
import { Input, layers, scene } from "../globals";
import { mxnActionRepeater } from "../mixins/mxn-action-repeater";
import { mxnBoilMirrorRotate } from "../mixins/mxn-boil-mirror-rotate";
import { mxnBoilPivot } from "../mixins/mxn-boil-pivot";
import { mxnBoilSeed } from "../mixins/mxn-boil-seed";
import { objFxBurst32 } from "../objects/effects/obj-fx-burst-32";
import { playerObj } from "../objects/obj-player";
import { Rpg } from "../rpg/rpg";
import { RpgInventory } from "../rpg/rpg-inventory";
import { DramaLib } from "./drama-lib";
import { objDramaOwnedCount } from "./objects/obj-drama-owned-count";

interface AskUseCountOptions {
    min?: Integer;
    max?: Integer;
    multipleOf?: Integer;
    rejectMessage?: string;
}

function* askRemoveCount(
    message: string,
    item: RpgInventory.RemovableItem,
    { min = 1, max: rawMax, multipleOf = 1, rejectMessage = "Never mind" }: AskUseCountOptions = {},
) {
    const colors = DramaLib.Speaker.getColors();

    if (multipleOf < 1) {
        Logger.logContractViolationError(
            "DramaInventory",
            new Error("askRemoveCount multipleOf must be >= 1, setting to 1"),
            { multipleOf },
        );
        multipleOf = 1;
    }

    if (min < multipleOf) {
        Logger.logContractViolationError(
            "DramaInventory",
            new Error("askRemoveCount min must be >= multipleOf, setting to multipleOf"),
            {
                min,
                multipleOf,
            },
        );
        min = multipleOf;
    }

    if (min % multipleOf !== 0) {
        Logger.logContractViolationError(
            "DramaInventory",
            new Error("askRemoveCount min must be a multiple of multipleOf"),
            { min, multipleOf },
        );
    }

    const heldCount = Rpg.inventory.count(item);
    const max = Math.max(Math.floor(heldCount / multipleOf) * multipleOf, rawMax ?? 0);

    const obj = container().show(layers.overlay.messages);

    const messageObj = container(
        Sprite.from(Tx.Ui.Dialog.AskRemoveCountBox).tinted(colors.primary).anchored(0.5, 0.5).mixin(mxnBoilPivot),
        DataItem.getFigureObj(item).pivotedUnit(0.5, 0.5).scaled(2, 2).at(0, -15),
        objHeader(message, colors.textPrimary).pivotedUnit(0.5, 0).at(0, 30),
    )
        .at(renderer.width / 2, -80)
        .coro(function* (self) {
            yield interpvr(self).factor(factor.sine).to(self.x, 28).over(500);
        })
        .show(obj);

    yield () => Input.isUp("Confirm");
    yield () => Input.justWentDown("Confirm");

    const isHoldingAtLeastMinimum = heldCount >= min;

    let isControllable = true;
    let isSliderSelected = isHoldingAtLeastMinimum;

    const sliderObj = objSlider({ max, value: isHoldingAtLeastMinimum ? min : 0, colors });

    const sliderContainerObj = container(
        new Graphics().beginFill(0x000000).drawRect(-140, -20, 300, 60)
            .mixin(mxnBoilPivot)
            .step(self => self.visible = isSliderSelected),
        sliderObj
            .pivotedUnit(0.5, 0.5)
            .mixin(mxnActionRepeater, ["SelectLeft", "SelectRight"])
            .step(self => {
                const scale = isSliderSelected ? 1 : 0.9;
                self.scaled(scale, scale);

                if (!isSliderSelected || !isControllable) {
                    return;
                }

                if (self.mxnActionRepeater.justWentDown("SelectLeft")) {
                    self.controls.value = Math.max(min, self.controls.value - multipleOf);
                }
                else if (self.mxnActionRepeater.justWentDown("SelectRight")) {
                    self.controls.value = Math.min(max, self.controls.value + multipleOf);
                }
            }),
        Sprite.from(Tx.Ui.Dialog.SliderBoxObscured)
            .anchored(0.5, 0.5)
            .mixin(mxnBoilPivot)
            .invisible()
            .step(self => self.visible = !isSliderSelected),
    )
        .at(renderer.width / 2, 140)
        .show(obj);

    const rejectButtonObj = container(
        Sprite.from(Tx.Ui.Dialog.AskRemoveCountRejectBox).tinted(0x000000).anchored(0.5, 0.5).scaled(1.2, 1.2)
            .invisible()
            .step(self => self.visible = !isSliderSelected)
            .mixin(mxnBoilPivot)
            .at(8, 8),
        Sprite.from(Tx.Ui.Dialog.AskRemoveCountRejectBox).tinted(colors.secondary).anchored(0.5, 0.5)
            .step(self => {
                self.pivot.y = isSliderSelected ? 0 : Math.round(Math.sin(scene.ticker.ticks / 60 * Math.PI) * 2);
            }),
        objText.MediumIrregular(rejectMessage, { tint: colors.textSecondary }).anchored(0.5, 0.5).step(self => {
            if (!isSliderSelected && scene.ticker.ticks % 15 === 0) {
                self.seed += 1;
            }
        }),
    )
        .at(renderer.width / 2, 200)
        .show(obj);

    if (!isHoldingAtLeastMinimum) {
        objText.MediumIrregular("You need at least " + min, { tint: 0xc00000 })
            .anchored(0.5, 0.5)
            .at(0, 4)
            .mixin(mxnBoilPivot)
            .show(sliderContainerObj);
    }

    obj.step(() => {
        if (!isControllable || !isHoldingAtLeastMinimum) {
            return;
        }
        if (Input.justWentDown("SelectUp") || Input.justWentDown("SelectDown")) {
            isSliderSelected = !isSliderSelected;
        }
    });

    yield () => Input.isUp("Confirm");
    yield () => Input.justWentDown("Confirm");

    const sliderValue = sliderObj.controls.value;
    const value = isSliderSelected && sliderValue ? sliderValue : null;

    const removeFiguresObj = container()
        .coro(function* (self) {
            yield* removeFromPlayer(item, Number(value));

            self.destroy();
        })
        .show(layers.overlay.messages);

    yield* Coro.all([
        interpvr(messageObj).translate(0, -128).over(400),
        interpv(sliderContainerObj.scale).steps(4).to(0, 0).over(400),
        interpvr(rejectButtonObj).steps(5).translate(0, 200).over(700),
    ]);

    obj.destroy();

    yield () => removeFiguresObj.destroyed;

    return value;
}

function* removeFromPlayer(item: RpgInventory.RemovableItem, count: Integer) {
    if (count <= 0) {
        return;
    }

    const colors = DramaLib.Speaker.getColors();

    const initialCount = Rpg.inventory.count(item);
    Rpg.inventory.remove(item, count);
    const endingCount = Rpg.inventory.count(item);

    const length = initialCount - endingCount;

    const ownedObj = objDramaOwnedCount({
        bgTint: colors.primary,
        fgTint: colors.textPrimary,
        count: initialCount,
        visibleWhenZero: true,
    })
        .pivotedUnit(0.5, 0.5)
        .at(playerObj)
        .add(0, 10)
        .show();

    yield sleep(750);

    let removedFigureObj: DisplayObject | null = null;

    for (let i = 0; i < length; i++) {
        ownedObj.controls.count = initialCount - i - 1;
        removedFigureObj = objRemovedFigure(item).at(playerObj).add(Rng.float(-8, 8), Rng.float(-32, -40)).show();
        yield sleepf(Math.max(1, 10 - i * 0.1));
    }

    yield () => !removedFigureObj || removedFigureObj.destroyed;
    ownedObj.destroy();
}

function objRemovedFigure(item: RpgInventory.RemovableItem) {
    const speed = vnew(Rng.float(-1, 1), Rng.float(-2.5, -3.5));
    const gravity = Rng.float(0.1, 0.15);

    let angle = 0;

    return DataItem.getFigureObj(item)
        .pivotedUnit(0.5, 0.5)
        .scaled(0, 0)
        .coro(function* (self) {
            yield* Coro.all([
                interpv(self.scale).steps(3).to(1, 1).over(100),
                interpvr(self).factor(factor.sine).translate(0, -6).over(100),
            ]);

            const motionObj = container()
                .step(() => {
                    self.add(speed);
                    speed.y += gravity;

                    angle += speed.x * 4 + Math.sign(speed.x) * 2;
                    self.angle = Math.round(angle / 90) * 90;
                })
                .show(self);

            yield () => speed.y >= 0;

            const speakerObj = DramaLib.Speaker.current;

            if (speakerObj) {
                motionObj.destroy();

                yield sleepf(10);

                yield* Coro.race([
                    () => speakerObj.destroyed,
                    Coro.chain([sleepf(10), () => speakerObj.collides(self)]),
                    interpvr(self).factor(factor.sine).to(speakerObj.getWorldCenter()).over(300),
                ]);
            }
            else {
                yield sleepf(90);
            }

            objFxBurst32().at(self).show();
            self.destroy();
        });
}

function objHeader(text: string, tint: RgbInt) {
    const firstLetterObj = objText.Large(text.substring(0, 1), { tint }).anchored(0, 1).at(0, 2);

    return container(
        firstLetterObj,
        objText.MediumBoldIrregular(text.substring(1), { tint })
            .mixin(mxnBoilSeed)
            .at(firstLetterObj.width + 1, 0)
            .anchored(0, 1),
    );
}

interface ObjSliderArgs {
    max: Integer;
    value: Integer;
    colors: DramaLib.Speaker.Colors;
}

function objSlider({ max, value, colors }: ObjSliderArgs) {
    const width = 224;
    const fgGfx = new Graphics().beginFill(0xffffff).drawRect(0, 0, 1, 12).at(14, 26);

    const controls = {
        isSelected: true,
        value,
    };

    const valueTextObj = objText.MediumBoldIrregular(String(value), { tint: colors.textSecondary })
        .scaled(2, 2)
        .anchored(0.5, 0.5)
        .step(self => self.text = String(controls.value));

    return container(
        Sprite.from(Tx.Ui.Dialog.AskRemoveCountSliderBox).tinted(colors.secondary).anchored(0.5, 0.5).mixin(
            mxnBoilMirrorRotate,
        ).at(148, 31),
        new Graphics().lineStyle({
            alignment: 1,
            alpha: 1,
            color: 0x000000,
            width: 4,
            cap: LINE_CAP.ROUND,
            join: LINE_JOIN.ROUND,
        })
            .beginFill(0x000000)
            .drawRect(0, 0, width, 12).at(fgGfx).angled(0.3),
        fgGfx,
        container(valueTextObj)
            .at(270, 37)
            .coro(function* (self) {
                while (true) {
                    yield onMutate(controls);
                    valueTextObj.seed += 1;
                    for (let i = 0; i < 2; i++) {
                        self.pivot.x = 1;
                        yield sleepf(2);
                        self.pivot.x = -1;
                        yield sleepf(2);
                    }

                    self.pivot.x = 0;
                }
            }),
    )
        .merge({ controls })
        .step(() => {
            let target = width;

            if (controls.value <= 0) {
                target = 0;
            }
            else if (controls.value < max) {
                target = Math.max(1, Math.round((controls.value / max) * (width - 1)));
            }

            fgGfx.scale.x = approachLinear(fgGfx.scale.x + (target - fgGfx.scale.x) * 0.3, target, 1);
        });
}

export const DramaInventory = {
    askRemoveCount,
    remove: removeFromPlayer,
};
