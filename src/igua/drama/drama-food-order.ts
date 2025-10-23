import { Rng } from "../../lib/math/rng";
import { RpgFoodOrder } from "../rpg/rpg-food-order";
import { ask, show } from "./show";

const englishCounts = ["Zero ", "", "Two ", "Three ", "Four ", "Five ", "Six ", "Seven ", "Eight ", "Nine "];

function* explainOrder(order: RpgFoodOrder) {
    const groupedItems = RpgFoodOrder.getGroupedItems(order.list);

    yield* show(
        `I would like the following ${order.list.length} items:`,
        ...groupedItems.map(({ count, item: { name, option } }) =>
            `        ${englishCounts[count]}${name}${!name.endsWith("s") && count > 1 ? "s" : ""}
    ${option ? option : ""}`
        ),
    );
}

function* requestOrderFromPlayer() {
    const seed = Rng.intc(100_000, 990_000_000);
    const order = RpgFoodOrder.fromSeed(seed, "normal");

    while (true) {
        yield* explainOrder(order);

        if (yield* ask("Do you need to hear that again?")) {
            continue;
        }

        break;
    }

    return { seed, order };
}

function* buildOrderAtRestaurant(inProgressOrder: RpgFoodOrder.InProgress) {
    while (true) {
        const result = yield* ask(
            inProgressOrder.list.length === 0 ? "What can I get for you?" : "Anything else?",
            ...RpgFoodOrder.Menu.Items.map(item => item.name),
            inProgressOrder.list.length === 0 ? "Nevermind" : "That's all",
        );

        const menuItem = RpgFoodOrder.Menu.Items[result];

        if (menuItem) {
            const result = yield* ask(
                `${menuItem.name}? Any modifications to that?`,
                "No modifications",
                ...menuItem.options,
            );

            const option = menuItem.options[result - 1] ?? null;

            inProgressOrder.order({ name: menuItem.name, option });
            continue;
        }

        return { order: inProgressOrder.toOrder() };
    }
}

export const DramaFoodOrder = {
    explainOrder,
    requestOrderFromPlayer,
    buildOrderAtRestaurant,
};
