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
    const x = 3;
    const healthBarObj = objHealthBar(RpgPlayer.Model.maxHealth, 7, RpgPlayer.Model.health, RpgPlayer.Model.maxHealth).at(x, 3);
    const poisonBuildUpObj = objPoisonBuildUp().at(x, 0);
    const poisonLevelObj = objPoisonLevel().at(x, 0);

    const statusObjs = [ poisonLevelObj, poisonBuildUpObj ];

    return container(healthBarObj, ...statusObjs)
        .merge({ healthBarObj })
        .step(() => {
            healthBarObj.width = RpgPlayer.Model.maxHealth;
            let y = 13;
            for (const statusObj of statusObjs) {
                if (!statusObj.visible)
                    continue;
                statusObj.y = y;
                y += statusObj.height;
            }
        });
}

function objPoisonLevel() {
    return objText.Large('You are poisoned', { tint: Consts.StatusTextTint })
        .step(text => {
            const level = RpgPlayer.Model.poison.level;
            text.visible = level > 0;
            if (text.visible) {
                text.text = level > 1 ? ('You are poisoned x' + level) : 'You are poisoned';
            }
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

    let visibleSteps = 0;

    return container(bar, text)
        .step(self => {
            const nextValue = RpgPlayer.Model.poison.value
            if (nextValue > value)
                bar.increase(nextValue, nextValue - value, 0);
            else if (nextValue < value)
                bar.decrease(nextValue, nextValue - value, 0);
            value = nextValue;
            // TODO hack, kinda looks stupid when first poison level builds up
            visibleSteps = value > 0 ? 2 : (visibleSteps - 1);
            self.visible = visibleSteps > 0;
        })
}

export let hudObj: ReturnType<typeof objHud>;

export function createHudObj(hudLayer: Container) {
    hudObj = objHud().show(hudLayer);
}