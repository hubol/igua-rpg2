import { Graphics, Sprite } from "pixi.js";
import { objText } from "../../../assets/fonts";
import { Tx } from "../../../assets/textures";
import { SubjectiveColorAnalyzer } from "../../../lib/color/subjective-color-analyzer";
import { Coro } from "../../../lib/game-engine/routines/coro";
import { Integer } from "../../../lib/math/number-alias-types";
import { PseudoRng } from "../../../lib/math/rng";
import { clone } from "../../../lib/object/clone";
import { AdjustColor } from "../../../lib/pixi/adjust-color";
import { container } from "../../../lib/pixi/container";
import { range } from "../../../lib/range";
import { EquipmentInternalName, getDataEquipment } from "../../data/data-equipment";
import { Cutscene, Input } from "../../globals";
import { mxnUiPageButton } from "../../mixins/mxn-ui-page-button";
import { mxnUiPageElement } from "../../mixins/mxn-ui-page-element";
import { RpgCharacterEquipmentData_ListItem } from "../../rpg/rpg-character-equipment";
import { RpgEquipmentLoadout } from "../../rpg/rpg-equipment-loadout";
import { RpgProgress } from "../../rpg/rpg-progress";
import { objUiPage, ObjUiPageRouter, objUiPageRouter } from "../../ui/framework/obj-ui-page";
import { StepOrder } from "../step-order";
import { objUiEquipmentEffects, objUiEquipmentEffectsComparedTo } from "./obj-ui-equipment-effects";

export function objUiInventory() {
    const obj = container().coro(function* (self) {
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

    return obj.merge({
        get isOpen() {
            return Boolean(obj.children.length);
        },
    });
}

export type ObjUiInventory = Pick<ReturnType<typeof objUiInventory>, "isOpen">;

function objUiInventoryImpl() {
    const routerObj = objUiPageRouter();
    routerObj.push(objUiEquipmentLoadoutPage(routerObj));

    return routerObj;
}

function objUiEquipmentLoadoutPage(routerObj: ObjUiPageRouter) {
    const uiEquipmentObjs = range(4).map(i =>
        objUiEquipment(() => RpgProgress.character.equipment.loadout[i], "show_empty").at(i * 36, 0).mixin(
            mxnUiPageElement,
        )
            .mixin(mxnUiPageButton, {
                onPress: () => {
                    routerObj.push(objUiEquipmentChoosePage(
                        i,
                        (equipment) => {
                            if (equipment === null) {
                                RpgProgress.character.equipment.dequip(i);
                            }
                            else {
                                RpgProgress.character.equipment.equip(equipment.id, i);
                            }
                            // TODO this can go on the domain object
                            RpgEquipmentLoadout.invalidatePlayerEffectsCache();
                            routerObj.pop();
                        },
                        (equipment, target) => {
                            for (let i = 0; i < RpgProgress.character.equipment.loadout.length; i++) {
                                target[i] = RpgProgress.character.equipment.loadout[i];
                            }
                            target[i] = equipment?.name ?? null;
                            return target;
                        },
                    ));
                },
            })
    );

    const pageObj = objUiPage(uiEquipmentObjs, { selectionIndex: 0 }).at(180, 100);
    Sprite.from(Tx.Ui.EquippedIguana).at(-9, -80).show(pageObj);
    objUiEquipmentEffects(RpgProgress.character.equipment.loadout)
        .step(self => self.controls.focusEffectSource = RpgProgress.character.equipment[pageObj.selectionIndex])
        .at(74, 46)
        .show(pageObj);

    return pageObj;
}

function objUiEquipmentChoosePage(
    slotIndex: Integer,
    setSlot: (slot: RpgCharacterEquipmentData_ListItem | null) => void,
    getLoadoutPreview: (
        slot: RpgCharacterEquipmentData_ListItem | null,
        target: RpgEquipmentLoadout.Model,
    ) => RpgEquipmentLoadout.Model,
) {
    const loadoutPreview = clone(RpgProgress.character.equipment.loadout) as RpgEquipmentLoadout.Model;

    const availableSlotValues = [...RpgProgress.character.equipment.list, null];
    const uiEquipmentObjs = availableSlotValues.map((slot, i) =>
        objUiEquipment(() => slot?.name ?? null, "show_empty").at((i % 8) * 36, Math.floor(i / 8) * 36).mixin(
            mxnUiPageElement,
        )
            .mixin(mxnUiPageButton, {
                onPress: () => setSlot(slot),
                onJustSelected: () => getLoadoutPreview(slot, loadoutPreview),
            })
    );

    const selectionIndex = availableSlotValues.findIndex(slot => slotIndex === slot?.equippedSlotIndex);
    const pageObj = objUiPage(uiEquipmentObjs, {
        selectionIndex: selectionIndex === -1 ? availableSlotValues.length - 1 : selectionIndex,
    }).at(108, 100);

    pageObj.selected?.addChild(Sprite.from(Tx.Ui.CurrentlyEquipped));

    objUiEquipmentEffects(
        RpgProgress.character.equipment.loadout,
    ).at(60, 46 + 30).show(pageObj);

    objUiEquipmentEffectsComparedTo(
        loadoutPreview,
        RpgProgress.character.equipment.loadout,
    ).at(284 - 60, 46 + 30).show(pageObj);

    return pageObj;
}

function objUiEquipment(getSlot: () => RpgEquipmentLoadout.Slot, variant: "show_empty") {
    let appliedSlot: RpgEquipmentLoadout.Slot | undefined = undefined;

    const renderObj = container();
    const obj = container(renderObj).step(maybeApply, StepOrder.BeforeCamera);

    function maybeApply() {
        const slotToApply = getSlot();
        if (slotToApply === appliedSlot) {
            return;
        }

        renderObj.removeAllChildren();

        if (slotToApply !== null) {
            objEquipmentRepresentation(slotToApply).show(renderObj);
        }
        else if (variant === "show_empty") {
            Sprite.from(Tx.Ui.Empty).show(renderObj);
        }

        appliedSlot = slotToApply;
    }

    maybeApply();

    return obj.merge({ getEquipmentName: getSlot });
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
