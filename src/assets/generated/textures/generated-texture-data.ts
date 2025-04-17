// This file is generated

const atlases = [{ url: require("./atlas0.png"), texturesCount: 263 }];

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
      BallFruitTypeA: tx({ id: "Collectibles.BallFruitTypeA", atlas: 0, x: 1164, y: 534, width: 22, height: 20 }),
      BallFruitTypeB: tx({ id: "Collectibles.BallFruitTypeB", atlas: 0, x: 936, y: 588, width: 22, height: 20 }),
      BallRed: tx({ id: "Collectibles.BallRed", atlas: 0, x: 672, y: 324, width: 8, height: 8 }),
      ComputerChip: tx({ id: "Collectibles.ComputerChip", atlas: 0, x: 1037, y: 536, width: 22, height: 20 }),
      Flop: {
        Appear: tx({ id: "Collectibles.Flop.Appear", atlas: 0, x: 1990, y: 148, width: 36, height: 16 }),
        Body: tx({ id: "Collectibles.Flop.Body", atlas: 0, x: 940, y: 422, width: 28, height: 26 }),
        Crest: tx({ id: "Collectibles.Flop.Crest", atlas: 0, x: 0, y: 0, width: 2016, height: 48 }),
        Ears: tx({ id: "Collectibles.Flop.Ears", atlas: 0, x: 1657, y: 212, width: 384, height: 48 }),
        Eyes: tx({ id: "Collectibles.Flop.Eyes", atlas: 0, x: 0, y: 117, width: 680, height: 22 }),
        Feet: tx({ id: "Collectibles.Flop.Feet", atlas: 0, x: 1706, y: 105, width: 324, height: 10 }),
        Front: tx({ id: "Collectibles.Flop.Front", atlas: 0, x: 0, y: 100, width: 864, height: 16 }),
        Mouth: tx({ id: "Collectibles.Flop.Mouth", atlas: 0, x: 1507, y: 299, width: 392, height: 26 }),
        Nose: tx({ id: "Collectibles.Flop.Nose", atlas: 0, x: 1098, y: 299, width: 408, height: 22 }),
        Rear: tx({ id: "Collectibles.Flop.Rear", atlas: 0, x: 1013, y: 49, width: 1008, height: 24 }),
      },
      ValuableBlue: tx({ id: "Collectibles.ValuableBlue", atlas: 0, x: 184, y: 701, width: 17, height: 13 }),
      ValuableGreen: tx({ id: "Collectibles.ValuableGreen", atlas: 0, x: 282, y: 643, width: 7, height: 6 }),
      ValuableOrange: tx({ id: "Collectibles.ValuableOrange", atlas: 0, x: 317, y: 706, width: 17, height: 13 }),
    },
    Door: {
      NormalLockedLayer0: tx({ id: "Door.NormalLockedLayer0", atlas: 0, x: 993, y: 523, width: 34, height: 46 }),
      NormalLockedLayer1: tx({ id: "Door.NormalLockedLayer1", atlas: 0, x: 282, y: 687, width: 34, height: 46 }),
      NormalLockedLayer2: tx({ id: "Door.NormalLockedLayer2", atlas: 0, x: 939, y: 541, width: 34, height: 46 }),
      NormalOpen: tx({ id: "Door.NormalOpen", atlas: 0, x: 872, y: 549, width: 34, height: 46 }),
    },
    Effects: {
      BallonInflate: tx({ id: "Effects.BallonInflate", atlas: 0, x: 974, y: 336, width: 110, height: 24 }),
      BallonPop: tx({ id: "Effects.BallonPop", atlas: 0, x: 0, y: 49, width: 1012, height: 50 }),
      Ballon: tx({ id: "Effects.Ballon", atlas: 0, x: 1112, y: 404, width: 110, height: 24 }),
      BoomText: tx({ id: "Effects.BoomText", atlas: 0, x: 751, y: 506, width: 44, height: 16 }),
      Bubble4: tx({ id: "Effects.Bubble4", atlas: 0, x: 885, y: 531, width: 4, height: 4 }),
      Burst32: tx({ id: "Effects.Burst32", atlas: 0, x: 293, y: 480, width: 32, height: 22 }),
      BurstDusty: tx({ id: "Effects.BurstDusty", atlas: 0, x: 1186, y: 212, width: 470, height: 86 }),
      BurstRound24: tx({ id: "Effects.BurstRound24", atlas: 0, x: 644, y: 549, width: 72, height: 24 }),
      FieryBurst170px: tx({ id: "Effects.FieryBurst170px", atlas: 0, x: 0, y: 140, width: 680, height: 150 }),
      HeartBurst16px: tx({ id: "Effects.HeartBurst16px", atlas: 0, x: 1237, y: 367, width: 112, height: 16 }),
      Helium: tx({ id: "Effects.Helium", atlas: 0, x: 940, y: 449, width: 96, height: 12 }),
      Parachute: tx({ id: "Effects.Parachute", atlas: 0, x: 681, y: 117, width: 174, height: 82 }),
      PlayerJumpComboDust: tx({ id: "Effects.PlayerJumpComboDust", atlas: 0, x: 1237, y: 384, width: 112, height: 22 }),
      SpiritualRelease0: tx({ id: "Effects.SpiritualRelease0", atlas: 0, x: 681, y: 267, width: 416, height: 68 }),
      SplashMedium: tx({ id: "Effects.SplashMedium", atlas: 0, x: 567, y: 556, width: 72, height: 24 }),
      SplashSmall: tx({ id: "Effects.SplashSmall", atlas: 0, x: 101, y: 480, width: 96, height: 12 }),
      Star12px: tx({ id: "Effects.Star12px", atlas: 0, x: 335, y: 673, width: 12, height: 10 }),
      ValuableSparkle: tx({ id: "Effects.ValuableSparkle", atlas: 0, x: 2013, y: 286, width: 35, height: 7 }),
      WaterDripSmall: tx({ id: "Effects.WaterDripSmall", atlas: 0, x: 1223, y: 404, width: 1, height: 2 }),
      WaterDripXsmall: tx({ id: "Effects.WaterDripXsmall", atlas: 0, x: 717, y: 549, width: 3, height: 5 }),
    },
    Enemy: {
      CommonClown: tx({ id: "Enemy.CommonClown", atlas: 0, x: 112, y: 661, width: 44, height: 32 }),
      SpikeBall: tx({ id: "Enemy.SpikeBall", atlas: 0, x: 2022, y: 49, width: 24, height: 20 }),
      Spirit: {
        Presence: tx({ id: "Enemy.Spirit.Presence", atlas: 0, x: 1917, y: 170, width: 126, height: 36 }),
      },
      Suggestive: {
        Body: tx({ id: "Enemy.Suggestive.Body", atlas: 0, x: 681, y: 202, width: 504, height: 64 }),
        FaceWide: tx({ id: "Enemy.Suggestive.FaceWide", atlas: 0, x: 231, y: 574, width: 52, height: 18 }),
        Face: tx({ id: "Enemy.Suggestive.Face", atlas: 0, x: 239, y: 690, width: 38, height: 24 }),
        Gear: tx({ id: "Enemy.Suggestive.Gear", atlas: 0, x: 290, y: 606, width: 32, height: 16 }),
        Mouth: tx({ id: "Enemy.Suggestive.Mouth", atlas: 0, x: 940, y: 415, width: 33, height: 6 }),
        Pupil: tx({ id: "Enemy.Suggestive.Pupil", atlas: 0, x: 808, y: 432, width: 2, height: 8 }),
        ScleraWide: tx({ id: "Enemy.Suggestive.ScleraWide", atlas: 0, x: 311, y: 471, width: 14, height: 6 }),
        Sclera: tx({ id: "Enemy.Suggestive.Sclera", atlas: 0, x: 856, y: 182, width: 8, height: 16 }),
        Torso: tx({ id: "Enemy.Suggestive.Torso", atlas: 0, x: 1098, y: 267, width: 86, height: 23 }),
      },
    },
    Esoteric: {
      Decoration: {
        Bandage: tx({ id: "Esoteric.Decoration.Bandage", atlas: 0, x: 1085, y: 336, width: 12, height: 26 }),
        PicaxeGiant: tx({ id: "Esoteric.Decoration.PicaxeGiant", atlas: 0, x: 465, y: 577, width: 72, height: 69 }),
        SeedBag: tx({ id: "Esoteric.Decoration.SeedBag", atlas: 0, x: 1256, y: 462, width: 32, height: 31 }),
      },
      Message: {
        Farmer: tx({ id: "Esoteric.Message.Farmer", atlas: 0, x: 797, y: 536, width: 74, height: 16 }),
        Miner: tx({ id: "Esoteric.Message.Miner", atlas: 0, x: 268, y: 455, width: 57, height: 15 }),
      },
    },
    Fiber: {
      Cobweb0: tx({ id: "Fiber.Cobweb0", atlas: 0, x: 907, y: 549, width: 30, height: 28 }),
      Cobweb1: tx({ id: "Fiber.Cobweb1", atlas: 0, x: 811, y: 371, width: 20, height: 28 }),
      RopeFrame: tx({ id: "Fiber.RopeFrame", atlas: 0, x: 184, y: 731, width: 37, height: 28 }),
      StringOnStake0: tx({ id: "Fiber.StringOnStake0", atlas: 0, x: 278, y: 565, width: 8, height: 6 }),
    },
    Foliage: {
      BranchCut0: tx({ id: "Foliage.BranchCut0", atlas: 0, x: 202, y: 675, width: 24, height: 14 }),
      Bush0: tx({ id: "Foliage.Bush0", atlas: 0, x: 65, y: 692, width: 44, height: 24 }),
      Flower14: tx({ id: "Foliage.Flower14", atlas: 0, x: 400, y: 385, width: 14, height: 8 }),
      Flower18: tx({ id: "Foliage.Flower18", atlas: 0, x: 567, y: 494, width: 18, height: 10 }),
      Flower22: tx({ id: "Foliage.Flower22", atlas: 0, x: 86, y: 717, width: 22, height: 16 }),
      Leaf16: tx({ id: "Foliage.Leaf16", atlas: 0, x: 1028, y: 557, width: 16, height: 16 }),
      Leaf36: tx({ id: "Foliage.Leaf36", atlas: 0, x: 86, y: 737, width: 36, height: 22 }),
      LeavesMedium0: tx({ id: "Foliage.LeavesMedium0", atlas: 0, x: 993, y: 462, width: 42, height: 60 }),
      Medium0: tx({ id: "Foliage.Medium0", atlas: 0, x: 2022, y: 0, width: 26, height: 31 }),
      Moss0: tx({ id: "Foliage.Moss0", atlas: 0, x: 45, y: 698, width: 16, height: 18 }),
      MossHanging0: tx({ id: "Foliage.MossHanging0", atlas: 0, x: 1330, y: 430, width: 24, height: 44 }),
      RootMedium0: tx({ id: "Foliage.RootMedium0", atlas: 0, x: 751, y: 475, width: 48, height: 19 }),
      Small: tx({ id: "Foliage.Small", atlas: 0, x: 2037, y: 261, width: 11, height: 17 }),
      Stem16: tx({ id: "Foliage.Stem16", atlas: 0, x: 400, y: 368, width: 14, height: 16 }),
      TallRoundRed: tx({ id: "Foliage.TallRoundRed", atlas: 0, x: 287, y: 517, width: 35, height: 88 }),
      TreeRingExposed: tx({ id: "Foliage.TreeRingExposed", atlas: 0, x: 237, y: 542, width: 48, height: 22 }),
      Vine0: tx({ id: "Foliage.Vine0", atlas: 0, x: 2042, y: 207, width: 6, height: 33 }),
      Vine1: tx({ id: "Foliage.Vine1", atlas: 0, x: 1045, y: 557, width: 14, height: 15 }),
    },
    Font: {
      Diggit: tx({ id: "Font.Diggit", atlas: 0, x: 591, y: 453, width: 80, height: 8 }),
      ErotixLight: tx({ id: "Font.ErotixLight", atlas: 0, x: 165, y: 420, width: 160, height: 34 }),
      Erotix: tx({ id: "Font.Erotix", atlas: 0, x: 672, y: 336, width: 160, height: 34 }),
      Flaccid: tx({ id: "Font.Flaccid", atlas: 0, x: 165, y: 455, width: 102, height: 24 }),
      GoodBoy: tx({ id: "Font.GoodBoy", atlas: 0, x: 415, y: 324, width: 256, height: 128 }),
    },
    Furniture: {
      Aquarium: {
        Box76x46: tx({ id: "Furniture.Aquarium.Box76x46", atlas: 0, x: 567, y: 509, width: 76, height: 46 }),
        Coral: tx({ id: "Furniture.Aquarium.Coral", atlas: 0, x: 1141, y: 461, width: 28, height: 26 }),
        Fish: tx({ id: "Furniture.Aquarium.Fish", atlas: 0, x: 1223, y: 407, width: 110, height: 22 }),
        Sand: tx({ id: "Furniture.Aquarium.Sand", atlas: 0, x: 386, y: 600, width: 72, height: 14 }),
        WaterIntake: tx({ id: "Furniture.Aquarium.WaterIntake", atlas: 0, x: 1060, y: 536, width: 22, height: 14 }),
      },
      Artwork: {
        Poster0: tx({ id: "Furniture.Artwork.Poster0", atlas: 0, x: 811, y: 415, width: 128, height: 58 }),
        Statue0: tx({ id: "Furniture.Artwork.Statue0", atlas: 0, x: 326, y: 420, width: 82, height: 104 }),
        Statue1: tx({ id: "Furniture.Artwork.Statue1", atlas: 0, x: 500, y: 494, width: 66, height: 82 }),
        Statue2: tx({ id: "Furniture.Artwork.Statue2", atlas: 0, x: 0, y: 465, width: 100, height: 60 }),
        Statue3: tx({ id: "Furniture.Artwork.Statue3", atlas: 0, x: 323, y: 525, width: 62, height: 78 }),
      },
      ChainMetal: tx({ id: "Furniture.ChainMetal", atlas: 0, x: 449, y: 615, width: 12, height: 56 }),
      Chandelier: tx({ id: "Furniture.Chandelier", atlas: 0, x: 1112, y: 367, width: 124, height: 36 }),
      Doll0: tx({ id: "Furniture.Doll0", atlas: 0, x: 907, y: 578, width: 28, height: 30 }),
      Lamp0: tx({ id: "Furniture.Lamp0", atlas: 0, x: 160, y: 740, width: 22, height: 28 }),
      Library: {
        Books0: tx({ id: "Furniture.Library.Books0", atlas: 0, x: 152, y: 465, width: 12, height: 14 }),
        Books1: tx({ id: "Furniture.Library.Books1", atlas: 0, x: 184, y: 715, width: 16, height: 12 }),
        Books2: tx({ id: "Furniture.Library.Books2", atlas: 0, x: 959, y: 588, width: 14, height: 16 }),
      },
      PotionGreen: tx({ id: "Furniture.PotionGreen", atlas: 0, x: 1334, y: 407, width: 16, height: 22 }),
      PotionRed: tx({ id: "Furniture.PotionRed", atlas: 0, x: 222, y: 731, width: 16, height: 22 }),
      Pottery18: tx({ id: "Furniture.Pottery18", atlas: 0, x: 1199, y: 461, width: 18, height: 18 }),
      StoneShelfUgly: tx({ id: "Furniture.StoneShelfUgly", atlas: 0, x: 940, y: 462, width: 52, height: 78 }),
      Table0: tx({ id: "Furniture.Table0", atlas: 0, x: 323, y: 604, width: 62, height: 22 }),
      WateringCan: tx({ id: "Furniture.WateringCan", atlas: 0, x: 380, y: 395, width: 34, height: 22 }),
    },
    Iguana: {
      Boiled: {
        Club: tx({ id: "Iguana.Boiled.Club", atlas: 0, x: 91, y: 542, width: 72, height: 18 }),
        Crest: tx({ id: "Iguana.Boiled.Crest", atlas: 0, x: 1868, y: 261, width: 168, height: 24 }),
        Eye: tx({ id: "Iguana.Boiled.Eye", atlas: 0, x: 312, y: 503, width: 12, height: 12 }),
        Foot: tx({ id: "Iguana.Boiled.Foot", atlas: 0, x: 1657, y: 261, width: 210, height: 18 }),
        Head: tx({ id: "Iguana.Boiled.Head", atlas: 0, x: 1228, y: 483, width: 27, height: 27 }),
        Horn: tx({ id: "Iguana.Boiled.Horn", atlas: 0, x: 164, y: 542, width: 72, height: 12 }),
        Mouth: tx({ id: "Iguana.Boiled.Mouth", atlas: 0, x: 1112, y: 429, width: 108, height: 12 }),
        Nails: tx({ id: "Iguana.Boiled.Nails", atlas: 0, x: 165, y: 402, width: 45, height: 9 }),
        Pupil: tx({ id: "Iguana.Boiled.Pupil", atlas: 0, x: 1868, y: 286, width: 144, height: 12 }),
        Tail: tx({ id: "Iguana.Boiled.Tail", atlas: 0, x: 1706, y: 170, width: 210, height: 33 }),
        Torso: tx({ id: "Iguana.Boiled.Torso", atlas: 0, x: 41, y: 758, width: 36, height: 36 }),
      },
      Club: tx({ id: "Iguana.Club", atlas: 0, x: 164, y: 555, width: 72, height: 18 }),
      Crest: tx({ id: "Iguana.Crest", atlas: 0, x: 211, y: 395, width: 168, height: 24 }),
      Eye: tx({ id: "Iguana.Eye", atlas: 0, x: 1102, y: 559, width: 12, height: 12 }),
      Foot: tx({ id: "Iguana.Foot", atlas: 0, x: 1657, y: 280, width: 210, height: 18 }),
      Head: tx({ id: "Iguana.Head", atlas: 0, x: 1168, y: 490, width: 27, height: 27 }),
      Horn: tx({ id: "Iguana.Horn", atlas: 0, x: 91, y: 561, width: 72, height: 12 }),
      Mouth: tx({ id: "Iguana.Mouth", atlas: 0, x: 1221, y: 430, width: 108, height: 12 }),
      Nails: tx({ id: "Iguana.Nails", atlas: 0, x: 231, y: 593, width: 45, height: 9 }),
      Pupil: tx({ id: "Iguana.Pupil", atlas: 0, x: 1900, y: 299, width: 144, height: 12 }),
      Tail: tx({ id: "Iguana.Tail", atlas: 0, x: 0, y: 368, width: 210, height: 33 }),
      Torso: tx({ id: "Iguana.Torso", atlas: 0, x: 0, y: 772, width: 36, height: 36 }),
    },
    Light: {
      AuraIrregular40: tx({ id: "Light.AuraIrregular40", atlas: 0, x: 0, y: 698, width: 44, height: 42 }),
      ShadowIguana: tx({ id: "Light.ShadowIguana", atlas: 0, x: 751, y: 495, width: 48, height: 10 }),
      ShadowIrregularSmallRound: tx({ id: "Light.ShadowIrregularSmallRound", atlas: 0, x: 1115, y: 559, width: 12, height: 10 }),
      ShadowIrregularSmall: tx({ id: "Light.ShadowIrregularSmall", atlas: 0, x: 2031, y: 104, width: 16, height: 8 }),
      ShadowMessy0: tx({ id: "Light.ShadowMessy0", atlas: 0, x: 1990, y: 116, width: 58, height: 12 }),
    },
    Placeholder: tx({ id: "Placeholder", atlas: 0, x: 335, y: 658, width: 14, height: 14 }),
    Shapes: {
      Arc24: tx({ id: "Shapes.Arc24", atlas: 0, x: 946, y: 100, width: 24, height: 4 }),
      ArcFilledIrregular90: tx({ id: "Shapes.ArcFilledIrregular90", atlas: 0, x: 0, y: 526, width: 90, height: 92 }),
      CircleIrregular72: tx({ id: "Shapes.CircleIrregular72", atlas: 0, x: 91, y: 574, width: 72, height: 72 }),
      Circle64: tx({ id: "Shapes.Circle64", atlas: 0, x: 164, y: 601, width: 64, height: 64 }),
      Confetti45deg: tx({ id: "Shapes.Confetti45deg", atlas: 0, x: 1137, y: 517, width: 26, height: 26 }),
      Confetti18x8: tx({ id: "Shapes.Confetti18x8", atlas: 0, x: 1083, y: 553, width: 18, height: 8 }),
      Confetti32: tx({ id: "Shapes.Confetti32", atlas: 0, x: 1289, y: 474, width: 32, height: 32 }),
      DashedLine3px: tx({ id: "Shapes.DashedLine3px", atlas: 0, x: 801, y: 432, width: 6, height: 98 }),
      DashedLineArc3px: tx({ id: "Shapes.DashedLineArc3px", atlas: 0, x: 229, y: 643, width: 52, height: 46 }),
      DitherSquare16: tx({ id: "Shapes.DitherSquare16", atlas: 0, x: 1129, y: 544, width: 16, height: 16 }),
      LineVertical16: tx({ id: "Shapes.LineVertical16", atlas: 0, x: 196, y: 493, width: 1, height: 16 }),
      Quad22deg0: tx({ id: "Shapes.Quad22deg0", atlas: 0, x: 833, y: 336, width: 140, height: 78 }),
      Rectangle6: tx({ id: "Shapes.Rectangle6", atlas: 0, x: 290, y: 623, width: 6, height: 3 }),
      RightTriangle24px: tx({ id: "Shapes.RightTriangle24px", atlas: 0, x: 1196, y: 504, width: 24, height: 22 }),
      SquareIrregular10: tx({ id: "Shapes.SquareIrregular10", atlas: 0, x: 1210, y: 527, width: 10, height: 10 }),
      Square32: tx({ id: "Shapes.Square32", atlas: 0, x: 1108, y: 461, width: 32, height: 32 }),
      X10: tx({ id: "Shapes.X10", atlas: 0, x: 1045, y: 573, width: 10, height: 10 }),
      X22: tx({ id: "Shapes.X22", atlas: 0, x: 1083, y: 536, width: 22, height: 16 }),
      Zigzag14: tx({ id: "Shapes.Zigzag14", atlas: 0, x: 2033, y: 93, width: 14, height: 8 }),
    },
    Sky: {
      CloudBalls0: tx({ id: "Sky.CloudBalls0", atlas: 0, x: 0, y: 402, width: 164, height: 62 }),
      CloudBalls1: tx({ id: "Sky.CloudBalls1", atlas: 0, x: 672, y: 432, width: 128, height: 42 }),
      CloudStrokeThick0: tx({ id: "Sky.CloudStrokeThick0", atlas: 0, x: 0, y: 291, width: 414, height: 76 }),
      CloudStrokeThick1: tx({ id: "Sky.CloudStrokeThick1", atlas: 0, x: 386, y: 533, width: 78, height: 66 }),
      Cloud0: tx({ id: "Sky.Cloud0", atlas: 0, x: 1706, y: 116, width: 283, height: 53 }),
    },
    Stone: {
      BrickLump0: tx({ id: "Stone.BrickLump0", atlas: 0, x: 872, y: 536, width: 66, height: 12 }),
      BrickMedium0: tx({ id: "Stone.BrickMedium0", atlas: 0, x: 386, y: 615, width: 62, height: 50 }),
      BrickSingle0: tx({ id: "Stone.BrickSingle0", atlas: 0, x: 73, y: 619, width: 16, height: 10 }),
      RockLargeShaded: tx({ id: "Stone.RockLargeShaded", atlas: 0, x: 239, y: 715, width: 38, height: 26 }),
      RockSmallShaded1: tx({ id: "Stone.RockSmallShaded1", atlas: 0, x: 147, y: 694, width: 7, height: 6 }),
      Rock0: tx({ id: "Stone.Rock0", atlas: 0, x: 1164, y: 518, width: 24, height: 15 }),
      Salt68px: tx({ id: "Stone.Salt68px", atlas: 0, x: 0, y: 630, width: 68, height: 18 }),
      Salt90px: tx({ id: "Stone.Salt90px", atlas: 0, x: 196, y: 517, width: 90, height: 24 }),
      ShinyRock0: tx({ id: "Stone.ShinyRock0", atlas: 0, x: 465, y: 533, width: 34, height: 28 }),
      ShinyRock1: tx({ id: "Stone.ShinyRock1", atlas: 0, x: 1256, y: 494, width: 24, height: 18 }),
      ShinyRockWall0: tx({ id: "Stone.ShinyRockWall0", atlas: 0, x: 672, y: 475, width: 78, height: 48 }),
    },
    Terrain: {
      Earth: {
        Asterisk: tx({ id: "Terrain.Earth.Asterisk", atlas: 0, x: 1221, y: 511, width: 21, height: 24 }),
        Crack8px12px: tx({ id: "Terrain.Earth.Crack8px12px", atlas: 0, x: 277, y: 593, width: 8, height: 12 }),
        Crack28px38px: tx({ id: "Terrain.Earth.Crack28px38px", atlas: 0, x: 538, y: 577, width: 28, height: 38 }),
        CrackSmall0: tx({ id: "Terrain.Earth.CrackSmall0", atlas: 0, x: 797, y: 531, width: 8, height: 4 }),
        ExposedDirt: tx({ id: "Terrain.Earth.ExposedDirt", atlas: 0, x: 409, y: 518, width: 80, height: 14 }),
        Loop: tx({ id: "Terrain.Earth.Loop", atlas: 0, x: 317, y: 687, width: 17, height: 18 }),
        Mass0: tx({ id: "Terrain.Earth.Mass0", atlas: 0, x: 974, y: 367, width: 137, height: 81 }),
        QuestionMarkStencil0: tx({ id: "Terrain.Earth.QuestionMarkStencil0", atlas: 0, x: 1060, y: 551, width: 22, height: 14 }),
        QuestionMark: tx({ id: "Terrain.Earth.QuestionMark", atlas: 0, x: 974, y: 541, width: 18, height: 24 }),
        Scribble0: tx({ id: "Terrain.Earth.Scribble0", atlas: 0, x: 198, y: 480, width: 94, height: 36 }),
        Smooth: tx({ id: "Terrain.Earth.Smooth", atlas: 0, x: 1944, y: 93, width: 88, height: 10 }),
        Spots: tx({ id: "Terrain.Earth.Spots", atlas: 0, x: 500, y: 470, width: 86, height: 23 }),
        V: tx({ id: "Terrain.Earth.V", atlas: 0, x: 2027, y: 148, width: 20, height: 18 }),
        ValuableBlue0: tx({ id: "Terrain.Earth.ValuableBlue0", atlas: 0, x: 1189, y: 527, width: 20, height: 24 }),
        ValuableRed0: tx({ id: "Terrain.Earth.ValuableRed0", atlas: 0, x: 811, y: 400, width: 20, height: 14 }),
        Zigzag0: tx({ id: "Terrain.Earth.Zigzag0", atlas: 0, x: 721, y: 538, width: 74, height: 14 }),
      },
      Grass: {
        Jagged2px: tx({ id: "Terrain.Grass.Jagged2px", atlas: 0, x: 268, y: 471, width: 42, height: 8 }),
        Jagged: tx({ id: "Terrain.Grass.Jagged", atlas: 0, x: 721, y: 524, width: 75, height: 13 }),
        Loops: tx({ id: "Terrain.Grass.Loops", atlas: 0, x: 0, y: 619, width: 72, height: 10 }),
        Shape1: tx({ id: "Terrain.Grass.Shape1", atlas: 0, x: 237, y: 565, width: 40, height: 8 }),
        Sparse3px1: tx({ id: "Terrain.Grass.Sparse3px1", atlas: 0, x: 865, y: 100, width: 80, height: 4 }),
        Sparse3px: tx({ id: "Terrain.Grass.Sparse3px", atlas: 0, x: 1687, y: 207, width: 48, height: 4 }),
        Tall3px: tx({ id: "Terrain.Grass.Tall3px", atlas: 0, x: 1258, y: 443, width: 34, height: 18 }),
      },
      Pipe: {
        Gray: tx({ id: "Terrain.Pipe.Gray", atlas: 0, x: 69, y: 647, width: 64, height: 13 }),
      },
    },
    Town: {
      Ball: {
        Ball0: tx({ id: "Town.Ball.Ball0", atlas: 0, x: 1083, y: 562, width: 12, height: 12 }),
        Ball1: tx({ id: "Town.Ball.Ball1", atlas: 0, x: 1146, y: 544, width: 14, height: 12 }),
        Brick0: tx({ id: "Town.Ball.Brick0", atlas: 0, x: 123, y: 740, width: 36, height: 30 }),
        Brick1: tx({ id: "Town.Ball.Brick1", atlas: 0, x: 78, y: 760, width: 36, height: 20 }),
        ColumnSpiral0: tx({ id: "Town.Ball.ColumnSpiral0", atlas: 0, x: 1243, y: 511, width: 12, height: 20 }),
        Dice: tx({ id: "Town.Ball.Dice", atlas: 0, x: 993, y: 570, width: 10, height: 10 }),
        FishmongerBombDefused: tx({ id: "Town.Ball.FishmongerBombDefused", atlas: 0, x: 386, y: 666, width: 52, height: 28 }),
        FishmongerBomb: tx({ id: "Town.Ball.FishmongerBomb", atlas: 0, x: 282, y: 658, width: 52, height: 28 }),
        Frame: tx({ id: "Town.Ball.Frame", atlas: 0, x: 885, y: 474, width: 50, height: 56 }),
        IdolBase: tx({ id: "Town.Ball.IdolBase", atlas: 0, x: 808, y: 474, width: 76, height: 44 }),
        IdolHead: tx({ id: "Town.Ball.IdolHead", atlas: 0, x: 101, y: 493, width: 94, height: 48 }),
        StructureHighlight: tx({ id: "Town.Ball.StructureHighlight", atlas: 0, x: 45, y: 717, width: 40, height: 40 }),
        StructureSmall: tx({ id: "Town.Ball.StructureSmall", atlas: 0, x: 409, y: 453, width: 90, height: 64 }),
        Structure: tx({ id: "Town.Ball.Structure", atlas: 0, x: 1355, y: 322, width: 150, height: 114 }),
        Symbols: {
          Circle: tx({ id: "Town.Ball.Symbols.Circle", atlas: 0, x: 1170, y: 461, width: 28, height: 28 }),
          P: tx({ id: "Town.Ball.Symbols.P", atlas: 0, x: 1141, y: 488, width: 26, height: 28 }),
          Square: tx({ id: "Town.Ball.Symbols.Square", atlas: 0, x: 1221, y: 452, width: 34, height: 30 }),
          Star: tx({ id: "Town.Ball.Symbols.Star", atlas: 0, x: 0, y: 741, width: 40, height: 30 }),
        },
        TheSecretShop: tx({ id: "Town.Ball.TheSecretShop", atlas: 0, x: 672, y: 371, width: 138, height: 60 }),
      },
      Colossus: {
        Eyebrow0: tx({ id: "Town.Colossus.Eyebrow0", atlas: 0, x: 202, y: 666, width: 26, height: 8 }),
        Eyebrow1: tx({ id: "Town.Colossus.Eyebrow1", atlas: 0, x: 644, y: 509, width: 26, height: 14 }),
        Eyelid0: tx({ id: "Town.Colossus.Eyelid0", atlas: 0, x: 69, y: 630, width: 20, height: 14 }),
        Mouth0: tx({ id: "Town.Colossus.Mouth0", atlas: 0, x: 1221, y: 443, width: 36, height: 8 }),
        Mouth1: tx({ id: "Town.Colossus.Mouth1", atlas: 0, x: 1944, y: 74, width: 104, height: 18 }),
        Mouth2: tx({ id: "Town.Colossus.Mouth2", atlas: 0, x: 101, y: 465, width: 50, height: 14 }),
        Noggin0: tx({ id: "Town.Colossus.Noggin0", atlas: 0, x: 587, y: 470, width: 84, height: 38 }),
        Nose0: tx({ id: "Town.Colossus.Nose0", atlas: 0, x: 293, y: 503, width: 18, height: 12 }),
        Pupil0: tx({ id: "Town.Colossus.Pupil0", atlas: 0, x: 439, y: 666, width: 8, height: 16 }),
        Pupil1: tx({ id: "Town.Colossus.Pupil1", atlas: 0, x: 465, y: 562, width: 34, height: 14 }),
        Pupil2: tx({ id: "Town.Colossus.Pupil2", atlas: 0, x: 1060, y: 566, width: 12, height: 12 }),
        Sclera0: tx({ id: "Town.Colossus.Sclera0", atlas: 0, x: 974, y: 566, width: 18, height: 24 }),
        Sclera1: tx({ id: "Town.Colossus.Sclera1", atlas: 0, x: 229, y: 606, width: 60, height: 36 }),
        Sclera2: tx({ id: "Town.Colossus.Sclera2", atlas: 0, x: 202, y: 690, width: 36, height: 40 }),
        Tooth0: tx({ id: "Town.Colossus.Tooth0", atlas: 0, x: 157, y: 647, width: 4, height: 18 }),
      },
      Monument: {
        Lazarus: tx({ id: "Town.Monument.Lazarus", atlas: 0, x: 110, y: 694, width: 36, height: 42 }),
        Weirdo: tx({ id: "Town.Monument.Weirdo", atlas: 0, x: 1037, y: 449, width: 70, height: 86 }),
      },
      Signage: {
        Board0: tx({ id: "Town.Signage.Board0", atlas: 0, x: 164, y: 574, width: 66, height: 26 }),
        Casino1px: tx({ id: "Town.Signage.Casino1px", atlas: 0, x: 808, y: 519, width: 76, height: 16 }),
        Casino2px: tx({ id: "Town.Signage.Casino2px", atlas: 0, x: 500, y: 453, width: 90, height: 16 }),
        Casino3px: tx({ id: "Town.Signage.Casino3px", atlas: 0, x: 1112, y: 442, width: 108, height: 18 }),
        Welcome0: tx({ id: "Town.Signage.Welcome0", atlas: 0, x: 1990, y: 129, width: 58, height: 18 }),
      },
      Underneath: {
        HeliumCreator: tx({ id: "Town.Underneath.HeliumCreator", atlas: 0, x: 147, y: 701, width: 36, height: 38 }),
        HeliumPipe: tx({ id: "Town.Underneath.HeliumPipe", atlas: 0, x: 65, y: 661, width: 46, height: 30 }),
        HeliumTank: tx({ id: "Town.Underneath.HeliumTank", atlas: 0, x: 157, y: 666, width: 44, height: 34 }),
        OpenIndicator: tx({ id: "Town.Underneath.OpenIndicator", atlas: 0, x: 1098, y: 291, width: 16, height: 6 }),
        RiserFaceHappy: tx({ id: "Town.Underneath.RiserFaceHappy", atlas: 0, x: 1108, y: 494, width: 28, height: 20 }),
        RiserFaceSurprise: tx({ id: "Town.Underneath.RiserFaceSurprise", atlas: 0, x: 1108, y: 515, width: 28, height: 20 }),
        RiserFace: tx({ id: "Town.Underneath.RiserFace", atlas: 0, x: 1199, y: 483, width: 28, height: 20 }),
      },
    },
    Ui: {
      Checkbox: tx({ id: "Ui.Checkbox", atlas: 0, x: 290, y: 627, width: 60, height: 30 }),
      ChooseYourLooksIcons: tx({ id: "Ui.ChooseYourLooksIcons", atlas: 0, x: 1013, y: 74, width: 930, height: 30 }),
      Dialog: {
        QuestionOption: tx({ id: "Ui.Dialog.QuestionOption", atlas: 0, x: 1098, y: 322, width: 256, height: 44 }),
        SpeakBox: tx({ id: "Ui.Dialog.SpeakBox", atlas: 0, x: 865, y: 105, width: 840, height: 96 }),
      },
      Experience: {
        IncrementBg: tx({ id: "Ui.Experience.IncrementBg", atlas: 0, x: 211, y: 368, width: 188, height: 26 }),
        Increment: tx({ id: "Ui.Experience.Increment", atlas: 0, x: 415, y: 291, width: 264, height: 32 }),
      },
      HorizontalBar9: tx({ id: "Ui.HorizontalBar9", atlas: 0, x: 1186, y: 202, width: 500, height: 9 }),
      InteractionIndicator: tx({ id: "Ui.InteractionIndicator", atlas: 0, x: 1106, y: 536, width: 22, height: 22 }),
      NewIndicator: tx({ id: "Ui.NewIndicator", atlas: 0, x: 134, y: 647, width: 20, height: 12 }),
      NoneChoice: tx({ id: "Ui.NoneChoice", atlas: 0, x: 91, y: 526, width: 8, height: 8 }),
      OwnerDefeat: tx({ id: "Ui.OwnerDefeat", atlas: 0, x: 2017, y: 32, width: 30, height: 16 }),
      PlacementReticle: tx({ id: "Ui.PlacementReticle", atlas: 0, x: 1221, y: 504, width: 6, height: 6 }),
      Pocket: {
        CollectNotification: tx({ id: "Ui.Pocket.CollectNotification", atlas: 0, x: 644, y: 524, width: 76, height: 24 }),
        OpenablePocket: tx({ id: "Ui.Pocket.OpenablePocket", atlas: 0, x: 0, y: 649, width: 64, height: 48 }),
      },
    },
    Wood: {
      Bookshelf0: tx({ id: "Wood.Bookshelf0", atlas: 0, x: 351, y: 627, width: 34, height: 56 }),
      Crate0: tx({ id: "Wood.Crate0", atlas: 0, x: 1293, y: 443, width: 34, height: 30 }),
      MeasuringStick: tx({ id: "Wood.MeasuringStick", atlas: 0, x: 856, y: 117, width: 8, height: 64 }),
      SignGiant0: tx({ id: "Wood.SignGiant0", atlas: 0, x: 1900, y: 312, width: 142, height: 84 }),
      Sign: tx({ id: "Wood.Sign", atlas: 0, x: 335, y: 684, width: 50, height: 29 }),
      Stake: tx({ id: "Wood.Stake", atlas: 0, x: 1028, y: 523, width: 8, height: 26 }),
    },
  };
}

export const GeneratedTextureData = {
  atlases,
  txs,
};
