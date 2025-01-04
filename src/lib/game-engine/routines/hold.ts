import { Coro } from "./coro";

export function holdf(predicate: Coro.Predicate, frameCount: number) {
    let currentCount = frameCount;
    return () => {
        if (predicate()) {
            currentCount--;
            return currentCount <= 0;
        }
        currentCount = frameCount;
        return false;
    };
}
