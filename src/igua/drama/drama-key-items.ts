import { objText } from "../../assets/fonts";
import { Coro } from "../../lib/game-engine/routines/coro";
import { Integer } from "../../lib/math/number-alias-types";
import { container } from "../../lib/pixi/container";
import { DataKeyItemInternalName, DataKeyItems } from "../data/data-key-items";
import { layers } from "../globals";
import { RpgKeyItems } from "../rpg/rpg-key-items";
import { RpgProgress } from "../rpg/rpg-progress";
import { ask, show } from "./show";

export function* receive(item: RpgKeyItems.Item) {
    RpgKeyItems.Methods.receive(RpgProgress.character.inventory.keyItems, item);

    // TODO sfx? vfx?
    yield* show(`Received KeyItem:
${DataKeyItems[item].name}${getCountMessage(item)}`);
}

export function* remove(item: RpgKeyItems.Item) {
    RpgKeyItems.Methods.remove(RpgProgress.character.inventory.keyItems, item, 1);
    // TODO sfx? vfx?
    yield* show(`Gave KeyItem:
${DataKeyItems[item].name}${getCountMessage(item)}`);
}

function getCountMessage(item: RpgKeyItems.Item) {
    const count = RpgKeyItems.Methods.count(RpgProgress.character.inventory.keyItems, item);
    return count < 2 ? "" : `\nNow you have ${count} of them.`;
}

const use: <TName extends DataKeyItemInternalName[]>(
    args: { items: TName },
) => Coro.Type<{ item: TName[number]; count: Integer } | null> = function* ({ items }) {
    const options = items.map(item =>
        RpgKeyItems.Methods.has(RpgProgress.character.inventory.keyItems, item, 1)
            ? (DataKeyItems[item] ?? DataKeyItems.__Unknown__).name
            : null
    );
    const itemIndex = yield* ask("What to use?", ...options, "Nothing");

    const item = items[itemIndex];

    if (item) {
        yield* remove(item);
        return { item, count: 1 };
    }

    return null;
};

export const DramaKeyItems = {
    receive,
    remove,
    use,
};
