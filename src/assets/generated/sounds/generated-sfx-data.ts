// This file is generated

async function sfxs<T>(sfx: (ogg: string) => Promise<T>) {
  const sounds = await Promise.all(
    [
      "collect/valuable1.ogg",
      "collect/valuable15.ogg",
      "collect/valuable5.ogg",
      "enemy/suggestive/flick.ogg",
      "fluid/splash small.ogg",
      "fluid/splash tiny.ogg",
      "impact/bouncing enemy land.ogg",
      "impact/defeat enemy.ogg",
      "impact/pickaxe rock.ogg",
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
      Valuable1: sounds[0],
      Valuable15: sounds[1],
      Valuable5: sounds[2],
    },
    Enemy: {
      Suggestive: {
        Flick: sounds[3],
      },
    },
    Fluid: {
      SplashSmall: sounds[4],
      SplashTiny: sounds[5],
    },
    Impact: {
      BouncingEnemyLand: sounds[6],
      DefeatEnemy: sounds[7],
      PickaxeRock: sounds[8],
      SpikedCanonballLand: sounds[9],
      VsEnemyPhysical0: sounds[10],
      VsEnemyPhysical1: sounds[11],
      VsEnemyPhysical2: sounds[12],
      VsPlayerPhysical: sounds[13],
    },
    Interact: {
      DoorOpen0: sounds[14],
      DoorOpen1: sounds[15],
      SignRead: sounds[16],
    },
    Terrain: {
      EarthStep0: sounds[17],
      EarthStep1: sounds[18],
      EarthStep2: sounds[19],
      EarthStep3: sounds[20],
      MetalStep0: sounds[21],
      MetalStep1: sounds[22],
      MetalStep2: sounds[23],
      MetalStep3: sounds[24],
    },
    Ui: {
      Looks: {
        Updated: sounds[25],
      },
      NavigateBack: sounds[26],
      NavigateInto: sounds[27],
      Select: sounds[28],
    },
  };
}

export const GeneratedSfxData = {
  sfxs,
};
