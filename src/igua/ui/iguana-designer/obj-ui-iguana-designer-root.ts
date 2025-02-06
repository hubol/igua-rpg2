import { BLEND_MODES } from "pixi.js";
import { objText } from "../../../assets/fonts";
import { Sfx } from "../../../assets/sounds";
import { interp } from "../../../lib/game-engine/routines/interp";
import { sleep } from "../../../lib/game-engine/routines/sleep";
import { approachLinear } from "../../../lib/math/number";
import { container } from "../../../lib/pixi/container";
import { SceneLocal } from "../../../lib/game-engine/scene-local";
import { renderer } from "../../current-pixi-renderer";
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
import { RpgProgress } from "../../rpg/rpg-progress";
import { Environment } from "../../../lib/environment";
import { Toast } from "../../../lib/game-engine/toast";
import { merge } from "../../../lib/object/merge";
import { ClipboardPojo } from "../../../lib/browser/clipboard-pojo";
import { clone } from "../../../lib/object/clone";
import { mxnBoilSeed } from "../../mixins/mxn-boil-seed";
import { VectorSimple } from "../../../lib/math/vector-type";
import { Force } from "../../../lib/types/force";
import { scnNewBalltownOutskirts } from "../../scenes/scn-new-balltown-outskirts";
import { SceneChanger } from "../../systems/scene-changer";

interface Layout {
    leftFacingPreviewPosition: VectorSimple;
}

function context() {
    let looks = getDefaultLooks();
    let connectedInput = createConnectedInput(looks);

    return {
        layout: Force<Layout>(),
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
        router: objUiPageRouter({ maxHeight: 263 }),
        get page() {
            return this.router.page;
        },
        get isViewingConfirmPage() {
            return this.page.name === "Save";
        },
    };
}

function createConnectedInput(looks: IguanaLooks.Serializable) {
    const connectedInput = ConnectedInput.create(IguanaLooks.create(), looks);

    {
        const headColor = connectedInput.head.color;

        const headColorKeepEyelidDarkened: ConnectedInput.Leaf<typeof headColor> = {
            kind: "color",
            get value() {
                return headColor.value;
            },
            set value(x) {
                const leftEyelidColor = connectedInput.head.eyes.left.eyelid.color;
                const rightEyelidColor = connectedInput.head.eyes.right.eyelid.color;

                const darkenedColor = IguanaLooks.darkenEyelids(connectedInput.head.color.value);
                const nextDarkenedColor = IguanaLooks.darkenEyelids(x);

                if (leftEyelidColor.value === darkenedColor) {
                    leftEyelidColor.value = nextDarkenedColor;
                }
                if (rightEyelidColor.value === darkenedColor) {
                    rightEyelidColor.value = nextDarkenedColor;
                }

                headColor.value = x;
            },
        };

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
            },
        };

        connectedInput.body.tail.shape = tailShapeResetClubPlacement;
    }

    return connectedInput;
}

export const CtxUiIguanaDesigner = new SceneLocal(context, "UiIguanaDesignerContext");

export function objUiIguanaDesignerRoot(layout: Layout, looks?: IguanaLooks.Serializable) {
    const context = CtxUiIguanaDesigner.value;

    context.layout = layout;
    context.looks = looks ? clone(looks) : getDefaultLooks();

    const c = container();

    objIguanaPreview().show(c);

    const router = context.router.at(3, 14).show(c);
    objText.MediumBoldIrregular("", { tint: UiColor.Hint }).at(3, 3).step(title =>
        title.text = getTitleText(router.pages)
    ).show(
        c,
    );

    function objUiIguanaDesignerRootPage() {
        return objUiPage(
            UiVerticalLayout.apply(
                ...createUiConnectedInputPageElements(context.connectedInput),
                UiVerticalLayout.Separator,
                objUiDesignerNavigationButton("Inspiration", objUiIguanaDesignerInspirationPage),
                UiVerticalLayout.Separator,
                objUiDesignerNavigationButton("Done", objUiSavePage),
            ),
            { title: "Choose your looks.", selectionIndex: 0 },
        );
    }

    router.replace(objUiIguanaDesignerRootPage());

    objUiNoteText(router).show(c);

    if (Environment.isDev) {
        objIguanaDesignerDevFeatures().show(c);
    }

    return c;
}

