import { createBitmapFont } from "../../lib/pixi/create-bitmap-font";
import { Tx } from "../textures";

export const fntErotix = createBitmapFont(Tx.Font.Erotix, {
    name: "Erotix",
    size: 12,
    lineHeight: 12,
    characters: {
        "0": { x: 0, y: 25, w: 5, h: 7, xadv: 6 },
        "1": { x: 6, y: 25, w: 3, h: 7, xadv: 4 },
        "2": { x: 10, y: 25, w: 5, h: 7, xadv: 6 },
        "3": { x: 16, y: 25, w: 5, h: 7, xadv: 6 },
        "4": { x: 22, y: 25, w: 5, h: 7, xadv: 6 },
        "5": { x: 28, y: 25, w: 5, h: 7, xadv: 6 },
        "6": { x: 34, y: 25, w: 5, h: 7, xadv: 6 },
        "7": { x: 40, y: 25, w: 5, h: 7, xadv: 6 },
        "8": { x: 46, y: 25, w: 5, h: 7, xadv: 6 },
        "9": { x: 52, y: 25, w: 5, h: 7, xadv: 6 },
        " ": { x: 0, y: 0, w: 3, h: 1, xadv: 3, yoff: 6 },
        a: { x: 0, y: 3, w: 5, h: 5, xadv: 6, yoff: 2 },
        b: { x: 6, y: 1, w: 5, h: 7, xadv: 6 },
        c: { x: 12, y: 3, w: 5, h: 5, xadv: 6, yoff: 2 },
        d: { x: 18, y: 1, w: 5, h: 7, xadv: 6 },
        e: { x: 24, y: 3, w: 5, h: 5, xadv: 6, yoff: 2 },
        f: { x: 30, y: 1, w: 5, h: 7, xadv: 6 },
        g: { x: 36, y: 3, w: 5, h: 8, xadv: 6, yoff: 2 },
        h: { x: 42, y: 1, w: 5, h: 7, xadv: 6 },
        i: { x: 48, y: 1, w: 2, h: 7, xadv: 3 },
        j: { x: 51, y: 1, w: 4, h: 10, xadv: 5 },
        k: { x: 56, y: 1, w: 5, h: 7, xadv: 6 },
        l: { x: 62, y: 1, w: 2, h: 7, xadv: 3 },
        m: { x: 65, y: 3, w: 8, h: 5, xadv: 9, yoff: 2 },
        n: { x: 74, y: 3, w: 5, h: 5, xadv: 6, yoff: 2 },
        o: { x: 80, y: 3, w: 5, h: 5, xadv: 6, yoff: 2 },
        p: { x: 86, y: 3, w: 5, h: 8, xadv: 6, yoff: 2 },
        q: { x: 92, y: 3, w: 6, h: 8, xadv: 6, yoff: 2 },
        r: { x: 99, y: 3, w: 4, h: 5, xadv: 5, yoff: 2 },
        s: { x: 104, y: 3, w: 4, h: 5, xadv: 5, yoff: 2 },
        t: { x: 109, y: 1, w: 4, h: 7, xadv: 5 },
        u: { x: 114, y: 3, w: 5, h: 5, xadv: 6, yoff: 2 },
        v: { x: 120, y: 3, w: 5, h: 5, xadv: 6, yoff: 2 },
        w: { x: 126, y: 3, w: 6, h: 5, xadv: 7, yoff: 2 },
        x: { x: 133, y: 3, w: 6, h: 5, xadv: 7, yoff: 2 },
        y: { x: 140, y: 3, w: 5, h: 8, xadv: 6, yoff: 2 },
        z: { x: 146, y: 3, w: 4, h: 5, xadv: 5, yoff: 2 },
        A: { x: 0, y: 13, w: 5, h: 7, xadv: 6 },
        B: { x: 6, y: 13, w: 5, h: 7, xadv: 6 },
        C: { x: 12, y: 13, w: 5, h: 7, xadv: 6 },
        D: { x: 18, y: 13, w: 5, h: 7, xadv: 6 },
        E: { x: 24, y: 13, w: 5, h: 7, xadv: 6 },
        F: { x: 30, y: 13, w: 5, h: 7, xadv: 6 },
        G: { x: 36, y: 13, w: 5, h: 7, xadv: 6 },
        H: { x: 42, y: 13, w: 5, h: 7, xadv: 6 },
        I: { x: 48, y: 13, w: 2, h: 7, xadv: 3 },
        J: { x: 51, y: 13, w: 6, h: 7, xadv: 7 },
        K: { x: 58, y: 13, w: 5, h: 7, xadv: 6 },
        L: { x: 64, y: 13, w: 5, h: 7, xadv: 6 },
        M: { x: 70, y: 13, w: 6, h: 7, xadv: 7 },
        N: { x: 77, y: 13, w: 5, h: 7, xadv: 6 },
        O: { x: 83, y: 13, w: 5, h: 7, xadv: 6 },
        P: { x: 89, y: 13, w: 5, h: 7, xadv: 6 },
        Q: { x: 95, y: 13, w: 5, h: 7, xadv: 6 },
        R: { x: 101, y: 13, w: 5, h: 7, xadv: 6 },
        S: { x: 107, y: 13, w: 5, h: 7, xadv: 6 },
        T: { x: 113, y: 13, w: 6, h: 7, xadv: 7 },
        U: { x: 120, y: 13, w: 5, h: 7, xadv: 6 },
        V: { x: 126, y: 13, w: 5, h: 7, xadv: 6 },
        W: { x: 132, y: 13, w: 6, h: 7, xadv: 7 },
        X: { x: 139, y: 13, w: 6, h: 7, xadv: 7 },
        Y: { x: 146, y: 13, w: 5, h: 7, xadv: 6 },
        Z: { x: 152, y: 13, w: 5, h: 7, xadv: 6 },
        ",": { x: 58, y: 30, w: 2, h: 4, xadv: 3, yoff: 5 },
        ".": { x: 61, y: 30, w: 2, h: 2, xadv: 3, yoff: 5 },
        "/": { x: 64, y: 24, w: 3, h: 9, xadv: 4, yoff: -1 },
        ";": { x: 68, y: 26, w: 2, h: 8, xadv: 3, yoff: 1 },
        "'": { x: 71, y: 25, w: 2, h: 3, xadv: 3 },
        "<": { x: 74, y: 26, w: 3, h: 5, xadv: 4, yoff: 1 },
        ">": { x: 78, y: 26, w: 3, h: 5, xadv: 4, yoff: 1 },
        "?": { x: 82, y: 25, w: 5, h: 7, xadv: 6 },
        ":": { x: 88, y: 26, w: 2, h: 6, xadv: 3, yoff: 1 },
        "\"": { x: 91, y: 24, w: 5, h: 3, xadv: 6 },
        "!": { x: 97, y: 25, w: 2, h: 7, xadv: 3 },
        "%": { x: 101, y: 26, w: 6, h: 6, xadv: 7, yoff: 1 },
        "&": { x: 108, y: 25, w: 6, h: 7, xadv: 7 },
        "*": { x: 115, y: 24, w: 3, h: 4, xadv: 4, yoff: -1 },
        "(": { x: 119, y: 24, w: 3, h: 9, xadv: 4, yoff: -1 },
        ")": { x: 123, y: 24, w: 3, h: 9, xadv: 4, yoff: -1 },
        "-": { x: 127, y: 28, w: 3, h: 1, xadv: 4, yoff: 3 },
        "=": { x: 131, y: 27, w: 3, h: 3, xadv: 4, yoff: 2 },
        "+": { x: 135, y: 27, w: 3, h: 3, xadv: 4, yoff: 2 },
        "#": { x: 154, y: 0, w: 6, h: 9, xadv: 7, yoff: -1 },
    },
    kernings: [["b", "j", -1], ["F", "e", -1], ["F", "o", -1]],
});
