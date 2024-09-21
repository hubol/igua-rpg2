import { Container, DisplayObject } from "pixi.js";
import { CancellationError } from "../../lib/promise/cancellation-token";
import { ErrorReporter } from "../../lib/game-engine/error-reporter";
import { Coro } from "../../lib/game-engine/routines/coro";

type CutsceneFn = () => Coro.Type;

export class IguaCutscene {
    private readonly _container: ReturnType<typeof IguaCutscene._objCutsceneContainer>;

    constructor(root: Container) {
        this._container = IguaCutscene._objCutsceneContainer().named("IguaCutscene").show(root);
    }

    private static _objCutsceneContainer() {
        return new Container<DisplayObject & { fn: CutsceneFn }>();
    }

    play(fn: CutsceneFn) {
        if (this.isPlaying) {
            const context = {
                requestedCutsceneFn: fn,
                currentCutsceneFns: this._container.children.map(({ fn }) => fn),
            };
            ErrorReporter.reportSubsystemError(
                "IguaCutscene.play",
                "Started cutscene while another was playing",
                context,
            );
        }

        const runner = new Container().named("Cutscene Runner")
            .merge({ fn })
            .coro(function* () {
                try {
                    yield* fn();
                }
                catch (e) {
                    if (!(e instanceof CancellationError)) {
                        ErrorReporter.reportSubsystemError("IguaCutscene.runner", e);
                    }
                }
                finally {
                    if (!runner.destroyed) {
                        runner.destroy();
                    }
                }
            })
            .show(this._container);
    }

    get isPlaying() {
        return this._container.children.length > 0;
    }
}
