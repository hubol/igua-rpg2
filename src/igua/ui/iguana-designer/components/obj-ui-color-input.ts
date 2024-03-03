import { Graphics } from "pixi.js";
import { AdjustColor } from "../../../../lib/pixi/adjust-color";
import { objUiButton } from "../../framework/obj-ui-button";
import { UiPageElement, objUiPage } from "../../framework/obj-ui-page";
import { objUiSliderInput } from "./obj-ui-slider-input";
import { Rng } from "../../../../lib/math/rng";
import { UiIguanaDesignerContext } from "../obj-ui-iguana-designer-root";
import { UiColor } from "../../ui-color";
import { Input } from "../../../globals";
import { ConnectedInput } from "../../../iguana/connected-input";
import { Empty } from "../../../../lib/types/empty";
import { UiVerticalLayout } from "../../framework/ui-vertical-layout";
import { objUiIguanaDesignerBackButton } from "./obj-ui-iguana-designer-back-button";
import { objUiDesignerInputBase } from "./obj-ui-designer-input-base";

function readHsv(binding: ConnectedInput.Binding<number>) {
    return AdjustColor.pixi(binding.value).toHsv();
}

export function objUiColorInput(text: string, binding: ConnectedInput.Binding<number>) {
    const b = objUiDesignerInputBase(text, binding, () => UiIguanaDesignerContext.value.router.push(objUiColorAdjustPage(text, binding)));
    new Graphics()
        .beginFill(0xffffff)
        .drawPolygon(4, 4, 4, 27, 27, 4)
        .step(gfx => gfx.tint = binding.value)
        .show(b);
    return b;
}

function objUiColorAdjustPage(title: string, binding: ConnectedInput.Binding<number>) {
    const els = Empty<UiVerticalLayout.Element>();
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
        const binding2 = {
            get value() {
                return binding.value;
            },
            set value(value) {
                binding.value = value;
                readColor();
            }
        }
        UiIguanaDesignerContext.value.router.push(objUiColorCopyFromPage(binding2));
    }

    els.push(objUiSliderInput('Hue', hBinding, { min: 0, max: 359 }, [5, 5, 7]));
    els.push(objUiSliderInput('Saturation', sBinding, { min: 0, max: 100 }, [2, 2, 2]));
    els.push(objUiSliderInput('Value', vBinding, { min: 0, max: 100 }, [2, 2, 2]));

    const random = objUiButton('Random', () => {
        binding.value = Rng.color();
        readColor();
    })
        .center()
        .jiggle();

    els.push(UiVerticalLayout.Separator);
    els.push(random);
    els.push(objUiButton('Copy From...', gotoCopyFrom).center());
    els.push(UiVerticalLayout.Separator);
    els.push(objUiIguanaDesignerBackButton('OK'));

    const applied = UiVerticalLayout.apply(els);

    const page = objUiPage(applied, { title, selectionIndex: 0 });

    new Graphics()
        .beginFill(0xffffff)
        .drawRect(applied[0].x + 96 + 3, applied[0].y, 16, applied[2].y + applied[2].height)
        .step(gfx => gfx.tint = binding.value)
        .show(page);

    return page;
}

function objUiCopyColorButton(color: number, onSelect: () => unknown, onPress: () => unknown, w: number, h: number) {
    const p = 4;
    const path = [p, p, p, h - p, w - p, p];

    const g = new Graphics()
        .merge({ selected: false })
        .step(() => {
            g
                .clear()
                .beginFill(g.selected ? UiColor.Selection : UiColor.Background)
                .drawRect(0, 0, w, h)
                .beginFill(color)
                .drawPolygon(path);

            if (g.selected) {
                onSelect();
                if (Input.justWentDown('Confirm'))
                    onPress();
            }
    });

    return g;
}

function objUiColorCopyFromPage(binding: ConnectedInput.Binding<number>) {
    const initialColor = binding.value;
    const uniqueColors = ConnectedInput.findUniqueColorValues(UiIguanaDesignerContext.value.connectedInput);

    const els: UiPageElement[] = [];

    const w = 30;
    const h = 30;
    const m = 3;

    let x = 0;
    let y = 0;

    let selectionIndex = 0;

    for (let i = 0; i < uniqueColors.length; i++) {
        if (i > 0) {
            if (x > 60) {
                x = 0;
                y += h + m;
            }
            else
                x += w + m;
        }

        const c = uniqueColors[i];
        const elem = objUiCopyColorButton(c, () => binding.value = c, () => UiIguanaDesignerContext.value.router.pop(), w, h).at(x, y);
        if (c === initialColor)
            selectionIndex = i;
        els.push(elem);
    }

    return objUiPage(els, { selectionIndex, title: 'Copy' });
}
