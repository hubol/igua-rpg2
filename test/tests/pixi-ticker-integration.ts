import "../../src/lib/extensions";
import { Container, DisplayObject } from "pixi.js";
import { AsshatTicker } from "../../src/lib/game-engine/asshat-ticker";
import { Assert } from "../lib/assert";

function createDisplayObject(): DisplayObject {
    // @ts-ignore
    return new DisplayObject();
}

export function childInheritsTicker() {
    const ticker = new AsshatTicker();
    const c = new Container().withTicker(ticker);
    const d = createDisplayObject();
    c.addChild(d);
    Assert(c.ticker).toStrictlyBe(ticker);
    Assert(d.ticker).toStrictlyBe(c.ticker);
    Assert(d.ticker).toBeTruthy();
}

export function childContainerKeepsItsTicker() {
    const tickerParent = new AsshatTicker();
    const tickerChild = new AsshatTicker();

    const cParent = new Container().withTicker(tickerParent);
    const cChild = new Container().withTicker(tickerChild);
    const d = createDisplayObject();

    cParent.addChild(cChild);
    cChild.addChild(d);

    Assert(cParent.ticker).toStrictlyBe(tickerParent);
    Assert(cChild.ticker).toStrictlyBe(tickerChild);
    Assert(d.ticker).toStrictlyBe(tickerChild);
}