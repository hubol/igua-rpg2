import { Lvl } from "../../../assets/generated/levels/generated-level-data";
import { objCharacterHomunculus } from "../../objects/characters/obj-character-homunculus";

export function scnDevHomunculus() {
    const lvl = Lvl.Dummy();

    objCharacterHomunculus.ids
        .map((id, i) => {
            objCharacterHomunculus(id)
                .at(lvl.DummyMarker)
                .add(-220 + i * 70, 0)
                .show();
        });
}
