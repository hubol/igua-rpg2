import { Graphics, Sprite } from "pixi.js";
import { VectorSimple, vnew } from "../../../../lib/math/vector-type";
import { container } from "../../../../lib/pixi/container";
import { TypedInput } from "../../../iguana/typed-input";
import { createActionRepeater } from "../../framework/action-repeater";
import { Tx } from "../../../../assets/textures";
import { Input } from "../../../globals";
import { CtxUiIguanaDesigner } from "../obj-ui-iguana-designer-root";
import { UiColor } from "../../ui-color";
import { objUiDesignerInputBase } from "./obj-ui-designer-input-base";
import { Sfx } from "../../../../assets/sounds";

type Restrictions = Omit<TypedInput.Vector, "kind">;

export function objUiPlacementInput(
    text: string,
    binding: { value: VectorSimple },
    restrictions: Restrictions,
    width = 96,
    height = 30,
) {
    const c = container().merge({ selected: false });
    const b = objUiDesignerInputBase(text, binding, () => {}, width, height);

    let inputSelected = false;

    const g = new Graphics();
    const left = createActionRepeater(g, "SelectLeft");
    const right = createActionRepeater(g, "SelectRight");
    const up = createActionRepeater(g, "SelectUp");
    const down = createActionRepeater(g, "SelectDown");

    const reticle = Sprite.from(Tx.Ui.PlacementReticle).tinted(UiColor.Text);
    reticle.anchor.set(2 / 6, 2 / 6);

    const inputSize = 22;

    // TODO pick better defaults? sometimes 24 is too much.
    // maybe the restrictions should not allow them to be optional?
    const minX = restrictions.minX ?? -24;
    const minY = restrictions.minY ?? -24;
    const maxX = restrictions.maxX ?? 24;
    const maxY = restrictions.maxY ?? 24;

    function getReticleVectorComponent(min: number, max: number, v: number) {
        const len = max - min;
        if (len >= inputSize) {
            return v + inputSize / 2;
        }
        return ((v - min) / len) * inputSize;
    }

    g.step(() => {
        if (inputSelected) {
            if (Input.isDown("SelectLeft") && Input.isDown("SelectRight")) {
                left.reset();
                right.reset();
            }
            if (Input.isDown("SelectUp") && Input.isDown("SelectDown")) {
                up.reset();
                down.reset();
            }

            let dx = 0, dy = 0;
            if (left.justWentDown) {
                dx -= 1;
            }
            if (right.justWentDown) {
                dx += 1;
            }
            if (up.justWentDown) {
                dy -= 1;
            }
            if (down.justWentDown) {
                dy += 1;
            }
            if (dx !== 0 || dy !== 0) {
                const v = vnew(binding.value);
                v.x = Math.max(minX, Math.min(maxX, v.x + dx));
                v.y = Math.max(minY, Math.min(maxY, v.y + dy));
                binding.value = v;
            }
        }

        g.clear()
            .beginFill(UiColor.Shadow);

        if (inputSelected) {
            g.lineStyle(2, UiColor.Selection, 1, 1);
        }

        g.drawRect(0, 0, inputSize, inputSize);
        reticle.x = getReticleVectorComponent(minX, maxX, binding.value.x);
        reticle.y = getReticleVectorComponent(minY, maxY, binding.value.y);
    }).at((30 - inputSize) / 2, (30 - inputSize) / 2);
    g.addChild(reticle);

    c.step(() => {
        // TODO escape action support?

        if (c.selected && Input.justWentDown("Confirm")) {
            inputSelected = !inputSelected;
            (inputSelected ? Sfx.Ui.NavigateInto : Sfx.Ui.NavigateBack).play();
            if (CtxUiIguanaDesigner.value.page) {
                CtxUiIguanaDesigner.value.page.navigation = !inputSelected;
            }
        }

        b.selected = c.selected && !inputSelected;
    });

    c.addChild(b, g);

    return c;
}
