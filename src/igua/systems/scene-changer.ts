import { Logger } from "../../lib/game-engine/logger";
import { SceneLibrary } from "../core/scene/scene-library";
import { sceneStack } from "../globals";
import { playerObj } from "../objects/obj-player";
import { Rpg } from "../rpg/rpg";

interface CreateArgs {
    sceneName: string;
    checkpointName: string;
}

export class SceneChanger {
    private constructor(
        private readonly _scene: () => unknown,
        private readonly _sceneName: string,
        private readonly _checkpointName: string,
    ) {
    }

    changeScene() {
        if (playerObj) {
            Rpg.character.position.facing = playerObj.facing > 0 ? 1 : -1;
        }
        Rpg.character.position.sceneName = this._sceneName;
        Rpg.character.position.checkpointName = this._checkpointName;
        sceneStack.replace(this._scene, { useGameplay: true });
    }

    static create({ sceneName, checkpointName }: CreateArgs) {
        const scene = SceneLibrary.maybeFindByName(sceneName);
        if (!scene) {
            Logger.logContractViolationError(
                "SceneChanger.create",
                new Error(`Scene with name "${sceneName}" does not exist!`),
            );

            return null;
        }

        return new SceneChanger(scene, sceneName, checkpointName);
    }
}
