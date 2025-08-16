import { Integer } from "../../lib/math/number-alias-types";
import { ForceAliasType } from "../../lib/types/force-alias-type";
import { DataShop } from "../data/data-shop";
import { RpgInventory } from "./rpg-inventory";
import { RpgPlayerWallet } from "./rpg-player-wallet";

export class RpgShops {
    private readonly _cache: Partial<Record<DataShop.Id, RpgShop>> = {};

    constructor(
        private readonly _state: RpgShops.State,
        private readonly _wallet: RpgPlayerWallet,
        private readonly _inventory: RpgInventory,
    ) {
    }

    getById(shopId: DataShop.Id) {
        const cache = this._cache[shopId];

        if (cache) {
            return cache;
        }

        const shopState = this._state[shopId] ?? (this._state[shopId] = RpgShop.createState());
        return this._cache[shopId] = new RpgShop(shopState, DataShop.getById(shopId), this._wallet, this._inventory);
    }

    static createState(): RpgShops.State {
        return {};
    }
}

module RpgShops {
    export type State = Partial<Record<DataShop.Id, RpgShop.State>>;
}

export class RpgShop {
    readonly stocks: ReadonlyArray<RpgStock>;

    constructor(
        private readonly _state: RpgShop.State,
        private readonly _data: DataShop.Model,
        private readonly _wallet: RpgPlayerWallet,
        private readonly _inventory: RpgInventory,
    ) {
        this.stocks = StockKey.createStockKeys(this._data.stocks).map(({ key, stock }) =>
            new RpgStock(this._state, key, stock, this._wallet, this._inventory)
        );
    }

    static createState(): RpgShop.State {
        return {
            stockSales: {},
        };
    }
}

module RpgShop {
    export interface State {
        stockSales: Record<StockKey.Model, Integer>;
    }
}

export class RpgStock {
    constructor(
        private readonly _shopState: RpgShop.State,
        private readonly _key: StockKey.Model,
        private readonly _data: DataShop.Stock,
        private readonly _wallet: RpgPlayerWallet,
        private readonly _inventory: RpgInventory,
    ) {
    }

    private _getSoldCount() {
        return this._shopState.stockSales[this._key] ?? 0;
    }

    private _increaseSoldCount() {
        this._shopState.stockSales[this._key] = this._getSoldCount() + 1;
    }

    get currency() {
        return this._data.price.currency;
    }

    get isSoldOut() {
        return this.quantity < 1;
    }

    get price() {
        return this._data.price.initial
            + Math.max(0, Math.min(this._getSoldCount(), this._data.initialQuantity - 1)) * this._data.price.deltaSold;
    }

    get product() {
        return this._data.product;
    }

    get quantity() {
        return Math.max(0, this._data.initialQuantity - this._getSoldCount());
    }

    // TODO should purchase assert that the player can afford?
    // Or return status indicating the player could not afford?!
    purchase() {
        if (this.isSoldOut) {
            // TODO should this be a cutsom error that accepts more context?
            throw new Error("Attempting to purchase stock when sold out");
        }

        if (!this._wallet.canAfford(this)) {
            throw new Error("Attempting to purchase non-affordable stock");
        }

        this._wallet.spend(this.currency, this.price);

        this._increaseSoldCount();
        this._inventory.receive(this.product);

        // Caller can decide to animate this I guess
        return this.product;
    }
}

namespace StockKey {
    export function createStockKeys(stocks: DataShop.Stock[]) {
        const partialKeyCounts: Record<string, Integer> = {};

        return stocks.map(stock => {
            const partialKey = computePartialKey(stock);
            const count = partialKeyCounts[partialKey] ?? 0;

            partialKeyCounts[partialKey] = count + 1;

            return {
                key: `${partialKey}__${count}` as StockKey.Model,
                stock,
            };
        });
    }

    function computePartialKey(stock: DataShop.Stock) {
        const currencyKey = stock.price.currency;
        const productKey = computeProductKey(stock.product);

        return `${currencyKey}__${productKey}`;
    }

    function computeProductKey(product: DataShop.Product) {
        return product.id;
    }

    export type Model = ForceAliasType<string>;
}
