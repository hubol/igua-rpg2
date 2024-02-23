import { Graphics } from "pixi.js";
import { AdjustColor } from "../../../../lib/pixi/adjust-color";
import { objUiButton } from "../../framework/obj-ui-button";
import { UiPageElement, objUiPage } from "../../framework/obj-ui-page";
import { objUiSliderInput } from "./obj-ui-slider-input";
import { Rng } from "../../../../lib/math/rng";
import { UiIguanaDesignerContext } from "../obj-ui-iguana-designer-root";

function readHsv(binding: { value: number }) {
    return AdjustColor.pixi(binding.value).toHsv();
}

export function objUiColorInput(text: string, binding: { value: number }) {
    const b = objUiButton(text, () => UiIguanaDesignerContext.value.router.push(objUiColorAdjustPage(binding)));
    new Graphics()
        .beginFill(0xffffff)
        .drawPolygon([4, 4, 4, 26, 26, 4])
        .step(gfx => gfx.tint = binding.value)
        .show(b);
    return b;
}

function objUiColorAdjustPage(binding: { value: number }) {
    const el: UiPageElement[] = [];
    let h: number, s: number, v: number;

    function writeColor() {
        binding.value = AdjustColor.hsv(h, s, v).toPixi();
    }

    const hBinding = {
        get value() {
            return h;
        },
        set value(x) {
            h = x;
            writeColor();
        }
    }

    const sBinding = {
        get value() {
            return s;
        },
        set value(x) {
            s = x;
            writeColor();
        }
    }

    const vBinding = {
        get value() {
            return v;
        },
        set value(x) {
            v = x;
            writeColor();
        }
    }

    function readColor() {
        const hsv = readHsv(binding);
        h = hsv.h;
        s = hsv.s;
        v = hsv.v;
    }

    readColor();

    function gotoCopyFrom() {
        // const elements = makeCopyFromPageElements(binding.value, x => binding.value = x);
        // looksContext.into('Copy', elements);
    }

    el.push(objUiSliderInput('Hue', hBinding, { min: 0, max: 359 }, [5, 5, 7]));
    el.push(objUiSliderInput('Saturation', sBinding, { min: 0, max: 100 }, [2, 2, 2]));
    el.push(objUiSliderInput('Value', vBinding, { min: 0, max: 100 }, [2, 2, 2]));

    const random = objUiButton('Random', () => {
        binding.value = Rng.color();
        readColor();
    })
        .center()
        .jiggle();

    el.push(random);
    el.push(objUiButton('Copy From...', gotoCopyFrom).center());
    el.push(objUiButton('OK', () => UiIguanaDesignerContext.value.router.pop()));

    const dy = 33;
    el[1].y = dy;
    el[2].y = dy * 2;
    el[3].y = dy * 3 + 15;
    el[4].y = dy * 4 + 15;
    el[5].y = dy * 5 + 30;

    const page = objUiPage(el, { selectionIndex: 0 });

    new Graphics()
        .beginFill(0xffffff)
        .drawRect(el[0].x + 96 + 3, el[0].y, 16, dy * 3 - 3)
        .step(gfx => gfx.tint = binding.value)
        .show(page);

    return page;
}

function copyButton(color: number, onSelect: () => unknown, onPress: () => unknown, w: number, h: number) {
    // const p = 4;

    // const g = merge(new Graphics(), { selected: false }).withStep(() => {
    //     g
    //         .clear()
    //         .beginFill(g.selected ? 0x00FF00 : 0x005870)
    //         .drawRect(0, 0, w, h)
    //         .beginFill(color)
    //         .drawPolygon([p, p, p, h - p, w - p, p]);

    //     if (g.selected) {
    //         onSelect();
    //         if (Input.justWentDown('Confirm'))
    //             onPress();
    //     }
    // });

    // return g;
}

// function makeCopyFromPageElements(currentColor: number, set: (color: number) => unknown): PageElement[] {
//     const colors = findColorValues(looksContext.inputModel);
//     const uniqueColors = Array.from(new Set(colors));

//     const elements: PageElement[] = [];

//     const w = 30;
//     const h = 30;
//     const m = 3;

//     let ax = 0;
//     let ay = 0;

//     for (let i = 0; i < uniqueColors.length; i++) {
//         if (i > 0) {
//             if (ax > 60) {
//                 ax = 0;
//                 ay += h + m;
//             }
//             else
//                 ax += w + m;
//         }

//         const c = uniqueColors[i];
//         const elem = copyButton(c, () => set(c), looksContext.back, w, h).at(ax, ay);
//         elem.selected = c === currentColor;
//         elements.push(elem);
//     }

//     return elements;
// }
