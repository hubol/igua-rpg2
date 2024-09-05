import { AsshatMicrotaskFactory } from "./asshat-microtasks";
import { AsshatZone } from "../asshat-zone";

type Predicate = () => boolean;

export function wait(predicate: Predicate, $c?) {
    if (predicate())
        return Promise.resolve();

    return new Promise<void>((resolve, reject) => {
        const microtask = AsshatMicrotaskFactory.create(predicate, $c, resolve, reject);
        $c.ticker.addMicrotask(microtask);
    });
}
