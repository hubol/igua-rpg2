import { Graphics } from "pixi.js";
import { objText } from "../../../assets/fonts";
import { Logger } from "../../../lib/game-engine/logger";
import { Coro } from "../../../lib/game-engine/routines/coro";
import { onMutate } from "../../../lib/game-engine/routines/on-mutate";
import { container } from "../../../lib/pixi/container";
import { DeepKeyOf } from "../../../lib/types/deep-keyof";
import { Rpg } from "../../rpg/rpg";
import { RpgCharacterEquipment } from "../../rpg/rpg-character-equipment";
import { RpgEquipmentLoadout } from "../../rpg/rpg-equipment-loadout";
import { RpgPlayerBuffs } from "../../rpg/rpg-player-buffs";
import { StepOrder } from "../step-order";

export function objUiEquipmentBuffs(
    loadout: Readonly<RpgEquipmentLoadout.Model>,
) {
    const controls = {
        focusBuffsSource: null as RpgEquipmentLoadout.Item,
    };
    const buffs = RpgPlayerBuffs.create();
    const focusedBuffs = RpgPlayerBuffs.create();

    return objUiEquipmentBuffsBase()
        .merge({ controls })
        .coro(function* (self) {
            while (true) {
                RpgEquipmentLoadout.getPlayerBuffs(loadout, buffs);
                const infos = getBuffInformations(buffs).filter(value => value !== null) as BuffInformation[];
                const uiEquipmentBuffsObjs = self.createUiEquipmentBuffObjs(infos, buffs);

                if (controls.focusBuffsSource) {
                    RpgEquipmentLoadout.getPlayerBuffs(
                        Rpg.inventory.equipment.loadout.items.map(name =>
                            name === controls.focusBuffsSource ? controls.focusBuffsSource : null
                        ) as RpgEquipmentLoadout.Model,
                        focusedBuffs,
                    );
                    for (const obj of uiEquipmentBuffsObjs) {
                        obj.isFocused = obj.info.getValue(focusedBuffs) !== 0;
                    }
                }

                yield* Coro.race([
                    onMutate(controls),
                    onMutate(loadout),
                ]);
            }
        }, StepOrder.BeforeCamera);
}

export function objUiEquipmentBuffsComparedTo(
    equipment: RpgCharacterEquipment,
    previousEquipment: RpgCharacterEquipment,
) {
    return objUiEquipmentBuffsBase()
        .coro(function* (self) {
            while (true) {
                const previousInfos = getBuffInformations(previousEquipment.loadout.buffs);
                const infos = getBuffInformations(equipment.loadout.buffs);

                const uiEquipmentBuffsObjs = self.createUiEquipmentBuffObjs(
                    aggregateBuffsInformations(previousInfos, infos),
                    equipment.loadout.buffs,
                );

                for (const obj of uiEquipmentBuffsObjs) {
                    obj.previous = obj.info.getValue(previousEquipment.loadout.buffs);
                    obj.isFocused = obj.info.getValue(equipment.loadout.buffs) !== obj.previous;
                }

                yield* Coro.race([
                    onMutate(previousEquipment.loadout.buffs),
                    onMutate(equipment.loadout.buffs),
                ]);
            }
        }, StepOrder.BeforeCamera);
}

function aggregateBuffsInformations(previousInfos: NullishBuffInformation[], infos: NullishBuffInformation[]) {
    if (previousInfos.length !== infos.length) {
        Logger.logAssertError(
            "aggregateBuffsInformations",
            new Error("previousInfos and infos do not have same length"),
            { previousInfos, infos },
        );
    }

    return [
        ...previousInfos.filter(x => x !== null),
        ...infos.filter((info, index) => info && !previousInfos[index]),
    ] as BuffInformation[];
}

function objUiEquipmentBuffsBase() {
    const obj = container();
    function createUiEquipmentBuffObjs(infos: BuffInformation[], buffs: RpgPlayerBuffs.Model) {
        obj.removeAllChildren();

        const uiEquipmentBuffObjs = infos.map((
            info,
            index,
        ) => objUiEquipmentBuff(info, info.getValue(buffs)).at(0, index * 14));

        if (!uiEquipmentBuffObjs.length) {
            return uiEquipmentBuffObjs;
        }

        obj.addChild(
            ...uiEquipmentBuffObjs,
        );

        obj.pivot.x = Math.round(obj.width / 2);

        obj.addChildAt(
            new Graphics().beginFill(0x808080).drawRect(-3, -3, obj.width + 6, obj.height + 6),
            0,
        );

        return uiEquipmentBuffObjs;
    }

    return obj.merge({ createUiEquipmentBuffObjs });
}

