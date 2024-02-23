import { merge } from "../../lib/object/merge";
import { TypedInput } from "./typed-input";

export namespace ConnectedInput {
    export function create<TInput>(input: TInput, serializable: TypedInput.Output<TInput>): Type<TInput> {
        traverse(input, serializable, connect);
        return input as any;
    }

    export function findUniqueColorValues(instance: Type<unknown>) {
        const set = new Set<number>();
        traverse(instance, instance, (input: TypedInput.Any & { value: any }) => {
            if (input.kind === 'color')
                set.add(input.value);
        });
        return Array.from(set);
    }

    type OnInputFn<T> = (input: T, source: any, path: string[]) => void;

    function traverse<T = TypedInput.Any>(input: any, source: any, onInputFn: OnInputFn<T>, path: string[] = []) {
        if ('kind' in input)
            return onInputFn(input, source, path);

        if (typeof input !== "object" || Array.isArray(input))
            return;

        for (const key in input) {
            traverse(input[key], source, onInputFn, [ ...path, key ]);
        }
    }

    function indexUntilTail(source: any, path: string[]) {
        for (let i = 0; i < path.length - 1; i++)
            source = source[path[i]];
        return source;
    }

    function connect(input: TypedInput.Any, source: any, path: string[]) {
        const tail = path.last;

        merge(input, {
            get value() {
                return indexUntilTail(source, path)[tail];
            },
            set value(x) {
                indexUntilTail(source, path)[tail] = x;
            }
        });
    }

    // TODO these can probably be removed
    export type Choice<T> = TypedInput.Choice<T> & { value: number };
    export type Vector = TypedInput.Vector & { value: { x: number; y: number; } };
    export type Integer = TypedInput.Integer & { value: number };
    export type Color = TypedInput.Color & { value: number };
    export type Boolean = TypedInput.Boolean & { value: boolean };

    type Type<T> = {
        [k in keyof T]: T[k] extends TypedInput.Any
            ? T[k] & { value: TypedInput.Output<{ 'k': T[k] }>['k'] }
            : T[k] extends Record<string, unknown>
            ? Type<T[k]>
            : never;
    };
}