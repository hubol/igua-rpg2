import { Lvl, LvlType } from "../../assets/generated/levels/generated-level-data";
import { ForceTintFilter } from "../../lib/pixi/filters/force-tint-filter";

export function scnIndianaUniversity() {
    const lvl = Lvl.IndianaUniversity();
    enrichStudentSilhouettes(lvl);
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
