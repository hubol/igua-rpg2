import { Sprite } from "pixi.js";
import { Tx } from "../../assets/textures";
import { mxnInteract } from "../mixins/mxn-interact";
import { SceneLibrary } from "../core/scene/scene-library";
import { ErrorReporter } from "../../lib/game-engine/error-reporter";
import { EscapeTickerAndExecute } from "../../lib/game-engine/asshat-ticker";
import { Cutscene, sceneStack } from "../globals";
import { show } from "../cutscene/show";

export function objDoor(sceneName: string) {
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
                throw new EscapeTickerAndExecute(() => sceneStack.replace(scene, { useGameplay: true }));
        });

    return obj;
}