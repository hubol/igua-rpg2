import { Container } from "pixi.js";
import { AsshatTicker } from "./asshat-ticker";

interface TickerContainer extends Container {
    readonly __tag: unique symbol;
}

interface TickerContainerConstructor {
    new(ticker: AsshatTicker): TickerContainer;
}

export const TickerContainer: TickerContainerConstructor = function TickerContainer(ticker: AsshatTicker) {
    const derived = new Container();
    (derived as any)._ticker = ticker;
    return derived;
} as any