function getEquipmentBuffTint(
    previous: number,
    value: number,
    isFocused: boolean,
    benefit: BuffInformation["benefit"],
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

function objUiEquipmentBuff(
    info: Readonly<BuffInformation>,
    value: number,
) {
    let prefix = "";
    if (value !== 0) {
        prefix = value > 0 ? "+" : "";
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
            const tint = getEquipmentBuffTint(self.previous, value, self.isFocused, info.benefit);
            leftTextObj.tint = tint;
            rightTextObj.tint = tint;
        }, StepOrder.BeforeCamera);
}

type NullishBuffInformation = ReturnType<typeof getBuffInformations>[number];
type BuffInformation = NonNullable<NullishBuffInformation>;

const getBuffInformations = (function () {
    function buff(
        path: DeepKeyOf.Paths<RpgPlayerBuffs.Model>,
        name: string,
        units: "integer" | "percent",
        benefit: "beneft_when_positive" | "benefit_when_negative",
    ) {
        const getValue = new Function(
            "buffs",
            `// Generated by src/igua/objects/overlay/obj-ui-equipment-buffs.ts
            // getBuffInformations -> buff -> ${path}
            return buffs.${path};`,
        ) as (buffs: RpgPlayerBuffs.Model) => number;
        return {
            [path]: { name, units, benefit, getValue },
        };
    }

    const buffInformations: Partial<
        Record<DeepKeyOf.Paths<RpgPlayerBuffs.Model>, BuffInformation>
    > = Object.assign(
        {},
        buff("attributes.health", "Health", "integer", "beneft_when_positive"),
        buff("attributes.intelligence", "Intelligence", "integer", "beneft_when_positive"),
        buff("attributes.strength", "Strength", "integer", "beneft_when_positive"),
        buff("combat.melee.faceAttack.physical", "Face Phys ATK", "integer", "beneft_when_positive"),
        buff("combat.melee.clawAttack.physical", "Claw Phys ATK", "integer", "beneft_when_positive"),
        buff(
            "combat.melee.conditions.poison.value",
            "Melee ATK Poison (Buildup)",
            "integer",
            "beneft_when_positive",
        ),
        buff(
            "combat.melee.conditions.poison.maxLevel",
            "Melee ATK Poison (Max)",
            "integer",
            "beneft_when_positive",
        ),
        buff("loot.pocket.bonusChance", "Pocket Bonus Chance", "percent", "beneft_when_positive"),
        buff("loot.tiers.nothingRerollCount", "Re-Roll Empty Loot", "integer", "beneft_when_positive"),
        buff("loot.valuables.bonus", "Valuable Bonus", "integer", "beneft_when_positive"),
        buff("conditions.ballonDrainReductionFactor", "Ballons Drain Slower", "percent", "beneft_when_positive"),
        buff("conditions.poisonMaxIncreaseFactor", "Poison Builds Slower", "percent", "beneft_when_positive"),
        buff("conditions.poisonRateReductionFactor", "Poison Drains HP Slower", "percent", "beneft_when_positive"),
        buff("conditions.wetnessMaxIncreaseFactor", "Wetness Maximum", "percent", "beneft_when_positive"),
        buff("experience.bonusFactorWhileWet.combat", "Combat XP Bonus (While Wet)", "percent", "beneft_when_positive"),
        buff("experience.bonusFactorWhileWet.jump", "Jump XP Bonus (While Wet)", "percent", "beneft_when_positive"),
        buff("motion.jump.bonusAtSpecialSigns", "Special Jump", "integer", "beneft_when_positive"),
        buff("motion.walk.topSpeedIncreaseFactor", "Walk Top Speed", "percent", "beneft_when_positive"),
        buff("combat.defense.physical", "Phys DEF", "percent", "beneft_when_positive"),
        buff("combat.defense.faction.miner", "Defense Against Miners", "percent", "beneft_when_positive"),
        buff(
            "combat.melee.clawAttack.perfect.combatExperience",
            "Perfect Claw Bonus XP",
            "integer",
            "beneft_when_positive",
        ),
        // TODO it is not necessarily a benefit
        buff("audio.musicTempoAdjustmentFactor", "Music Tempo Adjust", "percent", "beneft_when_positive"),
        buff("esoteric.sceneChangeErrorChance", "Door Error Chance", "percent", "beneft_when_positive"),
        // TODO support for booleans?
        buff("approval.indianaMerchants", "Indiana Merchants Approval", "percent", "beneft_when_positive"),
    );

    const fn = new Function(
        "buffs",
        "buffInformations",
        `// Generated by src/igua/objects/overlay/obj-ui-equipment-buffs.ts
// getBuffInformations

const results = [];
${
            Object.keys(buffInformations).map(key =>
                `results.push(buffs.${key} === 0 ? null : buffInformations["${key}"]);`
            ).join("\n")
        }

return results;`,
    );

    type Buff = Readonly<ReturnType<typeof buff>[string]>;

    return (buffs: RpgPlayerBuffs.Model): Array<Buff | null> => fn(buffs, buffInformations);
})();
