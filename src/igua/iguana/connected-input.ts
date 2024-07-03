import { merge } from "../../lib/object/merge";
import { TypedInput } from "./typed-input";

export namespace ConnectedInput {
    export function create<TInput>(input: TInput, serializable: TypedInput.SerializedTree<TInput>): Tree<TInput> {
        traverse(input, (input, path) => connect(input, serializable, path));
        return input as any;
    }

    export function findUniqueColorValues(instance: Tree<unknown>) {
        const set = new Set<number>();
        traverse(instance, (input: TypedInput.Any & Binding<any>) => {
            if (input.kind === 'color')
                set.add(input.value);
        });
        return Array.from(set);
    }

    export function find<TShape extends TypedInput.Any, TKind extends TShape['kind'] = TShape['kind'], TLeaf = TShape & { kind: TKind }>(
            instance: Tree<unknown>, kind: TKind): Leaf<TLeaf>[] {
        const result: Leaf<TLeaf>[] = [];
        traverse(instance, (input: Leaf<TLeaf>) => {
            if (input.kind === kind)
                result.push(input);
        });
        return result;
    }

    export function join<TInput>(leaves: Leaf<TInput>[]): Leaf<TInput>
    export function join<TInput>(trees: Tree<TInput>[]): Tree<TInput>
    export function join<TInput>(trees: Tree<TInput>[]): Tree<TInput> {
        const output = {};

        const instance = trees[0];
        if (instance) {
            traverse(instance, (input: TypedInput.Any & Binding<any>, path) => {
                let self = output;
                for (let i = 0; i < path.length; i++) {
                    const key = path[i];
                    if (!self[key])
                        self[key] = {};
                    self = self[key];
                }

                const destinations = trees
                    .map(x => indexUntilTail(x, path))
                    .map(x => path.last ? x[path.last] : x);

                merge(self, input);
                merge(self, {
                    get value() {
                        return input.value;
                    },
                    set value(x) {
                        for (let i = 0; i < destinations.length; i++) {
                            destinations[i].value = x;
                        }
                    },
                    get hasConflict() {
                        let value;
                        for (let i = 0; i < destinations.length; i++) {
                            const thisValue = destinations[i].value;
                            if (i === 0)
                                value = thisValue;
                            else if (thisValue !== value)
                                return true;
                        }

                        return false;
                    }
                })
            })
        }

        return output as any;
    }

    type OnInputFn<T> = (input: T, path: string[]) => void;

    function traverse<T = TypedInput.Any>(input: any, onInputFn: OnInputFn<T>, path: string[] = []) {
        if ('kind' in input)
            return onInputFn(input, path);

        if (typeof input !== "object" || Array.isArray(input))
            return;

        for (const key in input) {
            traverse(input[key], onInputFn, [ ...path, key ]);
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

    export type Leaf<T> = T extends TypedInput.Any ? (T & Binding<TypedInput.Serialized<T>>) : never;

    export type Tree<T> = {
        [k in keyof T]: T[k] extends TypedInput.Any
            ? Leaf<T[k]>
            : T[k] extends Record<string, unknown>
            ? Tree<T[k]>
            : never;
    };

    export type Binding<T> = { value: T; readonly hasConflict?: boolean; }
}