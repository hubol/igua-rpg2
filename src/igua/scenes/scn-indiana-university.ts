import { Lvl, LvlType } from "../../assets/generated/levels/generated-level-data";
import { Mzk } from "../../assets/music";
import { ForceTintFilter } from "../../lib/pixi/filters/force-tint-filter";
import { Jukebox } from "../core/igua-audio";
import { dramaShop } from "../drama/drama-shop";
import { show } from "../drama/show";
import { mxnCutscene } from "../mixins/mxn-cutscene";
import { Rpg } from "../rpg/rpg";

export function scnIndianaUniversity() {
    Jukebox.play(Mzk.DespicableMessage);
    const lvl = Lvl.IndianaUniversity();
    enrichStudentSilhouettes(lvl);
    enrichRunningWater(lvl);
    enrichSocialTeacher(lvl);
}

function enrichStudentSilhouettes(lvl: LvlType.IndianaUniversity) {
    const windowObjs = [lvl.Window0, lvl.Window1, lvl.Window2, lvl.Window3];
    const npcObjs = [lvl.StudentNpc0, lvl.StudentNpc1, lvl.StudentNpc2, lvl.StudentNpc3];

    npcObjs.forEach((obj, i) =>
        obj
            .filtered(new ForceTintFilter(0x406350, 1))
            .masked(windowObjs[i].step(self => self.renderable = true))
            .gravity = 0
    );
}

function enrichRunningWater(lvl: LvlType.IndianaUniversity) {
    if (Rpg.flags.indianaUniversity.isWaterRunning) {
        return;
    }

    lvl.SpigotDripSource.destroy();
    lvl.SpigotPuddle.destroy();
}

function enrichSocialTeacher(lvl: LvlType.IndianaUniversity) {
    const speaker = lvl.SocialTeacherNpc.speaker;

    lvl.SocialTeacherNpc
        .mixin(mxnCutscene, function* () {
            yield* show("Think you have enough social cred to own this stinky key?");
            yield* dramaShop("SocialTeacher", {
                tintPrimary: speaker.tintSecondary,
                tintSecondary: speaker.tintPrimary,
            });
        });
}
