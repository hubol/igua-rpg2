export abstract class SceneStack<TSceneApi, TScene> {

    protected readonly scenes: TScene[] = [];

    protected abstract convert(sceneApi: TSceneApi): TScene;

    protected abstract dispose(scene: TScene): void;

    protected abstract onScenesModified(): void;

    push(sceneApi: TSceneApi) {
        const scene = this.convert(sceneApi);
        this.scenes.push(scene);
        this.onScenesModified();
    }

    pop() {
        const popped = this.scenes.pop();
        if (popped)
            this.dispose(popped);
        this.onScenesModified();
    }

    replace(sceneApi: TSceneApi) {
        while (this.scenes.length > 0)
            this.pop();
        this.push(sceneApi);
    }

    toArray() {
        return [...this.scenes];
    }

    get length() {
        return this.scenes.length;
    }
}
