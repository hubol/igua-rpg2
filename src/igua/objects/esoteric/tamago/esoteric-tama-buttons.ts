export class EsotericTamaButtons {
    private readonly _pressedIds = new Set<EsotericTamaButtons.Id>();

    isPressed(id: EsotericTamaButtons.Id) {
        return this._pressedIds.has(id);
    }

    press(id: EsotericTamaButtons.Id) {
        this._pressedIds.add(id);
    }

    clear() {
        this._pressedIds.clear();
    }
}

export namespace EsotericTamaButtons {
    export type Id = "a" | "b" | "c";
    export type Public = Pick<EsotericTamaButtons, "isPressed">;
}
