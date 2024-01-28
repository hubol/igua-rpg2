import { Graphics } from "pixi.js";
import { Key } from "../../../lib/browser/key";
import { objText } from "../../../assets/fonts";
import { UiPageElement } from "./page";

export function objUiButton(text: string, onPress: () => unknown, width = 96, height = 30) {
    let jigglesOnPress = false;
    let escapes = false;

    function jiggle() {
        jigglesOnPress = true;
        return el;
    }

    function escape() {
        escapes = true;
        return el;
    }

    function center() {
        font.anchor.x = 0.5;
        font.x = width / 2;
        return el;
    }

    let factor = 0;

    const g = new Graphics()
    .step(() => {
        g.clear().beginFill(0x005870);
        if (el.selected)
            g.lineStyle(2, 0x00FF00, 1, 0);
        g.drawRect(0, 0, width, height);

        if (factor > 0) {
            g.pivot.x = (factor % 2 === 0 ? 1 : -1) * Math.ceil(factor / 6);
            factor--;
        }
        else
            g.pivot.x = 0;

        // TODO use input
        if (el.selected && Key.justWentDown('Space')) {
            el.onPress();
            if (jigglesOnPress)
                factor = 8;
        }
        else if (escapes && Key.justWentDown('Escape')) {
            el.onPress();
        }
    });

    const font = objText.Large(text).at(32, Math.floor(height / 2) - 4);

    const el = new UiPageElement(g, font).merge({ jiggle, onPress, escape, center });

    return el;
}