// This file is generated

const atlases = [{ url: require("./atlas0.png"), texturesCount: 45 }];

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
    BigKey1: tx({ id: "BigKey1", atlas: 0, x: 614, y: 31, width: 150, height: 28 }),
    Collectibles: {
      ValuableBlue: tx({ id: "Collectibles.ValuableBlue", atlas: 0, x: 923, y: 74, width: 17, height: 13 }),
      ValuableGreen: tx({ id: "Collectibles.ValuableGreen", atlas: 0, x: 743, y: 60, width: 7, height: 6 }),
      ValuableOrange: tx({ id: "Collectibles.ValuableOrange", atlas: 0, x: 904, y: 85, width: 17, height: 13 }),
    },
    Effects: {
      ValuableSparkle: tx({ id: "Effects.ValuableSparkle", atlas: 0, x: 837, y: 67, width: 35, height: 7 }),
      WaterDripSmall: tx({ id: "Effects.WaterDripSmall", atlas: 0, x: 904, y: 67, width: 1, height: 2 }),
    },
    Enemy: {
      CommonClown: tx({ id: "Enemy.CommonClown", atlas: 0, x: 792, y: 67, width: 44, height: 32 }),
      SpikeBall: tx({ id: "Enemy.SpikeBall", atlas: 0, x: 1010, y: 61, width: 14, height: 14 }),
    },
    Font: {
      Diggit: tx({ id: "Font.Diggit", atlas: 0, x: 906, y: 65, width: 54, height: 8 }),
      ErotixLight: tx({ id: "Font.ErotixLight", atlas: 0, x: 0, y: 83, width: 160, height: 34 }),
      Erotix: tx({ id: "Font.Erotix", atlas: 0, x: 161, y: 83, width: 160, height: 34 }),
      Flaccid: tx({ id: "Font.Flaccid", atlas: 0, x: 906, y: 31, width: 102, height: 24 }),
    },
    IguaRpgTitle: tx({ id: "IguaRpgTitle", atlas: 0, x: 397, y: 31, width: 216, height: 60 }),
    Iguana: {
      Club: tx({ id: "Iguana.Club", atlas: 0, x: 961, y: 65, width: 48, height: 12 }),
      Crest: tx({ id: "Iguana.Crest", atlas: 0, x: 614, y: 60, width: 128, height: 16 }),
      Eye: tx({ id: "Iguana.Eye", atlas: 0, x: 782, y: 76, width: 8, height: 8 }),
      Foot: tx({ id: "Iguana.Foot", atlas: 0, x: 765, y: 31, width: 140, height: 12 }),
      Head: tx({ id: "Iguana.Head", atlas: 0, x: 807, y: 100, width: 18, height: 18 }),
      Horn: tx({ id: "Iguana.Horn", atlas: 0, x: 743, y: 67, width: 48, height: 8 }),
      Mouth: tx({ id: "Iguana.Mouth", atlas: 0, x: 322, y: 83, width: 60, height: 8 }),
      Nails: tx({ id: "Iguana.Nails", atlas: 0, x: 992, y: 19, width: 30, height: 6 }),
      Pupil: tx({ id: "Iguana.Pupil", atlas: 0, x: 906, y: 56, width: 96, height: 8 }),
      Tail: tx({ id: "Iguana.Tail", atlas: 0, x: 765, y: 44, width: 140, height: 22 }),
      Torso: tx({ id: "Iguana.Torso", atlas: 0, x: 782, y: 100, width: 24, height: 24 }),
    },
    LockedDoor: tx({ id: "LockedDoor", atlas: 0, x: 873, y: 67, width: 30, height: 32 }),
    Metal: {
      PipeDarkBroken: tx({ id: "Metal.PipeDarkBroken", atlas: 0, x: 868, y: 75, width: 4, height: 12 }),
    },
    OpenDoor: tx({ id: "OpenDoor", atlas: 0, x: 837, y: 75, width: 30, height: 32 }),
    OversizedAngel: tx({ id: "OversizedAngel", atlas: 0, x: 0, y: 31, width: 396, height: 51 }),
    Placeholder: tx({ id: "Placeholder", atlas: 0, x: 1010, y: 76, width: 14, height: 14 }),
    Pottery: {
      BodyGreen: tx({ id: "Pottery.BodyGreen", atlas: 0, x: 992, y: 26, width: 20, height: 4 }),
      BodyRed: tx({ id: "Pottery.BodyRed", atlas: 0, x: 1009, y: 31, width: 14, height: 4 }),
      BodyYellow: tx({ id: "Pottery.BodyYellow", atlas: 0, x: 1003, y: 56, width: 20, height: 4 }),
      HangerTriangle: tx({ id: "Pottery.HangerTriangle", atlas: 0, x: 1009, y: 36, width: 14, height: 14 }),
      HeadGreen: tx({ id: "Pottery.HeadGreen", atlas: 0, x: 941, y: 74, width: 14, height: 8 }),
      HeadRed: tx({ id: "Pottery.HeadRed", atlas: 0, x: 956, y: 78, width: 14, height: 8 }),
      HeadYellow: tx({ id: "Pottery.HeadYellow", atlas: 0, x: 941, y: 83, width: 14, height: 8 }),
      PlantBushRed: tx({ id: "Pottery.PlantBushRed", atlas: 0, x: 904, y: 74, width: 18, height: 10 }),
      PlantReed: tx({ id: "Pottery.PlantReed", atlas: 0, x: 826, y: 100, width: 10, height: 16 }),
    },
    Stone: {
      RockLargeShaded: tx({ id: "Stone.RockLargeShaded", atlas: 0, x: 743, y: 76, width: 38, height: 26 }),
    },
    Terrain: {
      Pipe: {
        Gray: tx({ id: "Terrain.Pipe.Gray", atlas: 0, x: 1023, y: 19, width: 1, height: 9 }),
      },
    },
    Ui: {
      Checkbox: tx({ id: "Ui.Checkbox", atlas: 0, x: 931, y: 0, width: 60, height: 30 }),
      ChooseYourLooksIcons: tx({ id: "Ui.ChooseYourLooksIcons", atlas: 0, x: 0, y: 0, width: 930, height: 30 }),
      NoneChoice: tx({ id: "Ui.NoneChoice", atlas: 0, x: 782, y: 85, width: 8, height: 8 }),
      PlacementReticle: tx({ id: "Ui.PlacementReticle", atlas: 0, x: 751, y: 60, width: 6, height: 6 }),
    },
    Wood: {
      Sign: tx({ id: "Wood.Sign", atlas: 0, x: 992, y: 0, width: 32, height: 18 }),
    },
  };
}

export const GeneratedTextureData = {
  atlases,
  txs,
};
