import { Sprite } from "pixi.js";
import { Tx } from "../../../assets/textures";
import { Coro } from "../../../lib/game-engine/routines/coro";
import { Integer } from "../../../lib/math/number-alias-types";
import { container } from "../../../lib/pixi/container";
import { range } from "../../../lib/range";
import { Cutscene, Input } from "../../globals";
import { mxnUiPageButton } from "../../mixins/mxn-ui-page-button";
import { mxnUiPageElement } from "../../mixins/mxn-ui-page-element";
import { Rpg } from "../../rpg/rpg";
import { RpgCharacterEquipment } from "../../rpg/rpg-character-equipment";
import { RpgEquipmentLoadout } from "../../rpg/rpg-equipment-loadout";
import { objUiPage, ObjUiPageRouter, objUiPageRouter } from "../../ui/framework/obj-ui-page";
import { objEquipmentRepresentation } from "../obj-equipment-representation";
import { StepOrder } from "../step-order";
import { objUiEquipmentBuffs, objUiEquipmentBuffsComparedTo } from "./obj-ui-equipment-buffs";

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
        objUiEquipment(() => Rpg.character.equipment.loadout[i], "show_empty").at(i * 36, 0).mixin(
            mxnUiPageElement,
        )
            .mixin(mxnUiPageButton, {
                onPress: () => {
                    routerObj.push(objUiEquipmentChoosePage(
                        i,
                        (equipment) => {
                            Rpg.character.equipment.equip(equipment?.id ?? null, i);
                            routerObj.pop();
                        },
                    ));
                },
            })
    );

    const pageObj = objUiPage(uiEquipmentObjs, { selectionIndex: 0 }).at(180, 100);
    Sprite.from(Tx.Ui.EquippedIguana).at(-9, -80).show(pageObj);
    objUiEquipmentBuffs(Rpg.character.equipment.loadout)
        .step(self => self.controls.focusBuffsSource = Rpg.character.equipment.loadout[pageObj.selectionIndex])
        .at(74, 46)
        .show(pageObj);

    return pageObj;
}

function objUiEquipmentChoosePage(
    loadoutIndex: Integer,
    onChoose: (equipment: RpgCharacterEquipment.ObtainedEquipment | null) => void,
) {
    const previewEquipment = new RpgCharacterEquipment.Preview(Rpg.character.equipment);

    const availableLoadoutItems = [...Rpg.character.equipment.list, null];
    const uiEquipmentObjs = availableLoadoutItems.map((equipment, i) =>
        objUiEquipment(() => equipment?.name ?? null, "show_empty").at((i % 8) * 36, Math.floor(i / 8) * 36).mixin(
            mxnUiPageElement,
        )
            .mixin(mxnUiPageButton, {
                onPress: () => onChoose(equipment),
                onJustSelected: () => previewEquipment.equip(equipment?.id ?? null, loadoutIndex),
            })
    );

    const initialSelectionIndex = availableLoadoutItems.findIndex(item => loadoutIndex === item?.loadoutIndex);
    const pageObj = objUiPage(uiEquipmentObjs, {
        selectionIndex: initialSelectionIndex === -1 ? availableLoadoutItems.length - 1 : initialSelectionIndex,
    }).at(108, 100);

    pageObj.selected?.addChild(Sprite.from(Tx.Ui.CurrentlyEquipped));

    objUiEquipmentBuffs(
        Rpg.character.equipment.loadout,
    ).at(60, 46 + 30).show(pageObj);

    objUiEquipmentBuffsComparedTo(
        previewEquipment,
        Rpg.character.equipment,
    ).at(284 - 60, 46 + 30).show(pageObj);

    return pageObj;
}

function objUiEquipment(getEquipmentName: () => RpgEquipmentLoadout.Item, variant: "show_empty") {
    let appliedName: RpgEquipmentLoadout.Item | undefined = undefined;

    const renderObj = container();
    const obj = container(renderObj).step(maybeApply, StepOrder.BeforeCamera);

    function maybeApply() {
        const nameToApply = getEquipmentName();
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

    return obj.merge({ getEquipmentName });
}
