import { Graphics, Sprite } from "pixi.js";
import { objText } from "../../../assets/fonts";
import { Tx } from "../../../assets/textures";
import { SubjectiveColorAnalyzer } from "../../../lib/color/subjective-color-analyzer";
import { Coro } from "../../../lib/game-engine/routines/coro";
import { Integer } from "../../../lib/math/number-alias-types";
import { PseudoRng } from "../../../lib/math/rng";
import { AdjustColor } from "../../../lib/pixi/adjust-color";
import { container } from "../../../lib/pixi/container";
import { range } from "../../../lib/range";
import { DeepKeyOf } from "../../../lib/types/deep-keyof";
import { DataEquipment, EquipmentInternalName, getDataEquipment } from "../../data/data-equipment";
import { Cutscene, Input } from "../../globals";
import { mxnUiPageButton } from "../../mixins/mxn-ui-page-button";
import { mxnUiPageElement } from "../../mixins/mxn-ui-page-element";
import { RpgEquipmentEffects } from "../../rpg/rpg-equipment-effects";
import { RpgEquipmentLoadout } from "../../rpg/rpg-equipment-loadout";
import { RpgProgress } from "../../rpg/rpg-progress";
import { objUiPage, ObjUiPageRouter, objUiPageRouter } from "../../ui/framework/obj-ui-page";
import { StepOrder } from "../step-order";

export function objUiInventory() {
    return container().coro(function* (self) {
        while (true) {
            yield () => Input.isUp("InventoryMenuToggle");
            yield () => Input.justWentDown("InventoryMenuToggle") && !Cutscene.isPlaying;
            const obj = objUiInventoryImpl().show(self);
            yield* Coro.race([
                Coro.chain([() => Input.isUp("InventoryMenuToggle"), () => Input.justWentDown("InventoryMenuToggle")]),
                () => Cutscene.isPlaying,
            ]);
            obj.destroy();
        }
    });
}

function objUiInventoryImpl() {
    const routerObj = objUiPageRouter();
    routerObj.push(objUiEquipmentLoadoutPage(routerObj));

    return routerObj;
}

function objUiEquipmentLoadoutPage(routerObj: ObjUiPageRouter) {
    const uiEquipmentObjs = range(4).map(i =>
        objUiEquipment(() => RpgProgress.character.equipment[i], "show_empty").at(i * 36, 0).mixin(mxnUiPageElement)
            .mixin(mxnUiPageButton, {
                onPress: () => {
                    routerObj.push(objUiEquipmentChoosePage((name) => {
                        // TODO applyPlayer does not work for this!
                        RpgProgress.character.equipment[i] = name;
                        RpgEquipmentLoadout.invalidatePlayerEffectsCache();
                        routerObj.pop();
                    }));
                },
            })
    );

    const pageObj = objUiPage(uiEquipmentObjs, { selectionIndex: 0 }).at(180, 100);
    Sprite.from(Tx.Ui.EquippedIguana).at(-9, -80).show(pageObj);
    objUiEquipmentEffects(RpgProgress.character.equipment).at(74, 46).show(pageObj);

    return pageObj;
}

function objUiEquipmentChoosePage(setEquipment: (name: EquipmentInternalName) => void) {
    const uiEquipmentObjs = (<EquipmentInternalName[]> Object.keys(DataEquipment)).map((name, i) =>
        objUiEquipment(() => name, "show_empty").at((i % 8) * 36, Math.floor(i / 8)).mixin(mxnUiPageElement)
            .mixin(mxnUiPageButton, { onPress: () => setEquipment(name) })
    );

    return objUiPage(uiEquipmentObjs, { selectionIndex: 0 }).at(108, 100);
}

function objUiEquipment(provider: () => EquipmentInternalName | null, variant: "show_empty") {
    let appliedName: EquipmentInternalName | null | undefined = undefined;

    const renderObj = container();
    const obj = container(renderObj).step(maybeApply, StepOrder.BeforeCamera);

    function maybeApply() {
        const nameToApply = provider();
        if (nameToApply === appliedName) {
            return;
        }

        renderObj.removeAllChildren();

        if (nameToApply !== null) {
            objEquipmentRepresentation(nameToApply).show(renderObj);
        }
        else if (variant === "show_empty") {
            Sprite.from(Tx.Ui.Empty).show(renderObj);
        }

        appliedName = nameToApply;
    }

    maybeApply();

    return obj;
}

