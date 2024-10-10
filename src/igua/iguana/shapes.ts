import { Texture } from "pixi.js";
import { Tx } from "../../assets/textures";
import { Vector, VectorSimple } from "../../lib/math/vector-type";

function shape(texture: Texture, width: number, pixelDefaultAnchor: Vector) {
    return texture.split({ width, trimFrame: { pixelDefaultAnchor } });
}

const tailClubPlacements: VectorSimple[] = [
    [-6, 16],
    [6, 34],
    [-12, 22],
    [-4, 20],
    [36, 2],
];

function getClubPlacement(tailShapeIndex: number) {
    return tailClubPlacements[tailShapeIndex] ?? tailClubPlacements[0];
}

const Tail = {
    Shapes: shape(Tx.Iguana.Tail, 56, [34, 34]),
    getClubPlacement,
};

export const IguanaShapes = {
    Crest: shape(Tx.Iguana.Crest, 32, [20, 20]),
    Eye: shape(Tx.Iguana.Eye, 16, [14, 10]),
    Pupil: shape(Tx.Iguana.Pupil, 16, [12, 8]),
    Mouth: shape(Tx.Iguana.Mouth, 24, [14, 15]),
    Torso: shape(Tx.Iguana.Torso, 48, [24, 34]),
    Face: shape(Tx.Iguana.Head, 36, [0, 32]),
    Horn: shape(Tx.Iguana.Horn, 16, [4, 12]),
    Tail,
    Club: shape(Tx.Iguana.Club, 24, [8, 8]),
    Foot: shape(Tx.Iguana.Foot, 28, [12, 24]),
    Claws: shape(Tx.Iguana.Nails, 20, [12, 12]),
};
