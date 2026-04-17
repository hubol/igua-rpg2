import { Lvl, LvlType } from "../../assets/generated/levels/generated-level-data";
import { Mzk } from "../../assets/music";
import { Jukebox } from "../core/igua-audio";
import { DramaInventory } from "../drama/drama-inventory";
import { DramaPlayerAttributes } from "../drama/drama-player-attributes";
import { show } from "../drama/show";
import { Cutscene, scene } from "../globals";
import { playerObj } from "../objects/obj-player";
import { StepOrder } from "../objects/step-order";
import { Rpg } from "../rpg/rpg";
import { RpgInventory } from "../rpg/rpg-inventory";

export function scnIndianaDesert() {
    Jukebox.play(Mzk.RiceRoyalty);
    const lvl = Lvl.IndianaDesert();

    lvl.FrontCactusGroup
        .step(
            self => self.pivot.x = Math.round(scene.camera.x * 0.95),
            StepOrder.Camera,
        );

    enrichNerdBouncer(lvl);
}

function enrichNerdBouncer(lvl: LvlType.IndianaDesert) {
    const flagDesert = Rpg.flags.desert;

    lvl.NerdBouncerRegion
        .coro(function* (self) {
            if (flagDesert.nerdBouncerSatiated) {
                return;
            }

            const sign = Math.sign(playerObj.x - self.x);
            const unit = sign === -1 ? 0 : 1;

            while (true) {
                yield () => playerObj.collides(self) && Math.sign(playerObj.speed.x) === -sign;
                playerObj.speed.x = 0;
                yield Cutscene.play(
                    function* () {
                        const hasRobot = Rpg.inventory.keyItems.has("TeenerBot", 1);

                        yield* show("Babygirl! Yo, babygirl!");

                        if (!hasRobot) {
                            yield* show("I'm sorry, you can't go this way. Nerds only.");
                            yield* playerObj.walkTo(self.x - 40 + unit * (self.width + 80));
                        }

                        if (hasRobot) {
                            yield* show("I'm sorry, you can't go this way. Nerds o--");
                            const item: RpgInventory.RemovableItem = { kind: "key_item", id: "TeenerBot" };
                            yield* DramaInventory.removeCount(item, 1);
                            yield* show(
                                "Holy F! A teener bot?!",
                                "You are a neeeerd!",
                                "I love it.",
                            );
                            yield* DramaInventory.receiveItems([item]);
                            yield* show("You can have it back. You can pass here freely now :-)");
                            flagDesert.nerdBouncerSatiated = true;
                            self.destroy();
                        }

                        yield* DramaPlayerAttributes.callName("Babygirl");
                    },
                    { speaker: lvl.NerdBouncerNpc },
                ).done;
            }
        });

    lvl.NerdBouncerNpc
        .step(self => self.auto.facing = Math.sign(playerObj.x - self.x) || 1);
}
