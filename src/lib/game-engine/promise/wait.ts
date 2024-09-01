import { AsshatMicrotaskFactory } from "./asshat-microtasks";
import { AsshatZone } from "../asshat-zone";
import { Prommy } from "../../zone/prommy";

type Predicate = () => boolean;

export function wait(predicate: Predicate) {
    // if (predicate())
    //     return Promise.resolve();

    const context = AsshatZone.context;
    console.log('wait context ', context);

    return new Prommy<void>((resolve, reject) => {
        const microtask = AsshatMicrotaskFactory.create(predicate, context, resolve, reject);
        context.ticker.addMicrotask(microtask);
    });
}
