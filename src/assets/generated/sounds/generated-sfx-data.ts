// This file is generated

async function sfxs<T>(sfx: (ogg: string) => Promise<T>) {
  const sounds = await Promise.all(
    [
      "collect/pocket increase.ogg",
      "collect/pocket reset.ogg",
      "collect/valuable1.ogg",
      "collect/valuable15.ogg",
      "collect/valuable5.ogg",
      "cutscene/fish take.ogg",
      "effect/ballon inflate.ogg",
      "effect/ballon pop.ogg",
      "effect/jump special.ogg",
      "effect/parachute close.ogg",
      "effect/parachute launch.ogg",
      "effect/parachute open.ogg",
      "enemy/suggestive/flick.ogg",
      "fluid/slurp.ogg",
      "fluid/splash small.ogg",
      "fluid/splash tiny.ogg",
      "iguana/rise.ogg",
      "iguana/speak0.ogg",
      "impact/bouncing enemy land.ogg",
      "impact/defeat enemy.ogg",
      "impact/door lock 0.ogg",
      "impact/door lock 1.ogg",
      "impact/pickaxe rock.ogg",
      "impact/pocketable item bounce hard.ogg",
      "impact/pocketable item bounce medium.ogg",
      "impact/pocketable item bounce soft.ogg",
      "impact/pocketable item free.ogg",
      "impact/spiked canonball land.ogg",
      "impact/vs enemy physical 0.ogg",
      "impact/vs enemy physical 1.ogg",
      "impact/vs enemy physical 2.ogg",
      "impact/vs player physical.ogg",
      "interact/bomb armed.ogg",
      "interact/bomb defuse.ogg",
      "interact/bomb explode.ogg",
      "interact/door open0.ogg",
      "interact/door open1.ogg",
      "interact/sign read.ogg",
      "terrain/earth step0.ogg",
      "terrain/earth step1.ogg",
      "terrain/earth step2.ogg",
      "terrain/earth step3.ogg",
      "terrain/metal step0.ogg",
      "terrain/metal step1.ogg",
      "terrain/metal step2.ogg",
      "terrain/metal step3.ogg",
      "ui/looks/updated.ogg",
      "ui/navigate back.ogg",
      "ui/navigate into.ogg",
      "ui/select.ogg",
    ].map(sfx),
  );
  return {
    Collect: {
      PocketIncrease: sounds[0],
      PocketReset: sounds[1],
      Valuable1: sounds[2],
      Valuable15: sounds[3],
      Valuable5: sounds[4],
    },
    Cutscene: {
      FishTake: sounds[5],
    },
    Effect: {
      BallonInflate: sounds[6],
      BallonPop: sounds[7],
      JumpSpecial: sounds[8],
      ParachuteClose: sounds[9],
      ParachuteLaunch: sounds[10],
      ParachuteOpen: sounds[11],
    },
    Enemy: {
      Suggestive: {
        Flick: sounds[12],
      },
    },
    Fluid: {
      Slurp: sounds[13],
      SplashSmall: sounds[14],
      SplashTiny: sounds[15],
    },
    Iguana: {
      Rise: sounds[16],
      Speak0: sounds[17],
    },
    Impact: {
      BouncingEnemyLand: sounds[18],
      DefeatEnemy: sounds[19],
      DoorLock0: sounds[20],
      DoorLock1: sounds[21],
      PickaxeRock: sounds[22],
      PocketableItemBounceHard: sounds[23],
      PocketableItemBounceMedium: sounds[24],
      PocketableItemBounceSoft: sounds[25],
      PocketableItemFree: sounds[26],
      SpikedCanonballLand: sounds[27],
      VsEnemyPhysical0: sounds[28],
      VsEnemyPhysical1: sounds[29],
      VsEnemyPhysical2: sounds[30],
      VsPlayerPhysical: sounds[31],
    },
    Interact: {
      BombArmed: sounds[32],
      BombDefuse: sounds[33],
      BombExplode: sounds[34],
      DoorOpen0: sounds[35],
      DoorOpen1: sounds[36],
      SignRead: sounds[37],
    },
    Terrain: {
      EarthStep0: sounds[38],
      EarthStep1: sounds[39],
      EarthStep2: sounds[40],
      EarthStep3: sounds[41],
      MetalStep0: sounds[42],
      MetalStep1: sounds[43],
      MetalStep2: sounds[44],
      MetalStep3: sounds[45],
    },
    Ui: {
      Looks: {
        Updated: sounds[46],
      },
      NavigateBack: sounds[47],
      NavigateInto: sounds[48],
      Select: sounds[49],
    },
  };
}

export const GeneratedSfxData = {
  sfxs,
};
