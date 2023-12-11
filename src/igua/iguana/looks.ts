import { Vector } from "../../lib/math/vector-type";
import { Shapes } from "./shapes";

const p = 'placement' as const;
const placement = (minX?: number, minY?: number, maxX?: number, maxY?: number) =>
    ({ minX, minY, maxX, maxY, kind: p });

const v = 'value' as const;
const value = (min?: number, max?: number) => ({ min, max, kind: v });

export type ChoiceInput<T> = { options: ReadonlyArray<T>, allowNone: boolean, kind: 'choice' };
const choice = <T> (options: ReadonlyArray<T>, allowNone = false): ChoiceInput<T> => ({ options, allowNone, kind: 'choice' });

const color = () => ({ kind: 'color' } as const);
const bool = () => ({ kind: 'boolean' } as const);

export type PlacementInput = ReturnType<typeof placement>;
export type ValueInput = ReturnType<typeof value>;
export type ColorInput = ReturnType<typeof color>;
export type BoolInput = ReturnType<typeof bool>;

export type LooksInput = ChoiceInput<unknown> | PlacementInput | ValueInput | ColorInput | BoolInput;

// Thank you https://github.com/jquense/yup/blob/94cfd11b3f23e10f731efac05c5525829d10ded1/src/index.ts#L40
type Map<T> = {
    [k in keyof T]: T[k] extends PlacementInput
        ? Vector
        : T[k] extends BoolInput
        ? boolean
        : T[k] extends ValueInput | ColorInput
        ? number
        : T[k] extends ChoiceInput<infer E>
        ? number
        : T[k] extends Record<string, unknown>
        ? Map<T[k]>
        : never;
};

export type LooksInputModel = ReturnType<typeof getLooksInputModel>;
export type Looks = Map<LooksInputModel>;

export function getLooksInputModel() {
    const foot = () => ({
        shape: choice(Shapes.Foot),
        flipV: bool(),
        claws: {
            shape: choice(Shapes.Claws, true),
            placement: value(-3, 5),
        }
    });

    return {
        head: {
            color: color(),
            placement: placement(-5, -8, 5, 2),
            crest: {
                shape: choice(Shapes.Crest),
                color: color(),
                placement: placement(),
                flipH: bool(),
                flipV: bool(),
            },
            eyes: {
                placement: placement(-7, -6, 3, 5),
                gap: value(0, 8),
                // shape: choice(eyeShapes),
                pupils: {
                    shape: choice(Shapes.Pupil),
                    color: color(),
                    placement: placement(-7, -7, 5, 5),
                    mirrored: bool(),
                },
            },
            horn: {
                shape: choice(Shapes.Horn, true),
                color: color(),
                placement: placement(-12, -10, 6, 4),
            },
            mouth: {
                shape: choice(Shapes.Mouth),
                color: color(),
                placement: placement(-8, -5, 4, 4),
                flipV: bool(),
            },
        },
        body: {
            color: color(),
            placement: placement(-4, -2, 4, 0),
            tail: {
                shape: choice(Shapes.Tail),
                color: color(),
                placement: placement(-8, -7, 4, 5),
                club: {
                    shape: choice(Shapes.Club, true),
                    color: color(),
                    placement: placement(),
                }
            }
        },
        feet: {
            color: color(),
            clawColor: color(),
            front: foot(),
            hind: foot(),
            gap: value(-1, 8),
            backOffset: value(0, 7),
        }
    }
}
