import { Texture } from "pixi.js";
import { Tx } from "../../assets/textures";
import { Vector, VectorSimple } from "../../lib/math/vector-type";

function shape(texture: Texture, width: number, pixelDefaultAnchor: Vector) {
    return texture.split({ width, trimFrame: { pixelDefaultAnchor } });
}

const tailClubPlacements: VectorSimple[] = [
    [-4, 12],
    [4, 25],
    [-12, 16],
    [-3, 15],
    [27, 1],
];

function getClubPlacement(tailShapeIndex: number) {
    return tailClubPlacements[tailShapeIndex] ?? tailClubPlacements[0];
}

const Tail = {
    Shapes: shape(Tx.Iguana.Tail, 42, [25, 25]),
    getClubPlacement,
};

export const IguanaShapes = {
    Crest: shape(Tx.Iguana.Crest, 24, [15, 15]),
    Eye: shape(Tx.Iguana.Eye, 12, [10, 7]),
    Pupil: shape(Tx.Iguana.Pupil, 12, [9, 6]),
    Mouth: shape(Tx.Iguana.Mouth, 18, [10, 11]),
    Torso: shape(Tx.Iguana.Torso, 36, [18, 25]),
    Face: shape(Tx.Iguana.Head, 27, [0, 24]),
    Horn: shape(Tx.Iguana.Horn, 12, [3, 9]),
    Tail,
    Club: shape(Tx.Iguana.Club, 18, [6, 6]),
    Foot: shape(Tx.Iguana.Foot, 21, [9, 18]),
    Claws: shape(Tx.Iguana.Nails, 15, [9, 9]),
};
