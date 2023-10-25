import "../../src/lib/extensions";
import { Container } from "pixi.js";
import { AsshatTicker } from "../../src/lib/game-engine/asshat-ticker";
import { Assert } from "../lib/assert";
import { createDisplayObject } from "../lib/create-display-object";

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

export function canAddStepFnAfterAddedToContainer() {
    let displayObjectSteps = 0;

    const c = new Container();
    
    const d = createDisplayObject()

    c.addChild(d);

    d.step(() => {
        displayObjectSteps += 1;
    });

    const ticker = new AsshatTicker();
    c.withTicker(ticker);

    ticker.update();

    Assert(displayObjectSteps).toStrictlyBe(1);
}

export function canAddMultipleStepFnsToOneDisplayObject() {
    let displayObjectSteps1 = 0;
    let displayObjectSteps2 = 0;

    const ticker = new AsshatTicker();
    const c = new Container().withTicker(ticker);
    const d = createDisplayObject()
        .step(() => {
            displayObjectSteps1 += 1;
        })
        .step(() => {
            displayObjectSteps2 += 1;
        });

    c.addChild(d);

    Assert(displayObjectSteps1).toStrictlyBe(0);
    Assert(displayObjectSteps2).toStrictlyBe(0);

    ticker.update();

    Assert(displayObjectSteps1).toStrictlyBe(1);
    Assert(displayObjectSteps2).toStrictlyBe(1);

    d.destroy();

    Assert((ticker as any)._callbacks.length).toStrictlyBe(2);

    ticker.update();

    Assert((ticker as any)._callbacks.length).toStrictlyBe(0);
}

export function childClimbsHierarchyToGetTicker() {
    let displayObjectSteps = 0;

    const c1 = new Container();
    const c2 = new Container();
    const c3 = new Container();
    const c4 = new Container();

    const d = createDisplayObject()
        .step(() => {
            displayObjectSteps += 1;
        });

    c1.addChild(c2);
    c2.addChild(c3);
    c3.addChild(c4);
    c4.addChild(d);

    const ticker = new AsshatTicker();
    c1.withTicker(ticker);

    ticker.update();

    Assert(displayObjectSteps).toStrictlyBe(1);
}

export function multipleChildrenUseStepFn() {
    let displayObjectSteps = 0;

    const c1 = new Container();
    const c2 = new Container();

    const d1 = createDisplayObject()
        .step(() => {
            displayObjectSteps += 1;
        });

    const d2 = createDisplayObject()
        .step(() => {
            displayObjectSteps += 1;
        });

    c1.addChild(d1, c2);
    c2.addChild(d2);

    const ticker = new AsshatTicker();
    c1.withTicker(ticker);

    const d3 = createDisplayObject()
        .step(() => {
            displayObjectSteps += 1;
        });

    c2.addChild(d3);

    ticker.update();

    Assert(displayObjectSteps).toStrictlyBe(3);
}
