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
    PorkRollEggAndCheese: sounds[6],
    Ui: {
      Looks: {
        Updated: sounds[7],
      },
      NavigateBack: sounds[8],
      NavigateInto: sounds[9],
      Select: sounds[10],
    },
  };
}

export const GeneratedSfxData = {
  sfxs,
};
