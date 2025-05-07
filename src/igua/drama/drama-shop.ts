import { Graphics, Sprite } from "pixi.js";
import { objText } from "../../assets/fonts";
import { Tx } from "../../assets/textures";
import { Coro } from "../../lib/game-engine/routines/coro";
import { factor, interpvr } from "../../lib/game-engine/routines/interp";
import { sleepf } from "../../lib/game-engine/routines/sleep";
import { SceneLocal } from "../../lib/game-engine/scene-local";
import { approachLinear } from "../../lib/math/number";
import { Integer, RgbInt } from "../../lib/math/number-alias-types";
import { Rng } from "../../lib/math/rng";
import { vequals } from "../../lib/math/vector";
import { vnew } from "../../lib/math/vector-type";
import { container } from "../../lib/pixi/container";
import { renderer } from "../current-pixi-renderer";
import { DataEquipment } from "../data/data-equipment";
import { Input, layers, scene } from "../globals";
import { objIguanaPuppet } from "../iguana/obj-iguana-puppet";
import { mxnBoilPivot } from "../mixins/mxn-boil-pivot";
import { mxnErrorVibrate } from "../mixins/mxn-error-vibrate";
import { experienceIndicatorConfigs, experienceIndicatorConfigsArray } from "../objects/overlay/obj-hud";
import { RpgProgress } from "../rpg/rpg-progress";
import { CatalogItem, Currency, RpgShop } from "../rpg/rpg-shop";
import { objUiPage } from "../ui/framework/obj-ui-page";
import { UiVerticalLayout } from "../ui/framework/ui-vertical-layout";

export interface DramaShopStyle {
    primaryTint: RgbInt;
    secondaryTint: RgbInt;
}

const CtxDramaShop = new SceneLocal(
    () => ({
        state: { isInteractive: false },
        style: { primaryTint: 0x802020, secondaryTint: 0xffffff } satisfies DramaShopStyle,
    }),
    "CtxDramaShop",
);

