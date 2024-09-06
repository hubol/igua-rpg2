import { ErrorReporter } from "../error-reporter";

export namespace Coro {
    export type Predicate = () => boolean;
    export type Type<T = unknown> = Generator<Predicate, T, unknown>;

    interface RunnerState {
        predicate: Predicate | null;
        done: boolean;
    }

    export const runner = (generator: Type, state: RunnerState) => {
        if (state.done)
            return;

        for (let i = 0; i < 256; i++) {
            if (state.predicate === null) {
                const next = generator.next();
                if (next.done) {
                    state.done = true;
                    return;
                }
                
                state.predicate = next.value;
            }
    
            if (state.predicate())
                state.predicate = null;
            else
                return;
        }

        ErrorReporter.reportDevOnlyState(new Error(`Possible infinite coro loop detected!`), generator, state.predicate);
    }
}