import { Container } from "pixi.js";
import { objText } from "../../assets/fonts";
import { container } from "../../lib/pixi/container";
import { objHealthBar } from "./obj-health-bar";
import { RpgPlayer } from "../rpg/rpg-player";
import { objStatusBar } from "./obj-status-bar";

const Consts = {
    StatusTextTint: 0x00ff00,
}

function objHud() {
    const healthBarObj = objHealthBar(RpgPlayer.Model.maxHealth, 7, RpgPlayer.Model.health, RpgPlayer.Model.maxHealth).at(3, 3);
    const poisonBuildUpObj = objPoisonBuildUp().at(3, 13);

    return container(healthBarObj, poisonBuildUpObj)
        .merge({ healthBarObj })
        .step(() => {
            healthBarObj.width = RpgPlayer.Model.maxHealth;
        });
}

function objPoisonBuildUp() {
    let value = RpgPlayer.Model.poison.value;
    const text = objText.Large('Poison is building...', { tint: Consts.StatusTextTint });
    const bar = objStatusBar({
        height: 1,
        width: 85,
        value,
        maxValue: RpgPlayer.Model.poison.max,
        tintBack: 0x003000,
        tintFront: 0x008000,
        increases: [ { tintBar: 0x00ff00 } ],
        decreases: [ { tintBar: 0x003000 } ],
    }).at(0, 8);

    return container(bar, text)
        .step(self => {
            const nextValue = RpgPlayer.Model.poison.value
            if (nextValue > value)
                bar.increase(nextValue, nextValue - value, 0);
            else if (nextValue < value)
                bar.decrease(nextValue, nextValue - value, 0);
            value = nextValue;
            self.visible = value > 0;
        })
}

export let hudObj: ReturnType<typeof objHud>;

export function createHudObj(hudLayer: Container) {
    hudObj = objHud().show(hudLayer);
}