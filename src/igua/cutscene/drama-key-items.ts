import { DataKeyItems } from "../data/data-key-items";
import { RpgKeyItems } from "../rpg/rpg-key-items";
import { RpgProgress } from "../rpg/rpg-progress";
import { show } from "./show";

export function* receive(item: RpgKeyItems.Item) {
    RpgKeyItems.Methods.receive(RpgProgress.character.inventory.keyItems, item);
    // TODO sfx? vfx?
    yield* show(`Received KeyItem:

${DataKeyItems[item].name}`);
}

export function* remove(item: RpgKeyItems.Item) {
    RpgKeyItems.Methods.remove(RpgProgress.character.inventory.keyItems, item, 1);
    // TODO sfx? vfx?
    yield* show(`Gave KeyItem:

${DataKeyItems[item].name}`);
}

export const DramaKeyItems = {
    receive,
    remove,
};
