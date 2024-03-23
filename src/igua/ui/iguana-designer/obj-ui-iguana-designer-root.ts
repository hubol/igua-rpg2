import { objText } from "../../../assets/fonts";
import { Sfx } from "../../../assets/sounds";
import { lerp } from "../../../lib/game-engine/promise/lerp";
import { sleep } from "../../../lib/game-engine/promise/sleep";
import { approachLinear } from "../../../lib/math/number";
import { container } from "../../../lib/pixi/container";
import { SceneLocal } from "../../core/scene/scene-local";
import { ConnectedInput } from "../../iguana/connected-input";
import { getDefaultLooks } from "../../iguana/get-default-looks";
import { IguanaLooks } from "../../iguana/looks";
import { objIguanaPuppet } from "../../iguana/obj-iguana-puppet";
import { objUiButton } from "../framework/obj-ui-button";
import { ObjUiPageRouter, UiPage, objUiPage, objUiPageRouter } from "../framework/obj-ui-page";
import { UiVerticalLayout } from "../framework/ui-vertical-layout";
import { UiColor, UiStyle } from "../ui-color";
import { createUiConnectedInputPageElements } from "./components/obj-ui-connected-input-page";
import { objUiDesignerNavigationButton } from "./components/obj-ui-designer-button";
import { objUiIguanaDesignerInspirationPage } from "./pages/obj-ui-iguana-designer-inspiration-page";

function context() {
    let looks = getDefaultLooks();
    let connectedInput = createConnectedInput(looks);

    return {
        get looks() {
            return looks;
        },
        set looks(value: IguanaLooks.Serializable) {
            looks = value;
            connectedInput = createConnectedInput(looks);
        },
        get connectedInput() {
            return connectedInput;
        },
        router: objUiPageRouter({ maxHeight: 240 }),
        get page() {
            return this.router.page;
        }
    }
}

function createConnectedInput(looks: IguanaLooks.Serializable) {
    const connectedInput = ConnectedInput.create(IguanaLooks.create(), looks);

    {
        const headColor = connectedInput.head.color;

        const headColorKeepEyelidDarkened: ConnectedInput.Leaf<typeof headColor> = {
            kind: 'color',
            get value() {
                return headColor.value;
            },
            set value(x) {
                const leftEyelidColor = connectedInput.head.eyes.left.eyelid.color;
                const rightEyelidColor = connectedInput.head.eyes.right.eyelid.color;

                const darkenedColor = IguanaLooks.darkenEyelids(connectedInput.head.color.value);
                const nextDarkenedColor = IguanaLooks.darkenEyelids(x);

                if (leftEyelidColor.value === darkenedColor)
                    leftEyelidColor.value = nextDarkenedColor;
                if (rightEyelidColor.value === darkenedColor)
                    rightEyelidColor.value = nextDarkenedColor;

                headColor.value = x;
            }
        }

        connectedInput.head.color = headColorKeepEyelidDarkened;
    }

    {
        const tailShape = connectedInput.body.tail.shape;

        const tailShapeResetClubPlacement: ConnectedInput.Leaf<typeof tailShape> = {
            ...tailShape,
            get value() {
                return tailShape.value;
            },
            set value(x) {
                connectedInput.body.tail.club.placement.value.x = 0;
                connectedInput.body.tail.club.placement.value.y = 0;
                tailShape.value = x;
            }
        }

        connectedInput.body.tail.shape = tailShapeResetClubPlacement;
    }

    return connectedInput;
}

export const UiIguanaDesignerContext = new SceneLocal(context, 'UiIguanaDesignerContext');

export function objUiIguanaDesignerRoot(looks = getDefaultLooks()) {
    const context = UiIguanaDesignerContext.value;

    context.looks = looks;

    const c = container();

    objIguanaPreview().at(0, 175).show(c);

    const router = context.router.at(3, 13).show(c);
    objText.LargeBold('', { tint: UiColor.Hint }).at(3, 3).step(title => title.text = getTitleText(router.pages)).show(c);
    
    function objUiIguanaDesignerRootPage() {
        return objUiPage(UiVerticalLayout.apply(
            ...createUiConnectedInputPageElements(context.connectedInput),
            UiVerticalLayout.Separator,
            objUiDesignerNavigationButton('Inspiration', objUiIguanaDesignerInspirationPage),
            UiVerticalLayout.Separator,
            objUiDesignerNavigationButton('Done', objUiSavePage),
            ),
        { title: 'Choose your looks.', selectionIndex: 0 })
    }

    router.replace(objUiIguanaDesignerRootPage());

    objUiNoteText(router).show(c);

    return c;
}

