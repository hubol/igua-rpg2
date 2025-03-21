import { Environment } from "../../lib/environment";
import { VectorSimple } from "../../lib/math/vector-type";
import { SceneLibrary } from "../core/scene/scene-library";
import { DevGameStartConfig } from "../dev/dev-game-start-config";
import { sceneStack, startAnimator } from "../globals";
import { playerObj } from "../objects/obj-player";
import { RpgPlayer } from "../rpg/rpg-player";
import { RpgProgress, setRpgProgress } from "../rpg/rpg-progress";

export function startGame() {
    const config = getConfig();

    if (config.progress) {
        setRpgProgress(config.progress);
        RpgProgress.character.status.health = RpgPlayer.status.healthMax;
    }

    RpgProgress.character.position.sceneName = config.sceneName;

    sceneStack.push(SceneLibrary.findByName(config.sceneName), { useGameplay: false });
    startAnimator();

    if (config.player.position && playerObj) {
        playerObj.at(config.player.position);
    }
}

function getConfig(): GameStartConfig {
    const devConfig = Environment.isDev ? DevGameStartConfig.get() : null;

    if (devConfig === null) {
        return {
            sceneName: "scnIguanaDesigner",
            player: { position: null },
            progress: null,
        };
    }

    return devConfig;
}

export interface GameStartConfig {
    sceneName: string;
    progress: typeof RpgProgress | null;
    player: {
        position: VectorSimple | null;
    };
}
