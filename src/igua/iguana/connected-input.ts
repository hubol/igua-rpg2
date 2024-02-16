import { merge } from "../../lib/object/merge";
import { TypedInput } from "./typed-input";

export namespace ConnectedInput {
    export function create<TInput>(input: TInput, serializable: TypedInput.Output<TInput>): Type<TInput> {
        tryConnect(input, serializable);
        return input as any;
    }

    function tryConnect(input: any, source: any, path: string[] = []) {
        if ('kind' in input)
            return connect(input, source, path);

        if (typeof input !== "object" || Array.isArray(input))
            return;

        for (const key in input) {
            tryConnect(input[key], source, [ ...path, key ]);
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