function objUiSavePage() {
    const width = 96;
    const gap = Math.floor((256 - (width * 2)) / 3);

    const page = objUiPage([
        objUiButton('Yes', () => {}, width).center().at(gap, 160),
        objUiButton('No', () => UiIguanaDesignerContext.value.router.pop(), width).center().at(width + gap * 2, 160),
    ], { selectionIndex: -1 }).named('Save');

    objText.LargeBold('Is this your true self?', { tint: UiColor.Hint }).anchored(0.5, 0).at(128, 64).show(page);

    return page;
}

function objUiNoteText(router: ObjUiPageRouter) {
    const c = container();

    const txtBacks = [[1, 0], [0, 1], [-1, 0], [0, -1]].map(v => {
        const txtBack = objText.Large('', { tint: UiColor.Shadow }).show(c);
        txtBack.pivot.at(v);
        return txtBack;
    })

    objText.Large('', { tint: UiColor.Hint })
    .step(txt => {
        const selected = router.page?.selected;
        if (selected && 'note' in selected) {
            c.visible = true;
            txt.text = selected.note as string;
            txt.at(router.width + UiStyle.Margin, selected.y).add(router);
            txt.maxWidth = (256 - UiStyle.Margin) - txt.x;

            for (const txtBack of txtBacks) {
                txtBack.text = txt.text;
                txtBack.at(txt);
                txtBack.maxWidth = txt.maxWidth;
            }
        }
        else
            c.visible = false;
    })
    .show(c);

    return c;
}

function getTitleText(pages: UiPage[]) {
    if (pages.length === 1)
        return pages[0].title!;

    let text = '';
    for (let i = 1; i < pages.length; i++) {
        if (!pages[i].title)
            break;
        if (text)
            text += ' > ';
        text += pages[i].title;
    }

    if (text.length > 52) {
        text = '...' + text.substring(text.length - 50);
    }

    return text;
}

function objIguanaPreview(minX = 102, maxX = 253) {
    const previewCenterX = minX + Math.round((maxX - minX) / 2);
    let lastLooksJson: string;
    let iguana: ReturnType<typeof objIguanaPreviewInstance>;
    let stepsSinceLastChange = 0;

    function objIguanaPreviewInstance() {
        const bigPuppet = objIguanaPuppet(UiIguanaDesignerContext.value.looks)
        .step(() => {
            if (bigPuppet.gait > 0)
                bigPuppet.pedometer += 0.1;
        })
        .async(async () => {
            while (true) {
                await sleep(1000);
                await lerp(bigPuppet, 'ducking').to(1).over(300);
                await sleep(1000);
                await lerp(bigPuppet, 'ducking').to(0).over(300);
                await sleep(1000);
                await lerp(bigPuppet, 'gait').to(1).over(300);
                await sleep(1000);
                await lerp(bigPuppet, 'gait').to(0).over(300);
            }
        });

        bigPuppet.scale.set(3);

        const smallPuppet = objIguanaPuppet(UiIguanaDesignerContext.value.looks)
        smallPuppet.facing = -1;

        smallPuppet.x = bigPuppet.getBounds().right + smallPuppet.getBounds().left;
        smallPuppet.y = smallPuppet.height + 3;

        return container(smallPuppet, bigPuppet).merge({ largePreviewObj: bigPuppet });
    }

    function getLooksJson() {
        return JSON.stringify(UiIguanaDesignerContext.value.looks);
    }

    let firstStep = false;

    const c = container()
    .step(() => {
        const looksJson = getLooksJson();

        if (looksJson === lastLooksJson) {
            stepsSinceLastChange++;
            return;
        }

        stepsSinceLastChange = 0;

        if (iguana)
            Sfx.Ui.Looks.Updated.play();
        iguana?.destroy();
        iguana = objIguanaPreviewInstance().show(c);
        lastLooksJson = looksJson;
    })
    .step(() => {
        if ((stepsSinceLastChange > 30 || !firstStep) && iguana) {
            const centerX = iguana.largePreviewObj.getBounds().getCenter().vround().x;
            const diff = approachLinear(centerX, previewCenterX, firstStep ? 1 : 256) - centerX;
            c.pivot.x -= diff;
            firstStep = true;
        }
    });

    return c;
}