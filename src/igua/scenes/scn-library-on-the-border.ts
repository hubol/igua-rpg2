import { Lvl } from "../../assets/generated/levels/generated-level-data";
import { sleep } from "../../lib/game-engine/routines/sleep";
import { range } from "../../lib/range";
import { DataPotion } from "../data/data-potion";
import { ask, show } from "../drama/show";
import { Cutscene, scene } from "../globals";
import { mxnCutscene } from "../mixins/mxn-cutscene";
import { mxnSinePivot } from "../mixins/mxn-sine-pivot";
import { playerObj } from "../objects/obj-player";

export function scnLibraryOnTheBorder() {
    const lvl = Lvl.LibraryOnTheBorder();

    [
        ...lvl.WaterGroup.children,
        ...lvl.BehindWaterGroup.children,
    ]
        .forEach(obj => obj.mixin(mxnSinePivot));

    const playerCameFromIndiana = playerObj.x < scene.level.width / 2;
    const patrollerNpc = playerCameFromIndiana ? lvl.BouncerNpc0 : lvl.BouncerNpc1;
    const librarianNpc = lvl.IndianaLibrarianNpc;

    lvl.EnemyBrick
        .mxnRpgStatusPotions.heldPotionIds.push(
            ...range(99).map((): DataPotion.Id => "HotDogKetchupMustardOnionRelish"),
        );

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

    lvl.IndianaLibrarianNpc
        .mixin(mxnCutscene, function* () {
            yield* show(
                "Welcome to the library on the border!",
                "Please have a look around.",
            );

            const result = yield* ask(
                "Is there anything I can help you with?",
                "What is going on here?",
                "I want to learn about fighting",
                "I want to learn about angels",
                "I want to learn about shoes",
            );

            if (result === 0) {
                yield* show(
                    "This is the library between Indiana and Ohio.",
                    "Right now there is a leak on the roof and we are attempting to make repairs.",
                    "Please leave the guys up there alone. It is not an easy job.",
                );
            }
            else if (result === 1) {
                yield* show(
                    "OK, give me one moment and I will highlight the books you should check out if you are interested in combat.",
                );
                yield sleep(1000);
                // TODO ok
                yield* show("OK, that should be all of them. Enjoy!");
            }
        });
}
