import { Sprite } from "pixi.js";
import { createPlayerObj, playerObj } from "../objects/obj-player";
import { Tx } from "../../assets/textures";
import { mxnCutscene } from "../mixins/mxn-cutscene";
import { show } from "../cutscene/show";
import { objPipe, objPipeSlope, objSolidBlock, objSolidSlope } from "../objects/obj-terrain";
import { Input, layers, scene } from "../globals";
import { Rng } from "../../lib/math/rng";
import { container } from "../../lib/pixi/container";
import { NoAtlasTx } from "../../assets/no-atlas-textures";
import { Lvl } from "../../assets/generated/levels/generated-level-data";
import { sleep } from "../../lib/game-engine/promise/sleep";
import { objStatusBar } from "../objects/obj-status-bar";
import { RpgProgress } from "../rpg/rpg-progress";
import { objAngelBouncing } from "../objects/enemies/obj-angel-bouncing";
import { Instances } from "../../lib/game-engine/instances";
import { objWaterDripSource } from "../objects/obj-water-drip-source";

export function PlayerTest() {
    Sprite.from(Tx.Placeholder).at(128, 128 - 14).mixin(mxnCutscene, async () => {
        await show('Hello!');
    }).show();

    const level = Lvl.Test();

    for (const dripSource of Instances(objWaterDripSource)) {
        dripSource.poison = true;
    }

    const { LockedDoor } = level;

    LockedDoor.async(async () => {
        while (true) {
            LockedDoor.add(Rng.vunit().scale(4));
            await sleep(60);
        }
    });

    playerObj.step(() => {
        if (Input.justWentDown('CastSpell')) {
            playerObj.heal(20);
            playerObj.poison(20);
        }
        // if (playerObj.collides(LockedDoor) && Rng.float() > 0.9) {
        //     playerObj.poison(10);
        // }
        if (playerObj.collides(LockedDoor)) {
            playerObj.poison(1);
        }
        if (Input.justWentDown('InventoryMenuToggle')) {
            playerObj.damage(20);
        }
        if (Input.justWentDown('Jump'))
            console.log(JSON.parse(JSON.stringify(RpgProgress)))
    })

    objAngelBouncing().at(playerObj).add(40, -16).show();
}
