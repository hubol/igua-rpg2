// This file is generated

const atlases = [{ url: require("./atlas0.png"), texturesCount: 262 }];

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
      BallFruitTypeA: tx({ id: "Collectibles.BallFruitTypeA", atlas: 0, x: 1001, y: 574, width: 22, height: 20 }),
      BallFruitTypeB: tx({ id: "Collectibles.BallFruitTypeB", atlas: 0, x: 1001, y: 678, width: 22, height: 20 }),
      BallRed: tx({ id: "Collectibles.BallRed", atlas: 0, x: 934, y: 733, width: 8, height: 8 }),
      ComputerChip: tx({ id: "Collectibles.ComputerChip", atlas: 0, x: 996, y: 757, width: 22, height: 20 }),
      Flop: {
        Appear: tx({ id: "Collectibles.Flop.Appear", atlas: 0, x: 864, y: 783, width: 36, height: 16 }),
        Body: tx({ id: "Collectibles.Flop.Body", atlas: 0, x: 993, y: 595, width: 28, height: 26 }),
        Crest: tx({ id: "Collectibles.Flop.Crest", atlas: 0, x: 0, y: 347, width: 672, height: 48 }),
        Ears: tx({ id: "Collectibles.Flop.Ears", atlas: 0, x: 449, y: 720, width: 96, height: 48 }),
        Eyes: tx({ id: "Collectibles.Flop.Eyes", atlas: 0, x: 673, y: 347, width: 272, height: 22 }),
        Feet: tx({ id: "Collectibles.Flop.Feet", atlas: 0, x: 681, y: 196, width: 324, height: 10 }),
        Front: tx({ id: "Collectibles.Flop.Front", atlas: 0, x: 0, y: 82, width: 864, height: 16 }),
        Mouth: tx({ id: "Collectibles.Flop.Mouth", atlas: 0, x: 0, y: 555, width: 392, height: 26 }),
        Nose: tx({ id: "Collectibles.Flop.Nose", atlas: 0, x: 577, y: 396, width: 408, height: 22 }),
        Rear: tx({ id: "Collectibles.Flop.Rear", atlas: 0, x: 0, y: 396, width: 576, height: 24 }),
      },
      ValuableBlue: tx({ id: "Collectibles.ValuableBlue", atlas: 0, x: 830, y: 738, width: 17, height: 13 }),
      ValuableGreen: tx({ id: "Collectibles.ValuableGreen", atlas: 0, x: 1017, y: 268, width: 7, height: 6 }),
      ValuableOrange: tx({ id: "Collectibles.ValuableOrange", atlas: 0, x: 986, y: 182, width: 17, height: 13 }),
    },
    Door: {
      NormalLockedLayer0: tx({ id: "Door.NormalLockedLayer0", atlas: 0, x: 546, y: 718, width: 34, height: 46 }),
      NormalLockedLayer1: tx({ id: "Door.NormalLockedLayer1", atlas: 0, x: 784, y: 753, width: 34, height: 46 }),
      NormalLockedLayer2: tx({ id: "Door.NormalLockedLayer2", atlas: 0, x: 795, y: 705, width: 34, height: 46 }),
      NormalOpen: tx({ id: "Door.NormalOpen", atlas: 0, x: 786, y: 800, width: 34, height: 46 }),
    },
    Effects: {
      BallonInflate: tx({ id: "Effects.BallonInflate", atlas: 0, x: 294, y: 828, width: 110, height: 24 }),
      BallonPop: tx({ id: "Effects.BallonPop", atlas: 0, x: 0, y: 0, width: 1012, height: 50 }),
      Ballon: tx({ id: "Effects.Ballon", atlas: 0, x: 338, y: 754, width: 110, height: 24 }),
      BoomText: tx({ id: "Effects.BoomText", atlas: 0, x: 819, y: 783, width: 44, height: 16 }),
      Bubble4: tx({ id: "Effects.Bubble4", atlas: 0, x: 1020, y: 0, width: 4, height: 4 }),
      Burst32: tx({ id: "Effects.Burst32", atlas: 0, x: 906, y: 595, width: 32, height: 22 }),
      BurstDusty: tx({ id: "Effects.BurstDusty", atlas: 0, x: 505, y: 431, width: 470, height: 86 }),
      BurstRound24: tx({ id: "Effects.BurstRound24", atlas: 0, x: 598, y: 674, width: 72, height: 24 }),
      FieryBurst170px: tx({ id: "Effects.FieryBurst170px", atlas: 0, x: 0, y: 196, width: 680, height: 150 }),
      HeartBurst16px: tx({ id: "Effects.HeartBurst16px", atlas: 0, x: 284, y: 1004, width: 112, height: 16 }),
      Helium: tx({ id: "Effects.Helium", atlas: 0, x: 300, y: 909, width: 96, height: 12 }),
      Parachute: tx({ id: "Effects.Parachute", atlas: 0, x: 841, y: 99, width: 174, height: 82 }),
      PlayerJumpComboDust: tx({ id: "Effects.PlayerJumpComboDust", atlas: 0, x: 884, y: 370, width: 112, height: 22 }),
      SpiritualRelease0: tx({ id: "Effects.SpiritualRelease0", atlas: 0, x: 0, y: 486, width: 416, height: 68 }),
      SplashMedium: tx({ id: "Effects.SplashMedium", atlas: 0, x: 656, y: 876, width: 72, height: 24 }),
      SplashSmall: tx({ id: "Effects.SplashSmall", atlas: 0, x: 397, y: 909, width: 96, height: 12 }),
      Star12px: tx({ id: "Effects.Star12px", atlas: 0, x: 481, y: 963, width: 12, height: 10 }),
      ValuableSparkle: tx({ id: "Effects.ValuableSparkle", atlas: 0, x: 681, y: 339, width: 35, height: 7 }),
      WaterDripSmall: tx({ id: "Effects.WaterDripSmall", atlas: 0, x: 593, y: 831, width: 1, height: 2 }),
      WaterDripXsmall: tx({ id: "Effects.WaterDripXsmall", atlas: 0, x: 581, y: 834, width: 3, height: 5 }),
    },
    Enemy: {
      CommonClown: tx({ id: "Enemy.CommonClown", atlas: 0, x: 830, y: 705, width: 44, height: 32 }),
      SpikeBall: tx({ id: "Enemy.SpikeBall", atlas: 0, x: 939, y: 595, width: 24, height: 20 }),
      Spirit: {
        Presence: tx({ id: "Enemy.Spirit.Presence", atlas: 0, x: 211, y: 754, width: 126, height: 36 }),
      },
      Suggestive: {
        Body: tx({ id: "Enemy.Suggestive.Body", atlas: 0, x: 0, y: 421, width: 504, height: 64 }),
        FaceWide: tx({ id: "Enemy.Suggestive.FaceWide", atlas: 0, x: 735, y: 1000, width: 52, height: 18 }),
        Face: tx({ id: "Enemy.Suggestive.Face", atlas: 0, x: 982, y: 325, width: 38, height: 24 }),
        Gear: tx({ id: "Enemy.Suggestive.Gear", atlas: 0, x: 796, y: 933, width: 32, height: 16 }),
        Mouth: tx({ id: "Enemy.Suggestive.Mouth", atlas: 0, x: 211, y: 791, width: 33, height: 6 }),
        Pupil: tx({ id: "Enemy.Suggestive.Pupil", atlas: 0, x: 590, y: 921, width: 2, height: 8 }),
        ScleraWide: tx({ id: "Enemy.Suggestive.ScleraWide", atlas: 0, x: 338, y: 784, width: 14, height: 6 }),
        Sclera: tx({ id: "Enemy.Suggestive.Sclera", atlas: 0, x: 1016, y: 164, width: 8, height: 16 }),
        Torso: tx({ id: "Enemy.Suggestive.Torso", atlas: 0, x: 417, y: 486, width: 86, height: 23 }),
      },
    },
    Esoteric: {
      Decoration: {
        Bandage: tx({ id: "Esoteric.Decoration.Bandage", atlas: 0, x: 393, y: 555, width: 12, height: 26 }),
        PicaxeGiant: tx({ id: "Esoteric.Decoration.PicaxeGiant", atlas: 0, x: 656, y: 699, width: 72, height: 69 }),
        SeedBag: tx({ id: "Esoteric.Decoration.SeedBag", atlas: 0, x: 901, y: 733, width: 32, height: 31 }),
      },
      Message: {
        Farmer: tx({ id: "Esoteric.Message.Farmer", atlas: 0, x: 946, y: 350, width: 74, height: 16 }),
        Miner: tx({ id: "Esoteric.Message.Miner", atlas: 0, x: 671, y: 675, width: 57, height: 15 }),
      },
    },
    Fiber: {
      Cobweb0: tx({ id: "Fiber.Cobweb0", atlas: 0, x: 933, y: 618, width: 30, height: 28 }),
      Cobweb1: tx({ id: "Fiber.Cobweb1", atlas: 0, x: 1001, y: 545, width: 20, height: 28 }),
      RopeFrame: tx({ id: "Fiber.RopeFrame", atlas: 0, x: 845, y: 675, width: 37, height: 28 }),
      StringOnStake0: tx({ id: "Fiber.StringOnStake0", atlas: 0, x: 397, y: 1018, width: 8, height: 6 }),
    },
    Foliage: {
      BranchCut0: tx({ id: "Foliage.BranchCut0", atlas: 0, x: 421, y: 739, width: 24, height: 14 }),
      Bush0: tx({ id: "Foliage.Bush0", atlas: 0, x: 976, y: 490, width: 44, height: 24 }),
      Flower14: tx({ id: "Foliage.Flower14", atlas: 0, x: 956, y: 743, width: 14, height: 8 }),
      Flower18: tx({ id: "Foliage.Flower18", atlas: 0, x: 389, y: 872, width: 18, height: 10 }),
      Flower22: tx({ id: "Foliage.Flower22", atlas: 0, x: 788, y: 1007, width: 22, height: 16 }),
      Leaf16: tx({ id: "Foliage.Leaf16", atlas: 0, x: 903, y: 798, width: 16, height: 16 }),
      Leaf36: tx({ id: "Foliage.Leaf36", atlas: 0, x: 837, y: 866, width: 36, height: 22 }),
      LeavesMedium0: tx({ id: "Foliage.LeavesMedium0", atlas: 0, x: 982, y: 207, width: 42, height: 60 }),
      Medium0: tx({ id: "Foliage.Medium0", atlas: 0, x: 918, y: 662, width: 26, height: 31 }),
      Moss0: tx({ id: "Foliage.Moss0", atlas: 0, x: 976, y: 779, width: 16, height: 18 }),
      MossHanging0: tx({ id: "Foliage.MossHanging0", atlas: 0, x: 997, y: 367, width: 24, height: 44 }),
      RootMedium0: tx({ id: "Foliage.RootMedium0", atlas: 0, x: 976, y: 431, width: 48, height: 19 }),
      Small: tx({ id: "Foliage.Small", atlas: 0, x: 581, y: 718, width: 11, height: 17 }),
      Stem16: tx({ id: "Foliage.Stem16", atlas: 0, x: 972, y: 655, width: 14, height: 16 }),
      TallRoundRed: tx({ id: "Foliage.TallRoundRed", atlas: 0, x: 946, y: 261, width: 35, height: 88 }),
      TreeRingExposed: tx({ id: "Foliage.TreeRingExposed", atlas: 0, x: 976, y: 451, width: 48, height: 22 }),
      Vine0: tx({ id: "Foliage.Vine0", atlas: 0, x: 938, y: 294, width: 6, height: 33 }),
      Vine1: tx({ id: "Foliage.Vine1", atlas: 0, x: 1009, y: 801, width: 14, height: 15 }),
    },
    Font: {
      Diggit: tx({ id: "Font.Diggit", atlas: 0, x: 161, y: 922, width: 54, height: 8 }),
      ErotixLight: tx({ id: "Font.ErotixLight", atlas: 0, x: 0, y: 861, width: 160, height: 34 }),
      Erotix: tx({ id: "Font.Erotix", atlas: 0, x: 0, y: 896, width: 160, height: 34 }),
      Flaccid: tx({ id: "Font.Flaccid", atlas: 0, x: 300, y: 884, width: 102, height: 24 }),
      GoodBoy: tx({ id: "Font.GoodBoy", atlas: 0, x: 0, y: 582, width: 256, height: 128 }),
    },
    Furniture: {
      Aquarium: {
        Box76x46: tx({ id: "Furniture.Aquarium.Box76x46", atlas: 0, x: 593, y: 784, width: 76, height: 46 }),
        Coral: tx({ id: "Furniture.Aquarium.Coral", atlas: 0, x: 993, y: 622, width: 28, height: 26 }),
        Fish: tx({ id: "Furniture.Aquarium.Fish", atlas: 0, x: 340, y: 697, width: 110, height: 22 }),
        Sand: tx({ id: "Furniture.Aquarium.Sand", atlas: 0, x: 656, y: 769, width: 72, height: 14 }),
        WaterIntake: tx({ id: "Furniture.Aquarium.WaterIntake", atlas: 0, x: 768, y: 857, width: 22, height: 14 }),
      },
      Artwork: {
        Poster0: tx({ id: "Furniture.Artwork.Poster0", atlas: 0, x: 165, y: 798, width: 128, height: 58 }),
        Statue0: tx({ id: "Furniture.Artwork.Statue0", atlas: 0, x: 419, y: 779, width: 82, height: 104 }),
        Statue1: tx({ id: "Furniture.Artwork.Statue1", atlas: 0, x: 593, y: 921, width: 66, height: 82 }),
        Statue2: tx({ id: "Furniture.Artwork.Statue2", atlas: 0, x: 408, y: 595, width: 100, height: 60 }),
        Statue3: tx({ id: "Furniture.Artwork.Statue3", atlas: 0, x: 593, y: 705, width: 62, height: 78 }),
      },
      ChainMetal: tx({ id: "Furniture.ChainMetal", atlas: 0, x: 729, y: 724, width: 12, height: 56 }),
      Chandelier: tx({ id: "Furniture.Chandelier", atlas: 0, x: 294, y: 791, width: 124, height: 36 }),
      Doll0: tx({ id: "Furniture.Doll0", atlas: 0, x: 964, y: 595, width: 28, height: 30 }),
      Lamp0: tx({ id: "Furniture.Lamp0", atlas: 0, x: 964, y: 626, width: 22, height: 28 }),
      Library: {
        Books0: tx({ id: "Furniture.Library.Books0", atlas: 0, x: 405, y: 849, width: 12, height: 14 }),
        Books1: tx({ id: "Furniture.Library.Books1", atlas: 0, x: 848, y: 738, width: 16, height: 12 }),
        Books2: tx({ id: "Furniture.Library.Books2", atlas: 0, x: 582, y: 634, width: 14, height: 16 }),
      },
      PotionGreen: tx({ id: "Furniture.PotionGreen", atlas: 0, x: 965, y: 207, width: 16, height: 22 }),
      PotionRed: tx({ id: "Furniture.PotionRed", atlas: 0, x: 965, y: 230, width: 16, height: 22 }),
      Pottery18: tx({ id: "Furniture.Pottery18", atlas: 0, x: 955, y: 794, width: 18, height: 18 }),
      StoneShelfUgly: tx({ id: "Furniture.StoneShelfUgly", atlas: 0, x: 598, y: 595, width: 52, height: 78 }),
      Table0: tx({ id: "Furniture.Table0", atlas: 0, x: 729, y: 876, width: 62, height: 22 }),
      WateringCan: tx({ id: "Furniture.WateringCan", atlas: 0, x: 866, y: 738, width: 34, height: 22 }),
    },
    Iguana: {
      Boiled: {
        Club: tx({ id: "Iguana.Boiled.Club", atlas: 0, x: 656, y: 901, width: 72, height: 18 }),
        Crest: tx({ id: "Iguana.Boiled.Crest", atlas: 0, x: 832, y: 545, width: 168, height: 24 }),
        Eye: tx({ id: "Iguana.Boiled.Eye", atlas: 0, x: 935, y: 802, width: 12, height: 12 }),
        Foot: tx({ id: "Iguana.Boiled.Foot", atlas: 0, x: 673, y: 370, width: 210, height: 18 }),
        Head: tx({ id: "Iguana.Boiled.Head", atlas: 0, x: 972, y: 699, width: 27, height: 27 }),
        Horn: tx({ id: "Iguana.Boiled.Horn", atlas: 0, x: 593, y: 1004, width: 72, height: 12 }),
        Mouth: tx({ id: "Iguana.Boiled.Mouth", atlas: 0, x: 143, y: 1010, width: 108, height: 12 }),
        Nails: tx({ id: "Iguana.Boiled.Nails", atlas: 0, x: 449, y: 769, width: 45, height: 9 }),
        Pupil: tx({ id: "Iguana.Boiled.Pupil", atlas: 0, x: 841, y: 182, width: 144, height: 12 }),
        Tail: tx({ id: "Iguana.Boiled.Tail", atlas: 0, x: 0, y: 711, width: 210, height: 33 }),
        Torso: tx({ id: "Iguana.Boiled.Torso", atlas: 0, x: 832, y: 595, width: 36, height: 36 }),
      },
      Club: tx({ id: "Iguana.Club", atlas: 0, x: 509, y: 634, width: 72, height: 18 }),
      Crest: tx({ id: "Iguana.Crest", atlas: 0, x: 832, y: 570, width: 168, height: 24 }),
      Eye: tx({ id: "Iguana.Eye", atlas: 0, x: 948, y: 813, width: 12, height: 12 }),
      Foot: tx({ id: "Iguana.Foot", atlas: 0, x: 0, y: 745, width: 210, height: 18 }),
      Head: tx({ id: "Iguana.Head", atlas: 0, x: 943, y: 715, width: 27, height: 27 }),
      Horn: tx({ id: "Iguana.Horn", atlas: 0, x: 671, y: 662, width: 72, height: 12 }),
      Mouth: tx({ id: "Iguana.Mouth", atlas: 0, x: 397, y: 1004, width: 108, height: 12 }),
      Nails: tx({ id: "Iguana.Nails", atlas: 0, x: 422, y: 994, width: 45, height: 9 }),
      Pupil: tx({ id: "Iguana.Pupil", atlas: 0, x: 865, y: 82, width: 144, height: 12 }),
      Tail: tx({ id: "Iguana.Tail", atlas: 0, x: 0, y: 764, width: 210, height: 33 }),
      Torso: tx({ id: "Iguana.Torso", atlas: 0, x: 861, y: 632, width: 36, height: 36 }),
    },
    Light: {
      AuraIrregular40: tx({ id: "Light.AuraIrregular40", atlas: 0, x: 792, y: 847, width: 44, height: 42 }),
      ShadowIguana: tx({ id: "Light.ShadowIguana", atlas: 0, x: 976, y: 474, width: 48, height: 10 }),
      ShadowIrregularSmallRound: tx({ id: "Light.ShadowIrregularSmallRound", atlas: 0, x: 961, y: 813, width: 12, height: 10 }),
      ShadowIrregularSmall: tx({ id: "Light.ShadowIrregularSmall", atlas: 0, x: 70, y: 1016, width: 16, height: 8 }),
      ShadowMessy0: tx({ id: "Light.ShadowMessy0", atlas: 0, x: 422, y: 963, width: 58, height: 12 }),
    },
    Placeholder: tx({ id: "Placeholder", atlas: 0, x: 1009, y: 817, width: 14, height: 14 }),
    Shapes: {
      Arc24: tx({ id: "Shapes.Arc24", atlas: 0, x: 875, y: 733, width: 24, height: 4 }),
      ArcFilledIrregular90: tx({ id: "Shapes.ArcFilledIrregular90", atlas: 0, x: 494, y: 884, width: 90, height: 92 }),
      CircleIrregular72: tx({ id: "Shapes.CircleIrregular72", atlas: 0, x: 660, y: 920, width: 72, height: 72 }),
      Circle64: tx({ id: "Shapes.Circle64", atlas: 0, x: 730, y: 595, width: 64, height: 64 }),
      Confetti45deg: tx({ id: "Shapes.Confetti45deg", atlas: 0, x: 971, y: 727, width: 26, height: 26 }),
      Confetti18x8: tx({ id: "Shapes.Confetti18x8", atlas: 0, x: 257, y: 922, width: 18, height: 8 }),
      Confetti32: tx({ id: "Shapes.Confetti32", atlas: 0, x: 910, y: 700, width: 32, height: 32 }),
      DashedLine3px: tx({ id: "Shapes.DashedLine3px", atlas: 0, x: 1013, y: 0, width: 6, height: 98 }),
      DashedLineArc3px: tx({ id: "Shapes.DashedLineArc3px", atlas: 0, x: 731, y: 781, width: 52, height: 46 }),
      DitherSquare16: tx({ id: "Shapes.DitherSquare16", atlas: 0, x: 992, y: 801, width: 16, height: 16 }),
      LineVertical16: tx({ id: "Shapes.LineVertical16", atlas: 0, x: 784, y: 800, width: 1, height: 16 }),
      Quad22deg0: tx({ id: "Shapes.Quad22deg0", atlas: 0, x: 143, y: 931, width: 140, height: 78 }),
      Rectangle6: tx({ id: "Shapes.Rectangle6", atlas: 0, x: 165, y: 857, width: 6, height: 3 }),
      RightTriangle24px: tx({ id: "Shapes.RightTriangle24px", atlas: 0, x: 1000, y: 699, width: 24, height: 22 }),
      SquareIrregular10: tx({ id: "Shapes.SquareIrregular10", atlas: 0, x: 986, y: 393, width: 10, height: 10 }),
      Square32: tx({ id: "Shapes.Square32", atlas: 0, x: 901, y: 765, width: 32, height: 32 }),
      X10: tx({ id: "Shapes.X10", atlas: 0, x: 408, y: 864, width: 10, height: 10 }),
      X22: tx({ id: "Shapes.X22", atlas: 0, x: 811, y: 1007, width: 22, height: 16 }),
      Zigzag14: tx({ id: "Shapes.Zigzag14", atlas: 0, x: 87, y: 1016, width: 14, height: 8 }),
    },
    Sky: {
      CloudBalls0: tx({ id: "Sky.CloudBalls0", atlas: 0, x: 0, y: 798, width: 164, height: 62 }),
      CloudBalls1: tx({ id: "Sky.CloudBalls1", atlas: 0, x: 211, y: 711, width: 128, height: 42 }),
      CloudStrokeThick0: tx({ id: "Sky.CloudStrokeThick0", atlas: 0, x: 417, y: 518, width: 414, height: 76 }),
      CloudStrokeThick1: tx({ id: "Sky.CloudStrokeThick1", atlas: 0, x: 651, y: 595, width: 78, height: 66 }),
      Cloud0: tx({ id: "Sky.Cloud0", atlas: 0, x: 681, y: 207, width: 283, height: 53 }),
    },
    Stone: {
      BrickLump0: tx({ id: "Stone.BrickLump0", atlas: 0, x: 526, y: 705, width: 66, height: 12 }),
      BrickMedium0: tx({ id: "Stone.BrickMedium0", atlas: 0, x: 733, y: 899, width: 62, height: 50 }),
      BrickSingle0: tx({ id: "Stone.BrickSingle0", atlas: 0, x: 451, y: 693, width: 16, height: 10 }),
      RockLargeShaded: tx({ id: "Stone.RockLargeShaded", atlas: 0, x: 742, y: 753, width: 38, height: 26 }),
      RockSmallShaded1: tx({ id: "Stone.RockSmallShaded1", atlas: 0, x: 245, y: 791, width: 7, height: 6 }),
      Rock0: tx({ id: "Stone.Rock0", atlas: 0, x: 1000, y: 722, width: 24, height: 15 }),
      Salt68px: tx({ id: "Stone.Salt68px", atlas: 0, x: 666, y: 1004, width: 68, height: 18 }),
      Salt90px: tx({ id: "Stone.Salt90px", atlas: 0, x: 403, y: 884, width: 90, height: 24 }),
      ShinyRock0: tx({ id: "Stone.ShinyRock0", atlas: 0, x: 875, y: 704, width: 34, height: 28 }),
      ShinyRock1: tx({ id: "Stone.ShinyRock1", atlas: 0, x: 998, y: 738, width: 24, height: 18 }),
      ShinyRockWall0: tx({ id: "Stone.ShinyRockWall0", atlas: 0, x: 502, y: 834, width: 78, height: 48 }),
    },
    Terrain: {
      Earth: {
        Asterisk: tx({ id: "Terrain.Earth.Asterisk", atlas: 0, x: 934, y: 743, width: 21, height: 24 }),
        Crack8px12px: tx({ id: "Terrain.Earth.Crack8px12px", atlas: 0, x: 408, y: 582, width: 8, height: 12 }),
        Crack28px38px: tx({ id: "Terrain.Earth.Crack28px38px", atlas: 0, x: 795, y: 636, width: 28, height: 38 }),
        CrackSmall0: tx({ id: "Terrain.Earth.CrackSmall0", atlas: 0, x: 582, y: 651, width: 8, height: 4 }),
        ExposedDirt: tx({ id: "Terrain.Earth.ExposedDirt", atlas: 0, x: 340, y: 739, width: 80, height: 14 }),
        Loop: tx({ id: "Terrain.Earth.Loop", atlas: 0, x: 974, y: 798, width: 17, height: 18 }),
        Mass0: tx({ id: "Terrain.Earth.Mass0", atlas: 0, x: 284, y: 922, width: 137, height: 81 }),
        QuestionMarkStencil0: tx({ id: "Terrain.Earth.QuestionMarkStencil0", atlas: 0, x: 834, y: 1007, width: 22, height: 14 }),
        QuestionMark: tx({ id: "Terrain.Earth.QuestionMark", atlas: 0, x: 1006, y: 182, width: 18, height: 24 }),
        Scribble0: tx({ id: "Terrain.Earth.Scribble0", atlas: 0, x: 408, y: 656, width: 94, height: 36 }),
        Smooth: tx({ id: "Terrain.Earth.Smooth", atlas: 0, x: 300, y: 872, width: 88, height: 10 }),
        Spots: tx({ id: "Terrain.Earth.Spots", atlas: 0, x: 506, y: 994, width: 86, height: 23 }),
        V: tx({ id: "Terrain.Earth.V", atlas: 0, x: 934, y: 768, width: 20, height: 18 }),
        ValuableBlue0: tx({ id: "Terrain.Earth.ValuableBlue0", atlas: 0, x: 956, y: 754, width: 20, height: 24 }),
        ValuableRed0: tx({ id: "Terrain.Earth.ValuableRed0", atlas: 0, x: 955, y: 779, width: 20, height: 14 }),
        Zigzag0: tx({ id: "Terrain.Earth.Zigzag0", atlas: 0, x: 451, y: 705, width: 74, height: 14 }),
      },
      Grass: {
        Jagged2px: tx({ id: "Terrain.Grass.Jagged2px", atlas: 0, x: 0, y: 1016, width: 42, height: 8 }),
        Jagged: tx({ id: "Terrain.Grass.Jagged", atlas: 0, x: 257, y: 697, width: 75, height: 13 }),
        Loops: tx({ id: "Terrain.Grass.Loops", atlas: 0, x: 660, y: 993, width: 72, height: 10 }),
        Shape1: tx({ id: "Terrain.Grass.Shape1", atlas: 0, x: 216, y: 922, width: 40, height: 8 }),
        Sparse3px1: tx({ id: "Terrain.Grass.Sparse3px1", atlas: 0, x: 338, y: 779, width: 80, height: 4 }),
        Sparse3px: tx({ id: "Terrain.Grass.Sparse3px", atlas: 0, x: 976, y: 485, width: 48, height: 4 }),
        Tall3px: tx({ id: "Terrain.Grass.Tall3px", atlas: 0, x: 733, y: 857, width: 34, height: 18 }),
      },
      Pipe: {
        Gray: tx({ id: "Terrain.Pipe.Gray", atlas: 0, x: 422, y: 949, width: 64, height: 13 }),
      },
    },
    Town: {
      Ball: {
        Ball0: tx({ id: "Town.Ball.Ball0", atlas: 0, x: 974, y: 817, width: 12, height: 12 }),
        Ball1: tx({ id: "Town.Ball.Ball1", atlas: 0, x: 920, y: 802, width: 14, height: 12 }),
        Brick0: tx({ id: "Town.Ball.Brick0", atlas: 0, x: 866, y: 800, width: 36, height: 30 }),
        Brick1: tx({ id: "Town.Ball.Brick1", atlas: 0, x: 869, y: 595, width: 36, height: 20 }),
        ColumnSpiral0: tx({ id: "Town.Ball.ColumnSpiral0", atlas: 0, x: 405, y: 828, width: 12, height: 20 }),
        Dice: tx({ id: "Town.Ball.Dice", atlas: 0, x: 651, y: 662, width: 10, height: 10 }),
        FishmongerBombDefused: tx({ id: "Town.Ball.FishmongerBombDefused", atlas: 0, x: 733, y: 828, width: 52, height: 28 }),
        FishmongerBomb: tx({ id: "Town.Ball.FishmongerBomb", atlas: 0, x: 742, y: 724, width: 52, height: 28 }),
        Frame: tx({ id: "Town.Ball.Frame", atlas: 0, x: 794, y: 950, width: 50, height: 56 }),
        IdolBase: tx({ id: "Town.Ball.IdolBase", atlas: 0, x: 656, y: 831, width: 76, height: 44 }),
        IdolHead: tx({ id: "Town.Ball.IdolHead", atlas: 0, x: 503, y: 656, width: 94, height: 48 }),
        StructureHighlight: tx({ id: "Town.Ball.StructureHighlight", atlas: 0, x: 833, y: 890, width: 40, height: 40 }),
        StructureSmall: tx({ id: "Town.Ball.StructureSmall", atlas: 0, x: 502, y: 769, width: 90, height: 64 }),
        Structure: tx({ id: "Town.Ball.Structure", atlas: 0, x: 257, y: 582, width: 150, height: 114 }),
        Symbols: {
          Circle: tx({ id: "Town.Ball.Symbols.Circle", atlas: 0, x: 987, y: 649, width: 28, height: 28 }),
          P: tx({ id: "Town.Ball.Symbols.P", atlas: 0, x: 945, y: 655, width: 26, height: 28 }),
          Square: tx({ id: "Town.Ball.Symbols.Square", atlas: 0, x: 883, y: 669, width: 34, height: 30 }),
          Star: tx({ id: "Town.Ball.Symbols.Star", atlas: 0, x: 837, y: 835, width: 40, height: 30 }),
        },
        TheSecretShop: tx({ id: "Town.Ball.TheSecretShop", atlas: 0, x: 161, y: 861, width: 138, height: 60 }),
      },
      Colossus: {
        Eyebrow0: tx({ id: "Town.Colossus.Eyebrow0", atlas: 0, x: 43, y: 1016, width: 26, height: 8 }),
        Eyebrow1: tx({ id: "Town.Colossus.Eyebrow1", atlas: 0, x: 252, y: 1010, width: 26, height: 14 }),
        Eyelid0: tx({ id: "Town.Colossus.Eyelid0", atlas: 0, x: 934, y: 787, width: 20, height: 14 }),
        Mouth0: tx({ id: "Town.Colossus.Mouth0", atlas: 0, x: 986, y: 412, width: 36, height: 8 }),
        Mouth1: tx({ id: "Town.Colossus.Mouth1", atlas: 0, x: 300, y: 853, width: 104, height: 18 }),
        Mouth2: tx({ id: "Town.Colossus.Mouth2", atlas: 0, x: 744, y: 660, width: 50, height: 14 }),
        Noggin0: tx({ id: "Town.Colossus.Noggin0", atlas: 0, x: 509, y: 595, width: 84, height: 38 }),
        Nose0: tx({ id: "Town.Colossus.Nose0", atlas: 0, x: 904, y: 618, width: 18, height: 12 }),
        Pupil0: tx({ id: "Town.Colossus.Pupil0", atlas: 0, x: 1016, y: 649, width: 8, height: 16 }),
        Pupil1: tx({ id: "Town.Colossus.Pupil1", atlas: 0, x: 869, y: 616, width: 34, height: 14 }),
        Pupil2: tx({ id: "Town.Colossus.Pupil2", atlas: 0, x: 961, y: 824, width: 12, height: 12 }),
        Sclera0: tx({ id: "Town.Colossus.Sclera0", atlas: 0, x: 977, y: 754, width: 18, height: 24 }),
        Sclera1: tx({ id: "Town.Colossus.Sclera1", atlas: 0, x: 670, y: 784, width: 60, height: 36 }),
        Sclera2: tx({ id: "Town.Colossus.Sclera2", atlas: 0, x: 795, y: 595, width: 36, height: 40 }),
        Tooth0: tx({ id: "Town.Colossus.Tooth0", atlas: 0, x: 1008, y: 51, width: 4, height: 18 }),
      },
      Monument: {
        Lazarus: tx({ id: "Town.Monument.Lazarus", atlas: 0, x: 796, y: 890, width: 36, height: 42 }),
        Weirdo: tx({ id: "Town.Monument.Weirdo", atlas: 0, x: 585, y: 834, width: 70, height: 86 }),
      },
      Signage: {
        Board0: tx({ id: "Town.Signage.Board0", atlas: 0, x: 422, y: 922, width: 66, height: 26 }),
        Casino1px: tx({ id: "Town.Signage.Casino1px", atlas: 0, x: 513, y: 977, width: 76, height: 16 }),
        Casino2px: tx({ id: "Town.Signage.Casino2px", atlas: 0, x: 422, y: 977, width: 90, height: 16 }),
        Casino3px: tx({ id: "Town.Signage.Casino3px", atlas: 0, x: 340, y: 720, width: 108, height: 18 }),
        Welcome0: tx({ id: "Town.Signage.Welcome0", atlas: 0, x: 733, y: 981, width: 58, height: 18 }),
      },
      Underneath: {
        HeliumCreator: tx({ id: "Town.Underneath.HeliumCreator", atlas: 0, x: 824, y: 636, width: 36, height: 38 }),
        HeliumPipe: tx({ id: "Town.Underneath.HeliumPipe", atlas: 0, x: 819, y: 752, width: 46, height: 30 }),
        HeliumTank: tx({ id: "Town.Underneath.HeliumTank", atlas: 0, x: 821, y: 800, width: 44, height: 34 }),
        OpenIndicator: tx({ id: "Town.Underneath.OpenIndicator", atlas: 0, x: 673, y: 389, width: 16, height: 6 }),
        RiserFaceHappy: tx({ id: "Town.Underneath.RiserFaceHappy", atlas: 0, x: 866, y: 761, width: 28, height: 20 }),
        RiserFaceSurprise: tx({ id: "Town.Underneath.RiserFaceSurprise", atlas: 0, x: 972, y: 678, width: 28, height: 20 }),
        RiserFace: tx({ id: "Town.Underneath.RiserFace", atlas: 0, x: 943, y: 694, width: 28, height: 20 }),
      },
    },
    Ui: {
      Checkbox: tx({ id: "Ui.Checkbox", atlas: 0, x: 733, y: 950, width: 60, height: 30 }),
      ChooseYourLooksIcons: tx({ id: "Ui.ChooseYourLooksIcons", atlas: 0, x: 0, y: 51, width: 930, height: 30 }),
      Dialog: {
        QuestionOption: tx({ id: "Ui.Dialog.QuestionOption", atlas: 0, x: 681, y: 294, width: 256, height: 44 }),
        SpeakBox: tx({ id: "Ui.Dialog.SpeakBox", atlas: 0, x: 0, y: 99, width: 840, height: 96 }),
      },
      Experience: {
        IncrementBg: tx({ id: "Ui.Experience.IncrementBg", atlas: 0, x: 832, y: 518, width: 188, height: 26 }),
        Increment: tx({ id: "Ui.Experience.Increment", atlas: 0, x: 681, y: 261, width: 264, height: 32 }),
      },
      HorizontalBar9: tx({ id: "Ui.HorizontalBar9", atlas: 0, x: 505, y: 421, width: 500, height: 9 }),
      InteractionIndicator: tx({ id: "Ui.InteractionIndicator", atlas: 0, x: 996, y: 778, width: 22, height: 22 }),
      NoneChoice: tx({ id: "Ui.NoneChoice", atlas: 0, x: 1016, y: 666, width: 8, height: 8 }),
      OwnerDefeat: tx({ id: "Ui.OwnerDefeat", atlas: 0, x: 829, y: 933, width: 30, height: 16 }),
      PlacementReticle: tx({ id: "Ui.PlacementReticle", atlas: 0, x: 333, y: 697, width: 6, height: 6 }),
      Pocket: {
        CollectNotification: tx({ id: "Ui.Pocket.CollectNotification", atlas: 0, x: 931, y: 51, width: 76, height: 24 }),
        OpenablePocket: tx({ id: "Ui.Pocket.OpenablePocket", atlas: 0, x: 729, y: 675, width: 64, height: 48 }),
      },
    },
    Wood: {
      Bookshelf0: tx({ id: "Wood.Bookshelf0", atlas: 0, x: 982, y: 268, width: 34, height: 56 }),
      Crate0: tx({ id: "Wood.Crate0", atlas: 0, x: 898, y: 631, width: 34, height: 30 }),
      MeasuringStick: tx({ id: "Wood.MeasuringStick", atlas: 0, x: 1016, y: 99, width: 8, height: 64 }),
      SignGiant0: tx({ id: "Wood.SignGiant0", atlas: 0, x: 0, y: 931, width: 142, height: 84 }),
      Sign: tx({ id: "Wood.Sign", atlas: 0, x: 794, y: 675, width: 50, height: 29 }),
      Stake: tx({ id: "Wood.Stake", atlas: 0, x: 408, y: 555, width: 8, height: 26 }),
    },
  };
}

export const GeneratedTextureData = {
  atlases,
  txs,
};
