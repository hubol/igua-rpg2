import { objText } from "../../assets/fonts";
import { Coro } from "../../lib/game-engine/routines/coro";
import { Integer } from "../../lib/math/number-alias-types";
import { container } from "../../lib/pixi/container";
import { DataKeyItem } from "../data/data-key-item";
import { layers } from "../globals";
import { Rpg } from "../rpg/rpg";
import { RpgKeyItems } from "../rpg/rpg-key-items";
import { ask, show } from "./show";

export function* receive(item: RpgKeyItems.Item) {
    Rpg.inventory.keyItems.receive(item);

    // TODO sfx? vfx?
    yield* show(`Received KeyItem:
${DataKeyItem.getById(item).name}${getCountMessage(item)}`);
}

export function* remove(item: RpgKeyItems.Item) {
    Rpg.inventory.keyItems.remove(item, 1);
    // TODO sfx? vfx?
    yield* show(`Gave KeyItem:
${DataKeyItem.getById(item).name}${getCountMessage(item)}`);
}

function getCountMessage(item: RpgKeyItems.Item) {
    const count = Rpg.inventory.keyItems.count(item);
    return count < 2 ? "" : `\nNow you have ${count} of them.`;
}

const use: <TKeyItemId extends DataKeyItem.Id[]>(
    args: { keyItemIds: TKeyItemId },
) => Coro.Type<{ keyItemId: TKeyItemId[number]; count: Integer } | null> = function* ({ keyItemIds }) {
    const options = keyItemIds.map(id =>
        Rpg.inventory.keyItems.has(id, 1)
            ? DataKeyItem.getById(id).name
            : null
    );
    const itemIndex = yield* ask("What to use?", ...options, "Nothing");

    const keyItemId = keyItemIds[itemIndex];

    if (keyItemId) {
        yield* remove(keyItemId);
        return { keyItemId, count: 1 };
    }

    return null;
};

export const DramaKeyItems = {
    receive,
    remove,
    use,
};
