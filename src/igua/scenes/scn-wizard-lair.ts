import { Lvl } from "../../assets/generated/levels/generated-level-data";
import { Mzk } from "../../assets/music";
import { factor, interpvr } from "../../lib/game-engine/routines/interp";
import { sleep } from "../../lib/game-engine/routines/sleep";
import { container } from "../../lib/pixi/container";
import { Jukebox } from "../core/igua-audio";
import { DataPotion } from "../data/data-potion";
import { ask, show } from "../drama/show";
import { Cutscene, scene } from "../globals";
import { mxnSpeaker } from "../mixins/mxn-speaker";
import { playerObj } from "../objects/obj-player";
import { RpgSaveFiles } from "../rpg/rpg-save-files";

export function scnWizardLair() {
    Jukebox.play(Mzk.SodaMachine);
    RpgSaveFiles.Current.save();
    scene.camera.mode = "controlled";
    const lvl = Lvl.WizardLair();

    const landingOptions = [
        { gateObj: lvl.BalltownGate, name: "New Balltown" },
        { gateObj: lvl.CasinoGate, name: "Swamp Casino" },
    ];

    const wizardObj = container()
        .mixin(mxnSpeaker, { name: "Voice of Wizard", colorPrimary: 0x130D2A, colorSecondary: 0x352863 })
        .show();

    scene.stage
        .coro(function* () {
            yield sleep(5000);
            yield Cutscene.play(function* () {
                yield* show(
                    "Oh, hey!",
                    "Happy birthday!",
                    "You're confused. Don't worry. Everything is awesome.",
                    "I have a question for you.",
                    "Say that someone were to eject you from their space station...",
                );

                const result = yield* ask(
                    "Hypothetically, where would you prefer to land?",
                    ...landingOptions.map(option => option.name),
                );

                for (let i = 0; i < landingOptions.length; i++) {
                    if (result !== i) {
                        landingOptions[i].gateObj.destroy();
                    }
                }

                yield* show(
                    "Interesting choice.",
                    "Okay, so, I lied.",
                    "It wasn't hypothetical.",
                    "But don't worry, I have landing gear for you!",
                );
            }, { speaker: wizardObj, camera: { end: "none" } })
                .done;

            yield sleep(500);

            DataPotion.usePotion("Ballon", playerObj);

            yield sleep(1000);

            yield Cutscene.play(function* () {
                yield* show(
                    "Seems good, right?",
                    "OK! Bye-bye now!!!!",
                );
            }, { speaker: wizardObj, camera: { end: "pan_to_player" } })
                .done;

            yield interpvr(lvl.SpaceStationPipe).factor(factor.sine).translate(-80, 0).over(1000);
        });
}
