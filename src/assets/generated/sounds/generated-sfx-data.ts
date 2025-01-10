// This file is generated

async function sfxs<T>(sfx: (ogg: string) => Promise<T>) {
  const sounds = await Promise.all(
    [
      "collect/pocket increase.ogg",
      "collect/pocket reset.ogg",
      "collect/valuable1.ogg",
      "collect/valuable15.ogg",
      "collect/valuable5.ogg",
      "enemy/suggestive/flick.ogg",
      "fluid/splash small.ogg",
      "fluid/splash tiny.ogg",
      "impact/bouncing enemy land.ogg",
      "impact/defeat enemy.ogg",
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
    Enemy: {
      Suggestive: {
        Flick: sounds[5],
      },
    },
    Fluid: {
      SplashSmall: sounds[6],
      SplashTiny: sounds[7],
    },
    Impact: {
      BouncingEnemyLand: sounds[8],
      DefeatEnemy: sounds[9],
      PickaxeRock: sounds[10],
      PocketableItemBounceHard: sounds[11],
      PocketableItemBounceMedium: sounds[12],
      PocketableItemBounceSoft: sounds[13],
      PocketableItemFree: sounds[14],
      SpikedCanonballLand: sounds[15],
      VsEnemyPhysical0: sounds[16],
      VsEnemyPhysical1: sounds[17],
      VsEnemyPhysical2: sounds[18],
      VsPlayerPhysical: sounds[19],
    },
    Interact: {
      DoorOpen0: sounds[20],
      DoorOpen1: sounds[21],
      SignRead: sounds[22],
    },
    Terrain: {
      EarthStep0: sounds[23],
      EarthStep1: sounds[24],
      EarthStep2: sounds[25],
      EarthStep3: sounds[26],
      MetalStep0: sounds[27],
      MetalStep1: sounds[28],
      MetalStep2: sounds[29],
      MetalStep3: sounds[30],
    },
    Ui: {
      Looks: {
        Updated: sounds[31],
      },
      NavigateBack: sounds[32],
      NavigateInto: sounds[33],
      Select: sounds[34],
    },
  };
}

export const GeneratedSfxData = {
  sfxs,
};
