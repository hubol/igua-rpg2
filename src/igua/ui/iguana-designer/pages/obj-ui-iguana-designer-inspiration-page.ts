import { Texture } from "pixi.js";
import { Rng } from "../../../../lib/math/rng";
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
        objUiRandomizerButton('Random Colors', () => randomizeColors(getMatchingColorConnectedInputs())),
        objUiRandomizerButton('Random Shapes', randomizeMatchingShapeConnectedInputs),
        UiVerticalLayout.Separator,
        objUiIguanaDesignerBackButton('Back'),
    )

    return objUiPage(els, { selectionIndex: 0, title: 'Inspiration' });
}

function randomizeMatchingShapeConnectedInputs() {
    const tree = UiIguanaDesignerContext.value.connectedInput;
    type MatchMap = Record<number, ConnectedInput.Leaf<TypedInput.Choice<Texture>>[]>; 
    const matches = new Map<readonly Texture[], MatchMap>();

    for (const input of ConnectedInput.find<TypedInput.Choice<Texture>>(tree, 'choice')) {
        if (!matches.has(input.options))
            matches.set(input.options, {});

        const map = matches.get(input.options)!;
        if (!map[input.value])
            map[input.value] = [];
        map[input.value].push(input);
    }

    for (const matchMaps of matches.values()) {
        for (const choiceInputs of Object.values(matchMaps)) {
            const firstChoiceInput = choiceInputs[0];
            const value = Rng.int(firstChoiceInput.allowNone ? -1 : 0, firstChoiceInput.options.length);
            for (const choiceInput of choiceInputs)
                choiceInput.value = value;
        }
    }
}

function getMatchingColorConnectedInputs(): ConnectedInput.Binding<number>[] {
    const tree = UiIguanaDesignerContext.value.connectedInput;

    const matches: Record<number, ConnectedInput.Leaf<TypedInput.Color>[]> = {};

    const rawHeadBinding = tree.head.color;
    const headColor = tree.head.color.value;
    const darkenedHeadColor = IguanaLooks.darkenEyelids(tree.head.color.value);

    const receiveHeadColors: ConnectedInput.Leaf<TypedInput.Color>[] = [];
    const receiveDarkenedHeadColors: ConnectedInput.Leaf<TypedInput.Color>[] = [];

    const headBinding = {
        set value(color: number) {
            rawHeadBinding.value = color;
            for (const receiveHeadColor of receiveHeadColors)
                receiveHeadColor.value = color;

            const darkenedColor = IguanaLooks.darkenEyelids(color);
            for (const receiveDarkenedHeadColor of receiveDarkenedHeadColors)
                receiveDarkenedHeadColor.value = darkenedColor;
        }
    }

    for (const input of ConnectedInput.find<TypedInput.Color>(tree, 'color')) {
        if (input.value === headColor) {
            receiveHeadColors.push(input);
            continue;
        }
        if (input.value === darkenedHeadColor) {
            receiveDarkenedHeadColors.push(input);
            continue;
        }

        if (!matches[input.value])
            matches[input.value] = [];
        matches[input.value].push(input);
    }

    return [ ...Object.values(matches).map(ConnectedInput.join) as ConnectedInput.Leaf<TypedInput.Color>[], headBinding];
}

function randomizeColors(colorBindings: ConnectedInput.Binding<number>[]) {
    for (const colorBinding of colorBindings)
        colorBinding.value = Rng.intc(0xffffff);
}

function objUiRandomizerButton(title: string, onPress: () => void) {
    return objUiDesignerButton(title, onPress).center().jiggle();
}