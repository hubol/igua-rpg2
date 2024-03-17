import { Texture } from "pixi.js";
import { Rng } from "../../../../lib/math/rng";
import { Empty } from "../../../../lib/types/empty";
import { ConnectedInput } from "../../../iguana/connected-input";
import { IguanaLooks } from "../../../iguana/looks";
import { TypedInput } from "../../../iguana/typed-input";
import { objUiPage } from "../../framework/obj-ui-page";
import { UiVerticalLayout } from "../../framework/ui-vertical-layout";
import { objUiDesignerButton } from "../components/obj-ui-designer-button";
import { objUiIguanaDesignerBackButton } from "../components/obj-ui-iguana-designer-back-button";
import { UiIguanaDesignerContext } from "../obj-ui-iguana-designer-root";

export function objUiIguanaDesignerInspirationPage() {
    const els = UiVerticalLayout.apply(
        objUiIguanaDesignerRandomColorsButton(),
        UiVerticalLayout.Separator,
        objUiIguanaDesignerBackButton('Back'),
    )

    return objUiPage(els, { selectionIndex: 0, title: 'Inspiration' });
}

// function getBasicConnectedInputs(kind: 'choice' | 'color') {
//     const tree = UiIguanaDesignerContext.value.connectedInput;
//     return ConnectedInput.find<TypedInput.Choice<Texture>>(tree, kind)
//         .filter(x =>
//             x !== tree.head.eyes.left.pupil.shape && x !== tree.head.eyes.right.pupil.shape
//             && x !== tree.head.eyes.left.pupil.color && x !== tree.head.eyes.right.pupil.color

//             && x !== tree.head.eyes.left.eyelid.color && x !== tree.head.eyes.right.eyelid.color

//             && x !== tree.feet.fore.left.shape && x !== tree.feet.fore.right.shape
//             && x !== tree.feet.fore.left.color && x !== tree.feet.fore.right.color
//             && x !== tree.feet.fore.left.claws.shape && x !== tree.feet.fore.right.claws.shape
//             && x !== tree.feet.fore.left.claws.color && x !== tree.feet.fore.right.claws.color
            
//             && x !== tree.feet.hind.left.shape && x !== tree.feet.hind.right.shape
//             && x !== tree.feet.hind.left.color && x !== tree.feet.hind.right.color
//             && x !== tree.feet.hind.left.claws.shape && x !== tree.feet.hind.right.claws.shape
//             && x !== tree.feet.hind.left.claws.color && x !== tree.feet.hind.right.claws.color
            
//             && (tree.body.tail.club.shape.value !== -1 || x !== tree.body.tail.club.color)
//             && (tree.head.horn.shape.value !== -1 || x !== tree.head.horn.color));
// }

function getEyelidColorInputs() {
    const tree = UiIguanaDesignerContext.value.connectedInput;

    // const darkenedHeadColor = IguanaLooks.darkenEyelids(tree.head.color.value);

    return [ ConnectedInput.join([ tree.head.eyes.left.eyelid.color, tree.head.eyes.right.eyelid.color ]) ];
}

// function getBasicColorConnectedInputs() {
//     const tree = UiIguanaDesignerContext.value.connectedInput;

//     return [ ...getBasicConnectedInputs('color'),
//     ConnectedInput.join([ tree.head.eyes.left.pupil.color, tree.head.eyes.right.pupil.color ]),
//     ...getEyelidColorInputs(),
//     ConnectedInput.join([ tree.feet.fore.left.color, tree.feet.fore.right.color, tree.feet.hind.left.color, tree.feet.hind.right.color ]),
//     ConnectedInput.join([ tree.feet.fore.left.claws.color, tree.feet.fore.right.claws.color, tree.feet.hind.left.claws.color, tree.feet.hind.right.claws.color ]),
// ]
// }

function getMatchingColorConnectedInputs() {
    const tree = UiIguanaDesignerContext.value.connectedInput;

    const matches: Record<number, ConnectedInput.Binding<number>[]> = {};

    const darkenedHeadColor = IguanaLooks.darkenEyelids(tree.head.color.value);

    for (const input of ConnectedInput.find<TypedInput.Color>(tree, 'color')) {
        if (input === tree.head.eyes.left.eyelid.color || input === tree.head.eyes.right.eyelid.color) {
            if (input.value === darkenedHeadColor)
                continue;
        }

        if (!matches[input.value])
            matches[input.value] = [];
        matches[input.value].push(input);
    }

    return Object.values(matches).map(ConnectedInput.join);
}

function randomizeColors(colorBindings: ConnectedInput.Binding<number>[]) {
    for (const colorBinding of colorBindings)
        colorBinding.value = Rng.intc(0xffffff);
}

function objUiIguanaDesignerRandomColorsButton() {
    return objUiDesignerButton('Random Colors', () => randomizeColors(getMatchingColorConnectedInputs() as any)).center().jiggle();
}
