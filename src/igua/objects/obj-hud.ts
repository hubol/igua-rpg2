import { Container } from "pixi.js";
import { objText } from "../../assets/fonts";
import { container } from "../../lib/pixi/container";
import { objHealthBar } from "./obj-health-bar";
import { RpgPlayer } from "../rpg/rpg-player";

function objHud() {
    const text = objText.Large('You are a gay person', { tint: 0x00ff00 }).at(3, 24);
    const healthBarObj = objHealthBar(RpgPlayer.Model.maxHealth, 7, RpgPlayer.Model.health, RpgPlayer.Model.maxHealth).at(3, 3);

    return container(text, healthBarObj)
        .merge({ healthBarObj })
        .step(() => {
            healthBarObj.width = RpgPlayer.Model.maxHealth;
        });
}

export let hudObj: ReturnType<typeof objHud>;

export function createHudObj(hudLayer: Container) {
    hudObj = objHud().show(hudLayer);
}