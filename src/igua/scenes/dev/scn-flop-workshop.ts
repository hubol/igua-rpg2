import { objText } from "../../../assets/fonts";
import { KeyCode } from "../../../lib/browser/key-listener";
import { StorageEntry } from "../../../lib/browser/storage-entry";
import { sleepf } from "../../../lib/game-engine/routines/sleep";
import { Integer } from "../../../lib/math/number-alias-types";
import { container } from "../../../lib/pixi/container";
import { range } from "../../../lib/range";
import { renderer } from "../../current-pixi-renderer";
import { DevKey, scene } from "../../globals";
import { objFigureFlop } from "../../objects/figures/obj-figure-flop";

// This is a simple tool
// For picking seeds for the 999 flop characters

const overrideService = function () {
    const storage = new StorageEntry.Local<Record<Integer, Integer>>("__dev__overrides");

    function get() {
        return storage.value ?? {};
    }

    function getHighest() {
        return Object.values(get()).reduce((prev, next) => next > prev ? next : prev, 998);
    }

    return {
        getAll() {
            const values = get();
            return range(999).map(key => key in values ? values[key] : key);
        },
        getValue(key: Integer) {
            return get()[key] ?? key;
        },
        override(key: Integer) {
            const value = getHighest() + 1;
            const overrides = get();
            overrides[key] = value;
            storage.value = overrides;
        },
    };
}();

export function scnFlopWorkshop() {
    console.log(overrideService.getAll());

    scene.style.backgroundTint = 0x808080;

    scene.stage.coro(function* () {
        const textObj = objText.Large("", { tint: 0 }).anchored(0.5, 0).at(renderer.width / 2, 16).show();

        for (let i = 0; i < 999; i++) {
            const intoTextObj = objText.Medium("Into", { tint: 0 }).anchored(0.5, 0.5).invisible();

            const obj = container(intoTextObj).coro(function* () {
                while (true) {
                    const seed = overrideService.getValue(i);
                    const isOverride = seed !== i;

                    textObj.text = "Index " + i + (isOverride ? ("\nSeed " + seed) : "");

                    const flopObjs = container();

                    const flopObj = objFigureFlop.objFromSeed(seed).show(flopObjs);
                    flopObj.filtered(flopObj.objects.filter);

                    intoTextObj.visible = isOverride;
                    flopObj.x = isOverride ? 64 : 0;
                    if (isOverride) {
                        const previousFlopObj = objFigureFlop.objFromSeed(i).at(-flopObj.x, 0).show(flopObjs);
                        previousFlopObj.filtered(previousFlopObj.objects.filter);
                    }

                    flopObjs.show(obj);

                    yield* coroKeyPress("KeyR");
                    flopObjs.destroy();
                    overrideService.override(i);
                }
            })
                .at(renderer.width / 2, renderer.height / 2)
                .show();

            yield* coroKeyPress("ArrowRight");
            obj.destroy();
        }
    });
}

function* coroKeyPress(code: KeyCode) {
    yield sleepf(1);
    yield () => DevKey.justWentDown(code);
}
