// This file is generated

async function sfxs<T>(sfx: (ogg: string) => Promise<T>) {
  const sounds = await Promise.all(
    [
      "activate lever.ogg",
      "arrow knock.ogg",
      "ball bounce.ogg",
      "ballon pop.ogg",
      "beep tiny.ogg",
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
    Folder: {
      CastSpellHit: sounds[5],
    },
    Impact: {
      DefeatEnemy: sounds[6],
      VsEnemyPhysical_0: sounds[7],
      VsEnemyPhysical_1: sounds[8],
      VsEnemyPhysical_2: sounds[9],
    },
    PorkRollEggAndCheese: sounds[10],
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
