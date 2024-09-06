import { RoutineGenerator } from "../../generators/routine-generator";

type Predicate = () => boolean;

export function* wait(predicate: Predicate): RoutineGenerator<void> {
    while (!predicate())
        yield;

    if (predicate())
        return;
}
