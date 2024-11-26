// This file is generated

const atlases = [{ url: require("./atlas0.png"), texturesCount: 111 }];

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
    BigKey1: tx({ id: "BigKey1", atlas: 0, x: 629, y: 179, width: 150, height: 28 }),
    Collectibles: {
      BallRed: tx({ id: "Collectibles.BallRed", atlas: 0, x: 807, y: 339, width: 8, height: 8 }),
      ValuableBlue: tx({ id: "Collectibles.ValuableBlue", atlas: 0, x: 1006, y: 119, width: 17, height: 13 }),
      ValuableGreen: tx({ id: "Collectibles.ValuableGreen", atlas: 0, x: 599, y: 201, width: 7, height: 6 }),
      ValuableOrange: tx({ id: "Collectibles.ValuableOrange", atlas: 0, x: 1006, y: 133, width: 17, height: 13 }),
    },
    Effects: {
      Burst32: tx({ id: "Effects.Burst32", atlas: 0, x: 991, y: 251, width: 32, height: 22 }),
      PoisonDripSmall: tx({ id: "Effects.PoisonDripSmall", atlas: 0, x: 788, y: 318, width: 1, height: 2 }),
      SplashMedium: tx({ id: "Effects.SplashMedium", atlas: 0, x: 918, y: 247, width: 72, height: 24 }),
      SplashSmall: tx({ id: "Effects.SplashSmall", atlas: 0, x: 925, y: 179, width: 96, height: 12 }),
      ValuableSparkle: tx({ id: "Effects.ValuableSparkle", atlas: 0, x: 418, y: 193, width: 35, height: 7 }),
      WaterDripSmall: tx({ id: "Effects.WaterDripSmall", atlas: 0, x: 777, y: 346, width: 1, height: 2 }),
      WaterDripXsmall: tx({ id: "Effects.WaterDripXsmall", atlas: 0, x: 747, y: 322, width: 3, height: 5 }),
    },
    Enemy: {
      CommonClown: tx({ id: "Enemy.CommonClown", atlas: 0, x: 797, y: 274, width: 44, height: 32 }),
      SpikeBall: tx({ id: "Enemy.SpikeBall", atlas: 0, x: 817, y: 307, width: 24, height: 20 }),
      Suggestive: {
        Body: tx({ id: "Enemy.Suggestive.Body", atlas: 0, x: 0, y: 31, width: 504, height: 64 }),
        Face: tx({ id: "Enemy.Suggestive.Face", atlas: 0, x: 751, y: 293, width: 38, height: 24 }),
        Gear: tx({ id: "Enemy.Suggestive.Gear", atlas: 0, x: 991, y: 274, width: 32, height: 16 }),
        Mouth: tx({ id: "Enemy.Suggestive.Mouth", atlas: 0, x: 679, y: 147, width: 33, height: 6 }),
        Pupil: tx({ id: "Enemy.Suggestive.Pupil", atlas: 0, x: 1022, y: 323, width: 2, height: 8 }),
        Sclera: tx({ id: "Enemy.Suggestive.Sclera", atlas: 0, x: 779, y: 318, width: 8, height: 16 }),
        Torso: tx({ id: "Enemy.Suggestive.Torso", atlas: 0, x: 931, y: 0, width: 86, height: 23 }),
      },
    },
    Esoteric: {
      Decoration: {
        PicaxeGiant: tx({ id: "Esoteric.Decoration.PicaxeGiant", atlas: 0, x: 918, y: 272, width: 72, height: 69 }),
        SeedBag: tx({ id: "Esoteric.Decoration.SeedBag", atlas: 0, x: 991, y: 291, width: 32, height: 31 }),
      },
      Message: {
        Farmer: tx({ id: "Esoteric.Message.Farmer", atlas: 0, x: 918, y: 230, width: 74, height: 16 }),
        Miner: tx({ id: "Esoteric.Message.Miner", atlas: 0, x: 599, y: 250, width: 57, height: 15 }),
      },
    },
    Fiber: {
      RopeFrame: tx({ id: "Fiber.RopeFrame", atlas: 0, x: 842, y: 301, width: 37, height: 28 }),
    },
    Foliage: {
      Flower14: tx({ id: "Foliage.Flower14", atlas: 0, x: 403, y: 218, width: 14, height: 8 }),
      LeavesMedium0: tx({ id: "Foliage.LeavesMedium0", atlas: 0, x: 737, y: 208, width: 42, height: 60 }),
      Medium0: tx({ id: "Foliage.Medium0", atlas: 0, x: 790, y: 307, width: 26, height: 31 }),
      RootMedium0: tx({ id: "Foliage.RootMedium0", atlas: 0, x: 549, y: 290, width: 48, height: 19 }),
      Small: tx({ id: "Foliage.Small", atlas: 0, x: 660, y: 219, width: 11, height: 17 }),
      TallRoundRed: tx({ id: "Foliage.TallRoundRed", atlas: 0, x: 563, y: 201, width: 35, height: 88 }),
      Vine0: tx({ id: "Foliage.Vine0", atlas: 0, x: 556, y: 214, width: 6, height: 33 }),
      Vine1: tx({ id: "Foliage.Vine1", atlas: 0, x: 657, y: 250, width: 14, height: 15 }),
    },
    Font: {
      Diggit: tx({ id: "Font.Diggit", atlas: 0, x: 599, y: 266, width: 54, height: 8 }),
      ErotixLight: tx({ id: "Font.ErotixLight", atlas: 0, x: 468, y: 166, width: 160, height: 34 }),
      Erotix: tx({ id: "Font.Erotix", atlas: 0, x: 257, y: 183, width: 160, height: 34 }),
      Flaccid: tx({ id: "Font.Flaccid", atlas: 0, x: 902, y: 67, width: 102, height: 24 }),
      GoodBoy: tx({ id: "Font.GoodBoy", atlas: 0, x: 0, y: 96, width: 256, height: 128 }),
    },
    IguaRpgTitle: tx({ id: "IguaRpgTitle", atlas: 0, x: 789, y: 93, width: 216, height: 60 }),
    Iguana: {
      Boiled: {
        Club: tx({ id: "Iguana.Boiled.Club", atlas: 0, x: 418, y: 214, width: 72, height: 18 }),
        Crest: tx({ id: "Iguana.Boiled.Crest", atlas: 0, x: 679, y: 154, width: 168, height: 24 }),
        Eye: tx({ id: "Iguana.Boiled.Eye", atlas: 0, x: 777, y: 352, width: 12, height: 12 }),
        Foot: tx({ id: "Iguana.Boiled.Foot", atlas: 0, x: 257, y: 96, width: 210, height: 18 }),
        Head: tx({ id: "Iguana.Boiled.Head", atlas: 0, x: 751, y: 318, width: 27, height: 27 }),
        Horn: tx({ id: "Iguana.Boiled.Horn", atlas: 0, x: 257, y: 218, width: 72, height: 12 }),
        Mouth: tx({ id: "Iguana.Boiled.Mouth", atlas: 0, x: 902, y: 41, width: 108, height: 12 }),
        Nails: tx({ id: "Iguana.Boiled.Nails", atlas: 0, x: 418, y: 183, width: 45, height: 9 }),
        Pupil: tx({ id: "Iguana.Boiled.Pupil", atlas: 0, x: 418, y: 201, width: 144, height: 12 }),
        Tail: tx({ id: "Iguana.Boiled.Tail", atlas: 0, x: 257, y: 115, width: 210, height: 33 }),
        Torso: tx({ id: "Iguana.Boiled.Torso", atlas: 0, x: 468, y: 96, width: 36, height: 36 }),
      },
      Club: tx({ id: "Iguana.Club", atlas: 0, x: 330, y: 218, width: 72, height: 18 }),
      Crest: tx({ id: "Iguana.Crest", atlas: 0, x: 848, y: 154, width: 168, height: 24 }),
      Eye: tx({ id: "Iguana.Eye", atlas: 0, x: 549, y: 248, width: 12, height: 12 }),
      Foot: tx({ id: "Iguana.Foot", atlas: 0, x: 468, y: 147, width: 210, height: 18 }),
      Head: tx({ id: "Iguana.Head", atlas: 0, x: 697, y: 322, width: 27, height: 27 }),
      Horn: tx({ id: "Iguana.Horn", atlas: 0, x: 403, y: 233, width: 72, height: 12 }),
      Mouth: tx({ id: "Iguana.Mouth", atlas: 0, x: 902, y: 54, width: 108, height: 12 }),
      Nails: tx({ id: "Iguana.Nails", atlas: 0, x: 751, y: 274, width: 45, height: 9 }),
      Pupil: tx({ id: "Iguana.Pupil", atlas: 0, x: 780, y: 179, width: 144, height: 12 }),
      Tail: tx({ id: "Iguana.Tail", atlas: 0, x: 257, y: 149, width: 210, height: 33 }),
      Torso: tx({ id: "Iguana.Torso", atlas: 0, x: 881, y: 274, width: 36, height: 36 }),
    },
    Light: {
      ShadowIguana: tx({ id: "Light.ShadowIguana", atlas: 0, x: 629, y: 166, width: 48, height: 10 }),
      ShadowIrregularSmallRound: tx({ id: "Light.ShadowIrregularSmallRound", atlas: 0, x: 491, y: 133, width: 12, height: 10 }),
      ShadowIrregularSmall: tx({ id: "Light.ShadowIrregularSmall", atlas: 0, x: 1005, y: 192, width: 16, height: 8 }),
    },
    LockedDoor: tx({ id: "LockedDoor", atlas: 0, x: 991, y: 323, width: 30, height: 32 }),
    Metal: {
      PipeDarkBroken: tx({ id: "Metal.PipeDarkBroken", atlas: 0, x: 913, y: 311, width: 4, height: 12 }),
    },
    OpenDoor: tx({ id: "OpenDoor", atlas: 0, x: 705, y: 273, width: 45, height: 48 }),
    OversizedAngel: tx({ id: "OversizedAngel", atlas: 0, x: 505, y: 41, width: 396, height: 51 }),
    Placeholder: tx({ id: "Placeholder", atlas: 0, x: 1005, y: 201, width: 14, height: 14 }),
    Pottery: {
      Ball0: tx({ id: "Pottery.Ball0", atlas: 0, x: 842, y: 330, width: 21, height: 20 }),
      BodyGreen: tx({ id: "Pottery.BodyGreen", atlas: 0, x: 491, y: 228, width: 20, height: 4 }),
      BodyRed: tx({ id: "Pottery.BodyRed", atlas: 0, x: 533, y: 228, width: 14, height: 4 }),
      BodyYellow: tx({ id: "Pottery.BodyYellow", atlas: 0, x: 512, y: 228, width: 20, height: 4 }),
      Figure0: tx({ id: "Pottery.Figure0", atlas: 0, x: 648, y: 303, width: 48, height: 37 }),
      HangerTriangle: tx({ id: "Pottery.HangerTriangle", atlas: 0, x: 864, y: 330, width: 14, height: 14 }),
      HeadGreen: tx({ id: "Pottery.HeadGreen", atlas: 0, x: 747, y: 346, width: 14, height: 8 }),
      HeadRed: tx({ id: "Pottery.HeadRed", atlas: 0, x: 762, y: 346, width: 14, height: 8 }),
      HeadYellow: tx({ id: "Pottery.HeadYellow", atlas: 0, x: 725, y: 347, width: 14, height: 8 }),
      PlantBushRed: tx({ id: "Pottery.PlantBushRed", atlas: 0, x: 1006, y: 89, width: 18, height: 10 }),
      PlantReed: tx({ id: "Pottery.PlantReed", atlas: 0, x: 779, y: 335, width: 10, height: 16 }),
      Plant0: tx({ id: "Pottery.Plant0", atlas: 0, x: 599, y: 275, width: 48, height: 49 }),
    },
    Shapes: {
      Arc24: tx({ id: "Shapes.Arc24", atlas: 0, x: 751, y: 269, width: 24, height: 4 }),
      CircleIrregular72: tx({ id: "Shapes.CircleIrregular72", atlas: 0, x: 476, y: 233, width: 72, height: 72 }),
      Circle64: tx({ id: "Shapes.Circle64", atlas: 0, x: 672, y: 208, width: 64, height: 64 }),
      DitherSquare16: tx({ id: "Shapes.DitherSquare16", atlas: 0, x: 790, y: 339, width: 16, height: 16 }),
      LineVertical16: tx({ id: "Shapes.LineVertical16", atlas: 0, x: 1006, y: 24, width: 1, height: 16 }),
      Square32: tx({ id: "Shapes.Square32", atlas: 0, x: 880, y: 311, width: 32, height: 32 }),
    },
    Sky: {
      Cloud0: tx({ id: "Sky.Cloud0", atlas: 0, x: 505, y: 93, width: 283, height: 53 }),
    },
    Stone: {
      BrickIrregular1: tx({ id: "Stone.BrickIrregular1", atlas: 0, x: 454, y: 193, width: 10, height: 7 }),
      BrickRegular: tx({ id: "Stone.BrickRegular", atlas: 0, x: 468, y: 133, width: 22, height: 13 }),
      IrregularWall: tx({ id: "Stone.IrregularWall", atlas: 0, x: 994, y: 216, width: 24, height: 34 }),
      RockLargeShaded: tx({ id: "Stone.RockLargeShaded", atlas: 0, x: 842, y: 274, width: 38, height: 26 }),
      RockSmallShaded1: tx({ id: "Stone.RockSmallShaded1", atlas: 0, x: 654, y: 266, width: 7, height: 6 }),
      Rock0: tx({ id: "Stone.Rock0", atlas: 0, x: 817, y: 328, width: 24, height: 15 }),
    },
    Terrain: {
      Earth: {
        Asterisk: tx({ id: "Terrain.Earth.Asterisk", atlas: 0, x: 725, y: 322, width: 21, height: 24 }),
        CrackSmall0: tx({ id: "Terrain.Earth.CrackSmall0", atlas: 0, x: 403, y: 227, width: 8, height: 4 }),
        Loop: tx({ id: "Terrain.Earth.Loop", atlas: 0, x: 1006, y: 100, width: 17, height: 18 }),
        Mass0: tx({ id: "Terrain.Earth.Mass0", atlas: 0, x: 780, y: 192, width: 137, height: 81 }),
        Spots: tx({ id: "Terrain.Earth.Spots", atlas: 0, x: 918, y: 192, width: 86, height: 23 }),
      },
      Grass: {
        Jagged: tx({ id: "Terrain.Grass.Jagged", atlas: 0, x: 918, y: 216, width: 75, height: 13 }),
        Loops: tx({ id: "Terrain.Grass.Loops", atlas: 0, x: 599, y: 208, width: 72, height: 10 }),
        Shape1: tx({ id: "Terrain.Grass.Shape1", atlas: 0, x: 751, y: 284, width: 40, height: 8 }),
      },
      Pipe: {
        Gray: tx({ id: "Terrain.Pipe.Gray", atlas: 0, x: 491, y: 214, width: 64, height: 13 }),
      },
    },
    Ui: {
      Checkbox: tx({ id: "Ui.Checkbox", atlas: 0, x: 599, y: 219, width: 60, height: 30 }),
      ChooseYourLooksIcons: tx({ id: "Ui.ChooseYourLooksIcons", atlas: 0, x: 0, y: 0, width: 930, height: 30 }),
      HorizontalBar9: tx({ id: "Ui.HorizontalBar9", atlas: 0, x: 505, y: 31, width: 500, height: 9 }),
      NoneChoice: tx({ id: "Ui.NoneChoice", atlas: 0, x: 660, y: 237, width: 8, height: 8 }),
      PlacementReticle: tx({ id: "Ui.PlacementReticle", atlas: 0, x: 1018, y: 0, width: 6, height: 6 }),
    },
    Wood: {
      MeasuringStick: tx({ id: "Wood.MeasuringStick", atlas: 0, x: 1011, y: 24, width: 8, height: 64 }),
      Sign: tx({ id: "Wood.Sign", atlas: 0, x: 654, y: 273, width: 50, height: 29 }),
    },
  };
}

export const GeneratedTextureData = {
  atlases,
  txs,
};
