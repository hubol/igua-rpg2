import { Integer } from "../../lib/math/number-alias-types";
import { PseudoRng } from "../../lib/math/rng";
import { range } from "../../lib/range";

export class RpgFoodOrder {
    readonly valuablesPrice: Integer;

    constructor(private readonly _items: ReadonlyArray<RpgFoodOrder.Item>) {
        this.valuablesPrice = RpgFoodOrder.getPrice(_items);
    }

    get list() {
        return this._items;
    }

    static fromSeed({ seed, difficulty }: { seed: Integer; difficulty: RpgFoodOrder.Difficulty }): RpgFoodOrder {
        const optionLikelihood = difficulty === "normal" ? 40 : 50;
        const itemMinmum = difficulty === "normal" ? 3 : 7;
        const itemMaximum = difficulty === "normal" ? 6 : 10;

        const rng = new PseudoRng(seed);
        const itemCount = rng.intc(itemMinmum, itemMaximum);

        const items = range(itemCount).map((): RpgFoodOrder.Item => {
            const menuItem = rng.item(RpgFoodOrder.Menu.Items);
            const option = rng.intc(100) <= optionLikelihood ? rng.item(menuItem.options) : null;
            return {
                name: menuItem.name,
                option,
            };
        });

        // Ensure at least one is doubled
        items.push(rng.item(items));

        return new RpgFoodOrder(items);
    }

    private static _serialize(order: RpgFoodOrder) {
        return JSON.stringify(
            order._items
                .map(({ name, option }) => `${name}_${option}`)
                .sort(),
        );
    }

    equals(order: RpgFoodOrder): boolean {
        return RpgFoodOrder._serialize(this) === RpgFoodOrder._serialize(order);
    }
}

export namespace RpgFoodOrder {
    export type Difficulty = "normal" | "hard";

    export namespace Menu {
        interface Item {
            name: string;
            options: ReadonlyArray<string>;
        }

        export const Items = [
            {
                name: "Burger",
                options: ["W/ More Jazz", "W/ Less Rush"],
            },
            {
                name: "Taco",
                options: ["W/ Extra Fleek", "W/ Half Onion"],
            },
            {
                name: "Salad",
                options: ["W/ Peanut", "Toasted, please"],
            },
            {
                name: "Pretzel",
                options: ["W/ Enhanced Zing", "Hold the Wack"],
            },
            {
                name: "Fries",
                options: ["W/ Ting Sauce", "Bring the Heat"],
            },
            {
                name: "Gyro",
                options: ["No Charred Mayo", "Slap it Twice"],
            },
        ] as const satisfies ReadonlyArray<Item>;
    }

    export interface Item {
        name: string;
        option: string | null;
    }

    export class InProgress {
        private readonly _items: Item[] = [];

        get list(): ReadonlyArray<Item> {
            return this._items;
        }

        order(item: Item) {
            this._items.push(item);
        }

        toOrder() {
            return new RpgFoodOrder(this._items);
        }
    }

    export function getPrice(item: ReadonlyArray<Item>): Integer;
    export function getPrice(item: Item): Integer;
    export function getPrice(maybeItems: Item | ReadonlyArray<Item>) {
        if (Array.isArray(maybeItems)) {
            return maybeItems.reduce((price, item) => price + getPrice(item), 0);
        }
        return 9 + ((maybeItems as Item).option ? 4 : 0);
    }

    export function getGroupedItems(items: ReadonlyArray<Item>) {
        const counts: Record<string, { item: Item; count: Integer }> = {};

        for (const item of items) {
            const key = JSON.stringify({ name: item.name, option: item.option });
            const count = (counts[key]?.count ?? 0) + 1;
            counts[key] = { item, count };
        }

        return Object.values(counts);
    }
}
