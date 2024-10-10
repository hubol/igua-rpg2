// This file is generated

const atlases = [{ url: require("./atlas0.png"), texturesCount: 61 }];

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
    BigKey1: tx({ id: "BigKey1", atlas: 0, x: 378, y: 116, width: 150, height: 28 }),
    Collectibles: {
      BallRed: tx({ id: "Collectibles.BallRed", atlas: 0, x: 972, y: 22, width: 8, height: 8 }),
      ValuableBlue: tx({ id: "Collectibles.ValuableBlue", atlas: 0, x: 856, y: 100, width: 17, height: 13 }),
      ValuableGreen: tx({ id: "Collectibles.ValuableGreen", atlas: 0, x: 1001, y: 49, width: 7, height: 6 }),
      ValuableOrange: tx({ id: "Collectibles.ValuableOrange", atlas: 0, x: 856, y: 114, width: 17, height: 13 }),
    },
    Effects: {
      PoisonDripSmall: tx({ id: "Effects.PoisonDripSmall", atlas: 0, x: 871, y: 128, width: 1, height: 2 }),
      SplashMedium: tx({ id: "Effects.SplashMedium", atlas: 0, x: 825, y: 83, width: 48, height: 16 }),
      SplashSmall: tx({ id: "Effects.SplashSmall", atlas: 0, x: 426, y: 58, width: 64, height: 8 }),
      ValuableSparkle: tx({ id: "Effects.ValuableSparkle", atlas: 0, x: 281, y: 75, width: 35, height: 7 }),
      WaterDripSmall: tx({ id: "Effects.WaterDripSmall", atlas: 0, x: 1001, y: 30, width: 1, height: 2 }),
      WaterDripXsmall: tx({ id: "Effects.WaterDripXsmall", atlas: 0, x: 1003, y: 30, width: 1, height: 2 }),
    },
    Enemy: {
      CommonClown: tx({ id: "Enemy.CommonClown", atlas: 0, x: 473, y: 145, width: 44, height: 32 }),
      SpikeBall: tx({ id: "Enemy.SpikeBall", atlas: 0, x: 1005, y: 19, width: 14, height: 14 }),
    },
    Font: {
      Diggit: tx({ id: "Font.Diggit", atlas: 0, x: 931, y: 13, width: 54, height: 8 }),
      ErotixLight: tx({ id: "Font.ErotixLight", atlas: 0, x: 538, y: 83, width: 160, height: 34 }),
      Erotix: tx({ id: "Font.Erotix", atlas: 0, x: 217, y: 116, width: 160, height: 34 }),
      Flaccid: tx({ id: "Font.Flaccid", atlas: 0, x: 898, y: 31, width: 102, height: 24 }),
    },
    IguaRpgTitle: tx({ id: "IguaRpgTitle", atlas: 0, x: 0, y: 111, width: 216, height: 60 }),
    Iguana: {
      Club: tx({ id: "Iguana.Club", atlas: 0, x: 898, y: 56, width: 96, height: 24 }),
      Crest: tx({ id: "Iguana.Crest", atlas: 0, x: 281, y: 83, width: 256, height: 32 }),
      Eye: tx({ id: "Iguana.Eye", atlas: 0, x: 474, y: 41, width: 16, height: 16 }),
      Foot: tx({ id: "Iguana.Foot", atlas: 0, x: 0, y: 41, width: 280, height: 24 }),
      Head: tx({ id: "Iguana.Head", atlas: 0, x: 874, y: 98, width: 36, height: 36 }),
      Horn: tx({ id: "Iguana.Horn", atlas: 0, x: 898, y: 81, width: 96, height: 16 }),
      Mouth: tx({ id: "Iguana.Mouth", atlas: 0, x: 281, y: 58, width: 144, height: 16 }),
      Nails: tx({ id: "Iguana.Nails", atlas: 0, x: 931, y: 0, width: 60, height: 12 }),
      Pupil: tx({ id: "Iguana.Pupil", atlas: 0, x: 281, y: 41, width: 192, height: 16 }),
      Tail: tx({ id: "Iguana.Tail", atlas: 0, x: 0, y: 66, width: 280, height: 44 }),
      Torso: tx({ id: "Iguana.Torso", atlas: 0, x: 378, y: 145, width: 48, height: 48 }),
    },
    Light: {
      ShadowIrregularSmall: tx({ id: "Light.ShadowIrregularSmall", atlas: 0, x: 512, y: 178, width: 16, height: 8 }),
    },
    LockedDoor: tx({ id: "LockedDoor", atlas: 0, x: 825, y: 100, width: 30, height: 32 }),
    Metal: {
      PipeDarkBroken: tx({ id: "Metal.PipeDarkBroken", atlas: 0, x: 1020, y: 36, width: 4, height: 12 }),
    },
    OpenDoor: tx({ id: "OpenDoor", atlas: 0, x: 427, y: 145, width: 45, height: 48 }),
    OversizedAngel: tx({ id: "OversizedAngel", atlas: 0, x: 501, y: 31, width: 396, height: 51 }),
    Placeholder: tx({ id: "Placeholder", atlas: 0, x: 856, y: 128, width: 14, height: 14 }),
    Pottery: {
      BodyGreen: tx({ id: "Pottery.BodyGreen", atlas: 0, x: 217, y: 111, width: 20, height: 4 }),
      BodyRed: tx({ id: "Pottery.BodyRed", atlas: 0, x: 259, y: 111, width: 14, height: 4 }),
      BodyYellow: tx({ id: "Pottery.BodyYellow", atlas: 0, x: 238, y: 111, width: 20, height: 4 }),
      HangerTriangle: tx({ id: "Pottery.HangerTriangle", atlas: 0, x: 1001, y: 34, width: 14, height: 14 }),
      HeadGreen: tx({ id: "Pottery.HeadGreen", atlas: 0, x: 797, y: 114, width: 14, height: 8 }),
      HeadRed: tx({ id: "Pottery.HeadRed", atlas: 0, x: 797, y: 123, width: 14, height: 8 }),
      HeadYellow: tx({ id: "Pottery.HeadYellow", atlas: 0, x: 797, y: 132, width: 14, height: 8 }),
      PlantBushRed: tx({ id: "Pottery.PlantBushRed", atlas: 0, x: 986, y: 19, width: 18, height: 10 }),
      PlantReed: tx({ id: "Pottery.PlantReed", atlas: 0, x: 518, y: 145, width: 10, height: 16 }),
    },
    Shapes: {
      Circle64: tx({ id: "Shapes.Circle64", atlas: 0, x: 699, y: 83, width: 64, height: 64 }),
      LineVertical16: tx({ id: "Shapes.LineVertical16", atlas: 0, x: 1020, y: 19, width: 1, height: 16 }),
      Square32: tx({ id: "Shapes.Square32", atlas: 0, x: 764, y: 114, width: 32, height: 32 }),
    },
    Stone: {
      BrickIrregular1: tx({ id: "Stone.BrickIrregular1", atlas: 0, x: 317, y: 75, width: 10, height: 7 }),
      BrickRegular: tx({ id: "Stone.BrickRegular", atlas: 0, x: 874, y: 83, width: 22, height: 13 }),
      IrregularWall: tx({ id: "Stone.IrregularWall", atlas: 0, x: 995, y: 56, width: 24, height: 34 }),
      RockLargeShaded: tx({ id: "Stone.RockLargeShaded", atlas: 0, x: 473, y: 178, width: 38, height: 26 }),
      RockSmallShaded1: tx({ id: "Stone.RockSmallShaded1", atlas: 0, x: 1009, y: 49, width: 7, height: 6 }),
    },
    Terrain: {
      Grass: {
        Shape1: tx({ id: "Terrain.Grass.Shape1", atlas: 0, x: 931, y: 22, width: 40, height: 8 }),
      },
      Pipe: {
        Gray: tx({ id: "Terrain.Pipe.Gray", atlas: 0, x: 426, y: 67, width: 64, height: 13 }),
      },
    },
    Ui: {
      Checkbox: tx({ id: "Ui.Checkbox", atlas: 0, x: 764, y: 83, width: 60, height: 30 }),
      ChooseYourLooksIcons: tx({ id: "Ui.ChooseYourLooksIcons", atlas: 0, x: 0, y: 0, width: 930, height: 30 }),
      HorizontalBar9: tx({ id: "Ui.HorizontalBar9", atlas: 0, x: 0, y: 31, width: 500, height: 9 }),
      NoneChoice: tx({ id: "Ui.NoneChoice", atlas: 0, x: 491, y: 41, width: 8, height: 8 }),
      PlacementReticle: tx({ id: "Ui.PlacementReticle", atlas: 0, x: 1017, y: 49, width: 6, height: 6 }),
    },
    Wood: {
      MeasuringStick: tx({ id: "Wood.MeasuringStick", atlas: 0, x: 529, y: 116, width: 8, height: 64 }),
      Sign: tx({ id: "Wood.Sign", atlas: 0, x: 992, y: 0, width: 32, height: 18 }),
    },
  };
}

export const GeneratedTextureData = {
  atlases,
  txs,
};
