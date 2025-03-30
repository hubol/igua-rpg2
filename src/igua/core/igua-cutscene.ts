import { Container, DisplayObject } from "pixi.js";
import { EscapeTickerAndExecute } from "../../lib/game-engine/asshat-ticker";
import { Logger } from "../../lib/game-engine/logger";
import { Coro } from "../../lib/game-engine/routines/coro";
import { sleepf } from "../../lib/game-engine/routines/sleep";
import { container } from "../../lib/pixi/container";
import { Empty } from "../../lib/types/empty";
import { Null } from "../../lib/types/null";
import { NpcPersonaInternalName } from "../data/data-npc-personas";
import { clear } from "../drama/show";
import { scene, sceneStack } from "../globals";

type CutsceneFn = () => Coro.Type;

function getDefaultCutsceneAttributes() {
    return {
        speaker: Null<DisplayObject>(),
        letterbox: true,
        computerObjsSpoken: new Set<DisplayObject>(),
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

interface PlayRequest {
    fn: CutsceneFn;
    attributes: CutsceneAttributes;
}

function checkPlayRequestRequirements(request: PlayRequest) {
    const { requiredScene } = request.attributes;
    if (requiredScene === null) {
        return "requirements_met";
    }
    else if (requiredScene === scene) {
        return "requirements_met";
    }

    if (sceneStack.length <= 1) {
        return "requirements_cannot_be_met";
    }

    return sceneStack.asArray().includes(requiredScene)
        ? "requirements_may_be_met_in_future"
        : "requirements_cannot_be_met";
}

export class IguaCutscene {
    private readonly runnerObj: ObjCutsceneRunner;

    constructor(root: Container) {
        this.runnerObj = objCutsceneRunner().named("IguaCutscene").show(root);
    }

    play(fn: CutsceneFn, partialAttributes?: ConfiguredCutsceneAttributes) {
        // TODO deep merge
        const { camera: defaultCameraAttributes, ...defaultAttributes } = getDefaultCutsceneAttributes();
        const { camera: configuredCameraAttributes, ...configuredAttributes } = partialAttributes ?? {};

        const attributes = {
            ...defaultAttributes,
            ...configuredAttributes,
            camera: {
                ...defaultCameraAttributes,
                ...configuredCameraAttributes,
            },
        };

        this.runnerObj.state.pendingPlayRequests.push({ fn, attributes });
    }

    get isPlaying() {
        return this.runnerObj.state.currentlyFulfillingPlayRequest !== null;
    }

    get current(): { attributes: CutsceneAttributes } | null {
        return this.runnerObj.state.currentlyFulfillingPlayRequest;
    }

    setCurrentSpeaker(speakerObj: DisplayObject) {
        if (this.current) {
            this.current.attributes.speaker = speakerObj;
        }
    }
}

function objCutsceneRunner() {
    const state = {
        currentlyFulfillingPlayRequest: Null<PlayRequest>(),
        pendingPlayRequests: Empty<PlayRequest>(),
    };

    const maybeSetCurrentlyFulfillingPlayRequest = () => {
        if (state.currentlyFulfillingPlayRequest) {
            return;
        }

        for (let i = 0; i < state.pendingPlayRequests.length;) {
            const request = state.pendingPlayRequests[i];
            const requirements = checkPlayRequestRequirements(request);

            if (requirements === "requirements_cannot_be_met") {
                Logger.logInfo(
                    "objCutsceneRunner.maybeSetCurrentlyFulfillingPlayRequest",
                    "PlayRequest cannot be fulfilled, as the requirements cannot be met",
                    request,
                );
                state.pendingPlayRequests.splice(i);
                continue;
            }
            else if (requirements === "requirements_met") {
                Logger.logInfo(
                    "objCutsceneRunner.maybeSetCurrentlyFulfillingPlayRequest",
                    "Begin fulfilling PlayRequest",
                    request,
                );
                state.currentlyFulfillingPlayRequest = request;
                state.pendingPlayRequests.splice(i);
                break;
            }

            i++;
        }
    };

    return container()
        .merge({ state })
        .step(maybeSetCurrentlyFulfillingPlayRequest)
        .coro(function* () {
            while (true) {
                yield () => state.currentlyFulfillingPlayRequest !== null;

                const { fn, attributes } = state.currentlyFulfillingPlayRequest!;

                try {
                    if (attributes.camera.start === "pan-to-speaker" && attributes.speaker) {
                        yield scene.camera.auto.panToSubject(attributes.speaker);
                    }
                    yield* fn();
                    clear();
                    if (
                        attributes.camera.end === "delay-if-camera-moved-set-mode-follow-player"
                        && !scene.camera.auto.isFramingPlayer
                        && scene === attributes.requiredScene
                    ) {
                        yield sleepf(22);
                    }
                    // TODO unused so far
                    if (attributes.camera.end === "pan-to-player") {
                        yield scene.camera.auto.panToPlayer();
                    }
                    if (attributes.camera.end !== "none") {
                        scene.camera.mode = "follow_player";
                    }
                }
                catch (e) {
                    if (e instanceof EscapeTickerAndExecute) {
                        throw e;
                    }

                    Logger.logUnexpectedError("objCutsceneRunner.coro", e as Error);
                }
                finally {
                    Logger.logInfo("objCutsceneRunner.coro", "Cutscene completed");

                    state.currentlyFulfillingPlayRequest = null;
                    maybeSetCurrentlyFulfillingPlayRequest();

                    if (!state.currentlyFulfillingPlayRequest) {
                        Logger.logInfo(
                            "objCutsceneRunner.coro",
                            "No pending PlayRequests, or no pending PlayRequests have requirements met",
                            { pendingPlayRequestsLength: state.pendingPlayRequests.length },
                        );
                    }
                }
            }
        });
}

type ObjCutsceneRunner = ReturnType<typeof objCutsceneRunner>;
