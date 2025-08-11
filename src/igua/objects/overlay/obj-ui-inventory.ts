import { DisplayObject, Graphics, LINE_CAP, LINE_JOIN, Sprite } from "pixi.js";
import { objText } from "../../../assets/fonts";
import { Tx } from "../../../assets/textures";
import { Coro } from "../../../lib/game-engine/routines/coro";
import { Integer } from "../../../lib/math/number-alias-types";
import { container } from "../../../lib/pixi/container";
import { range } from "../../../lib/range";
import { Empty } from "../../../lib/types/empty";
import { DataEquipment } from "../../data/data-equipment";
import { DataKeyItem } from "../../data/data-key-item";
import { Cutscene, Input } from "../../globals";
import { mxnTextTyped } from "../../mixins/mxn-text-typed";
import { mxnUiPageButton } from "../../mixins/mxn-ui-page-button";
import { MxnUiPageElement, mxnUiPageElement } from "../../mixins/mxn-ui-page-element";
import { Rpg } from "../../rpg/rpg";
import { RpgCharacterEquipment } from "../../rpg/rpg-character-equipment";
import { RpgEquipmentLoadout } from "../../rpg/rpg-equipment-loadout";
import { objUiPage, ObjUiPageRouter, objUiPageRouter } from "../../ui/framework/obj-ui-page";
import { objFigureEquipment } from "../figures/obj-figure-equipment";
import { objFigureKeyItem } from "../figures/obj-figure-key-item";
import { StepOrder } from "../step-order";
import { objUiBubbleNumber } from "./obj-ui-bubble-numbers";
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
        objUiEquipment(() => Rpg.character.equipment.loadout[i], "show_empty").at(i * 36, 0)
            .mixin(mxnUiPageElement, { tint: 0xE5BB00 })
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
            .mixin(mxnUiEquipment, () => Rpg.character.equipment.loadout[i])
    );

    const uiKeyItemObjs = createObjUiKeyItems();

    const pageObj = objUiPage([...uiEquipmentObjs, ...uiKeyItemObjs], { selectionIndex: 0 }).at(180, 100);
    // Sprite.from(Tx.Ui.EquippedIguana).at(-9, -80).show(pageObj);
    pageObj.addChildAt(
        container(
            Sprite.from(Tx.Ui.Inventory.BackgroundEquipment).at(-7, -26),
            objUiEquipmentBuffs(Rpg.character.equipment.loadout)
                .step(self => {
                    if (pageObj.selected?.is(mxnUiEquipment)) {
                        self.controls.focusBuffsSource = pageObj.selected.mxnUiEquipment.equipmentId;
                    }
                })
                .at(74, 46),
        )
            .step(self => {
                self.visible = Boolean(pageObj.selected?.is(mxnUiEquipment));
            }),
        0,
    );

    pageObj.addChildAt(
        container(
            Sprite.from(Tx.Ui.Inventory.BackgroundKeyItem).at(-180, -26),
            objUiKeyItemInfo(() => pageObj.selected).at(0, 80),
        )
            .step(self => {
                self.visible = Boolean(pageObj.selected?.is(mxnUiKeyItem));
            }),
        0,
    );

    return pageObj;
}

const currentlyEquippedSlotTxs = Tx.Ui.CurrentlyEquippedSlot.split({ width: 10 });

function objUiEquipmentChoosePage(
    loadoutIndex: Integer,
    onChoose: (equipment: RpgCharacterEquipment.ObtainedEquipment | null) => void,
) {
    const previewEquipment = new RpgCharacterEquipment.Preview(Rpg.character.equipment);

    const availableLoadoutItems = [...Rpg.character.equipment.list, null];
    const uiEquipmentObjs = availableLoadoutItems.map((equipment, i) => {
        const obj = objUiEquipment(() => equipment?.name ?? null, "show_empty").at((i % 8) * 36, Math.floor(i / 8) * 36)
            .mixin(mxnUiPageElement)
            .mixin(mxnUiPageButton, {
                onPress: () => onChoose(equipment),
                onJustSelected: () => previewEquipment.equip(equipment?.id ?? null, loadoutIndex),
            });

        if (Number.isInteger(equipment?.loadoutIndex)) {
            const equippedTx = equipment!.loadoutIndex! === loadoutIndex
                ? Tx.Ui.CurrentlyEquipped
                : currentlyEquippedSlotTxs[equipment!.loadoutIndex!];
            if (equippedTx) {
                obj.addChild(Sprite.from(equippedTx));
            }
        }

        return obj;
    });

    const initialSelectionIndex = availableLoadoutItems.findIndex(item => loadoutIndex === item?.loadoutIndex);
    const pageObj = objUiPage(uiEquipmentObjs, {
        selectionIndex: initialSelectionIndex === -1 ? availableLoadoutItems.length - 1 : initialSelectionIndex,
    }).at(108, 100);

    objUiEquipmentBuffs(
        Rpg.character.equipment.loadout,
    ).at(60, 46 + 30).show(pageObj);

    objUiEquipmentBuffsComparedTo(
        previewEquipment,
        Rpg.character.equipment,
    ).at(284 - 60, 46 + 30).show(pageObj);

    objText.MediumBoldIrregular("", { tint: 0x00ff00 })
        .mixin(mxnTextTyped, () => {
            const equipment = availableLoadoutItems[pageObj.selectionIndex];
            return equipment ? DataEquipment.getById(equipment.name).name : "Nothing";
        })
        .anchored(0, 1)
        .at(0, -3)
        .show(pageObj);

    return pageObj;
}

