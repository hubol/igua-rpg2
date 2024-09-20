// This file is generated

async function sfxs<T>(sfx: (ogg: string) => Promise<T>) {
  const sounds = await Promise.all(
    [
      "activate lever.ogg",
      "arrow knock.ogg",
      "ball bounce.ogg",
      "ballon pop.ogg",
      "beep tiny.ogg",
      "collect/valuable1.ogg",
      "collect/valuable15.ogg",
      "collect/valuable5.ogg",
      "fluid/splash small.ogg",
      "fluid/splash tiny.ogg",
      "folder/cast spell hit.ogg",
      "impact/defeat enemy.ogg",
      "impact/vs enemy physical 0.ogg",
      "impact/vs enemy physical 1.ogg",
      "impact/vs enemy physical 2.ogg",
      "pork roll egg and cheese.ogg",
      "ui/looks/updated.ogg",
      "ui/navigate back.ogg",
      "ui/navigate into.ogg",
      "ui/select.ogg",
    ].map(sfx),
  );
  return {
    ActivateLever: sounds[0],
    ArrowKnock: sounds[1],
    BallBounce: sounds[2],
    BallonPop: sounds[3],
    BeepTiny: sounds[4],
    Collect: {
      Valuable1: sounds[5],
      Valuable15: sounds[6],
      Valuable5: sounds[7],
    },
    Fluid: {
      SplashSmall: sounds[8],
      SplashTiny: sounds[9],
    },
    Folder: {
      CastSpellHit: sounds[10],
    },
    Impact: {
      DefeatEnemy: sounds[11],
      VsEnemyPhysical_0: sounds[12],
      VsEnemyPhysical_1: sounds[13],
      VsEnemyPhysical_2: sounds[14],
    },
    PorkRollEggAndCheese: sounds[15],
    Ui: {
      Looks: {
        Updated: sounds[16],
      },
      NavigateBack: sounds[17],
      NavigateInto: sounds[18],
      Select: sounds[19],
    },
  };
}

export const GeneratedSfxData = {
  sfxs,
};
