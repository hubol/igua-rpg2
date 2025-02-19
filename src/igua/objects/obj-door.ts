import { Sprite } from "pixi.js";
import { Tx } from "../../assets/textures";
import { EscapeTickerAndExecute } from "../../lib/game-engine/asshat-ticker";
import { DramaMisc } from "../drama/drama-misc";
import { show } from "../drama/show";
import { Cutscene } from "../globals";
import { mxnInteract } from "../mixins/mxn-interact";
import { SceneChanger } from "../systems/scene-changer";

interface ObjDoorArgs {
    sceneName: string;
    checkpointName: string;
}

export function objDoor({ sceneName, checkpointName }: ObjDoorArgs) {
    let locked = false;

    const sceneChanger = SceneChanger.create({ sceneName, checkpointName });

    const obj = Sprite.from(Tx.Door.NormalOpen)
        .merge({
            get locked() {
                return locked;
            },
            set locked(value) {
                locked = value;
                obj.texture = locked ? Tx.Door.NormalLocked : Tx.Door.NormalOpen;
            },
        })
        .mixin(mxnInteract, () => {
            if (obj.locked) {
                Cutscene.play(() => show("Closed."));
                return;
            }
            if (sceneChanger) {
                throw new EscapeTickerAndExecute(() => {
                    DramaMisc.departRoomViaDoor(null);
                    sceneChanger.changeScene();
                });
            }
        });

    const seed = (sceneName.charCodeAt(sceneName.length - 1) || 0)
        + (checkpointName.charCodeAt(checkpointName.length - 1) || 0);
    if (seed % 2 === 0) {
        obj.flipH();
    }

    return obj;
}