export function* dramaShop(shop: RpgShop, style: DramaShopStyle) {
    CtxDramaShop.value.style = style;
    dramaShopObjsCount++;

    let done = false;

    const refreshCatalog = () => {
        shop.getCatalog().forEach((item, i) => catalogItemObjs[i].methods.applyCatalogItem(item));
    };

    const initialCatalog = shop.getCatalog();
    const playerStatusObj = objPlayerStatus(initialCatalog).at(50, -5);
    const catalogItemObjs = initialCatalog.map(item =>
        objDramaShopCatalogItem(shop, item, refreshCatalog, () => playerStatusObj.methods.vibrate(item.currency))
    );

    const buttonObjs = [
        ...catalogItemObjs,
        objDoneButton().step((self) => {
            if (CtxDramaShop.value.state.isInteractive && self.selected && Input.justWentDown("Confirm")) {
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
            scrollbarBgTint: CtxDramaShop.value.style.primaryTint,
            scrollbarFgTint: CtxDramaShop.value.style.secondaryTint,
        },
    )
        .at(renderer.width - ItemConsts.width - 32, 0);
    pageObj.navigation = false;

    const shopObj = container(pageObj, playerStatusObj).show(layers.overlay.messages);

    const exitPositions = {
        pageObj: vnew(0, -renderer.height),
        playerStatusObj: vnew(-120, 0),
    };

    shopObj.on("destroyed", () => dramaShopObjsCount--);
    shopObj.visible = false;
    pageObj.add(exitPositions.pageObj);
    playerStatusObj.add(exitPositions.playerStatusObj);

    yield sleepf(1);
    shopObj.visible = true;

    yield* Coro.all([
        interpvr(pageObj).factor(factor.sine).translate(exitPositions.pageObj.vcpy().scale(-1)).over(500),
        interpvr(playerStatusObj).steps(5).translate(exitPositions.playerStatusObj.vcpy().scale(-1)).over(500),
    ]);

    pageObj.navigation = true;
    CtxDramaShop.value.state.isInteractive = true;

    yield () => done;

    pageObj.navigation = false;
    CtxDramaShop.value.state.isInteractive = false;

    yield* Coro.all([
        interpvr(pageObj).factor(factor.sine).translate(exitPositions.pageObj).over(500),
        interpvr(playerStatusObj).steps(5).translate(exitPositions.playerStatusObj).over(500),
    ]);
    shopObj.destroy();
}

// It would technically be incorrect to track this with .track()
// as these instances are added to the overlay, not the scene
let dramaShopObjsCount = 0;

dramaShop.isActive = function () {
    return dramaShopObjsCount > 0;
};

const ItemConsts = {
    width: 340,
    height: 48,
    gutter: 5,
    gap: 15,
};

function objDramaShopCatalogItem(
    shop: RpgShop,
    item: CatalogItem.Model,
    refreshCatalog: () => void,
    showPurchaseError: () => void,
) {
    let catalogItem = item;

    const methods = {
        applyCatalogItem(item: CatalogItem.Model) {
            objects = applyCatalogItem(item);
        },
    };

    const contextualObj = container();

    const obj = container(
        new Graphics().beginFill(CtxDramaShop.value.style.primaryTint).drawRect(
            0,
            0,
            ItemConsts.width,
            ItemConsts.height,
        ),
    )
        .merge({
            selected: false,
            methods,
        })
        .step(self => {
            if (CtxDramaShop.value.state.isInteractive && self.selected && Input.justWentDown("Confirm")) {
                if (CatalogItem.canPlayerAfford(catalogItem)) {
                    shop.purchase(catalogItem);
                    refreshCatalog();
                }
                else {
                    showPurchaseError();
                    objects.catalogItemPriceObj.mxnErrorVibrate.methods.vibrate();
                }
            }
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
                self.lineStyle(Rng.int(1, 3), CtxDramaShop.value.style.secondaryTint, 1, 1);
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

    function applyCatalogItem(item: CatalogItem.Model) {
        contextualObj.removeAllChildren();
        catalogItem = item;
        objCatalogItemNameDescription(item).show(contextualObj);
        const catalogItemPriceObj = objCatalogItemPrice(item)
            .mixin(mxnErrorVibrate)
            .at(ItemConsts.width - 69, 32)
            .show(contextualObj);
        objLimitedQuantity(item.quantity).at(ItemConsts.width, 0).show(contextualObj);

        return {
            catalogItemPriceObj,
        };
    }

    let objects = applyCatalogItem(item);

    return obj.pivoted(-2, -10);
}

function objCatalogItemNameDescription(item: CatalogItem.Model) {
    const nameText = getCatalogItemName(item);
    const descriptionText = getCatalogItemDescription(item);

    const nameTextObj = objText.Large(nameText, { tint: CtxDramaShop.value.style.primaryTint });

    const ellipseObj = new Graphics().lineStyle(1, CtxDramaShop.value.style.primaryTint).beginFill(
        CtxDramaShop.value.style.secondaryTint,
    ).drawRoundedRect(
        -6,
        -2,
        nameTextObj.width + 12,
        nameTextObj.height + 4,
        6,
    );

    const nameObj = container(ellipseObj, nameTextObj).at(4, -8);

    return container(
        nameObj,
        objText.Medium(descriptionText, { tint: CtxDramaShop.value.style.secondaryTint }).at(9, 18),
    );
}

function getCatalogItemName(item: CatalogItem.Model) {
    switch (item.product.kind) {
        case "equipment":
            return (DataEquipment[item.product.name] ?? DataEquipment.__Unknown__).name;
        case "key_item":
            return item.product.name;
        case "potion":
            return "Potion?!?!?";
    }
}

function getCatalogItemDescription(item: CatalogItem.Model) {
    switch (item.product.kind) {
        case "equipment":
            return (DataEquipment[item.product.name] ?? DataEquipment.__Unknown__).description;
        default:
            return "";
    }
}

function objCatalogItemPrice(item: CatalogItem.Model) {
    return objCurrencyAmount(item.price, item.currency, CatalogItem.canPlayerAfford(item));
}

const possibleCurrencies: Currency.Model[] = [
    "valuables",
    ...experienceIndicatorConfigsArray.map(({ experienceKey }) => ({
        kind: "experience" as const,
        experience: experienceKey,
    })),
];

function objPlayerStatus(catalog: CatalogItem.Model[]) {
    const currenciesInCatalog = possibleCurrencies.filter(currency =>
        catalog.some(item => Currency.equals(item.currency, currency))
    );
    const currencyObjs = currenciesInCatalog.reverse().map((currency, i) =>
        objCurrencyAmount(Currency.getPlayerHeldAmount(currency), currency, true)
            .merge({ currency })
            .mixin(mxnErrorVibrate)
            .at(i, renderer.height - 28 - i * 15)
            .step(self => self.controls.amount = Currency.getPlayerHeldAmount(currency))
    );
    const textsObj = container(
        objText.Large("You have...", { tint: CtxDramaShop.value.style.secondaryTint }).anchored(0.5, 1).at(
            12,
            currencyObjs.last.y - 16,
        ),
        ...currencyObjs,
    );

    const bounds = textsObj.getBounds();

    const methods = {
        vibrate(currency: Currency.Model) {
            currencyObjs.find(obj => Currency.equals(obj.currency, currency))?.mxnErrorVibrate?.methods?.vibrate?.();
        },
    };

    return container(
        new Graphics().beginFill(CtxDramaShop.value.style.primaryTint).drawRoundedRect(
            -60,
            bounds.y,
            134,
            bounds.height + 6,
            10,
        ),
        textsObj,
    )
        .merge({ methods });
}

function objCurrencyAmount(amount: Integer, currency: CatalogItem.Model["currency"], isAffordable: boolean) {
    const priceTextObj = objText.MediumBoldIrregular("").anchored(1, 1).at(-1, 0);
    const currencyTextObj = objText.Medium("").anchored(0, 1)
        .at(1, 0);

    function updateText() {
        priceTextObj.text = amount + "";
        if (currency === "valuables") {
            currencyTextObj.text = amount === 1 ? "valuable" : "valuables";
        }
        else {
            currencyTextObj.text = `${currency.experience} XP`;
        }
    }

    updateText();

    const textObj = container(
        priceTextObj,
        currencyTextObj,
    );

    if (currency === "valuables") {
        priceTextObj.tint = 0x00ff00;
        currencyTextObj.tint = 0x00ff00;
        Sprite.from(Tx.Collectibles.ValuableGreen)
            .anchored(0.5, 0.5)
            .at(-priceTextObj.width - 8, -8)
            .step(self => self.x = approachLinear(self.x, -priceTextObj.width - 8, 1))
            .show(textObj);
    }
    else {
        const bounds = textObj.getBounds();
        bounds.x -= 2;
        bounds.y -= 2;
        bounds.width += 4;
        bounds.height = 11;
        textObj.addChildAt(
            new Graphics()
                .beginFill(experienceIndicatorConfigs[currency.experience].tint)
                .drawRoundedRect(bounds.x, bounds.y, bounds.width, bounds.height, 2),
            0,
        );
    }

    const controls = {
        set amount(value: Integer) {
            amount = value;
            updateText();
        },
    };

    if (!isAffordable) {
        const center = priceTextObj.getBounds().getCenter().vround();
        const xObj = Sprite.from(Tx.Shapes.X22).tinted(0xff0000).at(center).anchored(0.5, 0.5).mixin(mxnBoilPivot);
        const index = currency === "valuables" ? 0 : 1;
        textObj.addChildAt(xObj, index);
    }
    return textObj
        .merge({ controls });
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
        objRoundedRect().tinted(CtxDramaShop.value.style.secondaryTint),
        maskObj,
    ).merge({ selected: false });

    objText.MediumIrregular("OK! I'm all done looking at your shop.\nThank you!", {
        tint: CtxDramaShop.value.style.primaryTint,
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

    new Graphics().lineStyle(3, CtxDramaShop.value.style.primaryTint, 1, 0).drawRoundedRect(
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
