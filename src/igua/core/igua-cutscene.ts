import { Container, DisplayObject } from "pixi.js";
import { EscapeTickerAndExecute } from "../../lib/game-engine/asshat-ticker";
import { Logger } from "../../lib/game-engine/logger";
import { Coro } from "../../lib/game-engine/routines/coro";
import { sleepf } from "../../lib/game-engine/routines/sleep";
import { Null } from "../../lib/types/null";
import { NpcPersonaInternalName } from "../data/data-npc-personas";
import { clear } from "../drama/show";
import { scene } from "../globals";

type CutsceneFn = () => Coro.Type;

function getDefaultCutsceneAttributes() {
    return {
        speaker: Null<DisplayObject>(),
        letterbox: true,
        npcNamesSpoken: new Set<NpcPersonaInternalName>(),
        requiredScene: Null(scene),
        camera: {
            start: "none" as "none" | "pan-to-speaker",
            end: "delay-if-camera-moved-set-mode-follow-player" as
                | "none"
                | "delay-if-camera-moved-set-mode-follow-player"
                | "pan-to-player",
        },
    };
}

type CutsceneAttributes = ReturnType<typeof getDefaultCutsceneAttributes>;
type ConfiguredCutsceneAttributes = Partial<
    Omit<CutsceneAttributes, "camera"> & { camera: Partial<CutsceneAttributes["camera"]> }
>;

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

    play(fn: CutsceneFn, attributes?: ConfiguredCutsceneAttributes) {
        const dequeueCutscene = () => this._enqueuedCutsceneRunnerObjs.shift()?.show(this._container);

        // TODO deep merge
        const { camera: defaultCameraAttributes, ...defaultAttributes } = getDefaultCutsceneAttributes();
        const { camera: configuredCameraAttributes, ...configuredAttributes } = attributes ?? {};

        const mergedAttributes = {
            ...defaultAttributes,
            ...configuredAttributes,
            camera: {
                ...defaultCameraAttributes,
                ...configuredCameraAttributes,
            },
        };

        const cutsceneRunnerObj = new Container().named("Cutscene Runner")
            .merge({ fn, attributes: mergedAttributes })
            .coro(function* (self) {
                // TODO This will not be sufficient if the sceneStack has length > 1. Need to rework for that case!
                if (self.attributes.requiredScene !== null && scene !== self.attributes.requiredScene) {
                    // TODO Should be logged that the cutscene was aborted!
                    return;
                }

                try {
                    if (self.attributes.camera.start === "pan-to-speaker" && self.attributes.speaker) {
                        yield scene.camera.auto.panToSubject(self.attributes.speaker);
                    }
                    yield* fn();
                    clear();
                    if (
                        self.attributes.camera.end === "delay-if-camera-moved-set-mode-follow-player"
                        && !scene.camera.auto.isFramingPlayer
                        && scene === self.attributes.requiredScene
                    ) {
                        yield sleepf(22);
                    }
                    // TODO unused so far
                    if (self.attributes.camera.end === "pan-to-player") {
                        yield scene.camera.auto.panToPlayer();
                    }
                    if (self.attributes.camera.end !== "none") {
                        scene.camera.mode = "follow-player";
                    }
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

    setCurrentSpeaker(speakerObj: DisplayObject) {
        if (this.current) {
            this.current.attributes.speaker = speakerObj;
        }
    }
}
