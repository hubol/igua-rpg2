import { Texture } from "pixi.js";
import { StringTransform } from "../../../../lib/string/string-transform";
import { Empty } from "../../../../lib/types/empty";
import { ConnectedInput } from "../../../iguana/connected-input";
import { TypedInput } from "../../../iguana/typed-input";
import { objUiPage, ObjUiPageElement, UiPage } from "../../framework/obj-ui-page";
import { UiVerticalLayout } from "../../framework/ui-vertical-layout";
import { CtxUiIguanaDesigner } from "../obj-ui-iguana-designer-root";
import { objUiIguanaDesignerEyesPage } from "../pages/obj-ui-iguana-designer-eyes-page";
import { objUiIguanaDesignerFeetPage } from "../pages/obj-ui-iguana-designer-feet-page";
import { objUiCheckboxInput } from "./obj-ui-checkbox-input";
import { objUiColorInput } from "./obj-ui-color-input";
import { objUiDesignerButton } from "./obj-ui-designer-button";
import { ObjUiDesignerInputBase } from "./obj-ui-designer-input-base";
import { objUiIguanaDesignerBackButton } from "./obj-ui-iguana-designer-back-button";
import { objUiPlacementInput } from "./obj-ui-placement-input";
import { objUiSliderInput } from "./obj-ui-slider-input";
import { objUiTextureChoiceInput } from "./obj-ui-texture-choice-input";

export function createUiConnectedInputPageElements(root: ConnectedInput.Tree<unknown>) {
    const els = Empty<ObjUiPageElement & Partial<Pick<ObjUiDesignerInputBase, "noteOnConflict">>>();

    for (const key in root) {
        // @ts-expect-error Don't care
        const input = root[key];
        const inputObj = createInputObj(key, input);
        els.push(inputObj);
    }

    return els;
}

export function objUiConnectedInputPage(title: string, root: ConnectedInput.Tree<unknown>) {
    const els = UiVerticalLayout.apply(
        ...createUiConnectedInputPageElements(root),
        UiVerticalLayout.Separator,
        objUiIguanaDesignerBackButton("Back"),
    );

    return objUiPage(els, { title, selectionIndex: 0 });
}

function createInputObj(key: string, input: TypedInput.Any & { value: any }) {
    const title = StringTransform.toEnglish(key);
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

export function objUiConnectedInputNavigationButton(title: string, input: ConnectedInput.Tree<unknown>) {
    return objUiDesignerButton(title, () => {
        const pageObj = createPageObj(title, input);
        CtxUiIguanaDesigner.value.router.push(pageObj);
    });
}

function createPageObj(title: string, input: ConnectedInput.Tree<unknown>): UiPage {
    const looks = CtxUiIguanaDesigner.value.connectedInput;
    if (input === looks.head.eyes) {
        return objUiIguanaDesignerEyesPage();
    }
    if (input === looks.feet) {
        return objUiIguanaDesignerFeetPage();
    }
    return objUiConnectedInputPage(title, input);
}
