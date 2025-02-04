import { ErrorReporter } from "../../lib/game-engine/error-reporter";
import { SceneLibrary } from "../core/scene/scene-library";
import { sceneStack } from "../globals";
import { playerObj } from "../objects/obj-player";
import { RpgProgress } from "../rpg/rpg-progress";

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
            RpgProgress.character.position.facing = playerObj.facing > 0 ? 1 : -1;
        }
        RpgProgress.character.position.sceneName = this._sceneName;
        RpgProgress.character.position.checkpointName = this._checkpointName;
        sceneStack.replace(this._scene, { useGameplay: true });
    }

    static create({ sceneName, checkpointName }: CreateArgs) {
        const scene = SceneLibrary.maybeFindByName(sceneName);
        if (!scene) {
            ErrorReporter.reportContractViolationError(
                "SceneChanger.create",
                new Error(`Scene with name "${sceneName}" does not exist!`),
            );

            return null;
        }

        return new SceneChanger(scene, sceneName, checkpointName);
    }
}
