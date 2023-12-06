// This file is generated

const atlases = [{ url: require("./atlas0.png"), texturesCount: 15 }];

interface GeneratedTexture {
  id: string;
  atlas: number;
  x: number;
  y: number;
  width: number;
  height: number;
  subimages?: number;
}

function txs<T>(tx: (data: GeneratedTexture) => T) {
  return {
    IguaRpgTitle: tx({ id: "IguaRpgTitle", atlas: 0, x: 0, y: 52, width: 216, height: 60 }),
    Iguana: {
      Club: tx({ id: "Iguana.Club", atlas: 0, x: 397, y: 26, width: 48, height: 12, subimages: 4 }),
      Crest: tx({ id: "Iguana.Crest", atlas: 0, x: 397, y: 0, width: 80, height: 16, subimages: 5 }),
      Eye: tx({ id: "Iguana.Eye", atlas: 0, x: 435, y: 39, width: 8, height: 8 }),
      Foot: tx({ id: "Iguana.Foot", atlas: 0, x: 358, y: 52, width: 126, height: 12, subimages: 9 }),
      Head: tx({ id: "Iguana.Head", atlas: 0, x: 471, y: 26, width: 18, height: 18 }),
      Horn: tx({ id: "Iguana.Horn", atlas: 0, x: 418, y: 39, width: 16, height: 8, subimages: 2 }),
      Mouth: tx({ id: "Iguana.Mouth", atlas: 0, x: 462, y: 17, width: 48, height: 8, subimages: 4 }),
      Nails: tx({ id: "Iguana.Nails", atlas: 0, x: 397, y: 39, width: 20, height: 6, subimages: 2 }),
      Pupil: tx({ id: "Iguana.Pupil", atlas: 0, x: 397, y: 17, width: 64, height: 8, subimages: 8 }),
      Tail: tx({ id: "Iguana.Tail", atlas: 0, x: 217, y: 52, width: 140, height: 22, subimages: 5 }),
      Torso: tx({ id: "Iguana.Torso", atlas: 0, x: 446, y: 26, width: 24, height: 24 }),
    },
    LockedDoor: tx({ id: "LockedDoor", atlas: 0, x: 389, y: 65, width: 30, height: 32 }),
    OpenDoor: tx({ id: "OpenDoor", atlas: 0, x: 358, y: 65, width: 30, height: 32 }),
    OversizedAngel: tx({ id: "OversizedAngel", atlas: 0, x: 0, y: 0, width: 396, height: 51 }),
  };
}

export const GeneratedTextureData = {
  atlases,
  txs,
};
