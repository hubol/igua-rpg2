import { AsshatZoneContext, assertAsshatZoneContext } from "../asshat-zone";
import { AsshatMicrotaskFactory } from "./asshat-microtasks";

type Predicate = () => boolean;

export function wait(predicate: Predicate, $c?: AsshatZoneContext) {
    if (predicate())
        return Promise.resolve();

    $c = assertAsshatZoneContext($c);

    return new Promise<void>((resolve, reject) => {
        const microtask = AsshatMicrotaskFactory.create(predicate, $c!, resolve, reject);
        $c!.ticker.addMicrotask(microtask);
    });
}
