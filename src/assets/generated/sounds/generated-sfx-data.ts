// This file is generated

async function sfxs<T>(sfx: (ogg: string) => Promise<T>) {
  const sounds = await Promise.all(
    [
      "collect/valuable1.ogg",
      "collect/valuable15.ogg",
      "collect/valuable5.ogg",
      "fluid/splash small.ogg",
      "fluid/splash tiny.ogg",
      "impact/bouncing enemy land.ogg",
      "impact/defeat enemy.ogg",
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
    Fluid: {
      SplashSmall: sounds[3],
      SplashTiny: sounds[4],
    },
    Impact: {
      BouncingEnemyLand: sounds[5],
      DefeatEnemy: sounds[6],
      VsEnemyPhysical0: sounds[7],
      VsEnemyPhysical1: sounds[8],
      VsEnemyPhysical2: sounds[9],
      VsPlayerPhysical: sounds[10],
    },
    Interact: {
      DoorOpen0: sounds[11],
      DoorOpen1: sounds[12],
      SignRead: sounds[13],
    },
    Terrain: {
      EarthStep0: sounds[14],
      EarthStep1: sounds[15],
      EarthStep2: sounds[16],
      EarthStep3: sounds[17],
      MetalStep0: sounds[18],
      MetalStep1: sounds[19],
      MetalStep2: sounds[20],
      MetalStep3: sounds[21],
    },
    Ui: {
      Looks: {
        Updated: sounds[22],
      },
      NavigateBack: sounds[23],
      NavigateInto: sounds[24],
      Select: sounds[25],
    },
  };
}

export const GeneratedSfxData = {
  sfxs,
};
