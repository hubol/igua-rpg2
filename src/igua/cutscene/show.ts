import { Graphics, Rectangle } from "pixi.js";
import { objText } from "../../assets/fonts";
import { container } from "../../lib/pixi/container";
import { approachLinear } from "../../lib/math/number";
import { layers } from "../globals";
import { wait } from "../../lib/game-engine/promise/wait";
import { Key } from "../../lib/browser/key";

const borderColor = 0x00ff00;
const backgroundColor = 0x005870;
const textColor = 0xffffff;

const width = 220;
const height = 67;
const border = 2;
const padding = 3;

function objMessageBox(text: string) {
    const gfx = new Graphics()
        .lineStyle({ color: borderColor, alignment: 0, width: border })
        .beginFill(backgroundColor)
        .drawRect(0, 0, width, height);

    const maxWidth = width - padding * 2 - border * 2;
    const text1 = objText.Large(text, { tint: textColor, maxWidth }).at(border + padding, border + padding);
    const text2 = objText.Large("", { tint: textColor, maxWidth }).at(text1);

    const mask = new Graphics().beginFill(0xffffff).drawRect(0, 0, width, height);
    
    const mask1 = new Graphics().beginFill(0xffffff).drawRect(0, 0, width, height);
    const mask2 = new Graphics().beginFill(0xffffff).drawRect(0, -height, width, height);
    const textMasks = container(mask1, mask2);

    let dismissing = false;

    mask.scale.y = 0;

    const c = container(mask, textMasks, gfx, text1, text2)
        .merge({
            dismissAfterFrames: -1,
            set text(value: string) {
                c.dismissAfterFrames = -1;
                if (textMasks.y > 0)
                    text1.text = text2.text;
                text2.text = value;
                textMasks.y = 0;
            }
        })
        .step(() => {
            if (c.dismissAfterFrames > 0) {
                c.dismissAfterFrames--;
                if (c.dismissAfterFrames === 0) {
                    dismissing = true;
                    if (instance === c)
                        instance = undefined;
                }
            }

            if (text2.text) {
                textMasks.y = approachLinear(textMasks.y, height, 4);
            }

            mask.scale.y = approachLinear(mask.scale.y, dismissing ? 0 : 1, dismissing ? 0.05 : 0.1);
            if (dismissing && mask.scale.y === 0) {
                c.destroy();
            }
        });

    c.mask = mask;
    text1.mask = mask1;
    text2.mask = mask2;

    const x = Math.round((256 - width) / 2);
    return c.at(x, x).show(layers.hud);
}

let instance: ReturnType<typeof objMessageBox> | undefined;

export async function show(text: string) {
    if (!instance) {
        instance = objMessageBox(text);
    }
    else
        instance.text = text;

    await wait(() => Key.isUp("KeyP"));
    await wait(() => Key.isDown("KeyP"));

    instance!.dismissAfterFrames = 1;
}