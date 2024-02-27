import { Texture } from "pixi.js";
import { Empty } from "../../../../lib/types/empty";
import { ConnectedInput } from "../../../iguana/connected-input";
import { TypedInput } from "../../../iguana/typed-input";
import { UiPageElement, objUiPage } from "../../framework/obj-ui-page";
import { UiIguanaDesignerContext } from "../obj-ui-iguana-designer-root";
import { objUiCheckboxInput } from "./obj-ui-checkbox-input";
import { objUiDesignerButton } from "./obj-ui-designer-button";
import { objUiTextureChoiceInput } from "./obj-ui-texture-choice-input";
import { objUiPlacementInput } from "./obj-ui-placement-input";
import { objUiSliderInput } from "./obj-ui-slider-input";
import { objUiColorInput } from "./obj-ui-color-input";

export function objUiConnectedInputPage(title: string, root: ConnectedInput.Type<unknown>) {
    const els = Empty<UiPageElement>();

    let y = 0;

    for (const key in root) {
        const input = root[key];
        const inputObj = createInputObj(key, input).at(0, y);
        els.push(inputObj);
        y += 33;
    }

    y += 33;
    els.push(objUiDesignerButton('Back', () => UiIguanaDesignerContext.value.router.pop()).at(0, y));

    return objUiPage(els, { title, selectionIndex: 0 });
}

function createInputObj(key: string, input: TypedInput.Any & { value: any }) {
    switch (input.kind) {
        case "boolean":
            return objUiCheckboxInput(key, input);
        case "choice":
            return objUiTextureChoiceInput(input, input as TypedInput.Choice<Texture>);
        case "vector":
            return objUiPlacementInput(key, input, input);
        case "integer":
            return objUiSliderInput(key, input, input);
        case "color":
            return objUiColorInput(key, input);
    }
    return objUiConnectedInputNavigationButton(key, input);
}

export function objUiConnectedInputNavigationButton(title: string, input: ConnectedInput.Type<unknown>) {
    return objUiDesignerButton(title, () => {
        UiIguanaDesignerContext.value.router.push(objUiConnectedInputPage(title, input));
    });
}