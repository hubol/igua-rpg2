// This file is generated

const atlases = [{ url: require("./atlas0.png"), texturesCount: 72 }];

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
    BigKey1: tx({ id: "BigKey1", atlas: 0, x: 0, y: 140, width: 150, height: 28 }),
    Collectibles: {
      BallRed: tx({ id: "Collectibles.BallRed", atlas: 0, x: 271, y: 159, width: 8, height: 8 }),
      ValuableBlue: tx({ id: "Collectibles.ValuableBlue", atlas: 0, x: 624, y: 144, width: 17, height: 13 }),
      ValuableGreen: tx({ id: "Collectibles.ValuableGreen", atlas: 0, x: 493, y: 67, width: 7, height: 6 }),
      ValuableOrange: tx({ id: "Collectibles.ValuableOrange", atlas: 0, x: 624, y: 158, width: 17, height: 13 }),
    },
    Effects: {
      PoisonDripSmall: tx({ id: "Effects.PoisonDripSmall", atlas: 0, x: 281, y: 95, width: 1, height: 2 }),
      SplashMedium: tx({ id: "Effects.SplashMedium", atlas: 0, x: 445, y: 50, width: 48, height: 16 }),
      SplashSmall: tx({ id: "Effects.SplashSmall", atlas: 0, x: 151, y: 168, width: 64, height: 8 }),
      ValuableSparkle: tx({ id: "Effects.ValuableSparkle", atlas: 0, x: 498, y: 108, width: 35, height: 7 }),
      WaterDripSmall: tx({ id: "Effects.WaterDripSmall", atlas: 0, x: 1012, y: 24, width: 1, height: 2 }),
      WaterDripXsmall: tx({ id: "Effects.WaterDripXsmall", atlas: 0, x: 24, y: 239, width: 1, height: 2 }),
    },
    Enemy: {
      CommonClown: tx({ id: "Enemy.CommonClown", atlas: 0, x: 49, y: 169, width: 44, height: 32 }),
      SpikeBall: tx({ id: "Enemy.SpikeBall", atlas: 0, x: 547, y: 147, width: 14, height: 14 }),
    },
    Foliage: {
      Medium0: tx({ id: "Foliage.Medium0", atlas: 0, x: 0, y: 207, width: 26, height: 31 }),
      Small: tx({ id: "Foliage.Small", atlas: 0, x: 82, y: 202, width: 11, height: 17 }),
    },
    Font: {
      Diggit: tx({ id: "Font.Diggit", atlas: 0, x: 445, y: 41, width: 54, height: 8 }),
      ErotixLight: tx({ id: "Font.ErotixLight", atlas: 0, x: 284, y: 41, width: 160, height: 34 }),
      Erotix: tx({ id: "Font.Erotix", atlas: 0, x: 822, y: 100, width: 160, height: 34 }),
      Flaccid: tx({ id: "Font.Flaccid", atlas: 0, x: 898, y: 31, width: 102, height: 24 }),
    },
    IguaRpgTitle: tx({ id: "IguaRpgTitle", atlas: 0, x: 281, y: 108, width: 216, height: 60 }),
    Iguana: {
      Club: tx({ id: "Iguana.Club", atlas: 0, x: 898, y: 56, width: 96, height: 24 }),
      Crest: tx({ id: "Iguana.Crest", atlas: 0, x: 565, y: 83, width: 256, height: 32 }),
      Eye: tx({ id: "Iguana.Eye", atlas: 0, x: 995, y: 56, width: 16, height: 16 }),
      Foot: tx({ id: "Iguana.Foot", atlas: 0, x: 284, y: 83, width: 280, height: 24 }),
      Head: tx({ id: "Iguana.Head", atlas: 0, x: 983, y: 100, width: 36, height: 36 }),
      Horn: tx({ id: "Iguana.Horn", atlas: 0, x: 151, y: 140, width: 96, height: 16 }),
      Mouth: tx({ id: "Iguana.Mouth", atlas: 0, x: 498, y: 116, width: 144, height: 16 }),
      Nails: tx({ id: "Iguana.Nails", atlas: 0, x: 563, y: 133, width: 60, height: 12 }),
      Pupil: tx({ id: "Iguana.Pupil", atlas: 0, x: 822, y: 83, width: 192, height: 16 }),
      Tail: tx({ id: "Iguana.Tail", atlas: 0, x: 0, y: 95, width: 280, height: 44 }),
      Torso: tx({ id: "Iguana.Torso", atlas: 0, x: 547, y: 177, width: 48, height: 48 }),
    },
    Light: {
      ShadowIrregularSmall: tx({ id: "Light.ShadowIrregularSmall", atlas: 0, x: 224, y: 159, width: 16, height: 8 }),
    },
    LockedDoor: tx({ id: "LockedDoor", atlas: 0, x: 119, y: 169, width: 30, height: 32 }),
    Metal: {
      PipeDarkBroken: tx({ id: "Metal.PipeDarkBroken", atlas: 0, x: 1020, y: 89, width: 4, height: 12 }),
    },
    OpenDoor: tx({ id: "OpenDoor", atlas: 0, x: 596, y: 177, width: 45, height: 48 }),
    OversizedAngel: tx({ id: "OversizedAngel", atlas: 0, x: 501, y: 31, width: 396, height: 51 }),
    Placeholder: tx({ id: "Placeholder", atlas: 0, x: 547, y: 162, width: 14, height: 14 }),
    Pottery: {
      Ball0: tx({ id: "Pottery.Ball0", atlas: 0, x: 27, y: 232, width: 21, height: 20 }),
      BodyGreen: tx({ id: "Pottery.BodyGreen", atlas: 0, x: 931, y: 24, width: 20, height: 4 }),
      BodyRed: tx({ id: "Pottery.BodyRed", atlas: 0, x: 624, y: 172, width: 14, height: 4 }),
      BodyYellow: tx({ id: "Pottery.BodyYellow", atlas: 0, x: 284, y: 76, width: 20, height: 4 }),
      Figure0: tx({ id: "Pottery.Figure0", atlas: 0, x: 0, y: 169, width: 48, height: 37 }),
      HangerTriangle: tx({ id: "Pottery.HangerTriangle", atlas: 0, x: 0, y: 239, width: 14, height: 14 }),
      HeadGreen: tx({ id: "Pottery.HeadGreen", atlas: 0, x: 241, y: 159, width: 14, height: 8 }),
      HeadRed: tx({ id: "Pottery.HeadRed", atlas: 0, x: 256, y: 159, width: 14, height: 8 }),
      HeadYellow: tx({ id: "Pottery.HeadYellow", atlas: 0, x: 995, y: 73, width: 14, height: 8 }),
      PlantBushRed: tx({ id: "Pottery.PlantBushRed", atlas: 0, x: 624, y: 133, width: 18, height: 10 }),
      PlantReed: tx({ id: "Pottery.PlantReed", atlas: 0, x: 1001, y: 24, width: 10, height: 16 }),
      Plant0: tx({ id: "Pottery.Plant0", atlas: 0, x: 498, y: 147, width: 48, height: 49 }),
    },
    Shapes: {
      Circle64: tx({ id: "Shapes.Circle64", atlas: 0, x: 216, y: 168, width: 64, height: 64 }),
      LineVertical16: tx({ id: "Shapes.LineVertical16", atlas: 0, x: 820, y: 125, width: 1, height: 16 }),
      Square32: tx({ id: "Shapes.Square32", atlas: 0, x: 49, y: 202, width: 32, height: 32 }),
    },
    Sky: {
      Cloud0: tx({ id: "Sky.Cloud0", atlas: 0, x: 0, y: 41, width: 283, height: 53 }),
    },
    Stone: {
      BrickIrregular1: tx({ id: "Stone.BrickIrregular1", atlas: 0, x: 534, y: 108, width: 10, height: 7 }),
      BrickRegular: tx({ id: "Stone.BrickRegular", atlas: 0, x: 470, y: 67, width: 22, height: 13 }),
      IrregularWall: tx({ id: "Stone.IrregularWall", atlas: 0, x: 94, y: 169, width: 24, height: 34 }),
      RockLargeShaded: tx({ id: "Stone.RockLargeShaded", atlas: 0, x: 781, y: 125, width: 38, height: 26 }),
      RockSmallShaded1: tx({ id: "Stone.RockSmallShaded1", atlas: 0, x: 305, y: 76, width: 7, height: 6 }),
      Rock0: tx({ id: "Stone.Rock0", atlas: 0, x: 445, y: 67, width: 24, height: 15 }),
    },
    Terrain: {
      Earth: {
        Asterisk: tx({ id: "Terrain.Earth.Asterisk", atlas: 0, x: 27, y: 207, width: 21, height: 24 }),
        Mass0: tx({ id: "Terrain.Earth.Mass0", atlas: 0, x: 643, y: 116, width: 137, height: 81 }),
        Spots: tx({ id: "Terrain.Earth.Spots", atlas: 0, x: 931, y: 0, width: 86, height: 23 }),
      },
      Grass: {
        Loops: tx({ id: "Terrain.Grass.Loops", atlas: 0, x: 151, y: 157, width: 72, height: 10 }),
        Shape1: tx({ id: "Terrain.Grass.Shape1", atlas: 0, x: 781, y: 116, width: 40, height: 8 }),
      },
      Pipe: {
        Gray: tx({ id: "Terrain.Pipe.Gray", atlas: 0, x: 498, y: 133, width: 64, height: 13 }),
      },
    },
    Ui: {
      Checkbox: tx({ id: "Ui.Checkbox", atlas: 0, x: 563, y: 146, width: 60, height: 30 }),
      ChooseYourLooksIcons: tx({ id: "Ui.ChooseYourLooksIcons", atlas: 0, x: 0, y: 0, width: 930, height: 30 }),
      HorizontalBar9: tx({ id: "Ui.HorizontalBar9", atlas: 0, x: 0, y: 31, width: 500, height: 9 }),
      NoneChoice: tx({ id: "Ui.NoneChoice", atlas: 0, x: 15, y: 239, width: 8, height: 8 }),
      PlacementReticle: tx({ id: "Ui.PlacementReticle", atlas: 0, x: 1018, y: 0, width: 6, height: 6 }),
    },
    Wood: {
      MeasuringStick: tx({ id: "Wood.MeasuringStick", atlas: 0, x: 1015, y: 24, width: 8, height: 64 }),
      Sign: tx({ id: "Wood.Sign", atlas: 0, x: 248, y: 140, width: 32, height: 18 }),
    },
  };
}

export const GeneratedTextureData = {
  atlases,
  txs,
};
