import { Graphics, Sprite, TilingSprite } from "pixi.js";
import { Lvl } from "../../assets/generated/levels/generated-level-data";
import { NoAtlasTx } from "../../assets/no-atlas-textures";
import { Tx } from "../../assets/textures";
import { factor, interp, interpvr } from "../../lib/game-engine/routines/interp";
import { sleep } from "../../lib/game-engine/routines/sleep";
import { Integer, RgbInt } from "../../lib/math/number-alias-types";
import { Rng } from "../../lib/math/rng";
import { AdjustColor } from "../../lib/pixi/adjust-color";
import { container } from "../../lib/pixi/container";
import { ZIndex } from "../core/scene/z-index";
import { DramaGifts } from "../drama/drama-gifts";
import { DramaHallOfDoors } from "../drama/drama-hall-of-doors";
import { ask, show } from "../drama/show";
import { mxnCutscene } from "../mixins/mxn-cutscene";
import { playerObj } from "../objects/obj-player";
import { objUiAcceptableRange } from "../objects/overlay/obj-ui-acceptable-range";
import { StepOrder } from "../objects/step-order";
import { Rpg } from "../rpg/rpg";

export function scnIndianaHallPainting() {
    const lvl = Lvl.IndianaHallPainting();

    const paintingObj = objPainting()
        .at(lvl.PaintingRegion)
        .zIndexed(ZIndex.BackgroundEntities)
        .show();

    let dramaPainterCutscene = function* () {
        yield sleep(0);
    };

    lvl.PainterNpc
        .mixin(mxnCutscene, function* () {
            yield* dramaPainterCutscene();
        })
        .coro(function* () {
            const pickedColorRef = {
                pickedColor: pickColor(null),
            };

            const pickedColorObj = objPickedColor(pickedColorRef)
                .at(300, 70)
                .step(self => self.x = playerObj.x, StepOrder.AfterPhysics)
                .zIndexed(ZIndex.Entities);

            const dramaCheckPaint = function* () {
                if (pickedColorObj.objPickedColor.isCorrect) {
                    yield* show("Hey! You did it!");
                    playerObj.status.conditions.wetness.value = 0;
                    paintingObj.objPainting.addPaintLayer(pickedColorRef.pickedColor.color);
                    yield sleep(1500);
                    if (paintingObj.objPainting.isComplete) {
                        yield* dramaComplete();
                    }
                    else {
                        yield* show("OK! Time for the next color.");
                        pickedColorRef.pickedColor = pickColor(pickedColorRef.pickedColor);
                    }
                    return;
                }

                yield* show("It looks like you are not done mixing paint.");
                const result = yield* ask("Do you need something?", "Never mind.", "Get me out of here!");
                if (result === 0) {
                    yield* show("OK! Get mixin'!");
                }
                else {
                    // TODO return to hall
                }
            };

            const dramaComplete = function* () {
                yield* show("Well, it's all done.");
                const result = yield* ask("What do you think?", "It's great!", "Not so good...");
                if (result === 0) {
                    yield* show("Cool.");
                }
                else {
                    yield* show("I appreciate your honesty.");
                    const gift = Rpg.gift("Indiana.Hall.Painting.Honesty");
                    if (gift.isGiveable()) {
                        yield* DramaGifts.give(gift);
                    }
                }
                yield* DramaHallOfDoors.complete(Rpg.microcosms["Indiana.HallOfDoors"], 2);
            };

            dramaPainterCutscene = function* () {
                yield* show(
                    "I'm an artist.",
                    "But it's a huge distraction for me to mix my own paint.",
                    "I need you to do it for me!",
                );

                pickedColorObj.pivoted(0, 150).show();
                yield interpvr(pickedColorObj.pivot).factor(factor.sine).to(0, 0).over(3000);

                yield* show("Please mix that color for me.");

                dramaPainterCutscene = dramaCheckPaint;
            };
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

    const rangeObjs = [hueRangeObj, saturationRangeObj, valueRangeObj];

    const api = {
        get isCorrect() {
            return rangeObjs.every(obj => obj.objUiAcceptableRange.isValueInRange);
        },
    };

    return container(
        Sprite.from(Tx.Ui.LiquidDrip)
            .step(self => self.tint = ref.pickedColor.color)
            .anchored(0.5, 1),
        container(
            ...rangeObjs.map((obj, i) => obj.at(0, i * 18)),
        )
            .at(-50, 6),
    )
        .merge({ objPickedColor: api });
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
        0x7c470a,
        0xff9100,
        0xcab600,
        0x6d77ff,
        0x230b79,
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

const txsPaintingLayer = Tx.Esoteric.PaintingLayers.split({ count: 9 });

function objPainting() {
    const paintTints = new Array<RgbInt>();

    const api = {
        get isComplete() {
            return paintTints.length >= txsPaintingLayer.length;
        },
        addPaintLayer(color: RgbInt) {
            paintTints.push(color);
        },
    };

    const padding = 4;

    const canvas = {
        width: txsPaintingLayer[0].width + padding * 2,
        height: txsPaintingLayer[0].height + padding * 2,
    };

    const paintingLayersObj = container();

    return container(
        container(
            new Graphics()
                .beginFill(0xffffff)
                .drawRect(0, 0, canvas.width, canvas.height),
            new TilingSprite(NoAtlasTx.Effects.Noise256, canvas.width, canvas.height)
                .step(self => self.alpha = 5 / 256),
        )
            .pivoted(padding, padding),
        paintingLayersObj,
    )
        .merge({ objPainting: api })
        .coro(function* () {
            while (true) {
                yield () => paintingLayersObj.children.length < paintTints.length;
                const paintIndex = paintingLayersObj.children.length;
                const layerObj = Sprite.from(txsPaintingLayer[paintIndex])
                    .tinted(paintTints[paintIndex])
                    .show(paintingLayersObj);
                layerObj.alpha = 0;
                yield interp(layerObj, "alpha").steps(3).to(1).over(333);
            }
        });
}
