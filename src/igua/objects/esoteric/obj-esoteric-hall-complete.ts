import { Sfx } from "../../../assets/sounds";
import { onPrimitiveMutate } from "../../../lib/game-engine/routines/on-primitive-mutate";
import { sleep, sleepf } from "../../../lib/game-engine/routines/sleep";
import { container } from "../../../lib/pixi/container";
import { Cutscene } from "../../globals";
import { mxnMotion } from "../../mixins/mxn-motion";
import { MicrocosmHallOfDoors } from "../../rpg/microcosms/microcosm-hall-of-doors";
import { FxPattern } from "../effects/lib/fx-pattern";
import { objFxSparkle24Px } from "../effects/obj-fx-sparkle-24px";
import { playerObj } from "../obj-player";

export function objEsotericHallComplete(cosmDoors: MicrocosmHallOfDoors) {
    return container()
        .coro(function* (self) {
            yield sleepf(1);
            yield () => !cosmDoors.isComplete && cosmDoors.areDoorsComplete;
            yield onPrimitiveMutate(() => Math.sign(playerObj.x - self.x));
            Cutscene.play(function* () {
                const burstObj = container()
                    .at(self)
                    .show();

                Sfx.Cutscene.Hall.Complete.play();

                for (const node of FxPattern.getRadialBurst({ radius: 0, rotation: 0, count: 16 })) {
                    const sparkleObj = objFxSparkle24Px()
                        .at(node.position)
                        .mixin(mxnMotion)
                        .step(self => self.speed.vlength += 0.01)
                        .show(burstObj);

                    sparkleObj.speed.at(node.normal);
                }

                yield sleep(1000);
                yield* cosmDoors.dramaComplete();
            }, { speaker: self });
        });
}
