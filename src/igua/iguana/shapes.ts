import { Texture } from "pixi.js";
import { Tx } from "../../assets/textures";
import { Vector, VectorSimple } from "../../lib/math/vector-type";
import { PropertiesLike } from "../../lib/types/properties-like";

type IguanaTxs = PropertiesLike<typeof Tx["Iguana"], Texture>;

function shape(key: keyof IguanaTxs, width: number, pixelDefaultAnchor: Vector) {
    const texture = Tx.Iguana[key];
    const boiledTextures = Tx.Iguana.Boiled[key].split({ width, trimFrame: { pixelDefaultAnchor } });

    return texture.split({ width, trimFrame: { pixelDefaultAnchor } }).map((Tx, index) => ({
        Tx,
        BoiledTx: boiledTextures[index],
    }));
}

export type IguanaShape = ReturnType<typeof shape>[0];

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
    Shapes: shape("Tail", 42, [25, 25]),
    getClubPlacement,
};

export const IguanaShapes = {
    Crest: shape("Crest", 24, [15, 15]),
    Eye: shape("Eye", 12, [10, 7]),
    Pupil: shape("Pupil", 12, [9, 6]),
    Mouth: shape("Mouth", 18, [10, 11]),
    Torso: shape("Torso", 36, [18, 25]),
    Face: shape("Head", 27, [0, 24]),
    Horn: shape("Horn", 12, [3, 9]),
    Tail,
    Club: shape("Club", 18, [6, 6]),
    Foot: shape("Foot", 21, [9, 18]),
    Claws: shape("Nails", 15, [9, 9]),
};
