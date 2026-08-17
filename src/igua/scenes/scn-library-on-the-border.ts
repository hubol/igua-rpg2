import { Lvl } from "../../assets/generated/levels/generated-level-data";
import { range } from "../../lib/range";
import { DataPotion } from "../data/data-potion";
import { show } from "../drama/show";
import { Cutscene, scene } from "../globals";
import { playerObj } from "../objects/obj-player";

export function scnLibraryOnTheBorder() {
    const lvl = Lvl.LibraryOnTheBorder();
    lvl.EnemyBrick
        .mxnRpgStatusPotions.heldPotionIds.push(
            ...range(99).map((): DataPotion.Id => "HotDogKetchupMustardOnionRelish"),
        );

    const patrollerNpc = playerObj.x < scene.level.width / 2 ? lvl.BouncerNpc0 : lvl.BouncerNpc1;

    patrollerNpc
        .coro(function* (self) {
            while (true) {
                yield () =>
                    (self.collides(playerObj) || playerObj.collides(lvl.RejectPlayerRegion))
                    && playerObj.y <= self.y + 3;
                yield Cutscene.play(function* () {
                    yield () => self.isOnGround;
                    self.auto.facing = Math.sign(playerObj.x - self.x);
                    yield* show("You are not supposed to be up here!");
                    playerObj.speed.x = 16 * (self === lvl.BouncerNpc0 ? -1 : 1);
                    if (playerObj.isOnGround) {
                        playerObj.speed.y = -5;
                    }
                }, { speaker: self })
                    .done;
                yield () => playerObj.speed.y >= 0 && playerObj.isOnGround;
            }
        });
}