function objUiEquipment(getEquipmentName: () => RpgEquipmentLoadout.Item, variant: "show_empty") {
    let appliedName: RpgEquipmentLoadout.Item | undefined = undefined;

    const renderObj = container();

    function maybeApply() {
        const nameToApply = getEquipmentName();
        if (nameToApply === appliedName) {
            return;
        }

        renderObj.removeAllChildren();

        if (nameToApply !== null) {
            objFigureEquipment(nameToApply).show(renderObj);
        }
        else if (variant === "show_empty") {
            Sprite.from(Tx.Ui.Empty).show(renderObj);
        }

        appliedName = nameToApply;
    }

    maybeApply();

    return container(renderObj).step(maybeApply, StepOrder.BeforeCamera);
}

function createObjUiKeyItems() {
    const pageElementObjs = Empty<MxnUiPageElement>();

    const { list } = Rpg.inventory.keyItems;

    let x = 0;
    let y = 0;
    for (const { count, keyItemId } of list) {
        pageElementObjs.push(objUiKeyItem(keyItemId, count).at(x, y).add(-40, 0));

        y += 36;
        if (y >= 36 * 5) {
            y = 0;
            x -= 36;
        }
    }

    return pageElementObjs;
}

function objUiKeyItem(keyItemId: DataKeyItem.Id, count: Integer) {
    return container(
        objFigureKeyItem(keyItemId),
        ...(count > 1 ? [objText.SmallDigits("" + count, { tint: 0x3775E8 }).anchored(1, 1).at(31, 31)] : []),
    )
        .mixin(mxnUiPageElement, { tint: 0x37B2E8 })
        .mixin(mxnUiKeyItem, keyItemId);
}

function mxnUiKeyItem(obj: DisplayObject, keyItemId: DataKeyItem.Id) {
    return obj.merge({ mxnUiKeyItem: { keyItemId } });
}

function mxnUiEquipment(obj: DisplayObject, equipmentIdProvider: () => RpgEquipmentLoadout.Item) {
    return obj.merge({
        mxnUiEquipment: {
            get equipmentId() {
                return equipmentIdProvider();
            },
        },
    });
}

function objUiKeyItemInfo(selectedObjSupplier: () => DisplayObject | undefined) {
    const descriptionObj = objText.Medium("", { align: "left", tint: 0x000000, maxWidth: 168 })
        .at(0, 24)
        .mixin(mxnTextTyped, () => {
            const uiKeyItemObj = selectedObjSupplier();
            return uiKeyItemObj?.is(mxnUiKeyItem)
                ? DataKeyItem.getById(uiKeyItemObj.mxnUiKeyItem.keyItemId).description
                : "";
        });

    const nameObj = objText.MediumBoldIrregular("", { align: "left", tint: 0x000000, maxWidth: 168 })
        .anchored(0, 0)
        .mixin(mxnTextTyped, () => {
            const uiKeyItemObj = selectedObjSupplier();
            return uiKeyItemObj?.is(mxnUiKeyItem)
                ? DataKeyItem.getById(uiKeyItemObj.mxnUiKeyItem.keyItemId).name
                : "";
        });

    return container(
        new Graphics().lineStyle({ join: LINE_JOIN.BEVEL, alignment: 1, width: 4, color: 0x808080 })
            .beginFill(0x808080)
            .drawRect(0, 0, 168, 48),
        descriptionObj,
        nameObj,
    );
}
