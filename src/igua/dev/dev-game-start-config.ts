import { LocalStorageEntry } from "../../lib/browser/local-storage-entry";
import { Toast } from "../../lib/game-engine/toast";
import { VectorSimple } from "../../lib/math/vector-type";
import { deepUpgradeVerbose } from "../../lib/object/deep-upgrade-verbose";
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

            const { upgradedObject: upgradedProgress, rawMessages } = deepUpgradeVerbose(config.progress, RpgProgress);
            if (rawMessages.length) {
                Toast.info(
                    "Transient dev progress upgraded",
                    `<dl>${
                        rawMessages.map(({ path, message }) =>
                            `<dt><pre>${path.join(".")}</pre></dt><dd>${message}</dd>`
                        ).join("")
                    }</dl>`,
                    5000,
                );
            }

            return {
                sceneName: config.progress.character.position.sceneName,
                progress: upgradedProgress,
                player: config.player,
            };
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
