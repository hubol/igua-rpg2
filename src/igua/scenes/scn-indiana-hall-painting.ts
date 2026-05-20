import { Sprite } from "pixi.js";
import { Lvl } from "../../assets/generated/levels/generated-level-data";
import { Tx } from "../../assets/textures";
import { Integer, RgbInt } from "../../lib/math/number-alias-types";
import { PseudoRng, Rng } from "../../lib/math/rng";
import { AdjustColor } from "../../lib/pixi/adjust-color";
import { container } from "../../lib/pixi/container";
import { ZIndex } from "../core/scene/z-index";
import { scene } from "../globals";
import { playerObj } from "../objects/obj-player";
import { objUiAcceptableRange } from "../objects/overlay/obj-ui-acceptable-range";
import { StepOrder } from "../objects/step-order";
import { Rpg } from "../rpg/rpg";

export function scnIndianaHallPainting() {
    Lvl.IndianaHallPainting();

    scene.stage
        .coro(function* () {
            const pickedColorRef = {
                pickedColor: pickColor(null),
            };

            const pickedColorObj = objPickedColor(pickedColorRef)
                .at(300, 70)
                .step(self => self.x = playerObj.x, StepOrder.AfterPhysics)
                .zIndexed(ZIndex.Entities)
                .show();
            // yield () => pickedColorObj.obj
        });
}

function objPickedColor(ref: { pickedColor: PickedColor }) {
    const hueRangeObj = objUiAcceptableRange({
        width: 100,
        height: 10,
        get range() {
            return ref.pickedColor.hue;
        },
        max: 360,
        get value() {
            const hsv = getPlayerWetnessHsv();
            if (hsv === null) {
                return null;
            }
            return Math.round(hsv.h);
        },
    });
    const saturationRangeObj = objUiAcceptableRange({
        width: 100,
        height: 10,
        get range() {
            return ref.pickedColor.saturation;
        },
        max: 100,
        get value() {
            const hsv = getPlayerWetnessHsv();
            if (hsv === null) {
                return null;
            }
            return Math.round(hsv.s);
        },
    });
    const valueRangeObj = objUiAcceptableRange({
        width: 100,
        height: 10,
        get range() {
            return ref.pickedColor.value;
        },
        max: 100,
        get value() {
            const hsv = getPlayerWetnessHsv();
            if (hsv === null) {
                return null;
            }
            return Math.round(hsv.v);
        },
    });

    return container(
        Sprite.from(Tx.Ui.LiquidDrip)
            .step(self => self.tint = ref.pickedColor.color)
            .anchored(0.5, 1),
        container(
            hueRangeObj,
            saturationRangeObj.at(0, 18),
            valueRangeObj.at(0, 36),
        )
            .at(-50, 4),
    );
}

function getPlayerWetnessHsv() {
    if (Rpg.character.status.conditions.wetness.value <= 0) {
        return null;
    }

    return AdjustColor.pixi(Rpg.character.status.conditions.wetness.tint).toHsv();
}

const consts = {
    pickableColors: [
        0x808080,
        0xb0b0b0,
        0x404040,
        0xff9100,
        0x1fdd0d,
        0x6d77ff,
        0xa20ddd,
        0xfa5db9,
    ],
};

interface Range {
    min: Integer;
    max: Integer;
}

interface PickedColor {
    color: RgbInt;
    hue: Range;
    saturation: Range;
    value: Range;
    remainingColors: RgbInt[];
}

function pickColor(previousPick: PickedColor | null): PickedColor {
    const colors = previousPick?.remainingColors ?? consts.pickableColors;
    const color = Rng.item(colors);
    const remainingColors = colors.filter(item => item !== color);

    const { h, s, v } = AdjustColor.pixi(color).toHsv();

    const saturation: Range = {
        min: Math.round(s - 10),
        max: Math.round(s + 10),
    };

    const hue: Range = {
        min: Math.round(h - 10),
        max: Math.round(h + 10),
    };

    const value: Range = {
        min: Math.round(v - 10),
        max: Math.round(v + 10),
    };

    if (s < 10) {
        hue.min = 0;
        hue.max = 360;
    }

    return {
        color,
        hue,
        remainingColors,
        saturation,
        value,
    };
}
