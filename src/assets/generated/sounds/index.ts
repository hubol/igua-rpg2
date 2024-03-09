// This file is generated

async function sfxs<T>(sfx: (ogg: string) => Promise<T>) {
  const sounds = await Promise.all(
    [
      "pork roll egg and cheese.ogg",
      "beep tiny.ogg",
      "ballon pop.ogg",
      "ball bounce.ogg",
      "arrow knock.ogg",
      "activate lever.ogg",
      "folder/cast spell hit.ogg",
    ].map(sfx),
  );
  return {
    PorkRollEggAndCheese: sounds[0],
    BeepTiny: sounds[1],
    BallonPop: sounds[2],
    BallBounce: sounds[3],
    ArrowKnock: sounds[4],
    ActivateLever: sounds[5],
    Folder: {
      CastSpellHit: sounds[6],
    },
  };
}

export const GeneratedSfxData = {
  sfxs,
};
