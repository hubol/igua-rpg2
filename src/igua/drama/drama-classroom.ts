import { Instances } from "../../lib/game-engine/instances";
import { sleep } from "../../lib/game-engine/routines/sleep";
import { DataFact } from "../data/data-fact";
import { Cutscene } from "../globals";
import { objFxFactNew } from "../objects/effects/obj-fx-fact-new";
import { objIguanaNpc } from "../objects/obj-iguana-npc";
import { playerObj } from "../objects/obj-player";
import { Rpg } from "../rpg/rpg";
import { DramaFacts } from "./drama-facts";
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

            const npcObjs = Instances(objIguanaNpc);

            for (let i = 0; i < npcObjs.length; i++) {
                const npcObj = npcObjs[i];

                const fxFactObj = DramaFacts.objFxFact(npcObj)
                    .handles("mxnFigureTransfer:transfered", (self) => {
                        npcObj.speed.y = -2;
                        objFxFactNew.objFxBurst().at(self).show();
                        self.destroy();
                    })
                    .at(playerObj)
                    .add(i * -20, 0)
                    .show();

                if (i === npcObjs.length - 1) {
                    yield () => fxFactObj.destroyed;
                }
                else {
                    yield sleep(200);
                }
            }
        }
    }

    yield sleep(1000);

    yield* show("And that concludes my lecture.");
}

export const DramaClassroom = {
    teach,
};
