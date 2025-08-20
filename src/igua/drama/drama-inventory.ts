import { Graphics, LINE_CAP, LINE_JOIN, Sprite } from "pixi.js";
import { objText } from "../../assets/fonts";
import { Tx } from "../../assets/textures";
import { Logger } from "../../lib/game-engine/logger";
import { Coro } from "../../lib/game-engine/routines/coro";
import { factor, interpv, interpvr } from "../../lib/game-engine/routines/interp";
import { onMutate } from "../../lib/game-engine/routines/on-mutate";
import { sleepf } from "../../lib/game-engine/routines/sleep";
import { approachLinear } from "../../lib/math/number";
import { Integer, RgbInt } from "../../lib/math/number-alias-types";
import { container } from "../../lib/pixi/container";
import { renderer } from "../current-pixi-renderer";
import { DataItem } from "../data/data-item";
import { Input, layers, scene } from "../globals";
import { mxnActionRepeater } from "../mixins/mxn-action-repeater";
import { mxnBoilMirrorRotate } from "../mixins/mxn-boil-mirror-rotate";
import { mxnBoilPivot } from "../mixins/mxn-boil-pivot";
import { mxnBoilSeed } from "../mixins/mxn-boil-seed";
import { Rpg } from "../rpg/rpg";
import { RpgInventory } from "../rpg/rpg-inventory";
import { DramaLib } from "./drama-lib";

interface AskUseCountOptions {
    min?: Integer;
    max?: Integer;
    multipleOf?: Integer;
    rejectMessage?: string;
}

function* askRemoveCount(
    message: string,
    item: RpgInventory.Item,
    { min = 1, max: rawMax, multipleOf = 1, rejectMessage = "Never mind" }: AskUseCountOptions = {},
) {
    const colors = DramaLib.Speaker.getColors();

    if (min % multipleOf !== 0) {
        Logger.logContractViolationError(
            "DramaInventory",
            new Error("askRemoveCount min must be a multiple of multipleOf"),
            { min, multipleOf },
        );
    }

    const max = Math.max(Math.floor(Rpg.inventory.count(item) / multipleOf) * multipleOf, rawMax ?? 0);

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

    let isControllable = true;
    let isSliderSelected = true;

    const sliderObj = objSlider({ max, value: min, colors });

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

    obj.step(() => {
        if (!isControllable) {
            return;
        }
        if (Input.justWentDown("SelectUp") || Input.justWentDown("SelectDown")) {
            isSliderSelected = !isSliderSelected;
        }
    });

    yield () => Input.isUp("Confirm");
    yield () => Input.justWentDown("Confirm");

    const value = isSliderSelected ? sliderObj.controls.value : null;
    isControllable = false;

    yield* Coro.all([
        interpvr(messageObj).translate(0, -128).over(400),
        interpv(sliderContainerObj.scale).steps(4).to(0, 0).over(400),
        interpvr(rejectButtonObj).steps(5).translate(0, 200).over(700),
    ]);

    obj.destroy();

    return value;
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
};
