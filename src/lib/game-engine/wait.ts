import { AsshatZone } from "./asshat-zone";

type Predicate = () => boolean;

export function wait(predicate: Predicate): Promise<void> {
    if (predicate())
        return Promise.resolve();

    const context = AsshatZone.context;

    return new Promise<void>((resolve, reject) => {
        context.ticker.addMicrotask({ resolve, reject, predicate, cancellationToken: context.cancellationToken });
    });
}