function objEquipmentRepresentation(internalName: EquipmentInternalName) {
    const props = getPlaceholderProperties(internalName);

    return container(
        new Graphics().beginFill(props.backgroundTint).drawRect(0, 0, 32, 32),
        objText.Medium(props.name, { tint: props.textTint, maxWidth: 32, align: "center" }).anchored(0.5, 0.5).at(
            16,
            16,
        ),
    );
}

const prng = new PseudoRng();
const printedNameSanitizeRegexp = /((Ring)|a|e|i|o|u)*/g;
const whiteSpaceRegexp = /\s+/g;

// TODO placeholder until I draw sprites... I guess
function getPlaceholderProperties(internalName: EquipmentInternalName) {
    let seed = internalName.length * 698769;
    for (let i = 0; i < internalName.length; i++) {
        seed += internalName.charCodeAt(i) * 9901237 + 111 - i * 3;
    }

    prng.seed = seed;

    const backgroundTint = AdjustColor.hsv(prng.float(0, 360), prng.float(80, 100), prng.float(80, 100)).toPixi();
    const textTint = SubjectiveColorAnalyzer.getPreferredTextColor(backgroundTint);

    return {
        backgroundTint,
        textTint,
        name: getDataEquipment(internalName).name
            .replaceAll(printedNameSanitizeRegexp, "")
            .replaceAll(whiteSpaceRegexp, " ")
            .trim(),
    };
}

function objUiEquipmentEffects(loadout: RpgEquipmentLoadout.Model) {
    const effects = RpgEquipmentEffects.create();

    return container()
        .coro(function* (self) {
            while (true) {
                self.removeAllChildren();
                RpgEquipmentLoadout.getEffects(loadout, effects);

                self.addChild(
                    ...getEquipmentEffectParameters(effects).map(([text, delta, sign], index) =>
                        objUiEquipmentEffect(text, delta, sign).at(0, index * 14)
                    ),
                );

                self.pivot.x = Math.round(self.width / 2);

                const previous = JSON.stringify(loadout);
                yield () => JSON.stringify(loadout) !== previous;
            }
        }, StepOrder.BeforeCamera);
}

function objUiEquipmentEffect(text: string, delta: string, sign: Integer) {
    const tint = sign > 0 ? 0x0000ff : 0xff0000;
    const prefix = sign > 0 ? "+" : "-";
    const leftTextObj = objText.Medium(text, { tint }).anchored(0, 0.5);
    return container(
        leftTextObj,
        objText.MediumBoldIrregular(prefix + delta, { tint }).anchored(0, 0.5).at(leftTextObj.width + 2, 0),
    );
}

const getEquipmentEffectParameters = (function () {
    const parameterFactories: Partial<
        Record<DeepKeyOf.Paths<RpgEquipmentEffects.Model>, (value: number) => Parameters<typeof objUiEquipmentEffect>>
    > = {
        "combat.melee.attack.physical": (value) => ["Melee Phys ATK", String(value), Math.sign(value)],
        "combat.melee.conditions.poison": (value) => ["Melee Inflicts Poison", String(value), Math.sign(value)],
        "combat.melee.clawAttack.physical": (value) => ["Claw Phys ATK", String(value), Math.sign(value)],
        "loot.pocket.bonusChance": (value) => ["Pocket Bonus Chance", String(value) + "%", Math.sign(value)],
        "loot.tiers.nothingRerollCount": (value) => ["Re-Roll Empty Loot", String(value), Math.sign(value)],
        "loot.valuables.bonus": (value) => ["Valuable Bonus", String(value), Math.sign(value)],
        "motion.jump.bonusAtSpecialSigns": (value) => ["Special Jump", String(value), Math.sign(value)],
    };

    const fn = new Function(
        "effects",
        "factories",
        `// Generated by src/igua/objects/overlay/obj-ui-inventory.ts
// getEquipmentEffectParameters

const results = [];
${
            Object.keys(parameterFactories).map(key =>
                `if (effects.${key}) {
    results.push(factories["${key}"](effects.${key}));
}`
            ).join("\n")
        }

return results;`,
    );

    return (effects: RpgEquipmentEffects.Model): Array<Parameters<typeof objUiEquipmentEffect>> =>
        fn(effects, parameterFactories);
})();
