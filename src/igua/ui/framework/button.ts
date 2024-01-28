import { Graphics } from "pixi.js";
import { Key } from "../../../lib/browser/key";
import { objText } from "../../../assets/fonts";
import { container } from "../../../lib/pixi/container";

export function objUiButton(text: string, onPress: () => unknown, width = 96, height = 30) {
    let jigglesOnPress = false;
    let escapes = false;

    function jiggle() {
        jigglesOnPress = true;
        return c;
    }

    function escape() {
        escapes = true;
        return c;
    }

    function center() {
        font.anchor.x = 0.5;
        font.x = width / 2;
        return c;
    }

    let factor = 0;

    const bg = new Graphics().beginFill(0x005870).drawRect(0, 0, width, height);
    const selection = new Graphics().lineStyle(2, 0x00FF00, 1, 0).drawRect(0, 0, width, height);
    const font = objText.Large(text).at(32, Math.floor(height / 2) - 4);

    selection.visible = false;

    const c = container(bg, selection, font)
        .merge({
            get selected() {
                return selection.visible;
            },
            set selected(value) {
                selection.visible = value;
            }
        })
        .merge({ jiggle, onPress, escape, center })
        .step(() => {
            if (factor > 0) {
                c.pivot.x = (factor % 2 === 0 ? 1 : -1) * Math.ceil(factor / 6);
                factor--;
            }
            else
                c.pivot.x = 0;
    
            // TODO use input
            if (c.selected && Key.justWentDown('Space')) {
                c.onPress();
                if (jigglesOnPress)
                    factor = 8;
            }
            else if (escapes && Key.justWentDown('Escape')) {
                c.onPress();
            }
        });

    return c;
}