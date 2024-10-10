// This file is generated

const atlases = [{ url: require("./atlas0.png"), texturesCount: 60 }];

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
    BigKey1: tx({ id: "BigKey1", atlas: 0, x: 871, y: 76, width: 150, height: 28 }),
    Collectibles: {
      BallRed: tx({ id: "Collectibles.BallRed", atlas: 0, x: 949, y: 0, width: 8, height: 8 }),
      ValuableBlue: tx({ id: "Collectibles.ValuableBlue", atlas: 0, x: 931, y: 0, width: 17, height: 13 }),
      ValuableGreen: tx({ id: "Collectibles.ValuableGreen", atlas: 0, x: 645, y: 122, width: 7, height: 6 }),
      ValuableOrange: tx({ id: "Collectibles.ValuableOrange", atlas: 0, x: 931, y: 14, width: 17, height: 13 }),
    },
    Effects: {
      PoisonDripSmall: tx({ id: "Effects.PoisonDripSmall", atlas: 0, x: 931, y: 28, width: 1, height: 2 }),
      SplashMedium: tx({ id: "Effects.SplashMedium", atlas: 0, x: 354, y: 114, width: 48, height: 16 }),
      SplashSmall: tx({ id: "Effects.SplashSmall", atlas: 0, x: 959, y: 0, width: 64, height: 8 }),
      ValuableSparkle: tx({ id: "Effects.ValuableSparkle", atlas: 0, x: 609, y: 122, width: 35, height: 7 }),
      WaterDripSmall: tx({ id: "Effects.WaterDripSmall", atlas: 0, x: 957, y: 18, width: 1, height: 2 }),
      WaterDripXsmall: tx({ id: "Effects.WaterDripXsmall", atlas: 0, x: 933, y: 28, width: 1, height: 2 }),
    },
    Enemy: {
      CommonClown: tx({ id: "Enemy.CommonClown", atlas: 0, x: 609, y: 89, width: 44, height: 32 }),
      SpikeBall: tx({ id: "Enemy.SpikeBall", atlas: 0, x: 549, y: 133, width: 14, height: 14 }),
    },
    Font: {
      Diggit: tx({ id: "Font.Diggit", atlas: 0, x: 451, y: 106, width: 54, height: 8 }),
      ErotixLight: tx({ id: "Font.ErotixLight", atlas: 0, x: 193, y: 83, width: 160, height: 34 }),
      Erotix: tx({ id: "Font.Erotix", atlas: 0, x: 0, y: 100, width: 160, height: 34 }),
      Flaccid: tx({ id: "Font.Flaccid", atlas: 0, x: 871, y: 122, width: 102, height: 24 }),
    },
    IguaRpgTitle: tx({ id: "IguaRpgTitle", atlas: 0, x: 654, y: 76, width: 216, height: 60 }),
    Iguana: {
      Club: tx({ id: "Iguana.Club", atlas: 0, x: 354, y: 89, width: 96, height: 24 }),
      Crest: tx({ id: "Iguana.Crest", atlas: 0, x: 397, y: 56, width: 256, height: 32 }),
      Eye: tx({ id: "Iguana.Eye", atlas: 0, x: 452, y: 148, width: 16, height: 16 }),
      Foot: tx({ id: "Iguana.Foot", atlas: 0, x: 397, y: 31, width: 280, height: 24 }),
      Head: tx({ id: "Iguana.Head", atlas: 0, x: 974, y: 131, width: 36, height: 36 }),
      Horn: tx({ id: "Iguana.Horn", atlas: 0, x: 451, y: 89, width: 96, height: 16 }),
      Mouth: tx({ id: "Iguana.Mouth", atlas: 0, x: 871, y: 105, width: 144, height: 16 }),
      Nails: tx({ id: "Iguana.Nails", atlas: 0, x: 548, y: 89, width: 60, height: 12 }),
      Pupil: tx({ id: "Iguana.Pupil", atlas: 0, x: 0, y: 83, width: 192, height: 16 }),
      Tail: tx({ id: "Iguana.Tail", atlas: 0, x: 678, y: 31, width: 280, height: 44 }),
      Torso: tx({ id: "Iguana.Torso", atlas: 0, x: 403, y: 115, width: 48, height: 48 }),
    },
    Light: {
      ShadowIrregularSmall: tx({ id: "Light.ShadowIrregularSmall", atlas: 0, x: 654, y: 67, width: 16, height: 8 }),
    },
    LockedDoor: tx({ id: "LockedDoor", atlas: 0, x: 609, y: 130, width: 30, height: 32 }),
    Metal: {
      PipeDarkBroken: tx({ id: "Metal.PipeDarkBroken", atlas: 0, x: 1011, y: 131, width: 4, height: 12 }),
    },
    OpenDoor: tx({ id: "OpenDoor", atlas: 0, x: 452, y: 115, width: 30, height: 32 }),
    OversizedAngel: tx({ id: "OversizedAngel", atlas: 0, x: 0, y: 31, width: 396, height: 51 }),
    Placeholder: tx({ id: "Placeholder", atlas: 0, x: 564, y: 133, width: 14, height: 14 }),
    Pottery: {
      BodyGreen: tx({ id: "Pottery.BodyGreen", atlas: 0, x: 354, y: 83, width: 20, height: 4 }),
      BodyRed: tx({ id: "Pottery.BodyRed", atlas: 0, x: 579, y: 133, width: 14, height: 4 }),
      BodyYellow: tx({ id: "Pottery.BodyYellow", atlas: 0, x: 375, y: 83, width: 20, height: 4 }),
      HangerTriangle: tx({ id: "Pottery.HangerTriangle", atlas: 0, x: 594, y: 133, width: 14, height: 14 }),
      HeadGreen: tx({ id: "Pottery.HeadGreen", atlas: 0, x: 579, y: 138, width: 14, height: 8 }),
      HeadRed: tx({ id: "Pottery.HeadRed", atlas: 0, x: 579, y: 147, width: 14, height: 8 }),
      HeadYellow: tx({ id: "Pottery.HeadYellow", atlas: 0, x: 594, y: 148, width: 14, height: 8 }),
      PlantBushRed: tx({ id: "Pottery.PlantBushRed", atlas: 0, x: 654, y: 56, width: 18, height: 10 }),
      PlantReed: tx({ id: "Pottery.PlantReed", atlas: 0, x: 640, y: 130, width: 10, height: 16 }),
    },
    Shapes: {
      Circle64: tx({ id: "Shapes.Circle64", atlas: 0, x: 959, y: 9, width: 64, height: 64 }),
      LineVertical16: tx({ id: "Shapes.LineVertical16", atlas: 0, x: 1022, y: 74, width: 1, height: 16 }),
      Square32: tx({ id: "Shapes.Square32", atlas: 0, x: 483, y: 133, width: 32, height: 32 }),
    },
    Stone: {
      BrickIrregular1: tx({ id: "Stone.BrickIrregular1", atlas: 0, x: 469, y: 148, width: 10, height: 7 }),
      BrickRegular: tx({ id: "Stone.BrickRegular", atlas: 0, x: 483, y: 115, width: 22, height: 13 }),
      IrregularWall: tx({ id: "Stone.IrregularWall", atlas: 0, x: 161, y: 100, width: 24, height: 34 }),
      RockLargeShaded: tx({ id: "Stone.RockLargeShaded", atlas: 0, x: 506, y: 106, width: 38, height: 26 }),
      RockSmallShaded1: tx({ id: "Stone.RockSmallShaded1", atlas: 0, x: 949, y: 18, width: 7, height: 6 }),
    },
    Terrain: {
      Grass: {
        Shape1: tx({ id: "Terrain.Grass.Shape1", atlas: 0, x: 974, y: 122, width: 40, height: 8 }),
      },
      Pipe: {
        Gray: tx({ id: "Terrain.Pipe.Gray", atlas: 0, x: 545, y: 106, width: 1, height: 9 }),
      },
    },
    Ui: {
      Checkbox: tx({ id: "Ui.Checkbox", atlas: 0, x: 548, y: 102, width: 60, height: 30 }),
      ChooseYourLooksIcons: tx({ id: "Ui.ChooseYourLooksIcons", atlas: 0, x: 0, y: 0, width: 930, height: 30 }),
      NoneChoice: tx({ id: "Ui.NoneChoice", atlas: 0, x: 949, y: 9, width: 8, height: 8 }),
      PlacementReticle: tx({ id: "Ui.PlacementReticle", atlas: 0, x: 186, y: 100, width: 6, height: 6 }),
    },
    Wood: {
      MeasuringStick: tx({ id: "Wood.MeasuringStick", atlas: 0, x: 1016, y: 105, width: 8, height: 64 }),
      Sign: tx({ id: "Wood.Sign", atlas: 0, x: 516, y: 133, width: 32, height: 18 }),
    },
  };
}

export const GeneratedTextureData = {
  atlases,
  txs,
};
