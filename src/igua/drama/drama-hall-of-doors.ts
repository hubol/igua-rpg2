import { sleep } from "../../lib/game-engine/routines/sleep";
import { MicrocosmHallOfDoors } from "../rpg/microcosms/microcosm-hall-of-doors";
import { DramaGifts } from "./drama-gifts";

function* complete(cosmHallOfDoors: MicrocosmHallOfDoors, index: MicrocosmHallOfDoors.Index) {
    yield sleep(1000);
    const gift = cosmHallOfDoors.getGift(index);
    if (gift.isGiveable()) {
        yield* DramaGifts.give(gift);
    }
    yield sleep(1000);
    cosmHallOfDoors.homeSceneChanger.changeScene();
}

export const DramaHallOfDoors = {
    complete,
};
