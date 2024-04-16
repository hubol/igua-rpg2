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
      "ui/select.ogg",
      "ui/navigate into.ogg",
      "ui/navigate back.ogg",
      "folder/cast spell hit.ogg",
      "ui/looks/updated.ogg",
    ].map(sfx),
  );
  return {
    PorkRollEggAndCheese: sounds[0],
    BeepTiny: sounds[1],
    BallonPop: sounds[2],
    BallBounce: sounds[3],
    ArrowKnock: sounds[4],
    ActivateLever: sounds[5],
    Ui: {
      Select: sounds[6],
      NavigateInto: sounds[7],
      NavigateBack: sounds[8],
      Looks: {
        Updated: sounds[10],
      },
    },
    Folder: {
      CastSpellHit: sounds[9],
    },
  };
}

export const GeneratedSfxData = {
  sfxs,
};
