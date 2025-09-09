import { Container, Graphics, Rectangle, Sprite, Texture } from "pixi.js";
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
import { MapRgbFilter } from "../../lib/pixi/filters/map-rgb-filter";
import { renderer } from "../current-pixi-renderer";
import { DataItem } from "../data/data-item";
import { DataShop } from "../data/data-shop";
import { Input, layers, scene } from "../globals";
import { objIguanaPuppet } from "../iguana/obj-iguana-puppet";
import { mxnBoilPivot } from "../mixins/mxn-boil-pivot";
import { mxnErrorVibrate } from "../mixins/mxn-error-vibrate";
import { mxnHudModifiers } from "../mixins/mxn-hud-modifiers";
import { experienceIndicatorConfigs, experienceIndicatorConfigsArray } from "../objects/overlay/obj-hud";
import { Rpg } from "../rpg/rpg";
import { RpgEconomy } from "../rpg/rpg-economy";
import { RpgStock } from "../rpg/rpg-shops";
import { objUiPage, ObjUiPageElement } from "../ui/framework/obj-ui-page";
import { UiVerticalLayout } from "../ui/framework/ui-vertical-layout";
import { objDramaOwnedCount } from "./objects/obj-drama-owned-count";

export interface DramaShopStyle {
    primaryTint: RgbInt;
    secondaryTint: RgbInt;
}

export const CtxDramaShop = new SceneLocal(
    () => ({
        state: { isInteractive: false },
        style: { primaryTint: 0x802020, secondaryTint: 0xffffff } satisfies DramaShopStyle,
    }),
    "CtxDramaShop",
);

const stockKindOrder: Record<DataShop.Product["kind"], Integer> = {
    potion: 0,
    key_item: 1,
    equipment: 2,
};

function getSortScore(stock: RpgStock) {
    return stockKindOrder[stock.product.kind] * 100 + possibleCurrencyIndices[stock.currency];
}

function compareStock(a: RpgStock, b: RpgStock) {
    const aScore = getSortScore(a);
    const bScore = getSortScore(b);
    if (aScore === bScore) {
        const aName = DataItem.getName(a.product);
        const bName = DataItem.getName(b.product);

        if (aName === bName) {
            return 0;
        }

        return aName > bName ? 1 : -1;
    }
    return aScore - bScore;
}

