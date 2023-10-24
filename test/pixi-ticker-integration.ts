import "../src/lib/extensions";
import { Container, DisplayObject } from "pixi.js";
import { AsshatTicker } from "../src/lib/game-engine/asshat-ticker";

function createDisplayObject(): DisplayObject {
    // @ts-ignore
    return new DisplayObject();
}

export function testPixiTickerIntegration() {
    const ticker = new AsshatTicker();
    const c = new Container()//.withTicker(ticker);
    const d = createDisplayObject();
    c.addChild(d);
    if (d.ticker !== c.ticker)
        console.error('oh no!')
    else
        console.log('yay')
}