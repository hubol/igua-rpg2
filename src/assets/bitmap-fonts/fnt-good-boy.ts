import { createBitmapFontFactory } from "../../lib/pixi/bitmap-font-factory";

export const fntGoodBoy = createBitmapFontFactory({
    name: "Good Boy",
    size: 16,
    lineHeight: 22,
    characters: {
        "0": { x: 37, y: 49, w: 9, h: 16, xadv: 10 },
        "1": { x: 47, y: 49, w: 4, h: 16, xadv: 5 },
        "2": { x: 52, y: 49, w: 9, h: 16, xadv: 10 },
        "3": { x: 62, y: 49, w: 9, h: 16, xadv: 10 },
        "4": { x: 72, y: 49, w: 9, h: 16, xadv: 10 },
        "5": { x: 82, y: 49, w: 9, h: 16, xadv: 10 },
        "6": { x: 92, y: 49, w: 9, h: 16, xadv: 10 },
        "7": { x: 102, y: 49, w: 9, h: 16, xadv: 10 },
        "8": { x: 112, y: 49, w: 9, h: 16, xadv: 10 },
        "9": { x: 122, y: 49, w: 9, h: 16, xadv: 10 },
        " ": { x: 0, y: 0, w: 0, h: 0, xadv: 4, yoff: 6 },
        a: { x: 1, y: 6, w: 9, h: 10, xadv: 10, yoff: 6 },
        b: { x: 11, y: 0, w: 9, h: 16, xadv: 10 },
        c: { x: 21, y: 8, w: 7, h: 8, xadv: 8, yoff: 8 },
        d: { x: 29, y: 0, w: 9, h: 16, xadv: 10 },
        e: { x: 39, y: 8, w: 7, h: 8, xadv: 8, yoff: 8 },
        f: { x: 47, y: 0, w: 7, h: 16, xadv: 8 },
        g: { x: 55, y: 7, w: 9, h: 14, xadv: 10, yoff: 7 },
        h: { x: 65, y: 0, w: 8, h: 16, xadv: 9 },
        i: { x: 74, y: 6, w: 3, h: 10, xadv: 4, yoff: 6 },
        j: { x: 78, y: 6, w: 6, h: 15, xadv: 7, yoff: 6 },
        k: { x: 85, y: 0, w: 8, h: 16, xadv: 9 },
        l: { x: 94, y: 0, w: 2, h: 16, xadv: 3 },
        m: { x: 97, y: 7, w: 12, h: 9, xadv: 13, yoff: 7 },
        n: { x: 110, y: 7, w: 8, h: 9, xadv: 9, yoff: 7 },
        o: { x: 119, y: 8, w: 8, h: 8, xadv: 9, yoff: 8 },
        p: { x: 128, y: 7, w: 9, h: 14, xadv: 10, yoff: 7 },
        q: { x: 138, y: 7, w: 9, h: 14, xadv: 10, yoff: 7 },
        r: { x: 148, y: 7, w: 7, h: 9, xadv: 8, yoff: 7 },
        s: { x: 156, y: 7, w: 6, h: 9, xadv: 7, yoff: 7 },
        t: { x: 163, y: 0, w: 5, h: 16, xadv: 6 },
        u: { x: 169, y: 7, w: 9, h: 9, xadv: 10, yoff: 7 },
        v: { x: 178, y: 7, w: 8, h: 9, xadv: 9, yoff: 7 },
        w: { x: 187, y: 7, w: 12, h: 9, xadv: 13, yoff: 7 },
        x: { x: 200, y: 7, w: 8, h: 9, xadv: 9, yoff: 7 },
        y: { x: 210, y: 7, w: 8, h: 14, xadv: 9, yoff: 7 },
        z: { x: 219, y: 7, w: 7, h: 8, xadv: 8, yoff: 8 },
        "-": { x: 227, y: 8, w: 6, h: 1, xadv: 7, yoff: 8 },
        A: { x: 0, y: 26, w: 10, h: 16, xadv: 11 },
        B: { x: 11, y: 26, w: 8, h: 16, xadv: 9 },
        C: { x: 20, y: 26, w: 8, h: 16, xadv: 9 },
        D: { x: 29, y: 26, w: 9, h: 16, xadv: 10 },
        E: { x: 39, y: 26, w: 7, h: 16, xadv: 8 },
        F: { x: 47, y: 26, w: 7, h: 16, xadv: 8 },
        G: { x: 55, y: 26, w: 8, h: 16, xadv: 9 },
        H: { x: 64, y: 26, w: 7, h: 16, xadv: 8 },
        I: { x: 235, y: 26, w: 3, h: 16, xadv: 4 },
        J: { x: 74, y: 26, w: 8, h: 16, xadv: 9 },
        K: { x: 83, y: 26, w: 7, h: 16, xadv: 8 },
        L: { x: 91, y: 26, w: 6, h: 16, xadv: 7 },
        M: { x: 98, y: 26, w: 11, h: 16, xadv: 12 },
        N: { x: 110, y: 26, w: 8, h: 16, xadv: 9 },
        O: { x: 119, y: 26, w: 10, h: 16, xadv: 11 },
        P: { x: 130, y: 26, w: 7, h: 16, xadv: 8 },
        Q: { x: 138, y: 26, w: 10, h: 16, xadv: 11 },
        R: { x: 149, y: 26, w: 7, h: 16, xadv: 8 },
        S: { x: 157, y: 26, w: 8, h: 16, xadv: 9 },
        T: { x: 166, y: 26, w: 9, h: 16, xadv: 10 },
        U: { x: 176, y: 26, w: 8, h: 16, xadv: 9 },
        V: { x: 185, y: 26, w: 9, h: 16, xadv: 10 },
        W: { x: 195, y: 26, w: 15, h: 16, xadv: 16 },
        X: { x: 211, y: 26, w: 9, h: 16, xadv: 10 },
        Y: { x: 221, y: 26, w: 7, h: 16, xadv: 8 },
        Z: { x: 0, y: 49, w: 7, h: 16, xadv: 8 },
        ".": { x: 8, y: 49, w: 1, h: 16, xadv: 2 },
        ",": { x: 10, y: 49, w: 2, h: 18, xadv: 3 },
        "!": { x: 13, y: 49, w: 1, h: 16, xadv: 2 },
        "?": { x: 16, y: 49, w: 7, h: 16, xadv: 8 },
        "'": { x: 24, y: 49, w: 1, h: 2, xadv: 2, yoff: 5 },
        "\"": { x: 26, y: 49, w: 3, h: 2, xadv: 4, yoff: 1 },
        ":": { x: 132, y: 49, w: 1, h: 16, xadv: 2, yoff: 1 },
        ";": { x: 134, y: 49, w: 2, h: 16, xadv: 3, yoff: 1 },
        "(": { x: 142, y: 47, w: 4, h: 19, xadv: 4, yoff: -1 },
        ")": { x: 150, y: 47, w: 4, h: 19, xadv: 5, yoff: -1 },
    },
    kernings: [
        ["9", "7", -1],
        ["3", ",", -1],
        ["4", ",", -1],
        ["5", ",", -1],
        ["6", ",", -1],
        ["7", ",", -2],
        ["8", ",", -1],
        ["9", ",", -1],
        ["3", ".", -1],
        ["4", ".", -1],
        ["5", ".", -1],
        ["6", ".", -1],
        ["7", ".", -2],
        ["8", ".", -1],
        ["9", ".", -1],
        ["a", "c", -1],
        ["a", "d", -1],
        ["a", "g", -1],
        ["a", "j", -4],
        ["a", "p", -1],
        ["a", "s", -1],
        ["a", "t", -1],
        ["a", "u", -1],
        ["a", "v", -1],
        ["a", "w", -1],
        ["b", "u", -1],
        ["d", "a", -1],
        ["d", "e", -1],
        ["d", "o", -1],
        ["d", "u", -1],
        ["d", "v", -1],
        ["e", "j", -4],
        ["f", "e", -3],
        ["f", "i", -2],
        ["f", "f", -1],
        ["f", "o", -2],
        ["f", "r", -2],
        ["f", "u", -2],
        ["g", "e", -1],
        ["g", "g", -1],
        ["i", "p", -1],
        ["i", "s", -1],
        ["i", "t", -1],
        ["i", "v", -1],
        ["k", "e", -1],
        ["k", "y", -1],
        ["o", "j", -4],
        ["o", "p", -1],
        ["o", "u", -1],
        ["o", "v", -1],
        ["o", "w", -1],
        ["p", "p", -1],
        ["p", "y", -1],
        ["u", "a", -1],
        ["u", "g", -1],
        ["u", "p", -1],
        ["u", "t", -1],
        ["u", "w", -1],
        ["w", "h", -1],
        ["F", "a", -1],
        ["F", "e", -1],
        ["F", "i", -1],
        ["F", "o", -1],
        ["F", "r", -1],
        ["J", "i", -1],
        ["J", "o", -1],
        ["J", "u", -1],
        ["L", "a", -1],
        ["L", "e", -1],
        ["L", "u", -1],
        ["P", "a", -1],
        ["P", "e", -2],
        ["P", "o", -2],
        ["P", "u", -1],
        ["T", "a", -3],
        ["T", "e", -3],
        ["T", "i", -2],
        ["T", "o", -3],
        ["T", "r", -3],
        ["T", "u", -3],
        ["T", "w", -3],
        ["V", "e", -1],
        ["W", "e", -1],
        ["W", "o", -1],
        ["W", "u", -1],
        ["Y", "a", -1],
        ["g", "?", -1],
        ["g", ",", -1],
        ["k", "\"", -1],
        ["n", "'", -1],
        ["u", "'", -1],
        ["-", "f", -1],
        ["-", "T", -3],
        ["\"", ",", -1],
        ["\"", "A", -3],
        ["(", ")", 1],
    ],
});
