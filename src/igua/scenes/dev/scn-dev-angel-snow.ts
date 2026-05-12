import { Lvl } from "../../../assets/generated/levels/generated-level-data";
import { objAngelSnow } from "../../objects/enemies/obj-angel-snow";

export function scnDevAngelSnow() {
    Lvl.Dummy();

    objAngelSnow().at(128, 128).show();
}
