import { ConnectedInput } from "../../../iguana/connected-input";
import { objUiPage } from "../../framework/obj-ui-page";
import { UiVerticalLayout } from "../../framework/ui-vertical-layout";
import { createUiConnectedInputPageElements } from "../components/obj-ui-connected-input-page";
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

type Foot = typeof UiIguanaDesignerContext['value']['connectedInput']['feet']['fore']['left'];
function getBlah(foot: Foot) {
    return { color: foot.color, clawColor: foot.claws.color };
}

export function objUiIguanaDesignerFeetPage() {
    const inputs = ConnectedInput.join([
        getBlah(UiIguanaDesignerContext.value.connectedInput.feet.fore.left),
        getBlah(UiIguanaDesignerContext.value.connectedInput.feet.fore.right),
        getBlah(UiIguanaDesignerContext.value.connectedInput.feet.hind.left),
        getBlah(UiIguanaDesignerContext.value.connectedInput.feet.hind.right),
    ]);


    const a = inputs.clawColor.value;
    // inputs.clawColor.value = 1;
    type A = typeof a

    const color = ConnectedInput.join([
        UiIguanaDesignerContext.value.connectedInput.feet.fore.left.color,
        UiIguanaDesignerContext.value.connectedInput.feet.fore.right.color,
        UiIguanaDesignerContext.value.connectedInput.feet.hind.left.color,
        UiIguanaDesignerContext.value.connectedInput.feet.hind.right.color,
    ]);

    const b = color.value;
    // color.value = 2;
    type B = typeof b

    const clawColor = ConnectedInput.join([
        UiIguanaDesignerContext.value.connectedInput.feet.fore.left.claws.color as any,
        UiIguanaDesignerContext.value.connectedInput.feet.fore.right.claws.color,
        UiIguanaDesignerContext.value.connectedInput.feet.hind.left.claws.color,
        UiIguanaDesignerContext.value.connectedInput.feet.hind.right.claws.color,
    ]);

    const els = UiVerticalLayout.apply(
        ...createUiConnectedInputPageElements(inputs),
        ...createUiConnectedInputPageElements({ color, clawColor }),
        UiVerticalLayout.Separator,
        objUiIguanaDesignerBackButton('Back'),
    )

    return objUiPage(els, { selectionIndex: 0, title: 'Feet' });
}