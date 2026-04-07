import { Container, DisplayObject } from "pixi.js";
import { objText } from "../../assets/fonts";
import { Lvl } from "../../assets/generated/levels/generated-level-data";
import { Mzk } from "../../assets/music";
import { Logger } from "../../lib/game-engine/logger";
import { Integer } from "../../lib/math/number-alias-types";
import { vnew } from "../../lib/math/vector-type";
import { Null } from "../../lib/types/null";
import { Jukebox } from "../core/igua-audio";
import { ZIndex } from "../core/scene/z-index";
import { ask } from "../drama/show";
import { layers, scene, sceneStack } from "../globals";
import { IguanaLooks } from "../iguana/looks";
import { objIguanaPuppet } from "../iguana/obj-iguana-puppet";
import { mxnBoilPivot } from "../mixins/mxn-boil-pivot";
import { mxnHasHead } from "../mixins/mxn-has-head";
import { mxnHudModifiers } from "../mixins/mxn-hud-modifiers";
import { CtxInteract } from "../mixins/mxn-interact";
import { MxnSpeaker } from "../mixins/mxn-speaker";
import { ObjDoor } from "../objects/obj-door";
import { ObjIguanaLocomotive, objIguanaLocomotive } from "../objects/obj-iguana-locomotive";
import { playerObj } from "../objects/obj-player";
import { StepOrder } from "../objects/step-order";
import { Rpg, setRpgProgressData } from "../rpg/rpg";
import { getInitialRpgProgress } from "../rpg/rpg-progress";
import { RpgSaveFiles } from "../rpg/rpg-save-files";
import { scnIguanaDesigner } from "./scn-iguana-designer";

export function scnMenuTitleScreen() {
    Jukebox.play(Mzk.FirstSong);
    const { saveFiles, lastLoadedSaveFileIndex, lastLoadedSaveFile, errors } = validateLooks(RpgSaveFiles.check());

    function mxnLoadFile(obj: ObjDoor, fileIndex: Integer | null) {
        obj.objDoor.locked = !saveFiles[fileIndex!];
        obj.objDoor.changeScene = () => {
            const result = RpgSaveFiles.Current.load(fileIndex!);
            layers.recreateOverlay();
            result.changeScene();
        };
        return obj;
    }

    if (!["new", "load", "fromNew", "fromLoad"].includes(Rpg.character.position.checkpointName)) {
        setRpgProgressData(getInitialRpgProgress());
    }

    const defaultLooks = Rpg.character.looks;

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

    [lvl.UiTitleIgua, lvl.UiTitleRpg, lvl.UiTitleTwo, lvl.UiTitleDemo, lvl.UiTitleNew, lvl.UiTitleLoad]
        .forEach(obj => obj.mixin(mxnBoilPivot));

    [lvl.NewBackDoor, lvl.LoadBackDoor]
        .forEach(obj => obj.mixin(mxnLabeled, "Back"));

    lvl.ContinueDoor
        .mixin(mxnLabeled, "Continue")
        .mixin(mxnSetPlayerLooks, lastLoadedSaveFile?.looks ?? defaultLooks)
        .mixin(mxnLoadFile, lastLoadedSaveFileIndex);

    lvl.NewDoor
        .mixin(mxnLabeled, "New");

    lvl.LoadDoor
        .mixin(mxnLabeled, "Load")
        .objDoor.locked = !saveFiles.some(Boolean);

    [lvl.NewFile0Door, lvl.NewFile1Door, lvl.NewFile2Door]
        .forEach((obj, i) => {
            obj.objDoor.locked = Boolean(saveFiles[i]);
            obj.mixin(mxnLabeled, (obj.objDoor.locked ? "Overwrite\n" : "") + "File " + (i + 1));
            obj.objDoor.lockedCutscene = function* () {
                if (yield* ask(`File ${i + 1} will be overridden. Continue?`)) {
                    obj.objDoor.unlock();
                }
            };

            obj.objDoor.changeScene = () => {
                RpgSaveFiles.Current.open(i);
                sceneStack.replace(scnIguanaDesigner, { useGameplay: false });
            };
        });

    [lvl.LoadFile0Door, lvl.LoadFile1Door, lvl.LoadFile2Door]
        .forEach((obj, i) => {
            obj
                .mixin(mxnLabeled, "File " + (i + 1))
                .mixin(mxnLoadFile, i);

            obj.objDoor.locked = !Boolean(saveFiles[i]);
        });

    [
        [lvl.NewFile0Door, lvl.LoadFile0Door],
        [lvl.NewFile1Door, lvl.LoadFile1Door],
        [lvl.NewFile2Door, lvl.LoadFile2Door],
    ]
        .forEach((objs, i) => objs.forEach(obj => obj.mixin(mxnSetPlayerLooks, saveFiles[i]?.looks ?? defaultLooks)));

    {
        let doppelgangerLooks = Rpg.character.looks;
        let doppelgangerIguanaObj = Null<ObjIguanaLocomotive>();

        scene.stage
            .step(() => {
                const looks = CtxInteract.value.highestScoreInteractObj?.is(mxnSetPlayerLooks)
                    ? CtxInteract.value.highestScoreInteractObj.mxnSetPlayerLooks.looks
                    : defaultLooks;
                if (doppelgangerLooks === looks) {
                    return;
                }

                doppelgangerLooks = looks;
                doppelgangerIguanaObj?.destroy();
                if (looks === defaultLooks) {
                    doppelgangerIguanaObj = null;
                    return;
                }

                doppelgangerIguanaObj = objIguanaLocomotive(looks).show();
                doppelgangerLooks = looks;
            })
            .step(() => {
                playerObj.visible = !doppelgangerIguanaObj;
                if (doppelgangerIguanaObj) {
                    doppelgangerIguanaObj.at(playerObj);
                    doppelgangerIguanaObj.speed.at(playerObj.speed);
                    doppelgangerIguanaObj.pedometer = playerObj.pedometer;
                    doppelgangerIguanaObj.facing = playerObj.facing;
                    doppelgangerIguanaObj.ducking = playerObj.ducking;
                }
            });
    }
}

function mxnSetPlayerLooks(obj: DisplayObject, looks: IguanaLooks.Serializable) {
    return obj
        .merge({ mxnSetPlayerLooks: { looks } })
        .track(mxnSetPlayerLooks);
}

interface ValidateLooksResult {
    lastLoadedSaveFileIndex: Integer | null;
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
        lastLoadedSaveFileIndex: validatedSaveFiles[check.lastLoadedIndex!] ? check.lastLoadedIndex! : null,
        lastLoadedSaveFile: validatedSaveFiles[check.lastLoadedIndex!] ?? null,
        saveFiles: validatedSaveFiles,
        errors,
    };
}

function mxnLabeled(obj: Container & MxnSpeaker, label: string) {
    return obj
        .coro(function* () {
            obj.speaker.name = "\"" + label.replaceAll("\n", " ") + "\" " + obj.speaker.name;
            const b = obj.getBounds();
            const offset = vnew(b.getCenter().x + 1, b.y - 1).add(obj, -1);

            const textObj = objText.MediumIrregular(label, { align: "center" })
                .anchored(0.5, 1)
                .zIndexed(ZIndex.Entities)
                .step(self => self.at(obj).add(offset))
                .show();

            obj
                .mixin(mxnHasHead, { obj: textObj });
        });
}
