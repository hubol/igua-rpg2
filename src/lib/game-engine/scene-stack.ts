import { Logger } from "./logger";

export abstract class SceneStack<TSceneInstance> {
    protected readonly scenes: TSceneInstance[] = [];

    protected abstract convert<T>(populateSceneFn: () => T): TSceneInstance & { populateScene(): T };

    protected abstract dispose(scene: TSceneInstance): void;

    protected abstract onScenesModified(): void;

    protected fallbackPopulateSceneFn: null | (() => unknown) = null;

    push<T>(populateSceneFn: () => T): T {
        const scenesLength = this.scenes.length;

        try {
            const scene = this.convert(populateSceneFn);
            this.scenes.push(scene);
            this.onScenesModified();
            return scene.populateScene();
        }
        catch (e) {
            const isFallback = populateSceneFn === this.fallbackPopulateSceneFn;
            Logger.logUnexpectedError("SceneStack", e as Error, {
                populateSceneFn,
                isFallback,
            });
            while (this.scenes.length > scenesLength) {
                this.pop();
            }

            if (this.fallbackPopulateSceneFn && !isFallback) {
                return this.push(this.fallbackPopulateSceneFn) as T;
            }

            return null as T;
        }
    }

    pop() {
        const popped = this.scenes.pop();
        if (popped) {
            this.dispose(popped);
        }
        this.onScenesModified();
    }

    replace<T>(populateSceneFn: () => T) {
        while (this.scenes.length > 0) {
            this.pop();
        }
        return this.push(populateSceneFn);
    }

    asArray(): ReadonlyArray<TSceneInstance> {
        return this.scenes;
    }

    get length() {
        return this.scenes.length;
    }

    get top() {
        return this.scenes.last;
    }

    get locals() {
        const scene = this.top as { __locals__: Record<string, any> } | undefined;

        if (!scene) {
            throw new Error(`Attempting to access SceneStack.locals when SceneStack.scenes is empty!`);
        }

        let record = scene["__locals__"];
        if (!record) {
            record = {};
            scene["__locals__"] = record;
        }

        return record;
    }
}
