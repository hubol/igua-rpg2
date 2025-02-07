import { TypedInput } from "./typed-input";
import { IguanaShape, IguanaShapes } from "./shapes";
import { AdjustColor } from "../../lib/pixi/adjust-color";
import { Texture } from "pixi.js";

export namespace IguanaLooks {
    export type Input = ReturnType<typeof create>;
    export type Serializable = TypedInput.SerializedTree<Input>;

    const shapeTextures = new Map<IguanaShape[], Texture[]>();

    function getShapeTextures(shapes: IguanaShape[]) {
        const oldTextures = shapeTextures.get(shapes);
        if (oldTextures) {
            return oldTextures;
        }

        const textures = shapes.map(x => x.Tx);
        shapeTextures.set(shapes, textures);
        return textures;
    }

    function shapeChoice(shapes: IguanaShape[], allowNone?: boolean) {
        return TypedInput.choice(getShapeTextures(shapes), allowNone);
    }

    export function create() {
        const foot = () => ({
            shape: shapeChoice(IguanaShapes.Foot),
            color: TypedInput.color(),
            claws: {
                shape: shapeChoice(IguanaShapes.Claws, true),
                color: TypedInput.color(),
                placement: TypedInput.integer(-3, 6),
            },
        });

        const eye = () => ({
            sclera: {
                // TODO sclera shapes
            },
            eyelid: {
                color: TypedInput.color(),
                placement: TypedInput.integer(-7, 7),
            },
            pupil: {
                shape: shapeChoice(IguanaShapes.Pupil),
                color: TypedInput.color(),
                placement: TypedInput.vector(-2, -2, 2, 2),
                flipH: TypedInput.boolean(),
            },
        });

        return {
            head: {
                color: TypedInput.color(),
                placement: TypedInput.vector(-5, -8, 5, 2),
                crest: {
                    shape: shapeChoice(IguanaShapes.Crest),
                    color: TypedInput.color(),
                    placement: TypedInput.vector(),
                    flipH: TypedInput.boolean(),
                    flipV: TypedInput.boolean(),
                    behind: TypedInput.boolean(),
                },
                eyes: {
                    placement: TypedInput.vector(-7, -6, 3, 5),
                    gap: TypedInput.integer(0, 8),
                    tilt: TypedInput.integer(-2, 2),
                    pupils: {
                        placement: TypedInput.vector(-7, -7, 5, 5),
                        mirrored: TypedInput.boolean(),
                    },
                    left: eye(),
                    right: eye(),
                },
                horn: {
                    shape: shapeChoice(IguanaShapes.Horn, true),
                    color: TypedInput.color(),
                    placement: TypedInput.vector(-12, -10, 6, 4),
                },
                mouth: {
                    shape: shapeChoice(IguanaShapes.Mouth),
                    color: TypedInput.color(),
                    placement: TypedInput.vector(-8, -5, 4, 4),
                    flipV: TypedInput.boolean(),
                },
            },
            body: {
                color: TypedInput.color(),
                placement: TypedInput.vector(-4, -2, 4, 0),
                tail: {
                    shape: shapeChoice(IguanaShapes.Tail.Shapes),
                    color: TypedInput.color(),
                    placement: TypedInput.vector(-8, -7, 4, 5),
                    club: {
                        shape: shapeChoice(IguanaShapes.Club, true),
                        color: TypedInput.color(),
                        placement: TypedInput.vector(),
                    },
                },
            },
            feet: {
                fore: {
                    left: foot(),
                    right: foot(),
                },
                hind: {
                    left: foot(),
                    right: foot(),
                },
                gap: TypedInput.integer(-1, 8),
                backOffset: TypedInput.integer(0, 7),
            },
        };
    }

    export function darkenBackFeet(color: number) {
        return darken(color, 0.225);
    }

    export function darkenEyelids(color: number) {
        return darken(color, 0.1);
    }

    function darken(color: number, amount: number) {
        return AdjustColor.pixi(color).saturate(0.1).darken(amount).toPixi();
    }
}
