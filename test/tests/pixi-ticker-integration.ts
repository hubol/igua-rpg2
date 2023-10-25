import "../../src/lib/extensions";
import { Container, DisplayObject } from "pixi.js";
import { AsshatTicker } from "../../src/lib/game-engine/asshat-ticker";
import { Assert } from "../lib/assert";

function createDisplayObject(): DisplayObject {
    // @ts-ignore
    return new DisplayObject();
}

export function testPixiTickerIntegration() {
    const ticker = new AsshatTicker();
    const c = new Container().withTicker(ticker);
    const d = createDisplayObject();
    c.addChild(d);
    Assert(c.ticker).toStrictlyBe(ticker);
    Assert(d.ticker).toStrictlyBe(c.ticker);
    Assert(d.ticker).toBeTruthy();
}
