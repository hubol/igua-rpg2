// This file is generated

const atlases = [{ url: require("./atlas0.png"), texturesCount: 147 }];

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
    BigKey1: tx({ id: "BigKey1", atlas: 0, x: 840, y: 251, width: 150, height: 28 }),
    Collectibles: {
      BallFruitTypeB: tx({ id: "Collectibles.BallFruitTypeB", atlas: 0, x: 1002, y: 494, width: 22, height: 20 }),
      BallRed: tx({ id: "Collectibles.BallRed", atlas: 0, x: 930, y: 529, width: 8, height: 8 }),
      ValuableBlue: tx({ id: "Collectibles.ValuableBlue", atlas: 0, x: 1006, y: 213, width: 17, height: 13 }),
      ValuableGreen: tx({ id: "Collectibles.ValuableGreen", atlas: 0, x: 734, y: 244, width: 7, height: 6 }),
      ValuableOrange: tx({ id: "Collectibles.ValuableOrange", atlas: 0, x: 1006, y: 227, width: 17, height: 13 }),
    },
    Door: {
      NormalLocked: tx({ id: "Door.NormalLocked", atlas: 0, x: 468, y: 193, width: 34, height: 46 }),
      NormalOpen: tx({ id: "Door.NormalOpen", atlas: 0, x: 807, y: 411, width: 34, height: 46 }),
    },
    Effects: {
      Burst32: tx({ id: "Effects.Burst32", atlas: 0, x: 842, y: 411, width: 32, height: 22 }),
      BurstRound24: tx({ id: "Effects.BurstRound24", atlas: 0, x: 595, y: 323, width: 72, height: 24 }),
      SplashMedium: tx({ id: "Effects.SplashMedium", atlas: 0, x: 506, y: 329, width: 72, height: 24 }),
      SplashSmall: tx({ id: "Effects.SplashSmall", atlas: 0, x: 738, y: 286, width: 96, height: 12 }),
      ValuableSparkle: tx({ id: "Effects.ValuableSparkle", atlas: 0, x: 431, y: 280, width: 35, height: 7 }),
      WaterDripSmall: tx({ id: "Effects.WaterDripSmall", atlas: 0, x: 504, y: 344, width: 1, height: 2 }),
      WaterDripXsmall: tx({ id: "Effects.WaterDripXsmall", atlas: 0, x: 711, y: 432, width: 3, height: 5 }),
    },
    Enemy: {
      CommonClown: tx({ id: "Enemy.CommonClown", atlas: 0, x: 758, y: 449, width: 44, height: 32 }),
      SpikeBall: tx({ id: "Enemy.SpikeBall", atlas: 0, x: 986, y: 544, width: 24, height: 20 }),
      Suggestive: {
        Body: tx({ id: "Enemy.Suggestive.Body", atlas: 0, x: 0, y: 128, width: 504, height: 64 }),
        Face: tx({ id: "Enemy.Suggestive.Face", atlas: 0, x: 803, y: 458, width: 38, height: 24 }),
        Gear: tx({ id: "Enemy.Suggestive.Gear", atlas: 0, x: 842, y: 434, width: 32, height: 16 }),
        Mouth: tx({ id: "Enemy.Suggestive.Mouth", atlas: 0, x: 679, y: 244, width: 33, height: 6 }),
        Pupil: tx({ id: "Enemy.Suggestive.Pupil", atlas: 0, x: 803, y: 449, width: 2, height: 8 }),
        Sclera: tx({ id: "Enemy.Suggestive.Sclera", atlas: 0, x: 965, y: 475, width: 8, height: 16 }),
        Torso: tx({ id: "Enemy.Suggestive.Torso", atlas: 0, x: 931, y: 0, width: 86, height: 23 }),
      },
    },
    Esoteric: {
      Decoration: {
        Bandage: tx({ id: "Esoteric.Decoration.Bandage", atlas: 0, x: 725, y: 346, width: 12, height: 26 }),
        PicaxeGiant: tx({ id: "Esoteric.Decoration.PicaxeGiant", atlas: 0, x: 431, y: 344, width: 72, height: 69 }),
        SeedBag: tx({ id: "Esoteric.Decoration.SeedBag", atlas: 0, x: 991, y: 251, width: 32, height: 31 }),
      },
      Message: {
        Farmer: tx({ id: "Esoteric.Message.Farmer", atlas: 0, x: 431, y: 327, width: 74, height: 16 }),
        Miner: tx({ id: "Esoteric.Message.Miner", atlas: 0, x: 817, y: 395, width: 57, height: 15 }),
      },
    },
    Fiber: {
      RopeFrame: tx({ id: "Fiber.RopeFrame", atlas: 0, x: 756, y: 482, width: 37, height: 28 }),
    },
    Foliage: {
      Flower14: tx({ id: "Foliage.Flower14", atlas: 0, x: 1010, y: 57, width: 14, height: 8 }),
      Flower18: tx({ id: "Foliage.Flower18", atlas: 0, x: 905, y: 493, width: 18, height: 10 }),
      LeavesMedium0: tx({ id: "Foliage.LeavesMedium0", atlas: 0, x: 715, y: 392, width: 42, height: 60 }),
      Medium0: tx({ id: "Foliage.Medium0", atlas: 0, x: 903, y: 529, width: 26, height: 31 }),
      RootMedium0: tx({ id: "Foliage.RootMedium0", atlas: 0, x: 975, y: 425, width: 48, height: 19 }),
      Small: tx({ id: "Foliage.Small", atlas: 0, x: 579, y: 329, width: 11, height: 17 }),
      Stem16: tx({ id: "Foliage.Stem16", atlas: 0, x: 1010, y: 24, width: 14, height: 16 }),
      TallRoundRed: tx({ id: "Foliage.TallRoundRed", atlas: 0, x: 395, y: 280, width: 35, height: 88 }),
      Vine0: tx({ id: "Foliage.Vine0", atlas: 0, x: 599, y: 289, width: 6, height: 33 }),
      Vine1: tx({ id: "Foliage.Vine1", atlas: 0, x: 1010, y: 41, width: 14, height: 15 }),
    },
    Font: {
      Diggit: tx({ id: "Font.Diggit", atlas: 0, x: 613, y: 277, width: 54, height: 8 }),
      ErotixLight: tx({ id: "Font.ErotixLight", atlas: 0, x: 841, y: 81, width: 160, height: 34 }),
      Erotix: tx({ id: "Font.Erotix", atlas: 0, x: 679, y: 251, width: 160, height: 34 }),
      Flaccid: tx({ id: "Font.Flaccid", atlas: 0, x: 902, y: 164, width: 102, height: 24 }),
      GoodBoy: tx({ id: "Font.GoodBoy", atlas: 0, x: 0, y: 193, width: 256, height: 128 }),
    },
    Furniture: {
      ChainMetal: tx({ id: "Furniture.ChainMetal", atlas: 0, x: 1006, y: 81, width: 12, height: 56 }),
      Chandelier: tx({ id: "Furniture.Chandelier", atlas: 0, x: 613, y: 286, width: 124, height: 36 }),
      Pottery18: tx({ id: "Furniture.Pottery18", atlas: 0, x: 1006, y: 164, width: 18, height: 18 }),
      Table0: tx({ id: "Furniture.Table0", atlas: 0, x: 668, y: 323, width: 62, height: 22 }),
      WateringCan: tx({ id: "Furniture.WateringCan", atlas: 0, x: 905, y: 506, width: 34, height: 22 }),
    },
    IguaRpgTitle: tx({ id: "IguaRpgTitle", atlas: 0, x: 789, y: 190, width: 216, height: 60 }),
    Iguana: {
      Boiled: {
        Club: tx({ id: "Iguana.Boiled.Club", atlas: 0, x: 579, y: 348, width: 72, height: 18 }),
        Crest: tx({ id: "Iguana.Boiled.Crest", atlas: 0, x: 841, y: 31, width: 168, height: 24 }),
        Eye: tx({ id: "Iguana.Boiled.Eye", atlas: 0, x: 1011, y: 544, width: 12, height: 12 }),
        Foot: tx({ id: "Iguana.Boiled.Foot", atlas: 0, x: 257, y: 193, width: 210, height: 18 }),
        Head: tx({ id: "Iguana.Boiled.Head", atlas: 0, x: 930, y: 541, width: 27, height: 27 }),
        Horn: tx({ id: "Iguana.Boiled.Horn", atlas: 0, x: 504, y: 354, width: 72, height: 12 }),
        Mouth: tx({ id: "Iguana.Boiled.Mouth", atlas: 0, x: 902, y: 138, width: 108, height: 12 }),
        Nails: tx({ id: "Iguana.Boiled.Nails", atlas: 0, x: 977, y: 395, width: 45, height: 9 }),
        Pupil: tx({ id: "Iguana.Boiled.Pupil", atlas: 0, x: 468, y: 263, width: 144, height: 12 }),
        Tail: tx({ id: "Iguana.Boiled.Tail", atlas: 0, x: 257, y: 212, width: 210, height: 33 }),
        Torso: tx({ id: "Iguana.Boiled.Torso", atlas: 0, x: 794, y: 483, width: 36, height: 36 }),
      },
      Club: tx({ id: "Iguana.Club", atlas: 0, x: 652, y: 348, width: 72, height: 18 }),
      Crest: tx({ id: "Iguana.Crest", atlas: 0, x: 841, y: 56, width: 168, height: 24 }),
      Eye: tx({ id: "Iguana.Eye", atlas: 0, x: 1011, y: 138, width: 12, height: 12 }),
      Foot: tx({ id: "Iguana.Foot", atlas: 0, x: 468, y: 244, width: 210, height: 18 }),
      Head: tx({ id: "Iguana.Head", atlas: 0, x: 958, y: 544, width: 27, height: 27 }),
      Horn: tx({ id: "Iguana.Horn", atlas: 0, x: 504, y: 367, width: 72, height: 12 }),
      Mouth: tx({ id: "Iguana.Mouth", atlas: 0, x: 902, y: 151, width: 108, height: 12 }),
      Nails: tx({ id: "Iguana.Nails", atlas: 0, x: 977, y: 405, width: 45, height: 9 }),
      Pupil: tx({ id: "Iguana.Pupil", atlas: 0, x: 468, y: 276, width: 144, height: 12 }),
      Tail: tx({ id: "Iguana.Tail", atlas: 0, x: 257, y: 246, width: 210, height: 33 }),
      Torso: tx({ id: "Iguana.Torso", atlas: 0, x: 831, y: 488, width: 36, height: 36 }),
    },
    Light: {
      AuraIrregular40: tx({ id: "Light.AuraIrregular40", atlas: 0, x: 711, y: 453, width: 44, height: 42 }),
      ShadowIguana: tx({ id: "Light.ShadowIguana", atlas: 0, x: 930, y: 116, width: 48, height: 10 }),
      ShadowIrregularSmallRound: tx({ id: "Light.ShadowIrregularSmallRound", atlas: 0, x: 1011, y: 557, width: 12, height: 10 }),
      ShadowIrregularSmall: tx({ id: "Light.ShadowIrregularSmall", atlas: 0, x: 1006, y: 241, width: 16, height: 8 }),
    },
    LockedDoor: tx({ id: "LockedDoor", atlas: 0, x: 991, y: 283, width: 30, height: 32 }),
    Metal: {
      PipeDarkBroken: tx({ id: "Metal.PipeDarkBroken", atlas: 0, x: 835, y: 286, width: 4, height: 12 }),
    },
    OpenDoor: tx({ id: "OpenDoor", atlas: 0, x: 975, y: 445, width: 45, height: 48 }),
    OversizedAngel: tx({ id: "OversizedAngel", atlas: 0, x: 505, y: 138, width: 396, height: 51 }),
    Placeholder: tx({ id: "Placeholder", atlas: 0, x: 1010, y: 66, width: 14, height: 14 }),
    Pottery: {
      Ball0: tx({ id: "Pottery.Ball0", atlas: 0, x: 22, y: 322, width: 22, height: 20 }),
      BodyGreen: tx({ id: "Pottery.BodyGreen", atlas: 0, x: 715, y: 387, width: 20, height: 4 }),
      BodyRed: tx({ id: "Pottery.BodyRed", atlas: 0, x: 868, y: 488, width: 14, height: 4 }),
      BodyYellow: tx({ id: "Pottery.BodyYellow", atlas: 0, x: 713, y: 244, width: 20, height: 4 }),
      Figure0: tx({ id: "Pottery.Figure0", atlas: 0, x: 758, y: 411, width: 48, height: 37 }),
      HangerTriangle: tx({ id: "Pottery.HangerTriangle", atlas: 0, x: 62, y: 322, width: 14, height: 14 }),
      HeadGreen: tx({ id: "Pottery.HeadGreen", atlas: 0, x: 979, y: 116, width: 14, height: 8 }),
      HeadRed: tx({ id: "Pottery.HeadRed", atlas: 0, x: 991, y: 382, width: 14, height: 8 }),
      HeadYellow: tx({ id: "Pottery.HeadYellow", atlas: 0, x: 1006, y: 382, width: 14, height: 8 }),
      PlantBushRed: tx({ id: "Pottery.PlantBushRed", atlas: 0, x: 1006, y: 183, width: 18, height: 10 }),
      PlantReed: tx({ id: "Pottery.PlantReed", atlas: 0, x: 829, y: 364, width: 10, height: 16 }),
      Plant0: tx({ id: "Pottery.Plant0", atlas: 0, x: 926, y: 425, width: 48, height: 49 }),
    },
    Shapes: {
      Arc24: tx({ id: "Shapes.Arc24", atlas: 0, x: 931, y: 24, width: 24, height: 4 }),
      ArcFilledIrregular90: tx({ id: "Shapes.ArcFilledIrregular90", atlas: 0, x: 738, y: 299, width: 90, height: 92 }),
      CircleIrregular72: tx({ id: "Shapes.CircleIrregular72", atlas: 0, x: 577, y: 367, width: 72, height: 72 }),
      Circle64: tx({ id: "Shapes.Circle64", atlas: 0, x: 650, y: 367, width: 64, height: 64 }),
      Confetti32: tx({ id: "Shapes.Confetti32", atlas: 0, x: 991, y: 316, width: 32, height: 32 }),
      DitherSquare16: tx({ id: "Shapes.DitherSquare16", atlas: 0, x: 45, y: 322, width: 16, height: 16 }),
      LineVertical16: tx({ id: "Shapes.LineVertical16", atlas: 0, x: 503, y: 193, width: 1, height: 16 }),
      Rectangle6: tx({ id: "Shapes.Rectangle6", atlas: 0, x: 468, y: 240, width: 6, height: 3 }),
      SquareIrregular10: tx({ id: "Shapes.SquareIrregular10", atlas: 0, x: 507, y: 313, width: 10, height: 10 }),
      Square32: tx({ id: "Shapes.Square32", atlas: 0, x: 991, y: 349, width: 32, height: 32 }),
      X10: tx({ id: "Shapes.X10", atlas: 0, x: 829, y: 381, width: 10, height: 10 }),
      Zigzag14: tx({ id: "Shapes.Zigzag14", atlas: 0, x: 77, y: 322, width: 14, height: 8 }),
    },
    Sky: {
      Cloud0: tx({ id: "Sky.Cloud0", atlas: 0, x: 505, y: 190, width: 283, height: 53 }),
    },
    Stone: {
      BrickIrregular1: tx({ id: "Stone.BrickIrregular1", atlas: 0, x: 668, y: 277, width: 10, height: 7 }),
      BrickRegular: tx({ id: "Stone.BrickRegular", atlas: 0, x: 715, y: 373, width: 22, height: 13 }),
      IrregularWall: tx({ id: "Stone.IrregularWall", atlas: 0, x: 940, y: 506, width: 24, height: 34 }),
      RockLargeShaded: tx({ id: "Stone.RockLargeShaded", atlas: 0, x: 842, y: 461, width: 38, height: 26 }),
      RockSmallShaded1: tx({ id: "Stone.RockSmallShaded1", atlas: 0, x: 956, y: 24, width: 7, height: 6 }),
      Rock0: tx({ id: "Stone.Rock0", atlas: 0, x: 986, y: 565, width: 24, height: 15 }),
    },
    Terrain: {
      Earth: {
        Asterisk: tx({ id: "Terrain.Earth.Asterisk", atlas: 0, x: 0, y: 322, width: 21, height: 24 }),
        CrackSmall0: tx({ id: "Terrain.Earth.CrackSmall0", atlas: 0, x: 831, y: 483, width: 8, height: 4 }),
        ExposedDirt: tx({ id: "Terrain.Earth.ExposedDirt", atlas: 0, x: 518, y: 289, width: 80, height: 14 }),
        Loop: tx({ id: "Terrain.Earth.Loop", atlas: 0, x: 1006, y: 194, width: 17, height: 18 }),
        Mass0: tx({ id: "Terrain.Earth.Mass0", atlas: 0, x: 257, y: 280, width: 137, height: 81 }),
        Smooth: tx({ id: "Terrain.Earth.Smooth", atlas: 0, x: 841, y: 116, width: 88, height: 10 }),
        Spots: tx({ id: "Terrain.Earth.Spots", atlas: 0, x: 431, y: 289, width: 86, height: 23 }),
      },
      Grass: {
        Jagged2px: tx({ id: "Terrain.Grass.Jagged2px", atlas: 0, x: 977, y: 415, width: 42, height: 8 }),
        Jagged: tx({ id: "Terrain.Grass.Jagged", atlas: 0, x: 431, y: 313, width: 75, height: 13 }),
        Loops: tx({ id: "Terrain.Grass.Loops", atlas: 0, x: 504, y: 380, width: 72, height: 10 }),
        Shape1: tx({ id: "Terrain.Grass.Shape1", atlas: 0, x: 842, y: 452, width: 40, height: 8 }),
      },
      Pipe: {
        Gray: tx({ id: "Terrain.Pipe.Gray", atlas: 0, x: 613, y: 263, width: 64, height: 13 }),
      },
    },
    Town: {
      Ball: {
        Ball0: tx({ id: "Town.Ball.Ball0", atlas: 0, x: 1011, y: 151, width: 12, height: 12 }),
        Ball1: tx({ id: "Town.Ball.Ball1", atlas: 0, x: 92, y: 322, width: 14, height: 12 }),
        Brick0: tx({ id: "Town.Ball.Brick0", atlas: 0, x: 868, y: 493, width: 36, height: 30 }),
        Brick1: tx({ id: "Town.Ball.Brick1", atlas: 0, x: 965, y: 494, width: 36, height: 20 }),
        Frame: tx({ id: "Town.Ball.Frame", atlas: 0, x: 875, y: 395, width: 50, height: 56 }),
        StructureHighlight: tx({ id: "Town.Ball.StructureHighlight", atlas: 0, x: 883, y: 452, width: 40, height: 40 }),
        Structure: tx({ id: "Town.Ball.Structure", atlas: 0, x: 840, y: 280, width: 150, height: 114 }),
        Symbols: {
          Circle: tx({ id: "Town.Ball.Symbols.Circle", atlas: 0, x: 965, y: 515, width: 28, height: 28 }),
          P: tx({ id: "Town.Ball.Symbols.P", atlas: 0, x: 994, y: 515, width: 26, height: 28 }),
          Square: tx({ id: "Town.Ball.Symbols.Square", atlas: 0, x: 868, y: 524, width: 34, height: 30 }),
          Star: tx({ id: "Town.Ball.Symbols.Star", atlas: 0, x: 924, y: 475, width: 40, height: 30 }),
        },
      },
      Signage: {
        Board0: tx({ id: "Town.Signage.Board0", atlas: 0, x: 504, y: 391, width: 66, height: 26 }),
        Welcome0: tx({ id: "Town.Signage.Welcome0", atlas: 0, x: 758, y: 392, width: 58, height: 18 }),
      },
    },
    Ui: {
      Checkbox: tx({ id: "Ui.Checkbox", atlas: 0, x: 650, y: 432, width: 60, height: 30 }),
      ChooseYourLooksIcons: tx({ id: "Ui.ChooseYourLooksIcons", atlas: 0, x: 0, y: 0, width: 930, height: 30 }),
      Dialog: {
        SpeakBox: tx({ id: "Ui.Dialog.SpeakBox", atlas: 0, x: 0, y: 31, width: 840, height: 96 }),
      },
      HorizontalBar9: tx({ id: "Ui.HorizontalBar9", atlas: 0, x: 505, y: 128, width: 500, height: 9 }),
      NoneChoice: tx({ id: "Ui.NoneChoice", atlas: 0, x: 994, y: 116, width: 8, height: 8 }),
      PlacementReticle: tx({ id: "Ui.PlacementReticle", atlas: 0, x: 606, y: 289, width: 6, height: 6 }),
      Pocket: {
        CollectNotification: tx({ id: "Ui.Pocket.CollectNotification", atlas: 0, x: 518, y: 304, width: 76, height: 24 }),
      },
    },
    Wood: {
      MeasuringStick: tx({ id: "Wood.MeasuringStick", atlas: 0, x: 829, y: 299, width: 8, height: 64 }),
      Sign: tx({ id: "Wood.Sign", atlas: 0, x: 926, y: 395, width: 50, height: 29 }),
    },
  };
}

export const GeneratedTextureData = {
  atlases,
  txs,
};
