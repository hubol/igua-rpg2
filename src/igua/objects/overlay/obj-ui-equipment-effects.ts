import { Graphics } from "pixi.js";
import { objText } from "../../../assets/fonts";
import { Logger } from "../../../lib/game-engine/logger";
import { Coro } from "../../../lib/game-engine/routines/coro";
import { onMutate } from "../../../lib/game-engine/routines/on-mutate";
import { container } from "../../../lib/pixi/container";
import { DeepKeyOf } from "../../../lib/types/deep-keyof";
import { RpgCharacterEquipment } from "../../rpg/rpg-character-equipment";
import { RpgEquipmentEffects } from "../../rpg/rpg-equipment-effects";
import { RpgEquipmentLoadout } from "../../rpg/rpg-equipment-loadout";
import { RpgProgress } from "../../rpg/rpg-progress";
import { StepOrder } from "../step-order";

export function objUiEquipmentEffects(
    loadout: Readonly<RpgEquipmentLoadout.Model>,
) {
    const controls = {
        focusEffectSource: null as RpgEquipmentLoadout.Item,
    };
    const effects = RpgEquipmentEffects.create();
    const focusedEffects = RpgEquipmentEffects.create();

    return objUiEquipmentEffectsBase()
        .merge({ controls })
        .coro(function* (self) {
            while (true) {
                RpgEquipmentLoadout.getEffects(loadout, effects);
                const infos = getEffectInformations(effects).filter(value => value !== null) as EffectInformation[];
                const uiEquipmentEffectObjs = self.createUiEquipmentEffectObjs(infos, effects);

                if (controls.focusEffectSource) {
                    RpgEquipmentLoadout.getEffects(
                        RpgProgress.character.equipment.loadout.map(name =>
                            name === controls.focusEffectSource ? controls.focusEffectSource : null
                        ) as RpgEquipmentLoadout.Model,
                        focusedEffects,
                    );
                    for (const obj of uiEquipmentEffectObjs) {
                        obj.isFocused = obj.info.getValue(focusedEffects) !== 0;
                    }
                }

                yield* Coro.race([
                    onMutate(controls),
                    onMutate(loadout),
                ]);
            }
        }, StepOrder.BeforeCamera);
}

export function objUiEquipmentEffectsComparedTo(
    equipment: RpgCharacterEquipment,
    previousEquipment: RpgCharacterEquipment,
) {
    return objUiEquipmentEffectsBase()
        .coro(function* (self) {
            while (true) {
                const previousInfos = getEffectInformations(previousEquipment.loadoutEffects);
                const infos = getEffectInformations(equipment.loadoutEffects);

                const uiEquipmentEffectObjs = self.createUiEquipmentEffectObjs(
                    aggregateEffectInformations(previousInfos, infos),
                    equipment.loadoutEffects,
                );

                for (const obj of uiEquipmentEffectObjs) {
                    obj.previous = obj.info.getValue(previousEquipment.loadoutEffects);
                    obj.isFocused = obj.info.getValue(equipment.loadoutEffects) !== obj.previous;
                }

                yield* Coro.race([
                    onMutate(previousEquipment.loadoutEffects),
                    onMutate(equipment.loadoutEffects),
                ]);
            }
        }, StepOrder.BeforeCamera);
}

function aggregateEffectInformations(previousInfos: NullishEffectInformation[], infos: NullishEffectInformation[]) {
    if (previousInfos.length !== infos.length) {
        Logger.logAssertError(
            "aggregateEffectInformations",
            new Error("previousInfos and infos do not have same length"),
            { previousInfos, infos },
        );
    }

    return [
        ...previousInfos.filter(x => x !== null),
        ...infos.filter((info, index) => info && !previousInfos[index]),
    ] as EffectInformation[];
}

function objUiEquipmentEffectsBase() {
    const obj = container();
    function createUiEquipmentEffectObjs(infos: EffectInformation[], effects: RpgEquipmentEffects.Model) {
        obj.removeAllChildren();

        const uiEquipmentEffectObjs = infos.map((
            info,
            index,
        ) => objUiEquipmentEffect(info, info.getValue(effects)).at(0, index * 14));

        if (!uiEquipmentEffectObjs.length) {
            return uiEquipmentEffectObjs;
        }

        obj.addChild(
            ...uiEquipmentEffectObjs,
        );

        obj.pivot.x = Math.round(obj.width / 2);

        obj.addChildAt(
            new Graphics().beginFill(0x808080).drawRect(-3, -3, obj.width + 6, obj.height + 6),
            0,
        );

        return uiEquipmentEffectObjs;
    }

    return obj.merge({ createUiEquipmentEffectObjs });
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

    const leftText = value === 0 ? "-" : info.name;
    const rightText = value === 0 ? "" : (prefix + delta);

    const leftTextObj = objText.Medium(leftText);
    const rightTextObj = objText.MediumBoldIrregular(rightText).at(leftTextObj.width + 2, 0);

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

type NullishEffectInformation = ReturnType<typeof getEffectInformations>[number];
type EffectInformation = NonNullable<NullishEffectInformation>;

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
                `results.push(effects.${key} === 0 ? null : effectInformations["${key}"]);`
            ).join("\n")
        }

return results;`,
    );

    type Eff = Readonly<ReturnType<typeof eff>[string]>;

    return (effects: RpgEquipmentEffects.Model): Array<Eff | null> => fn(effects, effectInformations);
})();
