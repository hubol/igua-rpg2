import { DisplayObject } from "pixi.js";
import { Instances } from "../../lib/game-engine/instances";
import { sleep } from "../../lib/game-engine/routines/sleep";
import { Rng } from "../../lib/math/rng";
import { DataFact } from "../data/data-fact";
import { Cutscene } from "../globals";
import { MxnFxFigureTransfer } from "../mixins/effects/mxn-fx-figure-transfer";
import { mxnPhysics } from "../mixins/mxn-physics";
import { objFxFactNew } from "../objects/effects/obj-fx-fact-new";
import { objIguanaNpc } from "../objects/obj-iguana-npc";
import { playerObj } from "../objects/obj-player";
import { Rpg } from "../rpg/rpg";
import { DramaFacts } from "./drama-facts";
import { ask, show } from "./show";

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
                    .mixin(mxnMakesTargetBounce, npcObj)
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

function* teachSingleFact(prompt: string) {
    yield* show(prompt);
    const facts = Rng.shuffle([...Rpg.character.facts.memorized])
        .slice(0, 6)
        .map(id => DataFact.getById(id));

    if (facts.length === 0) {
        yield* ask(prompt, "Don't know any...");
        return false;
    }

    const index = yield* ask(prompt, ...facts.map(fact => fact.heading));

    const speakerObj = Cutscene.current?.attributes.speaker!;
    Cutscene.setCurrentSpeaker(playerObj);

    yield* show(...facts[index].messages);
    const fxFactObj = DramaFacts.objFxFact(speakerObj)
        .mixin(mxnMakesTargetBounce, speakerObj)
        .at(playerObj)
        .show();

    yield () => fxFactObj.destroyed;

    Cutscene.setCurrentSpeaker(speakerObj);
    return true;
}

function mxnMakesTargetBounce(obj: MxnFxFigureTransfer, targetObj: DisplayObject | null) {
    return obj.handles("mxnFigureTransfer:transfered", (self) => {
        if (targetObj?.is(mxnPhysics)) {
            targetObj.speed.y = -2;
        }
        objFxFactNew.objFxBurst().at(self).show();
        self.destroy();
    });
}

export const DramaClassroom = {
    teach,
    teachSingleFact,
};
