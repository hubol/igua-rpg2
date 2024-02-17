import { Sprite } from "pixi.js";
import { Tx } from "../../../../assets/textures";
import { objUiButton } from "../../framework/button";

const [ txUnchecked, txChecked ] = Tx.Ui.Checkbox.split({ count: 2 });

export function objUiCheckboxInput(text: string, binding: { value: boolean }) {
    const b = objUiButton(text, () => { binding.value = !binding.value });
    const s = Sprite.from(txUnchecked).step(() => s.texture = binding.value ? txChecked : txUnchecked);
    b.addChild(s);

    return b;
}