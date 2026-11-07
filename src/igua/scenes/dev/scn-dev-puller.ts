import { Lvl } from "../../../assets/generated/levels/generated-level-data";
import { scene } from "../../globals";
import { objAngelMiffed } from "../../objects/enemies/obj-angel-miffed";
import { objAngelPuller } from "../../objects/enemies/obj-angel-puller";
import { playerObj } from "../../objects/obj-player";
import { Rpg } from "../../rpg/rpg";

export function scnDevPuller() {
    Rpg.character.position.currentRegionId = Rpg.character.startingRegionId;
    Lvl.DummyWide();

    objAngelPuller()
        .at(scene.level.width / 2, playerObj.y)
        .show();

    objAngelMiffed("level2")
        .at(Math.round(scene.level.width * 0.75), playerObj.y)
        .show();
}
