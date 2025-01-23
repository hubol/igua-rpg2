// This file is generated

const atlases = [{ url: require("./atlas0.png"), texturesCount: 161 }];

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
    BigKey1: tx({ id: "BigKey1", atlas: 0, x: 257, y: 289, width: 150, height: 28 }),
    Collectibles: {
      BallFruitTypeB: tx({ id: "Collectibles.BallFruitTypeB", atlas: 0, x: 357, y: 397, width: 22, height: 20 }),
      BallRed: tx({ id: "Collectibles.BallRed", atlas: 0, x: 84, y: 419, width: 8, height: 8 }),
      ValuableBlue: tx({ id: "Collectibles.ValuableBlue", atlas: 0, x: 1007, y: 256, width: 17, height: 13 }),
      ValuableGreen: tx({ id: "Collectibles.ValuableGreen", atlas: 0, x: 918, y: 457, width: 7, height: 6 }),
      ValuableOrange: tx({ id: "Collectibles.ValuableOrange", atlas: 0, x: 1007, y: 270, width: 17, height: 13 }),
    },
    Door: {
      NormalLocked: tx({ id: "Door.NormalLocked", atlas: 0, x: 49, y: 419, width: 34, height: 46 }),
      NormalOpen: tx({ id: "Door.NormalOpen", atlas: 0, x: 268, y: 343, width: 34, height: 46 }),
    },
    Effects: {
      Bubble4: tx({ id: "Effects.Bubble4", atlas: 0, x: 1006, y: 187, width: 4, height: 4 }),
      Burst32: tx({ id: "Effects.Burst32", atlas: 0, x: 84, y: 442, width: 32, height: 22 }),
      BurstRound24: tx({ id: "Effects.BurstRound24", atlas: 0, x: 951, y: 380, width: 72, height: 24 }),
      SplashMedium: tx({ id: "Effects.SplashMedium", atlas: 0, x: 951, y: 405, width: 72, height: 24 }),
      SplashSmall: tx({ id: "Effects.SplashSmall", atlas: 0, x: 402, y: 231, width: 96, height: 12 }),
      ValuableSparkle: tx({ id: "Effects.ValuableSparkle", atlas: 0, x: 0, y: 411, width: 35, height: 7 }),
      WaterDripSmall: tx({ id: "Effects.WaterDripSmall", atlas: 0, x: 847, y: 434, width: 1, height: 2 }),
      WaterDripXsmall: tx({ id: "Effects.WaterDripXsmall", atlas: 0, x: 142, y: 346, width: 3, height: 5 }),
    },
    Enemy: {
      CommonClown: tx({ id: "Enemy.CommonClown", atlas: 0, x: 219, y: 381, width: 44, height: 32 }),
      SpikeBall: tx({ id: "Enemy.SpikeBall", atlas: 0, x: 999, y: 465, width: 24, height: 20 }),
      Suggestive: {
        Body: tx({ id: "Enemy.Suggestive.Body", atlas: 0, x: 0, y: 128, width: 504, height: 64 }),
        Face: tx({ id: "Enemy.Suggestive.Face", atlas: 0, x: 264, y: 390, width: 38, height: 24 }),
        Gear: tx({ id: "Enemy.Suggestive.Gear", atlas: 0, x: 776, y: 400, width: 32, height: 16 }),
        Mouth: tx({ id: "Enemy.Suggestive.Mouth", atlas: 0, x: 725, y: 244, width: 33, height: 6 }),
        Pupil: tx({ id: "Enemy.Suggestive.Pupil", atlas: 0, x: 1019, y: 371, width: 2, height: 8 }),
        Sclera: tx({ id: "Enemy.Suggestive.Sclera", atlas: 0, x: 809, y: 400, width: 8, height: 16 }),
        Torso: tx({ id: "Enemy.Suggestive.Torso", atlas: 0, x: 408, y: 289, width: 86, height: 23 }),
      },
    },
    Esoteric: {
      Decoration: {
        Bandage: tx({ id: "Esoteric.Decoration.Bandage", atlas: 0, x: 344, y: 386, width: 12, height: 26 }),
        PicaxeGiant: tx({ id: "Esoteric.Decoration.PicaxeGiant", atlas: 0, x: 926, y: 430, width: 72, height: 69 }),
        SeedBag: tx({ id: "Esoteric.Decoration.SeedBag", atlas: 0, x: 117, y: 455, width: 32, height: 31 }),
      },
      Message: {
        Farmer: tx({ id: "Esoteric.Message.Farmer", atlas: 0, x: 772, y: 434, width: 74, height: 16 }),
        Miner: tx({ id: "Esoteric.Message.Miner", atlas: 0, x: 43, y: 346, width: 57, height: 15 }),
      },
    },
    Fiber: {
      RopeFrame: tx({ id: "Fiber.RopeFrame", atlas: 0, x: 143, y: 426, width: 37, height: 28 }),
    },
    Foliage: {
      Flower14: tx({ id: "Foliage.Flower14", atlas: 0, x: 936, y: 274, width: 14, height: 8 }),
      Flower18: tx({ id: "Foliage.Flower18", atlas: 0, x: 495, y: 289, width: 18, height: 10 }),
      LeavesMedium0: tx({ id: "Foliage.LeavesMedium0", atlas: 0, x: 0, y: 341, width: 42, height: 60 }),
      Medium0: tx({ id: "Foliage.Medium0", atlas: 0, x: 46, y: 466, width: 26, height: 31 }),
      RootMedium0: tx({ id: "Foliage.RootMedium0", atlas: 0, x: 0, y: 419, width: 48, height: 19 }),
      Small: tx({ id: "Foliage.Small", atlas: 0, x: 348, y: 343, width: 11, height: 17 }),
      Stem16: tx({ id: "Foliage.Stem16", atlas: 0, x: 1007, y: 284, width: 14, height: 16 }),
      TallRoundRed: tx({ id: "Foliage.TallRoundRed", atlas: 0, x: 971, y: 251, width: 35, height: 88 }),
      Vine0: tx({ id: "Foliage.Vine0", atlas: 0, x: 964, y: 298, width: 6, height: 33 }),
      Vine1: tx({ id: "Foliage.Vine1", atlas: 0, x: 1007, y: 318, width: 14, height: 15 }),
    },
    Font: {
      Diggit: tx({ id: "Font.Diggit", atlas: 0, x: 964, y: 371, width: 54, height: 8 }),
      ErotixLight: tx({ id: "Font.ErotixLight", atlas: 0, x: 841, y: 81, width: 160, height: 34 }),
      Erotix: tx({ id: "Font.Erotix", atlas: 0, x: 514, y: 278, width: 160, height: 34 }),
      Flaccid: tx({ id: "Font.Flaccid", atlas: 0, x: 257, y: 318, width: 102, height: 24 }),
      GoodBoy: tx({ id: "Font.GoodBoy", atlas: 0, x: 0, y: 193, width: 256, height: 128 }),
    },
    Furniture: {
      Aquarium: {
        Box76x46: tx({ id: "Furniture.Aquarium.Box76x46", atlas: 0, x: 695, y: 415, width: 76, height: 46 }),
        Coral: tx({ id: "Furniture.Aquarium.Coral", atlas: 0, x: 0, y: 488, width: 28, height: 26 }),
        Fish: tx({ id: "Furniture.Aquarium.Fish", atlas: 0, x: 902, y: 138, width: 110, height: 22 }),
        Sand: tx({ id: "Furniture.Aquarium.Sand", atlas: 0, x: 847, y: 442, width: 72, height: 14 }),
        WaterIntake: tx({ id: "Furniture.Aquarium.WaterIntake", atlas: 0, x: 184, y: 395, width: 22, height: 14 }),
      },
      ChainMetal: tx({ id: "Furniture.ChainMetal", atlas: 0, x: 1011, y: 161, width: 12, height: 56 }),
      Chandelier: tx({ id: "Furniture.Chandelier", atlas: 0, x: 826, y: 380, width: 124, height: 36 }),
      Pottery18: tx({ id: "Furniture.Pottery18", atlas: 0, x: 1006, y: 218, width: 18, height: 18 }),
      Table0: tx({ id: "Furniture.Table0", atlas: 0, x: 608, y: 354, width: 62, height: 22 }),
      WateringCan: tx({ id: "Furniture.WateringCan", atlas: 0, x: 936, y: 251, width: 34, height: 22 }),
    },
    IguaRpgTitle: tx({ id: "IguaRpgTitle", atlas: 0, x: 789, y: 190, width: 216, height: 60 }),
    Iguana: {
      Boiled: {
        Club: tx({ id: "Iguana.Boiled.Club", atlas: 0, x: 772, y: 451, width: 72, height: 18 }),
        Crest: tx({ id: "Iguana.Boiled.Crest", atlas: 0, x: 841, y: 31, width: 168, height: 24 }),
        Eye: tx({ id: "Iguana.Boiled.Eye", atlas: 0, x: 389, y: 418, width: 12, height: 12 }),
        Foot: tx({ id: "Iguana.Boiled.Foot", atlas: 0, x: 257, y: 193, width: 210, height: 18 }),
        Head: tx({ id: "Iguana.Boiled.Head", atlas: 0, x: 58, y: 498, width: 27, height: 27 }),
        Horn: tx({ id: "Iguana.Boiled.Horn", atlas: 0, x: 845, y: 457, width: 72, height: 12 }),
        Mouth: tx({ id: "Iguana.Boiled.Mouth", atlas: 0, x: 902, y: 161, width: 108, height: 12 }),
        Nails: tx({ id: "Iguana.Boiled.Nails", atlas: 0, x: 979, y: 116, width: 45, height: 9 }),
        Pupil: tx({ id: "Iguana.Boiled.Pupil", atlas: 0, x: 257, y: 231, width: 144, height: 12 }),
        Tail: tx({ id: "Iguana.Boiled.Tail", atlas: 0, x: 514, y: 244, width: 210, height: 33 }),
        Torso: tx({ id: "Iguana.Boiled.Torso", atlas: 0, x: 468, y: 193, width: 36, height: 36 }),
      },
      Club: tx({ id: "Iguana.Club", atlas: 0, x: 0, y: 322, width: 72, height: 18 }),
      Crest: tx({ id: "Iguana.Crest", atlas: 0, x: 841, y: 56, width: 168, height: 24 }),
      Eye: tx({ id: "Iguana.Eye", atlas: 0, x: 359, y: 427, width: 12, height: 12 }),
      Foot: tx({ id: "Iguana.Foot", atlas: 0, x: 257, y: 212, width: 210, height: 18 }),
      Head: tx({ id: "Iguana.Head", atlas: 0, x: 86, y: 498, width: 27, height: 27 }),
      Horn: tx({ id: "Iguana.Horn", atlas: 0, x: 73, y: 322, width: 72, height: 12 }),
      Mouth: tx({ id: "Iguana.Mouth", atlas: 0, x: 902, y: 174, width: 108, height: 12 }),
      Nails: tx({ id: "Iguana.Nails", atlas: 0, x: 360, y: 318, width: 45, height: 9 }),
      Pupil: tx({ id: "Iguana.Pupil", atlas: 0, x: 826, y: 285, width: 144, height: 12 }),
      Tail: tx({ id: "Iguana.Tail", atlas: 0, x: 725, y: 251, width: 210, height: 33 }),
      Torso: tx({ id: "Iguana.Torso", atlas: 0, x: 223, y: 414, width: 36, height: 36 }),
    },
    Light: {
      AuraIrregular40: tx({ id: "Light.AuraIrregular40", atlas: 0, x: 303, y: 343, width: 44, height: 42 }),
      ShadowIguana: tx({ id: "Light.ShadowIguana", atlas: 0, x: 930, y: 116, width: 48, height: 10 }),
      ShadowIrregularSmallRound: tx({ id: "Light.ShadowIrregularSmallRound", atlas: 0, x: 295, y: 427, width: 12, height: 10 }),
      ShadowIrregularSmall: tx({ id: "Light.ShadowIrregularSmall", atlas: 0, x: 29, y: 488, width: 16, height: 8 }),
    },
    LockedDoor: tx({ id: "LockedDoor", atlas: 0, x: 150, y: 455, width: 30, height: 32 }),
    Metal: {
      PipeDarkBroken: tx({ id: "Metal.PipeDarkBroken", atlas: 0, x: 218, y: 441, width: 4, height: 12 }),
    },
    OpenDoor: tx({ id: "OpenDoor", atlas: 0, x: 0, y: 439, width: 45, height: 48 }),
    OversizedAngel: tx({ id: "OversizedAngel", atlas: 0, x: 505, y: 138, width: 396, height: 51 }),
    Placeholder: tx({ id: "Placeholder", atlas: 0, x: 403, y: 411, width: 14, height: 14 }),
    Pottery: {
      Ball0: tx({ id: "Pottery.Ball0", atlas: 0, x: 380, y: 397, width: 22, height: 20 }),
      BodyGreen: tx({ id: "Pottery.BodyGreen", atlas: 0, x: 43, y: 341, width: 20, height: 4 }),
      BodyRed: tx({ id: "Pottery.BodyRed", atlas: 0, x: 1007, y: 334, width: 14, height: 4 }),
      BodyYellow: tx({ id: "Pottery.BodyYellow", atlas: 0, x: 675, y: 278, width: 20, height: 4 }),
      Figure0: tx({ id: "Pottery.Figure0", atlas: 0, x: 219, y: 343, width: 48, height: 37 }),
      HangerTriangle: tx({ id: "Pottery.HangerTriangle", atlas: 0, x: 344, y: 418, width: 14, height: 14 }),
      HeadGreen: tx({ id: "Pottery.HeadGreen", atlas: 0, x: 951, y: 274, width: 14, height: 8 }),
      HeadRed: tx({ id: "Pottery.HeadRed", atlas: 0, x: 117, y: 442, width: 14, height: 8 }),
      HeadYellow: tx({ id: "Pottery.HeadYellow", atlas: 0, x: 495, y: 300, width: 14, height: 8 }),
      PlantBushRed: tx({ id: "Pottery.PlantBushRed", atlas: 0, x: 1006, y: 126, width: 18, height: 10 }),
      PlantReed: tx({ id: "Pottery.PlantReed", atlas: 0, x: 73, y: 466, width: 10, height: 16 }),
      Plant0: tx({ id: "Pottery.Plant0", atlas: 0, x: 94, y: 392, width: 48, height: 49 }),
    },
    Shapes: {
      Arc24: tx({ id: "Shapes.Arc24", atlas: 0, x: 926, y: 417, width: 24, height: 4 }),
      ArcFilledIrregular90: tx({ id: "Shapes.ArcFilledIrregular90", atlas: 0, x: 517, y: 313, width: 90, height: 92 }),
      CircleIrregular72: tx({ id: "Shapes.CircleIrregular72", atlas: 0, x: 146, y: 322, width: 72, height: 72 }),
      Circle64: tx({ id: "Shapes.Circle64", atlas: 0, x: 451, y: 332, width: 64, height: 64 }),
      Confetti18x8: tx({ id: "Shapes.Confetti18x8", atlas: 0, x: 1002, y: 107, width: 18, height: 8 }),
      Confetti32: tx({ id: "Shapes.Confetti32", atlas: 0, x: 84, y: 465, width: 32, height: 32 }),
      DitherSquare16: tx({ id: "Shapes.DitherSquare16", atlas: 0, x: 1007, y: 301, width: 16, height: 16 }),
      LineVertical16: tx({ id: "Shapes.LineVertical16", atlas: 0, x: 673, y: 340, width: 1, height: 16 }),
      Rectangle6: tx({ id: "Shapes.Rectangle6", atlas: 0, x: 608, y: 396, width: 6, height: 3 }),
      SquareIrregular10: tx({ id: "Shapes.SquareIrregular10", atlas: 0, x: 73, y: 483, width: 10, height: 10 }),
      Square32: tx({ id: "Shapes.Square32", atlas: 0, x: 117, y: 487, width: 32, height: 32 }),
      X10: tx({ id: "Shapes.X10", atlas: 0, x: 132, y: 442, width: 10, height: 10 }),
      Zigzag14: tx({ id: "Shapes.Zigzag14", atlas: 0, x: 359, y: 418, width: 14, height: 8 }),
    },
    Sky: {
      Cloud0: tx({ id: "Sky.Cloud0", atlas: 0, x: 505, y: 190, width: 283, height: 53 }),
    },
    Stone: {
      BrickIrregular1: tx({ id: "Stone.BrickIrregular1", atlas: 0, x: 926, y: 422, width: 10, height: 7 }),
      BrickRegular: tx({ id: "Stone.BrickRegular", atlas: 0, x: 403, y: 397, width: 22, height: 13 }),
      IrregularWall: tx({ id: "Stone.IrregularWall", atlas: 0, x: 999, y: 430, width: 24, height: 34 }),
      RockLargeShaded: tx({ id: "Stone.RockLargeShaded", atlas: 0, x: 184, y: 414, width: 38, height: 26 }),
      RockSmallShaded1: tx({ id: "Stone.RockSmallShaded1", atlas: 0, x: 667, y: 377, width: 7, height: 6 }),
      Rock0: tx({ id: "Stone.Rock0", atlas: 0, x: 999, y: 486, width: 24, height: 15 }),
    },
    Terrain: {
      Earth: {
        Asterisk: tx({ id: "Terrain.Earth.Asterisk", atlas: 0, x: 1002, y: 82, width: 21, height: 24 }),
        CrackSmall0: tx({ id: "Terrain.Earth.CrackSmall0", atlas: 0, x: 64, y: 341, width: 8, height: 4 }),
        ExposedDirt: tx({ id: "Terrain.Earth.ExposedDirt", atlas: 0, x: 695, y: 400, width: 80, height: 14 }),
        Loop: tx({ id: "Terrain.Earth.Loop", atlas: 0, x: 1007, y: 237, width: 17, height: 18 }),
        Mass0: tx({ id: "Terrain.Earth.Mass0", atlas: 0, x: 826, y: 298, width: 137, height: 81 }),
        Smooth: tx({ id: "Terrain.Earth.Smooth", atlas: 0, x: 841, y: 116, width: 88, height: 10 }),
        Spots: tx({ id: "Terrain.Earth.Spots", atlas: 0, x: 608, y: 400, width: 86, height: 23 }),
      },
      Grass: {
        Jagged2px: tx({ id: "Terrain.Grass.Jagged2px", atlas: 0, x: 0, y: 402, width: 42, height: 8 }),
        Jagged: tx({ id: "Terrain.Grass.Jagged", atlas: 0, x: 931, y: 17, width: 75, height: 13 }),
        Loops: tx({ id: "Terrain.Grass.Loops", atlas: 0, x: 73, y: 335, width: 72, height: 10 }),
        Shape1: tx({ id: "Terrain.Grass.Shape1", atlas: 0, x: 101, y: 346, width: 40, height: 8 }),
      },
      Pipe: {
        Gray: tx({ id: "Terrain.Pipe.Gray", atlas: 0, x: 608, y: 340, width: 64, height: 13 }),
      },
    },
    Town: {
      Ball: {
        Ball0: tx({ id: "Town.Ball.Ball0", atlas: 0, x: 308, y: 427, width: 12, height: 12 }),
        Ball1: tx({ id: "Town.Ball.Ball1", atlas: 0, x: 374, y: 418, width: 14, height: 12 }),
        Brick0: tx({ id: "Town.Ball.Brick0", atlas: 0, x: 181, y: 441, width: 36, height: 30 }),
        Brick1: tx({ id: "Town.Ball.Brick1", atlas: 0, x: 219, y: 322, width: 36, height: 20 }),
        Dice: tx({ id: "Town.Ball.Dice", atlas: 0, x: 207, y: 395, width: 10, height: 10 }),
        Frame: tx({ id: "Town.Ball.Frame", atlas: 0, x: 43, y: 362, width: 50, height: 56 }),
        StructureHighlight: tx({ id: "Town.Ball.StructureHighlight", atlas: 0, x: 303, y: 386, width: 40, height: 40 }),
        StructureSmall: tx({ id: "Town.Ball.StructureSmall", atlas: 0, x: 360, y: 332, width: 90, height: 64 }),
        Structure: tx({ id: "Town.Ball.Structure", atlas: 0, x: 675, y: 285, width: 150, height: 114 }),
        Symbols: {
          Circle: tx({ id: "Town.Ball.Symbols.Circle", atlas: 0, x: 29, y: 498, width: 28, height: 28 }),
          P: tx({ id: "Town.Ball.Symbols.P", atlas: 0, x: 0, y: 515, width: 26, height: 28 }),
          Square: tx({ id: "Town.Ball.Symbols.Square", atlas: 0, x: 260, y: 415, width: 34, height: 30 }),
          Star: tx({ id: "Town.Ball.Symbols.Star", atlas: 0, x: 143, y: 395, width: 40, height: 30 }),
        },
      },
      Signage: {
        Board0: tx({ id: "Town.Signage.Board0", atlas: 0, x: 608, y: 313, width: 66, height: 26 }),
        Casino1px: tx({ id: "Town.Signage.Casino1px", atlas: 0, x: 772, y: 417, width: 76, height: 16 }),
        Casino2px: tx({ id: "Town.Signage.Casino2px", atlas: 0, x: 931, y: 0, width: 90, height: 16 }),
        Casino3px: tx({ id: "Town.Signage.Casino3px", atlas: 0, x: 408, y: 313, width: 108, height: 18 }),
        Welcome0: tx({ id: "Town.Signage.Welcome0", atlas: 0, x: 608, y: 377, width: 58, height: 18 }),
      },
    },
    Ui: {
      Checkbox: tx({ id: "Ui.Checkbox", atlas: 0, x: 964, y: 340, width: 60, height: 30 }),
      ChooseYourLooksIcons: tx({ id: "Ui.ChooseYourLooksIcons", atlas: 0, x: 0, y: 0, width: 930, height: 30 }),
      Dialog: {
        QuestionOption: tx({ id: "Ui.Dialog.QuestionOption", atlas: 0, x: 257, y: 244, width: 256, height: 44 }),
        SpeakBox: tx({ id: "Ui.Dialog.SpeakBox", atlas: 0, x: 0, y: 31, width: 840, height: 96 }),
      },
      HorizontalBar9: tx({ id: "Ui.HorizontalBar9", atlas: 0, x: 505, y: 128, width: 500, height: 9 }),
      InteractionIndicator: tx({ id: "Ui.InteractionIndicator", atlas: 0, x: 426, y: 397, width: 22, height: 22 }),
      NoneChoice: tx({ id: "Ui.NoneChoice", atlas: 0, x: 84, y: 428, width: 8, height: 8 }),
      PlacementReticle: tx({ id: "Ui.PlacementReticle", atlas: 0, x: 101, y: 355, width: 6, height: 6 }),
      Pocket: {
        CollectNotification: tx({ id: "Ui.Pocket.CollectNotification", atlas: 0, x: 849, y: 417, width: 76, height: 24 }),
      },
    },
    Wood: {
      MeasuringStick: tx({ id: "Wood.MeasuringStick", atlas: 0, x: 1013, y: 17, width: 8, height: 64 }),
      Sign: tx({ id: "Wood.Sign", atlas: 0, x: 94, y: 362, width: 50, height: 29 }),
    },
  };
}

export const GeneratedTextureData = {
  atlases,
  txs,
};
