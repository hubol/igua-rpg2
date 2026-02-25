import { Lvl, LvlType } from "../../assets/generated/levels/generated-level-data";
import { Mzk } from "../../assets/music";
import { Jukebox } from "../core/igua-audio";
import { DramaClassroom } from "../drama/drama-classroom";
import { show } from "../drama/show";
import { mxnCutscene } from "../mixins/mxn-cutscene";
import { Rpg } from "../rpg/rpg";

export function scnIndianaUniversityInterior() {
    Jukebox.play(Mzk.DespicableMessage);
    const lvl = Lvl.IndianaUniversityInterior();
    enrichDirector(lvl);
}

function enrichDirector(lvl: LvlType.IndianaUniversityInterior) {
    lvl.ClassroomDoor.objDoor.locked = !Rpg.flags.classrooms.approvedForTeachingBy;

    lvl.DirectorNpc.mixin(mxnCutscene, function* () {
        if (!Rpg.flags.classrooms.approvedForTeachingBy) {
            yield* show(
                "I'm the director of the university",
                "The last instructor got mental problems and had to leave.",
                "If you're looking for work, we're hiring. We just need a quick demonstration from you.",
            );

            if (yield* DramaClassroom.teachSingleFact("What do you say, do you know any facts?")) {
                yield* show(
                    "Heh! Well, that's a new one!",
                    "Your pupils await!!!",
                );
                lvl.ClassroomDoor.objDoor.unlock();
                Rpg.flags.classrooms.approvedForTeachingBy = lvl.DirectorNpc.mxnIguanaSpeaker.rpgIguanaNpc.id;
            }
            else {
                yield* show("Well, if you ever do learn a fact, we're hiring!");
            }

            return;
        }

        if (lvl.DirectorNpc.speaker.spokeOnceInCurrentScene) {
            yield* show("Go on then, your pupils await!");
        }
        else {
            yield* show("If you ever learn some new facts, don't forget to share them with your students.");
        }
    });
}
