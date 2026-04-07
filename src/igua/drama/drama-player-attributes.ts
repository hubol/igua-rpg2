import { Rpg } from "../rpg/rpg";

function* setName(name: string) {
    if (Rpg.character.attributes.name === name) {
        return;
    }

    Rpg.character.attributes.name = name;
}

export const DramaPlayerAttributes = {
    setName,
};