function serializeLooksForClipboard(looks: IguanaLooks.Serializable) {
    return JSON.stringify(looks, (key, value) => {
        const lower = key.toLocaleLowerCase();
        if (lower.endsWith("tint") || lower.endsWith("color")) {
            return "0x" + value.toString(16);
        }

        return value;
    }, 0).replace(/\"/g, "");
}

function objIguanaDesignerDevFeatures() {
    return container().step(() => {
        if (!DevKey.isDown("ControlLeft")) {
            return;
        }

        if (DevKey.justWentDown("KeyC")) {
            setTimeout(async () => {
                const text = serializeLooksForClipboard(CtxUiIguanaDesigner.value.looks);
                await navigator.clipboard.writeText(text);
                Toast.info("Copied", "Iguana to clipboard");
            });
        }

        if (DevKey.justWentDown("KeyV")) {
            setTimeout(async () => {
                const object = await ClipboardPojo.read();
                Toast.info("Pasted", "Iguana from clipboard");
                merge(CtxUiIguanaDesigner.value.looks, object);
            });
        }
    });
}

function objUiSavePage() {
    const horizontalMargin = 140;
    const width = 96;

    const yesButton = objUiButton("Yes", () => {
        // TODO confirm sfx?
        page.navigation = false;
        yesButton.canPress = false;
        Cutscene.play(function* () {
            yield () => puppet.atYesButton;
            // TODO this stuff should probably be pulled out
            layers.overlay.solid.blendMode = BLEND_MODES.SUBTRACT;
            yield layers.overlay.solid.fadeIn(500);
            const looks = CtxUiIguanaDesigner.value.looks;
            RpgProgress.character.looks = looks;
            SceneChanger.create({ sceneName: scnNewBalltownOutskirts.name, checkpointName: "fromGameStart" })!
                .changeScene();
            page.destroy();
            yield layers.overlay.solid.fadeOut(500);
        });
    }, width).jiggle().center().at(horizontalMargin, 160);

    const page = objUiPage([
        yesButton,
        objUiButton("No", () => CtxUiIguanaDesigner.value.router.pop(), width).center().at(
            renderer.width - horizontalMargin - width,
            160,
        ),
    ], { selectionIndex: 1 }).named("Save");

    const getDesiredX = () => {
        return page.selected!.x + page.selected!.width / 2;
    };

    const looks = CtxUiIguanaDesigner.value.looks;

    let prev = 0;
    const puppet = objIguanaPuppet(looks).at(renderer.width / 2, 157)
        .merge({ atYesButton: false })
        .step(() => {
            prev = puppet.x;
        })
        .step(() => {
            const dx = getDesiredX();
            const diff = dx - puppet.x;

            puppet.facing = approachLinear(puppet.facing, Math.sign(diff || puppet.facing), 0.1);

            puppet.atYesButton = puppet.facing === -1 && diff === 0;

            if (diff === 0) {
                return;
            }

            let f = Math.abs(diff) > 8 ? 1 : 0.3;
            if (Math.sign(puppet.facing) !== Math.sign(diff)) {
                f = 0;
            }
            puppet.x = approachLinear(puppet.x, dx, 4 * f);
        })
        .step(() => {
            const diff = prev - puppet.x;
            if (diff === 0) {
                puppet.gait = approachLinear(puppet.gait, 0, 0.3);
                if (puppet.gait === 0) {
                    puppet.pedometer = 0;
                }
            }
            puppet.gait = approachLinear(puppet.gait, 1, 0.2);
            puppet.pedometer += diff / 30;
        })
        .show(page);

    puppet.x = getDesiredX();

    objText.MediumBoldIrregular("Is this your true self?", { tint: UiColor.Hint }).anchored(0.5, 0).at(
        renderer.width / 2,
        64,
    )
        .mixin(mxnBoilSeed)
        .show(page);

    return page;
}

function objUiNoteText(router: ObjUiPageRouter) {
    const c = container();

    const txtBacks = [[1, 0], [0, 1], [-1, 0], [0, -1]].map(v => {
        const txtBack = objText.MediumIrregular("", { tint: UiColor.Shadow }).show(c);
        txtBack.pivot.at(v);
        return txtBack;
    });

    objText.MediumIrregular("", { tint: UiColor.Hint })
        .step(txt => {
            const selected = router.page?.selected;
            if (selected && "note" in selected) {
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
            else {
                c.visible = false;
            }
        })
        .show(c);

    return c;
}

function getTitleText(pages: UiPage[]) {
    if (pages.length === 1) {
        return pages[0].title!;
    }

    let text = "";
    for (let i = 1; i < pages.length; i++) {
        if (!pages[i].title) {
            break;
        }
        if (text) {
            text += " > ";
        }
        text += pages[i].title;
    }

    return text;
}

function objIguanaPreview() {
    let lastLooksJson: string;
    let iguana: ReturnType<typeof objIguanaPreviewInstance>;
    let stepsSinceLastChange = 0;

    function objIguanaPreviewInstance() {
        const bigPuppet = objIguanaPuppet(CtxUiIguanaDesigner.value.looks)
            .step(() => {
                if (bigPuppet.gait > 0) {
                    bigPuppet.pedometer += 0.1;
                }
            })
            .coro(function* () {
                while (true) {
                    yield sleep(1000);
                    yield interp(bigPuppet, "ducking").to(1).over(300);
                    yield sleep(1000);
                    yield interp(bigPuppet, "ducking").to(0).over(300);
                    yield sleep(1000);
                    yield interp(bigPuppet, "gait").to(1).over(300);
                    yield sleep(1000);
                    yield interp(bigPuppet, "gait").to(0).over(300);
                }
            });

        bigPuppet.playSfx = false;
        bigPuppet.scale.set(3);

        bigPuppet.at(280, 183);

        const smallPuppet = objIguanaPuppet(CtxUiIguanaDesigner.value.looks);
        smallPuppet.facing = -1;

        smallPuppet.at(CtxUiIguanaDesigner.value.layout.leftFacingPreviewPosition);

        return container(smallPuppet, bigPuppet).merge({ largePreviewObj: bigPuppet });
    }

    function getLooksJson() {
        return JSON.stringify(CtxUiIguanaDesigner.value.looks);
    }

    const c = container()
        .step(() => {
            const looksJson = getLooksJson();

            if (looksJson === lastLooksJson) {
                stepsSinceLastChange++;
                return;
            }

            stepsSinceLastChange = 0;

            if (iguana) {
                Sfx.Ui.Looks.Updated.play();
            }
            iguana?.destroy();
            iguana = objIguanaPreviewInstance().show(c);
            lastLooksJson = looksJson;
        })
        .step(() => {
            c.visible = !CtxUiIguanaDesigner.value.isViewingConfirmPage;
        });

    return c;
}
