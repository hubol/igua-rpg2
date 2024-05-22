import { Container, DisplayObject } from "pixi.js";
import { TickerContainer } from "../ticker-container";
import { AsshatTicker } from "../asshat-ticker";
import { createPixiRenderer } from "../pixi-renderer";
import { cyclic } from "../../math/number";

export type LevelDisplayObjectConstructors = Record<string, (...args: any[]) => DisplayObject>;

interface Entity {
    id: number;
    kind: string;
    x: number;
    y: number;
}

enum Update {
    Index,
    Transform,
    Other,
}

export class LevelEditor {
    private _entities: Entity[] = [];

    get entities(): ReadonlyArray<Readonly<Entity>> {
        return this._entities;
    }

    private _displayObjectsTicker = new AsshatTicker()
    private _displayObjects = new TickerContainer(this._displayObjectsTicker, false).named('LevelEditor._displayObjects');

    private _brushKind?: string;
    private _brushContainer = new Container().named('LevelEditor._brushContainer');

    private readonly _entityToDisplayObject = new Map<Entity, DisplayObject>();

    constructor(readonly displayObjectConstructors: LevelDisplayObjectConstructors, readonly root: TickerContainer) {
        // Extremely crude proof of concept!
        document.addEventListener('pointermove', e => {
            this._brushContainer.at(e.clientX, e.clientY);
        })

        document.addEventListener('pointerdown', e => {
            if (this._brushKind)
                this.create(this._brushKind, e.clientX, e.clientY);
        })

        const kinds = Object.keys(displayObjectConstructors);

        // TODO probably won't be wheel in the end
        document.addEventListener('wheel', e => {
            const delta = Math.sign(e.deltaY);
            if (delta === 0)
                return;

            const index = kinds.indexOf(this._brushKind!);
            const nextIndex = cyclic(index + delta, 0, kinds.length);
            this.setBrushKind(kinds[nextIndex]);
        })

        this._displayObjects.show(root);

        this._brushContainer.alpha = 0.5;
        this._brushContainer.show(root);
    }

    setBrushKind(kind: string) {
        const displayObject = this._constructDisplayObject(kind);
        this._brushContainer.removeAllChildren();
        displayObject.show(this._brushContainer);
        this._brushKind = kind;
    }

    create(kind: string, x: number, y: number) {
        // TODO layers
        // TODO scale
        // TODO rotation
        // TODO other properties
        const entity: Entity = {
            id: uuid(),
            kind,
            x,
            y,
        };

        this._entities.push(entity);

        const displayObject = this._constructDisplayObject(kind);
        displayObject.at(x, y).show(this._displayObjects);

        this._entityToDisplayObject.set(entity, displayObject);

        return entity;
    }

    update(entity: Entity, type = Update.Transform) {
        const displayObject = this._entityToDisplayObject.get(entity);
        if (!displayObject)
            throw new Error(`Could not find DisplayObject for Entity ${entity.kind} ${entity.id}`);

        // TODO use type to determine what parts to update
        displayObject.at(entity);
    }

    private _constructDisplayObject(kind: string) {
        const ctor = this.displayObjectConstructors[kind];
        if (!ctor)
            throw new Error(`Could not find DisplayObject constructor for kind ${kind}`);
        return ctor();
    }

    static createRenderer() {
        // TODO definitely doesn't belong here
        document.querySelector('html')!.classList.add('level_editor');

        return createPixiRenderer({
            width: 1920,
            height: 1080,
            eventFeatures: { click: false, globalMove: false, move: false, wheel: false, },
            eventMode: "none",
        });
    }
}

let uuidPrevious = -1;

function uuid() {
    const next = Math.max(Date.now() * 10, uuidPrevious + 1);
    uuidPrevious = next;
    return next;
}