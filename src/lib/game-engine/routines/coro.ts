import { ErrorReporter } from "../error-reporter";

export namespace Coro {
    export type Predicate = () => boolean;
    export type Type<T = unknown> = Generator<Predicate, T, unknown>;

    interface PrivateGenerator {
        __done__?: boolean;
    }

    export const runner = (generator: Type, predicate: Predicate | null) => {
        if ((generator as PrivateGenerator).__done__)
            return;

        for (let i = 0; i < 256; i++) {
            if (predicate === null) {
                const next = generator.next();
                if (next.done) {
                    (generator as PrivateGenerator).__done__ = true;
                    return;
                }
                
                predicate = next.value as Predicate;
            }
    
            if (predicate())
                predicate = null;
            else
                return;
        }

        ErrorReporter.reportDevOnlyState(new Error(`Possible infinite coro loop detected!`), generator, predicate);
    }
}