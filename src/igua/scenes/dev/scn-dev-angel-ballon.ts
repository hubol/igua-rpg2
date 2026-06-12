import { Lvl } from "../../../assets/generated/levels/generated-level-data";
import { objAngelBallon } from "../../objects/enemies/obj-angel-ballon";

export function scnDevAngelBallon() {
    Lvl.Dummy();
    objAngelBallon()
        .at(100, 100)
        .show();
}
