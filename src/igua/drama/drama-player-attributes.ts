import { objFxNameChange } from "../objects/effects/obj-fx-name-change";
import { playerObj } from "../objects/obj-player";
import { Rpg } from "../rpg/rpg";

function* setName(name: string) {
    if (Rpg.character.attributes.name === name) {
        return;
    }

    Rpg.character.attributes.name = name;

    const fxNameChangeObj = objFxNameChange(name)
        .at(playerObj)
        .show();

    yield () => fxNameChangeObj.destroyed;
}

export const DramaPlayerAttributes = {
    setName,
};
