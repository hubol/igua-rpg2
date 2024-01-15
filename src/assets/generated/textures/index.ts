// This file is generated

const atlases = [{ url: require("./atlas0.png"), texturesCount: 21 }];

interface TxData {
  id: string;
  atlas: number;
  x: number;
  y: number;
  width: number;
  height: number;
}

function txs<T>(tx: (data: TxData) => T) {
  return {
    BigKey1: tx({ id: "BigKey1", atlas: 0, x: 0, y: 113, width: 150, height: 28 }),
    Font: {
      Acrobatix: tx({ id: "Font.Acrobatix", atlas: 0, x: 378, y: 52, width: 128, height: 128 }),
      Atomix: tx({ id: "Font.Atomix", atlas: 0, x: 292, y: 139, width: 64, height: 64 }),
      Diggit: tx({ id: "Font.Diggit", atlas: 0, x: 397, y: 9, width: 48, height: 8 }),
      ErotixLight: tx({ id: "Font.ErotixLight", atlas: 0, x: 217, y: 87, width: 160, height: 34 }),
      Erotix: tx({ id: "Font.Erotix", atlas: 0, x: 217, y: 52, width: 160, height: 34 }),
    },
    IguaRpgTitle: tx({ id: "IguaRpgTitle", atlas: 0, x: 0, y: 52, width: 216, height: 60 }),
    Iguana: {
      Club: tx({ id: "Iguana.Club", atlas: 0, x: 446, y: 0, width: 48, height: 12 }),
      Crest: tx({ id: "Iguana.Crest", atlas: 0, x: 292, y: 122, width: 80, height: 16 }),
      Eye: tx({ id: "Iguana.Eye", atlas: 0, x: 459, y: 38, width: 8, height: 8 }),
      Foot: tx({ id: "Iguana.Foot", atlas: 0, x: 0, y: 142, width: 126, height: 12 }),
      Head: tx({ id: "Iguana.Head", atlas: 0, x: 357, y: 146, width: 18, height: 18 }),
      Horn: tx({ id: "Iguana.Horn", atlas: 0, x: 495, y: 0, width: 16, height: 8 }),
      Mouth: tx({ id: "Iguana.Mouth", atlas: 0, x: 397, y: 0, width: 48, height: 8 }),
      Nails: tx({ id: "Iguana.Nails", atlas: 0, x: 357, y: 139, width: 20, height: 6 }),
      Pupil: tx({ id: "Iguana.Pupil", atlas: 0, x: 151, y: 113, width: 64, height: 8 }),
      Tail: tx({ id: "Iguana.Tail", atlas: 0, x: 151, y: 122, width: 140, height: 22 }),
      Torso: tx({ id: "Iguana.Torso", atlas: 0, x: 459, y: 13, width: 24, height: 24 }),
    },
    LockedDoor: tx({ id: "LockedDoor", atlas: 0, x: 428, y: 18, width: 30, height: 32 }),
    OpenDoor: tx({ id: "OpenDoor", atlas: 0, x: 397, y: 18, width: 30, height: 32 }),
    OversizedAngel: tx({ id: "OversizedAngel", atlas: 0, x: 0, y: 0, width: 396, height: 51 }),
  };
}

export const GeneratedTextureData = {
  atlases,
  txs,
};
