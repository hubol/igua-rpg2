import { Sprite } from "pixi.js";
import { Tx } from "../../assets/textures";
import { mxnInteract } from "../mixins/mxn-interact";
import { SceneLibrary } from "../core/scene/scene-library";
import { ErrorReporter } from "../../lib/game-engine/error-reporter";
import { EscapeTickerAndExecute } from "../../lib/game-engine/asshat-ticker";
import { Cutscene, sceneStack } from "../globals";
import { show } from "../cutscene/show";
import { RpgProgress } from "../rpg/rpg-progress";

interface ObjDoorArgs {
    sceneName: string;
    checkpointName: string;
}

export function objDoor({ sceneName, checkpointName }: ObjDoorArgs) {
    let locked = false;

    const scene = SceneLibrary.maybeFindByName(sceneName);
    if (!scene)
        ErrorReporter.reportSubsystemError('objDoor', `Scene with name "${sceneName}" does not exist!`);

    const obj = Sprite.from(Tx.OpenDoor)
        .merge({
            get locked() {
                return locked;
            },
            set locked(value) {
                locked = value;
                obj.texture = locked ? Tx.LockedDoor : Tx.OpenDoor;
            }
        })
        .mixin(mxnInteract, () => {
            if (obj.locked) {
                Cutscene.play(() => show("Closed."));
                return;
            }
            if (scene)
                throw new EscapeTickerAndExecute(() => {
                    // TODO this all really needs to be encapsulated somewhere
                    RpgProgress.character.position.sceneName = sceneName;
                    RpgProgress.character.position.checkpointName = checkpointName;
                    sceneStack.replace(scene, { useGameplay: true })
                });
        });

    return obj;
}