import { AsshatMicrotaskFactory } from "./asshat-microtasks";
import { AsshatZone } from "../asshat-zone";

type Predicate = () => boolean;

export function wait(predicate: Predicate): Promise<void> {
    if (predicate())
        return Promise.resolve();

    const context = AsshatZone.context;

    return new Promise<void>((resolve, reject) => {
        const microtask = AsshatMicrotaskFactory.create(predicate, context, resolve, reject);
        context.ticker.addMicrotask(microtask);
    });
}
