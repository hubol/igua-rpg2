import { Graphics, Sprite } from "pixi.js";
import { objText } from "../../assets/fonts";
import { Tx } from "../../assets/textures";
import { factor, interp, interpvr } from "../../lib/game-engine/routines/interp";
import { sleepf } from "../../lib/game-engine/routines/sleep";
import { nlerp } from "../../lib/math/number";
import { Integer } from "../../lib/math/number-alias-types";
import { Rng } from "../../lib/math/rng";
import { vequals } from "../../lib/math/vector";
import { vnew } from "../../lib/math/vector-type";
import { container } from "../../lib/pixi/container";
import { renderer } from "../current-pixi-renderer";
import { DataEquipment } from "../data/data-equipment";
import { Input, layers, scene } from "../globals";
import { objIguanaPuppet } from "../iguana/obj-iguana-puppet";
import { mxnBoilPivot } from "../mixins/mxn-boil-pivot";
import { experienceIndicatorConfigs } from "../objects/overlay/obj-hud";
import { RpgProgress } from "../rpg/rpg-progress";
import { CatalogItem, isCatalogItemAffordable, RpgShop } from "../rpg/rpg-shop";
import { objUiPage } from "../ui/framework/obj-ui-page";
import { UiVerticalLayout } from "../ui/framework/ui-vertical-layout";

export function* dramaShop(shop: RpgShop) {
    // A very crude hack to ensure that the page does not see SelectUp having just gone down :-)
    yield sleepf(1);

    let done = false;

    const catalogItemObjs = shop.getCatalog().map(item => objDramaShopCatalogItem(shop, item));

    const buttonObjs = [
        ...catalogItemObjs,
        objDoneButton().step((self) => {
            if (self.selected && Input.justWentDown("Confirm")) {
                done = true;
            }
        }),
    ];

    UiVerticalLayout.apply(buttonObjs);

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

    yield () => done;
    yield interpvr(pageObj).factor(factor.sine).translate(0, -renderer.height).over(500);
    pageObj.destroy();
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

            yield sleepf(Rng.int(10, 20));
            yield () => self.visible;
        }
    }).show(obj);

    contextualObj.show(obj);

    function applyCatalogItem(item: CatalogItem) {
        contextualObj.removeAllChildren();
        catalogItem = item;
        // TODO draw stufffff
        objCatalogItemNameDescription(item).show(contextualObj);
        objCatalogItemPrice(item).at(ItemConsts.width - 69, 32).show(contextualObj);
        objLimitedQuantity(item.quantity).at(ItemConsts.width, 0).show(contextualObj);
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
    const priceTextObj = objText.MediumBoldIrregular(item.price + "").anchored(1, 1).at(-1, 0);
    const currencyTextObj = objText.Medium(
        item.currency === "valuables" ? "valuables" : `${item.currency.experience} XP`,
    ).anchored(0, 1)
        .at(1, 0);
    const textObj = container(
        priceTextObj,
        currencyTextObj,
    );

    if (item.currency === "valuables") {
        priceTextObj.tint = 0x00ff00;
        currencyTextObj.tint = 0x00ff00;
        Sprite.from(Tx.Collectibles.ValuableGreen).anchored(0.5, 0.5).at(-priceTextObj.width - 8, -8).show(textObj);
    }
    else {
        const bounds = currencyTextObj.getBounds();
        const center = bounds.getCenter().vround();
        textObj.addChildAt(
            new Graphics()
                .beginFill(experienceIndicatorConfigs[item.currency.experience].tint)
                .drawEllipse(center.x, center.y, Math.round(bounds.width / 2), Math.round(bounds.height / 2)),
            0,
        );
    }

    if (isCatalogItemAffordable(item)) {
        return textObj;
    }

    const center = priceTextObj.getBounds().getCenter().vround();
    return container(
        Sprite.from(Tx.Shapes.X22).tinted(0xff0000).at(center).anchored(0.5, 0.5).mixin(mxnBoilPivot),
        textObj,
    );
}

function objLimitedQuantity(quantity: Integer) {
    if (quantity < 1) {
        return container();
    }

    const urgent = quantity < 4;
    const text = urgent ? `Only ${quantity} Left` : `${quantity} Left`;
    const textObj = objText.Medium(text, { tint: 0 });
    const gfx = new Graphics().beginFill(urgent ? 0xb03030 : 0xd0b030).drawRoundedRect(
        -4,
        -4,
        textObj.width + 8,
        textObj.height + 8,
        4,
    );

    return container(gfx, textObj).pivoted(textObj.width, 0);
}

function objDoneButton() {
    const maskObj = objRoundedRect();

    const obj = container(
        objRoundedRect(),
        maskObj,
    ).merge({ selected: false });

    objText.MediumIrregular("OK! I'm all done looking at your shop.\nThank you!", {
        tint: 0x802020,
        align: "center",
    }).at(110, 14)
        .show(obj)
        .step(self => {
            if (scene.ticker.ticks % 12 === 0 && obj.selected) {
                self.seed += 1;
            }
        });

    objIguanaPuppet(RpgProgress.character.looks).at(70, 50).show(obj).masked(maskObj).step(self =>
        self.head.mouth.agape = (obj.selected && scene.ticker.ticks % 24 < 12) ? 1 : 0
    );

    new Graphics().lineStyle(3, 0x802020, 1, 0).drawRoundedRect(
        ItemConsts.gutter,
        ItemConsts.gutter,
        ItemConsts.width - ItemConsts.gutter * 2,
        ItemConsts.height - ItemConsts.gutter * 2,
        8,
    )
        .mixin(mxnBoilPivot)
        .step(self => self.visible = obj.selected)
        .show(obj);

    return obj;
}
function objRoundedRect() {
    return new Graphics().beginFill(0xffffff).drawRoundedRect(
        0,
        0,
        ItemConsts.width,
        ItemConsts.height,
        8,
    );
}
