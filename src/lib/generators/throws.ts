import { RoutinePredicate } from "./routine-generator";

export function* throws(predicate: RoutinePredicate) {
    let reason: Error | null = null;
    yield () => {
        try {
            return predicate();
        }
        catch (e) {
            reason = e as Error;
            return true;
        }
    };
    if (reason)
        throw reason;
}
