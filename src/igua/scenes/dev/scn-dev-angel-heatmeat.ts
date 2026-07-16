import { Lvl } from "../../../assets/generated/levels/generated-level-data";
import { objAngelHeatmeat } from "../../objects/enemies/obj-angel-heatmeat";

export function scnDevAngelHeatmeat() {
    Lvl.Dummy();
    objAngelHeatmeat("heat")
        .at(100, 100)
        .show();

    objAngelHeatmeat("meat")
        .at(400, 100)
        .show();
}
