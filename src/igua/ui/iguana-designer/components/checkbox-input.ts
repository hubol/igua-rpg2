import { Sprite } from "pixi.js";
import { Tx } from "../../../../assets/textures";
import { ConnectedInput } from "../../../iguana/connected-input";
import { objUiButton } from "../../framework/button";

const [ txUnchecked, txChecked ] = Tx.Ui.Checkbox.split({ count: 2 });

export function objUiCheckboxInput(text: string, input: ConnectedInput.Boolean) {
    const b = objUiButton(text, () => { input.value = !input.value });
    const s = Sprite.from(txUnchecked).step(() => s.texture = input.value ? txChecked : txUnchecked);
    b.addChild(s);

    return b;
}