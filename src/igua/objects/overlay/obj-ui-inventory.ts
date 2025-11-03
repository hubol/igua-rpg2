import { DisplayObject, Graphics, LINE_JOIN, Sprite } from "pixi.js";
import { objText } from "../../../assets/fonts";
import { Tx } from "../../../assets/textures";
import { Coro } from "../../../lib/game-engine/routines/coro";
import { onMutate } from "../../../lib/game-engine/routines/on-mutate";
import { Integer, RgbInt } from "../../../lib/math/number-alias-types";
import { container } from "../../../lib/pixi/container";
import { range } from "../../../lib/range";
import { Empty } from "../../../lib/types/empty";
import { Null } from "../../../lib/types/null";
import { DataItem } from "../../data/data-item";
import { DataKeyItem } from "../../data/data-key-item";
import { Cutscene, Input } from "../../globals";
import { mxnBoilPivot } from "../../mixins/mxn-boil-pivot";
import { mxnHudModifiers } from "../../mixins/mxn-hud-modifiers";
import { mxnTextTyped } from "../../mixins/mxn-text-typed";
import { mxnUiPageButton } from "../../mixins/mxn-ui-page-button";
import { MxnUiPageElement, mxnUiPageElement } from "../../mixins/mxn-ui-page-element";
import { Rpg } from "../../rpg/rpg";
import { RpgCharacterEquipment } from "../../rpg/rpg-character-equipment";
import { RpgEquipmentLoadout } from "../../rpg/rpg-equipment-loadout";
import { RpgFlops } from "../../rpg/rpg-flops";
import { RpgInventory } from "../../rpg/rpg-inventory";
import { objUiPage, ObjUiPageRouter, objUiPageRouter } from "../../ui/framework/obj-ui-page";
import { objFigureEquipment } from "../figures/obj-figure-equipment";
import { objFigureKeyItem } from "../figures/obj-figure-key-item";
import { objFigurePotion } from "../figures/obj-figure-potion";
import { StepOrder } from "../step-order";
import { objUiEquipmentBuffs, objUiEquipmentBuffsComparedTo } from "./obj-ui-equipment-buffs";

const Consts = {
    Flops: {
        BackTint: 0x35145c,
        FrontTint: 0xffffff,
    },
};

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
        objUiEquipment(
            () => Rpg.inventory.equipment.loadout[i],
            "show_empty",
            Sprite.from(Tx.Ui.EmptyMono).step(setEmptyEquipmentIconTint),
        ).at(i * 36, -40)
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
    );

    const uiKeyItemObjs = createObjUiKeyItems();

    const uiPotionObjs = createObjUiPotions();

    const pageElementObjs = [...uiPotionObjs, ...uiEquipmentObjs, ...uiKeyItemObjs];

    const pageObj = objUiPage(pageElementObjs, { selectionIndex: 0 }).at(
        180,
        100,
    );

    function isSelected(fn: typeof mxnUiEquipment | typeof mxnUiKeyItem | typeof mxnUiPotion) {
        return Boolean(pageObj.selected?.is(fn));
    }

    function setEmptyEquipmentIconTint(spr: Sprite) {
        spr.tint = isSelected(mxnUiEquipment) ? 0xE5BB00 : 0xAD3600;
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
                self.controls.focusBuffsSource = pageObj.selected.mxnUiEquipment.loadoutItem;
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
            objUiItemInfo(() => pageObj.selected, "none")
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
            objText.MediumIrregular("", { tint: 0x214901 })
                .step(self =>
                    self.text = Rpg.inventory.potions.excessList.length
                        ? `+${Rpg.inventory.potions.excessList.length} more`
                        : ""
                )
                .mixin(mxnBoilPivot)
                .at(224, 60),
        ),
        0,
    );

    objText.Medium("", { tint: 0x00ff00, align: "right" })
        .anchored(1, 1)
        .at(314, 170)
        .step(self => {
            self.text = `---- Attributes ----
Health: ${Rpg.character.attributes.health}
Intelligence: ${Rpg.character.attributes.intelligence}
Strength: ${Rpg.character.attributes.strength}
---- Stats ----
HP: ${Rpg.character.status.health} / ${Rpg.character.status.healthMax}
Face Phys ATK: ${Rpg.character.meleeFaceAttack.physical}
Claw Phys ATK: ${Rpg.character.meleeClawAttack.physical}
Fact Capacity: ${Rpg.character.facts.usedSlots} / ${Rpg.character.facts.totalSlots}`;
        })
        .show(pageObj);

    objUiFlopCollection()
        .at(96, 181)
        .show(pageObj);

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
        const obj = objUiEquipment(() => equipment ?? null, "show_empty").at((i % 8) * 36, Math.floor(i / 8) * 36)
            .mixin(mxnUiPageElement, { tint: 0xE5BB00 })
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
        maxHeight: 104,
        scrollbarBgTint: 0xAD3600,
        scrollbarFgTint: 0xE5BB00,
    })
        .mixin(mxnHudModifiers.mxnHideStatus)
        .mixin(mxnHudModifiers.mxnExperienceIndicatorToLeft)
        .at(188, 8);

    objUiEquipmentBuffs(
        Rpg.inventory.equipment.loadout,
    ).at(60, 46 + 74).show(pageObj);

    objUiEquipmentBuffsComparedTo(
        previewEquipment,
        Rpg.inventory.equipment,
    ).at(284 - 60, 46 + 74).show(pageObj);

    objUiItemInfo(() => pageObj.selected, "show_equipment")
        .at(-4, 0)
        .pivotedUnit(1, 0)
        .show(pageObj);

    return pageObj;
}

