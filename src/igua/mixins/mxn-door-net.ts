import { Coro } from "../../lib/game-engine/routines/coro";
import { sleep } from "../../lib/game-engine/routines/sleep";
import { SceneLibrary } from "../core/scene/scene-library";
import { show } from "../drama/show";
import { IguaClient } from "../net/igua-client";
import { ObjDoor } from "../objects/obj-door";

export function mxnDoorNet(doorObj: ObjDoor) {
    doorObj.objDoor.locked = true;
    doorObj.objDoor.lockedCutscene = function* () {
        yield* show("The door radiates with online energy.");
        const client = IguaClient.create({ roomId: doorObj.objDoor.sceneChanger.sceneName });
        yield* Coro.race([
            sleep(10_000),
            () => client.isOnline,
        ]);
        if (!client.isOnline) {
            yield* show("...But you are offline.");
            return;
        }
        doorObj.objDoor.unlock();
        yield sleep(500);
        const scene: (client: IguaClient) => any = SceneLibrary.findByName(doorObj.objDoor.sceneChanger.sceneName);
        doorObj.objDoor.sceneChanger.scene = () => scene(client);
        doorObj.objDoor.changeScene();
    };
}
