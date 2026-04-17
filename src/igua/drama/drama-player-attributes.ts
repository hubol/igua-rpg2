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
    let availableNameListIndex = 0;

    // TODO probably could add pagination to ask
    while (true) {
        const options = availableNames.slice(availableNameListIndex, availableNameListIndex + 7);
        const hasNextPage = options.length < availableNames.length;
        if (hasNextPage) {
            options.push("(Next page)");
        }
        const result = yield* ask("You want to change your name? These are what I have on file for you.", ...options);
        if (hasNextPage && result === options.length - 1) {
            availableNameListIndex += 7;
            if (availableNameListIndex >= availableNames.length) {
                availableNameListIndex = 0;
            }
        }
        else {
            const name = options[result + availableNameListIndex];
            Rpg.character.attributes.names.chooseNameFromAvailable(name);
            yield* announceNameChange(name);
            return;
        }
    }
}

export const DramaPlayerAttributes = {
    callName,
    chooseAvailableName,
};
