import { Container } from "pixi.js";
import { objText } from "../../assets/fonts";
import { Lvl } from "../../assets/generated/levels/generated-level-data";
import { ZIndex } from "../core/scene/z-index";
import { scene } from "../globals";
import { mxnBoilPivot } from "../mixins/mxn-boil-pivot";
import { mxnHudModifiers } from "../mixins/mxn-hud-modifiers";
import { MxnSpeaker } from "../mixins/mxn-speaker";
import { RpgSaveFiles } from "../rpg/rpg-save-files";

export function scnMenuTitleScreen() {
    const lvl = Lvl.MenuTitleScreen();

    const checkedSaveFiles = RpgSaveFiles.check();

    scene.stage
        .mixin(mxnHudModifiers.mxnHideExperience)
        .mixin(mxnHudModifiers.mxnHideStatus);

    [lvl.UiTitleIgua, lvl.UiTitleRpg, lvl.UiTitleTwo, lvl.UiTitleDemo]
        .forEach(obj => obj.mixin(mxnBoilPivot));

    lvl.ContinueDoor
        .mixin(mxnLabeled, "Continue")
        .objDoor.locked = checkedSaveFiles.lastLoadedIndex === null;

    lvl.NewDoor
        .mixin(mxnLabeled, "New");

    lvl.LoadDoor
        .mixin(mxnLabeled, "Load")
        .objDoor.locked = checkedSaveFiles.saveFilesCount < 1;
}

function mxnLabeled(obj: Container & MxnSpeaker, label: string) {
    return obj
        .coro(function* () {
            obj.speaker.name = "\"" + label + "\" " + obj.speaker.name;
            const b = obj.getBounds();

            objText.MediumIrregular(label)
                .anchored(0.5, 1)
                .at(b.getCenter().x + 1, b.y - 1)
                .zIndexed(ZIndex.Entities)
                .show();
        });
}
