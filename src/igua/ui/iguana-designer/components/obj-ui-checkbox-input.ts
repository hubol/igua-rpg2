import { Sprite } from "pixi.js";
import { Tx } from "../../../../assets/textures";
import { UiColor } from "../../ui-color";
import { objUiDesignerInputBase } from "./obj-ui-designer-input-base";

const [txCheckbox, txCheckboxFill] = Tx.Ui.Checkbox.split({ count: 2 });

export function objUiCheckboxInput(text: string, binding: { value: boolean }) {
    const b = objUiDesignerInputBase(text, binding, () => {
        binding.value = !binding.value;
    });
    const box = Sprite.from(txCheckbox).tinted(UiColor.Shadow);
    const fill = Sprite.from(txCheckboxFill).tinted(UiColor.Text).step(() => fill.visible = binding.value);
    b.addChild(box, fill);

    return b;
}
