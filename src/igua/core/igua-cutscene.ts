import { Container, DisplayObject } from "pixi.js";
import { Logger } from "../../lib/game-engine/logger";
import { Coro } from "../../lib/game-engine/routines/coro";
import { EscapeTickerAndExecute } from "../../lib/game-engine/asshat-ticker";
import { NpcPersonaInternalName } from "../data/data-npc-personas";
import { Null } from "../../lib/types/null";
import { scene } from "../globals";

type CutsceneFn = () => Coro.Type;

function getDefaultCutsceneAttributes() {
    return {
        speaker: Null<DisplayObject>(),
        letterbox: true,
        npcNamesSpoken: new Set<NpcPersonaInternalName>(),
        requiredScene: Null(scene),
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

    private _enqueuedCutsceneRunnerObjs: DisplayObject[] = [];

    play(fn: CutsceneFn, attributes?: Partial<CutsceneAttributes>) {
        const dequeueCutscene = () => this._enqueuedCutsceneRunnerObjs.shift()?.show(this._container);

        const cutsceneRunnerObj = new Container().named("Cutscene Runner")
            .merge({ fn, attributes: { ...getDefaultCutsceneAttributes(), ...attributes } })
            .coro(function* (self) {
                // TODO This will not be sufficient if the sceneStack has length > 1. Need to rework for that case!
                if (self.attributes.requiredScene !== null && scene !== self.attributes.requiredScene) {
                    // TODO Should be logged that the cutscene was aborted!
                    return;
                }

                try {
                    yield* fn();
                }
                catch (e) {
                    if (e instanceof EscapeTickerAndExecute) {
                        throw e;
                    }

                    Logger.logUnexpectedError("IguaCutscene.runner", e as Error);
                }
                finally {
                    if (!self.destroyed) {
                        self.destroy();
                    }

                    dequeueCutscene();
                }
            });

        if (this._container.children.length === 0) {
            cutsceneRunnerObj.show(this._container);
        }
        else {
            // TODO should be logged that a cutscene was enqueued!
            this._enqueuedCutsceneRunnerObjs.push(cutsceneRunnerObj);
        }
    }

    get isPlaying() {
        return this._container.children.length > 0;
    }

    get current(): { attributes: CutsceneAttributes } | null {
        return this._container.children.last ?? null;
    }
}
