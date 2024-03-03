import { StringCase } from "../../../../lib/string-case";
import { ConnectedInput } from "../../../iguana/connected-input";
import { objUiPage } from "../../framework/obj-ui-page";
import { UiVerticalLayout } from "../../framework/ui-vertical-layout";
import { createUiConnectedInputPageElements, objUiConnectedInputPage } from "../components/obj-ui-connected-input-page";
import { objUiDesignerButton } from "../components/obj-ui-designer-button";
import { objUiIguanaDesignerBackButton } from "../components/obj-ui-iguana-designer-back-button";
import { UiIguanaDesignerContext } from "../obj-ui-iguana-designer-root";

// color
// claw color
// fore > 
// 	shape
// 	claws
// 	claws placement
// hind > 
// 	shape
// 	claws
// 	claws placement
// gap
// back offset
// advanced

type ConnectedFeet = typeof UiIguanaDesignerContext['value']['connectedInput']['feet'];
type ConnectedFoot = typeof UiIguanaDesignerContext['value']['connectedInput']['feet']['fore']['left'];
function getTopLevelInputs(foot: ConnectedFoot) {
    return { color: foot.color, clawColor: foot.claws.color };
}

function getForeHindInputs(foot: ConnectedFoot) {
    return { shape: foot.shape, claws: foot.claws.shape, clawPlacement: foot.claws.placement };
}

function objUiForeHindFeetButton(ordinal: 'fore' | 'hind', feet: ConnectedFeet) {
    const title = StringCase.toEnglish(ordinal);

    return objUiDesignerButton(title, () => {
        const inputs = ConnectedInput.join([
            getForeHindInputs(feet[ordinal]['left']),
            getForeHindInputs(feet[ordinal]['right'])
        ]);
        const page = objUiConnectedInputPage(title, inputs);
        UiIguanaDesignerContext.value.router.push(page);
    });
}

export function objUiIguanaDesignerFeetPage() {
    const inputs = ConnectedInput.join([
        getTopLevelInputs(UiIguanaDesignerContext.value.connectedInput.feet.fore.left),
        getTopLevelInputs(UiIguanaDesignerContext.value.connectedInput.feet.fore.right),
        getTopLevelInputs(UiIguanaDesignerContext.value.connectedInput.feet.hind.left),
        getTopLevelInputs(UiIguanaDesignerContext.value.connectedInput.feet.hind.right),
    ]);

    const fore = objUiForeHindFeetButton('fore', UiIguanaDesignerContext.value.connectedInput.feet);
    const hind = objUiForeHindFeetButton('hind', UiIguanaDesignerContext.value.connectedInput.feet);

    const els = UiVerticalLayout.apply(
        ...createUiConnectedInputPageElements(inputs),
        fore,
        hind,
        UiVerticalLayout.Separator,
        objUiDesignerButton('Advanced', () => UiIguanaDesignerContext.value.router.push(objUiIguanaDesignerFeetAdvancedPage())),
        UiVerticalLayout.Separator,
        objUiIguanaDesignerBackButton('Back'),
    )

    return objUiPage(els, { selectionIndex: 0, title: 'Feet' });
}

function objUiIguanaDesignerFeetAdvancedPage() {
    const els = UiVerticalLayout.apply(
        objUiIguanaDesignerFootAdvancedButton('Fore Left', UiIguanaDesignerContext.value.connectedInput.feet.fore.left),
        objUiIguanaDesignerFootAdvancedButton('Fore Right', UiIguanaDesignerContext.value.connectedInput.feet.fore.right),
        objUiIguanaDesignerFootAdvancedButton('Hind Left', UiIguanaDesignerContext.value.connectedInput.feet.hind.left),
        objUiIguanaDesignerFootAdvancedButton('Hind Right', UiIguanaDesignerContext.value.connectedInput.feet.hind.right),
        UiVerticalLayout.Separator,
        objUiIguanaDesignerBackButton('Back'),
    )

    return objUiPage(els, { selectionIndex: 0, title: 'Advanced' });
}

function objUiIguanaDesignerFootAdvancedButton(title: string, foot: ConnectedFoot) {
    return objUiDesignerButton(title, () => UiIguanaDesignerContext.value.router.push(objUiIguanaDesignerFootAdvancedPage(title, foot)));
}

function objUiIguanaDesignerFootAdvancedPage(title: string, foot: ConnectedFoot) {
    const els = UiVerticalLayout.apply(
        ...createUiConnectedInputPageElements(foot),
        UiVerticalLayout.Separator,
        objUiIguanaDesignerBackButton('Back'),
    )

    return objUiPage(els, { selectionIndex: 0, title });
}