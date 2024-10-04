import { Sprite } from "pixi.js";
import { playerObj } from "../objects/obj-player";
import { Tx } from "../../assets/textures";
import { mxnCutscene } from "../mixins/mxn-cutscene";
import { show } from "../cutscene/show";
import { Input } from "../globals";
import { Rng } from "../../lib/math/rng";
import { Lvl } from "../../assets/generated/levels/generated-level-data";
import { sleep } from "../../lib/game-engine/routines/sleep";
import { RpgProgress } from "../rpg/rpg-progress";
import { objAngelBouncing } from "../objects/enemies/obj-angel-bouncing";
import { Instances } from "../../lib/game-engine/instances";
import { objWaterDripSource } from "../objects/obj-water-drip-source";
import { mxnRpgAttack } from "../mixins/mxn-rpg-attack";
import { RpgAttack } from "../rpg/rpg-attack";
import { RpgFaction } from "../rpg/rpg-faction";
import { Jukebox } from "../core/igua-audio";
import { Mzk } from "../../assets/music";

export function scnPlayerTest() {
    Jukebox.play(Mzk.Covid19);

    Sprite.from(Tx.Placeholder).at(128, 128 - 14).mixin(mxnCutscene, function* () {
        yield* show("Hello!");
    }).show();

    const level = Lvl.Test();

    for (const dripSource of Instances(objWaterDripSource)) {
        dripSource.poison = true;
    }

    const { LockedDoor } = level;

    LockedDoor.coro(function* () {
        while (true) {
            LockedDoor.add(Rng.vunit().scale(4));
            yield sleep(60);
        }
    })
        .mixin(mxnRpgAttack, { attack: RpgAttack.create({ poison: 1, versus: RpgFaction.Anyone }) });

    objAngelBouncing().at(playerObj).add(40, -16).show();
}
