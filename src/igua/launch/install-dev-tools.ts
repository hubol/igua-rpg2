import { createDebugKey } from "../../lib/game-engine/debug/debug-key";
import { createDebugPanel } from "../../lib/game-engine/debug/debug-panel";
import { elDebugColors } from "../../lib/game-engine/elements/el-debug-colors";
import { Toast } from "../../lib/game-engine/toast";
import { IguaAudio } from "../core/igua-audio";
import { SceneLibrary } from "../core/scene/scene-library";
import { DevStartScene } from "../dev/dev-start-scene";
import { layers, sceneStack } from "../globals";

export function installDevTools() {
    // @ts-expect-error
    const el = document.body.appendChild(createDebugPanel(layers._root));
    createDebugKey("KeyM", "globalMute", (x, keydown) => {
        IguaAudio.globalGain = x ? 0 : 1;
        if (keydown) {
            Toast.info(x ? "Muted" : "Unmuted", "^_^");
        }
    });

    const sceneSwitcherEl = createSceneSwitcherEl();
    el.prepend(sceneSwitcherEl);

    document.body.appendChild(elDebugColors());
}

function createSceneSwitcherEl() {
    const selectEl = document.createElement("select");

    const noChoiceString = "no-choice";

    let expectClickEvent = false;

    selectEl.addEventListener("change", () => {
        expectClickEvent = true;
        selectEl.blur();
    });

    selectEl.addEventListener("click", () => {
        if (expectClickEvent) {
            if (selectEl.value !== noChoiceString) {
                onChange(selectEl.value);
            }
            expectClickEvent = false;
        }
    });

    selectEl.addEventListener("keyup", (e) => {
        if (e.code === "Escape") {
            selectEl.blur();
        }
    });

    const onChange = (sceneName: string) => {
        sceneStack.replace(SceneLibrary.findByName(sceneName), { useGameplay: false });
        DevStartScene.name = sceneName;
    };

    const noChoiceOptionEl = document.createElement("option");
    noChoiceOptionEl.textContent = "<Choose Scene>";
    noChoiceOptionEl.value = noChoiceString;
    selectEl.appendChild(noChoiceOptionEl);

    for (const name of SceneLibrary.getNames()) {
        const optionEl = document.createElement("option");
        optionEl.textContent = name;
        optionEl.value = name;
        selectEl.appendChild(optionEl);
    }

    return selectEl;
}
