import { Lvl } from "../../../assets/generated/levels/generated-level-data";
import { objAngelPuller } from "../../objects/enemies/obj-angel-puller";
import { playerObj } from "../../objects/obj-player";

export function scnDevPuller() {
    Lvl.Dummy();

    objAngelPuller()
        .at(250, playerObj.y)
        .show();
}
