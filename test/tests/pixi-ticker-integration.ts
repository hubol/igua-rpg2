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

export function stepFnIsNotCalledAfterObjectDestroyed() {
    const ticker = new AsshatTicker();

    let displayObjectSteps = 0;

    const c = new Container().withTicker(ticker);
    const d = createDisplayObject()
        .step(() => {
            displayObjectSteps += 1;
        });

    c.addChild(d);

    Assert(displayObjectSteps).toStrictlyBe(0);

    ticker.update();

    Assert(displayObjectSteps).toStrictlyBe(1);

    ticker.update();

    Assert(displayObjectSteps).toStrictlyBe(2);

    d.destroy();

    Assert(displayObjectSteps).toStrictlyBe(2);
}

export function displayObjectCanBeAddedToContainerWithoutTicker() {
    let displayObjectSteps = 0;

    const c = new Container();
    const d = createDisplayObject()
        .step(() => {
            displayObjectSteps += 1;
        });

    c.addChild(d);

    const ticker = new AsshatTicker();
    c.withTicker(ticker);

    Assert(displayObjectSteps).toStrictlyBe(0);

    ticker.update();

    Assert(displayObjectSteps).toStrictlyBe(1);
}
