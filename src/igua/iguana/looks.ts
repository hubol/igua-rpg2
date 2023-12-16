import { TypedInput } from "./typed-input";
import { IguanaShapes } from "./shapes";

export namespace IguanaLooks {
    export type Input = ReturnType<typeof create>;
    export type Serializable = TypedInput.Output<Input>;

    export function create() {
        const foot = () => ({
            shape: TypedInput.choice(IguanaShapes.Foot),
            flipV: TypedInput.boolean(),
            claws: {
                shape: TypedInput.choice(IguanaShapes.Claws, true),
                placement: TypedInput.integer(-3, 5),
            }
        });

        return {
            head: {
                color: TypedInput.color(),
                placement: TypedInput.vector(-5, -8, 5, 2),
                crest: {
                    shape: TypedInput.choice(IguanaShapes.Crest),
                    color: TypedInput.color(),
                    placement: TypedInput.vector(),
                    flipH: TypedInput.boolean(),
                    flipV: TypedInput.boolean(),
                },
                eyes: {
                    placement: TypedInput.vector(-7, -6, 3, 5),
                    gap: TypedInput.integer(0, 8),
                    // shape: choice(eyeShapes),
                    pupils: {
                        shape: TypedInput.choice(IguanaShapes.Pupil),
                        color: TypedInput.color(),
                        placement: TypedInput.vector(-7, -7, 5, 5),
                        mirrored: TypedInput.boolean(),
                    },
                },
                horn: {
                    shape: TypedInput.choice(IguanaShapes.Horn, true),
                    color: TypedInput.color(),
                    placement: TypedInput.vector(-12, -10, 6, 4),
                },
                mouth: {
                    shape: TypedInput.choice(IguanaShapes.Mouth),
                    color: TypedInput.color(),
                    placement: TypedInput.vector(-8, -5, 4, 4),
                    flipV: TypedInput.boolean(),
                },
            },
            body: {
                color: TypedInput.color(),
                placement: TypedInput.vector(-4, -2, 4, 0),
                tail: {
                    shape: TypedInput.choice(IguanaShapes.Tail),
                    color: TypedInput.color(),
                    placement: TypedInput.vector(-8, -7, 4, 5),
                    club: {
                        shape: TypedInput.choice(IguanaShapes.Club, true),
                        color: TypedInput.color(),
                        placement: TypedInput.vector(),
                    }
                }
            },
            feet: {
                color: TypedInput.color(),
                clawColor: TypedInput.color(),
                front: foot(),
                hind: foot(),
                gap: TypedInput.integer(-1, 8),
                backOffset: TypedInput.integer(0, 7),
            }
        }
    }
}