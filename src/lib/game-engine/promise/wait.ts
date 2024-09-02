import { AsshatMicrotaskFactory } from "./asshat-microtasks";
import { AsshatZone } from "../asshat-zone";
import { Prommy } from "../../zone/prommy";

type Predicate = () => boolean;

export function wait(predicate: Predicate) {
    if (predicate())
        return Prommy.resolve();

    const context = AsshatZone.context;

    return new Prommy<void>((resolve, reject) => {
        const microtask = AsshatMicrotaskFactory.create(predicate, context, resolve, reject);
        context.ticker.addMicrotask(microtask);
    });
}
