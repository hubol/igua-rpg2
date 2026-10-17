import { Lvl } from "../../../assets/generated/levels/generated-level-data";
import { objCharacterHomunculus } from "../../objects/characters/obj-character-homunculus";

export function scnDevHomunculus() {
    const lvl = Lvl.Dummy();

    objCharacterHomunculus("skies").at(lvl.DummyMarker).show();
}
