import { Logging } from "../../lib/logging";
import { RpgFactory } from "./rpg-factory";
import { getInitialRpgProgress, RpgProgressData } from "./rpg-progress";

export let Rpg: Rpg.Public = RpgFactory.create(getInitialRpgProgress());

namespace Rpg {
    export type Private = RpgFactory.Type;
    export type Public = Omit<Private, "__private__">;
}

export function setRpgProgressData(data: RpgProgressData) {
    Rpg = RpgFactory.create(data);
    console.log(...Logging.componentArgs("Rpg", Rpg));
}

export function devGetRpgProgressData(): RpgProgressData {
    const { __private__: { data } } = Rpg as Rpg.Private;
    return data;
}
