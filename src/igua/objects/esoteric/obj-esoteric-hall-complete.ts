import { Sfx } from "../../../assets/sounds";
import { onPrimitiveMutate } from "../../../lib/game-engine/routines/on-primitive-mutate";
import { sleep, sleepf } from "../../../lib/game-engine/routines/sleep";
import { container } from "../../../lib/pixi/container";
import { Cutscene } from "../../globals";
import { MicrocosmHallOfDoors } from "../../rpg/microcosms/microcosm-hall-of-doors";
import { objFxSparkle24Px } from "../effects/obj-fx-sparkle-24px";
import { playerObj } from "../obj-player";

export function objEsotericHallComplete(cosmDoors: MicrocosmHallOfDoors) {
    return container()
        .coro(function* (self) {
            yield sleepf(1);
            yield () => !cosmDoors.isComplete && cosmDoors.areDoorsComplete;
            yield onPrimitiveMutate(() => Math.sign(playerObj.x - self.x));
            Cutscene.play(function* () {
                Sfx.Cutscene.Hall.Complete.play();

                objFxSparkle24Px.objFxBurst()
                    .at(self)
                    .show();

                yield sleep(1000);
                yield* cosmDoors.dramaComplete();
            }, { speaker: self });
        });
}
