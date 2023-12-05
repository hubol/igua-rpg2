
// This file is generated

const atlases = [ { url: require("./atlas0.png"), texturesCount: 15 } ];

interface GeneratedTexture {
    atlas: number;
    x: number;
    y: number;
    width: number;
    height: number;
    subimages?: number;
}

function txs<T>(tx: (data: GeneratedTexture) => T) {
    return {
      "IguaRpgTitle": tx({ atlas: 0, x: 0, y: 52, width: 216, height: 60 }),
      "Iguana": {
        "Club": tx({ atlas: 0, x: 397, y: 26, width: 48, height: 12, subimages: 4 }),
        "Crest": tx({ atlas: 0, x: 397, y: 0, width: 80, height: 16, subimages: 5 }),
        "Eye": tx({ atlas: 0, x: 435, y: 39, width: 8, height: 8 }),
        "Foot": tx({ atlas: 0, x: 358, y: 52, width: 126, height: 12, subimages: 9 }),
        "Head": tx({ atlas: 0, x: 471, y: 26, width: 18, height: 18 }),
        "Horn": tx({ atlas: 0, x: 418, y: 39, width: 16, height: 8, subimages: 2 }),
        "Mouth": tx({ atlas: 0, x: 462, y: 17, width: 48, height: 8, subimages: 4 }),
        "Nails": tx({ atlas: 0, x: 397, y: 39, width: 20, height: 6, subimages: 2 }),
        "Pupil": tx({ atlas: 0, x: 397, y: 17, width: 64, height: 8, subimages: 8 }),
        "Tail": tx({ atlas: 0, x: 217, y: 52, width: 140, height: 22, subimages: 5 }),
        "Torso": tx({ atlas: 0, x: 446, y: 26, width: 24, height: 24 }),
      },
      "LockedDoor": tx({ atlas: 0, x: 389, y: 65, width: 30, height: 32 }),
      "OpenDoor": tx({ atlas: 0, x: 358, y: 65, width: 30, height: 32 }),
      "OversizedAngel": tx({ atlas: 0, x: 0, y: 0, width: 396, height: 51 }),
    }
}

export const GeneratedTextureData = {
    atlases,
    txs,
}
