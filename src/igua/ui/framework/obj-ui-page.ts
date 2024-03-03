import { Container, Graphics, Rectangle } from "pixi.js";
import { container } from "../../../lib/pixi/container";
import { cyclic } from "../../../lib/math/number";
import { AsshatTicker } from "../../../lib/game-engine/asshat-ticker";
import { Input, forceGameLoop } from "../../globals";
import { TickerContainer } from "../../../lib/game-engine/ticker-container";
import { UiColor } from "../ui-color";
import { Undefined } from "../../../lib/types/undefined";

export type UiPageProps = { maxHeight?: number; title?: string; selectionIndex: number };
export type UiPageElement = Container & { selected: boolean };

type UiPageRouterProps = { readonly maxHeight?: number; };

export function objUiPageRouter(props: UiPageRouterProps = {}) {
    function replace(page: UiPage) {
        page.maxHeight = props.maxHeight;
        c.children.last?.destroy();
        c.addChild(page);
        forceGameLoop();
    }

    function push(page: UiPage) {
        page.maxHeight = props.maxHeight;
        c.addChild(page);
        forceGameLoop();
    }

    function pop() {
        c.children.last?.destroy();
        forceGameLoop();
    }

    const c = container()
        .merge({ replace, push, pop, get pages() { return c.children as UiPage[] }, get page() { return c.pages.last; } })
        .step(() => {
            for (let i = 0; i < c.children.length; i++)
                c.children[i].visible = false;

            if (c.page) {
                c.page.visible = true;
                c.page._ticker.tick();
            }
        });

    return c;
}

export function objUiPage(elements: UiPageElement[], props: UiPageProps) {
    const ticker = new AsshatTicker();
    const c = new TickerContainer(ticker, false).merge({ navigation: true, selected: Undefined<UiPageElement>() }).merge(props);

    const maskedObj = container().show(c);
    const elementsObj = container(...elements).show(maskedObj);

    const scrollBarObj = objScrollBar().show(c);

    const mask = new Graphics().beginFill(0xffffff).drawRect(0, 0, 256, 1).show(maskedObj);

    updateSelection();

    function updateSelection() {
        c.selectionIndex = cyclic(c.selectionIndex, 0, elements.length);
        elements.forEach((x, i) => x.selected = c.selectionIndex === i);
        c.selected = elements[c.selectionIndex];
    }

    function select(dx: number, dy: number) {
        dx = Math.sign(dx) * 16;
        dy = Math.sign(dy) * 16;
        let ax = dx;
        let ay = dy;
        let d = 0;
        let fromBehind = false;
        const dd = Math.abs(dx) + Math.abs(dy);

        // TODO still slightly bizarre values
        const maximumDimension = Math.max(elementsObj.width, elementsObj.height);
        const maximumTravel = Math.max(600, Math.round(maximumDimension * 2.33));
        const halfTravel = Math.max(256, maximumDimension);

        while (d < maximumTravel) {
            const offset = [-ax, -ay];
            for (let i = 0; i < elements.length; i++) {
                if (i === c.selectionIndex)
                    continue;
                if (!c.selected || elements[i].collides(c.selected, offset)) {
                    c.selectionIndex = i;
                    return;
                }
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
            if (Input.justWentDown('SelectUp'))
                select(0, -1);
            if (Input.justWentDown('SelectDown'))
                select(0, 1);
            if (Input.justWentDown('SelectLeft'))
                select(-1, 0);
            if (Input.justWentDown('SelectRight'))
                select(1, 0);
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
                    
                    if (bounds.y > c.maxHeight * 0.67 && c.maxHeight + elementsObj.pivot.y < elementsObj.height) {
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