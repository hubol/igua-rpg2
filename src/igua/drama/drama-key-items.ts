import { objText } from "../../assets/fonts";
import { Coro } from "../../lib/game-engine/routines/coro";
import { Integer } from "../../lib/math/number-alias-types";
import { container } from "../../lib/pixi/container";
import { DataKeyItem } from "../data/data-key-item";
import { layers } from "../globals";
import { RpgKeyItems } from "../rpg/rpg-key-items";
import { RpgProgress } from "../rpg/rpg-progress";
import { ask, show } from "./show";

export function* receive(item: RpgKeyItems.Item) {
    RpgKeyItems.Methods.receive(RpgProgress.character.inventory.keyItems, item);

    // TODO sfx? vfx?
    yield* show(`Received KeyItem:
${DataKeyItem.getById(item).name}${getCountMessage(item)}`);
}

export function* remove(item: RpgKeyItems.Item) {
    RpgKeyItems.Methods.remove(RpgProgress.character.inventory.keyItems, item, 1);
    // TODO sfx? vfx?
    yield* show(`Gave KeyItem:
${DataKeyItem.getById(item).name}${getCountMessage(item)}`);
}

function getCountMessage(item: RpgKeyItems.Item) {
    const count = RpgKeyItems.Methods.count(RpgProgress.character.inventory.keyItems, item);
    return count < 2 ? "" : `\nNow you have ${count} of them.`;
}

const use: <TKeyItemId extends DataKeyItem.Id[]>(
    args: { keyItemIds: TKeyItemId },
) => Coro.Type<{ keyItemId: TKeyItemId[number]; count: Integer } | null> = function* ({ keyItemIds }) {
    const options = keyItemIds.map(id =>
        RpgKeyItems.Methods.has(RpgProgress.character.inventory.keyItems, id, 1)
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
