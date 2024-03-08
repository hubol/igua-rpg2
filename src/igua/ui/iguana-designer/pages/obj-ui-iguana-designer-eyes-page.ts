import { ConnectedInput } from "../../../iguana/connected-input";
import { objUiPage } from "../../framework/obj-ui-page";
import { UiVerticalLayout } from "../../framework/ui-vertical-layout";
import { createUiConnectedInputPageElements, objUiConnectedInputPage } from "../components/obj-ui-connected-input-page";
import { objUiDesignerNavigationButton } from "../components/obj-ui-designer-button";
import { objUiIguanaDesignerBackButton } from "../components/obj-ui-iguana-designer-back-button";
import { UiIguanaDesignerContext } from "../obj-ui-iguana-designer-root";

type ConnectedEye = typeof UiIguanaDesignerContext['value']['connectedInput']['head']['eyes']['left'];

export function objUiIguanaDesignerEyesPage() {
    const eyes = UiIguanaDesignerContext.value.connectedInput.head.eyes;

    const { placement, gap } = eyes;

    const els = UiVerticalLayout.apply(
        ...createUiConnectedInputPageElements({ placement, gap }),
        objUiDesignerNavigationButton('Eyelids', objUiIguanaDesignerEyelidsPage),
        objUiDesignerNavigationButton('Pupils', objUiIguanaDesignerPupilsPage),
        UiVerticalLayout.Separator,
        objUiDesignerNavigationButton('Advanced', objUiIguanaDesignerEyesAdvancedPage),
        UiVerticalLayout.Separator,
        objUiIguanaDesignerBackButton('Back'),
    )

    return objUiPage(els, { selectionIndex: 0, title: 'Eyes' });
}

function getEyelidInputs(eye: ConnectedEye) {
    return { color: eye.eyelid.color, placement: eye.eyelid.placement };
}

function objUiIguanaDesignerEyelidsPage() {
    const eyes = UiIguanaDesignerContext.value.connectedInput.head.eyes;

    const inputs = ConnectedInput.join([
        getEyelidInputs(eyes.left),
        getEyelidInputs(eyes.right),
    ]);

    const [ colorEl, placementEl ] = createUiConnectedInputPageElements(inputs);

    colorEl.noteOnConflict = '*Changing this color will set color of both eyelids at once.';
    placementEl.noteOnConflict = '*Changing this placement will set placement of both eyelids at once.';

    const els = UiVerticalLayout.apply(
        colorEl,
        placementEl,
        UiVerticalLayout.Separator,
        objUiIguanaDesignerBackButton('Back'),
    )

    return objUiPage(els, { selectionIndex: 0, title: 'Eyelids' });
}

function objUiIguanaDesignerPupilsPage() {
    const eyes = UiIguanaDesignerContext.value.connectedInput.head.eyes;

    const colorInputs = ConnectedInput.join([
        eyes.left.pupil.color,
        eyes.right.pupil.color,
    ]);

    console.log(colorInputs);

    const [ colorEl ] = createUiConnectedInputPageElements({ color: colorInputs });

    colorEl.noteOnConflict = '*Changing this color will set color of both pupils at once.';

    const els = UiVerticalLayout.apply(
        colorEl,
        UiVerticalLayout.Separator,
        objUiIguanaDesignerBackButton('Back'),
    )

    return objUiPage(els, { selectionIndex: 0, title: 'Eyelids' });
}

function objUiIguanaDesignerEyesAdvancedPage() {
    const eyes = UiIguanaDesignerContext.value.connectedInput.head.eyes;

    const { tilt, left, right } = eyes;
    return objUiConnectedInputPage('Advanced', { tilt, leftEye: left, rightEye: right });
}