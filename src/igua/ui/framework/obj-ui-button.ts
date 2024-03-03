import { Graphics } from "pixi.js";
import { objText } from "../../../assets/fonts";
import { container } from "../../../lib/pixi/container";
import { Input } from "../../globals";
import { UiColor } from "../ui-color";

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
        textObj.anchor.x = 0.5;
        textObj.x = width / 2;
        return c;
    }

    let factor = 0;

    const bg = new Graphics().beginFill(UiColor.Background).drawRect(0, 0, width, height);
    const selection = new Graphics().lineStyle(2, UiColor.Selection, 1, 0).drawRect(0, 0, width, height);
    const textObj = objText.Large(text, { tint: UiColor.Text }).at(32, Math.floor(height / 2) - 4);

    selection.visible = false;

    const c = container(bg, selection, textObj)
        .merge({
            get selected() {
                return selection.visible;
            },
            set selected(value) {
                selection.visible = value;
            },
            note: '',
        })
        .merge({ jiggle, onPress, escape, center, textObj })
        .step(() => {
            if (factor > 0) {
                c.pivot.x = (factor % 2 === 0 ? 1 : -1) * Math.ceil(factor / 6);
                factor--;
            }
            else
                c.pivot.x = 0;
    
            if (c.selected && Input.justWentDown('Confirm')) {
                c.onPress();
                if (jigglesOnPress)
                    factor = 8;
            }
            else if (escapes && Input.justWentDown('MenuEscape')) {
                c.onPress();
            }
        });

    return c;
}