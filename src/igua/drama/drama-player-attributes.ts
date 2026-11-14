import { objFxNameChange } from "../objects/effects/obj-fx-name-change";
import { playerObj } from "../objects/obj-player";
import { Rpg } from "../rpg/rpg";
import { ask } from "./show";

function* announceNameChange(name: string) {
    const fxNameChangeObj = objFxNameChange(name)
        .at(playerObj)
        .show();

    yield () => fxNameChangeObj.destroyed;
}

function* callName(name: string) {
    if (!Rpg.character.attributes.names.onCalledName(name)) {
        return;
    }

    yield* announceNameChange(name);
}

function* chooseAvailableName() {
    const availableNames = Rpg.character.attributes.names.availableList;

    const playerReallyWantsToChange = yield* ask(`Currently your name is: ${Rpg.character.attributes.names.current}

Do you want to change it?`);

    if (!playerReallyWantsToChange) {
        return;
    }

    const result = yield* ask("These are the names I have on file for you.", ...availableNames);
    const name = availableNames[result];
    Rpg.character.attributes.names.chooseNameFromAvailable(name);
    yield* announceNameChange(name);
}

export const DramaPlayerAttributes = {
    callName,
    chooseAvailableName,
};
