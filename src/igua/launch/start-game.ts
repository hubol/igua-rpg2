import { Environment } from "../../lib/environment";
import { VectorSimple } from "../../lib/math/vector-type";
import { SceneLibrary } from "../core/scene/scene-library";
import { DevGameStartConfig } from "../dev/dev-game-start-config";
import { layers, sceneStack, startAnimator } from "../globals";
import { playerObj } from "../objects/obj-player";
import { Rpg } from "../rpg/rpg";
import { setRpgProgressData } from "../rpg/rpg";
import { RpgProgressData } from "../rpg/rpg-progress";

export function startGame() {
    const config = getConfig();

    if (config.progress) {
        setRpgProgressData(config.progress);
        Rpg.character.status.health = Rpg.character.status.healthMax;
    }

    if (Environment.isDev) {
        executeDevRpg();
    }

    Rpg.character.position.sceneName = config.sceneName;

    layers.recreateOverlay();

    sceneStack.push(SceneLibrary.findByName(config.sceneName), { useGameplay: false });
    startAnimator();

    if (config.player.position && playerObj) {
        playerObj.at(config.player.position);
    }
}

function executeDevRpg() {
    const { default: devModules } = require(`../dev/ignored/**/*.ts`);
    (devModules as Array<Record<string, unknown>>)
        .find((module): module is { devRpg: () => void } =>
            Boolean(module.devRpg && typeof module.devRpg === "function")
        )
        ?.devRpg?.();
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
    progress: RpgProgressData | null;
    player: {
        position: VectorSimple | null;
    };
}
