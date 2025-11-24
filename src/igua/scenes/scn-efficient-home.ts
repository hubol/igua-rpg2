import { Lvl } from "../../assets/generated/levels/generated-level-data";
import { scene } from "../globals";
import { playerObj } from "../objects/obj-player";

export function scnEfficientHome() {
    Lvl.EfficientHome();
    scene.camera.at(Math.floor(playerObj.x / 512) * 512, Math.floor(playerObj.y / 288) * 288);
    scene.camera.mode = "controlled";
}
