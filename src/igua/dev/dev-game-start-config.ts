import { LocalStorageEntry } from "../../lib/browser/local-storage-entry";
import { VectorSimple } from "../../lib/math/vector-type";
import { GameStartConfig } from "../launch/start-game";
import { playerObj } from "../objects/obj-player";
import { RpgProgress } from "../rpg/rpg-progress";
import { DevUrl } from "./dev-url";

export const DevGameStartConfig = {
    recordTransientGameStartConfig() {
        if (transientGameStartConfig.value) {
            console.log(`Not recording transient game start config, as it already exists`);
            return;
        }

        const playerPosition = playerObj?.position ?? null;

        transientGameStartConfig.value = {
            progress: RpgProgress,
            player: { position: playerPosition ? playerPosition.vcpy() : null },
        };
    },
    setExplicitSceneName(name: string) {
        DevUrl.sceneName = name;
    },
    get(): GameStartConfig | null {
        if (transientGameStartConfig.value) {
            const config = transientGameStartConfig.value;
            transientGameStartConfig.clear();
            return { sceneName: config.progress.character.position.sceneName, ...config };
        }

        if (DevUrl.sceneName) {
            return { sceneName: DevUrl.sceneName, progress: null, player: { position: null } };
        }

        return null;
    },
};

interface TransientGameStartConfig {
    progress: typeof RpgProgress;
    player: {
        position: VectorSimple | null;
    };
}

const transientGameStartConfig = new LocalStorageEntry<TransientGameStartConfig>("dev__transientGameStartConfig");
