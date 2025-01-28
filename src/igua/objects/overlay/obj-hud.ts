import { Container, DisplayObject, Graphics, Rectangle, Sprite } from "pixi.js";
import { objText } from "../../../assets/fonts";
import { container } from "../../../lib/pixi/container";
import { objHealthBar } from "./obj-health-bar";
import { RpgPlayer } from "../../rpg/rpg-player";
import { objStatusBar } from "./obj-status-bar";
import { playerObj } from "../obj-player";
import { RpgProgress, RpgProgressExperience } from "../../rpg/rpg-progress";
import { renderer } from "../../current-pixi-renderer";
import { Cutscene } from "../../globals";
import { factor, interp, interpr, interpvr } from "../../../lib/game-engine/routines/interp";
import { DataPocketItem } from "../../data/data-pocket-item";
import { CtxInteract } from "../../mixins/mxn-interact";
import { mxnHasHead } from "../../mixins/mxn-has-head";
import { Tx } from "../../../assets/textures";
import { Null } from "../../../lib/types/null";
import { approachLinear } from "../../../lib/math/number";
import { sleep } from "../../../lib/game-engine/routines/sleep";
import { Integer, RgbInt } from "../../../lib/math/number-alias-types";
import { mxnBoilMirrorRotate } from "../../mixins/mxn-boil-mirror-rotate";

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

    const statusObjs = [valuablesInfoObj, objPocketInfo(), poisonLevelObj, poisonBuildUpObj];

    return container(
        objCutsceneLetterbox(),
        container(healthBarObj, ...statusObjs).at(3, 3),
        objInteractIndicator(),
        objExperienceIndicator(),
    )
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

const r = new Rectangle();

function objInteractIndicator() {
    let previousInteractObj = Null<DisplayObject>();
    let updatedOffsetY = 0;

    return container(
        container(
            Sprite.from(Tx.Ui.InteractionIndicator).tinted(0x000000).at(1, 2),
            Sprite.from(Tx.Ui.InteractionIndicator),
        )
            .pivoted(12, 23)
            .step(
                self => {
                    const interactObj = playerObj?.hasControl ? CtxInteract.value.highestScoreInteractObj : null;

                    if (interactObj !== previousInteractObj) {
                        updatedOffsetY = 4;
                        previousInteractObj = interactObj;
                    }

                    if (!interactObj) {
                        self.visible = false;
                        return;
                    }

                    updatedOffsetY = approachLinear(updatedOffsetY, 0, 0.75);

                    self.visible = true;
                    (interactObj.interact.hotspotObj
                        ?? (interactObj.is(mxnHasHead) ? interactObj.mxnHead.obj : interactObj)).getBounds(false, r);
                    self.at(r.x + r.width / 2, r.y + updatedOffsetY).vround();
                },
            ),
    );
}

type ExperienceIndicatorConfig = [
    experienceKey: RpgProgressExperience,
    textureIndex: Integer,
    bgTint: RgbInt,
];

const experienceIndicatorConfigs: Array<ExperienceIndicatorConfig> = [
    ["gambling", 4, 0xEABB00],
    ["social", 3, 0x19A859],
    ["pocket", 2, 0xEABB00],
];

function objExperienceIndicator() {
    const obj = container<ObjExperienceIncrement>().at(renderer.width - 4, renderer.height - 4);

    for (const [experience, textureIndex, bgTint] of experienceIndicatorConfigs) {
        obj.coro(function* () {
            let previous = RpgProgress.character.experience[experience];

            while (true) {
                yield () =>
                    !Boolean(Cutscene.current) && Cutscene.sinceCutsceneStepsCount > 15
                    && previous !== RpgProgress.character.experience[experience];
                // TODO update existing increment indicator if possible!
                const next = RpgProgress.character.experience[experience];
                const diff = next - previous;
                const bounds = obj.getBounds(false, r);
                objExperienceIncrement(experience, textureIndex, bgTint, previous, diff, next).show(obj).at(
                    0,
                    -bounds.height + Math.sign(bounds.height) * -4,
                );
                previous = next;
            }
        });
    }

    return obj;
}

const txsExperienceIncrement = Tx.Ui.Experience.Increment.split({ width: 44 });

function objExperienceIncrement(
    experience: RpgProgressExperience,
    index: number,
    bgTint: RgbInt,
    start: number,
    delta: number,
    target: number,
) {
    const state = { value: start };
    const totalTextObj = objText.Large("", { tint: 0x000000 }).anchored(1, 0.5).at(-46, -15);
    const deltaTextObj = objText.SmallDigits("", { tint: 0x000000 }).anchored(1, 0.5).at(-68, -6);

    const bgObj = Sprite.from(Tx.Ui.Experience.IncrementBg).mixin(mxnBoilMirrorRotate).tinted(bgTint).anchored(0.5, 0.5)
        .at(
            0,
            -16,
        );

    return container(
        bgObj,
        Sprite.from(txsExperienceIncrement[index]).anchored(1, 1),
        totalTextObj,
        deltaTextObj,
    )
        .merge({ experience, target, delta })
        .step((self) => {
            totalTextObj.text = `${state.value} XP`;
            deltaTextObj.text = `+${self.delta}`;
            bgObj.x = Math.round(
                Tx.Ui.Experience.IncrementBg.width / 2 - Math.max(totalTextObj.width + 50, deltaTextObj.width + 72),
            );
        })
        .coro(function* (self) {
            const width = self.width;
            self.pivot.x = -width;
            yield interpvr(self.pivot).factor(factor.sine).to(0, 0).over(500);
            while (self.target !== state.value) {
                yield interpr(state, "value").to(self.target).over(500);
                yield sleep(1500);
            }
            yield interpvr(self.pivot).factor(factor.sine).to(-width, 0).over(500);
            self.destroy();
        });
}

type ObjExperienceIncrement = ReturnType<typeof objExperienceIncrement>;

export type ObjHud = ReturnType<typeof objHud>;

function objCutsceneLetterbox() {
    return new Graphics().beginFill(0x101010).drawRect(0, renderer.height - 12, renderer.width, 12).coro(
        function* (self) {
            while (true) {
                self.scale.x = 0;
                self.pivot.x = 0;
                yield () => Boolean(Cutscene.current) && Cutscene.current!.attributes.letterbox;
                yield interp(self.scale, "x").factor(factor.sine).to(1).over(250);
                yield () => !Cutscene.current?.attributes?.letterbox;
                yield interp(self.pivot, "x").steps(16).to(-renderer.width).over(300);
            }
        },
    );
}

function objPocketInfo() {
    return objText.MediumIrregular("", { tint: Consts.StatusTextTint }).invisible()
        .step(self => {
            const slot = RpgProgress.character.inventory.pocket.slots[0];
            // TODO multiple slots lol
            self.visible = slot.count > 0;
            if (self.visible) {
                self.text = "Your pocket has " + DataPocketItem[slot.item!].name + "x" + slot.count;
                self.seed = slot.count + 80_000;
            }
        });
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
