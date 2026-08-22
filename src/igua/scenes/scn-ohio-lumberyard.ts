import { Lvl } from "../../assets/generated/levels/generated-level-data";
import { objCharacterForestSpirit } from "../objects/characters/obj-character-forest-spirit";

export function scnOhioLumberyard() {
    const lvl = Lvl.OhioLumberyard();

    objCharacterForestSpirit().at(lvl.DevSpiritMarker).show();
}
