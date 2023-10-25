import { AsshatZone } from "./asshat-zone";

type Predicate = () => boolean;

export function wait(predicate: Predicate): Promise<void> {
    if (predicate())
        return Promise.resolve();

    let fn: () => void;

    const context = AsshatZone.context;

    return new Promise<void>((resolve, reject) => {
        fn = () => {
            if (context.cancellationToken.isCancelled) {
                context.cancellationToken.rejectIfCancelled(reject);
                return;
            }

            if (predicate())
                resolve();
        };

        context.ticker.add(fn);
    })
    .finally(() => context.ticker.remove(fn));
}
