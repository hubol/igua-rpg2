// This file is generated

const atlases = [{ url: require("./atlas0.png"), texturesCount: 20 }];

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
      Diggit: tx({ id: "Font.Diggit", atlas: 0, x: 446, y: 42, width: 48, height: 8 }),
      ErotixLight: tx({ id: "Font.ErotixLight", atlas: 0, x: 217, y: 87, width: 160, height: 34 }),
      Erotix: tx({ id: "Font.Erotix", atlas: 0, x: 217, y: 52, width: 160, height: 34 }),
      Flaccid: tx({ id: "Font.Flaccid", atlas: 0, x: 397, y: 0, width: 102, height: 24 }),
    },
    IguaRpgTitle: tx({ id: "IguaRpgTitle", atlas: 0, x: 0, y: 52, width: 216, height: 60 }),
    Iguana: {
      Club: tx({ id: "Iguana.Club", atlas: 0, x: 378, y: 65, width: 48, height: 12 }),
      Crest: tx({ id: "Iguana.Crest", atlas: 0, x: 397, y: 25, width: 80, height: 16 }),
      Eye: tx({ id: "Iguana.Eye", atlas: 0, x: 504, y: 65, width: 8, height: 8 }),
      Foot: tx({ id: "Iguana.Foot", atlas: 0, x: 378, y: 52, width: 126, height: 12 }),
      Head: tx({ id: "Iguana.Head", atlas: 0, x: 483, y: 72, width: 18, height: 18 }),
      Horn: tx({ id: "Iguana.Horn", atlas: 0, x: 495, y: 25, width: 16, height: 8 }),
      Mouth: tx({ id: "Iguana.Mouth", atlas: 0, x: 397, y: 42, width: 48, height: 8 }),
      Nails: tx({ id: "Iguana.Nails", atlas: 0, x: 483, y: 65, width: 20, height: 6 }),
      Pupil: tx({ id: "Iguana.Pupil", atlas: 0, x: 151, y: 113, width: 64, height: 8 }),
      Tail: tx({ id: "Iguana.Tail", atlas: 0, x: 151, y: 122, width: 140, height: 22 }),
      Torso: tx({ id: "Iguana.Torso", atlas: 0, x: 458, y: 65, width: 24, height: 24 }),
    },
    LockedDoor: tx({ id: "LockedDoor", atlas: 0, x: 378, y: 78, width: 30, height: 32 }),
    OpenDoor: tx({ id: "OpenDoor", atlas: 0, x: 427, y: 65, width: 30, height: 32 }),
    OversizedAngel: tx({ id: "OversizedAngel", atlas: 0, x: 0, y: 0, width: 396, height: 51 }),
  };
}

export const GeneratedTextureData = {
  atlases,
  txs,
};
