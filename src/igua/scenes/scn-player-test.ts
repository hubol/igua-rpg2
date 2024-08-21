import { Sprite } from "pixi.js";
import { playerObj } from "../objects/obj-player";
import { Tx } from "../../assets/textures";
import { mxnCutscene } from "../mixins/mxn-cutscene";
import { show } from "../cutscene/show";
import { Input } from "../globals";
import { Rng } from "../../lib/math/rng";
import { Lvl } from "../../assets/generated/levels/generated-level-data";
import { sleep } from "../../lib/game-engine/promise/sleep";
import { RpgProgress } from "../rpg/rpg-progress";
import { objAngelBouncing } from "../objects/enemies/obj-angel-bouncing";
import { Instances } from "../../lib/game-engine/instances";
import { objWaterDripSource } from "../objects/obj-water-drip-source";
import { mxnRpgAttack } from "../mixins/mxn-rpg-attack";
import { RpgAttack } from "../rpg/rpg-attack";
import { RpgFaction } from "../rpg/rpg-faction";
import { objPuddle } from "../objects/nature/obj-puddle";

export function scnPlayerTest() {
    Sprite.from(Tx.Placeholder).at(128, 128 - 14).mixin(mxnCutscene, async () => {
        await show('Hello!');
    }).show();

    const level = Lvl.Test();

    for (const dripSource of Instances(objWaterDripSource)) {
        dripSource.poison = true;
    }

    const { LockedDoor, asdf } = level;

    LockedDoor.async(async () => {
        while (true) {
            LockedDoor.add(Rng.vunit().scale(4));
            await sleep(60);
        }
    })
    .mixin(mxnRpgAttack, { attack: RpgAttack.create({ poison: 1, versus: RpgFaction.Anyone }) });

    playerObj.step(() => {
        if (Input.justWentDown('Jump'))
            console.log(JSON.parse(JSON.stringify(RpgProgress)))
    })

    objAngelBouncing().at(playerObj).add(40, -16).show();

    {
        const x = asdf.x - 16;
        const y = asdf.y + 16;
        const width = LockedDoor.x + 16 - x;
        const height = 3;

        objPuddle(width, height).at(x, y).show();
    }
}
