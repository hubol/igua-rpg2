import { Container } from "pixi.js";
import { container } from "../../../lib/pixi/container";
import { cyclic } from "../../../lib/math/number";
import { EscapeTickerAndExecute } from "../../../lib/game-engine/asshat-ticker";
import { Input, forceGameLoop } from "../../globals";
import { Undefined } from "../../../lib/types/undefined";

export type UiPageState = { selectionIndex: number };
export type UiPageElement = Container & { selected: boolean };

export function objUiPageRouter() {
    function goto(page: UiPage) {
        c.removeAllChildren();
        c.addChild(page);
        c.page = page;
    }

    function gotoEscape(page: UiPage) {
        throw new EscapeTickerAndExecute(() => {
            goto(page);
            forceGameLoop();
        });
    }

    const c = container()
        .merge({ goto, gotoEscape, page: Undefined<UiPage>() });

    return c;
}

export function objUiPage(elements: UiPageElement[], state: UiPageState) {
    const c = container(...elements).merge({ navigation: true, state });
    updateSelection();

    function updateSelection() {
        state.selectionIndex = cyclic(state.selectionIndex, 0, elements.length);
        elements.forEach((x, i) => x.selected = state.selectionIndex === i)
    }

    function select(dx: number, dy: number) {
        const selected = elements[state.selectionIndex];
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
                if (i === state.selectionIndex)
                    continue;
                if (elements[i].collides(selected, offset)) {
                    state.selectionIndex = i;
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