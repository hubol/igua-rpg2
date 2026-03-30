import { Lvl } from "../../assets/generated/levels/generated-level-data";
import { Mzk } from "../../assets/music";
import { Sfx } from "../../assets/sounds";
import { Sound } from "../../lib/game-engine/audio/sound";
import { Coro } from "../../lib/game-engine/routines/coro";
import { sleep } from "../../lib/game-engine/routines/sleep";
import { RgbInt } from "../../lib/math/number-alias-types";
import { IguaAudio, Jukebox } from "../core/igua-audio";
import { ZIndex } from "../core/scene/z-index";
import { DataGift } from "../data/data-gift";
import { DataIdol } from "../data/data-idol";
import { DramaGifts } from "../drama/drama-gifts";
import { ask, show } from "../drama/show";
import { Cutscene } from "../globals";
import { mxnCutscene } from "../mixins/mxn-cutscene";
import { mxnSparkling } from "../mixins/mxn-sparkling";
import { mxnSpeaker } from "../mixins/mxn-speaker";
import { objIdol } from "../objects/obj-idol";
import { Rpg } from "../rpg/rpg";
import { SceneChanger } from "../systems/scene-changer";
import { scnIndianaHallOfDoors } from "./scn-indiana-hall-of-doors";

namespace DataMagicDemo {
    export interface Model {
        idolId: DataIdol.Id;
        name: string;
        tintPrimary: RgbInt;
        tintSecondary: RgbInt;
        giftId: DataGift.Id;
    }

    export const Manifest = {
        fromDoor0: {
            idolId: "Yellow",
            name: "Idol of Wealth",
            tintPrimary: 0xFFB728,
            tintSecondary: 0x993820,
            giftId: "Demo.MagicDoor.0",
        },
        fromDoor1: {
            idolId: "Green",
            name: "Idol of Poison",
            tintPrimary: 0xAACE29,
            tintSecondary: 0x009700,
            giftId: "Demo.MagicDoor.1",
        },
        fromDoor2: {
            idolId: "Blue",
            name: "Idol of Strength",
            tintPrimary: 0x3B97CC,
            tintSecondary: 0x0017CC,
            giftId: "Demo.MagicDoor.2",
        },
        fromDoor3: {
            idolId: "Purple",
            name: "Idol of Luck",
            tintPrimary: 0xC498E0,
            tintSecondary: 0x9042FF,
            giftId: "Demo.MagicDoor.3",
        },
    } satisfies Record<string, Model>;

    export namespace Speech {
        export interface Model {
            text: string;
            sfx: Sound;
        }

        export const List: Model[] = [
            {
                text: `You did it! You used the stinky key on the door!
Now you get to talk to me!
I hope you are having fun in the world of the IguaRPG 2 demo.
I worked pretty hard on it. I think if I gave myself a little more time, there would have been a boss fight here.
That's all for now. Please find the other stinky keys!`,
                sfx: Sfx.Character.DemoIdol.Speech0,
            },
            {
                text: `Hello! Hello!
It's me again, speaking to you through another idol.
The story of IguaRPG 2 is not known right now.
If you remember in IguaRPG 1, there was a Wizard of Emotion at the end of that game.
I think in this game, the world has once again fallen into chaos, and the Wizard of Emotion is trying to fix things.
But he is not doing a great job, as he is spread too thin without the aid of the rest of the council of wizards.
Anyway, thanks for opening the door. I hope you enjoy this shoe.`,
                sfx: Sfx.Character.DemoIdol.Speech1,
            },
            {
                text: `Hi!
Have you tried helping other iguanas in the lounge? Maybe you could post in the itch.io community to schedule meetups or something. I think that would be so silly.
I think in the full release there will be more lounges, possibly some with tiny puzzles that could be solved collaboratively.
Ummm but that is probably a ways off.
Peace and love dude!`,
                sfx: Sfx.Character.DemoIdol.Speech2,
            },
            {
                text: `It's me for the LAST time.
You might remember that at the end of IguaRPG 1, I left a message about how I felt like my dreams were broken. I felt like becoming "successful" from my games was a total delusion.
I think in certain ways, I have walked this back now. I don't know. I switched jobs to something significantly less stressful. It's making me happy. I get to make more stuff now, and see my boyfriend and friends more regularly.
Anyway, if you made it this far, I hope you have enjoyed your time. If you can, it would be cool if you gave me money on itch. But at the very least please share this little strange demo with as many people as you can!
Ok, that is the last shoe for you. See you in the Swamp of Sin!`,
                sfx: Sfx.Character.DemoIdol.Speech3,
            },
        ];
    }
}

export function scnMagicDemo() {
    Jukebox.play(Mzk.SodaMachine);
    IguaAudio.sfxDelayFeedback = 0.2;
    const lvl = Lvl.MagicDemo();

    const sceneChanger = SceneChanger.create({
        sceneName: scnIndianaHallOfDoors.name,
        checkpointName: "fromMagicDemo",
    })!;

    // @ts-expect-error Fu
    const demo: DataMagicDemo.Model = DataMagicDemo.Manifest[Rpg.character.position.checkpointName];
    if (!demo) {
        Cutscene.play(function* () {
            yield* show("This is a bug (Type A)");
            sceneChanger.changeScene();
        });
        return;
    }

    let isSpiritAdded = false;
    const gift = Rpg.gift(demo.giftId);
    const speech = getSpeech();

    objIdol.objControlled(() => demo.idolId)
        .at(lvl.IdolMarker)
        .mixin(mxnSpeaker, demo)
        .mixin(mxnCutscene, function* () {
            if (gift.isGiven) {
                yield* show("Already added spirit.");
                sceneChanger.changeScene();
                return;
            }

            if (!(yield* ask("Add spirit?"))) {
                return;
            }

            isSpiritAdded = true;

            Jukebox.applyGainRamp(Mzk.SodaMachine, 0.5, 500);
            yield sleep(500);

            if (!speech) {
                yield* show("This is a bug (Type B)");
            }
            else {
                const sfx = speech.sfx.playInstance();
                yield* Coro.race([
                    // Paranoid
                    sleep(42_000),
                    () => sfx.ended,
                ]);
            }

            Jukebox.applyGainRamp(Mzk.SodaMachine, 1, 500);
            yield* DramaGifts.give(demo.giftId);
            yield sleep(1000);
            sceneChanger.changeScene();
        })
        .coro(function* (self) {
            yield () => isSpiritAdded || gift.isGiven;
            const sparklingObj = self.mixin(mxnSparkling);
            sparklingObj.sparklesPerFrame = 0.1;
        })
        .zIndexed(ZIndex.Entities)
        .show();
}

function getSpeech(): DataMagicDemo.Speech.Model | null {
    const givenGiftsCount = Object.values(DataMagicDemo.Manifest)
        .map(model => Rpg.gift(model.giftId).isGiven)
        .reduce((sum, isGiven) => isGiven ? (sum + 1) : sum, 0);

    return DataMagicDemo.Speech.List[givenGiftsCount] ?? null;
}
