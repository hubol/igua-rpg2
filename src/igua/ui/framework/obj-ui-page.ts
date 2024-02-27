import { Container } from "pixi.js";
import { container } from "../../../lib/pixi/container";
import { cyclic } from "../../../lib/math/number";
import { AsshatTicker } from "../../../lib/game-engine/asshat-ticker";
import { Input, forceGameLoop } from "../../globals";
import { TickerContainer } from "../../../lib/game-engine/ticker-container";

export type UiPageProps = { title?: string; selectionIndex: number };
export type UiPageElement = Container & { selected: boolean };

export function objUiPageRouter() {
    function replace(page: UiPage) {
        c.children.last?.destroy();
        c.addChild(page);
        forceGameLoop();
    }

    function push(page: UiPage) {
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
    const c = new TickerContainer(ticker, false).merge({ navigation: true }).merge(props);
    c.addChild(...elements);

    updateSelection();

    function updateSelection() {
        c.selectionIndex = cyclic(c.selectionIndex, 0, elements.length);
        elements.forEach((x, i) => x.selected = c.selectionIndex === i)
    }

    function select(dx: number, dy: number) {
        const selected = elements[c.selectionIndex];
        dx = Math.sign(dx) * 16;
        dy = Math.sign(dy) * 16;
        let ax = dx;
        let ay = dy;
        let d = 0;
        let fromBehind = false;
        const dd = Math.abs(dx) + Math.abs(dy);
        // TODO bizarre value
        while (d < 600) {
            const offset = [-ax, -ay];
            for (let i = 0; i < elements.length; i++) {
                if (i === c.selectionIndex)
                    continue;
                if (elements[i].collides(selected, offset)) {
                    c.selectionIndex = i;
                    return;
                }
            }
            ax += dx;
            ay += dy;
            d += dd;
            // TODO constants from screen size
            if (!fromBehind && d >= 256) {
                ax = Math.sign(dx) * -256;
                ay = Math.sign(dy) * -256;
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
    });

    return c;
}

export type UiPage = ReturnType<typeof objUiPage>;