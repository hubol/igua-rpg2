import { Container } from "pixi.js";
import { DataPotion } from "../data/data-potion";
import { objUsedPotion } from "../mixins/mxn-rpg-status-potions";
import { playerObj } from "../objects/obj-player";

function* useOnPlayer(potionId: DataPotion.Id) {
    yield* useOnTarget(potionId, playerObj);
}

function* useOnTarget(potionId: DataPotion.Id, targetObj: Container) {
    const potionObj = objUsedPotion(potionId, targetObj).show();
    yield () => potionObj.destroyed;
}

export const DramaPotions = {
    useOnPlayer,
    useOnTarget,
};
