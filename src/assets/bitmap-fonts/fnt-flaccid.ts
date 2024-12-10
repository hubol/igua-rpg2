import { createBitmapFont } from "../../lib/pixi/create-bitmap-font";
import { Tx } from "../textures";

export const fntFlaccid = createBitmapFont(Tx.Font.Flaccid, {
    name: "Flaccid",
    size: 12,
    lineHeight: 6,
    characters: {
        "0": { x: 0, y: 12, w: 3, h: 4, xadv: 4 },
        "1": { x: 4, y: 12, w: 1, h: 4, xadv: 2 },
        "2": { x: 6, y: 12, w: 3, h: 4, xadv: 4 },
        "3": { x: 10, y: 12, w: 3, h: 4, xadv: 4 },
        "4": { x: 14, y: 12, w: 3, h: 4, xadv: 4 },
        "5": { x: 18, y: 12, w: 3, h: 4, xadv: 4 },
        "6": { x: 22, y: 12, w: 3, h: 4, xadv: 4 },
        "7": { x: 26, y: 12, w: 3, h: 4, xadv: 4 },
        "8": { x: 30, y: 12, w: 3, h: 5, xadv: 4 },
        "9": { x: 34, y: 12, w: 3, h: 4, xadv: 4 },
        " ": { x: 0, y: 0, w: 3, h: 1, xadv: 4, yoff: 3 },
        a: { x: 0, y: 1, w: 3, h: 3, xadv: 4, yoff: 1 },
        b: { x: 4, y: 0, w: 3, h: 4, xadv: 4 },
        c: { x: 8, y: 1, w: 2, h: 3, xadv: 3, yoff: 1 },
        d: { x: 11, y: 0, w: 3, h: 4, xadv: 4 },
        e: { x: 15, y: 0, w: 3, h: 4, xadv: 4 },
        f: { x: 19, y: 0, w: 2, h: 4, xadv: 3 },
        g: { x: 22, y: 1, w: 3, h: 4, xadv: 4, yoff: 1 },
        h: { x: 26, y: 0, w: 3, h: 4, xadv: 4 },
        i: { x: 30, y: 0, w: 1, h: 4, xadv: 2 },
        j: { x: 32, y: 0, w: 2, h: 5, xadv: 3 },
        k: { x: 35, y: 0, w: 3, h: 4, xadv: 4 },
        l: { x: 39, y: 0, w: 2, h: 4, xadv: 3 },
        m: { x: 41, y: 1, w: 5, h: 3, xadv: 6, yoff: 1 },
        n: { x: 47, y: 1, w: 3, h: 3, xadv: 4, yoff: 1 },
        o: { x: 51, y: 1, w: 3, h: 3, xadv: 4, yoff: 1 },
        p: { x: 55, y: 1, w: 3, h: 4, xadv: 4, yoff: 1 },
        q: { x: 59, y: 1, w: 3, h: 4, xadv: 4, yoff: 1 },
        r: { x: 63, y: 1, w: 2, h: 3, xadv: 3, yoff: 1 },
        s: { x: 66, y: 1, w: 3, h: 3, xadv: 4, yoff: 1 },
        t: { x: 70, y: 0, w: 3, h: 4, xadv: 4 },
        u: { x: 74, y: 1, w: 3, h: 3, xadv: 4, yoff: 1 },
        v: { x: 78, y: 1, w: 3, h: 3, xadv: 4, yoff: 1 },
        w: { x: 82, y: 1, w: 5, h: 3, xadv: 6, yoff: 1 },
        x: { x: 88, y: 1, w: 3, h: 3, xadv: 4, yoff: 1 },
        y: { x: 92, y: 1, w: 3, h: 4, xadv: 4, yoff: 1 },
        z: { x: 96, y: 1, w: 3, h: 3, xadv: 4, yoff: 1 },
        A: { x: 0, y: 6, w: 3, h: 5, xadv: 4 },
        B: { x: 4, y: 6, w: 3, h: 5, xadv: 4 },
        C: { x: 8, y: 6, w: 2, h: 5, xadv: 3 },
        D: { x: 11, y: 6, w: 3, h: 5, xadv: 4 },
        E: { x: 15, y: 6, w: 2, h: 5, xadv: 3 },
        F: { x: 18, y: 6, w: 2, h: 5, xadv: 3 },
        G: { x: 21, y: 6, w: 3, h: 5, xadv: 4 },
        H: { x: 25, y: 6, w: 3, h: 5, xadv: 4 },
        I: { x: 29, y: 6, w: 1, h: 5, xadv: 2 },
        J: { x: 31, y: 6, w: 2, h: 5, xadv: 3 },
        K: { x: 34, y: 6, w: 3, h: 5, xadv: 4 },
        L: { x: 38, y: 6, w: 2, h: 5, xadv: 3 },
        M: { x: 41, y: 6, w: 5, h: 5, xadv: 6 },
        N: { x: 47, y: 6, w: 4, h: 5, xadv: 5 },
        O: { x: 52, y: 6, w: 3, h: 5, xadv: 4 },
        P: { x: 56, y: 6, w: 3, h: 5, xadv: 4 },
        Q: { x: 60, y: 6, w: 4, h: 5, xadv: 5 },
        R: { x: 65, y: 6, w: 3, h: 5, xadv: 4 },
        S: { x: 69, y: 6, w: 2, h: 5, xadv: 3 },
        T: { x: 72, y: 6, w: 3, h: 5, xadv: 4 },
        U: { x: 76, y: 6, w: 3, h: 5, xadv: 4 },
        V: { x: 80, y: 6, w: 3, h: 5, xadv: 4 },
        W: { x: 84, y: 6, w: 5, h: 5, xadv: 6 },
        X: { x: 90, y: 6, w: 3, h: 5, xadv: 4 },
        Y: { x: 94, y: 6, w: 3, h: 5, xadv: 4 },
        Z: { x: 98, y: 6, w: 2, h: 5, xadv: 3 },
        ".": { x: 38, y: 15, w: 1, h: 1, xadv: 2, yoff: 3 },
        "!": { x: 40, y: 12, w: 1, h: 4, xadv: 2 },
        "?": { x: 42, y: 12, w: 3, h: 5, xadv: 4 },
        ",": { x: 46, y: 15, w: 1, h: 2, xadv: 2, yoff: 3 },
        "'": { x: 48, y: 12, w: 1, h: 2, xadv: 2 },
        ";": { x: 50, y: 12, w: 1, h: 5, xadv: 2 },
        "\"": { x: 52, y: 12, w: 3, h: 2, xadv: 4 },
        ":": { x: 56, y: 12, w: 1, h: 4, xadv: 2 },
        "/": { x: 58, y: 12, w: 2, h: 5, xadv: 3 },
        "(": { x: 61, y: 12, w: 2, h: 5, xadv: 3 },
        ")": { x: 64, y: 12, w: 2, h: 5, xadv: 3 },
    },
    kernings: [["L", "o", -1], ["L", "e", -1], ["s", "s", -1], ["r", "s", -1]],
});
