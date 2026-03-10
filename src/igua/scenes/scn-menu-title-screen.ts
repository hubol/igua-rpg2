import { Container } from "pixi.js";
import { objText } from "../../assets/fonts";
import { Lvl } from "../../assets/generated/levels/generated-level-data";
import { Logger } from "../../lib/game-engine/logger";
import { vnew } from "../../lib/math/vector-type";
import { ZIndex } from "../core/scene/z-index";
import { scene } from "../globals";
import { objIguanaPuppet } from "../iguana/obj-iguana-puppet";
import { mxnBoilPivot } from "../mixins/mxn-boil-pivot";
import { mxnHasHead } from "../mixins/mxn-has-head";
import { mxnHudModifiers } from "../mixins/mxn-hud-modifiers";
import { MxnSpeaker } from "../mixins/mxn-speaker";
import { playerObj } from "../objects/obj-player";
import { StepOrder } from "../objects/step-order";
import { Rpg, setRpgProgressData } from "../rpg/rpg";
import { getInitialRpgProgress } from "../rpg/rpg-progress";
import { RpgSaveFiles } from "../rpg/rpg-save-files";

export function scnMenuTitleScreen() {
    const { saveFiles, lastLoadedSaveFile, errors } = validateLooks(RpgSaveFiles.check());

    if (!["new", "load", "fromNew", "fromLoad"].includes(Rpg.character.position.checkpointName)) {
        setRpgProgressData(getInitialRpgProgress());
    }

    const lvl = Lvl.MenuTitleScreen();

    scene.stage
        .step(() => {
            scene.camera.mode = "controlled";
            scene.camera.x = Math.floor(playerObj.x / 500) * 500;
        }, StepOrder.BeforeCamera)
        .coro(function* () {
            objText.MediumBold(
                errors.map(error => `(!) ${error}`).join("\n"),
                { tint: 0xff4c4c },
            )
                .at(scene.camera)
                .add(2, 2)
                .zIndexed(ZIndex.Entities)
                .show();
        }, StepOrder.BeforeCamera);

    scene.stage
        .mixin(mxnHudModifiers.mxnHideExperience)
        .mixin(mxnHudModifiers.mxnHideStatus);

    [lvl.UiTitleIgua, lvl.UiTitleRpg, lvl.UiTitleTwo, lvl.UiTitleDemo]
        .forEach(obj => obj.mixin(mxnBoilPivot));

    [lvl.NewBackDoor, lvl.LoadBackDoor]
        .forEach(obj => obj.mixin(mxnLabeled, "Back"));

    lvl.ContinueDoor
        .mixin(mxnLabeled, "Continue")
        .objDoor.locked = lastLoadedSaveFile === null;

    lvl.NewDoor
        .mixin(mxnLabeled, "New");

    lvl.LoadDoor
        .mixin(mxnLabeled, "Load")
        .objDoor.locked = !saveFiles.some(Boolean);

    [lvl.NewFile0Door, lvl.NewFile1Door, lvl.NewFile2Door]
        .forEach((obj, i) => obj.mixin(mxnLabeled, "File " + (i + 1)).objDoor.locked = Boolean(saveFiles[i]));

    [lvl.LoadFile0Door, lvl.LoadFile1Door, lvl.LoadFile2Door]
        .forEach((obj, i) => obj.mixin(mxnLabeled, "File " + (i + 1)).objDoor.locked = !Boolean(saveFiles[i]));
}

interface ValidateLooksResult {
    lastLoadedSaveFile: RpgSaveFiles.check.Model["saveFiles"][number];
    saveFiles: RpgSaveFiles.check.Model["saveFiles"];
    errors: string[];
}

function validateLooks(check: RpgSaveFiles.check.Model): ValidateLooksResult {
    const errors = new Array<string>();
    const validatedSaveFiles = check.saveFiles.map((file, i) => {
        if (!file) {
            return file;
        }

        try {
            objIguanaPuppet(file.looks);
            return file;
        }
        catch (e) {
            Logger.logUnexpectedError("validateLooks", e as Error);
            errors.push(`File ${i + 1} is corrupted.`);
        }

        return null;
    });

    return {
        lastLoadedSaveFile: validatedSaveFiles[check.lastLoadedIndex!] ?? null,
        saveFiles: validatedSaveFiles,
        errors,
    };
}

function mxnLabeled(obj: Container & MxnSpeaker, label: string) {
    return obj
        .coro(function* () {
            obj.speaker.name = "\"" + label + "\" " + obj.speaker.name;
            const b = obj.getBounds();
            const offset = vnew(b.getCenter().x + 1, b.y - 1).add(obj, -1);

            const textObj = objText.MediumIrregular(label)
                .anchored(0.5, 1)
                .zIndexed(ZIndex.Entities)
                .step(self => self.at(obj).add(offset))
                .show();

            obj
                .mixin(mxnHasHead, { obj: textObj });
        });
}
