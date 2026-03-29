import { DataPotion } from "../data/data-potion";
import { objUsedPotion } from "../mixins/mxn-rpg-status-potions";
import { playerObj } from "../objects/obj-player";

function* useOnPlayer(potionId: DataPotion.Id) {
    const potionObj = objUsedPotion(potionId, playerObj).show();
    yield () => potionObj.destroyed;
}

export const DramaPotions = {
    useOnPlayer,
};
