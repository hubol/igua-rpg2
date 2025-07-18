import { Integer } from "../../lib/math/number-alias-types";
import { DataEquipment } from "../data/data-equipment";
import { DataKeyItem } from "../data/data-key-item";
import { Rpg } from "./rpg";
import { RpgEconomy } from "./rpg-economy";
import { RpgKeyItems } from "./rpg-key-items";
import { RpgPlayerWallet } from "./rpg-player-wallet";

interface Product_Equipment {
    kind: "equipment";
    name: DataEquipment.Id;
}

interface Product_KeyItem {
    kind: "key_item";
    // TODD rename to id
    name: DataKeyItem.Id;
}

interface Product_Potion {
    kind: "potion";
}

// TODO can you buy pocket items?
// probably...?
// TODO can you buy flops?
// not sure...?
type Product = Product_Equipment | Product_KeyItem | Product_Potion;

interface Price {
    currency: RpgEconomy.Currency.Model;
    initial: Integer;
    deltaSold: Integer;
}

interface Stock {
    product: Product;
    initialQuantity: Integer;
    price: Price;
}

interface Config {
    internalName: string;
    stocks: Stock[];
}

export namespace CatalogItem {
    export type Model = Readonly<{
        index: Integer; // Feels a little bad here, as it really should only be used in RpgShop
        key: string;
        product: Product;
        currency: RpgEconomy.Currency.Model;
        price: Integer;
        quantity: Integer;
    }>;

    export function canPlayerAfford(item: Model) {
        return RpgPlayerWallet.getHeldAmount(item.currency) >= item.price;
    }

    export function getPlayerOwnedCount(item: Model): Integer {
        if (item.product.kind === "potion") {
            // TODO implement!
            return 0;
        }
        else if (item.product.kind === "equipment") {
            return Rpg.character.equipment.count(item.product.name);
        }

        return RpgKeyItems.Methods.count(Rpg.character.inventory.keyItems, item.product.name);
    }
}

function getCatalogItemKeyBase(stock: Stock) {
    const { product, price: { currency } } = stock;

    const productSubstring = product.kind + "__" + ("name" in product ? product.name : "");
    const currencySubstring = typeof currency === "string"
        ? currency
        : ("__" + currency.kind + "__" + currency.experience);

    return productSubstring + currencySubstring;
}

function getCatalogItemKeys(stocks: Stock[]) {
    const keyBaseCounts: Record<string, number> = {};
    return stocks.map(stock => {
        const keyBase = getCatalogItemKeyBase(stock);
        const previousCount = keyBaseCounts[keyBase] ?? 0;
        keyBaseCounts[keyBase] = previousCount + 1;
        return keyBase + "__" + previousCount;
    });
}

export class RpgShop {
    private readonly catalogItemKeys: string[];

    constructor(private readonly config: Config) {
        this.catalogItemKeys = getCatalogItemKeys(config.stocks);
    }

    private getSoldCounts() {
        if (!Rpg.programmaticFlags.shopSoldCounts[this.config.internalName]) {
            Rpg.programmaticFlags.shopSoldCounts[this.config.internalName] = {};
        }

        return Rpg.programmaticFlags.shopSoldCounts[this.config.internalName];
    }

    private getSoldCount(catalogItemKey: string) {
        return this.getSoldCounts()[catalogItemKey] ?? 0;
    }

    private increaseSoldCount(catalogItemKey: string) {
        const obj = this.getSoldCounts();
        const previousCount = obj[catalogItemKey] ?? 0;
        obj[catalogItemKey] = previousCount + 1;
    }

    getCatalog(): CatalogItem.Model[] {
        return this.config.stocks.map((stock, index) => this.getCatalogItem(index, stock));
    }

    private getCatalogItem(index: number, stock: Stock): CatalogItem.Model {
        const key = this.catalogItemKeys[index];
        const soldCount = this.getSoldCount(key);

        return {
            index,
            key: this.catalogItemKeys[index],
            product: stock.product,
            currency: stock.price.currency,
            price: stock.price.initial
                + Math.max(0, Math.min(soldCount, stock.initialQuantity - 1)) * stock.price.deltaSold,
            quantity: Math.max(0, stock.initialQuantity - soldCount),
        };
    }

    // TODO should purchase assert that the player can afford?
    // Or return status indicating the player could not afford?!
    purchase(identityItem: CatalogItem.Model) {
        if (!this.config.stocks[identityItem.index]) {
            // TODO should this be a cutsom error that accepts more context?
            throw new Error("Passed CatalogItem has invalid index");
        }

        const item = this.getCatalogItem(identityItem.index, this.config.stocks[identityItem.index]);

        if (item.quantity <= 0) {
            // TODO should this be a cutsom error that accepts more context?
            throw new Error("Attempting to purchase catalog item with quantity <= 0");
        }

        if (!CatalogItem.canPlayerAfford(item)) {
            throw new Error("Attempting to purchase non-affordable catalog item");
        }

        RpgPlayerWallet.spend(item.currency, item.price);

        this.increaseSoldCount(item.key);
        deliverProduct(item.product);

        // Caller can decide to animate this I guess
        return item.product;
    }
}

function deliverProduct(product: Product) {
    switch (product.kind) {
        case "equipment":
            Rpg.character.equipment.receive(product.name);
            return;
        case "key_item":
            RpgKeyItems.Methods.receive(Rpg.character.inventory.keyItems, product.name);
            return;
        case "potion":
            // TODO
            return;
    }
}
