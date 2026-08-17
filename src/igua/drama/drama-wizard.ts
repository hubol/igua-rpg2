import { Mzk } from "../../assets/music";
import { sleep } from "../../lib/game-engine/routines/sleep";
import { container } from "../../lib/pixi/container";
import { txt } from "../../lib/pixi/txt";
import { Jukebox } from "../core/igua-audio";
import { Cutscene } from "../globals";
import { mxnSpeaker } from "../mixins/mxn-speaker";
import { objFigureInputActionControl } from "../objects/figures/obj-figure-action-control";
import { playerObj } from "../objects/obj-player";
import { show } from "./show";

function objSpeaker() {
    return container()
        .mixin(mxnSpeaker, { name: "Voice of Wizard", tintPrimary: 0x130D2A, tintSecondary: 0x352863 });
}

function* provideSpellEducation() {
    Cutscene.setCurrentSpeaker(objSpeaker().show());

    const previousTrack = Jukebox.currentTrack;

    Jukebox.play(Mzk.SodaMachine);

    // TODO sfx
    yield sleep(1000);

    playerObj.speed.y = -2;

    yield* show(
        "Hmmm... It looks like you've accessed a fragment of my power.",
        "Good work. Maybe I'm getting somewhere with you.",
        txt`In case you were wondering,
${objFigureInputActionControl("CastSpell")} ... Cast Spell`,
        "That's all for now.",
    );

    if (previousTrack) {
        Jukebox.play(previousTrack);
    }
}

export const DramaWizard = {
    objSpeaker,
    provideSpellEducation,
};
