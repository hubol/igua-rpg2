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
      "iguana/speak0.ogg",
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
    Iguana: {
      Speak0: sounds[8],
    },
    Impact: {
      BouncingEnemyLand: sounds[9],
      DefeatEnemy: sounds[10],
      PickaxeRock: sounds[11],
      PocketableItemBounceHard: sounds[12],
      PocketableItemBounceMedium: sounds[13],
      PocketableItemBounceSoft: sounds[14],
      PocketableItemFree: sounds[15],
      SpikedCanonballLand: sounds[16],
      VsEnemyPhysical0: sounds[17],
      VsEnemyPhysical1: sounds[18],
      VsEnemyPhysical2: sounds[19],
      VsPlayerPhysical: sounds[20],
    },
    Interact: {
      DoorOpen0: sounds[21],
      DoorOpen1: sounds[22],
      SignRead: sounds[23],
    },
    Terrain: {
      EarthStep0: sounds[24],
      EarthStep1: sounds[25],
      EarthStep2: sounds[26],
      EarthStep3: sounds[27],
      MetalStep0: sounds[28],
      MetalStep1: sounds[29],
      MetalStep2: sounds[30],
      MetalStep3: sounds[31],
    },
    Ui: {
      Looks: {
        Updated: sounds[32],
      },
      NavigateBack: sounds[33],
      NavigateInto: sounds[34],
      Select: sounds[35],
    },
  };
}

export const GeneratedSfxData = {
  sfxs,
};
