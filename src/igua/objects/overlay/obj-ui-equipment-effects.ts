import { Graphics } from "pixi.js";
import { objText } from "../../../assets/fonts";
import { container } from "../../../lib/pixi/container";
import { DeepKeyOf } from "../../../lib/types/deep-keyof";
import { RpgEquipmentEffects } from "../../rpg/rpg-equipment-effects";
import { RpgEquipmentLoadout } from "../../rpg/rpg-equipment-loadout";
import { RpgProgress } from "../../rpg/rpg-progress";
import { StepOrder } from "../step-order";

export function objUiEquipmentEffects(
    loadout: RpgEquipmentLoadout.Model,
    // TODO i think second and third args should be exclusive
    getSelectedEquipmentName: () => RpgEquipmentLoadout.Model[number],
    comparisonLoadout: RpgEquipmentLoadout.Model | null = null,
) {
    const effects = RpgEquipmentEffects.create();
    const comparisonEffects = RpgEquipmentEffects.create();

    return container()
        .coro(function* (self) {
            while (true) {
                self.removeAllChildren();
                RpgEquipmentLoadout.getEffects(loadout, effects);

                const uiEquipmentEffectObjs = getEffectInformations(effects).map((
                    info,
                    index,
                ) => objUiEquipmentEffect(info, info.getValue(effects)).at(0, index * 14));

                self.addChild(
                    ...uiEquipmentEffectObjs,
                );

                self.pivot.x = Math.round(self.width / 2);

                self.addChildAt(
                    new Graphics().beginFill(0x808080).drawRect(-3, -3, self.width + 6, self.height + 6),
                    0,
                );

                if (comparisonLoadout) {
                    RpgEquipmentLoadout.getEffects(comparisonLoadout, comparisonEffects);

                    for (const obj of uiEquipmentEffectObjs) {
                        obj.previous = obj.info.getValue(comparisonEffects);
                        obj.isFocused = obj.info.getValue(effects) !== obj.previous;
                    }
                }
                else {
                    const selectedEffects = RpgEquipmentEffects.create();

                    container().coro(function* () {
                        while (true) {
                            const selectedEquipmentName = getSelectedEquipmentName();
                            RpgEquipmentLoadout.getEffects(
                                RpgProgress.character.equipment.map(name =>
                                    name === selectedEquipmentName ? selectedEquipmentName : null
                                ) as RpgEquipmentLoadout.Model,
                                selectedEffects,
                            );
                            for (const obj of uiEquipmentEffectObjs) {
                                obj.isFocused = obj.info.getValue(selectedEffects) !== 0;
                            }
                            yield () => getSelectedEquipmentName() !== selectedEquipmentName;
                        }
                    }, StepOrder.BeforeCamera)
                        .show(self);
                }

                const previous = JSON.stringify(loadout);
                const previousComparedTo = JSON.stringify(comparisonLoadout);
                yield () =>
                    JSON.stringify(loadout) !== previous || JSON.stringify(comparisonLoadout) !== previousComparedTo;
            }
        }, StepOrder.BeforeCamera);
}

function getEquipmentEffectTint(
    previous: number,
    value: number,
    isFocused: boolean,
    benefit: EffectInformation["benefit"],
) {
    const delta = (value - previous) * (benefit === "beneft_when_positive" ? 1 : -1);

    if (delta === 0) {
        return 0x202020;
    }

    if (isFocused) {
        return delta > 0 ? 0x0000ff : 0xff0000;
    }

    return delta > 0 ? 0x000040 : 0x400000;
}

function objUiEquipmentEffect(
    info: Readonly<EffectInformation>,
    value: number,
) {
    let prefix = "";
    if (value !== 0) {
        prefix = value > 0 ? "+" : "-";
    }

    const delta = info.units === "integer" ? String(value) : (value + "%");

    const leftTextObj = objText.Medium(info.name);
    const rightTextObj = objText.MediumBoldIrregular(prefix + delta).at(leftTextObj.width + 2, 0);

    return container(
        leftTextObj,
        rightTextObj,
    )
        .merge({
            info,
            isFocused: false,
            previous: 0,
        })
        .step(self => {
            const tint = getEquipmentEffectTint(self.previous, value, self.isFocused, info.benefit);
            leftTextObj.tint = tint;
            rightTextObj.tint = tint;
        }, StepOrder.BeforeCamera);
}

type EffectInformation = ReturnType<typeof getEffectInformations>[number];

const getEffectInformations = (function () {
    function eff(
        path: DeepKeyOf.Paths<RpgEquipmentEffects.Model>,
        name: string,
        units: "integer" | "percent",
        benefit: "beneft_when_positive" | "benefit_when_negative",
    ) {
        const getValue = new Function(
            "effects",
            `// Generated by src/igua/objects/overlay/obj-ui-equipment-effects.ts
            // getEffectInformations -> eff -> ${path}
            return effects.${path};`,
        ) as (effects: RpgEquipmentEffects.Model) => number;
        return {
            [path]: { name, units, benefit, getValue },
        };
    }

    const effectInformations: Partial<
        Record<DeepKeyOf.Paths<RpgEquipmentEffects.Model>, EffectInformation>
    > = Object.assign(
        {},
        eff("combat.melee.attack.physical", "Melee Phys ATK", "integer", "beneft_when_positive"),
        eff("combat.melee.conditions.poison", "Melee Inflicts Poison", "integer", "beneft_when_positive"),
        eff("combat.melee.clawAttack.physical", "Claw Phys ATK", "integer", "beneft_when_positive"),
        eff("loot.pocket.bonusChance", "Pocket Bonus Chance", "percent", "beneft_when_positive"),
        eff("loot.tiers.nothingRerollCount", "Re-Roll Empty Loot", "integer", "beneft_when_positive"),
        eff("loot.valuables.bonus", "Valuable Bonus", "integer", "beneft_when_positive"),
        eff("motion.jump.bonusAtSpecialSigns", "Special Jump", "integer", "beneft_when_positive"),
    );

    const fn = new Function(
        "effects",
        "effectInformations",
        `// Generated by src/igua/objects/overlay/obj-ui-equipment-effects.ts
// getEffectInformations

const results = [];
${
            Object.keys(effectInformations).map(key =>
                `if (effects.${key} !== 0) {
    results.push(effectInformations["${key}"]);
}`
            ).join("\n")
        }

return results;`,
    );

    type Eff = Readonly<ReturnType<typeof eff>[string]>;

    return (effects: RpgEquipmentEffects.Model): Array<Eff> => fn(effects, effectInformations);
})();
