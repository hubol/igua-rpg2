import { Lvl } from "../../../assets/generated/levels/generated-level-data";
import { objAngelPuller } from "../../objects/enemies/obj-angel-puller";
import { playerObj } from "../../objects/obj-player";
import { Rpg } from "../../rpg/rpg";

export function scnDevPuller() {
    Rpg.character.position.currentRegionId = Rpg.character.startingRegionId;
    Lvl.Dummy();

    objAngelPuller()
        .at(250, playerObj.y)
        .show();
}
