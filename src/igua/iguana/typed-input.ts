export namespace TypedInput {
    export interface Vector {
        minX?: number;
        minY?: number;
        maxX?: number;
        maxY?: number;
        kind: 'vector';
    }

    export interface Integer {
        min?: number;
        max?: number;
        kind: 'integer';
    }

    export interface Color {
        kind: 'color';
    }

    export interface Choice<T> {
        options: ReadonlyArray<T>;
        allowNone: boolean;
        kind: 'choice';
    }

    export interface Boolean {
        kind: 'boolean';
    }

    export type Any = Choice<unknown> | Vector | Integer | Color | Boolean;
    
    export const vector = (minX?: number, minY?: number, maxX?: number, maxY?: number): Vector =>
        ({ minX, minY, maxX, maxY, kind: 'vector' });

    export const integer = (min?: number, max?: number): Integer => ({ min, max, kind: 'integer' });

    export const color = (): Color => ({ kind: 'color' });

    export const choice = <T> (options: ReadonlyArray<T>, allowNone = false): Choice<T> => ({ options, allowNone, kind: 'choice' });
    
    export const boolean = (): Boolean => ({ kind: 'boolean' });

    // Thank you https://github.com/jquense/yup/blob/94cfd11b3f23e10f731efac05c5525829d10ded1/src/index.ts#L40
    export type Output<T> = {
        [k in keyof T]: T[k] extends TypedInput.Any
            ? OutputInner<T[k]>
            : T[k] extends Record<string, unknown>
            ? Output<T[k]>
            : never;
    };

    // TODO name terrible!!!
    export type OutputInner<T> = T extends TypedInput.Vector
        ? { x: number; y: number; }
        : T extends TypedInput.Boolean
        ? boolean
        : T extends TypedInput.Integer | TypedInput.Color
        ? number
        : T extends TypedInput.Choice<infer E>
        ? number
        : never;
}