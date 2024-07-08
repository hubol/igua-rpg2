import { Lvl } from "../../assets/generated/levels/generated-level-data";
import { Input, scene } from "../globals";
import { RpgProgress } from "../rpg/rpg-progress";

export function LevelTwo() {
    const level = Lvl.Potter();
    scene.stage.step(() => {
        if (Input.justWentDown('CastSpell'))
            RpgProgress.character.attributes.intelligence += 1;
    })
    // level.UpperDoor.locked = true;
}