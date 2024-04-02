import { Container, DisplayObject } from "pixi.js";
import { CancellationError } from "../../lib/promise/cancellation-token";
import { ErrorReporter } from "../../lib/game-engine/error-reporter";

type CutsceneFn = () => Promise<unknown>;

export class IguaCutscene {
    private readonly _container: ReturnType<typeof IguaCutscene._objCutsceneContainer>;

    constructor(root: Container) {
        this._container = IguaCutscene._objCutsceneContainer().named('IguaCutscene').show(root);
    }

    private static _objCutsceneContainer() {
        return new Container<DisplayObject & { fn: CutsceneFn }>();
    }

    play(fn: CutsceneFn) {
        if (this.isPlaying) {
            const context = { requestedCutsceneFn: fn, currentCutsceneFns: this._container.children.map(({ fn }) => fn) };
            ErrorReporter.reportSubsystemError('IguaCutscene.play', 'Started cutscene while another was playing', context);
        }
        
        const runner = new Container().named('Cutscene Runner')
            .merge({ fn })
            .async(async () => {
                try {
                    await fn();
                }
                catch (e) {
                    if (!(e instanceof CancellationError))
                        ErrorReporter.reportSubsystemError('IguaCutscene.runner', e);
                }
                finally {
                    if (!runner.destroyed)
                        runner.destroy();
                }
            })
            .show(this._container);
    }

    get isPlaying() {
        return this._container.children.length > 0;
    }
}
