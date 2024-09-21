import { Texture } from "pixi.js";
import { Tx } from "../../assets/textures";
import { Vector, VectorSimple } from "../../lib/math/vector-type";

function shape(texture: Texture, width: number, pixelDefaultAnchor: Vector) {
    return texture.split({ width, trimFrame: { pixelDefaultAnchor } });
}

const tailClubPlacements: VectorSimple[] = [
    [-3, 8],
    [3, 17],
    [-6, 11],
    [-2, 10],
    [18, 1],
];

function getClubPlacement(tailShapeIndex: number) {
    return tailClubPlacements[tailShapeIndex] ?? tailClubPlacements[0];
}

const Tail = {
    Shapes: shape(Tx.Iguana.Tail, 28, [17, 17]),
    getClubPlacement,
};

export const IguanaShapes = {
    Crest: shape(Tx.Iguana.Crest, 16, [10, 10]),
    Eye: shape(Tx.Iguana.Eye, 8, [7, 5]),
    Pupil: shape(Tx.Iguana.Pupil, 8, [6, 4]),
    Mouth: shape(Tx.Iguana.Mouth, 12, [7, 7]),
    Torso: shape(Tx.Iguana.Torso, 24, [12, 17]),
    Face: shape(Tx.Iguana.Head, 18, [0, 16]),
    Horn: shape(Tx.Iguana.Horn, 8, [2, 6]),
    Tail,
    Club: shape(Tx.Iguana.Club, 12, [4, 4]),
    Foot: shape(Tx.Iguana.Foot, 14, [6, 12]),
    Claws: shape(Tx.Iguana.Nails, 10, [6, 6]),
};
