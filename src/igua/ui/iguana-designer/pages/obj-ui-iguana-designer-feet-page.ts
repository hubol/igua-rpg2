import { StringCase } from "../../../../lib/string-case";
import { ConnectedInput } from "../../../iguana/connected-input";
import { objUiPage } from "../../framework/obj-ui-page";
import { UiVerticalLayout } from "../../framework/ui-vertical-layout";
import { createUiConnectedInputPageElements } from "../components/obj-ui-connected-input-page";
import { objUiDesignerButton, objUiDesignerNavigationButton } from "../components/obj-ui-designer-button";
import { objUiIguanaDesignerBackButton } from "../components/obj-ui-iguana-designer-back-button";
import { UiIguanaDesignerContext } from "../obj-ui-iguana-designer-root";

type ConnectedFeet = typeof UiIguanaDesignerContext["value"]["connectedInput"]["feet"];
type ConnectedFoot = typeof UiIguanaDesignerContext["value"]["connectedInput"]["feet"]["fore"]["left"];
function getTopLevelInputs(foot: ConnectedFoot) {
    return { color: foot.color, clawColor: foot.claws.color };
}

function getForeHindInputs(foot: ConnectedFoot) {
    return { shape: foot.shape, claws: foot.claws.shape, clawPlacement: foot.claws.placement };
}

function objUiForeHindFeetButton(ordinal: "fore" | "hind", feet: ConnectedFeet) {
    const title = StringCase.toEnglish(ordinal);

    return objUiDesignerButton(title, () => {
        const inputs = ConnectedInput.join([
            getForeHindInputs(feet[ordinal]["left"]),
            getForeHindInputs(feet[ordinal]["right"]),
        ]);

        const [shape, claws, clawPlacement] = createUiConnectedInputPageElements(inputs);
        shape.noteOnConflict = "*Changing this shape will set shape of all feet at once.";
        claws.noteOnConflict = "*Changing this shape will set shape of all claws at once.";
        clawPlacement.noteOnConflict = "*Changing this placement will set placement of all claws at once.";

        const els = UiVerticalLayout.apply(
            shape,
            claws,
            clawPlacement,
            UiVerticalLayout.Separator,
            objUiIguanaDesignerBackButton("Back"),
        );

        const page = objUiPage(els, { title, selectionIndex: 0 });
        UiIguanaDesignerContext.value.router.push(page);
    });
}

export function objUiIguanaDesignerFeetPage() {
    const feet = UiIguanaDesignerContext.value.connectedInput.feet;

    const inputs = ConnectedInput.join([
        getTopLevelInputs(feet.fore.left),
        getTopLevelInputs(feet.fore.right),
        getTopLevelInputs(feet.hind.left),
        getTopLevelInputs(feet.hind.right),
    ]);

    const [color, clawColor] = createUiConnectedInputPageElements(inputs);
    color.noteOnConflict = "*Changing this color will set color of all feet at once.";
    clawColor.noteOnConflict = "*Changing this color will set color of all claws at once.";

    const fore = objUiForeHindFeetButton("fore", feet);
    const hind = objUiForeHindFeetButton("hind", feet);

    const { gap, backOffset } = feet;

    const els = UiVerticalLayout.apply(
        color,
        clawColor,
        fore,
        hind,
        ...createUiConnectedInputPageElements({ gap, backOffset }),
        UiVerticalLayout.Separator,
        objUiDesignerNavigationButton("Advanced", objUiIguanaDesignerFeetAdvancedPage),
        UiVerticalLayout.Separator,
        objUiIguanaDesignerBackButton("Back"),
    );

    return objUiPage(els, { selectionIndex: 0, title: "Feet" });
}

function objUiIguanaDesignerFeetAdvancedPage() {
    const els = UiVerticalLayout.apply(
        objUiIguanaDesignerFootAdvancedButton("Fore Left", UiIguanaDesignerContext.value.connectedInput.feet.fore.left),
        objUiIguanaDesignerFootAdvancedButton(
            "Fore Right",
            UiIguanaDesignerContext.value.connectedInput.feet.fore.right,
        ),
        objUiIguanaDesignerFootAdvancedButton("Hind Left", UiIguanaDesignerContext.value.connectedInput.feet.hind.left),
        objUiIguanaDesignerFootAdvancedButton(
            "Hind Right",
            UiIguanaDesignerContext.value.connectedInput.feet.hind.right,
        ),
        UiVerticalLayout.Separator,
        objUiIguanaDesignerBackButton("Back"),
    );

    return objUiPage(els, { selectionIndex: 0, title: "Advanced" });
}

function objUiIguanaDesignerFootAdvancedButton(title: string, foot: ConnectedFoot) {
    return objUiDesignerButton(
        title,
        () => UiIguanaDesignerContext.value.router.push(objUiIguanaDesignerFootAdvancedPage(title, foot)),
    );
}

function objUiIguanaDesignerFootAdvancedPage(title: string, foot: ConnectedFoot) {
    const els = UiVerticalLayout.apply(
        ...createUiConnectedInputPageElements(foot),
        UiVerticalLayout.Separator,
        objUiIguanaDesignerBackButton("Back"),
    );

    return objUiPage(els, { selectionIndex: 0, title });
}
