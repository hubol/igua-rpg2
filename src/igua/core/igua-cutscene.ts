import { Container } from "pixi.js";
import { CancellationError } from "../../lib/promise/cancellation-token";

type CutsceneFn = () => Promise<unknown>;

export class IguaCutscene {
    private readonly _container: Container;

    constructor(root: Container) {
        this._container = new Container().named('IguaCutscene').show(root);
    }

    play(fn: CutsceneFn) {
        if (this.isPlaying) {
            // TODO warn? abort? error?
        }
        
        const runner = new Container().named('Cutscene Runner')
            .async(async () => {
                try {
                    await fn();
                }
                catch (e) {
                    if (!(e instanceof CancellationError))
                        console.error('Unexpected error while running cutscene', e);
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
