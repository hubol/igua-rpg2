import { Lvl, LvlType } from "../../assets/generated/levels/generated-level-data";
import { Mzk } from "../../assets/music";
import { Jukebox } from "../core/igua-audio";
import { ask, show } from "../drama/show";
import { Cutscene } from "../globals";
import { mxnCutscene } from "../mixins/mxn-cutscene";
import { RpgProgress } from "../rpg/rpg-progress";

export function scnNewBalltownUnderneath() {
    Jukebox.play(Mzk.TrashDay);
    const lvl = Lvl.NewBalltownUnderneath();
    enrichHomeowner(lvl);
}

function enrichHomeowner(lvl: LvlType.NewBalltownUnderneath) {
    if (RpgProgress.flags.underneath.homeowner.hasClearedHouseOfEnemies) {
        lvl.Homeowner.destroy();
        return;
    }

    let receivedPlayerConsent = false;

    const onInteract = lvl.ToHomeownerDoor.interact.onInteract;

    lvl.ToHomeownerDoor.interact.onInteract = () => {
        Cutscene.play(function* () {
            const result = yield* ask(
                "You're going in? I hope it won't make you uncomfy, but is it OK if I lock the door behind you?",
                "Yes",
                "No",
                "I don't understand",
            );

            if (result === 0) {
                yield* show(
                    "Great! I really wanted to make sure that it's okay.",
                    "Besides, it can be fun to get locked in a house!",
                    "...",
                    "Be careful in there. They are firing spikes everywhere. It sucks.",
                );
            }
            else if (result === 1) {
                yield* show("Oh, dang! Yeah, I totally understand. You don't want to get locked in.");
                if (
                    yield* ask(
                        "Would it make you feel better to know that I'll unlock the door after you finish in there?",
                    )
                ) {
                    yield* show("Great to hear :-)", "Good luck in there. You've got this!");
                }
                else {
                    yield* show("Got it, again, totally understand. Let me know if you change your mind.");
                    return;
                }
            }
            else if (result === 2) {
                yield* show(
                    "So basically, there are a bunch of obnoxious angels in my house.",
                    "It would be great if you could remove them, however you see fit!",
                    "But I have trust issues and would prefer if you allow me to lock you in the house until your work is done :-)",
                );

                if (yield* ask("Does that make more sense?")) {
                    if (yield* ask("Awesome! Do you want to go inside, now that you understand?")) {
                        yield* show("Great! Head on in when you are ready.");
                    }
                    else {
                        yield* show("Hey, totally understand. Let me know if you change your mind.");
                        return;
                    }
                }
                else {
                    yield* show("Ah shoot, I'm not sure if I can explain any better than that...");
                    return;
                }
            }

            receivedPlayerConsent = true;
            lvl.ToHomeownerDoor.interact.onInteract = onInteract;
        }, { speaker: lvl.Homeowner, camera: { start: "pan-to-speaker" } });
    };

    lvl.Homeowner.mixin(mxnCutscene, function* () {
        if (receivedPlayerConsent) {
            yield* show("Please enter the door when you are ready.");
            return;
        }
        yield* show("Can you help? They took over my house :-(");
    });
}
