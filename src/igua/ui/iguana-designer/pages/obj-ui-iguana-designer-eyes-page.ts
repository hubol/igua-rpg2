import { objUiPage } from "../../framework/obj-ui-page";
import { UiVerticalLayout } from "../../framework/ui-vertical-layout";
import { createUiConnectedInputPageElements, objUiConnectedInputPage } from "../components/obj-ui-connected-input-page";
import { objUiDesignerButton } from "../components/obj-ui-designer-button";
import { objUiIguanaDesignerBackButton } from "../components/obj-ui-iguana-designer-back-button";
import { UiIguanaDesignerContext } from "../obj-ui-iguana-designer-root";

export function objUiIguanaDesignerEyesPage() {
    const eyes = UiIguanaDesignerContext.value.connectedInput.head.eyes;

    // const inputs = ConnectedInput.join([
    //     getTopLevelInputs(feet.fore.left),
    //     getTopLevelInputs(feet.fore.right),
    //     getTopLevelInputs(feet.hind.left),
    //     getTopLevelInputs(feet.hind.right),
    // ]);

    // const [ color, clawColor ] = createUiConnectedInputPageElements(inputs);
    // (color as ObjUiDesignerInputBase).noteOnConflict = '*Changing this color will set color of all feet at once.';
    // (clawColor as ObjUiDesignerInputBase).noteOnConflict = '*Changing this color will set color of all claws at once.';

    // const fore = objUiForeHindFeetButton('fore', feet);
    // const hind = objUiForeHindFeetButton('hind', feet);

    const { placement, gap } = eyes;

    const els = UiVerticalLayout.apply(
        ...createUiConnectedInputPageElements({ placement, gap }),
        UiVerticalLayout.Separator,
        objUiDesignerButton('Advanced', () => UiIguanaDesignerContext.value.router.push(objUiIguanaDesignerEyesAdvancedPage())),
        UiVerticalLayout.Separator,
        objUiIguanaDesignerBackButton('Back'),
    )

    return objUiPage(els, { selectionIndex: 0, title: 'Eyes' });
}

function objUiIguanaDesignerEyesAdvancedPage() {
    const eyes = UiIguanaDesignerContext.value.connectedInput.head.eyes;

    const { tilt, left, right } = eyes;
    return objUiConnectedInputPage('Advanced', { tilt, left, right });
}