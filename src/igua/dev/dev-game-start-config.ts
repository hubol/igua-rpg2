import { LocalStorageEntry } from "../../lib/browser/local-storage-entry";
import { Toast } from "../../lib/game-engine/toast";
import { VectorSimple } from "../../lib/math/vector-type";
import { deepUpgradeVerbose } from "../../lib/object/deep-upgrade-verbose";
import { Diff } from "../../lib/object/diff";
import { GameStartConfig } from "../launch/start-game";
import { playerObj } from "../objects/obj-player";
import { devGetRpgProgressData, getInitialRpgProgress, RpgProgressData } from "../rpg/rpg-progress";
import { DevUrl } from "./dev-url";

function formatUpdatedProgressMessage(rawMessages: Array<{ path: string[]; message: string }>) {
    return `<dl>${
        rawMessages.map(({ path, message }) => `<dt><pre>${path.join(".")}</pre></dt><dd>${message}</dd>`).join("")
    }</dl>`;
}

export const DevGameStartConfig = {
    recordTransientGameStartConfig() {
        if (transientGameStartConfig.value) {
            console.log(`Not recording transient game start config, as it already exists`);
            return;
        }

        const playerPosition = playerObj?.position ?? null;

        transientGameStartConfig.value = {
            initialProgress: getInitialRpgProgress(),
            progress: devGetRpgProgressData(),
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

            const { upgradedObject: upgradedProgress, rawMessages: schemaChangedMessages } = deepUpgradeVerbose(
                config.progress,
                devGetRpgProgressData(),
            );
            if (schemaChangedMessages.length) {
                Toast.info(
                    "getInitialProgress() schema change",
                    formatUpdatedProgressMessage(schemaChangedMessages),
                    5000,
                );
            }

            const initialProgressDiff = Diff.detectUpdatedValues(config.initialProgress, getInitialRpgProgress());

            if (initialProgressDiff.length) {
                const results = Diff.apply(upgradedProgress, initialProgressDiff);

                if (results.length) {
                    Toast.info(
                        "getInitialProgress() values updated",
                        formatUpdatedProgressMessage(results),
                        5000,
                    );
                }
                else if (!schemaChangedMessages.length) {
                    Toast.info(
                        "getInitialProgress() values updated",
                        "No changes to transient dev progress detected.",
                        5000,
                    );
                }
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
    initialProgress: RpgProgressData;
    progress: RpgProgressData;
    player: {
        position: VectorSimple | null;
    };
}

const transientGameStartConfig = new LocalStorageEntry<TransientGameStartConfig>("dev__transientGameStartConfig");
