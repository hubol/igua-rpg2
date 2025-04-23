import { objText } from "../../assets/fonts";
import { container } from "../../lib/pixi/container";
import { layers } from "../globals";
import { CatalogItem, RpgShop } from "../rpg/rpg-shop";
import { objUiPage } from "../ui/framework/obj-ui-page";

export function* dramaShop(shop: RpgShop) {
    const catalogItemObjs = shop.getCatalog().map(item => objDramaShopCatalogItem(shop, item).at(0, 40 * item.index));

    const buttonObjs = [
        ...catalogItemObjs,
        // someone else
    ];

    const pageObj = objUiPage(
        buttonObjs,
        { selectionIndex: 0, startTicking: true },
    )
        .show(layers.overlay.messages);

    yield () => false;
}

function objDramaShopCatalogItem(shop: RpgShop, item: CatalogItem) {
    let catalogItem = item;

    const methods = { applyCatalogItem };

    const obj = container().merge({ selected: false, methods });

    function applyCatalogItem(item: CatalogItem) {
        obj.removeAllChildren();
        catalogItem = item;
        // TODO draw stufffff
        objText.Large(getCatalogItemName(item)).show(obj);
        objCatalogItemPrice(item).at(64, 32).show(obj);
    }

    function purchase() {
        shop.purchase(catalogItem);
    }

    applyCatalogItem(item);

    return obj;
}

function getCatalogItemName(item: CatalogItem) {
    switch (item.product.kind) {
        case "equipment":
            return item.product.name;
        case "key_item":
            return item.product.name;
        case "potion":
            return "Potion?!?!?";
    }
}

function objCatalogItemPrice(item: CatalogItem) {
    return container(
        objText.MediumBoldIrregular(item.price + "").anchored(1, 1),
        objText.Medium(item.currency === "valuables" ? "valuables" : `${item.currency.experience} XP`).anchored(0, 1)
            .at(1, 0),
    );
}
