import { Container, Graphics } from "pixi.js";
import { objText } from "../../../assets/fonts";
import { container } from "../../../lib/pixi/container";
import { objHealthBar } from "./obj-health-bar";
import { RpgPlayer } from "../../rpg/rpg-player";
import { objStatusBar } from "./obj-status-bar";
import { playerObj } from "../obj-player";
import { RpgProgress } from "../../rpg/rpg-progress";
import { renderer } from "../../current-pixi-renderer";
import { Cutscene } from "../../globals";
import { factor, interp } from "../../../lib/game-engine/routines/interp";

const Consts = {
    StatusTextTint: 0x00ff00,
};

export function objHud() {
    const healthBarObj = objHealthBar(
        RpgPlayer.status.healthMax,
        9,
        RpgPlayer.status.health,
        RpgPlayer.status.healthMax,
    );
    const valuablesInfoObj = objValuablesInfo();
    const poisonBuildUpObj = objPoisonBuildUp();
    const poisonLevelObj = objPoisonLevel();

    const statusObjs = [valuablesInfoObj, poisonLevelObj, poisonBuildUpObj];

    return container(objCutsceneIndicator().at(-3, -3), healthBarObj, ...statusObjs)
        .at(3, 3)
        .merge({ healthBarObj, effectiveHeight: 0 })
        .step(self => {
            healthBarObj.width = RpgPlayer.status.healthMax;
            let y = 7;
            let lastVisibleObj: Container = healthBarObj;
            for (const statusObj of statusObjs) {
                if (!statusObj.visible) {
                    continue;
                }
                lastVisibleObj = statusObj;
                y += 3;
                statusObj.y = y;
                y += statusObj.height + (statusObj["advance"] ?? 0);
            }

            if (!playerObj) {
                self.visible = false;
            }
            else {
                self.visible = !playerObj.destroyed;
            }
            self.effectiveHeight = self.visible ? self.y + lastVisibleObj.y + lastVisibleObj.height : 0;
        });
}

export type ObjHud = ReturnType<typeof objHud>;

function objCutsceneIndicator() {
    return new Graphics().beginFill(0x101010).drawRect(0, renderer.height - 12, renderer.width, 12).coro(
        function* (self) {
            while (true) {
                self.scale.x = 0;
                self.pivot.x = 0;
                yield () => Cutscene.isPlaying;
                yield interp(self.scale, "x").factor(factor.sine).to(1).over(250);
                yield () => !Cutscene.isPlaying;
                yield interp(self.pivot, "x").steps(16).to(-renderer.width).over(300);
            }
        },
    );
}

function objValuablesInfo() {
    return objText.MediumIrregular("You have 0 valuables", { tint: Consts.StatusTextTint })
        .step(text => {
            text.seed = RpgProgress.character.inventory.valuables + 64;
            text.text = RpgProgress.character.inventory.valuables === 1
                ? "You have 1 valuable"
                : `You have ${RpgProgress.character.inventory.valuables} valuables`;
        });
}

function objPoisonLevel() {
    return objText.MediumIrregular("You are poisoned", { tint: Consts.StatusTextTint })
        .merge({ advance: -3 })
        .step(text => {
            const level = RpgPlayer.status.poison.level;
            text.visible = level > 0;
            if (text.visible) {
                text.text = level > 1 ? ("You are poisoned x" + level) : "You are poisoned";
            }
        });
}

function objPoisonBuildUp() {
    let value = RpgPlayer.status.poison.value;
    const text = objText.MediumIrregular("Poison is building...", { tint: Consts.StatusTextTint });
    const bar = objStatusBar({
        height: 1,
        width: 85,
        value,
        maxValue: RpgPlayer.status.poison.max,
        tintBack: 0x003000,
        tintFront: 0x008000,
        increases: [{ tintBar: 0x00ff00 }],
        decreases: [{ tintBar: 0x003000 }],
    }).at(0, 8);

    let visibleSteps = 0;

    return container(bar, text)
        .step(self => {
            const nextValue = RpgPlayer.status.poison.value;
            if (nextValue > value) {
                bar.increase(nextValue, nextValue - value, 0);
            }
            else if (nextValue < value) {
                bar.decrease(nextValue, nextValue - value, 0);
            }
            value = nextValue;
            const maxVisibleSteps = RpgPlayer.status.poison.level === 0 ? 1 : 2;
            visibleSteps = value > 0 ? maxVisibleSteps : (visibleSteps - 1);
            self.visible = visibleSteps > 0;
        });
}
