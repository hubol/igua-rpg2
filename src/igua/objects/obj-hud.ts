import { Container } from "pixi.js";
import { objText } from "../../assets/fonts";
import { container } from "../../lib/pixi/container";

function objHud() {
    const text = objText.Large('You are a gay person', { tint: 0x00ff00 }).at(1, 1);

    return container(text);
}

export let hudObj: ReturnType<typeof objHud>;

export function createHudObj(hudLayer: Container) {
    hudObj = objHud().show(hudLayer);
}