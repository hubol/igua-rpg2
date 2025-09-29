import { DataFact } from "../data/data-fact";
import { Rpg } from "../rpg/rpg";
import { show } from "./show";

function* memorize(factId: DataFact.Id, ...messages: string[]) {
    if (messages.length === 0) {
        messages = DataFact.getById(factId).messages;
    }

    const [message, ...rest] = messages;
    yield* show(message, ...rest);

    const result = Rpg.character.facts.memorize(factId);

    if (result.accepted) {
        // TODO FX
    }
    else {
        if (result.reason === "already_memorized") {
            // no-op
        }
        else {
            // TODO FX
        }
    }
}

export const DramaFacts = {
    memorize,
};