function objUiEquipment(
    getEquipmentLoadoutItem: () => RpgEquipmentLoadout.Item,
    variant: "show_empty",
    emptyObj = Sprite.from(Tx.Ui.Empty),
) {
    const itemRef = {
        value: Null<RpgEquipmentLoadout.Item>(),
    };

    const renderObj = container();

    return container(emptyObj, renderObj)
        .mixin(mxnUiEquipment, getEquipmentLoadoutItem)
        .step(() => itemRef.value = getEquipmentLoadoutItem(), StepOrder.BeforeCamera)
        .coro(function* () {
            while (true) {
                renderObj.removeAllChildren();

                if (itemRef.value !== null) {
                    objFigureEquipment(itemRef.value.equipmentId, itemRef.value.level).show(renderObj);
                }

                if (variant === "show_empty") {
                    emptyObj.visible = !itemRef.value;
                }

                yield onMutate(itemRef);
            }
        }, StepOrder.BeforeCamera);
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
                const potionId = obj.mxnUiPotion.potionId;
                if (potionId) {
                    objFigurePotion(potionId).show(self);
                }
                yield onMutate(obj.mxnUiPotion);
            }
        })
        .show(obj);

    return obj.mixin(mxnUiPageButton, { onPress: () => Rpg.inventory.potions.use(index) });
}

function mxnUiPotion(obj: DisplayObject, index: Integer) {
    return obj.merge({
        mxnUiPotion: {
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

function mxnUiEquipment(obj: DisplayObject, loadoutItemProvider: () => RpgEquipmentLoadout.Item) {
    return obj.merge({
        mxnUiEquipment: {
            get loadoutItem() {
                return loadoutItemProvider();
            },
        },
    });
}

function objUiItemInfo(selectedObjSupplier: () => DisplayObject | undefined, quirk: "show_equipment" | "none") {
    let name = "";
    let description = "";

    const descriptionObj = objText.Medium("", { align: "left", tint: 0x000000, maxWidth: 168 })
        .at(0, 24)
        .mixin(mxnTextTyped, () => description);

    const nameObj = objText.MediumBoldIrregular("", { align: "left", tint: 0x000000, maxWidth: 168 })
        .anchored(0, 0)
        .mixin(mxnTextTyped, () => name);

    return container(
        new Graphics().lineStyle({ join: LINE_JOIN.BEVEL, alignment: 1, width: 4, color: 0x808080 })
            .beginFill(0x808080)
            .drawRect(0, 0, 168, 48),
        descriptionObj,
        nameObj,
    )
        .step(self => {
            const obj = selectedObjSupplier();

            name = "";
            description = "";
            let item: RpgInventory.Item | null = null;

            if (obj?.is(mxnUiPotion) && obj.mxnUiPotion.potionId) {
                item = { kind: "potion", id: obj.mxnUiPotion.potionId };
            }
            else if (obj?.is(mxnUiKeyItem)) {
                item = { kind: "key_item", id: obj.mxnUiKeyItem.keyItemId };
            }
            else if (obj?.is(mxnUiEquipment) && quirk === "show_equipment") {
                if (obj.mxnUiEquipment.loadoutItem) {
                    item = {
                        kind: "equipment",
                        id: obj.mxnUiEquipment.loadoutItem.equipmentId,
                        level: obj.mxnUiEquipment.loadoutItem.level,
                    };
                }
                else {
                    name = "Nothing";
                    description = "Remove the shoe from this foot";
                }
            }

            if (item) {
                name = DataItem.getName(item);
                description = DataItem.getDescription(item);
            }
            self.visible = Boolean(name || description);
        });
}

function objUiFlopCollection() {
    const collectionData = {
        availableCount: 0,
        loanedCount: 0,
        uniquesCount: 0,
        list: [] as RpgFlops["list"],
    };

    function updateCollectionData() {
        collectionData.availableCount = 0;
        collectionData.loanedCount = 0;
        collectionData.uniquesCount = 0;

        // TODO RpgFlops should expose
        const list = Rpg.inventory.flops.list;
        for (const item of list) {
            if (!item.count) {
                continue;
            }

            collectionData.uniquesCount += 1;
            collectionData.availableCount += item.count - item.loanedCount;
            collectionData.loanedCount += item.loanedCount;
        }

        collectionData.list = list;
    }

    updateCollectionData();

    return container(
        new Graphics().beginFill(Consts.Flops.BackTint).drawRect(-100 + 3, -17, 192 - 6, 20),
        objLabeledText(
            { text: "Free:", tint: Consts.Flops.FrontTint },
            {
                get text() {
                    return String(collectionData.availableCount);
                },
                tint: Consts.Flops.FrontTint,
            },
        )
            .at(-64, 0),
        objLabeledText(
            { text: "Busy:", tint: Consts.Flops.FrontTint },
            {
                get text() {
                    return String(collectionData.loanedCount);
                },
                tint: Consts.Flops.FrontTint,
            },
        )
            .at(0, 0),
        objLabeledText(
            { text: "Unique:", tint: Consts.Flops.FrontTint },
            {
                get text() {
                    return String(collectionData.uniquesCount);
                },
                tint: Consts.Flops.FrontTint,
            },
        )
            .at(64, 0),
    );
}

interface TextControls {
    readonly text: string;
    readonly tint: RgbInt;
}

function objLabeledText(label: TextControls, value: TextControls) {
    const labelObj = objText.Medium(label.text)
        .step(self => (self.text = label.text, self.tint = label.tint));

    labelObj.tint = label.tint;

    const valueObj = objText.MediumBold(value.text)
        .step(self => (self.text = value.text, self.tint = value.tint));

    valueObj.tint = value.tint;

    return container(
        labelObj
            .anchored(1, 1)
            .at(-1, 0),
        valueObj
            .anchored(0, 1)
            .at(1, 0),
    );
}
