import { Lvl } from "../../assets/generated/levels/generated-level-data";
import { show } from "../cutscene/show";
import { Input, scene } from "../globals";
import { mxnCutscene } from "../mixins/mxn-cutscene";
import { objAngelBouncing } from "../objects/enemies/obj-angel-bouncing";
import { playerObj } from "../objects/obj-player";
import { RpgProgress } from "../rpg/rpg-progress";

export function LevelTwo() {
    const level = Lvl.Potter();
    scene.stage.step(() => {
        if (Input.justWentDown('CastSpell'))
            RpgProgress.character.attributes.intelligence += 1;
    })
    level.IguanaNpc.mixin(mxnCutscene, async () => {
        await show("Go away!");
        await level.IguanaNpc.walkTo(level.IguanaNpc.x + 100);
    });

    objAngelBouncing().at(playerObj).add(40, -16).show();
    // level.UpperDoor.locked = true;
}