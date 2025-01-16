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
      "fluid/slurp.ogg",
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
      Slurp: sounds[6],
      SplashSmall: sounds[7],
      SplashTiny: sounds[8],
    },
    Iguana: {
      Speak0: sounds[9],
    },
    Impact: {
      BouncingEnemyLand: sounds[10],
      DefeatEnemy: sounds[11],
      PickaxeRock: sounds[12],
      PocketableItemBounceHard: sounds[13],
      PocketableItemBounceMedium: sounds[14],
      PocketableItemBounceSoft: sounds[15],
      PocketableItemFree: sounds[16],
      SpikedCanonballLand: sounds[17],
      VsEnemyPhysical0: sounds[18],
      VsEnemyPhysical1: sounds[19],
      VsEnemyPhysical2: sounds[20],
      VsPlayerPhysical: sounds[21],
    },
    Interact: {
      DoorOpen0: sounds[22],
      DoorOpen1: sounds[23],
      SignRead: sounds[24],
    },
    Terrain: {
      EarthStep0: sounds[25],
      EarthStep1: sounds[26],
      EarthStep2: sounds[27],
      EarthStep3: sounds[28],
      MetalStep0: sounds[29],
      MetalStep1: sounds[30],
      MetalStep2: sounds[31],
      MetalStep3: sounds[32],
    },
    Ui: {
      Looks: {
        Updated: sounds[33],
      },
      NavigateBack: sounds[34],
      NavigateInto: sounds[35],
      Select: sounds[36],
    },
  };
}

export const GeneratedSfxData = {
  sfxs,
};
