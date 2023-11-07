export abstract class SceneStack<TSceneMeta, TSceneInstance> {

    protected readonly scenes: TSceneInstance[] = [];

    protected abstract convert<T>(populateSceneFn: () => T, meta: TSceneMeta): TSceneInstance & { populateScene(): T };

    protected abstract dispose(scene: TSceneInstance): void;

    protected abstract onScenesModified(): void;

    push<T>(populateSceneFn: () => T, meta: TSceneMeta) {
        const scene = this.convert(populateSceneFn, meta);
        this.scenes.push(scene);
        this.onScenesModified();
        return scene.populateScene();
    }

    pop() {
        const popped = this.scenes.pop();
        if (popped)
            this.dispose(popped);
        this.onScenesModified();
    }

    replace<T>(populateSceneFn: () => T, meta: TSceneMeta) {
        while (this.scenes.length > 0)
            this.pop();
        return this.push(populateSceneFn, meta);
    }

    toArray() {
        return [...this.scenes];
    }

    get length() {
        return this.scenes.length;
    }
}
