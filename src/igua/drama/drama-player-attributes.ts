import { objFxNameChange } from "../objects/effects/obj-fx-name-change";
import { playerObj } from "../objects/obj-player";
import { Rpg } from "../rpg/rpg";

function* callName(name: string) {
    if (!Rpg.character.attributes.names.onCalledName(name)) {
        return;
    }

    const fxNameChangeObj = objFxNameChange(name)
        .at(playerObj)
        .show();

    yield () => fxNameChangeObj.destroyed;
}

export const DramaPlayerAttributes = {
    callName,
};
