import { ErrorReporter } from "../error-reporter";

export namespace Coro {
    export type Predicate = () => boolean;
    export type Type<T = unknown> = Generator<Predicate, T, unknown>;

    // TODO return value could go here!!
    interface RunnerState {
        predicate: Predicate | null;
        done: boolean;
    }

    export const runner = (generator: Type, state: RunnerState) => {
        if (state.done)
            return true;

        for (let i = 0; i < 256; i++) {
            if (state.predicate === null) {
                const next = generator.next();
                if (next.done) {
                    state.done = true;
                    return true;
                }
                
                state.predicate = next.value;
            }
    
            if (state.predicate())
                state.predicate = null;
            else
                return false;
        }

        ErrorReporter.reportDevOnlyState(new Error(`Possible infinite coro loop detected!`), generator, state.predicate);
        return false;
    }

    // TODO name
    type ReturnedByGenerator<T> = T extends Coro.Type<infer U> ? U : never

    export function* all<T extends readonly (Coro.Type | Predicate)[] | []>(values: T): Coro.Type<{ -readonly [P in keyof T]: ReturnedByGenerator<T[P]> }> {
        const completedIndices: boolean[] = [];
        const results: any[] = [];
        const predicates: Predicate[] = [];

        const length = values.length;
        let toCompleteCount = length;

        for (let i = 0; i < length; i++) {
            const value = values[i];
            const predicate = isCoroType(value)
                ? runner.bind(null, value, { predicate: null, done: false })
                : value;

            predicates.push(predicate);
        }

        yield () => {
            for (let i = 0; i < length; i++) {
                if (completedIndices[i])
                    continue;
                if (predicates[i]()) {
                    // TODO add to results
                    completedIndices[i] = true;
                    toCompleteCount--;
                }
            }
            return toCompleteCount <= 0;
        }

        // TODO
        return results as any;
    }

    function isCoroType(value: Coro.Type | Predicate): value is Coro.Type {
        return value['next'];
    }
}