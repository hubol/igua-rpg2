import { Container, DisplayObject } from "pixi.js";
import { ErrorReporter } from "../../lib/game-engine/error-reporter";
import { Coro } from "../../lib/game-engine/routines/coro";
import { EscapeTickerAndExecute } from "../../lib/game-engine/asshat-ticker";
import { NpcPersonaInternalName } from "../data/data-npc-personas";
import { Null } from "../../lib/types/null";

type CutsceneFn = () => Coro.Type;

function getDefaultCutsceneAttributes() {
    return {
        speaker: Null<DisplayObject>(),
        letterbox: true,
        npcNamesSpoken: new Set<NpcPersonaInternalName>(),
    };
}

type CutsceneAttributes = ReturnType<typeof getDefaultCutsceneAttributes>;

export class IguaCutscene {
    private readonly _container: ReturnType<typeof IguaCutscene._objCutsceneContainer>;

    constructor(root: Container) {
        this._container = IguaCutscene._objCutsceneContainer().named("IguaCutscene").show(root);
    }

    private static _objCutsceneContainer() {
        return new Container<DisplayObject & { fn: CutsceneFn; attributes: CutsceneAttributes }>()
            .merge({ sinceCutsceneStepsCount: 0 })
            .step(self => {
                if (self.children.length) {
                    self.sinceCutsceneStepsCount = 0;
                }
                else {
                    self.sinceCutsceneStepsCount++;
                }
            });
    }

    get sinceCutsceneStepsCount() {
        return this._container.sinceCutsceneStepsCount;
    }

    play(fn: CutsceneFn, attributes?: Partial<CutsceneAttributes>) {
        if (this.isPlaying) {
            const context = {
                requestedCutsceneFn: fn,
                currentCutsceneFns: this._container.children.map(({ fn }) => fn),
            };
            ErrorReporter.reportContractViolationError(
                "IguaCutscene.play",
                new Error("Started cutscene while another was playing"),
                context,
            );
        }

        new Container().named("Cutscene Runner")
            .merge({ fn, attributes: { ...getDefaultCutsceneAttributes(), ...attributes } })
            .coro(function* (self) {
                try {
                    yield* fn();
                }
                catch (e) {
                    if (e instanceof EscapeTickerAndExecute) {
                        throw e;
                    }

                    ErrorReporter.reportUnexpectedError("IguaCutscene.runner", e as Error);
                }
                finally {
                    if (!self.destroyed) {
                        self.destroy();
                    }
                }
            })
            .show(this._container);
    }

    get isPlaying() {
        return this._container.children.length > 0;
    }

    get current(): { attributes: CutsceneAttributes } | null {
        return this._container.children.last ?? null;
    }
}
