import { CharactersData, createBitmapFont } from "../../lib/pixi/create-bitmap-font";
import { Tx } from "../textures";

const characters = {
    "0": { x: 43, y: 0, w: 4, h: 5, xadv: 5 },
    "1": { x: 0, y: 0, w: 2, h: 5, xadv: 3 },
    "2": { x: 3, y: 0, w: 4, h: 5, xadv: 5 },
    "3": { x: 8, y: 0, w: 4, h: 5, xadv: 5 },
    "4": { x: 13, y: 0, w: 4, h: 5, xadv: 5 },
    "5": { x: 18, y: 0, w: 4, h: 5, xadv: 5 },
    "6": { x: 23, y: 0, w: 4, h: 5, xadv: 5 },
    "7": { x: 28, y: 0, w: 4, h: 5, xadv: 5 },
    "8": { x: 33, y: 0, w: 4, h: 5, xadv: 5 },
    "9": { x: 38, y: 0, w: 4, h: 5, xadv: 5 },
    "+": { x: 48, y: 1, w: 3, h: 3, xadv: 4, yoff: 1 },
    "#": { x: 52, y: 0, w: 5, h: 5, xadv: 6 },
    O: { x: 58, y: 0, w: 4, h: 5, xadv: 5 },
    W: { x: 63, y: 0, w: 5, h: 5, xadv: 6 },
    N: { x: 69, y: 0, w: 4, h: 5, xadv: 5 },
    E: { x: 74, y: 0, w: 3, h: 5, xadv: 4 },
    D: { x: 78, y: 0, w: 4, h: 5, xadv: 5 },
    "-": { x: 83, y: 2, w: 3, h: 1, xadv: 4 },
    " ": { x: 0, y: 0, w: 0, h: 0, xadv: 2 },
};

export const fntDiggit = createBitmapFont(Tx.Font.Diggit, {
    name: "Diggit",
    size: 5,
    lineHeight: 6,
    characters,
    kernings: [["6", "7", -1]],
});

export const fntDiggitMono = createBitmapFont(Tx.Font.Diggit, {
    name: "Diggit Mono",
    size: 5,
    lineHeight: 6,
    characters: Object.entries(characters).reduce((obj, [code, characterData]) => {
        obj[code] = { ...characterData, xadv: 5 };
        return obj;
    }, {} as CharactersData) as typeof characters,
    kernings: [],
});
