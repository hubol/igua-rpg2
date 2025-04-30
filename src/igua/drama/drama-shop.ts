import { Graphics } from "pixi.js";
import { objText } from "../../assets/fonts";
import { sleepf } from "../../lib/game-engine/routines/sleep";
import { nlerp } from "../../lib/math/number";
import { Rng } from "../../lib/math/rng";
import { vequals } from "../../lib/math/vector";
import { vnew } from "../../lib/math/vector-type";
import { container } from "../../lib/pixi/container";
import { renderer } from "../current-pixi-renderer";
import { DataEquipment } from "../data/data-equipment";
import { layers } from "../globals";
import { CatalogItem, RpgShop } from "../rpg/rpg-shop";
import { objUiPage } from "../ui/framework/obj-ui-page";

export function* dramaShop(shop: RpgShop) {
    const catalogItemObjs = shop.getCatalog().map(item =>
        objDramaShopCatalogItem(shop, item).at(0, (ItemConsts.height + ItemConsts.gap) * item.index)
    );

    const buttonObjs = [
        ...catalogItemObjs,
        // someone else
    ];

    const pageObj = objUiPage(
        buttonObjs,
        {
            selectionIndex: 0,
            startTicking: true,
            maxHeight: renderer.height - 40,
            scrollbarBgTint: 0x802020,
            scrollbarFgTint: 0xffffff,
        },
    )
        .at(Math.floor((renderer.width - ItemConsts.width) / 2), 0)
        .show(layers.overlay.messages);

    yield () => false;
}

const ItemConsts = {
    width: 340,
    height: 48,
    gutter: 5,
    gap: 15,
};

function objDramaShopCatalogItem(shop: RpgShop, item: CatalogItem) {
    let catalogItem = item;

    const methods = { applyCatalogItem };

    const contextualObj = container();

    const obj = container(
        new Graphics().beginFill(0x802020).drawRect(0, 0, ItemConsts.width, ItemConsts.height),
    ).merge({
        selected: false,
        methods,
    });

    const selectionObj = new Graphics().step(self => self.visible = obj.selected).coro(function* (self) {
        const pen = vnew();
        const topLeft = vnew(ItemConsts.gutter, ItemConsts.gutter);
        const topRight = vnew(ItemConsts.width - ItemConsts.gutter, ItemConsts.gutter);
        const bottomRight = vnew(ItemConsts.width - ItemConsts.gutter, ItemConsts.height - ItemConsts.gutter);
        const bottomLeft = vnew(ItemConsts.gutter, ItemConsts.height - ItemConsts.gutter);

        while (true) {
            yield sleepf(Rng.int(10, 20));
            if (!self.visible) {
                continue;
            }
            self.clear();
            self.moveTo(topLeft.x, topLeft.y);
            pen.at(topLeft);

            let next = topRight;

            while (true) {
                pen.moveTowards(next, Rng.int(16, 40));
                self.lineStyle(Rng.int(1, 3), 0xffffff, 1, 1);
                self.lineTo(pen.x, pen.y);
                if (vequals(pen, next)) {
                    if (next === topLeft) {
                        break;
                    }
                    if (next === topRight) {
                        next = bottomRight;
                    }
                    else if (next === bottomRight) {
                        next = bottomLeft;
                    }
                    else {
                        next = topLeft;
                    }
                }
            }
        }
    }).show(obj);

    contextualObj.show(obj);

    function applyCatalogItem(item: CatalogItem) {
        contextualObj.removeAllChildren();
        catalogItem = item;
        // TODO draw stufffff
        objCatalogItemNameDescription(item).show(contextualObj);
        objCatalogItemPrice(item).at(ItemConsts.width - 65, 32).show(contextualObj);
    }

    function purchase() {
        shop.purchase(catalogItem);
    }

    applyCatalogItem(item);

    return obj.pivoted(-2, -10);
}

function objCatalogItemNameDescription(item: CatalogItem) {
    const nameText = getCatalogItemName(item);
    const descriptionText = getCatalogItemDescription(item);

    const nameTextObj = objText.Large(nameText, { tint: 0x802020 });

    const ellipseObj = new Graphics().lineStyle(1, 0x802020).beginFill(0xffffff).drawRoundedRect(
        -6,
        -2,
        nameTextObj.width + 12,
        nameTextObj.height + 4,
        6,
    );

    const nameObj = container(ellipseObj, nameTextObj).at(4, -8);

    return container(nameObj, objText.Medium(descriptionText).at(9, 18));
}

function getCatalogItemName(item: CatalogItem) {
    switch (item.product.kind) {
        case "equipment":
            return (DataEquipment[item.product.name] ?? DataEquipment.__Unknown__).name;
        case "key_item":
            return item.product.name;
        case "potion":
            return "Potion?!?!?";
    }
}

function getCatalogItemDescription(item: CatalogItem) {
    switch (item.product.kind) {
        case "equipment":
            return (DataEquipment[item.product.name] ?? DataEquipment.__Unknown__).description;
        default:
            return "";
    }
}

function objCatalogItemPrice(item: CatalogItem) {
    return container(
        objText.MediumBoldIrregular(item.price + "").anchored(1, 1),
        objText.Medium(item.currency === "valuables" ? "valuables" : `${item.currency.experience} XP`).anchored(0, 1)
            .at(1, 0),
    );
}
