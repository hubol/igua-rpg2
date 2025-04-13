// This file is generated

const atlases = [{ url: require("./atlas0.png"), texturesCount: 261 }];

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
      BallFruitTypeA: tx({ id: "Collectibles.BallFruitTypeA", atlas: 0, x: 881, y: 570, width: 22, height: 20 }),
      BallFruitTypeB: tx({ id: "Collectibles.BallFruitTypeB", atlas: 0, x: 881, y: 591, width: 22, height: 20 }),
      BallRed: tx({ id: "Collectibles.BallRed", atlas: 0, x: 546, y: 1016, width: 8, height: 8 }),
      ComputerChip: tx({ id: "Collectibles.ComputerChip", atlas: 0, x: 881, y: 612, width: 22, height: 20 }),
      Flop: {
        Body: tx({ id: "Collectibles.Flop.Body", atlas: 0, x: 854, y: 811, width: 28, height: 26 }),
        Crest: tx({ id: "Collectibles.Flop.Crest", atlas: 0, x: 0, y: 330, width: 672, height: 48 }),
        Ears: tx({ id: "Collectibles.Flop.Ears", atlas: 0, x: 257, y: 643, width: 96, height: 48 }),
        Eyes: tx({ id: "Collectibles.Flop.Eyes", atlas: 0, x: 681, y: 179, width: 272, height: 22 }),
        Feet: tx({ id: "Collectibles.Flop.Feet", atlas: 0, x: 577, y: 384, width: 216, height: 10 }),
        Front: tx({ id: "Collectibles.Flop.Front", atlas: 0, x: 0, y: 379, width: 576, height: 16 }),
        Mouth: tx({ id: "Collectibles.Flop.Mouth", atlas: 0, x: 0, y: 555, width: 392, height: 26 }),
        Nose: tx({ id: "Collectibles.Flop.Nose", atlas: 0, x: 0, y: 779, width: 204, height: 22 }),
        Rear: tx({ id: "Collectibles.Flop.Rear", atlas: 0, x: 0, y: 461, width: 432, height: 24 }),
      },
      ValuableBlue: tx({ id: "Collectibles.ValuableBlue", atlas: 0, x: 852, y: 600, width: 17, height: 13 }),
      ValuableGreen: tx({ id: "Collectibles.ValuableGreen", atlas: 0, x: 1008, y: 51, width: 7, height: 6 }),
      ValuableOrange: tx({ id: "Collectibles.ValuableOrange", atlas: 0, x: 852, y: 614, width: 17, height: 13 }),
    },
    Door: {
      NormalLockedLayer0: tx({ id: "Door.NormalLockedLayer0", atlas: 0, x: 536, y: 875, width: 34, height: 46 }),
      NormalLockedLayer1: tx({ id: "Door.NormalLockedLayer1", atlas: 0, x: 946, y: 202, width: 34, height: 46 }),
      NormalLockedLayer2: tx({ id: "Door.NormalLockedLayer2", atlas: 0, x: 731, y: 674, width: 34, height: 46 }),
      NormalOpen: tx({ id: "Door.NormalOpen", atlas: 0, x: 733, y: 599, width: 34, height: 46 }),
    },
    Effects: {
      BallonInflate: tx({ id: "Effects.BallonInflate", atlas: 0, x: 563, y: 980, width: 110, height: 24 }),
      BallonPop: tx({ id: "Effects.BallonPop", atlas: 0, x: 0, y: 0, width: 1012, height: 50 }),
      Ballon: tx({ id: "Effects.Ballon", atlas: 0, x: 348, y: 772, width: 110, height: 24 }),
      BoomText: tx({ id: "Effects.BoomText", atlas: 0, x: 727, y: 721, width: 44, height: 16 }),
      Bubble4: tx({ id: "Effects.Bubble4", atlas: 0, x: 607, y: 745, width: 4, height: 4 }),
      Burst32: tx({ id: "Effects.Burst32", atlas: 0, x: 733, y: 646, width: 32, height: 22 }),
      BurstDusty: tx({ id: "Effects.BurstDusty", atlas: 0, x: 505, y: 406, width: 470, height: 86 }),
      BurstRound24: tx({ id: "Effects.BurstRound24", atlas: 0, x: 674, y: 958, width: 72, height: 24 }),
      FieryBurst170px: tx({ id: "Effects.FieryBurst170px", atlas: 0, x: 0, y: 179, width: 680, height: 150 }),
      HeartBurst16px: tx({ id: "Effects.HeartBurst16px", atlas: 0, x: 0, y: 1007, width: 112, height: 16 }),
      Helium: tx({ id: "Effects.Helium", atlas: 0, x: 453, y: 925, width: 96, height: 12 }),
      Parachute: tx({ id: "Effects.Parachute", atlas: 0, x: 841, y: 82, width: 174, height: 82 }),
      PlayerJumpComboDust: tx({ id: "Effects.PlayerJumpComboDust", atlas: 0, x: 450, y: 980, width: 112, height: 22 }),
      SpiritualRelease0: tx({ id: "Effects.SpiritualRelease0", atlas: 0, x: 0, y: 486, width: 416, height: 68 }),
      SplashMedium: tx({ id: "Effects.SplashMedium", atlas: 0, x: 743, y: 983, width: 72, height: 24 }),
      SplashSmall: tx({ id: "Effects.SplashSmall", atlas: 0, x: 257, y: 692, width: 96, height: 12 }),
      Star12px: tx({ id: "Effects.Star12px", atlas: 0, x: 876, y: 865, width: 12, height: 10 }),
      ValuableSparkle: tx({ id: "Effects.ValuableSparkle", atlas: 0, x: 809, y: 638, width: 35, height: 7 }),
      WaterDripSmall: tx({ id: "Effects.WaterDripSmall", atlas: 0, x: 575, y: 977, width: 1, height: 2 }),
      WaterDripXsmall: tx({ id: "Effects.WaterDripXsmall", atlas: 0, x: 257, y: 705, width: 3, height: 5 }),
    },
    Enemy: {
      CommonClown: tx({ id: "Enemy.CommonClown", atlas: 0, x: 766, y: 646, width: 44, height: 32 }),
      SpikeBall: tx({ id: "Enemy.SpikeBall", atlas: 0, x: 550, y: 922, width: 24, height: 20 }),
      Spirit: {
        Presence: tx({ id: "Enemy.Spirit.Presence", atlas: 0, x: 892, y: 280, width: 126, height: 36 }),
      },
      Suggestive: {
        Body: tx({ id: "Enemy.Suggestive.Body", atlas: 0, x: 0, y: 396, width: 504, height: 64 }),
        FaceWide: tx({ id: "Enemy.Suggestive.FaceWide", atlas: 0, x: 258, y: 980, width: 52, height: 18 }),
        Face: tx({ id: "Enemy.Suggestive.Face", atlas: 0, x: 809, y: 613, width: 38, height: 24 }),
        Gear: tx({ id: "Enemy.Suggestive.Gear", atlas: 0, x: 817, y: 794, width: 32, height: 16 }),
        Mouth: tx({ id: "Enemy.Suggestive.Mouth", atlas: 0, x: 211, y: 772, width: 33, height: 6 }),
        Pupil: tx({ id: "Enemy.Suggestive.Pupil", atlas: 0, x: 1013, y: 0, width: 2, height: 8 }),
        ScleraWide: tx({ id: "Enemy.Suggestive.ScleraWide", atlas: 0, x: 678, y: 859, width: 14, height: 6 }),
        Sclera: tx({ id: "Enemy.Suggestive.Sclera", atlas: 0, x: 152, y: 935, width: 8, height: 16 }),
        Torso: tx({ id: "Enemy.Suggestive.Torso", atlas: 0, x: 938, y: 254, width: 86, height: 23 }),
      },
    },
    Esoteric: {
      Decoration: {
        Bandage: tx({ id: "Esoteric.Decoration.Bandage", atlas: 0, x: 431, y: 742, width: 12, height: 26 }),
        PicaxeGiant: tx({ id: "Esoteric.Decoration.PicaxeGiant", atlas: 0, x: 607, y: 570, width: 72, height: 69 }),
        SeedBag: tx({ id: "Esoteric.Decoration.SeedBag", atlas: 0, x: 821, y: 811, width: 32, height: 31 }),
      },
      Message: {
        Farmer: tx({ id: "Esoteric.Message.Farmer", atlas: 0, x: 358, y: 624, width: 74, height: 16 }),
        Miner: tx({ id: "Esoteric.Message.Miner", atlas: 0, x: 808, y: 942, width: 57, height: 15 }),
      },
    },
    Fiber: {
      Cobweb0: tx({ id: "Fiber.Cobweb0", atlas: 0, x: 867, y: 941, width: 30, height: 28 }),
      Cobweb1: tx({ id: "Fiber.Cobweb1", atlas: 0, x: 1001, y: 520, width: 20, height: 28 }),
      RopeFrame: tx({ id: "Fiber.RopeFrame", atlas: 0, x: 768, y: 857, width: 37, height: 28 }),
      StringOnStake0: tx({ id: "Fiber.StringOnStake0", atlas: 0, x: 680, y: 738, width: 8, height: 6 }),
    },
    Foliage: {
      BranchCut0: tx({ id: "Foliage.BranchCut0", atlas: 0, x: 648, y: 958, width: 24, height: 14 }),
      Bush0: tx({ id: "Foliage.Bush0", atlas: 0, x: 766, y: 679, width: 44, height: 24 }),
      Flower14: tx({ id: "Foliage.Flower14", atlas: 0, x: 444, y: 757, width: 14, height: 8 }),
      Flower18: tx({ id: "Foliage.Flower18", atlas: 0, x: 705, y: 947, width: 18, height: 10 }),
      Flower22: tx({ id: "Foliage.Flower22", atlas: 0, x: 918, y: 922, width: 22, height: 16 }),
      Leaf16: tx({ id: "Foliage.Leaf16", atlas: 0, x: 852, y: 628, width: 16, height: 16 }),
      Leaf36: tx({ id: "Foliage.Leaf36", atlas: 0, x: 768, y: 886, width: 36, height: 22 }),
      LeavesMedium0: tx({ id: "Foliage.LeavesMedium0", atlas: 0, x: 976, y: 406, width: 42, height: 60 }),
      Medium0: tx({ id: "Foliage.Medium0", atlas: 0, x: 862, y: 909, width: 26, height: 31 }),
      Moss0: tx({ id: "Foliage.Moss0", atlas: 0, x: 905, y: 620, width: 16, height: 18 }),
      MossHanging0: tx({ id: "Foliage.MossHanging0", atlas: 0, x: 178, y: 802, width: 24, height: 44 }),
      RootMedium0: tx({ id: "Foliage.RootMedium0", atlas: 0, x: 976, y: 467, width: 48, height: 19 }),
      Small: tx({ id: "Foliage.Small", atlas: 0, x: 113, y: 1007, width: 11, height: 17 }),
      Stem16: tx({ id: "Foliage.Stem16", atlas: 0, x: 129, y: 948, width: 14, height: 16 }),
      TallRoundRed: tx({ id: "Foliage.TallRoundRed", atlas: 0, x: 986, y: 165, width: 35, height: 88 }),
      TreeRingExposed: tx({ id: "Foliage.TreeRingExposed", atlas: 0, x: 258, y: 999, width: 48, height: 22 }),
      Vine0: tx({ id: "Foliage.Vine0", atlas: 0, x: 145, y: 935, width: 6, height: 33 }),
      Vine1: tx({ id: "Foliage.Vine1", atlas: 0, x: 867, y: 645, width: 14, height: 15 }),
    },
    Font: {
      Diggit: tx({ id: "Font.Diggit", atlas: 0, x: 450, y: 1016, width: 54, height: 8 }),
      ErotixLight: tx({ id: "Font.ErotixLight", atlas: 0, x: 0, y: 865, width: 160, height: 34 }),
      Erotix: tx({ id: "Font.Erotix", atlas: 0, x: 0, y: 900, width: 160, height: 34 }),
      Flaccid: tx({ id: "Font.Flaccid", atlas: 0, x: 348, y: 839, width: 102, height: 24 }),
      GoodBoy: tx({ id: "Font.GoodBoy", atlas: 0, x: 0, y: 582, width: 256, height: 128 }),
    },
    Furniture: {
      Aquarium: {
        Box76x46: tx({ id: "Furniture.Aquarium.Box76x46", atlas: 0, x: 628, y: 866, width: 76, height: 46 }),
        Coral: tx({ id: "Furniture.Aquarium.Coral", atlas: 0, x: 876, y: 838, width: 28, height: 26 }),
        Fish: tx({ id: "Furniture.Aquarium.Fish", atlas: 0, x: 348, y: 797, width: 110, height: 22 }),
        Sand: tx({ id: "Furniture.Aquarium.Sand", atlas: 0, x: 743, y: 1008, width: 72, height: 14 }),
        WaterIntake: tx({ id: "Furniture.Aquarium.WaterIntake", atlas: 0, x: 393, y: 555, width: 22, height: 14 }),
      },
      Artwork: {
        Poster0: tx({ id: "Furniture.Artwork.Poster0", atlas: 0, x: 0, y: 948, width: 128, height: 58 }),
        Statue0: tx({ id: "Furniture.Artwork.Statue0", atlas: 0, x: 453, y: 820, width: 82, height: 104 }),
        Statue1: tx({ id: "Furniture.Artwork.Statue1", atlas: 0, x: 540, y: 570, width: 66, height: 82 }),
        Statue2: tx({ id: "Furniture.Artwork.Statue2", atlas: 0, x: 257, y: 582, width: 100, height: 60 }),
        Statue3: tx({ id: "Furniture.Artwork.Statue3", atlas: 0, x: 536, y: 796, width: 62, height: 78 }),
      },
      ChainMetal: tx({ id: "Furniture.ChainMetal", atlas: 0, x: 165, y: 802, width: 12, height: 56 }),
      Chandelier: tx({ id: "Furniture.Chandelier", atlas: 0, x: 450, y: 943, width: 124, height: 36 }),
      Doll0: tx({ id: "Furniture.Doll0", atlas: 0, x: 889, y: 909, width: 28, height: 30 }),
      Lamp0: tx({ id: "Furniture.Lamp0", atlas: 0, x: 1001, y: 549, width: 22, height: 28 }),
      Library: {
        Books0: tx({ id: "Furniture.Library.Books0", atlas: 0, x: 1007, y: 597, width: 12, height: 14 }),
        Books1: tx({ id: "Furniture.Library.Books1", atlas: 0, x: 427, y: 692, width: 16, height: 12 }),
        Books2: tx({ id: "Furniture.Library.Books2", atlas: 0, x: 852, y: 645, width: 14, height: 16 }),
      },
      PotionGreen: tx({ id: "Furniture.PotionGreen", atlas: 0, x: 715, y: 599, width: 16, height: 22 }),
      PotionRed: tx({ id: "Furniture.PotionRed", atlas: 0, x: 973, y: 593, width: 16, height: 22 }),
      Pottery18: tx({ id: "Furniture.Pottery18", atlas: 0, x: 805, y: 888, width: 18, height: 18 }),
      StoneShelfUgly: tx({ id: "Furniture.StoneShelfUgly", atlas: 0, x: 575, y: 875, width: 52, height: 78 }),
      Table0: tx({ id: "Furniture.Table0", atlas: 0, x: 433, y: 461, width: 62, height: 22 }),
      WateringCan: tx({ id: "Furniture.WateringCan", atlas: 0, x: 811, y: 646, width: 34, height: 22 }),
    },
    Iguana: {
      Boiled: {
        Club: tx({ id: "Iguana.Boiled.Club", atlas: 0, x: 575, y: 958, width: 72, height: 18 }),
        Crest: tx({ id: "Iguana.Boiled.Crest", atlas: 0, x: 832, y: 520, width: 168, height: 24 }),
        Eye: tx({ id: "Iguana.Boiled.Eye", atlas: 0, x: 914, y: 1012, width: 12, height: 12 }),
        Foot: tx({ id: "Iguana.Boiled.Foot", atlas: 0, x: 681, y: 280, width: 210, height: 18 }),
        Head: tx({ id: "Iguana.Boiled.Head", atlas: 0, x: 898, y: 940, width: 27, height: 27 }),
        Horn: tx({ id: "Iguana.Boiled.Horn", atlas: 0, x: 354, y: 692, width: 72, height: 12 }),
        Mouth: tx({ id: "Iguana.Boiled.Mouth", atlas: 0, x: 892, y: 317, width: 108, height: 12 }),
        Nails: tx({ id: "Iguana.Boiled.Nails", atlas: 0, x: 540, y: 653, width: 45, height: 9 }),
        Pupil: tx({ id: "Iguana.Boiled.Pupil", atlas: 0, x: 841, y: 165, width: 144, height: 12 }),
        Tail: tx({ id: "Iguana.Boiled.Tail", atlas: 0, x: 0, y: 711, width: 210, height: 33 }),
        Torso: tx({ id: "Iguana.Boiled.Torso", atlas: 0, x: 784, y: 814, width: 36, height: 36 }),
      },
      Club: tx({ id: "Iguana.Club", atlas: 0, x: 607, y: 640, width: 72, height: 18 }),
      Crest: tx({ id: "Iguana.Crest", atlas: 0, x: 832, y: 545, width: 168, height: 24 }),
      Eye: tx({ id: "Iguana.Eye", atlas: 0, x: 990, y: 614, width: 12, height: 12 }),
      Foot: tx({ id: "Iguana.Foot", atlas: 0, x: 681, y: 299, width: 210, height: 18 }),
      Head: tx({ id: "Iguana.Head", atlas: 0, x: 918, y: 894, width: 27, height: 27 }),
      Horn: tx({ id: "Iguana.Horn", atlas: 0, x: 607, y: 659, width: 72, height: 12 }),
      Mouth: tx({ id: "Iguana.Mouth", atlas: 0, x: 450, y: 1003, width: 108, height: 12 }),
      Nails: tx({ id: "Iguana.Nails", atlas: 0, x: 816, y: 1015, width: 45, height: 9 }),
      Pupil: tx({ id: "Iguana.Pupil", atlas: 0, x: 0, y: 935, width: 144, height: 12 }),
      Tail: tx({ id: "Iguana.Tail", atlas: 0, x: 0, y: 745, width: 210, height: 33 }),
      Torso: tx({ id: "Iguana.Torso", atlas: 0, x: 806, y: 851, width: 36, height: 36 }),
    },
    Light: {
      AuraIrregular40: tx({ id: "Light.AuraIrregular40", atlas: 0, x: 768, y: 570, width: 44, height: 42 }),
      ShadowIguana: tx({ id: "Light.ShadowIguana", atlas: 0, x: 393, y: 570, width: 48, height: 10 }),
      ShadowIrregularSmallRound: tx({ id: "Light.ShadowIrregularSmallRound", atlas: 0, x: 724, y: 947, width: 12, height: 10 }),
      ShadowIrregularSmall: tx({ id: "Light.ShadowIrregularSmall", atlas: 0, x: 476, y: 484, width: 16, height: 8 }),
      ShadowMessy0: tx({ id: "Light.ShadowMessy0", atlas: 0, x: 766, y: 910, width: 58, height: 12 }),
    },
    Placeholder: tx({ id: "Placeholder", atlas: 0, x: 1007, y: 612, width: 14, height: 14 }),
    Shapes: {
      Arc24: tx({ id: "Shapes.Arc24", atlas: 0, x: 668, y: 1020, width: 24, height: 4 }),
      ArcFilledIrregular90: tx({ id: "Shapes.ArcFilledIrregular90", atlas: 0, x: 449, y: 570, width: 90, height: 92 }),
      CircleIrregular72: tx({ id: "Shapes.CircleIrregular72", atlas: 0, x: 607, y: 672, width: 72, height: 72 }),
      Circle64: tx({ id: "Shapes.Circle64", atlas: 0, x: 678, y: 745, width: 64, height: 64 }),
      Confetti45deg: tx({ id: "Shapes.Confetti45deg", atlas: 0, x: 946, y: 570, width: 26, height: 26 }),
      Confetti18x8: tx({ id: "Shapes.Confetti18x8", atlas: 0, x: 843, y: 876, width: 18, height: 8 }),
      Confetti32: tx({ id: "Shapes.Confetti32", atlas: 0, x: 843, y: 843, width: 32, height: 32 }),
      DashedLine3px: tx({ id: "Shapes.DashedLine3px", atlas: 0, x: 1016, y: 0, width: 6, height: 98 }),
      DashedLineArc3px: tx({ id: "Shapes.DashedLineArc3px", atlas: 0, x: 680, y: 627, width: 52, height: 46 }),
      DitherSquare16: tx({ id: "Shapes.DitherSquare16", atlas: 0, x: 990, y: 597, width: 16, height: 16 }),
      LineVertical16: tx({ id: "Shapes.LineVertical16", atlas: 0, x: 451, y: 839, width: 1, height: 16 }),
      Quad22deg0: tx({ id: "Shapes.Quad22deg0", atlas: 0, x: 312, y: 864, width: 140, height: 78 }),
      Rectangle6: tx({ id: "Shapes.Rectangle6", atlas: 0, x: 575, y: 954, width: 6, height: 3 }),
      RightTriangle24px: tx({ id: "Shapes.RightTriangle24px", atlas: 0, x: 973, y: 570, width: 24, height: 22 }),
      SquareIrregular10: tx({ id: "Shapes.SquareIrregular10", atlas: 0, x: 870, y: 600, width: 10, height: 10 }),
      Square32: tx({ id: "Shapes.Square32", atlas: 0, x: 862, y: 876, width: 32, height: 32 }),
      X10: tx({ id: "Shapes.X10", atlas: 0, x: 870, y: 611, width: 10, height: 10 }),
      X22: tx({ id: "Shapes.X22", atlas: 0, x: 946, y: 597, width: 22, height: 16 }),
      Zigzag14: tx({ id: "Shapes.Zigzag14", atlas: 0, x: 146, y: 969, width: 14, height: 8 }),
    },
    Sky: {
      CloudBalls0: tx({ id: "Sky.CloudBalls0", atlas: 0, x: 0, y: 802, width: 164, height: 62 }),
      CloudBalls1: tx({ id: "Sky.CloudBalls1", atlas: 0, x: 129, y: 980, width: 128, height: 42 }),
      CloudStrokeThick0: tx({ id: "Sky.CloudStrokeThick0", atlas: 0, x: 417, y: 493, width: 414, height: 76 }),
      CloudStrokeThick1: tx({ id: "Sky.CloudStrokeThick1", atlas: 0, x: 599, y: 750, width: 78, height: 66 }),
      Cloud0: tx({ id: "Sky.Cloud0", atlas: 0, x: 673, y: 330, width: 283, height: 53 }),
    },
    Stone: {
      BrickLump0: tx({ id: "Stone.BrickLump0", atlas: 0, x: 957, y: 330, width: 66, height: 12 }),
      BrickMedium0: tx({ id: "Stone.BrickMedium0", atlas: 0, x: 705, y: 859, width: 62, height: 50 }),
      BrickSingle0: tx({ id: "Stone.BrickSingle0", atlas: 0, x: 129, y: 969, width: 16, height: 10 }),
      RockLargeShaded: tx({ id: "Stone.RockLargeShaded", atlas: 0, x: 772, y: 704, width: 38, height: 26 }),
      RockSmallShaded1: tx({ id: "Stone.RockSmallShaded1", atlas: 0, x: 808, y: 958, width: 7, height: 6 }),
      Rock0: tx({ id: "Stone.Rock0", atlas: 0, x: 867, y: 999, width: 24, height: 15 }),
      Salt68px: tx({ id: "Stone.Salt68px", atlas: 0, x: 674, y: 983, width: 68, height: 18 }),
      Salt90px: tx({ id: "Stone.Salt90px", atlas: 0, x: 358, y: 582, width: 90, height: 24 }),
      ShinyRock0: tx({ id: "Stone.ShinyRock0", atlas: 0, x: 811, y: 669, width: 34, height: 28 }),
      ShinyRock1: tx({ id: "Stone.ShinyRock1", atlas: 0, x: 998, y: 578, width: 24, height: 18 }),
      ShinyRockWall0: tx({ id: "Stone.ShinyRockWall0", atlas: 0, x: 599, y: 817, width: 78, height: 48 }),
    },
    Terrain: {
      Earth: {
        Asterisk: tx({ id: "Terrain.Earth.Asterisk", atlas: 0, x: 924, y: 570, width: 21, height: 24 }),
        Crack8px12px: tx({ id: "Terrain.Earth.Crack8px12px", atlas: 0, x: 438, y: 624, width: 8, height: 12 }),
        Crack28px38px: tx({ id: "Terrain.Earth.Crack28px38px", atlas: 0, x: 788, y: 731, width: 28, height: 38 }),
        CrackSmall0: tx({ id: "Terrain.Earth.CrackSmall0", atlas: 0, x: 658, y: 379, width: 8, height: 4 }),
        ExposedDirt: tx({ id: "Terrain.Earth.ExposedDirt", atlas: 0, x: 350, y: 757, width: 80, height: 14 }),
        Loop: tx({ id: "Terrain.Earth.Loop", atlas: 0, x: 883, y: 633, width: 17, height: 18 }),
        Mass0: tx({ id: "Terrain.Earth.Mass0", atlas: 0, x: 312, y: 943, width: 137, height: 81 }),
        QuestionMarkStencil0: tx({ id: "Terrain.Earth.QuestionMarkStencil0", atlas: 0, x: 895, y: 894, width: 22, height: 14 }),
        QuestionMark: tx({ id: "Terrain.Earth.QuestionMark", atlas: 0, x: 905, y: 570, width: 18, height: 24 }),
        Scribble0: tx({ id: "Terrain.Earth.Scribble0", atlas: 0, x: 350, y: 705, width: 94, height: 36 }),
        Smooth: tx({ id: "Terrain.Earth.Smooth", atlas: 0, x: 794, y: 384, width: 88, height: 10 }),
        Spots: tx({ id: "Terrain.Earth.Spots", atlas: 0, x: 449, y: 663, width: 86, height: 23 }),
        V: tx({ id: "Terrain.Earth.V", atlas: 0, x: 924, y: 620, width: 20, height: 18 }),
        ValuableBlue0: tx({ id: "Terrain.Earth.ValuableBlue0", atlas: 0, x: 924, y: 595, width: 20, height: 24 }),
        ValuableRed0: tx({ id: "Terrain.Earth.ValuableRed0", atlas: 0, x: 852, y: 570, width: 20, height: 14 }),
        Zigzag0: tx({ id: "Terrain.Earth.Zigzag0", atlas: 0, x: 668, y: 1005, width: 74, height: 14 }),
      },
      Grass: {
        Jagged2px: tx({ id: "Terrain.Grass.Jagged2px", atlas: 0, x: 433, y: 484, width: 42, height: 8 }),
        Jagged: tx({ id: "Terrain.Grass.Jagged", atlas: 0, x: 350, y: 742, width: 75, height: 13 }),
        Loops: tx({ id: "Terrain.Grass.Loops", atlas: 0, x: 681, y: 318, width: 72, height: 10 }),
        Shape1: tx({ id: "Terrain.Grass.Shape1", atlas: 0, x: 505, y: 1016, width: 40, height: 8 }),
        Sparse3px1: tx({ id: "Terrain.Grass.Sparse3px1", atlas: 0, x: 577, y: 379, width: 80, height: 4 }),
        Sparse3px: tx({ id: "Terrain.Grass.Sparse3px", atlas: 0, x: 449, y: 687, width: 48, height: 4 }),
        Tall3px: tx({ id: "Terrain.Grass.Tall3px", atlas: 0, x: 811, y: 698, width: 34, height: 18 }),
      },
      Pipe: {
        Gray: tx({ id: "Terrain.Pipe.Gray", atlas: 0, x: 957, y: 370, width: 64, height: 13 }),
      },
    },
    Town: {
      Ball: {
        Ball0: tx({ id: "Town.Ball.Ball0", atlas: 0, x: 969, y: 616, width: 12, height: 12 }),
        Ball1: tx({ id: "Town.Ball.Ball1", atlas: 0, x: 899, y: 1012, width: 14, height: 12 }),
        Brick0: tx({ id: "Town.Ball.Brick0", atlas: 0, x: 825, y: 888, width: 36, height: 30 }),
        Brick1: tx({ id: "Town.Ball.Brick1", atlas: 0, x: 825, y: 919, width: 36, height: 20 }),
        ColumnSpiral0: tx({ id: "Town.Ball.ColumnSpiral0", atlas: 0, x: 1006, y: 384, width: 12, height: 20 }),
        Dice: tx({ id: "Town.Ball.Dice", atlas: 0, x: 870, y: 622, width: 10, height: 10 }),
        FishmongerBombDefused: tx({ id: "Town.Ball.FishmongerBombDefused", atlas: 0, x: 544, y: 750, width: 52, height: 28 }),
        FishmongerBomb: tx({ id: "Town.Ball.FishmongerBomb", atlas: 0, x: 715, y: 570, width: 52, height: 28 }),
        Frame: tx({ id: "Town.Ball.Frame", atlas: 0, x: 816, y: 958, width: 50, height: 56 }),
        IdolBase: tx({ id: "Town.Ball.IdolBase", atlas: 0, x: 628, y: 913, width: 76, height: 44 }),
        IdolHead: tx({ id: "Town.Ball.IdolHead", atlas: 0, x: 354, y: 643, width: 94, height: 48 }),
        StructureHighlight: tx({ id: "Town.Ball.StructureHighlight", atlas: 0, x: 743, y: 816, width: 40, height: 40 }),
        StructureSmall: tx({ id: "Town.Ball.StructureSmall", atlas: 0, x: 445, y: 692, width: 90, height: 64 }),
        Structure: tx({ id: "Town.Ball.Structure", atlas: 0, x: 161, y: 865, width: 150, height: 114 }),
        Symbols: {
          Circle: tx({ id: "Town.Ball.Symbols.Circle", atlas: 0, x: 895, y: 865, width: 28, height: 28 }),
          P: tx({ id: "Town.Ball.Symbols.P", atlas: 0, x: 867, y: 970, width: 26, height: 28 }),
          Square: tx({ id: "Town.Ball.Symbols.Square", atlas: 0, x: 817, y: 717, width: 34, height: 30 }),
          Star: tx({ id: "Town.Ball.Symbols.Star", atlas: 0, x: 768, y: 613, width: 40, height: 30 }),
        },
        TheSecretShop: tx({ id: "Town.Ball.TheSecretShop", atlas: 0, x: 211, y: 711, width: 138, height: 60 }),
      },
      Colossus: {
        Eyebrow0: tx({ id: "Town.Colossus.Eyebrow0", atlas: 0, x: 599, y: 866, width: 26, height: 8 }),
        Eyebrow1: tx({ id: "Town.Colossus.Eyebrow1", atlas: 0, x: 178, y: 847, width: 26, height: 14 }),
        Eyelid0: tx({ id: "Town.Colossus.Eyelid0", atlas: 0, x: 852, y: 585, width: 20, height: 14 }),
        Mouth0: tx({ id: "Town.Colossus.Mouth0", atlas: 0, x: 862, y: 1015, width: 36, height: 8 }),
        Mouth1: tx({ id: "Town.Colossus.Mouth1", atlas: 0, x: 348, y: 820, width: 104, height: 18 }),
        Mouth2: tx({ id: "Town.Colossus.Mouth2", atlas: 0, x: 544, y: 779, width: 50, height: 14 }),
        Noggin0: tx({ id: "Town.Colossus.Noggin0", atlas: 0, x: 459, y: 757, width: 84, height: 38 }),
        Nose0: tx({ id: "Town.Colossus.Nose0", atlas: 0, x: 1001, y: 317, width: 18, height: 12 }),
        Pupil0: tx({ id: "Town.Colossus.Pupil0", atlas: 0, x: 152, y: 952, width: 8, height: 16 }),
        Pupil1: tx({ id: "Town.Colossus.Pupil1", atlas: 0, x: 817, y: 748, width: 34, height: 14 }),
        Pupil2: tx({ id: "Town.Colossus.Pupil2", atlas: 0, x: 982, y: 627, width: 12, height: 12 }),
        Sclera0: tx({ id: "Town.Colossus.Sclera0", atlas: 0, x: 905, y: 595, width: 18, height: 24 }),
        Sclera1: tx({ id: "Town.Colossus.Sclera1", atlas: 0, x: 705, y: 910, width: 60, height: 36 }),
        Sclera2: tx({ id: "Town.Colossus.Sclera2", atlas: 0, x: 780, y: 773, width: 36, height: 40 }),
        Tooth0: tx({ id: "Town.Colossus.Tooth0", atlas: 0, x: 433, y: 624, width: 4, height: 18 }),
      },
      Monument: {
        Lazarus: tx({ id: "Town.Monument.Lazarus", atlas: 0, x: 743, y: 773, width: 36, height: 42 }),
        Weirdo: tx({ id: "Town.Monument.Weirdo", atlas: 0, x: 536, y: 663, width: 70, height: 86 }),
      },
      Signage: {
        Board0: tx({ id: "Town.Signage.Board0", atlas: 0, x: 957, y: 343, width: 66, height: 26 }),
        Casino1px: tx({ id: "Town.Signage.Casino1px", atlas: 0, x: 459, y: 796, width: 76, height: 16 }),
        Casino2px: tx({ id: "Town.Signage.Casino2px", atlas: 0, x: 358, y: 607, width: 90, height: 16 }),
        Casino3px: tx({ id: "Town.Signage.Casino3px", atlas: 0, x: 559, y: 1005, width: 108, height: 18 }),
        Welcome0: tx({ id: "Town.Signage.Welcome0", atlas: 0, x: 766, y: 923, width: 58, height: 18 }),
      },
      Underneath: {
        HeliumCreator: tx({ id: "Town.Underneath.HeliumCreator", atlas: 0, x: 813, y: 570, width: 36, height: 38 }),
        HeliumPipe: tx({ id: "Town.Underneath.HeliumPipe", atlas: 0, x: 680, y: 704, width: 46, height: 30 }),
        HeliumTank: tx({ id: "Town.Underneath.HeliumTank", atlas: 0, x: 743, y: 738, width: 44, height: 34 }),
        OpenIndicator: tx({ id: "Town.Underneath.OpenIndicator", atlas: 0, x: 459, y: 813, width: 16, height: 6 }),
        RiserFaceHappy: tx({ id: "Town.Underneath.RiserFaceHappy", atlas: 0, x: 954, y: 178, width: 28, height: 20 }),
        RiserFaceSurprise: tx({ id: "Town.Underneath.RiserFaceSurprise", atlas: 0, x: 894, y: 970, width: 28, height: 20 }),
        RiserFace: tx({ id: "Town.Underneath.RiserFace", atlas: 0, x: 894, y: 991, width: 28, height: 20 }),
      },
    },
    Ui: {
      Checkbox: tx({ id: "Ui.Checkbox", atlas: 0, x: 747, y: 947, width: 60, height: 30 }),
      ChooseYourLooksIcons: tx({ id: "Ui.ChooseYourLooksIcons", atlas: 0, x: 0, y: 51, width: 930, height: 30 }),
      Dialog: {
        QuestionOption: tx({ id: "Ui.Dialog.QuestionOption", atlas: 0, x: 681, y: 235, width: 256, height: 44 }),
        SpeakBox: tx({ id: "Ui.Dialog.SpeakBox", atlas: 0, x: 0, y: 82, width: 840, height: 96 }),
      },
      Experience: {
        IncrementBg: tx({ id: "Ui.Experience.IncrementBg", atlas: 0, x: 832, y: 493, width: 188, height: 26 }),
        Increment: tx({ id: "Ui.Experience.Increment", atlas: 0, x: 681, y: 202, width: 264, height: 32 }),
      },
      HorizontalBar9: tx({ id: "Ui.HorizontalBar9", atlas: 0, x: 505, y: 396, width: 500, height: 9 }),
      InteractionIndicator: tx({ id: "Ui.InteractionIndicator", atlas: 0, x: 946, y: 614, width: 22, height: 22 }),
      NoneChoice: tx({ id: "Ui.NoneChoice", atlas: 0, x: 586, y: 653, width: 8, height: 8 }),
      OwnerDefeat: tx({ id: "Ui.OwnerDefeat", atlas: 0, x: 850, y: 794, width: 30, height: 16 }),
      PlacementReticle: tx({ id: "Ui.PlacementReticle", atlas: 0, x: 536, y: 750, width: 6, height: 6 }),
      Pocket: {
        CollectNotification: tx({ id: "Ui.Pocket.CollectNotification", atlas: 0, x: 931, y: 51, width: 76, height: 24 }),
        OpenablePocket: tx({ id: "Ui.Pocket.OpenablePocket", atlas: 0, x: 678, y: 810, width: 64, height: 48 }),
      },
    },
    Wood: {
      Bookshelf0: tx({ id: "Wood.Bookshelf0", atlas: 0, x: 680, y: 570, width: 34, height: 56 }),
      Crate0: tx({ id: "Wood.Crate0", atlas: 0, x: 817, y: 763, width: 34, height: 30 }),
      MeasuringStick: tx({ id: "Wood.MeasuringStick", atlas: 0, x: 1016, y: 99, width: 8, height: 64 }),
      SignGiant0: tx({ id: "Wood.SignGiant0", atlas: 0, x: 205, y: 779, width: 142, height: 84 }),
      Sign: tx({ id: "Wood.Sign", atlas: 0, x: 680, y: 674, width: 50, height: 29 }),
      Stake: tx({ id: "Wood.Stake", atlas: 0, x: 496, y: 461, width: 8, height: 26 }),
    },
  };
}

export const GeneratedTextureData = {
  atlases,
  txs,
};
