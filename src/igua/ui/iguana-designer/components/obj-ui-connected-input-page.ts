import { Texture } from "pixi.js";
import { Empty } from "../../../../lib/types/empty";
import { ConnectedInput } from "../../../iguana/connected-input";
import { TypedInput } from "../../../iguana/typed-input";
import { UiPage, UiPageElement, objUiPage } from "../../framework/obj-ui-page";
import { UiIguanaDesignerContext } from "../obj-ui-iguana-designer-root";
import { objUiCheckboxInput } from "./obj-ui-checkbox-input";
import { objUiDesignerButton } from "./obj-ui-designer-button";
import { objUiTextureChoiceInput } from "./obj-ui-texture-choice-input";
import { objUiPlacementInput } from "./obj-ui-placement-input";
import { objUiSliderInput } from "./obj-ui-slider-input";
import { objUiColorInput } from "./obj-ui-color-input";
import { StringCase } from "../../../../lib/string-case";
import { objUiIguanaDesignerEyesPage } from "../pages/obj-ui-iguana-designer-eyes-page";
import { UiVerticalLayout } from "../../framework/ui-vertical-layout";

export function objUiConnectedInputPage(title: string, root: ConnectedInput.Type<unknown>) {
    const els = Empty<UiVerticalLayout.Element>();

    for (const key in root) {
        const input = root[key];
        const inputObj = createInputObj(key, input);
        els.push(inputObj);
    }

    els.push(UiVerticalLayout.Separator);
    els.push(objUiDesignerButton('Back', () => UiIguanaDesignerContext.value.router.pop()));

    return objUiPage(UiVerticalLayout.apply(els), { title, selectionIndex: 0 });
}

function createInputObj(key: string, input: TypedInput.Any & { value: any }) {
    const title = StringCase.toEnglish(key);
    switch (input.kind) {
        case "boolean":
            return objUiCheckboxInput(title, input);
        case "choice":
            return objUiTextureChoiceInput(input, input as TypedInput.Choice<Texture>);
        case "vector":
            return objUiPlacementInput(title, input, input);
        case "integer":
            return objUiSliderInput(title, input, input);
        case "color":
            return objUiColorInput(title, input);
    }
    return objUiConnectedInputNavigationButton(title, input);
}

export function objUiConnectedInputNavigationButton(title: string, input: ConnectedInput.Type<unknown>) {
    return objUiDesignerButton(title, () => {
        const page = createConnectedInputPageObj(title, input);
        UiIguanaDesignerContext.value.router.push(page);
    });
}

export function createConnectedInputPageObj(title: string, input: ConnectedInput.Type<unknown>): UiPage {
    const looks = UiIguanaDesignerContext.value.connectedInput;
    if (input === looks.head.eyes)
        return objUiIguanaDesignerEyesPage();
    return objUiConnectedInputPage(title, input);
}