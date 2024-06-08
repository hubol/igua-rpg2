import { Container } from "pixi.js";
import { objText } from "../../assets/fonts";
import { container } from "../../lib/pixi/container";
import { objHealthBar } from "./obj-health-bar";

function objHud() {
    const text = objText.Large('You are a gay person', { tint: 0x00ff00 }).at(3, 24);
    // TODO width, values should come from...?
    const healthBarObj = objHealthBar(60, 7, 60, 60).at(3, 3);

    return container(text, healthBarObj)
        .merge({ healthBarObj })
        .step(() => {
            // TODO resize healthBar to match max health in global state
        });
}

export let hudObj: ReturnType<typeof objHud>;

export function createHudObj(hudLayer: Container) {
    hudObj = objHud().show(hudLayer);
}