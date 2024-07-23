import { BLEND_MODES } from "pixi.js";
import { objText } from "../../../assets/fonts";
import { Sfx } from "../../../assets/sounds";
import { lerp } from "../../../lib/game-engine/promise/lerp";
import { sleep } from "../../../lib/game-engine/promise/sleep";
import { wait } from "../../../lib/game-engine/promise/wait";
import { approachLinear } from "../../../lib/math/number";
import { container } from "../../../lib/pixi/container";
import { SceneLocal } from "../../../lib/game-engine/scene-local";
import { Cutscene, DevKey, layers, sceneStack } from "../../globals";
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
import { PlayerTest } from "../../scenes/player-test";
import { RpgProgress } from "../../rpg/rpg-progress";
import { Environment } from "../../../lib/environment";
import { Toast } from "../../../lib/game-engine/toast";
import { merge } from "../../../lib/object/merge";
import { ClipboardPojo } from "../../../lib/browser/clipboard-pojo";
import { clone } from "../../../lib/object/clone";

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

export function objUiIguanaDesignerRoot(looks?: IguanaLooks.Serializable) {
    const context = UiIguanaDesignerContext.value;

    context.looks = looks ? clone(looks) : getDefaultLooks();

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

    if (Environment.isDev)
        objIguanaDesignerDevFeatures().show(c);

    return c;
}

function serializeLooksForClipboard(looks: IguanaLooks.Serializable) {
    return JSON.stringify(looks, (key, value) => {
        const lower = key.toLocaleLowerCase();
        if (lower.endsWith('tint') || lower.endsWith('color')) {
            return '0x' + value.toString(16);
        }

        return value;
    }, 0).replace(/\"/g, '');
}

function objIguanaDesignerDevFeatures() {
    return container().step(() => {
        if (!DevKey.isDown('ControlLeft'))
            return;

        if (DevKey.justWentDown('KeyC')) {
            setTimeout(async () => {
                const text = serializeLooksForClipboard(UiIguanaDesignerContext.value.looks);
                await navigator.clipboard.writeText(text);
                Toast.info('Copied', 'Iguana to clipboard');
            })
        }

        if (DevKey.justWentDown('KeyV')) {
            setTimeout(async () => {
                const object = await ClipboardPojo.read();
                Toast.info('Pasted', 'Iguana from clipboard');
                merge(UiIguanaDesignerContext.value.looks, object);
            })
        }
    });
}

function objUiSavePage() {
    const width = 96;
    const gap = Math.floor((256 - (width * 2)) / 3);

    const yesButton = objUiButton('Yes', () => {
        // TODO confirm sfx?
        page.navigation = false;
        yesButton.canPress = false;
        Cutscene.play(async () => {
            await wait(() => puppet.atYesButton);
            layers.overlay.solid.blendMode = BLEND_MODES.SUBTRACT;
            await layers.overlay.solid.fadeIn(500);
            const looks = UiIguanaDesignerContext.value.looks;
            RpgProgress.character.looks = looks;
            sceneStack.replace(PlayerTest, { useGameplay: false });
            page.destroy();
            await layers.overlay.solid.fadeOut(500);
        });
    }, width).jiggle().center().at(gap, 160);

    const page = objUiPage([
        yesButton,
        objUiButton('No', () => UiIguanaDesignerContext.value.router.pop(), width).center().at(width + gap * 2, 160),
    ], { selectionIndex: 1 }).named('Save');

    const getDesiredX = () => {
        return page.selected!.x + page.selected!.width / 2;
    }

    const looks = UiIguanaDesignerContext.value.looks;

    let prev = 0;
    const puppet = objIguanaPuppet(looks).at(128, 157)
    .merge({ atYesButton: false })
    .step(() => { prev = puppet.x; })
    .step(() => {
        const dx = getDesiredX();
        const diff = dx - puppet.x;

        puppet.facing = approachLinear(puppet.facing, Math.sign(diff || puppet.facing), 0.1);

        puppet.atYesButton = puppet.facing === -1 && diff === 0;
        
        if (diff === 0)
            return;

        let f = Math.abs(diff) > 8 ? 1 : 0.3;
        if (Math.sign(puppet.facing) !== Math.sign(diff))
            f = 0;
        puppet.x = approachLinear(puppet.x, dx, 4 * f);
    })
    .step(() => {
        const diff = prev - puppet.x;
        if (diff === 0) {
            puppet.gait = approachLinear(puppet.gait, 0, 0.3);
            if (puppet.gait === 0)
                puppet.pedometer = 0;
        }
        puppet.gait = approachLinear(puppet.gait, 1, 0.2);
        puppet.pedometer += diff / 30;
    })
    .show(page);

    puppet.scale.set(2);
    puppet.x = getDesiredX();

    page.pivot.set(3, 13);

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

        c.visible = UiIguanaDesignerContext.value.page.name !== 'Save';
    });

    return c;
}