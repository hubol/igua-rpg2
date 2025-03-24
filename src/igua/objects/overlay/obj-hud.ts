import { Container, DisplayObject, Graphics, Rectangle, Sprite } from "pixi.js";
import { objText } from "../../../assets/fonts";
import { Tx } from "../../../assets/textures";
import { Coro } from "../../../lib/game-engine/routines/coro";
import { holdf } from "../../../lib/game-engine/routines/hold";
import { factor, interp } from "../../../lib/game-engine/routines/interp";
import { sleepf } from "../../../lib/game-engine/routines/sleep";
import { approachLinear } from "../../../lib/math/number";
import { RgbInt } from "../../../lib/math/number-alias-types";
import { container } from "../../../lib/pixi/container";
import { Null } from "../../../lib/types/null";
import { renderer } from "../../current-pixi-renderer";
import { DataPocketItems } from "../../data/data-pocket-items";
import { Cutscene } from "../../globals";
import { mxnHasHead } from "../../mixins/mxn-has-head";
import { CtxInteract } from "../../mixins/mxn-interact";
import { RpgPlayer } from "../../rpg/rpg-player";
import { RpgProgress, RpgProgressExperience } from "../../rpg/rpg-progress";
import { playerObj } from "../obj-player";
import { objHealthBar } from "./obj-health-bar";
import { objStatusBar } from "./obj-status-bar";
import { objUiSubdividedBar } from "./obj-ui-subdivided-bar";

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

    const statusObjs = [valuablesInfoObj, objPocketInfo(), poisonLevelObj, poisonBuildUpObj, objHeliumBuildUp()];

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

interface ExperienceIndicatorConfig {
    experienceKey: RpgProgressExperience;
    tint: RgbInt;
}

const experienceIndicatorConfigs: Array<ExperienceIndicatorConfig> = [
    {
        experienceKey: "combat",
        tint: 0xFF401E,
    },
    {
        experienceKey: "computer",
        tint: 0xEABB00,
    },
    {
        experienceKey: "gambling",
        tint: 0x19A859,
    },
    {
        experienceKey: "pocket",
        tint: 0x3775E8,
    },
    {
        experienceKey: "social",
        tint: 0xA074E8,
    },
];

function objExperienceIndicator() {
    const weights = experienceIndicatorConfigs.map(({ tint }) => ({
        tint,
        value: 0,
    }));

    const deltaObjs = experienceIndicatorConfigs.map(({ experienceKey, tint }) =>
        objExperienceIndicatorDelta(tint)
            .invisible()
            .coro(function* (self) {
                let value = RpgProgress.character.experience[experienceKey];
                while (true) {
                    yield () => RpgProgress.character.experience[experienceKey] != value;
                    self.visible = true;
                    self.state.total = value;
                    let nextValue = RpgProgress.character.experience[experienceKey];
                    yield holdf(() => {
                        self.state.delta = nextValue - value;
                        const latestValue = RpgProgress.character.experience[experienceKey];
                        if (latestValue !== nextValue) {
                            nextValue = latestValue;
                            return false;
                        }

                        return true;
                    }, 120);
                    value = nextValue;
                    self.state.total = value;
                    self.state.delta = 0;
                    yield* Coro.race([
                        () => RpgProgress.character.experience[experienceKey] != value,
                        sleepf(120),
                    ]);
                    self.visible = false;
                }
            })
    );

    function updateWeights() {
        for (let i = 0; i < experienceIndicatorConfigs.length; i++) {
            weights[i].value = RpgProgress.character.experience[experienceIndicatorConfigs[i].experienceKey];
        }
    }

    updateWeights();
    const subdividedBarObj = objUiSubdividedBar({ width: 128, height: 4, tint: 0x404040, weights });
    const obj = container(subdividedBarObj, ...deltaObjs)
        .step(updateWeights)
        .step(() => {
            let maximumX = 128;
            for (let i = deltaObjs.length - 1; i >= 0; i--) {
                const deltaObj = deltaObjs[i];
                const rectangle = subdividedBarObj.renderedWeights[i];
                if (!deltaObj.visible) {
                    continue;
                }
                deltaObj.x = Math.min(rectangle.x + rectangle.width, maximumX) - deltaObj.width;
                maximumX = deltaObj.x;
            }
        })
        .at(renderer.width - 128 - 4, renderer.height - 8);

    return obj;
}

function objExperienceIndicatorDelta(tint: RgbInt) {
    const state = {
        total: 0,
        delta: 0,
    };

    const gfx = new Graphics();
    const totalTextObj = objText.Medium("", { tint: 0xffffff }).pivoted(-1, -1);
    const deltaTextObj = objText.SmallDigits("", { tint }).pivoted(-1, -2);

    return container(gfx, totalTextObj, deltaTextObj)
        .merge({ state })
        .step(() => {
            totalTextObj.text = "" + state.total;
            deltaTextObj.visible = state.delta > 0;
            if (deltaTextObj.visible) {
                deltaTextObj.x = totalTextObj.width + 2;
                deltaTextObj.text = "+" + state.delta;
            }

            const { width, height } = totalTextObj;
            gfx.clear()
                .beginFill(tint).drawRect(0, 0, width + 2, height + 2);

            if (deltaTextObj.visible) {
                gfx.beginFill(0xffffff).drawRect(width + 2, 0, deltaTextObj.width + 2, height + 2);
            }
        })
        .pivoted(0, 9);
}

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
                self.text = "Your pocket has " + DataPocketItems[slot.item!].name + "x" + slot.count;
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
            const level = RpgPlayer.status.conditions.poison.level;
            text.visible = level > 0;
            if (text.visible) {
                text.text = level > 1 ? ("You are poisoned x" + level) : "You are poisoned";
            }
        });
}

function objPoisonBuildUp() {
    return objBuildUp({
        message: "Poison is building...",
        conditionsKey: "poison",
    });
}

function objHeliumBuildUp() {
    return objBuildUp({
        message: "Helium is potent...",
        conditionsKey: "helium",
    });
}

interface ObjBuildUpArgs {
    message: string;
    conditionsKey: "poison" | "helium";
    // TODO tint
}

function objBuildUp({ message, conditionsKey }: ObjBuildUpArgs) {
    let value = RpgPlayer.status.conditions[conditionsKey].value;
    const text = objText.MediumIrregular(message, { tint: Consts.StatusTextTint });
    const bar = objStatusBar({
        height: 1,
        width: 85,
        value,
        maxValue: RpgPlayer.status.conditions[conditionsKey].max,
        tintBack: 0x003000,
        tintFront: 0x008000,
        increases: [{ tintBar: 0x00ff00 }],
        decreases: [{ tintBar: 0x003000 }],
    }).at(0, 8);

    let visibleSteps = 0;

    return container(bar, text)
        .step(self => {
            const nextValue = RpgPlayer.status.conditions[conditionsKey].value;
            if (nextValue > value) {
                bar.increase(nextValue, nextValue - value, 0);
            }
            else if (nextValue < value) {
                bar.decrease(nextValue, nextValue - value, 0);
            }
            value = nextValue;
            // I don't remember what I was trying to accomplish with this.
            // const maxVisibleSteps = RpgPlayer.status.conditions.poison.level === 0 ? 1 : 2;
            visibleSteps = value > 0 ? 2 : (visibleSteps - 1);
            self.visible = visibleSteps > 0;
        });
}
