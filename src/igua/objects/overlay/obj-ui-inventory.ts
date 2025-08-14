import { DisplayObject, Graphics, LINE_CAP, LINE_JOIN, Sprite } from "pixi.js";
import { objText } from "../../../assets/fonts";
import { Tx } from "../../../assets/textures";
import { Coro } from "../../../lib/game-engine/routines/coro";
import { onMutate } from "../../../lib/game-engine/routines/on-mutate";
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
import { objFigurePotion } from "../figures/obj-figure-potion";
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
        objUiEquipment(() => Rpg.inventory.equipment.loadout[i], "show_empty").at(i * 36, -40)
            .mixin(mxnUiPageElement, { tint: 0xE5BB00 })
            .mixin(mxnUiPageButton, {
                onPress: () => {
                    routerObj.push(objUiEquipmentChoosePage(
                        i,
                        (equipment) => {
                            Rpg.inventory.equipment.equip(equipment?.id ?? null, i);
                            routerObj.pop();
                        },
                    ));
                },
            })
            .mixin(mxnUiEquipment, () => Rpg.inventory.equipment.loadout[i])
    );

    const uiKeyItemObjs = createObjUiKeyItems();

    const uiPotionObjs = createObjUiPotions();

    const pageObj = objUiPage([...uiPotionObjs, ...uiEquipmentObjs, ...uiKeyItemObjs], { selectionIndex: 0 }).at(
        180,
        100,
    );

    function isSelected(fn: typeof mxnUiEquipment | typeof mxnUiKeyItem | typeof mxnUiPotion) {
        return Boolean(pageObj.selected?.is(fn));
    }

    pageObj.addChildAt(
        Sprite.from(Tx.Ui.Inventory.BackgroundEquipment)
            .step(self =>
                self.texture = isSelected(mxnUiEquipment)
                    ? Tx.Ui.Inventory.BackgroundEquipment
                    : Tx.Ui.Inventory.BackgroundUnselectedEquipment
            )
            .at(-7, -66),
        0,
    );

    objUiEquipmentBuffs(Rpg.inventory.equipment.loadout)
        .step(self => {
            if (pageObj.selected?.is(mxnUiEquipment)) {
                self.controls.focusBuffsSource = pageObj.selected.mxnUiEquipment.equipmentId;
                self.visible = true;
            }
            else {
                self.visible = false;
            }
        })
        .at(74, 6)
        .show(pageObj);

    pageObj.addChildAt(
        container(
            Sprite.from(Tx.Ui.Inventory.BackgroundKeyItem)
                .step(self =>
                    self.texture = isSelected(mxnUiKeyItem)
                        ? Tx.Ui.Inventory.BackgroundKeyItem
                        : Tx.Ui.Inventory.BackgroundUnselectedKeyItem
                )
                .at(-180, -26),
            objUiKeyItemInfo(() => pageObj.selected)
                .step(self => self.visible = isSelected(mxnUiKeyItem))
                .at(0, 80),
        ),
        0,
    );

    pageObj.addChildAt(
        container(
            Sprite.from(Tx.Ui.Inventory.BackgroundPotion)
                .step(self =>
                    self.texture = isSelected(mxnUiPotion)
                        ? Tx.Ui.Inventory.BackgroundPotion
                        : Tx.Ui.Inventory.BackgroundUnselectedPotion
                )
                .at(-5, -22),
        ),
        0,
    );

    return pageObj;
}

const currentlyEquippedSlotTxs = Tx.Ui.CurrentlyEquippedSlot.split({ width: 10 });

function objUiEquipmentChoosePage(
    loadoutIndex: Integer,
    onChoose: (equipment: RpgCharacterEquipment.ObtainedEquipment | null) => void,
) {
    const previewEquipment = new RpgCharacterEquipment.Preview(Rpg.inventory.equipment);

    const availableLoadoutItems = [...Rpg.inventory.equipment.list, null];
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
        Rpg.inventory.equipment.loadout,
    ).at(60, 46 + 30).show(pageObj);

    objUiEquipmentBuffsComparedTo(
        previewEquipment,
        Rpg.inventory.equipment,
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

function createObjUiPotions() {
    const pageElementObjs = Empty<MxnUiPageElement>();

    for (let i = 0; i < 12; i++) {
        const x = (i % 6) * 36;
        const y = Math.floor(i / 6) * 36;
        pageElementObjs.push(objUiPotion(i).at(x, y).add(0, 0));
    }

    return pageElementObjs;
}

function objUiPotion(index: Integer) {
    const obj = container(new Graphics().beginFill(0xffffff, 1 / 512).drawRect(0, 0, 32, 32))
        .mixin(mxnUiPotion, index)
        .mixin(mxnUiPageElement, { tint: 0x84B500 });

    container()
        .coro(function* (self) {
            while (true) {
                self.removeAllChildren();
                const potionId = obj.mxnKeyItem.potionId;
                if (potionId) {
                    objFigurePotion(potionId).show(self);
                }
                yield onMutate(obj.mxnKeyItem);
            }
        })
        .show(obj);

    return obj.mixin(mxnUiPageButton, { onPress: () => Rpg.inventory.potions.use(index) });
}

function mxnUiPotion(obj: DisplayObject, index: Integer) {
    return obj.merge({
        mxnKeyItem: {
            get potionId() {
                return Rpg.inventory.potions.list[index];
            },
        },
    });
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
