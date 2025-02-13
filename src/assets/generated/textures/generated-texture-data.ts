// This file is generated

const atlases = [{ url: require("./atlas0.png"), texturesCount: 176 }];

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
    Collectibles: {
      BallFruitTypeA: tx({ id: "Collectibles.BallFruitTypeA", atlas: 0, x: 783, y: 528, width: 22, height: 20 }),
      BallFruitTypeB: tx({ id: "Collectibles.BallFruitTypeB", atlas: 0, x: 303, y: 404, width: 22, height: 20 }),
      BallRed: tx({ id: "Collectibles.BallRed", atlas: 0, x: 642, y: 529, width: 8, height: 8 }),
      ValuableBlue: tx({ id: "Collectibles.ValuableBlue", atlas: 0, x: 477, y: 400, width: 17, height: 13 }),
      ValuableGreen: tx({ id: "Collectibles.ValuableGreen", atlas: 0, x: 172, y: 478, width: 7, height: 6 }),
      ValuableOrange: tx({ id: "Collectibles.ValuableOrange", atlas: 0, x: 642, y: 538, width: 17, height: 13 }),
    },
    Door: {
      NormalLocked: tx({ id: "Door.NormalLocked", atlas: 0, x: 736, y: 457, width: 34, height: 46 }),
      NormalOpen: tx({ id: "Door.NormalOpen", atlas: 0, x: 771, y: 481, width: 34, height: 46 }),
    },
    Effects: {
      Bubble4: tx({ id: "Effects.Bubble4", atlas: 0, x: 946, y: 482, width: 4, height: 4 }),
      Burst32: tx({ id: "Effects.Burst32", atlas: 0, x: 979, y: 519, width: 32, height: 22 }),
      BurstRound24: tx({ id: "Effects.BurstRound24", atlas: 0, x: 77, y: 517, width: 72, height: 24 }),
      FieryBurst170px: tx({ id: "Effects.FieryBurst170px", atlas: 0, x: 0, y: 128, width: 680, height: 150 }),
      SplashMedium: tx({ id: "Effects.SplashMedium", atlas: 0, x: 0, y: 541, width: 72, height: 24 }),
      SplashSmall: tx({ id: "Effects.SplashSmall", atlas: 0, x: 580, y: 418, width: 96, height: 12 }),
      Star12px: tx({ id: "Effects.Star12px", atlas: 0, x: 1012, y: 530, width: 12, height: 10 }),
      ValuableSparkle: tx({ id: "Effects.ValuableSparkle", atlas: 0, x: 971, y: 271, width: 35, height: 7 }),
      WaterDripSmall: tx({ id: "Effects.WaterDripSmall", atlas: 0, x: 87, y: 475, width: 1, height: 2 }),
      WaterDripXsmall: tx({ id: "Effects.WaterDripXsmall", atlas: 0, x: 146, y: 542, width: 3, height: 5 }),
    },
    Enemy: {
      CommonClown: tx({ id: "Enemy.CommonClown", atlas: 0, x: 924, y: 440, width: 44, height: 32 }),
      SpikeBall: tx({ id: "Enemy.SpikeBall", atlas: 0, x: 974, y: 144, width: 24, height: 20 }),
      Suggestive: {
        Body: tx({ id: "Enemy.Suggestive.Body", atlas: 0, x: 0, y: 279, width: 504, height: 64 }),
        Face: tx({ id: "Enemy.Suggestive.Face", atlas: 0, x: 907, y: 482, width: 38, height: 24 }),
        Gear: tx({ id: "Enemy.Suggestive.Gear", atlas: 0, x: 979, y: 542, width: 32, height: 16 }),
        Mouth: tx({ id: "Enemy.Suggestive.Mouth", atlas: 0, x: 109, y: 454, width: 33, height: 6 }),
        Pupil: tx({ id: "Enemy.Suggestive.Pupil", atlas: 0, x: 1022, y: 0, width: 2, height: 8 }),
        Sclera: tx({ id: "Enemy.Suggestive.Sclera", atlas: 0, x: 883, y: 235, width: 8, height: 16 }),
        Torso: tx({ id: "Enemy.Suggestive.Torso", atlas: 0, x: 200, y: 461, width: 86, height: 23 }),
      },
    },
    Esoteric: {
      Decoration: {
        Bandage: tx({ id: "Esoteric.Decoration.Bandage", atlas: 0, x: 870, y: 235, width: 12, height: 26 }),
        PicaxeGiant: tx({ id: "Esoteric.Decoration.PicaxeGiant", atlas: 0, x: 247, y: 524, width: 72, height: 69 }),
        SeedBag: tx({ id: "Esoteric.Decoration.SeedBag", atlas: 0, x: 847, y: 518, width: 32, height: 31 }),
      },
      Message: {
        Farmer: tx({ id: "Esoteric.Message.Farmer", atlas: 0, x: 172, y: 499, width: 74, height: 16 }),
        Miner: tx({ id: "Esoteric.Message.Miner", atlas: 0, x: 815, y: 420, width: 57, height: 15 }),
      },
    },
    Fiber: {
      RopeFrame: tx({ id: "Fiber.RopeFrame", atlas: 0, x: 712, y: 504, width: 37, height: 28 }),
    },
    Foliage: {
      Flower14: tx({ id: "Foliage.Flower14", atlas: 0, x: 1009, y: 82, width: 14, height: 8 }),
      Flower18: tx({ id: "Foliage.Flower18", atlas: 0, x: 847, y: 495, width: 18, height: 10 }),
      Leaf16: tx({ id: "Foliage.Leaf16", atlas: 0, x: 656, y: 490, width: 16, height: 16 }),
      Leaf36: tx({ id: "Foliage.Leaf36", atlas: 0, x: 656, y: 515, width: 36, height: 22 }),
      LeavesMedium0: tx({ id: "Foliage.LeavesMedium0", atlas: 0, x: 772, y: 420, width: 42, height: 60 }),
      Medium0: tx({ id: "Foliage.Medium0", atlas: 0, x: 880, y: 518, width: 26, height: 31 }),
      RootMedium0: tx({ id: "Foliage.RootMedium0", atlas: 0, x: 924, y: 420, width: 48, height: 19 }),
      Small: tx({ id: "Foliage.Small", atlas: 0, x: 568, y: 443, width: 11, height: 17 }),
      Stem16: tx({ id: "Foliage.Stem16", atlas: 0, x: 735, y: 533, width: 14, height: 16 }),
      TallRoundRed: tx({ id: "Foliage.TallRoundRed", atlas: 0, x: 983, y: 334, width: 35, height: 88 }),
      Vine0: tx({ id: "Foliage.Vine0", atlas: 0, x: 1018, y: 496, width: 6, height: 33 }),
      Vine1: tx({ id: "Foliage.Vine1", atlas: 0, x: 735, y: 550, width: 14, height: 15 }),
    },
    Font: {
      Diggit: tx({ id: "Font.Diggit", atlas: 0, x: 248, y: 485, width: 54, height: 8 }),
      ErotixLight: tx({ id: "Font.ErotixLight", atlas: 0, x: 841, y: 81, width: 160, height: 34 }),
      Erotix: tx({ id: "Font.Erotix", atlas: 0, x: 165, y: 344, width: 160, height: 34 }),
      Flaccid: tx({ id: "Font.Flaccid", atlas: 0, x: 477, y: 418, width: 102, height: 24 }),
      GoodBoy: tx({ id: "Font.GoodBoy", atlas: 0, x: 505, y: 289, width: 256, height: 128 }),
    },
    Furniture: {
      Aquarium: {
        Box76x46: tx({ id: "Furniture.Aquarium.Box76x46", atlas: 0, x: 394, y: 474, width: 76, height: 46 }),
        Coral: tx({ id: "Furniture.Aquarium.Coral", atlas: 0, x: 907, y: 528, width: 28, height: 26 }),
        Fish: tx({ id: "Furniture.Aquarium.Fish", atlas: 0, x: 0, y: 407, width: 110, height: 22 }),
        Sand: tx({ id: "Furniture.Aquarium.Sand", atlas: 0, x: 320, y: 524, width: 72, height: 14 }),
        WaterIntake: tx({ id: "Furniture.Aquarium.WaterIntake", atlas: 0, x: 783, y: 549, width: 22, height: 14 }),
      },
      ChainMetal: tx({ id: "Furniture.ChainMetal", atlas: 0, x: 1010, y: 25, width: 12, height: 56 }),
      Chandelier: tx({ id: "Furniture.Chandelier", atlas: 0, x: 892, y: 225, width: 124, height: 36 }),
      Pottery18: tx({ id: "Furniture.Pottery18", atlas: 0, x: 223, y: 531, width: 18, height: 18 }),
      Table0: tx({ id: "Furniture.Table0", atlas: 0, x: 65, y: 607, width: 62, height: 22 }),
      WateringCan: tx({ id: "Furniture.WateringCan", atlas: 0, x: 983, y: 496, width: 34, height: 22 }),
    },
    Iguana: {
      Boiled: {
        Club: tx({ id: "Iguana.Boiled.Club", atlas: 0, x: 320, y: 539, width: 72, height: 18 }),
        Crest: tx({ id: "Iguana.Boiled.Crest", atlas: 0, x: 841, y: 31, width: 168, height: 24 }),
        Eye: tx({ id: "Iguana.Boiled.Eye", atlas: 0, x: 1012, y: 541, width: 12, height: 12 }),
        Foot: tx({ id: "Iguana.Boiled.Foot", atlas: 0, x: 762, y: 367, width: 210, height: 18 }),
        Head: tx({ id: "Iguana.Boiled.Head", atlas: 0, x: 219, y: 550, width: 27, height: 27 }),
        Horn: tx({ id: "Iguana.Boiled.Horn", atlas: 0, x: 320, y: 558, width: 72, height: 12 }),
        Mouth: tx({ id: "Iguana.Boiled.Mouth", atlas: 0, x: 0, y: 430, width: 108, height: 12 }),
        Nails: tx({ id: "Iguana.Boiled.Nails", atlas: 0, x: 627, y: 480, width: 45, height: 9 }),
        Pupil: tx({ id: "Iguana.Boiled.Pupil", atlas: 0, x: 681, y: 262, width: 144, height: 12 }),
        Tail: tx({ id: "Iguana.Boiled.Tail", atlas: 0, x: 762, y: 386, width: 210, height: 33 }),
        Torso: tx({ id: "Iguana.Boiled.Torso", atlas: 0, x: 568, y: 499, width: 36, height: 36 }),
      },
      Club: tx({ id: "Iguana.Club", atlas: 0, x: 150, y: 531, width: 72, height: 18 }),
      Crest: tx({ id: "Iguana.Crest", atlas: 0, x: 841, y: 56, width: 168, height: 24 }),
      Eye: tx({ id: "Iguana.Eye", atlas: 0, x: 1012, y: 554, width: 12, height: 12 }),
      Foot: tx({ id: "Iguana.Foot", atlas: 0, x: 681, y: 182, width: 210, height: 18 }),
      Head: tx({ id: "Iguana.Head", atlas: 0, x: 974, y: 116, width: 27, height: 27 }),
      Horn: tx({ id: "Iguana.Horn", atlas: 0, x: 73, y: 542, width: 72, height: 12 }),
      Mouth: tx({ id: "Iguana.Mouth", atlas: 0, x: 0, y: 443, width: 108, height: 12 }),
      Nails: tx({ id: "Iguana.Nails", atlas: 0, x: 973, y: 434, width: 45, height: 9 }),
      Pupil: tx({ id: "Iguana.Pupil", atlas: 0, x: 826, y: 262, width: 144, height: 12 }),
      Tail: tx({ id: "Iguana.Tail", atlas: 0, x: 681, y: 201, width: 210, height: 33 }),
      Torso: tx({ id: "Iguana.Torso", atlas: 0, x: 605, y: 529, width: 36, height: 36 }),
    },
    Light: {
      AuraIrregular40: tx({ id: "Light.AuraIrregular40", atlas: 0, x: 969, y: 444, width: 44, height: 42 }),
      ShadowIguana: tx({ id: "Light.ShadowIguana", atlas: 0, x: 973, y: 423, width: 48, height: 10 }),
      ShadowIrregularSmallRound: tx({ id: "Light.ShadowIrregularSmallRound", atlas: 0, x: 965, y: 549, width: 12, height: 10 }),
      ShadowIrregularSmall: tx({ id: "Light.ShadowIrregularSmall", atlas: 0, x: 930, y: 116, width: 16, height: 8 }),
    },
    Placeholder: tx({ id: "Placeholder", atlas: 0, x: 287, y: 461, width: 14, height: 14 }),
    Shapes: {
      Arc24: tx({ id: "Shapes.Arc24", atlas: 0, x: 980, y: 25, width: 24, height: 4 }),
      ArcFilledIrregular90: tx({ id: "Shapes.ArcFilledIrregular90", atlas: 0, x: 477, y: 443, width: 90, height: 92 }),
      CircleIrregular72: tx({ id: "Shapes.CircleIrregular72", atlas: 0, x: 146, y: 550, width: 72, height: 72 }),
      Circle64: tx({ id: "Shapes.Circle64", atlas: 0, x: 0, y: 585, width: 64, height: 64 }),
      Confetti45deg: tx({ id: "Shapes.Confetti45deg", atlas: 0, x: 477, y: 373, width: 26, height: 26 }),
      Confetti18x8: tx({ id: "Shapes.Confetti18x8", atlas: 0, x: 847, y: 506, width: 18, height: 8 }),
      Confetti32: tx({ id: "Shapes.Confetti32", atlas: 0, x: 806, y: 526, width: 32, height: 32 }),
      DashedLine3px: tx({ id: "Shapes.DashedLine3px", atlas: 0, x: 1002, y: 81, width: 6, height: 98 }),
      DashedLineArc3px: tx({ id: "Shapes.DashedLineArc3px", atlas: 0, x: 111, y: 407, width: 52, height: 46 }),
      DitherSquare16: tx({ id: "Shapes.DitherSquare16", atlas: 0, x: 660, y: 538, width: 16, height: 16 }),
      LineVertical16: tx({ id: "Shapes.LineVertical16", atlas: 0, x: 475, y: 459, width: 1, height: 16 }),
      Rectangle6: tx({ id: "Shapes.Rectangle6", atlas: 0, x: 866, y: 465, width: 6, height: 3 }),
      RightTriangle24px: tx({ id: "Shapes.RightTriangle24px", atlas: 0, x: 219, y: 587, width: 24, height: 22 }),
      SquareIrregular10: tx({ id: "Shapes.SquareIrregular10", atlas: 0, x: 1014, y: 444, width: 10, height: 10 }),
      Square32: tx({ id: "Shapes.Square32", atlas: 0, x: 750, y: 528, width: 32, height: 32 }),
      X10: tx({ id: "Shapes.X10", atlas: 0, x: 1014, y: 455, width: 10, height: 10 }),
      X22: tx({ id: "Shapes.X22", atlas: 0, x: 303, y: 425, width: 22, height: 16 }),
      Zigzag14: tx({ id: "Shapes.Zigzag14", atlas: 0, x: 287, y: 476, width: 14, height: 8 }),
    },
    Sky: {
      CloudBalls0: tx({ id: "Sky.CloudBalls0", atlas: 0, x: 0, y: 344, width: 164, height: 62 }),
      CloudBalls1: tx({ id: "Sky.CloudBalls1", atlas: 0, x: 892, y: 182, width: 128, height: 42 }),
      Cloud0: tx({ id: "Sky.Cloud0", atlas: 0, x: 681, y: 128, width: 283, height: 53 }),
    },
    Stone: {
      RockLargeShaded: tx({ id: "Stone.RockLargeShaded", atlas: 0, x: 673, y: 488, width: 38, height: 26 }),
      RockSmallShaded1: tx({ id: "Stone.RockSmallShaded1", atlas: 0, x: 143, y: 454, width: 7, height: 6 }),
      Rock0: tx({ id: "Stone.Rock0", atlas: 0, x: 974, y: 165, width: 24, height: 15 }),
      Salt68px: tx({ id: "Stone.Salt68px", atlas: 0, x: 0, y: 566, width: 68, height: 18 }),
      Salt90px: tx({ id: "Stone.Salt90px", atlas: 0, x: 931, y: 0, width: 90, height: 24 }),
    },
    Terrain: {
      Earth: {
        Asterisk: tx({ id: "Terrain.Earth.Asterisk", atlas: 0, x: 605, y: 499, width: 21, height: 24 }),
        Crack8px12px: tx({ id: "Terrain.Earth.Crack8px12px", atlas: 0, x: 806, y: 481, width: 8, height: 12 }),
        Crack28px38px: tx({ id: "Terrain.Earth.Crack28px38px", atlas: 0, x: 627, y: 490, width: 28, height: 38 }),
        CrackSmall0: tx({ id: "Terrain.Earth.CrackSmall0", atlas: 0, x: 907, y: 477, width: 8, height: 4 }),
        ExposedDirt: tx({ id: "Terrain.Earth.ExposedDirt", atlas: 0, x: 394, y: 459, width: 80, height: 14 }),
        Loop: tx({ id: "Terrain.Earth.Loop", atlas: 0, x: 128, y: 607, width: 17, height: 18 }),
        Mass0: tx({ id: "Terrain.Earth.Mass0", atlas: 0, x: 165, y: 379, width: 137, height: 81 }),
        Scribble0: tx({ id: "Terrain.Earth.Scribble0", atlas: 0, x: 677, y: 420, width: 94, height: 36 }),
        Smooth: tx({ id: "Terrain.Earth.Smooth", atlas: 0, x: 841, y: 116, width: 88, height: 10 }),
        Spots: tx({ id: "Terrain.Earth.Spots", atlas: 0, x: 0, y: 475, width: 86, height: 23 }),
        V: tx({ id: "Terrain.Earth.V", atlas: 0, x: 750, y: 504, width: 20, height: 18 }),
        ValuableBlue0: tx({ id: "Terrain.Earth.ValuableBlue0", atlas: 0, x: 303, y: 379, width: 20, height: 24 }),
        ValuableRed0: tx({ id: "Terrain.Earth.ValuableRed0", atlas: 0, x: 712, y: 488, width: 20, height: 14 }),
        Zigzag0: tx({ id: "Terrain.Earth.Zigzag0", atlas: 0, x: 172, y: 516, width: 74, height: 14 }),
      },
      Grass: {
        Jagged2px: tx({ id: "Terrain.Grass.Jagged2px", atlas: 0, x: 924, y: 473, width: 42, height: 8 }),
        Jagged: tx({ id: "Terrain.Grass.Jagged", atlas: 0, x: 172, y: 485, width: 75, height: 13 }),
        Loops: tx({ id: "Terrain.Grass.Loops", atlas: 0, x: 73, y: 555, width: 72, height: 10 }),
        Shape1: tx({ id: "Terrain.Grass.Shape1", atlas: 0, x: 971, y: 262, width: 40, height: 8 }),
        Sparse3px: tx({ id: "Terrain.Grass.Sparse3px", atlas: 0, x: 931, y: 25, width: 48, height: 4 }),
      },
      Pipe: {
        Gray: tx({ id: "Terrain.Pipe.Gray", atlas: 0, x: 65, y: 593, width: 64, height: 13 }),
      },
    },
    Town: {
      Ball: {
        Ball0: tx({ id: "Town.Ball.Ball0", atlas: 0, x: 677, y: 538, width: 12, height: 12 }),
        Ball1: tx({ id: "Town.Ball.Ball1", atlas: 0, x: 130, y: 593, width: 14, height: 12 }),
        Brick0: tx({ id: "Town.Ball.Brick0", atlas: 0, x: 946, y: 487, width: 36, height: 30 }),
        Brick1: tx({ id: "Town.Ball.Brick1", atlas: 0, x: 907, y: 507, width: 36, height: 20 }),
        ColumnSpiral0: tx({ id: "Town.Ball.ColumnSpiral0", atlas: 0, x: 1012, y: 262, width: 12, height: 20 }),
        Dice: tx({ id: "Town.Ball.Dice", atlas: 0, x: 1014, y: 466, width: 10, height: 10 }),
        FishmongerBombDefused: tx({ id: "Town.Ball.FishmongerBombDefused", atlas: 0, x: 248, y: 494, width: 52, height: 28 }),
        FishmongerBomb: tx({ id: "Town.Ball.FishmongerBomb", atlas: 0, x: 815, y: 436, width: 52, height: 28 }),
        Frame: tx({ id: "Town.Ball.Frame", atlas: 0, x: 873, y: 420, width: 50, height: 56 }),
        IdolBase: tx({ id: "Town.Ball.IdolBase", atlas: 0, x: 394, y: 521, width: 76, height: 44 }),
        IdolHead: tx({ id: "Town.Ball.IdolHead", atlas: 0, x: 580, y: 431, width: 94, height: 48 }),
        StructureHighlight: tx({ id: "Town.Ball.StructureHighlight", atlas: 0, x: 866, y: 477, width: 40, height: 40 }),
        StructureSmall: tx({ id: "Town.Ball.StructureSmall", atlas: 0, x: 303, y: 459, width: 90, height: 64 }),
        Structure: tx({ id: "Town.Ball.Structure", atlas: 0, x: 326, y: 344, width: 150, height: 114 }),
        Symbols: {
          Circle: tx({ id: "Town.Ball.Symbols.Circle", atlas: 0, x: 936, y: 549, width: 28, height: 28 }),
          P: tx({ id: "Town.Ball.Symbols.P", atlas: 0, x: 477, y: 344, width: 26, height: 28 }),
          Square: tx({ id: "Town.Ball.Symbols.Square", atlas: 0, x: 944, y: 518, width: 34, height: 30 }),
          Star: tx({ id: "Town.Ball.Symbols.Star", atlas: 0, x: 806, y: 495, width: 40, height: 30 }),
        },
      },
      Colossus: {
        Eyebrow0: tx({ id: "Town.Colossus.Eyebrow0", atlas: 0, x: 219, y: 578, width: 26, height: 8 }),
        Eyelid0: tx({ id: "Town.Colossus.Eyelid0", atlas: 0, x: 303, y: 442, width: 20, height: 14 }),
        Mouth0: tx({ id: "Town.Colossus.Mouth0", atlas: 0, x: 983, y: 487, width: 36, height: 8 }),
        Noggin0: tx({ id: "Town.Colossus.Noggin0", atlas: 0, x: 87, y: 478, width: 84, height: 38 }),
        Nose0: tx({ id: "Town.Colossus.Nose0", atlas: 0, x: 150, y: 517, width: 18, height: 12 }),
        Pupil0: tx({ id: "Town.Colossus.Pupil0", atlas: 0, x: 77, y: 499, width: 8, height: 16 }),
        Sclera0: tx({ id: "Town.Colossus.Sclera0", atlas: 0, x: 693, y: 515, width: 18, height: 24 }),
      },
      Signage: {
        Board0: tx({ id: "Town.Signage.Board0", atlas: 0, x: 69, y: 566, width: 66, height: 26 }),
        Casino1px: tx({ id: "Town.Signage.Casino1px", atlas: 0, x: 0, y: 499, width: 76, height: 16 }),
        Casino2px: tx({ id: "Town.Signage.Casino2px", atlas: 0, x: 109, y: 461, width: 90, height: 16 }),
        Casino3px: tx({ id: "Town.Signage.Casino3px", atlas: 0, x: 0, y: 456, width: 108, height: 18 }),
        Welcome0: tx({ id: "Town.Signage.Welcome0", atlas: 0, x: 568, y: 480, width: 58, height: 18 }),
      },
    },
    Ui: {
      Checkbox: tx({ id: "Ui.Checkbox", atlas: 0, x: 675, y: 457, width: 60, height: 30 }),
      ChooseYourLooksIcons: tx({ id: "Ui.ChooseYourLooksIcons", atlas: 0, x: 0, y: 0, width: 930, height: 30 }),
      Dialog: {
        QuestionOption: tx({ id: "Ui.Dialog.QuestionOption", atlas: 0, x: 762, y: 289, width: 256, height: 44 }),
        SpeakBox: tx({ id: "Ui.Dialog.SpeakBox", atlas: 0, x: 0, y: 31, width: 840, height: 96 }),
      },
      Experience: {
        IncrementBg: tx({ id: "Ui.Experience.IncrementBg", atlas: 0, x: 681, y: 235, width: 188, height: 26 }),
        Increment: tx({ id: "Ui.Experience.Increment", atlas: 0, x: 762, y: 334, width: 220, height: 32 }),
      },
      HorizontalBar9: tx({ id: "Ui.HorizontalBar9", atlas: 0, x: 505, y: 279, width: 500, height: 9 }),
      InteractionIndicator: tx({ id: "Ui.InteractionIndicator", atlas: 0, x: 712, y: 533, width: 22, height: 22 }),
      NoneChoice: tx({ id: "Ui.NoneChoice", atlas: 0, x: 883, y: 252, width: 8, height: 8 }),
      PlacementReticle: tx({ id: "Ui.PlacementReticle", atlas: 0, x: 180, y: 478, width: 6, height: 6 }),
      Pocket: {
        CollectNotification: tx({ id: "Ui.Pocket.CollectNotification", atlas: 0, x: 0, y: 516, width: 76, height: 24 }),
      },
    },
    Wood: {
      MeasuringStick: tx({ id: "Wood.MeasuringStick", atlas: 0, x: 965, y: 116, width: 8, height: 64 }),
      Sign: tx({ id: "Wood.Sign", atlas: 0, x: 815, y: 465, width: 50, height: 29 }),
    },
  };
}

export const GeneratedTextureData = {
  atlases,
  txs,
};
