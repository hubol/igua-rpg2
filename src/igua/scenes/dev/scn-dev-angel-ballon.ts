import { Lvl } from "../../../assets/generated/levels/generated-level-data";
import { objAngelBallon } from "../../objects/enemies/obj-angel-ballon";

export function scnDevAngelBallon() {
    Lvl.Dummy();
    objAngelBallon()
        .at(200, 160)
        .show();

    objAngelBallon()
        .at(260, 160)
        .show();

    objAngelBallon()
        .at(320, 160)
        .show();
}
