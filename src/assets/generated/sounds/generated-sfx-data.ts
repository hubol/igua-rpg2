// This file is generated

async function sfxs<T>(sfx: (ogg: string) => Promise<T>) {
  const sounds = await Promise.all(
    [
      "collect/valuable1.ogg",
      "collect/valuable15.ogg",
      "collect/valuable5.ogg",
      "fluid/splash small.ogg",
      "fluid/splash tiny.ogg",
      "impact/defeat enemy.ogg",
      "impact/vs enemy physical 0.ogg",
      "impact/vs enemy physical 1.ogg",
      "impact/vs enemy physical 2.ogg",
      "interact/door open0.ogg",
      "interact/door open1.ogg",
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
      DefeatEnemy: sounds[5],
      VsEnemyPhysical_0: sounds[6],
      VsEnemyPhysical_1: sounds[7],
      VsEnemyPhysical_2: sounds[8],
    },
    Interact: {
      DoorOpen0: sounds[9],
      DoorOpen1: sounds[10],
    },
    Ui: {
      Looks: {
        Updated: sounds[11],
      },
      NavigateBack: sounds[12],
      NavigateInto: sounds[13],
      Select: sounds[14],
    },
  };
}

export const GeneratedSfxData = {
  sfxs,
};
