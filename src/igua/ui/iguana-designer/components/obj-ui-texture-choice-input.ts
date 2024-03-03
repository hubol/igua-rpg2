import { Container, Graphics, Sprite, Texture } from "pixi.js";
import { Tx } from "../../../../assets/textures";
import { TypedInput } from "../../../iguana/typed-input";
import { Input } from "../../../globals";
import { cyclic } from "../../../../lib/math/number";
import { UiColor } from "../../ui-color";
import { objUiDesignerInputBase } from "./obj-ui-designer-input-base";

const NoneChoice = Tx.Ui.NoneChoice.trimmed;

type Restrictions = Omit<TypedInput.Choice<Texture>, 'kind'>;

export function objUiTextureChoiceInput(binding: { value: number }, { allowNone, options }: Restrictions, width = 96, height = 30) {
    const buttonObj = objUiDesignerInputBase('', binding, () => {}, width, height);

    buttonObj.step(() => {
        if (buttonObj.selected) {
            if (Input.justWentDown('SelectLeft'))
                binding.value--;
            else if (Input.justWentDown('SelectRight'))
                binding.value++;

            const next = cyclic(binding.value, allowNone ? -1 : 0, options.length);
            if (next !== binding.value)
                binding.value = next;
        }
    });

    const maxWidth = Math.max(...options.map(x => x.width), allowNone ? 7 : 5 );
    const maxHeight = Math.max(...options.map(x => x.height), allowNone ? 7 : 5);

    let choiceCount = 0;
    let firstTime = true;
    function choice(texture: Texture, index: number) {
        const gw = maxWidth + 4;
        const s = Sprite.from(texture);
        s.x = gw / 2;
        s.x += choiceCount++ * (maxWidth + 2);
        s.anchor.set(Math.ceil(texture.width / 2) / texture.width, Math.ceil(texture.height / 2) / texture.height);
        const tint = index === -1 ? UiColor.Danger : UiColor.Text;
        s.step(() => {
            const selected = binding.value === index;
            s.tint = selected ? tint : UiColor.Shadow;
            if (selected) {
                const childrenIndex = allowNone ? index + 1 : index;
                const keepInsideLeft = choicesContainer.children[childrenIndex - 1] ?? s;
                const keepInsideRight = choicesContainer.children[childrenIndex + 1] ?? s;

                let iterations = firstTime ? 30 : 1;

                while (iterations-- > 0) {
                    const rightBounds = keepInsideRight.getBounds();
                    const left = keepInsideLeft.getBounds().x;
                    const right = rightBounds.x + rightBounds.width;

                    if (left < maxWidth / 2)
                        choicesContainer.x += 3;
                    else if (right > 94)
                        choicesContainer.x -= 3;
                }

                firstTime = false;
            }
        });
        return s;
    }

    const choicesContainer = new Container();
    choicesContainer.mask = new Graphics().beginFill(0xffffff).drawRect(2, 2, width - 4, height - 4);

    choicesContainer.y = 15;
    if (maxWidth < 15 && maxHeight < 15)
        choicesContainer.scale.set(2, 2);

    const choices = (allowNone ? [NoneChoice, ...options] : options)
        .map((x, i) => choice(x, allowNone ? i - 1 : i))

    choicesContainer.addChild(...choices)

    buttonObj.addChild(choicesContainer.mask, choicesContainer);

    return buttonObj;
}
