import { ErrorReporter } from "../error-reporter";

export namespace Coro {
    export type Predicate = () => boolean;
    export type Type<T = unknown> = Generator<Predicate, T, unknown>;

    const unsetReturnResult: unique symbol = Symbol('Coro.unsetReturnResult');
    type UnsetReturnResult = typeof unsetReturnResult;

    interface RunnerState<T> {
        predicate: Predicate | null;
        done: boolean;
        returnResult: T | UnsetReturnResult;
    }

    export function createRunnerState<T>(): RunnerState<T> {
        return {
            predicate: null,
            done: false,
            returnResult: unsetReturnResult
        };
    }

    export const runner = <T = unknown> (generator: Type<T>, state: RunnerState<T>) => {
        if (state.done)
            return true;

        for (let i = 0; i < 256; i++) {
            if (state.predicate === null) {
                const next = generator.next();
                if (next.done) {
                    state.returnResult = next.value;
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
        const runnerStates: RunnerState<unknown>[] = [];

        const length = values.length;
        let toCompleteCount = length;

        for (let i = 0; i < length; i++) {
            const value = values[i];
            if (isCoroType(value)) {
                const runnerState = createRunnerState();
                runnerStates[i] = runnerState;
                predicates.push(runner.bind(null, value, runnerState));
            }
            else
                predicates.push(value);
        }

        yield () => {
            for (let i = 0; i < length; i++) {
                if (completedIndices[i])
                    continue;
                if (predicates[i]()) {
                    results[i] = runnerStates[i]?.returnResult;
                    completedIndices[i] = true;
                    toCompleteCount--;
                }
            }
            return toCompleteCount <= 0;
        }

        return results as any;
    }

    function isCoroType(value: Coro.Type | Predicate): value is Coro.Type {
        return value['next'];
    }
}