export function* dramaShop(shopId: DataShop.Id, style: DramaShopStyle) {
    const shop = Rpg.shop(shopId);

    CtxDramaShop.value.style = style;

    let done = false;

    const refreshStocks = () => {
        for (const stockObj of stockObjs) {
            stockObj.methods.update();
        }
    };

    const playerStatusObj = objPlayerStatus(shop.stocks).at(50, -5);
    const stockObjs = [...shop.stocks].sort(compareStock).map(stock =>
        objDramaShopStock(stock, refreshStocks, () => playerStatusObj.methods.vibrate(stock.currency))
    );

    const doneButtonObj = objDoneButton().step((self) => {
        if (CtxDramaShop.value.state.isInteractive && self.selected && Input.justWentDown("Confirm")) {
            done = true;
        }
    });

    const elementObjs = (function () {
        const productKinds = new Set<DataShop.Product["kind"]>();

        const objs: Container[] = [];
        for (const stockObj of stockObjs) {
            const productKind = stockObj.state.productKind;
            if (!productKinds.has(productKind)) {
                objs.push(objProductSeparator(productKind).at(ItemConsts.width / 2, 0).vround());
                productKinds.add(productKind);
            }

            objs.push(stockObj);
        }

        objs.push(doneButtonObj);
        return objs;
    })();

    UiVerticalLayout.apply(elementObjs);

    const pageObj = objUiPage(
        elementObjs.filter(ObjUiPageElement.is),
        {
            children: elementObjs,
            selectionIndex: 0,
            startTicking: true,
            maxHeight: renderer.height - 40,
            scrollbarBgTint: CtxDramaShop.value.style.primaryTint,
            scrollbarFgTint: CtxDramaShop.value.style.secondaryTint,
            scrollCatchUpSpeed: 10,
        },
    )
        .at(renderer.width - ItemConsts.width - 32, 0);
    pageObj.navigation = false;

    const shopObj = container(pageObj, playerStatusObj)
        .mixin(mxnHudModifiers.mxnHideStatus)
        .mixin(mxnHudModifiers.mxnExperienceIndicatorToLeft)
        .show(layers.overlay.messages);

    const exitPositions = {
        pageObj: vnew(0, -renderer.height),
        playerStatusObj: vnew(-120, 0),
    };

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

const ItemConsts = {
    width: 340,
    height: 48,
    gutter: 5,
    gap: 15,
};

function objDramaShopStock(
    stock: RpgStock,
    refreshStocks: () => void,
    showPurchaseError: () => void,
) {
    const state = {
        productKind: stock.product.kind,
    };

    const methods = {
        update() {
            objects = update();
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
            state,
            methods,
        })
        .step(self => {
            if (CtxDramaShop.value.state.isInteractive && self.selected && Input.justWentDown("Confirm")) {
                if (stock.isSoldOut) {
                    objects.limitedQuantityObj.mxnErrorVibrate.methods.vibrate();
                }
                // TODO where to enforce potions inventory being too full???
                else if (Rpg.wallet.canAfford(stock)) {
                    stock.purchase();
                    refreshStocks();
                }
                else {
                    showPurchaseError();
                    objects.stockPriceObj.mxnErrorVibrate.methods.vibrate();
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

    function update() {
        contextualObj.removeAllChildren();
        objStockNameDescription(stock).show(contextualObj);
        const stockPriceObj = objStockPrice(stock)
            .mixin(mxnErrorVibrate)
            .at(ItemConsts.width - 69, 32)
            .show(contextualObj);

        const limitedQuantityObj = objLimitedQuantity(stock.quantity)
            .mixin(mxnErrorVibrate)
            .at(ItemConsts.width, 0)
            .show(contextualObj);

        if (stock.isSoldOut) {
            stockPriceObj.visible = false;
            limitedQuantityObj.add(-20, 20);
        }

        return {
            limitedQuantityObj,
            stockPriceObj,
        };
    }

    let objects = update();

    return obj.pivoted(-2, -10);
}

function objStockNameDescription(stock: RpgStock) {
    const nameText = DataItem.getName(stock.product);
    const descriptionText = DataItem.getDescription(stock.product);

    const nameTextObj = objText.Large(nameText, { tint: CtxDramaShop.value.style.primaryTint });

    const figureObj = DataItem.getFigureObj(stock.product).at(nameTextObj.width + 9, -15);

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
        figureObj,
        objText.Medium(descriptionText, { tint: CtxDramaShop.value.style.secondaryTint, maxWidth: 224 }).at(9, 18),
        objDramaOwnedCount({
            count: Rpg.inventory.count(stock.product),
            fgTint: CtxDramaShop.value.style.primaryTint,
            bgTint: CtxDramaShop.value.style.secondaryTint,
            visibleWhenZero: false,
        }).at(nameObj.width + 32, 4),
    );
}

function objStockPrice(item: RpgStock) {
    return objCurrencyAmount(item.price, item.currency, Rpg.wallet.canAfford(item));
}

// TODO this must be exhaustive
// maybe a different approach
const possibleCurrencies: RpgEconomy.Currency.Id[] = [
    "valuables",
    "mechanical_idol_credits",
    ...experienceIndicatorConfigsArray.map(({ experienceKey }) => experienceKey),
];

const possibleCurrencyIndices: Record<RpgEconomy.Currency.Id, Integer> = Object.assign(
    {},
    ...possibleCurrencies.map((currency, index) => ({ [currency]: index })),
);

function objPlayerStatus(stocks: ReadonlyArray<RpgStock>) {
    const currenciesInStocks = possibleCurrencies.filter(currency => stocks.some(item => item.currency === currency));
    const currencyObjs = currenciesInStocks.reverse().map((currency, i) =>
        objCurrencyAmount(Rpg.wallet.count(currency), currency, true)
            .merge({ currency })
            .mixin(mxnErrorVibrate)
            .at(i, renderer.height - 28 - i * 15)
            .step(self => self.controls.amount = Rpg.wallet.count(currency))
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
        vibrate(currency: RpgEconomy.Currency.Id) {
            currencyObjs.find(obj => obj.currency === currency)?.mxnErrorVibrate?.methods
                ?.vibrate?.();
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

const r = new Rectangle();

function objCurrencyAmount(amount: Integer, currency: RpgStock["currency"], isAffordable: boolean) {
    const priceTextObj = objText.MediumBoldIrregular("").anchored(1, 1).at(-1, 0);
    const currencyTextObj = objText.Medium("").anchored(0, 1)
        .at(1, 0);

    function updateText() {
        priceTextObj.text = amount + "";
        if (currency === "valuables") {
            currencyTextObj.text = amount === 1 ? "valuable" : "valuables";
        }
        else if (currency === "mechanical_idol_credits") {
            currencyTextObj.text = amount === 1 ? "credit" : "credits";
        }
        else {
            currencyTextObj.text = `${currency} XP`;
        }
    }

    updateText();

    const textObj = container(
        priceTextObj,
        currencyTextObj,
    );

    function objCurrencyIcon(tx: Texture) {
        return Sprite.from(tx)
            .anchored(1, 0.5)
            .at(-priceTextObj.width - 4, -8)
            .step(self => self.x = approachLinear(self.x, -priceTextObj.width - 4, 1))
            .show(obj);
    }

    const obj = container(textObj);

    if (currency === "valuables") {
        priceTextObj.tint = 0x00ff00;
        currencyTextObj.tint = 0x00ff00;
        objCurrencyIcon(Tx.Collectibles.ValuableGreen);
    }
    else if (currency === "mechanical_idol_credits") {
        // TODO style
    }
    else {
        const config = experienceIndicatorConfigs[currency];
        const bounds = new Rectangle();
        const gfx = new Graphics()
            .tinted(config.tint)
            .step(() => {
                updateBounds(r);
                bounds.x = approachLinear(bounds.x, r.x, 1);
                bounds.y = approachLinear(bounds.y, r.y, 1);
                bounds.width = approachLinear(bounds.width, r.width, 1);
                bounds.height = approachLinear(bounds.height, r.height, 1);
            });

        objCurrencyIcon(config.iconTx);

        function updateBounds(rectangle: Rectangle) {
            textObj.getLocalBounds(rectangle);
            rectangle.x -= 2;
            rectangle.y -= 2;
            rectangle.width += 4;
            rectangle.height = 11;

            gfx
                .clear()
                .beginFill(0xffffff)
                .drawRoundedRect(bounds.x, bounds.y, bounds.width, bounds.height, 2);
        }

        updateBounds(bounds);

        obj.addChildAt(gfx, 0);
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
        obj.addChildAt(xObj, index);
    }
    return obj
        .merge({ controls });
}

function objLimitedQuantity(quantity: Integer) {
    const urgent = quantity < 4;
    const text = quantity < 1 ? "Sold Out" : (urgent ? `Only ${quantity} Left` : `${quantity} Left`);
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

    objIguanaPuppet(Rpg.character.looks).at(70, 50).show(obj).masked(maskObj).step(self =>
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

const separatorTxs = (function () {
    const txs = Tx.Ui.ShopProductSeparator.split({ width: 178 });
    return {
        potion: {
            bannerTx: txs[0],
            decorationTx: txs[3],
        },
        key_item: {
            bannerTx: txs[1],
            decorationTx: txs[4],
        },
        equipment: {
            bannerTx: txs[2],
            decorationTx: txs[5],
        },
    };
})();

function objProductSeparator(kind: DataShop.Product["kind"]) {
    const filter = new MapRgbFilter(CtxDramaShop.value.style.primaryTint, CtxDramaShop.value.style.secondaryTint);

    return container(
        Sprite.from(separatorTxs[kind].bannerTx).filtered(filter),
        Sprite.from(separatorTxs[kind].decorationTx),
    )
        .pivoted(89, 0);
}
