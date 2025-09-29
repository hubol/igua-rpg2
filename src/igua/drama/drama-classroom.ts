import { DataFact } from "../data/data-fact";
import { Cutscene } from "../globals";
import { playerObj } from "../objects/obj-player";
import { Rpg } from "../rpg/rpg";
import { show } from "./show";

function* teach(classroomId: string) {
    const classroom = Rpg.classroom(classroomId);

    Cutscene.setCurrentSpeaker(playerObj);

    if (!classroom.canAnyBeTaught(Rpg.character.facts.memorized)) {
        yield* show("Class, I don't have any new facts to teach you right now.");
        return;
    }

    yield* show("Class, listen carefully, I am going to teach you some facts.");

    for (const factId of Rpg.character.facts.memorized) {
        if (classroom.teach(factId).accepted) {
            const [message, ...messages] = DataFact.getById(factId).messages;
            yield* show(message, ...messages);
        }
    }

    yield* show("And that concludes my lecture.");
}

export const DramaClassroom = {
    teach,
};
