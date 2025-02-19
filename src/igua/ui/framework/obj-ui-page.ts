import { Container, Graphics, Rectangle } from "pixi.js";
import { Sfx } from "../../../assets/sounds";
import { AsshatTicker } from "../../../lib/game-engine/asshat-ticker";
import { TickerContainer } from "../../../lib/game-engine/ticker-container";
import { cyclic } from "../../../lib/math/number";
import { container } from "../../../lib/pixi/container";
import { Undefined } from "../../../lib/types/undefined";
import { renderer } from "../../current-pixi-renderer";
import { forceGameLoop, Input } from "../../globals";
import { UiColor } from "../ui-color";

export type UiPageProps = { maxHeight?: number; title?: string; selectionIndex: number; startTicking?: boolean };
export type ObjUiPageElement = Container & { selected: boolean };

export type ObjUiPageRouter = ReturnType<typeof objUiPageRouter>;

type UiPageRouterProps = { readonly maxHeight?: number };

export function objUiPageRouter(props: UiPageRouterProps = {}) {
    function replace(page: UiPage) {
        if (c.playSounds && c.page) {
            Sfx.Ui.NavigateInto.play();
        }
        page.maxHeight = props.maxHeight;
        c.children.last?.destroy();
        c.addChild(page);
        forceGameLoop();
    }

    function push(page: UiPage) {
        if (c.playSounds && c.page) {
            Sfx.Ui.NavigateInto.play();
        }
        page.maxHeight = props.maxHeight;
        c.addChild(page);
        forceGameLoop();
    }

    function pop() {
        if (c.playSounds) {
            Sfx.Ui.NavigateBack.play();
        }
        c.children.last?.destroy();
        forceGameLoop();
    }

    const c = container()
        .merge({
            replace,
            push,
            pop,
            get pages() {
                return c.children as UiPage[];
            },
            get page() {
                return c.pages.last;
            },
            playSounds: true,
        })
        .step(() => {
            for (let i = 0; i < c.children.length; i++) {
                c.children[i].visible = false;
            }

            if (c.page) {
                c.page.visible = true;
                c.page._ticker.tick();
            }
        });

    return c;
}

export function objUiPage(elements: ObjUiPageElement[], props: UiPageProps) {
    const ticker = new AsshatTicker();
    const c = new TickerContainer(ticker, props.startTicking ?? false).merge({
        navigation: true,
        selected: Undefined<ObjUiPageElement>(),
        playSounds: true,
    }).merge(props);

    const maskedObj = container().show(c);
    const elementsObj = container(...elements).show(maskedObj);

    const scrollBarObj = objScrollBar().show(c);

    const mask = new Graphics().beginFill(0xffffff).drawRect(0, 0, renderer.width, 1).show(maskedObj);

    updateSelection();
    let previousSelectionIndex = c.selectionIndex;

    function updateSelection() {
        c.selectionIndex = cyclic(c.selectionIndex, 0, elements.length);
        elements.forEach((x, i) => x.selected = c.selectionIndex === i);
        c.selected = elements[c.selectionIndex];
    }

    // TODO i wonder if the selection stuff could be extracted to a mixin...
    function select(dx: number, dy: number) {
        dx = Math.sign(dx) * 16;
        dy = Math.sign(dy) * 16;
        let ax = dx;
        let ay = dy;
        let d = 0;
        let fromBehind = false;
        const dd = Math.abs(dx) + Math.abs(dy);

        const maximumRendererEdge = Math.max(renderer.width, renderer.height);
        const maximumDimension = Math.max(elementsObj.width, elementsObj.height);
        const maximumTravel = Math.max(maximumRendererEdge * 2.33, Math.round(maximumDimension * 2.33));
        const halfTravel = Math.max(maximumRendererEdge, maximumDimension);

        while (d < maximumTravel) {
            const offset = [-ax, -ay];
            const collidedIndices: number[] = [];

            for (let i = 0; i < elements.length; i++) {
                if (i === c.selectionIndex) {
                    continue;
                }
                if (!c.selected || elements[i].collides(c.selected, offset)) {
                    collidedIndices.push(i);
                }
            }

            if (collidedIndices.length > 0) {
                let nextSelectionIndex = collidedIndices[0];
                // Handle the ambiguous collision by preferring the index we were at previously
                if (collidedIndices.length > 1 && collidedIndices.includes(previousSelectionIndex)) {
                    nextSelectionIndex = previousSelectionIndex;
                }

                if (c.playSounds && nextSelectionIndex !== c.selectionIndex) {
                    previousSelectionIndex = c.selectionIndex;
                    Sfx.Ui.Select.play();
                }
                c.selectionIndex = nextSelectionIndex;
                return;
            }

            ax += dx;
            ay += dy;
            d += dd;

            if (!fromBehind && d >= halfTravel) {
                ax = Math.sign(dx) * -halfTravel;
                ay = Math.sign(dy) * -halfTravel;
                fromBehind = true;
            }
        }
    }

    c.step(() => {
        if (c.navigation) {
            if (Input.justWentDown("SelectUp")) {
                select(0, -1);
            }
            if (Input.justWentDown("SelectDown")) {
                select(0, 1);
            }
            if (Input.justWentDown("SelectLeft")) {
                select(-1, 0);
            }
            if (Input.justWentDown("SelectRight")) {
                select(1, 0);
            }
        }
        updateSelection();
        if (c.maxHeight && elementsObj.height > c.maxHeight) {
            mask.height = c.maxHeight;
            mask.visible = true;
            scrollBarObj.x = elementsObj.width + 3;
            scrollBarObj.size = c.maxHeight;
            maskedObj.mask = mask;
            scrollBarObj.visible = true;

            if (c.selected) {
                const { y: rootY } = c.getBounds(false, r);

                for (let i = 0; i < 3; i++) {
                    const bounds = c.selected.getBounds(false, r);
                    bounds.y -= rootY;

                    if (bounds.y > c.maxHeight * 0.69 && c.maxHeight + elementsObj.pivot.y < elementsObj.height) {
                        elementsObj.pivot.y += 1;
                    }

                    if (bounds.y < c.maxHeight * 0.33 && elementsObj.pivot.y > 0) {
                        elementsObj.pivot.y -= 1;
                    }
                }
            }

            const start = elementsObj.pivot.y / elementsObj.height;
            const end = Math.min(1, (c.maxHeight + elementsObj.pivot.y) / elementsObj.height);

            scrollBarObj.start = start;
            scrollBarObj.end = end;
        }
        else {
            maskedObj.mask = null;
            mask.visible = false;
            scrollBarObj.visible = false;
        }
    });

    return c;
}

function objScrollBar() {
    return new Graphics().merge({ start: 0, end: 1, size: 0 }).step(bar => {
        const start = bar.start * bar.size;
        const end = bar.end * bar.size;
        bar.clear()
            .beginFill(UiColor.Background).drawRect(0, 0, 3, bar.size)
            .beginFill(UiColor.Hint).drawRect(0, start, 3, end - start);
    });
}

export type UiPage = ReturnType<typeof objUiPage>;

const r = new Rectangle();
