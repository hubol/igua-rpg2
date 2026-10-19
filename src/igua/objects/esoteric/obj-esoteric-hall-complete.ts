import { container } from "../../../lib/pixi/container";
import { Cutscene } from "../../globals";
import { MicrocosmHallOfDoors } from "../../rpg/microcosms/microcosm-hall-of-doors";

export function objEsotericHallComplete(cosmDoors: MicrocosmHallOfDoors) {
    return container()
        .coro(function* () {
            yield () => !cosmDoors.isComplete && cosmDoors.areDoorsComplete;
            Cutscene.play(function* () {
                // TODO FX
                yield* cosmDoors.dramaComplete();
            });
        });
}
