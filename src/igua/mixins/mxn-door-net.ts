import { objText } from "../../assets/fonts";
import { Coro } from "../../lib/game-engine/routines/coro";
import { sleep } from "../../lib/game-engine/routines/sleep";
import { container } from "../../lib/pixi/container";
import { SceneLibrary } from "../core/scene/scene-library";
import { DramaMisc } from "../drama/drama-misc";
import { show } from "../drama/show";
import { scene } from "../globals";
import { IguaClient } from "../net/igua-client";
import { ObjDoor } from "../objects/obj-door";
import { playerObj } from "../objects/obj-player";
import { mxnBoilPivot } from "./mxn-boil-pivot";
import { mxnBoilSeed } from "./mxn-boil-seed";

export function mxnDoorNet(doorObj: ObjDoor) {
    doorObj.speaker.name = "Online Door";

    doorObj.objDoor.locked = true;
    doorObj.objDoor.lockedCutscene = function* () {
        yield* show("The door radiates with online energy.");
        const fxConnectingObj = objFxConnecting()
            .at(doorObj)
            .add(18, -3)
            .show();
        const client = IguaClient.create({ roomId: doorObj.objDoor.sceneChanger.sceneName });
        yield* Coro.race([
            sleep(10_000),
            () => client.isOnline,
        ]);
        fxConnectingObj.destroy();
        if (!client.isOnline) {
            yield* show("Couldn't go online. Maybe try again later?");
            return;
        }
        doorObj.objDoor.unlock();
        yield sleep(1000);
        yield* DramaMisc.walkToDoor(playerObj, doorObj);
        const scene: (client: IguaClient) => any = SceneLibrary.findByName(doorObj.objDoor.sceneChanger.sceneName);
        doorObj.objDoor.sceneChanger.scene = () => scene(client);
        doorObj.objDoor.changeScene();
    };
}

function objFxConnecting() {
    return container()
        .coro(function* (self) {
            while (true) {
                yield sleep(1000);
                objText.MediumBoldIrregular("Connecting...")
                    .mixin(mxnBoilPivot)
                    .mixin(mxnBoilSeed)
                    .anchored(0.5, 1)
                    .step(self => {
                        self.y -= 1;
                        if (self.y < scene.camera.y) {
                            self.destroy();
                        }
                    })
                    .coro(function* (self) {
                        self.alpha = 0.5;
                        yield sleep(125);
                        self.alpha = 1;
                    })
                    .at(self)
                    .show();
            }
        });
}
