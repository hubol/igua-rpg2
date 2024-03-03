import { objText } from "../../../assets/fonts";
import { lerp } from "../../../lib/game-engine/promise/lerp";
import { sleep } from "../../../lib/game-engine/promise/sleep";
import { Rng } from "../../../lib/math/rng";
import { vnew } from "../../../lib/math/vector-type";
import { AdjustColor } from "../../../lib/pixi/adjust-color";
import { container } from "../../../lib/pixi/container";
import { SceneLocal } from "../../core/scene/scene-local";
import { ConnectedInput } from "../../iguana/connected-input";
import { getDefaultLooks } from "../../iguana/get-default-looks";
import { IguanaLooks } from "../../iguana/looks";
import { objIguanaPuppet } from "../../iguana/obj-iguana-puppet";
import { TypedInput } from "../../iguana/typed-input";
import { objUiButton } from "../framework/obj-ui-button";
import { ObjUiPageRouter, UiPage, objUiPage, objUiPageRouter } from "../framework/obj-ui-page";
import { UiVerticalLayout } from "../framework/ui-vertical-layout";
import { UiColor, UiStyle } from "../ui-color";
import { createUiConnectedInputPageElements } from "./components/obj-ui-connected-input-page";

function context() {
    let looks = getDefaultLooks();
    let connectedInput = ConnectedInput.create(IguanaLooks.create(), looks);

    return {
        get looks() {
            return looks;
        },
        set looks(value: IguanaLooks.Serializable) {
            looks = value;
            connectedInput = ConnectedInput.create(IguanaLooks.create(), looks);
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

export const UiIguanaDesignerContext = new SceneLocal(context, 'UiIguanaDesignerContext');

export function objUiIguanaDesignerRoot(looks = getDefaultLooks()) {
    const context = UiIguanaDesignerContext.value;

    context.looks = looks;

    const c = container();
    const router = context.router.at(3, 13).show(c);
    objText.LargeBold('', { tint: UiColor.Hint }).at(3, 3).step(tip => tip.text = getTipText(router.pages)).show(c);
    
    function objUiIguanaDesignerRootPage() {
        return objUiPage(UiVerticalLayout.apply(
            ...createUiConnectedInputPageElements(context.connectedInput),
            UiVerticalLayout.Separator,
            objUiButton('Randomize', randomizeIguanaLooks).jiggle()),
        { title: 'Choose your looks.', selectionIndex: 0 })
    }

    router.replace(objUiIguanaDesignerRootPage());

    objIguanaPreview().at(160, 200).show(c);
    objUiNoteText(router).show(c);

    return c;
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

function getTipText(pages: UiPage[]) {
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
    return text;
}

function set(destination: any, path: string[], value: any) {
    if (!path.length)
        return;

    let node = destination;
    for (let i = 0; i < path.length - 1; i++) {
        node = node[path[i]];
    }

    node[path.last] = value;
}

function randomize(schema: TypedInput.Any, value: any, path: string[] = []) {
    switch (schema.kind) {
        case "boolean":
            return set(value, path, Rng.bool());
        case "choice":
            return set(value, path, Rng.int(schema.allowNone ? -1 : 0, schema.options.length));
        case "vector":
            return set(value, path, vnew(Rng.intc(-2, 2), Rng.intc(-2, 2)));
        case "integer":
            return set(value, path, Rng.intc(0, 2));
        case "color":
            return set(value, path, AdjustColor.rgb(Rng.float(255), Rng.float(255), Rng.float(255)).toPixi());
        default:
            for (const key in schema as any) {
                randomize(schema[key], value, [...path, key]);
            }
    }
}

function randomizeIguanaLooks() {
    // Very crude placeholder
    randomize(IguanaLooks.create() as any, UiIguanaDesignerContext.value.looks);
}

function objIguanaPreview() {
    let lastLooksJson: string;
    let iguana: ReturnType<typeof objIguanaPreviewInstance>;

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

        const smallPuppet1 = objIguanaPuppet(UiIguanaDesignerContext.value.looks)
            .at(-30 + 20, -96);
        smallPuppet1.facing = -1;

        const smallPuppet2 = objIguanaPuppet(UiIguanaDesignerContext.value.looks)
            .at(64 - 20, -96);
        smallPuppet2.facing = 1;

        bigPuppet.scale.set(3);

        return container(smallPuppet1, smallPuppet2, bigPuppet);
    }

    function getLooksJson() {
        return JSON.stringify(UiIguanaDesignerContext.value.looks);
    }

    const c = container()
    .step(() => {
        const looksJson = getLooksJson();

        if (looksJson === lastLooksJson)
            return;

        iguana?.destroy();
        iguana = objIguanaPreviewInstance().show(c);
        lastLooksJson = looksJson;
    });

    return c;
}